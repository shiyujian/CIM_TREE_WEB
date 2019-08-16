import React, { Component } from 'react';
import { Button, Form, Modal, Row, Spin, Input, Select, Notification } from 'antd';
import L from 'leaflet';
import './TreeAccept.less';
import {
    computeSignedArea,
    getSmallThinNameByThinClassData,
    getWktData,
    getSectionNameBySection,
    getProjectNameBySection,
    getHandleWktData
} from '_platform/gisAuth';
const FormItem = Form.Item;
const Option = Select.Option;

class TreeAccept extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            coordinates: [], // 地图圈选
            polygonData: '', // 圈选地图图层
            treeCorrds: [],
            polygonDataList: [],
            areaAcceptVisible: false,
            UserOptionList: [],
            loading: true,
            selectSectionNo: '',
            selectThinClassNo: '',
            wkt: ''
        };
    }
    componentDidMount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.on('click', this.handleTreeAcceptClickFunction);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.off('click', this.handleTreeAcceptClickFunction);
            await this.handleCloseMeasureMenu();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleTreeAcceptClickFunction = async (e) => {
        const {
            coordinates = []
        } = this.state;
        const {
            map,
            areaEventKey
        } = this.props;
        if (areaEventKey) {
            // 测量面积
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            if (this.state.polygonData) {
                map.removeLayer(this.state.polygonData);
            }
            let polygonData = L.polygon(coordinates, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(map);
            this.setState({
                coordinates,
                polygonData: polygonData
            });
        }
    }

    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            map
        } = this.props;
        const {
            polygonData
        } = this.state;
        // 去除框选地图的面积图层
        if (polygonData) {
            map.removeLayer(polygonData);
        }
        this.setState({
            coordinates: [],
            polygonData: ''
        });
    }

    // 圈选地图后退
    _handleCreateMeasureRetreat = async () => {
        const {
            coordinates
        } = this.state;
        const {
            map
        } = this.props;
        // 计算面积
        if (this.state.polygonData) {
            map.removeLayer(this.state.polygonData);
        }
        coordinates.pop();
        let polygonData = L.polygon(coordinates, {
            color: 'white',
            fillColor: '#93B9F2',
            fillOpacity: 0.2
        }).addTo(map);
        this.setState({
            coordinates,
            polygonData: polygonData
        });
    }
    // 再次增加新的区域
    _handleAddCreateArea = async () => {
        const {
            coordinates,
            polygonData,
            treeCorrds = [],
            polygonDataList = []
        } = this.state;

        treeCorrds.push(coordinates);
        polygonDataList.push(polygonData);

        this.setState({
            treeCorrds,
            polygonDataList,
            coordinates: [],
            polygonData: ''
        });
    }
    // 删除新增的区域
    _handleDeleteCreateArea = async () => {
        const {
            treeCorrds,
            polygonDataList
        } = this.state;
        const {
            map
        } = this.props;
        // 计算面积
        if (this.state.polygonData) {
            await map.removeLayer(this.state.polygonData);
        }
        if (treeCorrds.length > 0 && polygonDataList.length > 0) {
            let coordinates = treeCorrds[treeCorrds.length - 1];
            let polygonData = polygonDataList[treeCorrds.length - 1];
            await treeCorrds.pop();
            await polygonDataList.pop();
            console.log('treeCorrds', treeCorrds);
            console.log('polygonDataList', polygonDataList);

            this.setState({
                treeCorrds,
                polygonDataList,
                coordinates,
                polygonData
            });
        }
    }

    // 计算圈选区域面积
    _handleCreateMeasureOk = async () => {
        const {
            coordinates,
            treeCorrds = []
        } = this.state;
        const {
            areaEventKey,
            supervisorUsersList,
            form: {
                setFieldsValue
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            console.log('supervisorUsersList', supervisorUsersList);
            this.setState({
                areaAcceptVisible: true,
                loading: true
            });
            console.log('coordinates', coordinates);
            console.log('treeCorrds', treeCorrds);
            let wkt = '';
            let regionArea = 0;
            let coords = [];
            let thinAreaNum = 0;
            let thinClassCoords = [];
            if (coordinates.length >= 3) {
                thinAreaNum = thinAreaNum + 1;
                thinClassCoords.push(coordinates);
            }
            if (treeCorrds.length > 0) {
                treeCorrds.map((arr) => {
                    thinAreaNum = thinAreaNum + 1;
                    thinClassCoords.push(arr);
                });
            }
            console.log('thinClassCoords', thinClassCoords);
            if (thinClassCoords.length === 1) {
                coords = thinClassCoords[0];
            } else {
                coords = thinClassCoords;
            }
            if (thinAreaNum > 1) {
                wkt = 'MULTIPOLYGON((';
                coords.map((coord, index) => {
                    let num = computeSignedArea(coord, 1);
                    regionArea = regionArea + num;
                    if (index === 0) {
                        // 获取细班选择坐标wkt
                        wkt = wkt + getWktData(coord);
                    } else {
                        wkt = wkt + ',' + getWktData(coord);
                    }
                });
                wkt = wkt + '))';
            } else {
                wkt = 'POLYGON(';
                // 获取手动框选坐标wkt
                wkt = wkt + getHandleWktData(coords);
                wkt = wkt + ')';
                regionArea = computeSignedArea(coords, 2);
            }

            let UserOptionList = [];
            if (supervisorUsersList && supervisorUsersList instanceof Array && supervisorUsersList.length > 0) {
                supervisorUsersList.map((user) => {
                    if (user && user.id) {
                        UserOptionList.push(
                            <Option
                                title={`${(user.account && user.account.person_name) || ''}(${(user.username) || ''})`}
                                value={user.username}
                                key={user.id}
                            >
                                {`${(user.account && user.account.person_name) || ''}(${(user.username) || ''})`}
                            </Option>
                        );
                    }
                });
            }
            let thinClassTree = [];
            if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 1) {
                thinClassTree = tree.thinClassTree;
            } else if (tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
                thinClassTree = tree.onSiteThinClassTree;
            }
            let thinClassArr = areaEventKey.split('-');
            let selectSectionNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[2];
            let selectThinClassNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            let thinClassName = getSmallThinNameByThinClassData(areaEventKey, thinClassTree);
            let sectionName = getSectionNameBySection(selectSectionNo, thinClassTree);
            let projectName = getProjectNameBySection(selectSectionNo, thinClassTree);

            setFieldsValue({
                Project: projectName,
                Section: sectionName,
                ThinClass: thinClassName,
                Area: regionArea
            });
            this.setState({
                UserOptionList,
                loading: false,
                selectSectionNo,
                selectThinClassNo,
                wkt
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    save = async () => {
        const {
            selectSectionNo,
            selectThinClassNo,
            wkt
        } = this.state;
        const {
            actions: {
                postAreaAccept,
                getForestUserUsername,
                getAreaAcceptByThinClass
            },
            form: {
                validateFields
            },
            areaDataList = {},
            areaEventKey
        } = this.props;
        try {
            validateFields(async (err, values) => {
                console.log('err', err);
                if (!err) {
                    // 查询该细班的面积验收是否已经审核
                    let queryPostData = {
                        section: selectSectionNo,
                        thinclass: selectThinClassNo,
                        page: 1,
                        size: 5
                    };
                    let queryData = await getAreaAcceptByThinClass({}, queryPostData);
                    console.log('queryData', queryData);
                    if (queryData && queryData.content &&
                        queryData.content instanceof Array && queryData.content.length > 0) {
                        Notification.error({
                            message: '该细班已经完成面积验收，请确认后再次提交'
                        });
                        return;
                    }
                    let forestLoginUserData = window.localStorage.getItem('FOREST_LOGIN_USER_DATA');
                    forestLoginUserData = JSON.parse(forestLoginUserData) || {};
                    // 根据院内的用户名获取林总库内用户的ID
                    let userData = await getForestUserUsername({}, {username: values.Supervisor});
                    let supervisorID = '';
                    if (userData && userData.content && userData.content instanceof Array && userData.content.length > 0) {
                        supervisorID = userData.content[0].ID;
                    } else {
                        Notification.error({
                            message: '获取用户信息失败，请重新确认'
                        });
                    }
                    let designArea = 0;
                    if (areaDataList[areaEventKey] && areaDataList[areaEventKey].area) {
                        designArea = areaDataList[areaEventKey].area;
                    }
                    let postData = {
                        Section: selectSectionNo,
                        ThinClass: selectThinClassNo,
                        DesignArea: designArea,
                        ActualArea: values.Area,
                        Creater: forestLoginUserData.ID,
                        Supervisor: supervisorID,
                        Coords: wkt
                    };
                    this.setState({
                        loading: true
                    });
                    let data = await postAreaAccept({}, postData);
                    console.log('data', data);
                    if (data && data.code && data.code === 1) {
                        Notification.success({
                            message: '面积验收提交成功'
                        });
                        this.setState({
                            loading: false
                        });
                        this.handleDeleteModalData();
                        this.handleDeleteMapData();
                    } else {
                        Notification.error({
                            message: '面积验收提交失败'
                        });
                        this.setState({
                            loading: false
                        });
                    }
                }
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    cancel = async () => {
        this.handleDeleteModalData();
        this.handleDeleteMapData();
    }

    handleDeleteModalData = async () => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            Project: undefined,
            Section: undefined,
            ThinClass: undefined,
            Area: undefined,
            Supervisor: undefined
        });
        this.setState({
            UserOptionList: [],
            selectSectionNo: '',
            selectThinClassNo: '',
            wkt: '',
            areaAcceptVisible: false
        });
    }

    handleDeleteMapData = async () => {
        const {
            map
        } = this.props;
        const {
            polygonDataList
        } = this.state;
        if (this.state.polygonData) {
            await map.removeLayer(this.state.polygonData);
        }
        polygonDataList.map(async (polygonLayer) => {
            await map.removeLayer(polygonLayer);
        });
        this.setState({
            treeCorrds: [],
            polygonDataList: [],
            coordinates: [],
            polygonData: ''
        });
    }

    render () {
        const {
            coordinates = [],
            treeCorrds = [],
            areaAcceptVisible,
            UserOptionList = [],
            loading
        } = this.state;
        const {
            areaEventKey,
            form: {
                getFieldDecorator
            }
        } = this.props;
        // 计算面积的确定按钮是否可以点击，如果不形成封闭区域，不能点击
        let createAreaMeasureOkDisplay = false;
        if (coordinates.length <= 2 && treeCorrds.length < 1) {
            createAreaMeasureOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createAreaMeasureBackDisplay = false;
        if (coordinates.length < 1) {
            createAreaMeasureBackDisplay = true;
        }
        // 新增按钮是否可以点击
        let AddCreateAreaDisplay = false;
        if (coordinates.length < 3) {
            AddCreateAreaDisplay = true;
        }
        // 删除按钮是否可以点击
        let deleteCreateAreaDisplay = false;
        if (treeCorrds.length < 1) {
            deleteCreateAreaDisplay = true;
        }

        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <div>
                {
                    areaEventKey
                        ? <div className='TreeAccept-editPolygonLayout'>
                            <div>
                                <Button type='primary' style={{marginRight: 10}}
                                    disabled={createAreaMeasureOkDisplay}
                                    onClick={this._handleCreateMeasureOk.bind(this)}>
                                确定
                                </Button>
                                <Button type='default' style={{marginRight: 10}}
                                    disabled={createAreaMeasureBackDisplay}
                                    onClick={this._handleCreateMeasureRetreat.bind(this)}>
                                上一步
                                </Button>
                                <Button type='danger' style={{marginRight: 10}}
                                    disabled={createAreaMeasureBackDisplay}
                                    onClick={this.handleCloseMeasureMenu.bind(this)}>
                                撤销
                                </Button>
                                <Button type='primary' style={{marginRight: 10}}
                                    disabled={AddCreateAreaDisplay}
                                    onClick={this._handleAddCreateArea.bind(this)}>
                        新增
                                </Button>
                                <Button type='primary' style={{marginRight: 10}}
                                    disabled={deleteCreateAreaDisplay}
                                    onClick={this._handleDeleteCreateArea.bind(this)}>
                        删除
                                </Button>
                            </div>
                        </div> : ''
                }
                <Modal
                    title='面积验收'
                    visible={areaAcceptVisible}
                    width='700px'
                    footer={null}
                    closable={false}
                    maskClosable={false}
                >
                    <Spin spinning={loading}>
                        <Form>
                            <Row>
                                <FormItem {...FormItemLayout} label='项目'>
                                    {
                                        getFieldDecorator('Project', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入项目'
                                                }
                                            ]
                                        })(
                                            <Input readOnly placeholder={'请输入项目'} />
                                        )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem {...FormItemLayout} label='标段'>
                                    {
                                        getFieldDecorator('Section', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入标段'
                                                }
                                            ]
                                        })(
                                            <Input readOnly placeholder={'请输入标段'} />
                                        )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem {...FormItemLayout} label='细班'>
                                    {
                                        getFieldDecorator('ThinClass', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入细班'
                                                }
                                            ]
                                        })(
                                            <Input readOnly placeholder={'请输入细班'} />
                                        )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem {...FormItemLayout} label='面积'>
                                    {
                                        getFieldDecorator('Area', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入面积'
                                                }
                                            ]
                                        })(
                                            <Input readOnly placeholder={'请输入面积'} />
                                        )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem {...FormItemLayout} label='监理审核人'>
                                    {
                                        getFieldDecorator('Supervisor', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择监理审核人'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder={'请选择监理审核人'}>
                                                {UserOptionList}
                                            </Select>
                                        )}
                                </FormItem>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    key='submit'
                                    type='primary'
                                    style={{marginLeft: 30, float: 'right'}}
                                    onClick={this.save.bind(this)}
                                >
                                确定
                                </Button>
                                <Button
                                    key='back'
                                    style={{marginLeft: 30, float: 'right'}}
                                    onClick={this.cancel.bind(this)}>
                                关闭
                                </Button>
                            </Row>
                        </Form>
                    </Spin>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(TreeAccept);

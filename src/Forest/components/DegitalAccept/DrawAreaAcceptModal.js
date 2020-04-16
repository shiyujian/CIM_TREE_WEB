import React, { Component } from 'react';
import {
    Button,
    Form,
    Modal,
    Row,
    Spin,
    Input,
    Select,
    Notification
} from 'antd';
import L from 'leaflet';
import wellknown from 'wellknown';
import './DrawAreaAcceptModal.less';
import {
    computeSignedArea,
    getSmallThinNameByThinClassData,
    getWktData,
    getSectionNameBySection,
    getProjectNameBySection,
    getHandleWktData,
    handlePOLYGONWktData,
    handleMULTIPOLYGONLngLatToLatLng
} from '_platform/gisAuth';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API,
    FOREST_GIS_API
} from '_platform/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from './auth';
import {
    getUser
} from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class DrawAreaAcceptModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 数据测量
            coordinates: [], // 地图圈选
            polygonData: '', // 圈选地图图层
            treeCorrds: [],
            polygonDataList: [],
            UserOptionList: [],
            loading: false,
            selectThinClassNo: '',
            wkt: '',
            actualRegionArea: 0
        };
    }
    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            thinclass,
            section,
            itemDetail,
            record,
            supervisorUsersList
        } = this.props;
        if (thinclass) {
            let thinClassArr = thinclass.split('-');
            let selectThinClassNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            await this.initMap();
            await this._addAreaLayer(thinclass, section);
            if (record && record.status && record.status === '退回') {
                if (itemDetail && itemDetail.Coords) {
                    await this.addAreaDarwBack(itemDetail);
                }
            }
            await this.addThinClassLayer(thinclass, section);
            let UserOptionList = [];
            if (supervisorUsersList && supervisorUsersList instanceof Array && supervisorUsersList.length > 0) {
                supervisorUsersList.map((user) => {
                    if (user && user.ID) {
                        UserOptionList.push(
                            <Option
                                title={`${(user.Full_Name) || ''}(${(user.User_Name) || ''})`}
                                value={user.ID}
                                key={user.ID}
                            >
                                {`${(user.Full_Name) || ''}(${(user.User_Name) || ''})`}
                            </Option>
                        );
                    }
                });
            }
            this.setState({
                selectThinClassNo,
                UserOptionList
            });
        }
    }
    componentWillUnmount = async () => {
        try {
            await this.map.off('click', this.handleTreeAcceptClickFunction);
            await this.handleCloseMeasureMenu();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    /* 初始化地图 */
    initMap = async () => {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            this.map = L.map('mapid', mapInitialization);
            // 加载基础图层
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 15,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
                minZoom: 15,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            await this.map.on('click', this.handleTreeAcceptClickFunction);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, section) => {
        const {
            actions: {
                getTreearea
            }
        } = this.props;
        try {
            let coordsList = await handleAreaLayerData(eventKey, getTreearea, section);
            if (coordsList && coordsList instanceof Array && coordsList.length > 0) {
                for (let t = 0; t < coordsList.length; t++) {
                    let coords = coordsList[t];
                    if (coords && coords instanceof Array && coords.length > 0) {
                        for (let i = 0; i < coords.length; i++) {
                            let str = coords[i];
                            let treearea = handleCoordinates(str);
                            let message = {
                                key: 3,
                                type: 'Feature',
                                properties: {name: '', type: 'area'},
                                geometry: { type: 'Polygon', coordinates: treearea }
                            };
                            let layer = this._createMarker(message);
                            if (i === coords.length - 1) {
                                this.map.fitBounds(layer.getBounds());
                            }
                        }
                    };
                }
            }
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    // 加载上次退回的数据
    addAreaDarwBack = async (itemDetail) => {
        try {
            let str = '';
            let coords = [];
            let wkt = itemDetail.Coords;
            let test = wellknown.parse(wkt);
            console.log('test', test);

            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let datas = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf(')))') + 1);
                let arr = datas.split('),(');
                arr.map((a, index) => {
                    str = a.slice(a.indexOf('(') + 1, a.length - 1);
                    coords.push(str);
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = handlePOLYGONWktData(wkt);
                coords.push(str);
            }
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: {name: '', type: 'back'},
                        geometry: { type: 'Polygon', coordinates: treearea }
                    };
                    let layer = this._createMarker(message);
                    if (i === coords.length - 1) {
                        this.map.fitBounds(layer.getBounds());
                    }
                }
            };
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            } else if (geo.properties.type === 'back') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'grey',
                    fillColor: 'grey',
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            }
        } catch (e) {
            console.log('_createMarker', e);
        }
    }
    handleTreeAcceptClickFunction = async (e) => {
        const {
            coordinates = []
        } = this.state;
        const {
            thinclass
        } = this.props;
        if (thinclass) {
            // 测量面积
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            if (this.state.polygonData) {
                this.map.removeLayer(this.state.polygonData);
            }
            let polygonData = L.polygon(coordinates, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(this.map);
            this.setState({
                coordinates,
                polygonData: polygonData
            });
        }
    }
    addThinClassLayer = async (thinclass, section) => {
        let handleKey = thinclass.split('-');
        let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
        var url = FOREST_GIS_API +
            `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27%20and%20Section+LIKE+%27%25${section}%25%27`;
        L.tileLayer.wms(url,
            {
                layers: 'xatree:treelocation',
                crs: L.CRS.EPSG4326,
                format: 'image/png',
                maxZoom: 22,
                transparent: true
            }
        ).addTo(this.map);
    }

    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            polygonData
        } = this.state;
        // 去除框选地图的面积图层
        if (polygonData) {
            this.map.removeLayer(polygonData);
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
        // 计算面积
        if (this.state.polygonData) {
            this.map.removeLayer(this.state.polygonData);
        }
        coordinates.pop();
        let polygonData = L.polygon(coordinates, {
            color: 'white',
            fillColor: '#93B9F2',
            fillOpacity: 0.2
        }).addTo(this.map);
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
        // 计算面积
        if (this.state.polygonData) {
            await this.map.removeLayer(this.state.polygonData);
        }
        if (treeCorrds.length > 0 && polygonDataList.length > 0) {
            let coordinates = treeCorrds[treeCorrds.length - 1];
            let polygonData = polygonDataList[treeCorrds.length - 1];
            await treeCorrds.pop();
            await polygonDataList.pop();

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
            section,
            thinclass,
            form: {
                setFieldsValue
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let wkt = '';
            let actualRegionArea = 0;
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

            if (thinClassCoords.length === 1) {
                coords = thinClassCoords[0];
            } else {
                coords = thinClassCoords;
            }
            console.log('thinClassCoords', thinClassCoords);

            if (thinAreaNum > 1) {
                let translateCoords = [];
                thinClassCoords.map((coord) => {
                    let translateData = JSON.parse(JSON.stringify(coord));
                    translateData.push(coord[0]);
                    translateCoords.push(translateData);
                });
                console.log('translateCoords', translateCoords);
                let coordinatesData = handleMULTIPOLYGONLngLatToLatLng(translateCoords);
                console.log('coordinatesData', coordinatesData);
                // let data = {
                //     type: 'MultiPolygon',
                //     coordinates: coordinatesData
                // };
                // wkt = wellknown.stringify(data);
                // console.log('wkt', wkt);
                // wkt = wkt.split('), (').join('),(');
                // console.log('wkt', wkt);
                // coords.map((coord, index) => {
                //     // console.log('coord', coord);
                //     let num = computeSignedArea(coord, 2);
                //     actualRegionArea = actualRegionArea + num;
                // });
                wkt = 'MULTIPOLYGON(';
                coords.map((coord, index) => {
                    console.log('coord', coord);
                    let num = computeSignedArea(coord, 2);
                    actualRegionArea = actualRegionArea + num;
                    if (index === 0) {
                        // 获取细班选择坐标wkt
                        wkt = wkt + getWktData(coord);
                    } else {
                        wkt = wkt + ',' + getWktData(coord);
                    }
                });
                wkt = wkt + ')';
                console.log('wkt', wkt);
            } else {
                wkt = 'POLYGON(';
                // 获取手动框选坐标wkt
                wkt = wkt + getHandleWktData(coords);
                wkt = wkt + ')';
                // console.log('coords', coords);

                actualRegionArea = computeSignedArea(coords, 2);
            }
            let viewRegionArea = actualRegionArea * 0.0015;

            let thinClassTree = [];
            if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0) {
                thinClassTree = tree.thinClassTree;
            } else if (tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
                thinClassTree = tree.onSiteThinClassTree;
            }
            let thinClassArr = thinclass.split('-');
            let selectThinClassNo = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            let thinClassName = getSmallThinNameByThinClassData(thinclass, thinClassTree);
            let sectionName = getSectionNameBySection(section, thinClassTree);
            let projectName = getProjectNameBySection(section, thinClassTree);

            setFieldsValue({
                Project: projectName,
                Section: sectionName,
                ThinClass: thinClassName,
                Area: viewRegionArea
            });
            this.setState({
                loading: false,
                selectThinClassNo,
                wkt,
                actualRegionArea
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    save = async () => {
        const {
            selectThinClassNo,
            wkt,
            actualRegionArea
        } = this.state;
        const {
            actions: {
                postAreaAccept
            },
            form: {
                validateFields
            },
            thinClassDesignData = [],
            thinclass,
            section
        } = this.props;
        try {
            validateFields(async (err, values) => {
                if (!err) {
                    let user = getUser();
                    let designArea = 0;
                    if (thinClassDesignData && thinClassDesignData instanceof Array && thinClassDesignData.length > 0) {
                        thinClassDesignData.map((areaData) => {
                            if (areaData && areaData.area) {
                                designArea = designArea + areaData.area;
                            }
                        });
                    }

                    let postData = {
                        Section: section,
                        ThinClass: selectThinClassNo,
                        DesignArea: designArea,
                        ActualArea: actualRegionArea,
                        Creater: user.ID,
                        Supervisor: values.Supervisor,
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
                        this.props.handleCloseDrawAreaModal(1);
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
        this.props.handleCloseDrawAreaModal();
    }

    handleDrawAreaCancel = () => {
        this.props.handleCloseDrawAreaModal();
    }

    render () {
        const {
            coordinates = [],
            treeCorrds = [],
            UserOptionList = [],
            loading
        } = this.state;
        const {
            thinclass,
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
            <Modal
                width={800}
                visible
                title='面积验收施工提交'
                maskClosable={false}
                onCancel={this.handleDrawAreaCancel.bind(this)}
                footer={null}
            >
                {
                    thinclass
                        ? <div className='DrawAreaAcceptModal-editPolygonLayout'>
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
                                    暂存
                                </Button>
                                <Button type='primary' style={{marginRight: 10}}
                                    disabled={deleteCreateAreaDisplay}
                                    onClick={this._handleDeleteCreateArea.bind(this)}>
                                    删除
                                </Button>
                            </div>
                        </div> : ''
                }
                <div
                    id='mapid'
                    style={{
                        height: 600,
                        borderLeft: '1px solid #ccc'
                    }}
                />
                <Form>
                    <Spin spinning={loading}>
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
                            <FormItem {...FormItemLayout} label='面积(亩)'>
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
                                            allowClear
                                            showSearch
                                            filterOption={
                                                (input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                            }
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
                    </Spin>
                </Form>
            </Modal>
        );
    }
}
export default Form.create()(DrawAreaAcceptModal);

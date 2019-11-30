import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox, Modal, Row } from 'antd';
import L from 'leaflet';
import L1 from 'leaflet.markercluster';
// import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './RiskTree.less';
import moment from 'moment';
import RiskDetail from './RiskDetail';
import { handleRiskData, getIconType, genPopUpContent } from '../../auth';
// 安全隐患类型图片
import riskDangerImg from '../../RiskImg/danger.png';
import riskQualityImg from '../../RiskImg/quality.png';
import riskOtherImg from '../../RiskImg/other.png';

const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;
let heatMarkerLayer = new L1.MarkerClusterGroup();
export default class RiskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            timeType: 'today',
            searchData: [],
            riskRectify: false,
            riskNotRectify: true,
            riskMarkerLayerList: {}, // 安全隐患图标图层List
            riskSearchData: [],
            // 安全隐患类型的点击状态，展示是否选中的图片
            riskTypeQuality: true,
            riskTypeDanger: true,
            riskTypeOther: true,
            // 隐患详情弹窗
            riskMess: {}, // 隐患详情
            isShowRisk: false // 是否显示隐患详情弹窗

        };
    }

    // 安全隐患类型
    riskTypeOptions = [
        {
            id: 'riskTypeQuality',
            label: '质量缺陷',
            img: riskQualityImg
        },
        {
            id: 'riskTypeDanger',
            label: '安全隐患',
            img: riskDangerImg
        },
        {
            id: 'riskTypeOther',
            label: '其他',
            img: riskOtherImg
        }
    ]
    genIconClass () {
        let icClass = '';
        let featureName = this.props.featureName;
        switch (featureName) {
            case 'geojsonFeature_track':
                icClass = 'tr-people';
                break;
            case 'geojsonFeature_risk':
                icClass = 'tr-hazard';
                break;
            case 'geojsonFeature_treetype':
                icClass = 'tr-area';
                break;
        }
        return icClass;
    }

    loop (p) {
        let me = this;
        if (p) {
            return (
                <TreeNode
                    title={p.properties.name}
                    key={p.key}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return me.loop(m);
                        })}
                </TreeNode>
            );
        }
    }
    componentDidMount = async () => {
        const {
            riskTreeDay
        } = this.props;
        try {
            if (riskTreeDay && riskTreeDay instanceof Array && riskTreeDay.length >= 0) {
                await this.handleRiskSearchData(riskTreeDay);
            }
            // 隐患详情点击事件
            document.querySelector('.leaflet-popup-pane').addEventListener('click', this.handleRiskModalOk);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        try {
            await this.handleRemoveAllRiskLayer();
            document.querySelector('.leaflet-popup-pane').removeEventListener('click', this.handleRiskModalOk);
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleRiskModalOk = async (e) => {
        let target = e.target;
        // 绑定隐患详情点击事件
        if (target.getAttribute('class') === 'btnViewRisk') {
            let idRisk = target.getAttribute('data-id');
            let risk = null;
            let riskTreeList = [];
            if (this.state.riskSearchData && this.state.riskSearchData.length > 0) {
                riskTreeList = this.state.riskSearchData;
            }
            riskTreeList.forEach(v => {
                if (!risk) {
                    risk = v.children.find(v1 => v1.key === idRisk);
                }
            });
            if (risk) {
                // 获取隐患处理措施
                const { getRiskContactSheet } = this.props.actions;
                let contact = await getRiskContactSheet({ ID: idRisk });
                if (contact && contact.ID) {
                    this.setState({
                        riskMess: contact,
                        isShowRisk: true
                    });
                }
            }
        }
    }
    // 搜索之后的安全隐患数据
    handleRiskSearchData = (searchData) => {
        this.setState({
            riskSearchData: searchData
        }, () => {
            this.handleRiskTypeAddLayer();
        });
    }
    // 安全隐患加载图层
    handleRiskTypeAddLayer = async () => {
        const {
            riskSearchData,
            riskMarkerLayerList
        } = this.state;
        const {
            riskTree,
            map
        } = this.props;
        try {
            let checkedKeys = [];
            this.handleRemoveAllRiskLayer();
            this.riskTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    checkedKeys.push(option.label);
                }
            });
            let checkedData = [];
            if (riskSearchData) {
                checkedData = riskSearchData;
            } else {
                checkedData = riskTree;
            }
            checkedData.map((riskData) => {
                checkedKeys.map((checkedKey) => {
                    if (riskData && riskData.key === checkedKey) {
                        let children = riskData.children;
                        children.forEach((riskData, index) => {
                            if (riskMarkerLayerList[riskData.key]) {
                                heatMarkerLayer.addLayer(riskMarkerLayerList[riskData.key]);
                            } else {
                                riskMarkerLayerList[riskData.key] = this._createMarker(riskData);
                                heatMarkerLayer.addLayer(this._createMarker(riskData));
                            };
                            map.addLayer(heatMarkerLayer);
                            if (index === children.length - 1) {
                                map.panTo(riskData.geometry.coordinates);
                            }
                        });

                        this.setState({
                            riskMarkerLayerList
                        });
                    }
                });
            });
            // heatMarkerLayer.addTo(map);
        } catch (e) {
            console.log('handleRiskTypeAddLayer', e);
        }
    }
    render () {
        let {
            riskTree = [],
            riskTreeLoading,
            menuTreeVisible
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchData,
            riskRectify,
            riskNotRectify
        } = this.state;
        let contents = [];
        if (!etime && !stime && riskNotRectify) {
            for (let j = 0; j < riskTree.length; j++) {
                const element = riskTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < searchData.length; j++) {
                const element = searchData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };

        return (
            <div>
                {
                    menuTreeVisible
                        ? (
                            <div>
                                <div className='RiskTree-menuPanel'>
                                    <aside className='RiskTree-aside' draggable='false'>
                                        <div className='RiskTree-asideTree'>
                                            <Spin spinning={riskTreeLoading}>
                                                <div className='RiskTree-button'>
                                                    <Checkbox className='RiskTree-button-layout'
                                                        checked={riskNotRectify}
                                                        onChange={this.handleRiskNotRectify.bind(this)}>
                                                        未整改
                                                    </Checkbox>
                                                    <Checkbox className='RiskTree-button-layout'
                                                        checked={riskRectify}
                                                        onChange={this.handleRiskRectify.bind(this)}>
                                                        已整改
                                                    </Checkbox>
                                                </div>
                                                <div className='RiskTree-button'>
                                                    <Button className='RiskTree-button-layout' style={{ marginRight: 10 }}
                                                        type={timeType === 'all' ? 'primary' : 'default'}
                                                        id='all' onClick={this.handleTimeChange.bind(this)}>
                                                        全部
                                                    </Button>
                                                    <Button className='RiskTree-button-layout' id='today'
                                                        type={timeType === 'today' ? 'primary' : 'default'}
                                                        onClick={this.handleTimeChange.bind(this)}>
                                                        今天
                                                    </Button>
                                                </div>
                                                <div className='RiskTree-button'>
                                                    <Button className='RiskTree-button-layout' style={{ marginRight: 10 }}
                                                        type={timeType === 'week' ? 'primary' : 'default'}
                                                        id='week' onClick={this.handleTimeChange.bind(this)}>
                                                        一周内
                                                    </Button>
                                                    <Button className='RiskTree-button-layout' id='custom'
                                                        type={timeType === 'custom' ? 'primary' : 'default'}
                                                        onClick={this.handleTimeChange.bind(this)}>
                                                        自定义
                                                    </Button>
                                                </div>
                                                {
                                                    timeType === 'custom'
                                                        ? <RangePicker
                                                            style={{ width: 220, marginBottom: 10 }}
                                                            showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                                            format='YYYY-MM-DD HH:mm:ss'
                                                            placeholder={['Start Time', 'End Time']}
                                                            onChange={this.handleDateChange.bind(this)}
                                                        />
                                                        : ''
                                                }
                                                <div className='RiskTree-statis-layout'>
                                                    <span style={{ verticalAlign: 'middle' }}>类型</span>
                                                    <span className='RiskTree-data-text'>
                                                        数量
                                                    </span>
                                                </div>
                                                <div>
                                                    {
                                                        contents.map((content) => {
                                                            return (
                                                                <div className='RiskTree-mrg10' key={content.key}>
                                                                    <span style={{ verticalAlign: 'middle' }}>{content.properties.name}</span>
                                                                    <span className='RiskTree-data-text'>
                                                                        {content.children.length}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </Spin>
                                        </div>
                                    </aside>
                                </div>
                                <div>
                                    <div className='RiskTree-menuSwitchRiskTypeLayout'>
                                        {
                                            this.riskTypeOptions.map((option) => {
                                                return (
                                                    <div style={{ display: 'inlineBlock', marginTop: 10, height: 20 }} key={option.id}>
                                                        <p className='RiskTree-menuLabel'>{option.label}</p>
                                                        <img src={option.img}
                                                            title={option.label}
                                                            className='RiskTree-rightMenuRiskTypeImgLayout' />
                                                        <a className={this.state[option.id] ? 'RiskTree-rightMenuRiskTypeSelLayout' : 'RiskTree-rightMenuRiskTypeUnSelLayout'}
                                                            title={option.label}
                                                            key={option.id}
                                                            onClick={this.handleRiskTypeButton.bind(this, option)} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : ''
                }
                <Modal
                    title='隐患详情'
                    width={800}
                    visible={this.state.isShowRisk}
                    onCancel={this._handleCancelVisible.bind(this)}
                    footer={null}
                >
                    <div>
                        <RiskDetail
                            {...this.props}
                            riskMess={this.state.riskMess}
                        />
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this._handleCancelVisible.bind(
                                    this
                                )}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
    // 未整改
    handleRiskNotRectify = (e) => {
        this.setState({
            riskNotRectify: e.target.checked,
            riskRectify: !e.target.checked
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleRiskRectify = (e) => {
        this.setState({
            riskRectify: e.target.checked,
            riskNotRectify: !e.target.checked
        }, () => {
            this.query();
        });
    }
    handleTimeChange = (e) => {
        const {
            riskRectify
        } = this.state;
        let {
            riskTree = []
        } = this.props;
        try {
            let target = e.target;
            let timeType = target.getAttribute('id');
            this.setState({
                timeType
            });
            let stime = '';
            let etime = '';
            if (timeType === 'custom') {
                return;
            } else if (timeType === 'all') {
                // 如果没有设置时间  且status为初始状态  则直接获取redux的数据  不用query
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (riskTree && riskTree instanceof Array && riskTree.length > 0) {
                        if (riskRectify) {
                            this.query();
                        } else { // 如果之前发起过请求，直接赋值
                            this.handleRiskSearchData(riskTree);
                        }
                    } else {
                        this.query();
                    }
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            };
            this.setState({
                stime,
                etime
            }, () => {
                this.query();
            });
        } catch (e) {
            console.log('handleTimeChange', e);
        }
    }
    handleDateChange = (value) => {
        this.setState({
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        }, () => {
            this.query();
        });
    }
    query = async () => {
        const {
            actions: {
                getRisk,
                getRiskTree,
                getRiskTreeLoading
            },
            riskTree
        } = this.props;
        const {
            stime,
            etime,
            timeType,
            riskNotRectify,
            riskRectify
        } = this.state;
        try {
            if (!stime && !etime && riskNotRectify && riskTree) {
                await this.handleRiskSearchData(riskTree);
                return;
            }
            await getRiskTreeLoading(true);
            if (riskNotRectify) {
                let content = [];
                let postdata1 = {
                    stime: stime,
                    etime: etime,
                    status: -1
                };
                let data1 = await getRisk({}, postdata1);

                let postdata2 = {
                    stime: stime,
                    etime: etime,
                    status: 0
                };
                let data2 = await getRisk({}, postdata2);

                let postdata3 = {
                    stime: stime,
                    etime: etime,
                    status: 1
                };
                let data3 = await getRisk({}, postdata3);
                if (data1 && data1.content) {
                    content = content.concat(data1.content);
                }
                if (data2 && data2.content) {
                    content = content.concat(data2.content);
                }
                if (data3 && data3.content) {
                    content = content.concat(data3.content);
                }
                let risks = handleRiskData(content);
                if (timeType === 'all') {
                    await getRiskTree(risks);
                }
                await getRiskTreeLoading(false);
                await this.handleRiskSearchData(risks);
                this.setState({
                    searchData: risks
                });
            } else {
                let postdata = {
                    stime: stime,
                    etime: etime,
                    status: 2
                };
                let data = await getRisk({}, postdata);
                if (data && data.content) {
                    let content = data.content;
                    let risks = handleRiskData(content);
                    await getRiskTreeLoading(false);
                    await this.handleRiskSearchData(risks);
                    this.setState({
                        searchData: risks
                    });
                }
            }
        } catch (e) {
            console.log('queryRisk', e);
        }
    }

    // 安全隐患选择类型
    handleRiskTypeButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleRiskTypeAddLayer();
            });
        } catch (e) {
            console.log('handleRiskTypeButton', e);
        }
    }
    // 去除全部安全隐患图层
    handleRemoveAllRiskLayer = () => {
        const {
            map
        } = this.props;
        map.removeLayer(heatMarkerLayer);
        heatMarkerLayer = new L1.MarkerClusterGroup();
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        const {
            map
        } = this.props;
        try {
            if (
                !geo.geometry.coordinates[0] ||
                !geo.geometry.coordinates[1]
            ) {
                return;
            }
            let iconType = L.divIcon({
                className: getIconType(geo.type)
            });
            let marker = L.marker(geo.geometry.coordinates, {
                icon: iconType,
                title: geo.properties.name
            });
            marker.bindPopup(
                L.popup({ maxWidth: 240 }).setContent(
                    genPopUpContent(geo)
                )
            );
            // marker.addTo(map);
            return marker;
        } catch (e) {
            console.log('_createMarker', e);
        }
    }
    // 退出隐患详情查看
    _handleCancelVisible () {
        this.setState({
            isShowRisk: false
        });
    }
}

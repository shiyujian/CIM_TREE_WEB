import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox, Modal, Row } from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import L1 from 'leaflet.markercluster';
// import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './RiskTree.less';
import moment from 'moment';
import RiskDetail from './RiskDetail';
import { handleRiskData, getIconType, genPopUpContent } from '../../auth';

// 质量缺陷
import defectImg from './ProblemImg/defect1.png';
import defectImgSel from './ProblemImg/defect2.png';
// 安全隐患
import unSafeImg from './ProblemImg/unsafe1.png';
import unSafeImgSel from './ProblemImg/unsafe2.png';

import decoration from './ProblemImg/decoration.png';
import hide from './ProblemImg/hide2.png';
import display from './ProblemImg/display2.png';

const { RangePicker } = DatePicker;
let heatMarkerLayer = new L1.MarkerClusterGroup();
export default class RiskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            dateStime: '',
            dateEtime: '',
            timeType: 'today',
            searchData: [],
            riskRectify: false,
            riskNotRectify: true,
            riskMarkerLayerList: {}, // 安全隐患图标图层List
            riskSearchData: [],
            // 安全隐患类型的点击状态，展示是否选中的图片
            riskTypeQuality: true,
            riskTypeDanger: true,
            // riskTypeOther: true,
            // 隐患详情弹窗
            riskMess: {}, // 隐患详情
            isShowRisk: false, // 是否显示隐患详情弹窗
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 665 /* 菜单宽度 */

        };
    }

    // 问题类型
    problemTypeOptions = [
        {
            id: 'riskTypeQuality',
            label: '质量缺陷',
            img: defectImg,
            selImg: defectImgSel
        },
        {
            id: 'riskTypeDanger',
            label: '安全隐患',
            img: unSafeImg,
            selImg: unSafeImgSel
        }
        // {
        //     id: 'riskTypeOther',
        //     label: '其他',
        //     img: riskOtherImg
        // }
    ]
    componentDidMount = async () => {
        const {
            riskTreeDay
        } = this.props;
        try {
            if (riskTreeDay && riskTreeDay instanceof Array && riskTreeDay.length >= 0) {
                await this.handleRiskSearchData(riskTreeDay);
            }
            if (document.querySelector('#ProblemAsideDom')) {
                let ProblemAsideDom = Scrollbar.init(document.querySelector('#ProblemAsideDom'));
                console.log('ProblemAsideDom', ProblemAsideDom);
            }
            // 隐患详情点击事件
            // document.querySelector('.leaflet-popup-pane').addEventListener('click', this.handleRiskModalOk);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        try {
            await this.handleRemoveAllRiskLayer();
            // document.querySelector('.leaflet-popup-pane').removeEventListener('click', this.handleRiskModalOk);
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
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
            this.problemTypeOptions.map((option) => {
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
            console.log('checkedData', checkedData);

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
    // 未整改
    handleRiskNotRectify = (e) => {
        this.setState({
            riskNotRectify: !this.state.riskNotRectify,
            riskRectify: !this.state.riskRectify
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleRiskRectify = (e) => {
        this.setState({
            riskRectify: !this.state.riskRectify,
            riskNotRectify: !this.state.riskNotRectify
        }, () => {
            this.query();
        });
    }
    handleTimeChange = (timeType) => {
        const {
            riskRectify
        } = this.state;
        let {
            riskTree = []
        } = this.props;
        try {
            this.setState({
                timeType,
                dateStime: '',
                dateEtime: ''
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
            dateStime: value[0] ? moment(value[0]).format('YYYY-MM-DD') : '',
            dateEtime: value[1] ? moment(value[1]).format('YYYY-MM-DD') : '',
            timeType: 'custom',
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD') : ''
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
                L.popup({ padding: 0 }).setContent(
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
            riskRectify,
            riskNotRectify,
            menuIsExtend,
            menuWidth,
            dateStime,
            dateEtime,
            riskSearchData
        } = this.state;
        let contents = [];
        for (let j = 0; j < riskSearchData.length; j++) {
            const element = riskSearchData[j];
            if (element !== undefined) {
                contents.push(element);
            }
        }
        console.log('contents', contents);

        return (
            <div>
                <div className='ProblemPage-container'>
                    <div className='ProblemPage-r-main'>
                        {
                            menuIsExtend ? '' : (
                                <img src={display}
                                    className='ProblemPage-foldBtn'
                                    onClick={this._extendAndFold.bind(this)} />
                            )
                        }
                        <div
                            className={`ProblemPage-menuPanel`}
                            style={
                                menuIsExtend
                                    ? {
                                        width: menuWidth,
                                        transform: 'translateX(0)'
                                    }
                                    : {
                                        width: menuWidth,
                                        transform: `translateX(-${
                                            menuWidth
                                        }px)`
                                    }
                            }
                        >
                            <div className='ProblemPage-menuBackground' />
                            <aside className='ProblemPage-aside' id='ConservationAsideDom'>
                                <div className='ProblemPage-MenuNameLayout'>
                                    <img src={decoration} />
                                    <span className='ProblemPage-MenuName'>苗木养护</span>
                                    <img src={hide}
                                        onClick={this._extendAndFold.bind(this)}
                                        className='ProblemPage-MenuHideButton' />
                                </div>
                                <div className='ProblemPage-asideTree'>
                                    <div className='ProblemPage-StatusButton'>
                                        <a key='未整改'
                                            title='未整改'
                                            className={riskNotRectify ? 'ProblemPage-button-statusSel' : 'ProblemPage-button-status'}
                                            onClick={this.handleRiskNotRectify.bind(this)}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={riskNotRectify ? 'ProblemPage-button-status-textSel' : 'ProblemPage-button-status-text'}>
                                                未整改
                                            </span>
                                        </a>
                                        <a key='已整改'
                                            title='已整改'
                                            className={riskRectify ? 'ProblemPage-button-statusSel' : 'ProblemPage-button-status'}
                                            onClick={this.handleRiskRectify.bind(this)}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={riskRectify ? 'ProblemPage-button-status-textSel' : 'ProblemPage-button-status-text'}>
                                                已整改
                                            </span>
                                        </a>
                                    </div>
                                    <div className='ProblemPage-TimeButton'>
                                        <a key='今天'
                                            title='今天'
                                            id='today'
                                            className={timeType === 'today' ? 'ProblemPage-button-timeSel' : 'ProblemPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'today')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'today' ? 'ProblemPage-button-time-textSel' : 'ProblemPage-button-time-text'}>
                                                今天
                                            </span>
                                        </a>
                                        <a key='一周内'
                                            title='一周内'
                                            id='week'
                                            className={timeType === 'week' ? 'ProblemPage-button-timeSel' : 'ProblemPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'week')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'week' ? 'ProblemPage-button-time-textSel' : 'ProblemPage-button-time-text'}>
                                                一周内
                                            </span>
                                        </a>
                                        <a key='全部'
                                            title='全部'
                                            id='all'
                                            className={timeType === 'all' ? 'ProblemPage-button-timeSel' : 'ProblemPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'all')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'all' ? 'ProblemPage-button-time-textSel' : 'ProblemPage-button-time-text'}>
                                                全部
                                            </span>
                                        </a>
                                        <a key='custom'
                                            title='custom'
                                            id='custom'
                                            className={timeType === 'custom' ? 'ProblemPage-button-customTimeSel' : 'ProblemPage-button-customTime'}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <RangePicker
                                                allowClear={false}
                                                style={{ width: '100%', height: '100%' }}
                                                value={
                                                    dateStime && dateEtime
                                                        ? [
                                                            moment(dateStime, 'YYYY-MM-DD'),
                                                            moment(dateEtime, 'YYYY-MM-DD')
                                                        ] : null
                                                }
                                                format='YYYY-MM-DD'
                                                placeholder={['开始时间', '结束时间']}
                                                onChange={this.handleDateChange.bind(this)}
                                            />
                                        </a>
                                    </div>
                                    <div className='ProblemPage-button'>
                                        {
                                            this.problemTypeOptions.map((option) => {
                                                let imgurl = option.img;
                                                if (this.state[option.id]) {
                                                    imgurl = option.selImg;
                                                }
                                                let num = 0;
                                                contents.map((typeData) => {
                                                    if (typeData && typeData.key === option.label) {
                                                        num = (typeData.children && typeData.children.length) || 0;
                                                    }
                                                });
                                                return (<a key={option.label}
                                                    title={option.label}
                                                    className={this.state[option.id] ? 'ProblemPage-button-layoutSel' : 'ProblemPage-button-layout'}
                                                    onClick={this.handleRiskTypeButton.bind(this, option)}
                                                    style={{
                                                        marginRight: 8,
                                                        marginTop: 8
                                                    }}
                                                >
                                                    <span className='ProblemPage-button-layout-text'>{option.label}</span>
                                                    <img src={imgurl} className='ProblemPage-button-layout-img' />
                                                    <span className={this.state[option.id] ? 'ProblemPage-button-layout-numSel' : 'ProblemPage-button-layout-num'}>
                                                        {num}
                                                    </span>
                                                </a>);
                                            })
                                        }
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
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
}

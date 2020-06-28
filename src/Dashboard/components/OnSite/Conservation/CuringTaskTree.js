import React, { Component } from 'react';
import { Button, DatePicker, Spin, Checkbox, Row } from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import './CuringTaskTree.less';
import moment from 'moment';
import {
    handleCuringTaskData,
    getIconType,
    genPopUpContent,
    handleCuringTaskMess
} from '../../auth';
import {handlePOLYGONWktData} from '_platform/gisAuth';
// 排涝
import curingTaskDrainImg from './ConservationImg/icon_drainage1.png';
import curingTaskDrainImgSel from './ConservationImg/icon_drainage2.png';
// 施肥
import curingTaskFeedImg from './ConservationImg/icon_fertilize1.png';
import curingTaskFeedImgSel from './ConservationImg/icon_fertilize2.png';
// 其他
import curingTaskOtherImg from './ConservationImg/icon_other1.png';
import curingTaskOtherImgSel from './ConservationImg/icon_other2.png';
// 补植
import curingTaskReplantingImg from './ConservationImg/icon_replanting1.png';
import curingTaskReplantingImgSel from './ConservationImg/icon_replanting2.png';
// 修剪
import curingTaskTrimImg from './ConservationImg/icon_prune1.png';
import curingTaskTrimImgSel from './ConservationImg/icon_prune2.png';
// 浇水
import curingTaskWateringImg from './ConservationImg/icon_watering1.png';
import curingTaskWateringImgSel from './ConservationImg/icon_watering2.png';
// 除草
import curingTaskWeedImg from './ConservationImg/icon_weeding1.png';
import curingTaskWeedImgSel from './ConservationImg/icon_weeding2.png';
// 防病虫
import curingTaskWormImg from './ConservationImg/icon_pest1.png';
import curingTaskWormImgSel from './ConservationImg/icon_pest2.png';

import decoration from './ConservationImg/decoration.png';
import hide from './ConservationImg/hide2.png';
import display from './ConservationImg/display2.png';

const { RangePicker } = DatePicker;

export default class CuringTaskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD'),
            etime: moment().format('YYYY-MM-DD'),
            dateStime: '',
            dateEtime: '',
            timeType: 'today',
            curingTaskSrarchData: [],
            curingTaskComplete: false,
            curingTaskUnComplete: true,
            // 养护任务类型的点击状态，展示是否选中的图片
            curingTaskFeed: true,
            curingTaskDrain: true,
            curingTaskReplanting: true,
            curingTaskWorm: true,
            curingTaskTrim: true,
            curingTaskWeed: true,
            curingTaskWatering: true,
            curingTaskOther: true,
            // 图层
            curingTaskPlanLayerList: {},
            curingTaskRealLayerList: {},
            curingTaskMarkerLayerList: {},
            curingTaskMessList: {}, // 养护任务信息List
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 665 /* 菜单宽度 */
        };
    }

    // 养护任务类型
    curingTaskTypeOptions = [
        {
            id: 'curingTaskFeed',
            label: '施肥',
            img: curingTaskFeedImg,
            selImg: curingTaskFeedImgSel
        },
        {
            id: 'curingTaskDrain',
            label: '排涝',
            img: curingTaskDrainImg,
            selImg: curingTaskDrainImgSel
        },
        {
            id: 'curingTaskReplanting',
            label: '补植',
            img: curingTaskReplantingImg,
            selImg: curingTaskReplantingImgSel
        },
        {
            id: 'curingTaskWorm',
            label: '防病虫',
            img: curingTaskWormImg,
            selImg: curingTaskWormImgSel
        },
        {
            id: 'curingTaskTrim',
            label: '修剪',
            img: curingTaskTrimImg,
            selImg: curingTaskTrimImgSel
        },
        {
            id: 'curingTaskWeed',
            label: '除草',
            img: curingTaskWeedImg,
            selImg: curingTaskWeedImgSel
        },
        {
            id: 'curingTaskWatering',
            label: '浇水',
            img: curingTaskWateringImg,
            selImg: curingTaskWateringImgSel
        },
        {
            id: 'curingTaskOther',
            label: '其他',
            img: curingTaskOtherImg,
            selImg: curingTaskOtherImgSel
        }
    ]

    componentDidMount = async () => {
        const {
            curingTaskTreeDay
        } = this.props;
        try {
            if (curingTaskTreeDay && curingTaskTreeDay instanceof Array && curingTaskTreeDay.length > 0) {
                await this.handleCuringTaskSearchData(curingTaskTreeDay);
            }
            if (document.querySelector('#ConservationAsideDom')) {
                let ConservationAsideDom = Scrollbar.init(document.querySelector('#ConservationAsideDom'));
                console.log('ConservationAsideDom', ConservationAsideDom);
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            selectProject
        } = this.props;
        const {
            timeType
        } = this.state;
        if (selectProject !== prevProps.selectProject) {
            this.handleTimeChange(timeType);
        }
    }
    componentWillUnmount = async () => {
        await this.handleRemoveAllCuringTaskLayer();
    }

    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }

    // 未整改
    handleCuringTaskUnComplete = () => {
        this.setState({
            curingTaskUnComplete: !this.state.curingTaskUnComplete,
            curingTaskComplete: !this.state.curingTaskComplete
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleCuringTaskComplete = () => {
        this.setState({
            curingTaskComplete: !this.state.curingTaskComplete,
            curingTaskUnComplete: !this.state.curingTaskUnComplete
        }, () => {
            this.query();
        });
    }

    handleTimeChange = (timeType) => {
        const {
            curingTaskComplete
        } = this.state;
        const {
            curingTaskTree,
            selectProject = ''
        } = this.props;
        try {
            this.setState({
                timeType,
                dateStime: '',
                dateEtime: ''
            });
            let stime = '';
            let etime = '';
            if (timeType === 'all') {
                // 如果没有设置时间  且status为初始状态  则直接获取redux的数据  不用query
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
                        if (curingTaskComplete) {
                            this.query();
                        } else {
                            if (!selectProject) {
                                this.handleCuringTaskSearchData(curingTaskTree);
                            } else {
                                this.query();
                            }
                        }
                    } else {
                        this.query();
                    }
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD');
                etime = moment().format('YYYY-MM-DD');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD');
                etime = moment().format('YYYY-MM-DD');
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
                getCuring,
                getCuringTypes,
                getCuringTaskTree,
                getCuringTaskTreeLoading
            },
            curingTypes,
            curingTaskTree,
            selectProject = ''
        } = this.props;
        const {
            stime,
            etime,
            timeType,
            curingTaskUnComplete,
            curingTaskComplete
        } = this.state;
        try {
            if (!stime && !etime && curingTaskUnComplete && !selectProject) {
                await this.handleCuringTaskSearchData(curingTaskTree);
                return;
            }
            await getCuringTaskTreeLoading(true);
            let curingTypesData = [];
            if (curingTypes && curingTypes instanceof Array && curingTypes.length > 0) {
                curingTypesData = curingTypes;
            } else {
                let data = await getCuringTypes();
                curingTypesData = data && data.content;
            }
            let curingTaskTreeData = [];
            if (curingTypesData && curingTypesData.length > 0) {
                if (curingTaskUnComplete) {
                    let curingTasks = [];
                    // 状态为有效
                    let postdata1 = {
                        stime: stime ? moment(stime).format('YYYY-MM-DD 00:00:01') : '',
                        etime: etime ? moment(etime).format('YYYY-MM-DD 23:59:59') : '',
                        status: 0,
                        section: selectProject
                    };
                    let data1 = await getCuring({}, postdata1);
                    // 状态为退回
                    let postdata2 = {
                        stime: stime ? moment(stime).format('YYYY-MM-DD 00:00:01') : '',
                        etime: etime ? moment(etime).format('YYYY-MM-DD 23:59:59') : '',
                        status: 1,
                        section: selectProject
                    };
                    let data2 = await getCuring({}, postdata2);
                    if (data1 && data1.content) {
                        curingTasks = curingTasks.concat(data1.content);
                    }
                    if (data2 && data2.content) {
                        curingTasks = curingTasks.concat(data2.content);
                    }
                    curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
                    await getCuringTaskTreeLoading(false);
                    if (timeType === 'all') {
                        await getCuringTaskTree(curingTaskTreeData);
                    }
                    await this.handleCuringTaskSearchData(curingTaskTreeData);
                } else {
                    // 状态为已上报
                    let postdata = {
                        stime: stime ? moment(stime).format('YYYY-MM-DD 00:00:01') : '',
                        etime: etime ? moment(etime).format('YYYY-MM-DD 23:59:59') : '',
                        status: 2,
                        section: selectProject
                    };
                    let curingTaskData = await getCuring({}, postdata);
                    let curingTasks = curingTaskData.content;
                    curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
                    await getCuringTaskTreeLoading(false);
                    await this.handleCuringTaskSearchData(curingTaskTreeData);
                }
            }
        } catch (e) {
            console.log('queryRisk', e);
        }
    }
    // 搜索之后的养护任务数据
    handleCuringTaskSearchData = (searchData) => {
        this.setState({
            curingTaskSrarchData: searchData
        }, () => {
            this.handleCuringTaskTypeAddLayer();
        });
    }
    
    // 养护任务选择类型
    handleCuringTaskTypeButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleCuringTaskTypeAddLayer();
            });
        } catch (e) {
            console.log('handleCuringTaskTypeButton', e);
        }
    }
    // 加载某个类型的养护任务图层
    handleCuringTaskTypeAddLayer = () => {
        const {
            curingTaskSrarchData
        } = this.state;
        const {
            curingTaskTree
        } = this.props;
        try {
            let checkedKeys = [];
            this.handleRemoveAllCuringTaskLayer();
            this.curingTaskTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    checkedKeys.push(option.label);
                }
            });
            let checkedData = [];
            if (curingTaskSrarchData) {
                checkedData = curingTaskSrarchData;
            } else {
                checkedData = curingTaskTree;
            }
            checkedData.map((curingTaskData) => {
                checkedKeys.map((checkedKey) => {
                    if (curingTaskData && curingTaskData.Name === checkedKey) {
                        let children = curingTaskData.children;
                        children.forEach((child, index) => {
                            if (index === children.length - 1) {
                                this.handleCuringTaskAddLayer(child, true);
                            } else {
                                this.handleCuringTaskAddLayer(child, false);
                            }
                        });
                    }
                });
            });
        } catch (e) {
            console.log('handleCuringTaskTypeAddLayer', e);
        }
    }
    // 处理每个任务图层加载，如果之前加载过，直接加载之前的，否则重新获取
    handleCuringTaskAddLayer = async (task, isFocus) => {
        const {
            map
        } = this.props;
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        let eventKey = task.ID;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                layer.addTo(map);
                if (isFocus) {
                    map.fitBounds(layer.getBounds());
                }
            });
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].map((layer) => {
                    layer.addTo(map);
                });
            }
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].map((layer) => {
                    layer.addTo(map);
                    if (isFocus) {
                        map.fitBounds(layer.getBounds());
                    }
                });
            }
        } else {
            // 如果不是添加过，需要请求数据
            this.getCuringTaskWkt(task, eventKey, isFocus);
        }
    }
    // 获取养护任务的计划和实际区域
    getCuringTaskWkt = async (taskMess, eventKey, isFocus) => {
        try {
            if (taskMess.Status === 2) {
                let realWkt = taskMess.WKT || '';
                if (realWkt) {
                    this._handleCuringTaskWkt(realWkt, eventKey, taskMess, 'real', isFocus);
                }
            } else {
                let planWkt = taskMess.PlanWKT;
                if (planWkt) {
                    this._handleCuringTaskWkt(planWkt, eventKey, taskMess, 'plan', isFocus);
                }
            }
        } catch (e) {
            console.log('handleWKT', e);
        }
    }
    // 处理养护区域的数据，将字符串改为数组
    _handleCuringTaskWkt = async (wkt, eventKey, task, type, isFocus) => {
        let str = '';
        try {
            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
                let arr = data.split('),(');
                arr.map((a, index) => {
                    if (index === 0) {
                        str = a.slice(a.indexOf('(') + 1, a.length - 1);
                    } else if (index === arr.length - 1) {
                        str = a.slice(0, a.indexOf(')'));
                    } else {
                        str = a;
                    }
                    // 将图标设置在最后一个图形中，因为最后会聚焦到该位置
                    if (index === arr.length - 1) {
                        if (type === 'plan') {
                            this._handleCuringPlanCoordLayer(str, task, eventKey, index, isFocus);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey, index, isFocus);
                        }
                    } else {
                        if (type === 'plan') {
                            // 其他图形中不设置图标
                            this._handleCuringPlanCoordLayer(str, task, eventKey);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey);
                        }
                    }
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = handlePOLYGONWktData(wkt);
                if (type === 'plan') {
                    // 只有一个图形，必须要设置图标
                    this._handleCuringPlanCoordLayer(str, task, eventKey, 1, isFocus);
                } else if (type === 'real') {
                    this._handleCuringRealCoordLayer(str, task, eventKey, 1, isFocus);
                }
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 养护任务计划区域加载图层
    _handleCuringPlanCoordLayer (str, taskMess, eventKey, index, isFocus) {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList
        } = this.state;
        const {
            curingTypes,
            platform: {
                tree = {}
            },
            map
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let message = handleCuringTaskMess(str, taskMess, totalThinClass, curingTypes, bigTreeList);
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (curingTaskPlanLayerList[eventKey]) {
                curingTaskPlanLayerList[eventKey].push(layer);
            } else {
                curingTaskPlanLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskPlanLayerList
            });
            // // 多选的话，只需要聚焦最后一个
            // if (isFocus) {
            //     map.fitBounds(layer.getBounds());
            // }
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: getIconType(message.properties.typeName)
            });
            let marker = L.marker([centerData.lat, centerData.lng], {
                icon: iconType,
                title: message.properties.name
            });
            marker.bindPopup(
                L.popup({ padding: 0 }).setContent(
                    genPopUpContent(message)
                )
            );
            marker.addTo(map);
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].push(marker);
            } else {
                curingTaskMarkerLayerList[eventKey] = [marker];
            }
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                map.fitBounds(layer.getBounds());
            }
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    // 添加实际养护区域图层
    _handleCuringRealCoordLayer (str, task, eventKey, index, isFocus) {
        const {
            curingTaskRealLayerList,
            curingTaskMarkerLayerList
        } = this.state;
        const {
            curingTypes,
            platform: {
                tree = {}
            },
            map
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let message = handleCuringTaskMess(str, task, totalThinClass, curingTypes, bigTreeList);
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].push(layer);
            } else {
                curingTaskRealLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskRealLayerList
            });
            // // 多选的话，只需要聚焦最后一个
            // if (isFocus) {
            //     map.fitBounds(layer.getBounds());
            // }
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: getIconType(message.properties.typeName)
            });
            let marker = L.marker([centerData.lat, centerData.lng], {
                icon: iconType,
                title: message.properties.name
            });
            marker.bindPopup(
                L.popup({ padding: 0 }).setContent(
                    genPopUpContent(message)
                )
            );
            marker.addTo(map);
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].push(marker);
            } else {
                curingTaskMarkerLayerList[eventKey] = [marker];
            }
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                map.fitBounds(layer.getBounds());
            }
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
        }
    }
    // 去除全部养护任务图层
    handleRemoveAllCuringTaskLayer = () => {
        const {
            map
        } = this.props;
        const {
            curingTaskPlanLayerList, // 养护任务计划养护区域图层List
            curingTaskRealLayerList, // 养护任务实际养护区域图层List
            curingTaskMarkerLayerList // 养护任务图标图层List
        } = this.state;
        try {
            for (let v in curingTaskPlanLayerList) {
                curingTaskPlanLayerList[v].map((layer) => {
                    map.removeLayer(layer);
                });
            }
            for (let v in curingTaskRealLayerList) {
                curingTaskRealLayerList[v].map((layer) => {
                    map.removeLayer(layer);
                });
            }
            for (let v in curingTaskMarkerLayerList) {
                curingTaskMarkerLayerList[v].map((layer) => {
                    map.removeLayer(layer);
                });
            }
        } catch (e) {
            console.log('handleRemoveAllCuringTaskLayer', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        const {
            map
        } = this.props;
        try {
            if (geo.properties.type === 'planCuringTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'blue',
                    fillColor: '#93B9F2',
                    fillOpacity: 0.2
                }).addTo(map);
                return layer;
            } else if (geo.properties.type === 'realCuringTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'yellow',
                    fillColor: 'yellow',
                    fillOpacity: 0.3
                }).addTo(map);
                return layer;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    render () {
        let {
            curingTaskTree = [],
            curingTaskTreeLoading
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            curingTaskComplete,
            curingTaskUnComplete,
            menuIsExtend,
            menuWidth,
            dateStime,
            dateEtime,
            curingTaskSrarchData = []
        } = this.state;

        let contents = [];
        if (!etime && !stime && curingTaskUnComplete) {
            for (let j = 0; j < curingTaskTree.length; j++) {
                const element = curingTaskTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < curingTaskSrarchData.length; j++) {
                const element = curingTaskSrarchData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        console.log('contents', contents);

        return (
            <div className='CuringTreePage-container'>
                <div className='CuringTreePage-r-main'>
                    {
                        menuIsExtend ? '' : (
                            <img src={display}
                                className='CuringTreePage-foldBtn'
                                onClick={this._extendAndFold.bind(this)} />
                        )
                    }
                    <div
                        className={`CuringTreePage-menuPanel`}
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
                        <div className='CuringTreePage-menuBackground' />
                        <aside className='CuringTreePage-aside' id='ConservationAsideDom'>
                            <div className='CuringTreePage-MenuNameLayout'>
                                <img src={decoration} />
                                <span className='CuringTreePage-MenuName'>苗木养护</span>
                                <img src={hide}
                                    onClick={this._extendAndFold.bind(this)}
                                    className='CuringTreePage-MenuHideButton' />
                            </div>
                            <div className='CuringTreePage-asideTree'>
                                <Spin spinning={curingTaskTreeLoading}></Spin>
                                    <div className='CuringTreePage-StatusButton'>
                                        <a key='未完成'
                                            title='未完成'
                                            className={curingTaskUnComplete ? 'CuringTreePage-button-statusSel' : 'CuringTreePage-button-status'}
                                            onClick={this.handleCuringTaskUnComplete.bind(this)}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={curingTaskUnComplete ? 'CuringTreePage-button-status-textSel' : 'CuringTreePage-button-status-text'}>
                                                未完成
                                            </span>
                                        </a>
                                        <a key='已完成'
                                            title='已完成'
                                            className={curingTaskComplete ? 'CuringTreePage-button-statusSel' : 'CuringTreePage-button-status'}
                                            onClick={this.handleCuringTaskComplete.bind(this)}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={curingTaskComplete ? 'CuringTreePage-button-status-textSel' : 'CuringTreePage-button-status-text'}>
                                                已完成
                                            </span>
                                        </a>
                                    </div>
                                    <div className='CuringTreePage-TimeButton'>
                                        <a key='今天'
                                            title='今天'
                                            id='today'
                                            className={timeType === 'today' ? 'CuringTreePage-button-timeSel' : 'CuringTreePage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'today')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'today' ? 'CuringTreePage-button-time-textSel' : 'CuringTreePage-button-time-text'}>
                                                今天
                                            </span>
                                        </a>
                                        <a key='一周内'
                                            title='一周内'
                                            id='week'
                                            className={timeType === 'week' ? 'CuringTreePage-button-timeSel' : 'CuringTreePage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'week')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'week' ? 'CuringTreePage-button-time-textSel' : 'CuringTreePage-button-time-text'}>
                                                一周内
                                            </span>
                                        </a>
                                        <a key='全部'
                                            title='全部'
                                            id='all'
                                            className={timeType === 'all' ? 'CuringTreePage-button-timeSel' : 'CuringTreePage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'all')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'all' ? 'CuringTreePage-button-time-textSel' : 'CuringTreePage-button-time-text'}>
                                                全部
                                            </span>
                                        </a>
                                        <a key='custom'
                                            title='custom'
                                            id='custom'
                                            className={timeType === 'custom' ? 'CuringTreePage-button-customTimeSel' : 'CuringTreePage-button-customTime'}
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
                                    <div className='CuringTreePage-button'>
                                        {
                                            this.curingTaskTypeOptions.map((option) => {
                                                let imgurl = option.img;
                                                if (this.state[option.id]) {
                                                    imgurl = option.selImg;
                                                }
                                                let num = 0;
                                                contents.map((typeData) => {
                                                    if (typeData && typeData.Name === option.label) {
                                                        num = (typeData.children && typeData.children.length) || 0;
                                                    }
                                                });
                                                return (<a key={option.label}
                                                    title={option.label}
                                                    className={this.state[option.id] ? 'CuringTreePage-button-layoutSel' : 'CuringTreePage-button-layout'}
                                                    onClick={this.handleCuringTaskTypeButton.bind(this, option)}
                                                    style={{
                                                        marginRight: 8,
                                                        marginTop: 8
                                                    }}
                                                >
                                                    <span className='CuringTreePage-button-layout-text'>{option.label}</span>
                                                    <img src={imgurl} className='CuringTreePage-button-layout-img' />
                                                    <span className={this.state[option.id] ? 'CuringTreePage-button-layout-numSel' : 'CuringTreePage-button-layout-num'}>
                                                        {num}
                                                    </span>
                                                </a>);
                                            })
                                        }
                                    </div>
                                </Spin>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        );
    }
}

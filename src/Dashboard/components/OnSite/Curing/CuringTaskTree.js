import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox } from 'antd';
import './CuringTaskTree.less';
import moment from 'moment';
import {
    handleCuringTaskData,
    getIconType,
    genPopUpContent,
    handleCuringTaskMess
} from '../../auth';
// 养护任务类型图片
import curingTaskDrainImg from '../../CuringTaskImg/drain.png';
import curingTaskFeedImg from '../../CuringTaskImg/feed.png';
import curingTaskOtherImg from '../../CuringTaskImg/other.png';
import curingTaskReplantingImg from '../../CuringTaskImg/replanting.png';
import curingTaskTrimImg from '../../CuringTaskImg/trim.png';
import curingTaskWateringImg from '../../CuringTaskImg/watering.png';
import curingTaskWeedImg from '../../CuringTaskImg/weed.png';
import curingTaskWormImg from '../../CuringTaskImg/worm.png';
const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;

export default class CuringTaskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            timeType: 'today',
            searchData: [],
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
            curingTaskMessList: {} // 养护任务信息List
        };
    }

    // 养护任务类型
    curingTaskTypeOptions = [
        {
            id: 'curingTaskFeed',
            label: '施肥',
            img: curingTaskFeedImg
        },
        {
            id: 'curingTaskDrain',
            label: '排涝',
            img: curingTaskDrainImg
        },
        {
            id: 'curingTaskReplanting',
            label: '补植',
            img: curingTaskReplantingImg
        },
        {
            id: 'curingTaskWorm',
            label: '病虫害防治',
            img: curingTaskWormImg
        },
        {
            id: 'curingTaskTrim',
            label: '修剪',
            img: curingTaskTrimImg
        },
        {
            id: 'curingTaskWeed',
            label: '除草',
            img: curingTaskWeedImg
        },
        {
            id: 'curingTaskWatering',
            label: '浇水',
            img: curingTaskWateringImg
        },
        {
            id: 'curingTaskOther',
            label: '其他',
            img: curingTaskOtherImg
        }
    ]
    loop (p, loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime === 1) {
            if (p) {
                return (
                    <TreeNode
                        selectable={false}
                        title={p.Name}
                        key={p.ID}
                    >
                        {p.children &&
                            p.children.map(m => {
                                return that.loop(m, loopTime);
                            })}
                    </TreeNode>
                );
            }
        } else {
            if (p) {
                return (
                    <TreeNode
                        selectable={false}
                        title={`${p.CreateTime}-${p.CuringMans}`}
                        key={p.ID}
                    />
                );
            }
        }
    }

    componentDidMount = async () => {
        const {
            curingTaskTreeDay
        } = this.props;
        if (curingTaskTreeDay && curingTaskTreeDay instanceof Array && curingTaskTreeDay.length > 0) {
            await this.handleCuringTaskSearchData(curingTaskTreeDay);
        }
    }

    componentWillUnmount = async () => {
        await this.handleRemoveAllCuringTaskLayer();
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
            searchData,
            curingTaskComplete,
            curingTaskUnComplete
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
            for (let j = 0; j < searchData.length; j++) {
                const element = searchData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        return (
            <div>
                <div className='dashboard-menuPanel'>
                    <aside className='dashboard-aside' draggable='false'>
                        <div className='dashboard-asideTree'>
                            <Spin spinning={curingTaskTreeLoading}>
                                <div className='CuringTaskTree-button'>
                                    <Checkbox className='CuringTaskTree-button-layout'
                                        checked={curingTaskUnComplete}
                                        onChange={this.handleCuringTaskUnComplete.bind(this)}>
                                        未完成
                                    </Checkbox>
                                    <Checkbox className='CuringTaskTree-button-layout'
                                        checked={curingTaskComplete}
                                        onChange={this.handleCuringTaskComplete.bind(this)}>
                                        已完成
                                    </Checkbox>
                                </div>
                                <div className='CuringTaskTree-button'>
                                    <Button className='CuringTaskTree-button-layout' style={{marginRight: 10}}
                                        type={timeType === 'all' ? 'primary' : ''}
                                        id='all' onClick={this.handleTimeChange.bind(this)}>
                                        全部
                                    </Button>
                                    <Button className='CuringTaskTree-button-layout' id='today'
                                        type={timeType === 'today' ? 'primary' : ''}
                                        onClick={this.handleTimeChange.bind(this)}>
                                        今天
                                    </Button>
                                </div>
                                <div className='CuringTaskTree-button'>
                                    <Button className='CuringTaskTree-button-layout' style={{marginRight: 10}}
                                        type={timeType === 'week' ? 'primary' : ''}
                                        id='week' onClick={this.handleTimeChange.bind(this)}>
                                        一周内
                                    </Button>
                                    <Button className='CuringTaskTree-button-layout' id='custom'
                                        type={timeType === 'custom' ? 'primary' : ''}
                                        onClick={this.handleTimeChange.bind(this)}>
                                        自定义
                                    </Button>
                                </div>
                                {
                                    timeType === 'custom'
                                        ? <RangePicker
                                            style={{width: 220, marginBottom: 10}}
                                            showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                            format='YYYY-MM-DD HH:mm:ss'
                                            placeholder={['Start Time', 'End Time']}
                                            onChange={this.handleDateChange.bind(this)}
                                        />
                                        : ''
                                }
                                <div className='CuringTaskTree-statis-layout'>
                                    <span style={{verticalAlign: 'middle'}}>类型</span>
                                    <span className='CuringTaskTree-data-text'>
                                        数量
                                    </span>
                                </div>
                                <div>
                                    {
                                        contents.map((content) => {
                                            return (
                                                <div className='CuringTaskTree-mrg10' key={content.ID}>
                                                    <span style={{verticalAlign: 'middle'}}>{content.Name}</span>
                                                    <span className='CuringTaskTree-data-text'>
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
                    <div className='dashboard-menuSwitchCuringTaskTypeLayout'>
                        {
                            <div>
                                <div style={{display: 'inlineBlock', marginTop: 8}} />
                                {
                                    this.curingTaskTypeOptions.map((option) => {
                                        return (
                                            <div style={{display: 'inlineBlock', height: 20}} key={option.id}>
                                                <p className='dashboard-menuLabel1'>{option.label}</p>
                                                <img src={option.img}
                                                    title={option.label}
                                                    className='dashboard-rightMenuCuringTaskTypeImgLayout' />
                                                <a className={this.state[option.id] ? 'dashboard-rightMenuCuringTaskTypeSelLayout' : 'dashboard-rightMenuCuringTaskTypeUnSelLayout'}
                                                    title={option.label}
                                                    key={option.id}
                                                    onClick={this.handleCuringTaskTypeButton.bind(this, option)} />
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        }
                    </div>
                </div>
            </div>
        );
    }

    // 未整改
    handleCuringTaskUnComplete = (e) => {
        this.setState({
            curingTaskUnComplete: e.target.checked,
            curingTaskComplete: !e.target.checked
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleCuringTaskComplete = (e) => {
        this.setState({
            curingTaskComplete: e.target.checked,
            curingTaskUnComplete: !e.target.checked
        }, () => {
            this.query();
        });
    }

    handleTimeChange = (e) => {
        const {
            curingTaskComplete
        } = this.state;
        const {
            curingTaskTree
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
                    if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
                        if (curingTaskComplete) {
                            this.query();
                        } else {
                            this.handleCuringTaskSearchData(curingTaskTree);
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
                getCuring,
                getCuringTypes,
                getCuringTaskTree,
                getCuringTaskTreeLoading
            },
            curingTypes,
            curingTaskTree
        } = this.props;
        const {
            stime,
            etime,
            timeType,
            curingTaskUnComplete,
            curingTaskComplete
        } = this.state;
        try {
            if (!stime && !etime && curingTaskUnComplete && curingTaskTree) {
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
                        stime: stime,
                        etime: etime,
                        status: 0
                    };
                    let data1 = await getCuring({}, postdata1);
                    // 状态为退回
                    let postdata2 = {
                        stime: stime,
                        etime: etime,
                        status: 1
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
                    this.setState({
                        searchData: curingTaskTreeData
                    });
                } else {
                    // 状态为已上报
                    let postdata = {
                        stime: stime,
                        etime: etime,
                        status: 2
                    };
                    let curingTaskData = await getCuring({}, postdata);
                    let curingTasks = curingTaskData.content;
                    curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
                    await getCuringTaskTreeLoading(false);
                    await this.handleCuringTaskSearchData(curingTaskTreeData);
                    this.setState({
                        searchData: curingTaskTreeData
                    });
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
                str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
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
                L.popup({ maxWidth: 240 }).setContent(
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
                L.popup({ maxWidth: 240 }).setContent(
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
}

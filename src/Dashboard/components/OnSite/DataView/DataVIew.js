import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
import L from 'leaflet';
import moment from 'moment';
import Scrollbar from 'smooth-scrollbar';
import {PROJECTPOSITIONCENTER} from '_platform/api';
import {
    getDefaultProject
} from '_platform/auth';
import './DataView.less';
import decoration from './DataViewImg/decoration.png';
// 环境
import airQuality from './DataViewImg/空气质量.png';
import noise from './DataViewImg/噪音.png';
import temperature from './DataViewImg/温度.png';
import humidity from './DataViewImg/湿度.png';
// 统计
import person from './DataViewImg/人员.png';
import device from './DataViewImg/机械.png';
import nurseryTree from './DataViewImg/苗木出圃.png';
import locationTree from './DataViewImg/苗木定位.png';
import plantTree from './DataViewImg/苗木栽植.png';
import nurseryFacility from './DataViewImg/附属物出圃.png';
import locationFacility from './DataViewImg/附属物定位.png';
import intoFacility from './DataViewImg/附属物进场.png';

export default class DataView extends Component {
    constructor (props) {
        super(props);
        this.state = {
            projectNameSelect: '',
            treeDataSelect: [],
            workMansDay: 0,
            deviceDay: 0,
            workManTotal: 0,
            workManApproach: 0, // 进场人员
            workManAbsence: 0, // 缺勤人员
            plantTreeTotal: 0,
            nurseryTreeTotal: 0,
            nurseryInDataTotal: 0,
            locationTreeTotal: 0,
            nurseryTreeToday: 0,
            nurseryTreeInToday: 0,
            locationTreeToday: 0,
            plantTreeToday: 0
        };
    }
    // 环境监测
    environmentOptions = [
        {
            id: 'dataViewAirQuality',
            label: '空气质量',
            img: airQuality
        },
        {
            id: 'dataViewNoise',
            label: '噪音',
            img: noise
        },
        {
            id: 'dataViewTemperature',
            label: '温度',
            img: temperature
        },
        {
            id: 'dataViewHumidity',
            label: '湿度',
            img: humidity
        }
    ]
    // 数据统计
    statisticsOptions = [
        {
            id: 'dataViewPlantTree',
            label: '苗木栽植量',
            img: plantTree,
            today: 'plantTreeToday',
            total: 'plantTreeTotal'
        },
        {
            id: 'dataViewNurseryTree',
            label: '苗木出圃量',
            img: nurseryTree,
            today: 'nurseryTreeToday',
            total: 'nurseryTreeTotal'
        },
        {
            id: 'dataViewLocationTree',
            label: '苗木定位量',
            img: locationTree,
            today: 'locationTreeToday',
            total: 'locationTreeTotal'
        },
        // {
        //     id: 'dataViewNrseryFacility',
        //     label: '附属物出圃量',
        //     img: nurseryFacility,
        //     today: 'plantTreeToday',
        //     total: 'plantTreeTotal'
        // },
        // {
        //     id: 'dataViewIntoFacility',
        //     label: '附属物进场',
        //     img: intoFacility,
        //     today: 'plantTreeToday',
        //     total: 'plantTreeTotal'
        // },
        // {
        //     id: 'dataViewLocationFacility',
        //     label: '附属物定位',
        //     img: locationFacility,
        //     today: 'plantTreeToday',
        //     total: 'plantTreeTotal'
        // },
        {
            id: 'dataViewPerson',
            label: '人员投入',
            img: person,
            today: 'workManApproach',
            total: 'workManApproach'
        },
        {
            id: 'dataViewDevice',
            label: '机械投入',
            img: device,
            today: 'deviceDay',
            total: 'deviceDay'
        }
    ]
    componentDidMount = async () => {
        const {
            treeData
        } = this.props;
        if (document.querySelector('#DataViewAsideDom')) {
            let DataViewAsideDom = Scrollbar.init(document.querySelector('#DataViewAsideDom'));
            console.log('DataViewAsideDom', DataViewAsideDom);
        }
        let defaultProject = await getDefaultProject();
        let treeDataSelect = [];
        let projectNameSelect = '';
        treeData.map((child) => {
            if (child.No === defaultProject) {
                treeDataSelect = child.children;
                projectNameSelect = child.Name;
            }
        });
        this.setState({
            projectNameSelect,
            treeDataSelect
        });
        this.getWorkMansbyday(defaultProject);
        this.getDeviceWorksbyday(defaultProject);
        this.getStatworkmans(defaultProject);
        this.getTotalTreeStat(defaultProject);
        this.getNurSeryTotalStat(defaultProject);
        this.getTreeLocationByDayStat(defaultProject);
        this.getTreePlantByDayStat(defaultProject);
    }
    componentWillUnmount = async () => {
    }
    // 获取今日人员投入
    getWorkMansbyday = async (project) => {
        const {
            actions: { getWorkMansbyday }
        } = this.props;
        let rep = await getWorkMansbyday({}, {
            section: project,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        });
        if (rep && rep.code && rep.code === 200) {
            let data = rep.content;
            this.setState({
                workMansDay: data.length
            });
        }
    }
    // 获取今日机械投入
    getDeviceWorksbyday = async (project) => {
        const {
            actions: { getDeviceWorksbyday }
        } = this.props;
        let rep = await getDeviceWorksbyday({}, {
            section: project,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        });
        if (rep && rep.code && rep.code === 200) {
            let data = rep.content;
            this.setState({
                deviceDay: data.length
            });
        }
    }
    // 获取人员每日进离场统计
    getStatworkmans = async (project) => {
        const {
            actions: { getStatworkmans }
        } = this.props;
        let rep = await getStatworkmans({}, {
            section: project,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        });
        if (rep) {
            let Register, Approach, Absence, Attendance;
            for (let i = 0; i < rep.length; i++) {
                if (rep[i].Status === 0) {
                    Register = rep[i].Num;
                } else if (rep[i].Status === 1) {
                    Attendance = rep[i].Num;
                } else if (rep[i].Status === 2) {
                    Approach = rep[i].Num;
                } else if (rep[i].Status === 3) {
                    Absence = rep[i].Num;
                }
            }
            this.setState({
                workManTotal: Register + Attendance + Approach + Absence, // 人员总数
                workManApproach: Attendance + Approach, // 进场人员
                workManAbsence: Absence // 缺勤人员
            });
        }
    }
    // 获取苗木相关统计信息
    getTotalTreeStat = async (project) => {
        const {
            actions: { getTotalstat }
        } = this.props;
        // 载植量
        getTotalstat({}, {
            section: project,
            stattype: 'tree'
        }).then(rep => {
            if (rep || rep === 0) {
                this.setState({
                    plantTreeTotal: rep
                });
            }
        });
        // 出圃量
        getTotalstat({}, {
            section: project,
            stattype: 'outnursery'
        }).then(rep => {
            if (rep || rep === 0) {
                this.setState({
                    nurseryTreeTotal: rep
                });
            }
        });
        // 进场量
        getTotalstat({}, {
            section: project,
            stattype: 'nursery'
        }).then(rep => {
            if (rep || rep === 0) {
                this.setState({
                    nurseryInDataTotal: rep
                });
            }
        });
        // 定位量
        getTotalstat({}, {
            section: project,
            stattype: 'location'
        }).then(rep => {
            if (rep || rep === 0) {
                this.setState({
                    locationTreeTotal: rep
                });
            }
        });
    }
    // 获取苗圃出圃进场统计
    getNurSeryTotalStat = async (project) => {
        const {
            actions: { getNurserytotal }
        } = this.props;
        let rep = await getNurserytotal({}, {
            section: project
        });
        this.setState({
            nurseryTreeToday: (rep && rep.NurseryTodayNum) || 0, // 苗圃出圃
            nurseryTreeInToday: (rep && rep.NurseryTodayInNum) || 0 // 苗圃进场
        });
    }
    // 获取今日定位统计
    getTreeLocationByDayStat = async (project) => {
        const {
            actions: { getLocationStatByDay }
        } = this.props;
        let rep = await getLocationStatByDay({}, {
            section: project,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        });
        if (rep && rep instanceof Array) {
            let num = 0;
            rep.map((data) => {
                if (data.Num) {
                    num = num + data.Num;
                }
            });
            this.setState({
                locationTreeToday: num
            });
        }
    }
    // 获取今日栽植统计
    getTreePlantByDayStat = async (project) => {
        const {
            actions: { getTreePlantStatByDay }
        } = this.props;
        let rep = await getTreePlantStatByDay({}, {
            no: project,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59')
        });
        if (rep && rep instanceof Array) {
            let num = 0;
            rep.map((data) => {
                if (data.Num && data.Section.indexOf(project) !== -1) {
                    num = num + data.Num;
                }
            });
            this.setState({
                plantTreeToday: num
            });
        }
    }

    handleProjectChange = (project) => {
        const {
            map,
            treeData
        } = this.props;
        try {
            PROJECTPOSITIONCENTER.map(async (option) => {
                if (option.Name === project.Name) {
                    await map.panTo(option.center);
                    // 因先设置直接跳转,然后直接修改放大层级，无法展示，只能在跳转坐标之后，设置时间再重新修改放大层级
                    setTimeout(async () => {
                        await map.setZoom(option.Zoom);
                    }, 500);
                }
            });
            let treeDataSelect = [];
            treeData.map((child) => {
                if (child.No === project.No) {
                    treeDataSelect = child.children;
                }
            });
            this.setState({
                projectNameSelect: project.Name,
                treeDataSelect
            });
            this.getWorkMansbyday(project.No);
            this.getDeviceWorksbyday(project.No);
            this.getStatworkmans(project.No);
            this.getTotalTreeStat(project.No);
            this.getNurSeryTotalStat(project.No);
            this.getTreeLocationByDayStat(project.No);
            this.getTreePlantByDayStat(project.No);
        } catch (e) {
            console.log('handleProjectChange', e);
        };
    }

    render () {
        const {
            treeData = [],
            areaTreeLoading
        } = this.props;
        const {
            treeDataSelect,
            projectNameSelect
        } = this.state;
        return (
            <div className='DataViewPage-container'>
                <div className='DataViewPage-r-main'>
                    <div className={`DataViewPage-menuPanel`}>
                        <div className='DataViewPage-menuBackground' />
                        <aside className='DataViewPage-aside' id='DataViewAsideDom'>
                            <div className='DataViewPage-aside-Project'>
                                {
                                    treeData.map(project => {
                                        return <a key={project.No}
                                            title={project.Name}
                                            onClick={this.handleProjectChange.bind(this, project)}
                                            className={projectNameSelect === project.Name
                                                ? 'DataViewPage-aside-Project-textSel'
                                                : 'DataViewPage-aside-Project-text'}>
                                            {project.Name}
                                        </a>;
                                    })
                                }

                            </div>
                            <div className='DataViewPage-aside-dataView'>
                                {/* <div>
                                    <div className='DataViewPage-MenuNameLayout'>
                                        <img src={decoration} />
                                        <span className='DataViewPage-MenuName'>重要检测</span>
                                    </div>
                                    <div className='DataViewPage-asideTree'>
                                        <div className='DataViewPage-button'>
                                            {
                                                this.environmentOptions.map((option) => {
                                                    let imgurl = option.img;
                                                    let num = '';
                                                    return (<span key={option.label}
                                                        title={option.label}
                                                        className={'DataViewPage-button-layout'}
                                                        style={{
                                                            marginRight: 8,
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <span className='DataViewPage-button-layout-text'>{option.label}</span>
                                                        <img src={imgurl} className='DataViewPage-button-layout-img' />
                                                        <span className={'DataViewPage-button-layout-num'}>
                                                            {num}
                                                        </span>
                                                    </span>);
                                                })
                                            }
                                        </div>
                                    </div>
                                </div> */}

                                <div>
                                    <div className='DataViewPage-aside-statisLayout'>
                                        <div className='DataViewPage-MenuNameLayout-statis'>
                                            <img src={decoration} />
                                            <span className='DataViewPage-MenuName-statis-total'>总数</span>
                                        </div>
                                        <div className='DataViewPage-asideTree-statis'>
                                            <div className='DataViewPage-button-statis'>
                                                {
                                                    this.statisticsOptions.map((option) => {
                                                        let imgurl = option.img;
                                                        let num = 0;
                                                        if (this.state[option.total]) {
                                                            num = this.state[option.total];
                                                        }
                                                        return (<span key={option.label + 'total'}
                                                            title={option.label}
                                                            className={'DataViewPage-button-layout-statis'}
                                                            style={{
                                                                marginRight: 8,
                                                                marginTop: 8
                                                            }}
                                                        >
                                                            <span className='DataViewPage-button-layout-text-statis'>{option.label}</span>
                                                            <img src={imgurl} className='DataViewPage-button-layout-img-statis' />
                                                            <span className={'DataViewPage-button-layout-num-statis'}>
                                                                {num}
                                                            </span>
                                                        </span>);
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='DataViewPage-aside-statisLayout'>
                                        <div className='DataViewPage-MenuNameLayout-statis'>
                                            <img src={decoration} />
                                            <span className='DataViewPage-MenuName-statis-today'>今日</span>
                                        </div>
                                        <div className='DataViewPage-asideTree-statis'>
                                            <div className='DataViewPage-button-statis'>
                                                {
                                                    this.statisticsOptions.map((option) => {
                                                        let imgurl = option.img;
                                                        let num = 0;
                                                        if (this.state[option.today]) {
                                                            num = this.state[option.today];
                                                        }
                                                        return (<span key={option.label + 'today'}
                                                            title={option.label}
                                                            className={'DataViewPage-button-layout-statis'}
                                                            style={{
                                                                marginRight: 8,
                                                                marginTop: 8
                                                            }}
                                                        >
                                                            <span className='DataViewPage-button-layout-text-statis'>{option.label}</span>
                                                            <img src={imgurl} className='DataViewPage-button-layout-img-statis' />
                                                            <span className={'DataViewPage-button-layout-num-statis'}>
                                                                {num}
                                                            </span>
                                                        </span>);
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>

        );
    }
}

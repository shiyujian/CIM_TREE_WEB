import React, { Component } from 'react';
import {
    Table, Select, Spin, DatePicker, Notification
} from 'antd';
import './TaskStatis.less';
import TaskStatisEcharts from './TaskStatisEcharts';
import { getUser } from '_platform/auth';
import {getThinClass, getSmallClass, getSectionName} from '../auth';
import moment from 'moment';
import 'moment/locale/zh-cn';
const Option = Select.Option;
const {RangePicker} = DatePicker;
window.config = window.config || {};

export default class TaskStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            taskTotalData: [],
            totalThinClass: [],
            loading: false,
            curingTypes: [],
            typeOption: [],
            typeSelect: '',
            stime: '',
            etime: '',
            // stime: moment().format('YYYY-MM-DD 00:00:00'),
            // etime: moment().format('YYYY-MM-DD 23:59:59'),
            echartsChange: '',
            taskSearchData: []
        };
        this.totalThinClass = [];
        this.sections = [];
        this.section = '';
    }

    componentDidMount = async () => {
        this.user = getUser();
        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        if (this.sections && this.sections instanceof Array && this.sections.length > 0) {
            this.section = this.sections[0];
            await this._loadCuringTypes();
            await this._loadAreaData();
            await this._loadTaskData();
        } else {
            Notification.error({
                message: '当前用户未关联标段，不能进行查看',
                duration: 3
            });
        }
    }

    // 获取养护类型
    _loadCuringTypes = async () => {
        this.setState({
            loading: true
        });
        const {
            actions: { getcCuringTypes }
        } = this.props;
        let curingTypesData = await getcCuringTypes();
        let curingTypes = curingTypesData && curingTypesData.content;
        let typeOption = [];
        if (curingTypes && curingTypes.length > 0) {
            curingTypes.map((type) => {
                typeOption.push(<Option key={type.ID} value={type.ID} title={type.Base_Name} >{type.Base_Name}</Option>);
            });
            typeOption.unshift(<Option key={'1'} value={''}>全部</Option>);
            this.setState({
                curingTypes,
                typeOption
            });
        }
    }
    // 获取地块树数据
    async _loadAreaData () {
        const {
            actions: { getTreeNodeList, getLittleBan }
        } = this.props;
        try {
            let rst = await getTreeNodeList();
            // 子项目级
            let unitProjectList = [];
            if (rst instanceof Array && rst.length > 0) {
                rst.map(node => {
                    if (this.user.username === 'admin') {
                        if (node.Type === '子项目工程') {
                            unitProjectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                    } else if (this.section) {
                        let sectionArr = this.section.split('-');
                        let unitProjectKey = sectionArr[0] + '-' + sectionArr[1];
                        if (node.Type === '子项目工程' && node.No.indexOf(unitProjectKey) !== -1) {
                            unitProjectList.push({
                                Name: node.Name,
                                No: node.No,
                                Parent: node.Parent
                            });
                        }
                    }
                });
            }
            for (let i = 0; i < unitProjectList.length; i++) {
                let unitProject = unitProjectList[i];
                let list = await getLittleBan({ no: unitProject.No });
                let smallClassList = getSmallClass(list);
                let unitProjectThinArr = [];
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);
                    unitProjectThinArr = unitProjectThinArr.concat(thinClassList);
                });
                this.totalThinClass.push({
                    unitProject: unitProject.No,
                    thinClass: unitProjectThinArr
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    // 获取任务数据
    _loadTaskData = async () => {
        const {
            actions: {
                getCuring
            }
        } = this.props;
        const {
            curingTypes
        } = this.state;
        if (this.section) {
            let postData = {
                section: this.section
            };
            if (curingTypes && curingTypes.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                let curingTasks = curingTaskData.content;
                let taskTotalData = [];
                if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                    for (let i = 0; i < curingTasks.length; i++) {
                        let task = curingTasks[i];
                        if (task && task.ID) {
                            for (let t = 0; t < curingTypes.length; t++) {
                                let type = curingTypes[t];
                                if (type.ID === task.CuringType) {
                                    // 获取task的养护类型
                                    console.log('type.Base_Name', type.Base_Name);
                                    task.typeName = type.Base_Name;
                                    // 获取task的细班和标段名称
                                    let regionData = await this.getThinClassName(task);
                                    let sectionName = regionData.regionSectionName;
                                    let thinClassName = regionData.regionThinName;
                                    task.sectionName = sectionName;
                                    task.thinClassName = thinClassName;
                                    taskTotalData.push(task);
                                    console.log('taskTotalData', taskTotalData);
                                }
                            }
                        }
                    }
                    this.setState({
                        taskTotalData,
                        taskSearchData: taskTotalData,
                        loading: false,
                        echartsChange: moment().unix()
                    });
                    // curingTasks.map(async (task) => {
                    //     if (task && task.ID) {
                    //         await curingTypes.map(async (type) => {
                    //             if (type.ID === task.CuringType) {
                    //                 // 获取task的养护类型
                    //                 console.log('type.Base_Name', type.Base_Name);
                    //                 task.typeName = type.Base_Name;
                    //                 // 获取task的细班和标段名称
                    //                 let regionData = await this.getThinClassName(task);
                    //                 let sectionName = regionData.regionSectionName;
                    //                 let thinClassName = regionData.regionThinName;
                    //                 task.sectionName = sectionName;
                    //                 task.thinClassName = thinClassName;
                    //                 taskTotalData.push(task);
                    //                 console.log('taskTotalData', taskTotalData);
                    //                 this.setState({
                    //                     taskTotalData,
                    //                     taskSearchData: taskTotalData,
                    //                     loading: false,
                    //                     echartsChange: moment().unix()
                    //                 });
                    //             }
                    //         });
                    //     }
                    // });
                } else {
                    this.reSetState();
                }
            } else {
                this.reSetState();
            }
        } else {
            this.reSetState();
        }
    }

    reSetState () {
        this.setState({
            taskSearchData: [],
            loading: false,
            echartsChange: moment().unix()
        });
    }

    getThinClassName = async (task) => {
        try {
            let thinClass = task.ThinClass;
            let section = task.Section;
            let thinClassList = thinClass.split(',');
            let regionSectionName = '';
            let regionThinName = '';
            if (thinClassList && thinClassList instanceof Array && thinClassList.length > 0) {
                thinClassList.map((thinNo, index) => {
                    this.totalThinClass.map((unitProjectData) => {
                        let unitProject = unitProjectData.unitProject;
                        // 首先根据区块找到对应的细班list
                        if (section.indexOf(unitProject) !== -1) {
                            let children = unitProjectData.thinClass;
                            console.log('unitProjectData', unitProjectData);
                            children.map((child) => {
                            // tree结构的数据经过了处理，需要和api获取的数据调整一致
                                let handleKey = child.No.split('-');
                                let childNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                                let childSection = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                                if (thinNo.indexOf(childNo) !== -1 && childSection === section) {
                                // 找到符合条件的数据的name
                                    let name = child.Name;
                                    let sectionName = getSectionName(section);
                                    regionSectionName = sectionName;
                                    console.log('regionSectionName', regionSectionName);
                                    console.log('sectionName', sectionName);
                                    if (index === 0) {
                                        regionThinName = regionThinName + name;
                                    } else {
                                        regionThinName = regionThinName + ' ,' + name;
                                    }
                                }
                            });
                        }
                    });
                });
            }

            let regionData = {
                regionThinName: regionThinName,
                regionSectionName: regionSectionName
            };
            return regionData;
        } catch (e) {
            console.log('getThinClassName', e);
        }
    }

    render () {
        const {
            taskSearchData,
            loading,
            typeOption
        } = this.state;
        const {
            taskStatisGisVisible
        } = this.props;
        let display = 'block';
        if (taskStatisGisVisible) {
            display = 'none';
        }
        return (
            <div className='taskPage-container' style={{display: display}}>
                <Spin spinning={loading}>
                    <div className='taskSelect-container'>
                        <div className='Search-style'>
                            <span style={{width: 70}}>养护班组：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择养护类型'}
                                onSelect={this._handleTypeSelect.bind(this)}
                            >
                                {typeOption}
                            </Select>
                        </div>
                        <div className='Search-style'>
                            <span style={{width: 70}}>任务时间：</span>
                            <div className='DatePicker-width'>
                                <RangePicker
                                    style={{verticalAlign: 'middle', width: '100%'}}
                                    // defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                    format={'YYYY-MM-DD HH:mm:ss'}
                                    onChange={this.datepick.bind(this)}
                                />
                            </div>

                        </div>
                        <div className='Search-style'>
                            <span style={{width: 70}}>养护人员：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择养护人员'}
                            >
                                <Option key={'3'} value={'全部'}>全部</Option>
                            </Select>
                        </div>
                    </div>
                    <TaskStatisEcharts
                        {...this.props}
                        {...this.state} />
                    <Table
                        style={{width: '100%'}}
                        columns={this.columns}
                        dataSource={taskSearchData}
                        rowKey='ID'
                        pagination={{
                            pageSize: 5
                        }}
                    />
                </Spin>
            </div>

        );
    }

    _handleTypeSelect = (value) => {
        this.setState({
            typeSelect: value
        }, () => {
            this.queryTask();
        });
    }

    datepick (value) {
        console.log('datepickdatepick', value);
        let me = this;
        this.setState({
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        }, () => {
            me.queryTask();
        });
    }

    queryTask = async () => {
        const {
            actions: {
                getCuring
            }
        } = this.props;
        const {
            curingTypes,
            stime,
            etime,
            typeSelect
        } = this.state;
        console.log('this.section', this.section);
        console.log('curingTypes', curingTypes);
        if (this.section) {
            this.setState({
                loading: true
            });
            let postData = {
                section: this.section,
                stime: stime,
                etime: etime,
                curingtype: typeSelect
            };
            let taskSearchData = [];
            if (curingTypes && curingTypes.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                let curingTasks = curingTaskData.content;
                if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                    curingTasks.map(async (task) => {
                        if (task && task.ID) {
                            curingTypes.map(async (type) => {
                                if (type.ID === task.CuringType) {
                                    // 获取task的养护类型
                                    console.log('type.Base_Name', type.Base_Name);
                                    task.typeName = type.Base_Name;
                                    // 获取task的细班和标段名称
                                    let regionData = await this.getThinClassName(task);
                                    let sectionName = regionData.regionSectionName;
                                    let thinClassName = regionData.regionThinName;
                                    task.sectionName = sectionName;
                                    task.thinClassName = thinClassName;
                                    taskSearchData.push(task);
                                    console.log('taskSearchData', taskSearchData);
                                    this.setState({
                                        taskSearchData,
                                        loading: false,
                                        echartsChange: moment().unix()
                                    });
                                }
                            });
                        }
                    });
                } else {
                    this.reSetState();
                }
            } else {
                this.reSetState();
            }
        } else {
            Notification.error({
                message: '当前用户未关联标段，不能进行查看',
                duration: 3
            });
        }
    }

    handleGisView = (record) => {
        const {
            actions: {
                changeTaskStatisGisVisible,
                changeTaskStatisSelectTask
            }
        } = this.props;
        console.log('record', record);
        changeTaskStatisSelectTask(record);
        changeTaskStatisGisVisible(true);
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '类型',
            dataIndex: 'typeName'
        },
        {
            title: '细班',
            dataIndex: 'thinClassName',
            render: text => <div className='column'><span title={text} href='#'>{text}</span></div>
        },
        {
            title: '面积(m^2)',
            dataIndex: 'Area'
        },
        {
            title: '养护人员',
            dataIndex: 'CuringMans',
            render: text => <div className='column'><span title={text} href='#'>{text}</span></div>
        },
        {
            title: '创建人',
            dataIndex: 'CreaterObj.Full_Name'
        },
        {
            title: '创建时间',
            dataIndex: 'CreateTime',
            render: (text, record, index) => {
                if (text) {
                    try {
                        let timeArr = text.split(' ');
                        let time1 = timeArr[0];
                        let time2 = timeArr[1];
                        return (
                            <div>
                                <div>{time1}</div>
                                <div>{time2}</div>
                            </div>
                        );
                    } catch (e) {
                        console.log('处理时间', e);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: '预计开始时间',
            dataIndex: 'PlanStartTime',
            render: (text, record, index) => {
                if (text) {
                    try {
                        let timeArr = text.split(' ');
                        let time1 = timeArr[0];
                        let time2 = timeArr[1];
                        return (
                            <div>
                                <div>{time1}</div>
                                <div>{time2}</div>
                            </div>
                        );
                    } catch (e) {
                        console.log('处理时间', e);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: '预计结束时间',
            dataIndex: 'PlanEndTime',
            render: (text, record, index) => {
                if (text) {
                    try {
                        let timeArr = text.split(' ');
                        let time1 = timeArr[0];
                        let time2 = timeArr[1];
                        return (
                            <div>
                                <div>{time1}</div>
                                <div>{time2}</div>
                            </div>
                        );
                    } catch (e) {
                        console.log('处理时间', e);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: '实际开始时间',
            dataIndex: 'StartTime',
            render: (text, record, index) => {
                if (text) {
                    try {
                        let timeArr = text.split(' ');
                        let time1 = timeArr[0];
                        let time2 = timeArr[1];
                        return (
                            <div>
                                <div>{time1}</div>
                                <div>{time2}</div>
                            </div>
                        );
                    } catch (e) {
                        console.log('处理时间', e);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: '实际结束时间',
            dataIndex: 'EndTime',
            render: (text, record, index) => {
                if (text) {
                    try {
                        let timeArr = text.split(' ');
                        let time1 = timeArr[0];
                        let time2 = timeArr[1];
                        return (
                            <div>
                                <div>{time1}</div>
                                <div>{time2}</div>
                            </div>
                        );
                    } catch (e) {
                        console.log('处理时间', e);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <a onClick={this.handleGisView.bind(this, record)}>查看</a>
                );
            }
        }
    ]
}

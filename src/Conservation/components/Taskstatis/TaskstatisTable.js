import React, { Component } from 'react';
import {
    Table, Select, Spin, DatePicker, Notification, Row, Col, Button
} from 'antd';
import './TaskStatis.less';
import TaskStatisEcharts from './TaskStatisEcharts';
import PicViewModal from './PicViewModal';
import { getUser, getForestImgUrl, getSmallClass, getThinClass } from '_platform/auth';
import {getTaskThinClassName, getTaskStatus} from '../auth';
import moment from 'moment';
import 'moment/locale/zh-cn';
import XLSX from 'xlsx';
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class TaskStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            taskTotalData: [],
            loading: false,
            curingTypes: [],
            typeOption: [],
            typeSelect: '',
            stime: '',
            etime: '',
            timePicker: ['', ''],
            // stime: moment().format('YYYY-MM-DD 00:00:00'),
            // etime: moment().format('YYYY-MM-DD 23:59:59'),
            echartsChange: '',
            taskSearchData: [],
            imgSrcs: [],
            // 搜索项
            projectOption: [],
            sectionOption: [],
            smallClassOption: [],
            thinClassOption: [],
            // 选择项
            projectSelect: '',
            sectionSelect: '',
            smallClassSelect: '',
            thinClassSelect: '',
            smallClassSelectList: [],
            pagination: {},
            statisData: [],
            taskStatusSelect: ''
        };
        this.section = '';
        this.totalDataPer = false;
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
            title: '标段',
            dataIndex: 'sectionName',
            render: text => <div className='column'>
                <span title={text} href='#'>
                    {text}
                </span>
            </div>
        },
        {
            title: '小班',
            dataIndex: 'smallClassName',
            render: text => <div className='column'>
                <span title={text} href='#'>
                    {text}
                </span>
            </div>
        },
        {
            title: '细班',
            dataIndex: 'thinClassName',
            render: text => <div className='column'>
                <span title={text} href='#'>
                    {text}
                </span>
            </div>
        },
        {
            title: '面积(亩)',
            dataIndex: 'Area',
            render: text => {
                let number = text.toFixed(2);
                return (
                    <span title={number} href='#'>
                        {number}
                    </span>
                );
            }
        },
        {
            title: '养护人员',
            dataIndex: 'CuringMans',
            render: text => <div className='column'>
                <span title={text} href='#'>
                    {text}
                </span>
            </div>
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
                            <div style={{textAlign: 'center'}}>
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
                            <div style={{textAlign: 'center'}}>
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
                            <div style={{textAlign: 'center'}}>
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
                            <div style={{textAlign: 'center'}}>
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
                            <div style={{textAlign: 'center'}}>
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
            title: '状态',
            dataIndex: 'statusName',
            render: text => <div className='column'>
                <span title={text} href='#'>
                    {text}
                </span>
            </div>
        },
        {
            title: '图片',
            render: (text, record, index) => {
                if (record.Pics) {
                    return (<a onClick={this.handlePicView.bind(this, record)}>查看图片</a>);
                } else {
                    return (<span>无</span>);
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

    componentDidMount = async () => {
        try {
            const user = getUser();
            if (user.username === 'admin') {
                this.totalDataPer = true;
            }
            let userRoles = user.roles || '';
            if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('业主') !== -1) {
                this.totalDataPer = true;
            }
            this.section = user.section;
            if (this.section || this.totalDataPer) {
                await this._loadCuringTypes();
                await this._loadAreaData();
                await this._loadTaskData();
            } else {
                Notification.error({
                    message: '当前用户未关联标段，不能进行查看',
                    duration: 3
                });
            }
        } catch (e) {
            console.log('e', e);
        }
    }

    // 获取养护类型
    _loadCuringTypes = async () => {
        this.setState({
            loading: true
        });
        const {
            actions: { getCuringTypes }
        } = this.props;
        let curingTypesData = await getCuringTypes();
        let curingTypes = curingTypesData && curingTypesData.content;
        let typeOption = [];
        if (curingTypes && curingTypes.length > 0) {
            curingTypes.map((type) => {
                typeOption.push(<Option key={type.ID} value={type.ID} title={type.Base_Name} >{type.Base_Name}</Option>);
            });
            this.setState({
                curingTypes,
                typeOption
            });
        }
    }
    // 获取地块树数据
    async _loadAreaData () {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let projectList = [];
            let sectionList = [];
            let totalSectionList = [];
            let sectionOption = [];
            let sectionSelect = '';
            let rst = await getTreeNodeList();
            if (rst instanceof Array && rst.length > 0) {
                rst.map(node => {
                    if (this.totalDataPer) {
                        if (node.Type === '项目工程') {
                            projectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                        if (node.Type === '单位工程') {
                            sectionList.push({
                                Name: node.Name,
                                No: node.No
                            });
                            totalSectionList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                    } else if (this.section) {
                        let sectionArr = this.section.split('-');
                        let projectKey = sectionArr[0];
                        if (node.Type === '项目工程' && node.No.indexOf(projectKey) !== -1) {
                            projectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                        if (node.Type === '单位工程') {
                            totalSectionList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                        if (node.Type === '单位工程' && node.No.indexOf(this.section) !== -1) {
                            sectionList.push({
                                Name: node.Name,
                                No: node.No
                            });
                            sectionSelect = node.No;
                            sectionOption.push(
                                <Option key={node.No} value={node.No} title={node.Name}>
                                    {node.Name}
                                </Option>
                            );
                        }
                    }
                });
            }
            this.setProjectOption(projectList);
            if (tree && tree.totalThinClass && tree.totalThinClass instanceof Array && tree.totalThinClass.length > 0) {
                console.log('tree.totalThinClass', tree.totalThinClass);
            } else {
                let totalThinClass = [];
                for (let i = 0; i < totalSectionList.length; i++) {
                    let section = totalSectionList[i];
                    let sectionNo = section.No;
                    let sectionNoArr = sectionNo.split('-');
                    let parentNo = sectionNoArr[0] + '-' + sectionNoArr[1];
                    let list = await getThinClassList({ no: parentNo }, {section: sectionNoArr[2]});
                    let smallClassList = getSmallClass(list);
                    smallClassList.map(smallClass => {
                        let thinClassList = getThinClass(smallClass, list);
                        smallClass.children = thinClassList;
                    });
                    totalThinClass.push({
                        section: section.No,
                        smallClassList: smallClassList
                    });
                }
                // 获取所有的小班数据，用来计算养护任务的位置
                await getTotalThinClass(totalThinClass);
            }
            this.setState({
                projectList,
                sectionList,
                sectionOption,
                sectionSelect
            }, () => {
                this.setSmallClassOption();
            });
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
        let postData = {};
        if (this.section) {
            postData = {
                section: this.section
            };
        } else if (this.totalDataPer) {
        } else {
            this.reSetState();
            return;
        }
        postData.page = 1;
        postData.size = 5;
        this.handleQueryStat();
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
                                task.typeName = type.Base_Name;
                                task = this.handleTaskProperty(task);
                                taskTotalData.push(task);
                            }
                        }
                    }
                }
                const pagination = { ...this.state.pagination };
                pagination.total = curingTaskData.pageinfo.total;
                pagination.pageSize = 5;
                console.log('pagination', pagination);
                this.setState({
                    taskTotalData,
                    taskSearchData: taskTotalData,
                    loading: false,
                    echartsChange: moment().unix(),
                    pagination
                });
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
            echartsChange: moment().unix(),
            pagination: {
                pageSize: 5,
                total: 0,
                current: 1
            }
        });
    }
    // 设置项目选项
    setProjectOption (projectList) {
        try {
            if (projectList && projectList instanceof Array) {
                let projectOption = [];
                projectList.map((project) => {
                    projectOption.push(
                        <Option key={project.No} value={project.No} title={project.Name}>
                            {project.Name}
                        </Option>
                    );
                });
                this.setState({ projectOption: projectOption });
                if (!this.totalDataPer) {
                    this.setState({
                        projectSelect: projectList[0].No
                    });
                }
            }
        } catch (e) {
            console.log('设置项目', e);
        }
    }
    // 项目选择
    handleProjectChange = (value) => {
        const {
            sectionList
        } = this.state;
        console.log('value', value);
        this.setState({
            projectSelect: value
        });
        if (this.totalDataPer) {
            let sections = sectionList.filter(section => { return section.No.indexOf(value) !== -1; });
            console.log('sections', sections);
            this.setSectionOption(sections);
        }
    }
    // 设置标段选项
    setSectionOption (sections) {
        if (sections instanceof Array) {
            let sectionOption = [];
            sections.map(section => {
                sectionOption.push(
                    <Option key={section.No} value={section.No} title={section.Name}>
                        {section.Name}
                    </Option>
                );
            });
            this.setState({
                sectionOption: sectionOption,
                smallClassOption: [],
                thinClassOption: [],
                // 选择项
                sectionSelect: '',
                smallClassSelect: '',
                thinClassSelect: '',
                smallClassSelectList: []
            });
        }
    }
    // 标段选择
    handleSectionChange = (value) => {
        this.setState({
            sectionSelect: value
        }, () => {
            this.setSmallClassOption();
        });
    }
    // 设置小班选项
    setSmallClassOption = async () => {
        const {
            sectionSelect
        } = this.state;
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let smallClassSelectList = [];
            let smallClassOption = [];
            let sectionArr = sectionSelect.split('-');
            console.log('sectionArr', sectionArr);
            if (sectionArr && sectionArr instanceof Array && sectionArr.length === 3) {
                totalThinClass.map((sectionData) => {
                    if (sectionData.section === sectionSelect) {
                        let smallClassList = sectionData.smallClassList;
                        smallClassList.map((smallClass) => {
                            let smallClassHandleKey = smallClass.No.split('-');
                            let sectionNo = smallClassHandleKey[0] + '-' + smallClassHandleKey[1] + '-' + smallClassHandleKey[2];
                            if (sectionNo === sectionSelect) {
                                smallClassSelectList.push(smallClass);
                                smallClassOption.push(
                                    <Option key={smallClass.No} value={smallClass.No} title={smallClass.Name}>
                                        {smallClass.Name}
                                    </Option>
                                );
                            }
                        });
                    }
                });
                this.setState({
                    smallClassSelectList,
                    smallClassOption,
                    thinClassOption: [],
                    // 选择项
                    smallClassSelect: '',
                    thinClassSelect: ''
                });
            }
        } catch (e) {
            console.log('设置小班', e);
        }
    }
    // 小班选择
    handleSmallClassChange = (value) => {
        this.setState({
            smallClassSelect: value
        }, () => {
            this.setThinClassOption();
        });
    }
    // 设置细班选项
    setThinClassOption () {
        const {
            smallClassSelectList,
            smallClassSelect
        } = this.state;
        try {
            let thinClassOption = [];
            smallClassSelectList.map((smallClass) => {
                if (smallClassSelect === smallClass.No) {
                    let thinClassList = smallClass.children;
                    thinClassList.map((thinClass) => {
                        thinClassOption.push(
                            <Option key={thinClass.No} value={thinClass.No} title={thinClass.Name}>
                                {thinClass.Name}
                            </Option>
                        );
                    });
                }
            });
            this.setState({
                thinClassOption,
                thinClassSelect: ''
            });
        } catch (e) {
            console.log('设置细班', e);
        }
    }
    // 细班选择
    handleThinClassChange = (value) => {
        this.setState({
            thinClassSelect: value
        });
    }
    // 养护类型选择
    _handleTypeSelect = (value) => {
        this.setState({
            typeSelect: value
        });
    }
    // 计划日期选择
    datepick (value) {
        this.setState({
            timePicker: value,
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        });
    }
    // 状态选择
    handleTaskStatusChange (value) {
        this.setState({
            taskStatusSelect: value
        });
    }
    // 重置搜索条件
    handleResetSearch = () => {
        if (this.totalDataPer) {
            this.setState({
                // 搜索项
                sectionOption: [],
                smallClassOption: [],
                thinClassOption: [],
                // 选择项
                projectSelect: '',
                sectionSelect: '',
                smallClassSelect: '',
                thinClassSelect: '',
                taskStatusSelect: '',
                smallClassSelectList: [],
                stime: '',
                etime: '',
                typeSelect: '',
                timePicker: ['', '']
            }, () => {
                this.handleTableChange({current: 1});
            });
        } else {
            this.setState({
                // 搜索项
                thinClassOption: [],
                // 选择项
                smallClassSelect: '',
                thinClassSelect: '',
                taskStatusSelect: '',
                stime: '',
                etime: '',
                typeSelect: '',
                timePicker: ['', '']
            }, () => {
                this.handleTableChange({current: 1});
            });
        }
    }
    // 切换表格的页数
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.handleQuery(pagination.current);
    }
    // 搜索
    handleQuery = async (page) => {
        const {
            actions: {
                getCuring
            }
        } = this.props;
        const {
            curingTypes,
            stime,
            etime,
            typeSelect,
            projectSelect,
            sectionSelect,
            smallClassSelect,
            thinClassSelect,
            taskStatusSelect
        } = this.state;
        try {
            if (projectSelect && !sectionSelect && !smallClassSelect && !thinClassSelect) {
                Notification.error({
                    message: '请选择标段进行查询',
                    duration: 3
                });
                return;
            } else if (smallClassSelect && !thinClassSelect) {
                Notification.error({
                    message: '请选择细班进行查询',
                    duration: 3
                });
                return;
            }
            let thinclass = '';
            if (thinClassSelect) {
                let handleKeys = thinClassSelect.split('-');
                console.log('handleKeys', handleKeys);
                if (handleKeys && handleKeys instanceof Array && handleKeys.length === 5) {
                    thinclass = handleKeys[0] + '-' + handleKeys[1] + '-' + handleKeys[3] + '-' + handleKeys[4];
                }
            }
            let postData = {};
            console.log('thinclass', thinclass);
            if (this.section || this.totalDataPer) {
                postData = {
                    stime: stime,
                    etime: etime,
                    curingtype: typeSelect,
                    section: sectionSelect,
                    thinclass: thinclass,
                    status: taskStatusSelect,
                    page: page,
                    size: 5
                };
            } else {
                Notification.error({
                    message: '当前用户未关联标段，不能进行查看',
                    duration: 3
                });
                return;
            }
            this.setState({
                loading: true
            });
            this.handleQueryStat();
            let taskSearchData = [];
            if (curingTypes && curingTypes.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                let curingTasks = curingTaskData.content;
                if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                    for (let i = 0; i < curingTasks.length; i++) {
                        let task = curingTasks[i];
                        if (task && task.ID) {
                            for (let t = 0; t < curingTypes.length; t++) {
                                let type = curingTypes[t];
                                if (type.ID === task.CuringType) {
                                    // 获取task的养护类型
                                    task.typeName = type.Base_Name;
                                    task = this.handleTaskProperty(task);
                                    // if (taskStatusSelect) {
                                    //     if (task.statusName && task.statusName === taskStatusSelect) {
                                    //         taskSearchData.push(task);
                                    //     }
                                    // } else {
                                    //     taskSearchData.push(task);
                                    // }
                                    taskSearchData.push(task);
                                }
                            }
                        }
                    }
                    const pagination = { ...this.state.pagination };
                    pagination.total = curingTaskData.pageinfo.total;
                    pagination.pageSize = 5;
                    console.log('pagination', pagination);
                    // if (projectSelect && !sectionSelect && !smallClassSelect && !thinClassSelect) {
                    //     this.handleTaskProjectFilter(taskSearchData);
                    // } else if (smallClassSelect && !thinClassSelect) {
                    //     this.handleTaskSmallFilter(taskSearchData);
                    // } else {
                    //     this.setState({
                    //         taskSearchData,
                    //         loading: false,
                    //         echartsChange: moment().unix()
                    //     });
                    // }
                    console.log('taskSearchData', taskSearchData);
                    this.setState({
                        taskSearchData,
                        loading: false,
                        echartsChange: moment().unix(),
                        pagination
                    });
                } else {
                    this.reSetState();
                }
            } else {
                this.reSetState();
            }
        } catch (e) {

        }
    }
    // 获取任务统计
    handleQueryStat = async () => {
        try {
            const {
                actions: {
                    getcCuringStat
                }
            } = this.props;
            const {
                stime,
                etime,
                typeSelect,
                sectionSelect,
                thinClassSelect
            } = this.state;
            let thinclass = '';
            if (thinClassSelect) {
                let handleKeys = thinClassSelect.split('-');
                if (handleKeys && handleKeys instanceof Array && handleKeys.length === 5) {
                    thinclass = handleKeys[0] + '-' + handleKeys[1] + '-' + handleKeys[3] + '-' + handleKeys[4];
                }
            }
            let postData = {
                stime: stime,
                etime: etime,
                curingtype: typeSelect,
                section: sectionSelect,
                thinclass: thinclass,
                status: 2
            };
            let statisData = await getcCuringStat({}, postData);
            this.setState({
                statisData
            });
        } catch (e) {

        }
    }
    // 只选择了项目进行筛选
    handleTaskProjectFilter = (tasks) => {
        const {
            projectSelect
        } = this.state;
        try {
            let taskSearchData = [];
            tasks.map((task) => {
                let Section = task.Section;
                let sections = Section.split(' ,');
                sections.map((section) => {
                    if (section.indexOf(projectSelect) !== -1) {
                        taskSearchData.push(task);
                    }
                });
            });
            this.setState({
                taskSearchData,
                loading: false,
                echartsChange: moment().unix()
            });
        } catch (e) {

        }
    }
    // 选择了小班，没有选择细班进行筛选
    handleTaskSmallFilter = (tasks) => {
        const {
            smallClassSelect
        } = this.state;
        try {
            let taskSearchData = [];
            tasks.map((task) => {
                let regionSmallNo = task.regionSmallNo;
                let smallClassNoList = regionSmallNo.split(' ,');
                console.log('smallClassNoList', smallClassNoList);
                smallClassNoList.map((smallClass) => {
                    if (smallClass.indexOf(smallClassSelect) !== -1) {
                        taskSearchData.push(task);
                    }
                });
            });
            this.setState({
                taskSearchData,
                loading: false,
                echartsChange: moment().unix()
            });
        } catch (e) {

        }
    }
    // 点击查看任务按钮
    handleGisView = (record) => {
        const {
            actions: {
                changeTaskStatisGisVisible,
                changeTaskStatisSelectTask
            }
        } = this.props;
        changeTaskStatisSelectTask(record);
        changeTaskStatisGisVisible(true);
    }
    // 关闭查看图片弹窗
    handlePicCancel = () => {
        this.setState({
            imgSrcs: [],
            picViewVisible: false
        });
    }
    // 处理图片数据，并弹出图片弹窗
    handlePicView = (record) => {
        console.log('record', record);
        try {
            let data = record.Pics;
            let imgSrcs = [];
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                imgSrcs.push(src);
            });
            this.setState({
                imgSrcs,
                picViewVisible: true
            });
        } catch (e) {
            console.log('处理图片', e);
        }
    }
    // 处理任务的属性信息
    handleTaskProperty = (task) => {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let totalThinClass = tree.totalThinClass || [];
            let regionData = getTaskThinClassName(task, totalThinClass, bigTreeList);
            console.log('regionData', regionData);
            task.sectionName = regionData.regionSectionName || '';
            task.smallClassName = regionData.regionSmallName || '';
            task.regionSmallNo = regionData.regionSmallNo || '';
            task.thinClassName = regionData.regionThinName || '';
            let statusName = getTaskStatus(task);
            task.statusName = statusName;
            return task;
        } catch (e) {
            console.log('处理任务状态', e);
        }
    }

    handleExport = () => {
        let tblData = [];
        let statByTreetype = [];

        let _headers = ['序号', '标段', '施工单位', '监理单位'];
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        let output = Object.assign({}, headers, testttt);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, { '!ref': ref })
            }
        };
        XLSX.writeFile(wb, `养护统计.xlsx`);
    }

    render () {
        const {
            taskSearchData,
            loading,
            typeOption,
            picViewVisible,
            typeSelect,
            projectOption,
            sectionOption,
            smallClassOption,
            thinClassOption,
            projectSelect,
            sectionSelect,
            smallClassSelect,
            thinClassSelect,
            pagination,
            taskStatusSelect
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
                            <span className='taskTable-search-span'>项目：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择项目'}
                                value={projectSelect}
                                onChange={this.handleProjectChange.bind(this)}
                            >
                                {projectOption}
                            </Select>
                        </div>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>标段：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择标段'}
                                value={sectionSelect}
                                onChange={this.handleSectionChange.bind(this)}
                            >
                                {sectionOption}
                            </Select>
                        </div>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>小班：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择小班'}
                                value={smallClassSelect}
                                onChange={this.handleSmallClassChange.bind(this)}
                            >
                                {smallClassOption}
                            </Select>
                        </div>
                        <div>
                            <Button type='primary' style={{marginRight: 20}} onClick={this.handleTableChange.bind(this, {current: 1})}>查询</Button>
                        </div>
                    </div>
                    <div className='taskSelect-container'>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>细班：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择细班'}
                                value={thinClassSelect}
                                onChange={this.handleThinClassChange.bind(this)}
                            >
                                {thinClassOption}
                            </Select>
                        </div>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>养护类型：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择养护类型'}
                                value={typeSelect}
                                onSelect={this._handleTypeSelect.bind(this)}
                            >
                                {typeOption}
                            </Select>
                        </div>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>计划时间：</span>
                            <div className='DatePicker-width'>
                                <RangePicker
                                    style={{verticalAlign: 'middle', width: '100%'}}
                                    // defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                    format={'YYYY-MM-DD HH:mm:ss'}
                                    onChange={this.datepick.bind(this)}
                                    value={this.state.timePicker}
                                />
                            </div>
                        </div>
                        <div style={{marginRight: 83.84}} />
                        {/* <div>
                            <Button style={{marginRight: 20}} onClick={this.handleExport.bind(this)}>导出</Button>
                        </div> */}
                    </div>
                    <div className='taskSelect-container'>
                        <div className='Search-style'>
                            <span className='taskTable-search-span'>状态：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择状态'}
                                value={taskStatusSelect}
                                onChange={this.handleTaskStatusChange.bind(this)}
                            >
                                <Option key='全部' value={''} title='全部'>全部</Option>
                                <Option key='已上报' value={2} title='已上报'>已上报</Option>
                            </Select>
                        </div>
                        <div className='Search-style' />
                        <div className='Search-style' />
                        <div>
                            <Button style={{marginRight: 20}} onClick={this.handleResetSearch.bind(this)}>重置</Button>
                        </div>
                    </div>
                    <div className='echartsClass'>
                        <TaskStatisEcharts
                            {...this.props}
                            {...this.state} />
                    </div>

                    <Table
                        columns={this.columns}
                        dataSource={taskSearchData}
                        rowKey='ID'
                        onChange={this.handleTableChange.bind(this)}
                        pagination={pagination}
                    />
                    {
                        picViewVisible
                            ? (<PicViewModal
                                {...this.state}
                                onCancel={this.handlePicCancel.bind(this)}
                            />)
                            : ''
                    }
                </Spin>
            </div>

        );
    }
}

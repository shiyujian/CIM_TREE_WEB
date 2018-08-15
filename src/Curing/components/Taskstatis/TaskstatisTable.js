import React, { Component } from 'react';
import {
    Table, Select, Spin, DatePicker, Notification, Row, Col, Button
} from 'antd';
import './TaskStatis.less';
import TaskStatisEcharts from './TaskStatisEcharts';
import PicViewModal from './PicViewModal';
import { getUser } from '_platform/auth';
import { FOREST_API } from '_platform/api';
import {getSmallClass, getThinClass, getSectionName, getTaskThinClassName} from '../auth';
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

            smallClassSelectList: []
        };
        this.totalThinClass = [];
        this.sections = [];
        this.section = '';
        this.totalDataPer = false;
    }

    componentDidMount = async () => {
        try {
            let text = window.localStorage.getItem('QH_USER_DATA');
            text = JSON.parse(text);
            console.log('text', text);
            this.user = getUser();
            if (text.username === 'admin') {
                this.totalDataPer = true;
            }
            let groups = text.groups || [];
            groups.map((group) => {
                if (group.name.indexOf('业主') !== -1) {
                    this.totalDataPer = true;
                }
            });
            let sections = this.user.sections;
            this.sections = JSON.parse(sections);
            console.log('this.totalDataPer', this.totalDataPer);
            if ((this.sections && this.sections instanceof Array && this.sections.length > 0) || this.totalDataPer) {
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
            actions: { getcCuringTypes }
        } = this.props;
        let curingTypesData = await getcCuringTypes();
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
            actions: { getTreeNodeList, getLittleBan }
        } = this.props;
        try {
            let projectList = [];
            let sectionList = [];
            let sectionOption = [];
            let sectionSelect = '';
            let rst = await getTreeNodeList();
            // 子项目级
            let unitProjectList = [];
            if (rst instanceof Array && rst.length > 0) {
                rst.map(node => {
                    if (this.totalDataPer) {
                        if (node.Type === '项目工程') {
                            projectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                        if (node.Type === '子项目工程') {
                            unitProjectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        }
                        if (node.Type === '单位工程') {
                            sectionList.push({
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
                        let unitProjectKey = sectionArr[0] + '-' + sectionArr[1];
                        if (node.Type === '子项目工程' && node.No.indexOf(unitProjectKey) !== -1) {
                            unitProjectList.push({
                                Name: node.Name,
                                No: node.No,
                                Parent: node.Parent
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
            for (let i = 0; i < unitProjectList.length; i++) {
                let unitProject = unitProjectList[i];
                let list = await getLittleBan({ no: unitProject.No });
                let smallClassList = getSmallClass(list);
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);
                    smallClass.children = thinClassList;
                });
                this.totalThinClass.push({
                    unitProject: unitProject.No,
                    smallClassList: smallClassList
                });
            }
            this.setState({
                projectList,
                sectionList,
                sectionOption,
                sectionSelect
            }, () => {
                this.setSmallClassOption();
            });
            console.log('this.totalThinClass', this.totalThinClass);
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
            postData = {};
        } else {
            this.reSetState();
            return;
        }
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
                                // 获取task的细班和标段名称
                                let regionData = getTaskThinClassName(task, this.totalThinClass);
                                console.log('regionData', regionData);
                                task.sectionName = regionData.regionSectionName || '';
                                task.regionSmallName = regionData.regionSmallName || '';
                                task.regionSmallNo = regionData.regionSmallNo || '';
                                task.thinClassName = regionData.regionThinName || '';
                                taskTotalData.push(task);
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

    render () {
        const {
            taskSearchData,
            loading,
            typeOption,
            picViewVisible,
            typeSelect,
            stime,
            etime,
            projectOption,
            sectionOption,
            smallClassOption,
            thinClassOption,
            projectSelect,
            sectionSelect,
            smallClassSelect,
            thinClassSelect
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
                            <Button type='primary' style={{marginRight: 20}} onClick={this.handleQuery.bind(this)}>查询</Button>
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
                        <div>
                            <Button style={{marginRight: 20}} onClick={this.handleResetSearch.bind(this)}>重置</Button>
                        </div>
                        {/* <div className='Search-style'>
                            <span className='taskTable-search-span'>养护人员：</span>
                            <Select
                                className='Select-width'
                                placeholder={'请选择养护人员'}
                            >
                                <Option key={'3'} value={'全部'}>全部</Option>
                            </Select>
                        </div> */}
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
        try {
            let smallClassSelectList = [];
            let smallClassOption = [];
            let sectionArr = sectionSelect.split('-');
            console.log('sectionArr', sectionArr);
            if (sectionArr && sectionArr instanceof Array && sectionArr.length === 3) {
                let unitProjectKey = sectionArr[0] + '-' + sectionArr[1];
                this.totalThinClass.map((unitProjectData) => {
                    if (unitProjectData.unitProject === unitProjectKey) {
                        let smallClassList = unitProjectData.smallClassList;
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

    _handleTypeSelect = (value) => {
        this.setState({
            typeSelect: value
        });
    }

    datepick (value) {
        let me = this;
        this.setState({
            timePicker: value,
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        });
    }

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
                smallClassSelectList: [],
                stime: '',
                etime: '',
                typeSelect: '',
                timePicker: ['', '']
            }, () => {
                this.handleQuery();
            });
        } else {
            this.setState({
                // 搜索项
                thinClassOption: [],
                // 选择项
                smallClassSelect: '',
                thinClassSelect: '',
                stime: '',
                etime: '',
                typeSelect: '',
                timePicker: ['', '']
            }, () => {
                this.handleQuery();
            });
        }
    }

    handleQuery = async () => {
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
            thinClassSelect
        } = this.state;
        try {
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
            if (this.section) {
                postData = {
                    section: this.section,
                    stime: stime,
                    etime: etime,
                    curingtype: typeSelect,
                    section: sectionSelect,
                    thinclass: thinclass
                };
            } else if (this.totalDataPer) {
                postData = {
                    stime: stime,
                    etime: etime,
                    curingtype: typeSelect,
                    section: sectionSelect,
                    thinclass: thinclass
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
                                    // 获取task的细班和标段名称
                                    let regionData = getTaskThinClassName(task, this.totalThinClass);
                                    console.log('regionData', regionData);
                                    task.sectionName = regionData.regionSectionName || '';
                                    task.regionSmallName = regionData.regionSmallName || '';
                                    task.regionSmallNo = regionData.regionSmallNo || '';
                                    task.thinClassName = regionData.regionThinName || '';
                                    taskSearchData.push(task);
                                }
                            }
                        }
                    }
                    if (projectSelect && !sectionSelect && !smallClassSelect && !thinClassSelect) {
                        this.handleTaskProjectFilter(taskSearchData);
                    } else if (smallClassSelect && !thinClassSelect) {
                        this.handleTaskSmallFilter(taskSearchData);
                    } else {
                        this.setState({
                            taskSearchData,
                            loading: false,
                            echartsChange: moment().unix()
                        });
                    }
                } else {
                    this.reSetState();
                }
            } else {
                this.reSetState();
            }
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

    handlePicCancel = () => {
        this.setState({
            imgSrcs: [],
            picViewVisible: false
        });
    }

    handlePicView = (record) => {
        console.log('record', record);
        try {
            let data = record.Pics;
            let imgSrcs = [];
            let arr = data.split(',');
            arr.map(rst => {
                let src = rst.replace(/\/\//g, '/');
                src = `${FOREST_API}/${src}`;
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
            title: '面积(亩)',
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
}

import React, { Component } from 'react';
import {
    Steps,
    Card,
    Input,
    Form,
    Button
} from 'antd';
import moment from 'moment';
import {
    ActualFormOrigin,
    WeekFormOrigin,
    WeekForm,
    WeekDetail,
    TotalDetail,
    TotalForm,
    ActualForm,
    ActualDetail
} from './FormDetail';
import { getUser } from '_platform/auth';
import {
    WEEK_ID,
    ACYUAL_ID,
    WFStatusList,
    ExecuteStateList,
    TOTAL_ID
} from '_platform/api';
const { Step } = Steps;
const FormItem = Form.Item;
class TaskDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            startDate: '', // 开始日期
            endDate: '', // 结束日期
            WFState: '', // 流程状态
            flowList: [], // 流程列表
            Starter: '', // 发起人ID
            FlowID: '', // 流程ID
            FlowName: '', // 流程名称
            originNodeID: '', // 起点ID
            originNodeName: '', // 起点名称
            WorkID: '', // 任务ID
            CurrentNode: '', // 当前节点
            CurrentNodeName: '', // 当前节点名称
            Executor: '', // 当前节点执行人
            TableList: [], // 表格数据
            ownerList: [], // 业主执行人
            auditorList: [], // 监理执行人
            param: {}, // 表单数据
            workFlow: [], // 任务流程
            workDetails: '' // 任务详情
        };
        this.getNextPeople = this.getNextPeople.bind(this); // 获取业主文书-下一执行人
        this.getWorkDetails = this.getWorkDetails.bind(this); // 获取任务详情
        this.onBack = this.onBack.bind(this); // 返回
    }
    componentDidMount () {
        this.getOriginNode(); // 获取流程起点ID
        this.getWorkDetails(); // 获取任务详情
        this.getNextPeople(); // 获取业主文书列表
    }
    getOriginNode () {
        const { getNodeList } = this.props.actions;
        const { actualID } = this.state;
        getNodeList({}, {
            flowid: actualID, // 流程ID
            name: '', // 节点名称
            type: 1, // 节点类型
            status: 1 // 节点状态
        }).then(rep => {
            if (rep.length === 1) {
                this.setState({
                    originNodeID: rep[0].ID,
                    originNodeName: rep[0].Name
                });
            }
        });
    }
    getNextPeople = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let user = await getUser();
        let roles = await getRoles();
        let ownerID = ''; // 业主文书ID
        let supervisorID = ''; // 监理文书ID
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '业主文书') {
                ownerID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '监理文书') {
                supervisorID = role.ID;
            }
        });
        console.log('业主文书列表.ID', ownerID, supervisorID);
        let ownerList = [], auditorList = [];
        getUsers({}, {
            keyword: '',
            role: ownerID,
            status: 1,
            page: 1,
            page_size: 20
        }).then(rep => {
            ownerList = rep.content;
            console.log('业主文书列表', rep);
            this.setState({
                ownerList
            });
        });
        getUsers({}, {
            role: supervisorID,
            section: user.section,
            status: 1,
            page: '',
            size: ''
        }).then(rep => {
            auditorList = rep.content;
            console.log('监理文书列表', rep);
            this.setState({
                auditorList
            });
        });
    }
    // getNextPeople = async () => {
    //     const {
    //         actions: {
    //             getUsers,
    //             getRoles
    //         }
    //     } = this.props;

    //     let roles = await getRoles();
    //     console.log('身份---------------', roles);
    //     let postRoleData = [];
    //     roles.map((role) => {
    //         if (role && role.ID && role.ParentID && role.RoleName === '业主文书') {
    //             postRoleData = role.ID;
    //         }
    //     });
    //     console.log('身份postRoleData', postRoleData);
    //     try {
    //         let results = [];
    //         await OWNERCHECKLIST.map(async (owner) => {
    //             let postdata = {
    //                 keyword: owner,
    //                 role: postRoleData,
    //                 status: 1,
    //                 page: 1,
    //                 page_size: 20
    //             };
    //             let userList = await getUsers({}, postdata);
    //             console.log('身份userList', userList);
    //             if (userList && userList.code && userList.code === 200) {
    //                 results = results.concat((userList && userList.content) || []);
    //                 let total = userList.pageinfo.total;
    //                 if (total > 20) {
    //                     for (let i = 0; i < (total / 20) - 1; i++) {
    //                         postdata = {
    //                             keyword: owner,
    //                             role: postRoleData,
    //                             status: 1,
    //                             page: i + 2,
    //                             page_size: 20
    //                         };
    //                         let datas = await getUsers({}, postdata);
    //                         if (datas && datas.code && datas.code === 200) {
    //                             results = results.concat((datas && datas.content) || []);
    //                         }
    //                     }
    //                 }
    //             }
    //             console.log('results', results);
    //             this.setState({
    //                 users: results
    //             });
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    getWorkDetails () {
        const { getWorkDetails } = this.props.actions;
        const { task_id = '' } = this.props.match.params;
        this.props.actions.setTaskDetailLoading(true);
        getWorkDetails({
            ID: task_id
        }, {}).then(rep => {
            let FormParams = [];
            if (rep.FormValues && rep.FormValues.length > 0 && rep.FormValues[0].FormParams) {
                FormParams = rep.FormValues[0].FormParams;
            }
            let param = {};
            let TableList = [];
            FormParams.map(item => {
                if (item.Key === 'TableInfo') {
                    TableList = JSON.parse(item.Val);
                } else {
                    param[item.Key] = item.Val;
                }
            });
            this.props.actions.setTaskDetailLoading(false);
            console.log('流程详情', rep.WFState);
            this.setState({
                startDate: param.StartDate || '',
                endDate: param.EndDate || '',
                Section: param.Section,
                WorkID: task_id,
                WFState: rep.WFState,
                CurrentNode: rep.CurrentNode,
                CurrentNodeName: rep.CurrentNodeName,
                Executor: rep.NextExecutor,
                FlowID: rep.FlowID,
                FlowName: rep.FlowName,
                Starter: rep.Starter,
                param,
                workDetails: rep,
                TableList,
                workFlow: rep.Works
            });
        });
    }
    handlePlanTreeNumChage (index, value) {
        const {
            TableList
        } = this.state;
        try {
            TableList[index].planTreeNum = value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    handleActualNumChange (index, value) {
        const {
            TableList
        } = this.state;
        try {
            TableList[index].actualNum = value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    setTableDate (startDate, endDate) {
        let start = new Date(startDate).getTime();
        let end = new Date(endDate).getTime();
        let TableList = [];
        for (let id = 0; start <= end; start += 86400000, id++) {
            let tmp = new Date(start);
            TableList.push({
                ID: id,
                date: moment(tmp).format('YYYY-MM-DD')
            });
        }
        console.log('表格数据', TableList, startDate, endDate);
        this.setState({
            TableList,
            startDate,
            endDate
        });
    }
    handleTodayDate (date, dateString) {
        const { param } = this.state;
        this.setState({
            param: {
                ...param,
                TodayDate: dateString
            }
        });
    }
    getFormDetails () {
        let node = '';
        const { FlowName, TableList, param, WFState } = this.state;
        console.log('流程列表', FlowName);
        if (FlowName === '总计划进度填报流程') {
            node = <TotalDetail
                param={param}
                TableList={TableList}
            />;
        } else if (FlowName === '每周进度填报流程') {
            node = <WeekDetail
                param={param}
                setTableDate={this.setTableDate.bind(this)}
                handlePlanTreeNumChage={this.handlePlanTreeNumChage.bind(this)}
                WFState={WFState}
                TableList={TableList}
            />;
        } else if (FlowName === '每日进度填报流程') {
            node = <ActualDetail
                param={param}
                handleTodayDate={this.handleTodayDate.bind(this)}
                handleActualNumChange={this.handleActualNumChange.bind(this)}
                WFState={WFState}
                TableList={TableList}
            />;
        }
        return node;
    }
    getFormItem = (item) => {
        let node = '';
        const { FlowName, CurrentNodeName } = this.state;
        if (FlowName === '总计划进度填报流程') {
            node = <TotalForm
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowName === '每日进度填报流程' && CurrentNodeName === '施工填报') {
            node = <ActualFormOrigin
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowName === '每日进度填报流程') {
            node = <ActualForm
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowName === '每周进度填报流程' && CurrentNodeName === '施工填报') {
            node = <WeekFormOrigin
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowName === '每周进度填报流程') {
            node = <WeekForm
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        }
        return node;
    }
    render () {
        const { workDetails, workFlow, TableList, param } = this.state;
        return (
            <div>
                <div className='info'>
                    <div style={{ textAlign: 'center', fontSize: 20 }}>
                        {workDetails.FlowName}
                    </div>
                    <div style={{textAlign: 'center', fontSize: 12, color: '#999999'}}>
                        <span>
                            发起人：{workDetails.StarterObj && workDetails.StarterObj.Full_Name}
                        </span>
                        <span style={{ paddingLeft: 40 }}>
                            {WFStatusList.map(item => {
                                if (item.value === workDetails.WFState) {
                                    return '当前状态：' + item.label;
                                }
                            })}
                        </span>
                    </div>
                    <Button type='primary' onClick={this.onBack.bind(this)}>
                        返回
                    </Button>
                </div>
                <div className='form'>
                    <Card title={'流程详情'} style={{ marginTop: 10 }}>
                        {
                            TableList.length > 0 ? this.getFormDetails() : ''
                        }
                    </Card>
                </div>
                <div>
                    <Card title={'审批流程'} style={{ marginTop: 10 }}>
                        <Steps
                            direction='vertical'
                            size='small'
                            current={workFlow.length - 1}
                        >
                            {workFlow.map(item => {
                                if (item.ExecuteState === 1) {
                                    // 已完成
                                    return <Step title={
                                        <div>
                                            <span>{item.CurrentNodeName}</span>
                                            <span style={{marginLeft: 10}}>-({
                                                ExecuteStateList.map(row => {
                                                    if (row.value === item.ExecuteState) {
                                                        return row.label;
                                                    }
                                                })
                                            })</span>
                                        </div>
                                    } description={<div>
                                        {
                                            item.CurrentNodeName !== '施工填报' ? <div>
                                                {
                                                    item.FormValues && item.FormValues.length ? <div>意见：{
                                                        item.FormValues[0].FormParams && item.FormValues[0].FormParams.length && item.FormValues[0].FormParams[0].Val
                                                    }</div> : ''
                                                }
                                            </div> : ''
                                        }
                                        <div>
                                            <span>
                                                {item.CurrentNodeName}人：
                                                {item.ExecutorObj && item.ExecutorObj.Full_Name}({item.ExecutorObj && item.ExecutorObj.User_Name})
                                            </span>
                                            <span style={{marginLeft: 20}}>
                                                {item.CurrentNodeName}时间：
                                                {item.RunTime}
                                            </span>
                                        </div>
                                    </div>} />;
                                } else if (item.ExecuteState === 2) {
                                    // 退回
                                    return <Step title={
                                        <div>
                                            <span>{item.CurrentNodeName}</span>
                                            <span style={{marginLeft: 10}}>-({
                                                ExecuteStateList.map(row => {
                                                    if (row.value === item.ExecuteState) {
                                                        return row.label;
                                                    }
                                                })
                                            })</span>
                                        </div>
                                    } description={<div>
                                        {
                                            item.CurrentNodeName !== '施工填报' ? <div>
                                                {
                                                    item.FormValues && item.FormValues.length ? <div>意见：{
                                                        item.FormValues[0].FormParams && item.FormValues[0].FormParams.length && item.FormValues[0].FormParams[0].Val
                                                    }</div> : ''
                                                }
                                            </div> : ''
                                        }
                                        <div>
                                            <span>
                                                {item.CurrentNodeName}人：
                                                {item.ExecutorObj && item.ExecutorObj.Full_Name}({item.ExecutorObj && item.ExecutorObj.User_Name})
                                            </span>
                                            <span style={{marginLeft: 20}}>
                                                {item.CurrentNodeName}时间：
                                                {item.RunTime}
                                            </span>
                                        </div>
                                    </div>} />;
                                } else {
                                    if (item.ExecutorObj) {
                                        if (item.ExecutorObj && item.ExecutorObj.ID === getUser().ID) {
                                            // 已执行
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-({
                                                        ExecuteStateList.map(row => {
                                                            if (row.value === item.ExecuteState) {
                                                                return row.label;
                                                            }
                                                        })
                                                    })</span>
                                                    <span style={{marginLeft: 20}}>
                                                        当前执行人：
                                                        <span style={{color: '#108ee9'}}>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                                    </span>
                                                </div>
                                            } description={
                                                <div>
                                                    { this.getFormItem(item) }
                                                </div>
                                            } />;
                                        } else {
                                            // 未执行
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-(未执行)</span>
                                                    <span style={{marginLeft: 20}}>
                                                        当前执行人：
                                                        <span style={{color: '#108ee9'}}>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                                    </span>
                                                </div>
                                            } />;
                                        }
                                    } else {
                                        // 已结束
                                        return <Step title={
                                            <div>
                                                <span>{item.CurrentNodeName}</span>
                                                <span style={{marginLeft: 10}}>-(已结束)</span>
                                            </div>
                                        } />;
                                    }
                                }
                            })}
                        </Steps>
                    </Card>
                </div>
            </div>
        );
    }
    onBack () {
        let to = `/selfcare/task`;
        this.props.history.push(to);
    }
}
export default TaskDetail;

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
            Starter: '', // 发起人ID
            FlowID: '', // 流程ID
            FlowName: '', // 流程名称
            WorkID: '', // 任务ID
            CurrentNode: '', // 当前节点
            CurrentNodeName: '', // 当前节点名称
            Executor: '', // 当前节点执行人
            TableList: [], // 表格数据
            NextPeopleList: [], // 下一执行人
            param: {}, // 表单数据
            workFlow: [], // 任务流程
            workDetails: '' // 任务详情
        };
        this.getNextPeople = this.getNextPeople.bind(this); // 获取业主文书-下一执行人
        this.getWorkDetails = this.getWorkDetails.bind(this); // 获取任务详情
        this.onBack = this.onBack.bind(this); // 返回
    }
    componentDidMount () {
        this.getWorkDetails();
        this.getNextPeople();
    }
    getNextPeople = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let roles = await getRoles();
        let postRoleData = ''; // 业主文书ID
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '业主文书') {
                postRoleData = role.ID;
            }
        });
        let NextPeopleList = [];
        let postdata = {
            keyword: '',
            role: postRoleData,
            status: 1,
            page: 1,
            page_size: 20
        };
        getUsers({}, postdata).then(rep => {
            NextPeopleList = rep.content;
            console.log('业主文书列表', NextPeopleList);
            this.setState({
                NextPeopleList
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
            this.setState({
                WorkID: task_id,
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
    getFormDetails () {
        let node = '';
        const { FlowID, TableList, param } = this.state;
        // console.log(FlowID, WEEK_ID);
        if (FlowID === TOTAL_ID) {
            node = <TotalDetail
                param={param}
                TableList={TableList}
            />;
        } else if (FlowID === WEEK_ID) {
            node = <WeekDetail
                param={param}
                TableList={TableList}
            />;
        } else if (FlowID === ACYUAL_ID) {
            node = <ActualDetail
                param={param}
                TableList={TableList}
            />;
        }
        return node;
    }
    getFormItem = (item) => {
        let node = '';
        const { FlowID } = this.state;
        if (FlowID === TOTAL_ID) {
            node = <TotalForm
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowID === ACYUAL_ID) {
            node = <ActualForm
                onBack={this.onBack.bind(this)}
                {...this.props}
                {...this.state}
            />;
        } else if (FlowID === WEEK_ID) {
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
                                    } description={
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
                                    } />;
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
                                    } />;
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
    handleSubmit () {

    }
    handleReject () {

    }
}
export default TaskDetail;

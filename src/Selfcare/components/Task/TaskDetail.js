import React, { Component } from 'react';
import {
    Steps,
    Card,
    Button
} from 'antd';
import moment from 'moment';
import { WFStatusList } from '../common';
const { Step } = Steps;
class TaskDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            task_id: '', // 任务ID
            TableList: [], // 表格数据
            workFlow: [], // 任务流程
            workDetails: '' // 任务详情
        };
    }
    componentDidMount () {
        this.getWorkDetails();
    }
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
            console.log('任务详情', rep.Works);
            this.setState({
                workDetails: rep,
                TableList,
                workFlow: rep.Works.reverse()
            });
        });
    }
    render () {
        const { workDetails, workFlow } = this.state;
        return (
            <div>
                <div className='info'>
                    <div style={{ textAlign: 'center', fontSize: 20 }}>
                        {workDetails.Title}
                    </div>
                    <div style={{textAlign: 'center', fontSize: 12, color: '#999999'}}>
                        <span>
                            发起人：{workDetails.StarterObj && workDetails.StarterObj.Full_Name}
                        </span>
                        <span style={{ paddingLeft: 40 }}>
                            当前状态：{WFStatusList.map(item => {
                                if (item.value === workDetails.WFState) {
                                    return item.label;
                                }
                            })}
                        </span>
                    </div>
                    <Button type='primary' onClick={this.backClick.bind(this)}>
                        返回
                    </Button>
                </div>
                <div className='form'>
                    <Card title={'流程详情'} style={{ marginTop: 10 }}>
                        123
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
                                if (item.RunTime) {
                                    return <Step title={
                                        <div>
                                            <span>{item.CurrentNodeName}</span>
                                            <span style={{marginLeft: 20}}>{'已完成'}</span>
                                        </div>
                                    } description={
                                        <div>
                                            <span>
                                                {item.CurrentNodeName}人：
                                                {item.ExecutorObj.Full_Name}({item.ExecutorObj.User_Name})
                                            </span>
                                            <span style={{marginLeft: 20}}>
                                                {item.CurrentNodeName}时间：
                                                {item.RunTime}
                                            </span>
                                        </div>
                                    } />;
                                } else {
                                    return <Step title={
                                        <div>
                                            <span>{item.CurrentNodeName}</span>
                                            <span style={{marginLeft: 20}}>{'执行中'}</span>
                                            <span style={{marginLeft: 20}}>当前执行人：{item.ExecutorObj.Full_Name}</span>
                                        </div>
                                    } />;
                                }
                            })}
                        </Steps>
                        <div style={{textAlign: 'center'}}>
                            <Button
                                type='primary'
                                onClick={this.handleSubmit.bind(this)}
                                style={{ marginRight: 20 }}
                            >
                                提交
                            </Button>
                            <Button onClick={this.handleReject.bind(this)}>
                                退回
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
    backClick () {
        let to = `/selfcare/task`;
        this.props.history.push(to);
    }
    handleSubmit () {

    }
    handleReject () {

    }
}
export default TaskDetail;

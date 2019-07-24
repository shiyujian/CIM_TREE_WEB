import React, { Component } from 'react';
import {
    Steps,
    Card,
    Button
} from 'antd';
import moment from 'moment';
const { Step } = Steps;
class TaskDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            task_id: '', // 任务ID
            Works: [], // 任务流程
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
            console.log('详情', rep.Works);
            this.props.actions.setTaskDetailLoading(false);
            this.setState({
                workDetails: rep,
                Works: rep.Works
            });
        });
    }
    render () {
        const { workDetails, Works } = this.state;
        return (
            <div>
                <div className='info'>
                    <div style={{ textAlign: 'center', fontSize: 20 }}>
                        {workDetails.Title}
                    </div>
                    <div style={{textAlign: 'center', fontSize: 12, color: '#999999'}}>
                        <span>
                            发起人：{workDetails.Starter}
                        </span>
                        <span style={{ paddingLeft: 40 }}>
                            当前状态：{workDetails.WFState}
                        </span>
                    </div>
                    <Button type='primary' onClick={this.backClick.bind(this)}>
                        返回
                    </Button>
                </div>
                <div className='form'>
                    <Card title={'流程详情'} style={{ marginTop: 10 }}>
                        {workDetails.FormValues}
                    </Card>
                </div>
                <div>
                    <Card title={'审批流程'} style={{ marginTop: 10 }}>
                        <Steps
                            direction='vertical'
                            size='small'
                            current={Works.length}
                        >
                            {Works.map(item => {
                                return <Step title={item.CurrentNodeName} description={
                                    <div>
                                        <span>执行人：{item.Executor}</span>
                                        <span style={{marginLeft: 20}}>执行时间：{item.RunTime}</span>
                                    </div>
                                } />;
                            })}
                            <Step title={
                                <div>
                                    <span>{workDetails.CurrentNodeName}</span>
                                    <span style={{marginLeft: 20}}>当前执行人：{workDetails.Executor}</span>
                                </div>
                            } description={
                                <div>
                                    123
                                </div>
                            } />
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

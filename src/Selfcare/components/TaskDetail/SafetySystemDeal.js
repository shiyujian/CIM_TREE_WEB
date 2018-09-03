import React, { Component } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    notification
} from 'antd';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
const FormItem = Form.Item;

export default class SafetySystemDeal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            note: ''
        };
        this.member = null;
    }
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
    };

    render () {
        const {
            platform: { task = {}, users = {} } = {},
            location,
            actions
        } = this.props;
        const { current, history = [], transitions = [], states = [] } = task;
        let code = task.workflow.code;
        let name = task.current ? task.current[0].name : '';

        return (
            <div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem {...SafetySystemDeal.layout} label='处理意见'>
                            <Input
                                placeholder='请输入处理意见'
                                onChange={this.changeNote.bind(this)}
                                value={this.state.note}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button
                            type='primary'
                            onClick={this.handleSubmit.bind(this, task)}
                            style={{ marginRight: 20 }}
                        >
                            同意
                        </Button>
                        <Button onClick={this.handleReject.bind(this, task)}>
                            拒绝
                        </Button>
                    </div>
                </Row>
            </div>
        );
    }

    changeNote (event) {
        this.setState({
            note: event.target.value
        });
    }

    handleSubmit (task = {}) {
        const {
            location,
            actions: { putFlow, addSchedule }
        } = this.props;
        let { note } = this.state;

        const { state_id = '0' } = queryString.parse(location.search) || {};

        let me = this;
        // 获取登陆用户信息
        const user = getUser();
        let executor = {
            username: user.username,
            person_code: user.code,
            person_name: user.name,
            id: parseInt(user.id),
            org: user.org
        };

        // 获取流程的action名称
        let action_name = '';
        let nextStates = getNextStates(task, Number(state_id));
        for (var i = 0; i < nextStates.length; i++) {
            if (nextStates[i].action_name === '通过') {
                action_name = nextStates[i].action_name;
            }
        }
        if (!note) {
            note = action_name + '。';
        }
        let state = task.current[0].id;
        let workflowData = {
            state: state,
            executor: executor,
            action: action_name,
            note: note,
            attachment: null
        };
        console.log('workflowData', workflowData);
        let data = {
            pk: task.id
        };

        putFlow(data, workflowData).then(rst => {
            if (rst && rst.creator) {
                notification.success({
                    message: '流程提交成功',
                    duration: 2
                });
                let to = `/selfcare/task`;
                me.props.history.push(to);
            } else {
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                });
            }
        });
    }

    handleReject (task = {}) {
        const {
            location,
            actions: { putFlow }
        } = this.props;
        let { note } = this.state;

        const { state_id = '0' } = queryString.parse(location.search) || {};

        let me = this;
        // 获取登陆用户信息
        const user = getUser();
        let executor = {
            username: user.username,
            person_code: user.code,
            person_name: user.name,
            id: parseInt(user.id),
            org: user.org
        };

        // 获取流程的action名称
        let action_name = '';
        let stateid = 0;
        let nextStates = getNextStates(task, Number(state_id));
        for (var i = 0; i < nextStates.length; i++) {
            if (nextStates[i].action_name === '拒绝') {
                action_name = nextStates[i].action_name;
                stateid = nextStates[i].to_state[0].id;
            }
        }
        console.log('nextStates', nextStates);
        if (!note) {
            note = action_name + '。';
        }
        // 获取第一步的填报人，重新填报
        let oldSubject = task.subject[0];
        let nextUser = {};
        nextUser = oldSubject.FillPerson
            ? JSON.parse(oldSubject.FillPerson)
            : {};

        let state = task.current[0].id;
        let workflowData = {
            next_states: [
                {
                    state: stateid,
                    participants: [nextUser],
                    dealine: null,
                    remark: null
                }
            ],
            state: state,
            executor: executor,
            action: action_name,
            note: note,
            attachment: null
        };
        console.log('workflowData', workflowData);

        let data = {
            pk: task.id
        };

        putFlow(data, workflowData).then(rst => {
            console.log('rst', rst);
            if (rst && rst.creator) {
                notification.success({
                    message: '流程拒绝成功',
                    duration: 2
                });
                let to = `/selfcare/task`;
                me.props.history.push(to);
            } else {
                notification.error({
                    message: '流程拒绝失败',
                    duration: 2
                });
            }
        });
    }
}

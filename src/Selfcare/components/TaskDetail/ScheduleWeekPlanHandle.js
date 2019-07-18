import React, { Component } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    notification
} from 'antd';
import PerSearch from '../PersonSearch/Schedule/PerHandleSearch';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
const FormItem = Form.Item;

export default class ScheduleWeekPlanHandle extends Component {
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
            platform: { task = {} } = {}
        } = this.props;

        return (
            <div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem
                            {...ScheduleWeekPlanHandle.layout}
                            label='处理意见'
                        >
                            <Input
                                placeholder='请输入处理意见'
                                onChange={this.changeNote.bind(this)}
                                value={this.state.note}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem
                            {...ScheduleWeekPlanHandle.layout}
                            label='业主查看执行人'
                        >
                            <PerSearch
                                selectMember={this.selectMember.bind(this)}
                                task={task}
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
                            提交
                        </Button>
                        <Button onClick={this.handleReject.bind(this, task)}>
                            退回
                        </Button>
                    </div>
                </Row>
            </div>
        );
    }

    // 选择人员
    selectMember (memberInfo) {
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    username: memberValue[4],
                    person_code: memberValue[1],
                    person_name: memberValue[2],
                    id: parseInt(memberValue[3]),
                    org: memberValue[5]
                };
            }
        } else {
            this.member = null;
        }
    }

    changeNote (event) {
        this.setState({
            note: event.target.value
        });
    }

    handleSubmit = async (task = {}) => {
        const {
            location,
            actions: { putFlow }
        } = this.props;
        let { note } = this.state;
        try {
            if (!this.member) {
                notification.error({
                    message: '请选择业主查看执行人',
                    duration: 2
                });
                return;
            }
            const { state_id = '0' } = queryString.parse(location.search) || {};

            let me = this;
            let user = localStorage.getItem('LOGIN_USER_DATA');
            user = JSON.parse(user);
            let executor = {
                username: user.username,
                person_code: user && user.account && user.account.person_code,
                person_name: user && user.account && user.account.person_name,
                id: user && parseInt(user.id),
                org: user && user.account && user.account.org_code
            };
            let nextUser = {};

            nextUser = this.member;
            // 获取流程的action名称
            let action_name = '';
            let nextStates = await getNextStates(task, Number(state_id));
            let stateid = 0;
            for (var i = 0; i < nextStates.length; i++) {
                if (nextStates[i].action_name !== '退回') {
                    action_name = nextStates[i].action_name;
                    stateid = nextStates[i].to_state[0].id;
                }
            }

            if (!note) {
                note = action_name + '。';
            }
            let state = task.current[0].id;
            let workflow = {
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
            let data = {
                pk: task.id
            };

            let rst = await putFlow(data, workflow);
            if (rst && rst.creator) {
                notification.success({
                    message: '流程通过成功',
                    duration: 2
                });
                let to = `/selfcare/task`;
                me.props.history.push(to);
            } else {
                notification.error({
                    message: '流程通过失败',
                    duration: 2
                });
            }
        } catch (e) {
            console.log('handleSubmit', e);
        }
    }

    handleReject = async (task = {}) => {
        const {
            location,
            actions: { putFlow }
        } = this.props;
        let { note } = this.state;
        try {
            const { state_id = '0' } = queryString.parse(location.search) || {};

            let me = this;
            // 获取登陆用户信息
            let user = localStorage.getItem('LOGIN_USER_DATA');
            user = JSON.parse(user);
            let executor = {
                username: user.username,
                person_code: user && user.account && user.account.person_code,
                person_name: user && user.account && user.account.person_name,
                id: user && parseInt(user.id),
                org: user && user.account && user.account.org_code
            };

            // 获取流程的action名称
            let action_name = '';
            let nextStates = await getNextStates(task, Number(state_id));
            for (var i = 0; i < nextStates.length; i++) {
                if (nextStates[i].action_name === '退回') {
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

            let data = {
                pk: task.id
            };

            let rst = await putFlow(data, workflowData);
            if (rst && rst.creator) {
                notification.success({
                    message: '流程退回成功',
                    duration: 2
                });
                let to = `/selfcare/task`;
                me.props.history.push(to);
            } else {
                notification.error({
                    message: '流程退回失败',
                    duration: 2
                });
            }
        } catch (e) {
            console.log('handleReject', e);
        }
    }
}

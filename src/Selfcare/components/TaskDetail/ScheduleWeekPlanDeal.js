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

export default class ScheduleWeekPlanDeal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            note: '',
            user: ''
        };
        this.member = null;
    }
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
    };
    componentDidMount = () => {
        let user = localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        this.setState({
            user
        });
    }

    render () {
        const {
            platform: { task = {} } = {}
        } = this.props;

        return (
            <div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem
                            {...ScheduleWeekPlanDeal.layout}
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
                            重新填报
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

    handleSubmit = async (task = {}) => {
        const {
            location,
            actions: { putFlow, postWeekPlanSchedule }
        } = this.props;
        let {
            note,
            user
        } = this.state;
        try {
            const { state_id = '0' } = queryString.parse(location.search) || {};

            let me = this;
            // 获取登陆用户信息
            console.log('user', user);
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
            let data = {
                pk: task.id
            };

            // 进度数据入库
            let subject = task.subject[0];
            let weekPlanDataSource = subject.weekPlanDataSource
                ? JSON.parse(subject.weekPlanDataSource)
                : '';
            let section = subject.section ? JSON.parse(subject.section) : '';
            if (!section) {
                notification.error({
                    message: '数据错误，请确认填报人标段是否存在',
                    duration: 3
                });
            }
            let schedulePostData = [];
            weekPlanDataSource.map(item => {
                let data = {
                    PlanDate: item.date,
                    Section: section,
                    Num: Number(item.planTreeNum)
                };
                schedulePostData.push(data);
            });
            console.log('schedulePostData', schedulePostData);
            // 周进度入库
            let rst = await postWeekPlanSchedule({}, schedulePostData);
            console.log('rst', rst);
            if (rst && rst.code) {
                notification.success({
                    message: '上传数据成功',
                    duration: 2
                });

                let flowData = await putFlow(data, workflowData);
                if (flowData && flowData.id) {
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
            } else {
                notification.error({
                    message: '上传数据失败',
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
        let {
            note,
            user
        } = this.state;
        try {
            const { state_id = '0' } = queryString.parse(location.search) || {};

            let me = this;
            // 获取登陆用户信息
            console.log('user', user);
            let executor = {
                username: user.username,
                person_code: user && user.account && user.account.person_code,
                person_name: user && user.account && user.account.person_name,
                id: user && parseInt(user.id),
                org: user && user.account && user.account.org_code
            };

            // 获取流程的action名称
            let action_name = '';
            let stateid = 0;
            let nextStates = await getNextStates(task, Number(state_id));
            for (var i = 0; i < nextStates.length; i++) {
                if (nextStates[i].action_name !== '通过') {
                    action_name = nextStates[i].action_name;
                    stateid = nextStates[i].to_state[0].id;
                }
            }
            if (!note) {
                note = action_name + '。';
            }
            // 获取第一步的填报人，重新填报
            let oldSubject = task.subject[0];
            let nextUser = {};
            nextUser = oldSubject.fillPerson
                ? JSON.parse(oldSubject.fillPerson)
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

            let data = {
                pk: task.id
            };

            let rst = await putFlow(data, workflowData);
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
        } catch (e) {
            console.log('handleReject', e);
        }
    }
}

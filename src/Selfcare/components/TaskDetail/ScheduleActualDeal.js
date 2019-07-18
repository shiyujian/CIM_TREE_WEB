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
import { getNextStates } from '_platform/components/Progress/util';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;

export default class ScheduleActualDeal extends Component {
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
        let user = getUser();
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
                            {...ScheduleActualDeal.layout}
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
            actions: { putFlow, addSchedule }
        } = this.props;
        let {
            note,
            user
        } = this.state;
        try {
            const { state_id = '0' } = queryString.parse(location.search) || {};
            let me = this;
            // 获取登陆用户信息
            let executor = {
                username: user.username,
                name: user && user.name,
                id: user && parseInt(user.ID),
                org: user && user.org
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
            console.log('task', task);
            let subject = task.subject[0];
            let actualDataSource = subject.actualDataSource
                ? JSON.parse(subject.actualDataSource)
                : '';
            console.log('actualDataSource', actualDataSource);
            let items = [];
            let section = subject.section ? JSON.parse(subject.section) : '';
            let fillPerson = subject.fillPerson ? JSON.parse(subject.fillPerson) : '';
            let project = '';
            if (section) {
                let sectionArr = section.split('-');
                if (sectionArr && sectionArr instanceof Array && sectionArr.length > 0) {
                    project = sectionArr[0];
                }
            }
            actualDataSource.map(item => {
                let data = {
                    Num: item && item.actualNum ? Number(item.actualNum) : 0,
                    Project: item.project,
                    WPNo: section
                };
                items.push(data);
            });
            let postData = {
                DocType: 'doc',
                Items: items,
                ProgressNo: fillPerson ? (fillPerson.username ? fillPerson.username : '') : '',
                ProgressTime: subject.actualTimeDate ? JSON.parse(subject.actualTimeDate) : '',
                ProgressType: '日实际',
                SMS: 0,
                UnitProject: subject.section ? JSON.parse(subject.section) : '',
                WPNo: project
            };
            // 日进度入库
            let scheduleData = await addSchedule({}, postData);
            console.log('scheduleData', scheduleData);
            if (scheduleData && scheduleData.code && scheduleData.code === 1) {
                notification.success({
                    message: '上传数据成功',
                    duration: 2
                });

                let rst = await putFlow(data, workflowData);
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
            let executor = {
                username: user.username,
                name: user && user.name,
                id: user && parseInt(user.ID),
                org: user && user.org
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
            console.log('workflowData', workflowData);

            let data = {
                pk: task.id
            };

            let rst = await putFlow(data, workflowData);
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
        } catch (e) {
            console.log('handleReject', e);
        }
    }
}

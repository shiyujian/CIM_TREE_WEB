import React, { Component } from 'react';
import {
    Steps,
    Card
} from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import { Link } from 'react-router-dom';
import Progress from './Progress';
import queryString from 'query-string';
import { WORKFLOW_CODE } from '../../../_platform/api';

const Step = Steps.Step;
export default class TaskStep extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            user: null,
            note: '同意'
        };
    }

    render () {
        const {
            platform: { task = {} } = {},
            location,
            actions
        } = this.props;
        const { history = [], transitions = [], states = [] } = task;
        const user = getUser();

        if (task && task.workflow && task.workflow.code) {
            let code = task.workflow.code;
            let name = task.current ? task.current[0].name : '';

            if (
                code === WORKFLOW_CODE.总进度计划报批流程 &&
                name === '填报'
            ) {
                return null;
            } else if (
                code === WORKFLOW_CODE.每日进度填报流程 &&
                name === '施工填报'
            ) {
                return null;
            } else if (
                code === WORKFLOW_CODE.每周进度填报流程 &&
                name === '施工填报'
            ) {
                return null;
            } else {
                return (
                    <div>
                        <Card title={'审批流程'} style={{ marginTop: 10 }}>
                            <Steps
                                direction='vertical'
                                size='small'
                                current={history.length - 1}
                            >
                                {history
                                    .map((step, index) => {
                                        const {
                                            state: {
                                                participants: [
                                                    { executor = {} } = {}
                                                ] = []
                                            } = {}
                                        } = step;
                                        const { id: userID } = executor || {};
                                        if (step.status === 'processing') {
                                            // 根据历史状态显示
                                            const state = this.getCurrentState();
                                            return (
                                                <Step
                                                    title={
                                                        <div
                                                            style={{
                                                                marginBottom: 8
                                                            }}
                                                        >
                                                            <span>
                                                                {
                                                                    step.state
                                                                        .name
                                                                }
                                                                -(执行中)
                                                            </span>
                                                            <span
                                                                style={{
                                                                    paddingLeft: 20
                                                                }}
                                                            >
                                                                当前执行人:{' '}
                                                            </span>
                                                            <span
                                                                style={{
                                                                    color:
                                                                        '#108ee9'
                                                                }}
                                                            >
                                                                {' '}
                                                                {`${
                                                                    executor.person_name
                                                                }` ||
                                                                    `${
                                                                        executor.username
                                                                    }`}
                                                            </span>
                                                        </div>
                                                    }
                                                    description={
                                                        userID === +user.ID && (
                                                            <Progress
                                                                state={state}
                                                                states={states}
                                                                transitions={
                                                                    transitions
                                                                }
                                                                props={
                                                                    this.props
                                                                }
                                                                actions={
                                                                    actions
                                                                }
                                                                task={task}
                                                                location={
                                                                    location
                                                                }
                                                                {...this.props}
                                                                {...this.state}
                                                            />
                                                        )
                                                    }
                                                    key={index}
                                                />
                                            );
                                        } else {
                                            const {
                                                records: [record]
                                            } = step;
                                            const {
                                                log_on = '',
                                                participant: {
                                                    executor = {}
                                                } = {},
                                                note = ''
                                            } = record || {};
                                            const {
                                                person_name: name = '',
                                                organization = ''
                                            } = executor;
                                            return (
                                                <Step
                                                    key={index}
                                                    title={`${
                                                        step.state.name
                                                    }-(${step.status})`}
                                                    description={
                                                        <div
                                                            style={{
                                                                lineHeight: 2.6
                                                            }}
                                                        >
                                                            <div>
                                                                意见：
                                                                {note}
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {`${
                                                                        step
                                                                            .state
                                                                            .name
                                                                    }`}
                                                                    人:
                                                                    {`${name}` ||
                                                                        `${
                                                                            executor.username
                                                                        }`}{' '}
                                                                    [
                                                                    {
                                                                        executor.username
                                                                    }
                                                                    ]
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        paddingLeft: 20
                                                                    }}
                                                                >
                                                                    {`${
                                                                        step
                                                                            .state
                                                                            .name
                                                                    }`}
                                                                    时间：
                                                                    {moment(
                                                                        log_on
                                                                    ).format(
                                                                        'YYYY-MM-DD HH:mm:ss'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            );
                                        }
                                    })
                                    .filter(h => !!h)}
                            </Steps>
                        </Card>
                    </div>
                );
            }
        } else {
            return null;
        }
    }

    getCurrentState () {
        const { platform: { task = {} } = {}, location = {} } = this.props;
        const { state_id = '0' } = queryString.parse(location.search) || {};
        const { states = [] } = task;
        return states.find(
            state => state.status === 'processing' && state.id === +state_id
        );
    }
}

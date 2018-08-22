/**
 * Created by tinybear on 17/9/22.
 * 流程状态
 */

import React, { Component } from 'react';
import { Timeline } from 'antd';
import moment from 'moment';
import { WORKFLOW_CODE, DOWNLOAD_FILE } from '_platform/api';

class WorkFlowHistory extends Component {
    state = {
        notes: [],
        workflowTemplate: ''
    };

    componentWillReceiveProps (nextProps) {
        const { wk } = nextProps;
        if (wk) {
            this.getHistoryData(wk);
        }
    }

    componentWillMount () {
        const { wk } = this.props;
        if (wk) {
            this.getHistoryData(wk);
        }
    }

    getHistoryData (wk) {
        console.log('getHistoryData: ', wk);
        if (!wk.history || !wk.history.length) {
            return;
        }

        let notes = [];
        const { real_start_time, creator } = wk;
        let startTime = new moment(real_start_time);
        let subject = wk.subject[0];
        let attachment = '';
        try {
            attachment = subject.attachment
                ? JSON.parse(subject.attachment)
                : '';
        } catch (e) {
            attachment = subject.attachment || '';
        }

        let pnode = {
            type: 1, // 节点类型 1-发起 2-已处理 3-完成 4-正在处理
            nodeName: '发起',
            operator: creator.person_name,
            time: startTime.format('YYYY-MM-DD HH:mm:ss'),
            mark: subject.note || '',
            attachment: attachment,
            action: '发起'
        };
        if (wk.workflow.code === WORKFLOW_CODE.设计成果上报流程) {
            // pnode.mark = '';
            pnode.attachment = null;
        }
        notes.push(pnode);
        wk.history.forEach(h => {
            let { records, status, state } = h;
            let nodeName = state.name;
            let cbLogs = '';
            records.forEach(re => {
                let {
                    participant: { executor },
                    log_on,
                    note,
                    action,
                    attachment
                } = re;
                if (executor) {
                    let { person_name = '佚名' } = executor;
                    let time = new moment(log_on);
                    let excuText = `${person_name} ${nodeName} ${action} (${note})  ${time.format(
                        'YYYY-MM-DD HH:mm:ss'
                    )}`;
                    cbLogs += excuText + '\r\n';
                    let rnode = {
                        type: 2, // 节点类型 1-发起 2-已处理 3-完成 4-正在处理
                        nodeName: nodeName,
                        operator: person_name,
                        time: time.format('YYYY-MM-DD HH:mm:ss'),
                        mark: note,
                        action: action,
                        attachment: attachment
                    };
                    notes.push(rnode);
                }
            });
            if (status === 'processing') {
                let { participants = [], name } = state;
                let rcdExecutor = records.length
                    ? { ...records[0].participant.executor }
                    : {};
                // let {participant:{executor}} = records[0];
                participants.forEach(pt => {
                    let executor = pt.executor;
                    let executorName = '';
                    if (executor.username) {
                        executorName = executor.username;
                    } else {
                        executorName = executor.person_name;
                    }
                    let { executor: { id } = {} } = pt;
                    // 过滤掉设计变更流程，在有一个审查的时候多余的一条待处理的数据
                    if (rcdExecutor.id === id) {
                        rcdExecutor.id = null; // 匹配到一条就清空
                        return;
                    }
                    cbLogs += `${executorName} 正在处理 (${name}) `;
                });
                let prNode = {
                    type: 4, // 节点类型 1-发起 2-已处理 3-完成 4-正在处理
                    cbLogs: cbLogs
                };
                notes.push(prNode);
            }
        });
        if (wk.status === '3') {
            let endNode = {
                type: 3, // 节点类型 1-发起 2-已处理 3-完成 4-正在处理
                cbLogs: '完成'
            };
            notes.push(endNode);
        }
        this.setState({ notes, workflowTemplate: wk.workflow.name || '' });
    }

    renderNode = node => {
        let mr = 10;
        switch (node.type) {
            case 1:
            case 2:
                return (
                    <div>
                        <p>
                            <b>{node.nodeName}</b>
                        </p>
                        <p>
                            <span style={{ marginRight: mr }}>
                                处理人:
                                {node.operator}
                            </span>
                            <span style={{ marginRight: mr }}>
                                处理: {node.action}
                            </span>
                            <span style={{ marginRight: mr }}>
                                处理时间: {node.time}
                            </span>
                        </p>
                        <p>
                            <span style={{ marginRight: mr }}>
                                备注(意见):
                                {node.mark}
                            </span>
                            {node.attachment ? (
                                <span style={{ marginRight: mr }}>
                                    附件:
                                    <a
                                        href={
                                            DOWNLOAD_FILE +
                                            node.attachment.download_url
                                        }
                                    >
                                        {node.attachment.name}
                                    </a>
                                </span>
                            ) : (
                                ''
                            )}
                        </p>
                    </div>
                );
            case 3:
            case 4:
                return (
                    <div>
                        <p>{node.cbLogs}</p>
                    </div>
                );
            default:
                return <div>''</div>;
        }
    };

    render () {
        const { notes, workflowTemplate } = this.state;
        const { label = '流程状态' } = this.props;
        return (
            <div>
                {workflowTemplate ? (
                    <div style={{ margin: '0 0 10px 0' }}>
                        <label htmlFor=''>{workflowTemplate}:</label>
                    </div>
                ) : (
                    ''
                )}
                <div style={{ margin: '0 0 0 100px', paddingTop: 5 }}>
                    <Timeline>
                        {notes.map((node, index) => {
                            return (
                                <Timeline.Item key={index}>
                                    {this.renderNode(node)}
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
                </div>
            </div>
        );
    }
}

export default WorkFlowHistory;

/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../store/defect';
import './index.css';

@connect(
    state => {
        const { defect = {} } = state.quality || {};
        return defect;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)

export class SheetPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            initialData: null,
            sheetType: 0,
            initialDataAll: null,
            initialData2All: null
        };
    }

    async componentDidMount () {
        // <SheetPage initialData={initialData} sheetType={sheetType}/>
        const { initialData, sheetType } = this.props;
        this.setState({ initialData, sheetType });
        let { fetchDefectContactSheet, fetchDefectResponseSheet } = this.props.actions;
        let data = await fetchDefectContactSheet({ id: initialData.key });
        let data2 = await fetchDefectResponseSheet({ id: initialData.key });
        if (data.length > 0) {
            this.setState({ initialDataAll: data[0] });
        }
        if (data2.length > 0) {
            this.setState({ initialData2All: data2[0] });
        }
    }

    render () {
        const { initialDataAll, initialData2All, sheetType } = this.state;
        return (
            <div id='explain' style={{ display: 'inline-block' }}>
                {
                    initialDataAll && sheetType
                        ? this.getNotificationReplySheet(initialData2All)
                        : this.getWorkContactSheet(initialDataAll)
                }
            </div>
        );
    }

    getWorkContactSheet = (initialDataAll) => {
        console.log('ret', initialDataAll);
        if (!initialDataAll) {
            return (<div>暂无</div>);
        }
        return (
            <div className='wrapperDiv'>
                <div style={{ textAlign: 'center' }}>
                    <div>市政基础设施工程</div>
                    <div style={{ margin: 5 }}>质量缺陷整改工作联系单</div>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>市政监-17</div>
                <div style={{ textAlign: 'center' }}>编号：{initialDataAll.code}</div>
                <div style={{ position: 'relative', float: 'left', top: -18 }}>{`工程名称:${initialDataAll.project.name}`}</div>
                <div style={{ border: '1px solid #000', padding: 30, height: 625 }}>
                    <div style={{ textAlign: 'left' }}>致：{initialDataAll.response_org.name}</div>
                    <div style={{ textAlign: 'left' }}>事由：{initialDataAll.project.name}工程存在如下安全隐患</div>
                    <div style={{ textAlign: 'left', paddingLeft: 40 }}>质量缺陷 条目{initialDataAll.code}，限在xxx  期限内，采取以下措施完成整改：</div>
                    <div style={{ textAlign: 'left', paddingLeft: 40 }}>{initialDataAll.rectify_measure}</div>
                    <div style={{ height: 200 }} />
                    <div style={{ textAlign: 'left' }}>内容：{initialDataAll.risk_content}</div>
                    <div style={{ textAlign: 'right', paddingRight: 140 }}>单位：{initialDataAll.send_org.name}</div>
                    <div style={{ textAlign: 'right', paddingRight: 140 }}>负责人：{initialDataAll.sender.person_name}</div>
                    <div style={{ textAlign: 'right', paddingRight: 140 }}>日期：{initialDataAll.created_on.substr(0, 10)}</div>
                </div>
            </div>
        );
    }

    getNotificationReplySheet = (initialData2All) => {
        // debugger
        console.log('ret', initialData2All);
        if (!initialData2All) {
            return (<div>暂无</div>);
        }
        console.log(initialData2All);
        return (
            <div className='wrapperDiv'>
                <div style={{ textAlign: 'center' }}>
                    <div>市政基础设施工程</div>
                    <div style={{ margin: 5 }}>质量缺陷整改通知回复单</div>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>市政监-17</div>
                <div style={{ textAlign: 'center' }}>编号：{initialData2All.code}</div>
                <div style={{ position: 'relative', float: 'left', top: -18 }}>工程名称：{initialData2All.project.name}</div>
                <div style={{ border: '1px solid #000', padding: 30, height: 625 }}>
                    <div style={{ textAlign: 'left', paddingBottom: 30 }}>致：{initialData2All.review_org && initialData2All.review_org.name}单位（项目监理机构）</div>
                    <div style={{ textAlign: 'left', height: 120 }}>
                        我方接到质量缺陷编号为{initialData2All.code}的整改工作联系单通知后，已按要求完成了
                        <span>
                            {initialData2All.risk_content}
                        </span>
                        工作，现报上，请予以复查
                    </div>
                    <div style={{ border: '1px solid #d7d5d5', height: 180, marginBottom: 40 }}>
                        <div style={{ textAlign: 'left' }}>详细内容：</div>
                        <div style={{ textAlign: 'center', height: 109 }}>{initialData2All.rectify_content}</div>
                        <div style={{ textAlign: 'right' }}>项目经理部：<span>{initialData2All.rectify_per && initialData2All.rectify_per.name + ' '}</span>章</div>
                        <div style={{ textAlign: 'right' }}>项目负责人：<span>{initialData2All.rectify_per && initialData2All.rectify_per.name}</span></div>
                        <div style={{ textAlign: 'right' }}>日期：<span>{initialData2All.rectify_time && initialData2All.rectify_time.substr(0, 10)}</span></div>
                    </div>
                    <div style={{ border: '1px solid #d7d5d5', height: 180 }}>
                        <div style={{ textAlign: 'left' }}>复查意见：</div>
                        <div style={{ textAlign: 'center', height: 109 }}>{initialData2All.review_note}</div>
                        <div style={{ textAlign: 'right' }}>项目监理机构：<span>{initialData2All.review_org && initialData2All.review_org.name + ' '}</span> 章</div>
                        <div style={{ textAlign: 'right' }}>总/专业监理工程师：<span>{initialData2All.review_per && initialData2All.review_per.name}</span></div>
                        <div style={{ textAlign: 'right' }}>日期：<span>{initialData2All.review_time && initialData2All.review_time.substr(0, 10)}</span></div>
                    </div>
                </div>
            </div>
        );
    }
}

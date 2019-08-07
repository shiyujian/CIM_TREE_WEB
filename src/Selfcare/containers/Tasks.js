import React, { Component } from 'react';
import { Content, DynamicTitle } from '_platform/components/layout';
import {TaskList } from '../components/Tasks';
import { actions } from '../store/tasks';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUser } from '_platform/auth';

@connect(
    state => {
        const { selfcare: { tasks = {} } = {}, platform } = state;
        return { ...tasks, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Tasks extends Component {
    async componentDidMount () {
    }
    getDataList = (params) => {
        console.log(params, '参数');
        let { getWorkList } = this.props.actions;
        getWorkList({}, params).then(rep => {
            if (rep.code === 200) {
                let backlogDataList = []; // 待办列表
                let doneDataList = []; // 已办列表
                rep.content.map(item => {
                    if (item.WFState === 1) {
                        backlogDataList.push(item);
                    } else {
                        doneDataList.push(item);
                    }
                });
                console.log('待办列表', backlogDataList);
                console.log('已办列表', doneDataList);
                this.setState({
                    backlogDataList,
                    doneDataList
                });
            }
        });
    }

    render () {
        return (
            <Content>
                <DynamicTitle title='个人任务' {...this.props} />
                <TaskList {...this.props} />
            </Content>
        );
    }
}

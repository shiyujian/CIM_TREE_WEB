import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class Schedule extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');

        injectReducer('schedule', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            Stage,
            Progress,
            ScheduleAnalyze,
            EnterAnalyze,
            ScheduleReport,
            ScheduleDisplay
        } =
            this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={Schedule.menus}
                        defaultOpenKeys={Schedule.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    {Stage && (
                        <Route
                            exact
                            path='/schedule/stagereport'
                            component={Stage}
                        />
                    )}
                    {Progress && (
                        <Route
                            path='/schedule/progress'
                            component={Progress}
                        />
                    )}
                    {EnterAnalyze && (
                        <Route
                            path='/schedule/enteranalyze'
                            component={EnterAnalyze}
                        />
                    )}
                    {ScheduleAnalyze && (
                        <Route
                            path='/schedule/scheduleanalyze'
                            component={ScheduleAnalyze}
                        />
                    )}
                    {ScheduleReport && (
                        <Route
                            exact
                            path='/schedule/schedulereport'
                            component={ScheduleReport}
                        />
                    )}
                    {ScheduleDisplay && (
                        <Route
                            exact
                            path='/schedule/scheduledisplay'
                            component={ScheduleDisplay}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'stagereport',
            id: 'SCHEDULE.STAGEREPORT',
            name: '进度填报',
            path: '/schedule/stagereport',
            icon: <Icon name='suitcase' />
        },
        {
            key: 'progress',
            name: '项目进度',
            id: 'SCHEDULE.PROGRESS',
            path: '/schedule/progress',
            icon: <Icon name='warning' />
        },
        {
            key: 'schedulereport',
            id: 'SCHEDULE.SCHEDULEREPORT',
            name: '每周进度',
            path: '/schedule/schedulereport',
            icon: <Icon name='suitcase' />
        },
        {
            key: 'scheduledisplay',
            id: 'SCHEDULE.SCHEDULEDISPLAY',
            name: '进度展示',
            path: '/schedule/scheduledisplay',
            icon: <Icon name='warning' />
        },
        {
            key: 'enteranalyze',
            id: 'SCHEDULE.ENTERANALYZE',
            name: '苗木进场分析',
            path: '/schedule/enteranalyze',
            icon: <Icon name='ship' />
        },
        {
            key: 'scheduleanalyze',
            name: '种植进度分析',
            id: 'SCHEDULE.SCHEDULEANALYZE',
            path: '/schedule/scheduleanalyze',
            icon: <Icon name='warning' />
        }
    ];

    static defaultOpenKeys = ['stagereport'];
}

import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';
import {OverallMenu} from '_platform/MenuJson';

export default class Overall extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('overall', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            News,
            Dispatch
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={OverallMenu} />
                </Aside>
                <Switch>
                    {News && <Route path='/overall/news' component={News} />}
                    {Dispatch && (
                        <Route path='/overall/dispatch' component={Dispatch} />
                    )}
                </Switch>
            </Body>
        );
    }

    static menus = [
        {
            key: 'news',
            id: 'OVERALL.NEWS',
            path: '/overall/news',
            name: '新闻通知',
            icon: <Icon name='calendar-check-o' />
        }
        // {
        //     key: 'dispatch',
        //     id: 'OVERALL.DISPATCH',
        //     path: '/overall/dispatch',
        //     name: '现场收发文',
        //     icon: <Icon name='newspaper-o' />
        // },
        // {
        //     key: 'material',
        //     id: 'OVERALL.MATERAIL',
        //     path: '/overall/material',
        //     name: '物资管理',
        //     icon: <Icon name='bars' />
        // },
        // {
        //     key: 'form',
        //     id: 'OVERALL.FORM',
        //     path: '/overall/formmanage',
        //     name: '表单管理',
        //     icon: <Icon name='file-text' />
        // }
    ];
}

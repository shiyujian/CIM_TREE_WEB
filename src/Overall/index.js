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
            Dispatch,
            MeetingManage
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
                    {MeetingManage && (
                        <Route path='/overall/meetingmanage' component={MeetingManage} />
                    )}
                </Switch>
            </Body>
        );
    }
}

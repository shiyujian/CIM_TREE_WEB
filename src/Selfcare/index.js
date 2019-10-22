import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {SlefCareMenu} from '_platform/MenuJson';

export default class Selfcare extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');

        injectReducer('selfcare', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            Tasks,
            Task,
            Query,
            Leave
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={SlefCareMenu} />
                </Aside>
                <Main>
                    {Tasks && (
                        <Route exact path='/selfcare/task' component={Tasks} />
                    )}
                    {Task && (
                        <Route
                            exact
                            path='/selfcare/task/:task_id'
                            component={Task}
                        />
                    )}
                    {Query && (
                        <Route exact path='/selfcare/query' component={Query} />
                    )}
                    {Leave && (
                        <Route exact path='/selfcare/leave' component={Leave} />
                    )}
                </Main>
            </Body>
        );
    }
}

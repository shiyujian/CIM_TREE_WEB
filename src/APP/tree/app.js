/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import {
    Auth,
    Header,
    DynamicTabs,
    Preview,
    Footer
} from '_platform/components/layout';

export default class App extends Component {
    async componentDidMount () {
        const { default: Home } = await import('../../Home');
        const { default: Login } = await import('../../LoginQH');
        const { default: Dashboard } = await import('../../Dashboard');
        const { default: Forest } = await import('../../Forest');
        const { default: Conservation } = await import('../../Conservation');
        const { default: Overall } = await import('../../Overall');
        const { default: Schedule } = await import('../../Schedule');
        const { default: Setup } = await import('../../Setup');
        const { default: Selfcare } = await import('../../Selfcare');
        const { default: Project } = await import('../../Project');
        const { default: Checkwork } = await import('../../Checkwork');
        const { default: Dipping } = await import('../../Dipping');

        this.setState({
            Home,
            Login,
            Dashboard,
            Forest,
            Conservation,
            Overall,
            Schedule,
            Selfcare,
            Setup,
            Project,
            Checkwork,
            Dipping
        });
    }

    render () {
        const {
            Home,
            Login,
            Dashboard,
            Forest,
            Conservation,
            Overall,
            Schedule,
            Selfcare,
            Setup,
            Project,
            Checkwork,
            Dipping
        } =
            this.state || {};
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div style={{ height: '100%' }}>
                        <Route path='/:module?' component={Auth} />
                        <Route path='/:module?' component={Header} />
                        <Route path='/:module?' component={DynamicTabs} />
                        {Home && <Route exact path='/' component={Home} />}
                        {Login && <Route path='/login' component={Login} />}
                        {Dashboard && (
                            <Route path='/dashboard' component={Dashboard} />
                        )}
                        {Forest && <Route path='/forest' component={Forest} />}
                        {Conservation && <Route path='/conservation' component={Conservation} />}
                        {Overall && (
                            <Route path='/overall' component={Overall} />
                        )}
                        {Schedule && (
                            <Route path='/schedule' component={Schedule} />
                        )}
                        {Selfcare && (
                            <Route path='/selfcare' component={Selfcare} />
                        )}
                        {Setup && <Route path='/setup' component={Setup} />}
                        {Project && (
                            <Route path='/project' component={Project} />
                        )}
                        {Checkwork && (
                            <Route path='/checkwork' component={Checkwork} />
                        )}
                        {Dipping && (
                            <Route path='/dipping' component={Dipping} />
                        )}
                        <Route path='/:module?' component={Footer} />
                        {Preview && <Preview />}
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

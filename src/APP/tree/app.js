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
        const { default: Curing } = await import('../../Curing');
        const { default: Overall } = await import('../../Overall');
        const { default: Datum } = await import('../../Datum');
        const { default: Schedule } = await import('../../Schedule');
        const { default: System } = await import('../../System');
        const { default: Selfcare } = await import('../../Selfcare');
        const { default: Project } = await import('../../Project');
        // const { default: Market } = await import('../../Market');
        const { default: Checkwork } = await import('../../Checkwork');
        const { default: Dipping } = await import('../../Dipping');

        this.setState({
            Home,
            Login,
            Dashboard,
            Forest,
            Curing,
            Overall,
            Datum,
            Schedule,
            Selfcare,
            System,
            Project,
            // Market,
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
            Curing,
            Overall,
            Datum,
            Schedule,
            Selfcare,
            System,
            Project,
            // Market,
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
                        {Curing && <Route path='/curing' component={Curing} />}
                        {Overall && (
                            <Route path='/overall' component={Overall} />
                        )}
                        {Datum && (
                            <Route path='/datum/:category?' component={Datum} />
                        )}
                        {Schedule && (
                            <Route path='/schedule' component={Schedule} />
                        )}
                        {Selfcare && (
                            <Route path='/selfcare' component={Selfcare} />
                        )}
                        {System && <Route path='/system' component={System} />}
                        {Project && (
                            <Route path='/project' component={Project} />
                        )}
                        {/* {Market && (
                            <Route path='/market' component={Market} />
                        )} */}
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

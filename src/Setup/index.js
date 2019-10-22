import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {SetupMenu} from '_platform/MenuJson';

export default class Setup extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('setup', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={SetupMenu} />
                </Aside>
                <Main>
                    <ContainerRouters
                        menus={SetupMenu}
                        containers={this.state}
                    />
                </Main>
            </Body>
        );
    }
}

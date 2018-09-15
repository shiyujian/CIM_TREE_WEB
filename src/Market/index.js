/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-09-01 16:58:31
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-09-15 10:36:18
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';

export default class MarketContainer extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('market', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            SeedlingSupply = null,
            SeedlingPurchase = null,
            SupplyRelease = null
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={MarketContainer.menus}
                        defaultOpenKeys={MarketContainer.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    {SeedlingSupply && (
                        <Route
                            path='/market/seedlingsupply'
                            component={SeedlingSupply}
                        />
                    )}
                    {SeedlingPurchase && (
                        <Route
                            path='/market/seedlingpurchase'
                            component={SeedlingPurchase}
                        />
                    )}
                    {SupplyRelease && (
                        <Route
                            path='/market/supplyrelease'
                            component={SupplyRelease}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'supermarket',
            id: 'MARKET.SUPERMARKET',
            name: '苗木超市',
            children: [
                {
                    key: 'seedlingsupply',
                    id: 'MARKET.SEEDLINGSUPPLY',
                    path: '/market/seedlingsupply',
                    name: '苗木供应'
                },
                {
                    key: 'seedlingpurchase',
                    id: 'MARKET.SEEDLINGPURCHASE',
                    path: '/market/seedlingpurchase',
                    name: '苗木求购'
                },
                {
                    key: 'supplyrelease',
                    id: 'MARKET.SUPPLYRELEASE',
                    path: '/market/supplyrelease',
                    name: '供应发布'
                }
            ]
        }
    ];
    static defaultOpenKeys = ['supermarket'];
}

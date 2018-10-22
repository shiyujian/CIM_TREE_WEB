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
 * @Last Modified time: 2018-09-15 11:24:13
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
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
            SupplyRelease = null,
            DemandRelease = null,
            OfferManage = null
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
                    {DemandRelease && (
                        <Route
                            path='/market/demandrelease'
                            component={DemandRelease}
                        />
                    )}
                    {OfferManage && (
                        <Route
                            path='/market/offermanage'
                            component={OfferManage}
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
                }
            ]
        },
        {
            key: 'supplyrelease',
            id: 'MARKET.SUPPLYRELEASE',
            path: '/market/supplyrelease',
            name: '供应发布'
        },
        {
            key: 'demandrelease',
            id: 'MARKET.DEMANDRELEASE',
            path: '/market/demandrelease',
            name: '需求发布'
        },
        {
            key: 'offermanage',
            id: 'MARKET.OFFERMANAGE',
            path: '/market/offermanage',
            name: '报价管理'
        }
    ];
    static defaultOpenKeys = ['supermarket'];
}

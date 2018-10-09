import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/seedlingPurchase';
import { actions as platformActions } from '_platform/store/global';
import { PurchaseList, PurchaseDetails } from '../components/SeedlingPurchase';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
@connect(
    state => {
        const { market: { seedlingPurchase = {} }, platform } = state;
        return { ...seedlingPurchase, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class SeedlingPurchase extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const {
            purchaseDetailsVisible, purchaseDetailsKey
        } = this.props;
        console.log(purchaseDetailsVisible, purchaseDetailsKey);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='苗木求购' {...this.props} />
                    <Content>
                        <PurchaseList {...this.props} />
                        {
                            purchaseDetailsVisible ? <PurchaseDetails {...this.props} /> : ''
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}

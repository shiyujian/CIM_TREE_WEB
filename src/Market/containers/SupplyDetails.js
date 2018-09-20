import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/seedlingPurchase';
import { actions as platformActions } from '_platform/store/global';
import { DataList } from '../components/SupplyDetails';
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
export default class PurchaseDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {}

    render () {
        return (
            <Body>
                <Main>
                    <Content>
                        <DataList {...this.props} />
                    </Content>
                </Main>
            </Body>
        );
    }
}

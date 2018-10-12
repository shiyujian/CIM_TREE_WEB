import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/seedlingSupply';
import { actions as platformActions } from '_platform/store/global';
import { SupplyList, SupplyDetails } from '../components/SeedlingSupply';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
@connect(
    state => {
        const { market: { seedlingSupply = {} }, platform } = state;
        return { ...seedlingSupply, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class SeedlingSupply extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const {
            supplyDetailsVisible, supplyDetailsKey
        } = this.props;
        console.log(supplyDetailsVisible, supplyDetailsKey);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='苗木供应' {...this.props} />
                    <Content>
                        {
                            supplyDetailsVisible ? <SupplyDetails {...this.props} /> : <SupplyList {...this.props} />
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}

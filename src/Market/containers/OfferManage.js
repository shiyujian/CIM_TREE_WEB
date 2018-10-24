import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/offerManage';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { OfferList, OfferDetails } from '../components/OfferManage';
@connect(
    state => {
        const { market: { offerManage = {} }, platform } = state;
        return { ...offerManage, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class DemandRelease extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    render () {
        const {
            offerDetailsVisible
        } = this.props;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='报价管理' {...this.props} />
                    <Content>
                        {
                            offerDetailsVisible ? <OfferDetails {...this.props} /> : <OfferList {...this.props} />
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}

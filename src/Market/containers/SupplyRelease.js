import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/supplyRelease';
import { actions as platformActions } from '_platform/store/global';
import { DataList } from '../components/SupplyRelease';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
@connect(
    state => {
        const { market: { supplyRelease = {} }, platform } = state;
        return { ...supplyRelease, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class SupplyRelease extends Component {
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
                    <DynamicTitle title='供应发布' {...this.props} />
                    <Content>
                        <DataList />
                    </Content>
                </Main>
            </Body>
        );
    }
}

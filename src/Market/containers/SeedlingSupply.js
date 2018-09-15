import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/seedlingSupply';
import { actions as platformActions } from '_platform/store/global';
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

    componentDidMount () {}

    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='苗木供应' {...this.props} />
                    <Content>
                        <div>
                            苗木供应
                        </div>
                    </Content>
                </Main>
            </Body>
        );
    }
}

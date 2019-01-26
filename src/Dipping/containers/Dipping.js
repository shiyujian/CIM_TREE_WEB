import React, { Component } from 'react';
import { Content } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import {Tabs} from 'antd';
import { actions as platformActions } from '_platform/store/global';
import * as actions from '../store';
@connect(
    state => {
        const { platform } = state || {};
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class Dipping extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div>
                <Content>
                    <iframe
                        src='/dippingdemo/index.html'
                        style={{ height: '870', width: '100%' }}
                    />
                </Content>
            </div>
        );
    }
}

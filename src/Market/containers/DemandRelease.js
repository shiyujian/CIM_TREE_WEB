import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/demandRelease';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { DemandTable, AddDemand } from '../components/DemandRelease';
@connect(
    state => {
        const { market: { demandRelease = {} }, platform } = state;
        return { ...demandRelease, platform };
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
            addDemandVisible, addDemandKey
        } = this.props;
        console.log(addDemandVisible, addDemandKey);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='需求发布' {...this.props} />
                    <Content>
                        <DemandTable {...this.props} />
                        {
                            addDemandVisible ? <AddDemand {...this.props} /> : ''
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}

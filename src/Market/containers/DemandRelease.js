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
import {DemandTable, AddDemandTable} from '../components/DemandRelease';
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

    componentDidMount () {}

    render () {
        const {
            addDemandModalVisible
        } = this.props;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='需求发布' {...this.props} />
                    <Content>
                        <div>
                            <DemandTable{...this.props} {...this.state} />
                            {
                                addDemandModalVisible
                                    ? (
                                        <AddDemandTable {...this.props} {...this.state} />
                                    ) : ''
                            }
                        </div>
                    </Content>
                </Main>
            </Body>
        );
    }
}

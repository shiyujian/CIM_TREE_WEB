import React, { Component } from 'react';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/org';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tree, Info, Participant, Addition } from '../components/Org';

@connect(
    state => {
        const { system: { org = {} } = {}, platform } = state;
        return { ...org, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)

export default class Org extends Component {
    static propTypes = {};

    render () {
        return (
            <div>
                <DynamicTitle title='组织机构' {...this.props} />
                <Sidebar>
                    <Tree {...this.props} />
                </Sidebar>
                <Content>
                    <Info {...this.props} />
                </Content>
                <Addition {...this.props} />
            </div>
        );
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }
}

import React, { Component } from 'react';
import { TablePerson, PersonModify } from '../components/Blacklist';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../store/blacklist';

@connect(
    state => {
        const {
            platform,
            system: { blacklist }
        } = state;
        return { platform, ...blacklist };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class Blacklist extends Component {
    componentDidMount = async () => {
        const {
            actions: { getTags, getRoles, getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
        await getTags({});
        await getRoles();
    }
    render () {
        const { Modvisible } = this.props;
        return (
            <div>
                <DynamicTitle title='黑名单' {...this.props} />
                <Content>
                    <TablePerson {...this.props} />
                    {Modvisible && (
                        <PersonModify
                            {...this.props}
                        />
                    )}
                </Content>
            </div>
        );
    }
}

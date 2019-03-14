import React, { Component } from 'react';
import { TablePerson, PersonModify } from '../components/PersonBlacklist';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../store/personBlacklist';

@connect(
    state => {
        const {
            platform,
            system: { personBlacklist }
        } = state;
        return { platform, ...personBlacklist };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class PersonBlacklist extends Component {
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
                <DynamicTitle title='人员黑名单' {...this.props} />
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

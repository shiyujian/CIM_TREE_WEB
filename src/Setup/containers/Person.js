import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/person';
import { actions as platformActions } from '_platform/store/global';
import { Tree, Table } from '../components/Person';

@connect(
    state => {
        const { setup: { person = {} } = {}, platform } = state;
        return { ...person, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Person extends Component {
    static propTypes = {};

    render () {
        return (
            <div>
                <DynamicTitle title='用户管理' {...this.props} />
                <Sidebar>
                    <Tree {...this.props} />
                </Sidebar>
                <Content>
                    <Table {...this.props} />
                </Content>
            </div>
        );
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getUsersOK
            },
            platform: { tree = {} }
        } = this.props;
        await getUsersOK([]);
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }
}

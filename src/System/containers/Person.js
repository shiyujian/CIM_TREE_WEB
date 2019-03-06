import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/person';
import { actions as platformActions } from '_platform/store/global';
import { Tree, Table, Addition, Edit } from '../components/Person';

@connect(
    state => {
        const { system: { person = {} } = {}, platform } = state;
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
                <Addition {...this.props} />
                <Edit {...this.props} />
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

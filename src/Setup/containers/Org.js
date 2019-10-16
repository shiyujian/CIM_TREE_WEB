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
import { Tree, Info, Edit, Addition, AddProject, EditProject } from '../components/Org';

@connect(
    state => {
        const { setup: { org = {} } = {}, platform } = state;
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
        const {
            editOrgVisible,
            addition,
            addProjectVisible,
            editProjectVisible
        } = this.props;
        return (
            <div>
                <DynamicTitle title='组织机构' {...this.props} />
                <Sidebar>
                    <Tree {...this.props} />
                </Sidebar>
                <Content>
                    <Info {...this.props} />
                </Content>
                {(addition && addition.visible) ? <Addition {...this.props} /> : ''}
                {editOrgVisible ? <Edit {...this.props} /> : ''}
                {addProjectVisible ? <AddProject {...this.props} /> : ''}
                {editProjectVisible ? <EditProject {...this.props} /> : ''}
            </div>
        );
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                changeSidebarField,
                clearAdditionField,
                changeAdditionField,
                changeEditOrgVisible
            },
            platform: { tree = {} }
        } = this.props;
        await changeSidebarField('parent', null);
        await changeSidebarField('addition', false);
        await changeAdditionField('visible', false);
        await changeEditOrgVisible(false);
        await changeSidebarField('node', '');
        await clearAdditionField();
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }
}

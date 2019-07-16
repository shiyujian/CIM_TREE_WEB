import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/formmanage';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import PkCodeTree from '../components/PkCodeTree';

export const Datumcode = window.DeathCode.OVERALL_FORM;

@connect(
    state => {
        const {
            overall: { formmanage = {} },
            platform
        } = state;
        return { platform, ...formmanage };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class FormManage extends Component {
    array = [];
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: ''
        };
    }
    async componentDidMount () {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
    }

    onSelect (value = [], data) {
        const [code] = value;
        this.setState({
            leftkeycode: code
        });
    }
    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const { leftkeycode } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        console.log('tree', tree);
        return (
            <div>
                <DynamicTitle title='表单管理' {...this.props} />
                <Sidebar>
                    <div
                        style={{ overflow: 'hidden' }}
                        className='project-tree'
                    >
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </div>
                </Sidebar>
                <Content>
                    表单管理
                </Content>
            </div>
        );
    }
}

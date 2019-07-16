import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/material';
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
export const Datumcode = window.DeathCode.OVERALL_MATERIAL;

@connect(
    state => {
        const {
            overall: { material = {} },
            platform
        } = state || {};
        return { ...material, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Material extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
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

    // Tab栏的切换
    tabChange (tabValue) {
        const {
            actions: { setTabActive }
        } = this.props;
        setTabActive(tabValue);
    }

    render () {
        const { leftkeycode } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        console.log('tree', tree);
        return (
            <Body>
                <Main>
                    <DynamicTitle title='物资管理' {...this.props} />
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
                        物资管理
                    </Content>
                </Main>
                <Preview />
            </Body>
        );
    }

    // 树选择
    onSelect (value = []) {
        console.log('MaterialMaterial选择的树节点', value);
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode });
    }
}


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Main,
    Body,
    DynamicTitle,
    Sidebar,
    Content
} from '_platform/components/layout';
import { TreeProjectList } from '../components';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/thinClassTreeTypeManage';
import { Table } from '../components/ThinClassTreeTypeManage';
import { getAreaTreeData, getDefaultProject } from '_platform/auth';
@connect(
    state => {
        const {
            project: { nurseryManagement = {} },
            platform
        } = state || {};
        return { ...nurseryManagement, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
class ThinClassTreeTypeManage extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目
            sectionList: [] // 标段列表
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                let projectList = data.projectList || [];
                // 区域地块树
                await getThinClassTree(projectList);
            }
            let defaultProject = await getDefaultProject();
            if (defaultProject) {
                this.onSelect([defaultProject]);
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const {
            leftkeycode
        } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='细班树种管理' {...this.props} />
                    <Sidebar>
                        {
                            treeList.length > 0 ? <TreeProjectList
                                treeData={treeList}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                            /> : ''
                        }
                    </Sidebar>
                    <Content>
                        <Table {...this.props} {...this.state} />
                    </Content>
                </Main>
            </Body>
        );
    }
    onSelect (keys) {
        let keycode = keys[0] || '';
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        let sectionList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        treeList.map(item => {
            if (item.No === keycode) {
                sectionList = item.children;
            }
        });
        this.setState({
            leftkeycode: keycode,
            sectionList
        });
    }
}

export default ThinClassTreeTypeManage;


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
import { actions } from '../store/parcelManage';
import { Table } from '../components/ParcelManage';
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
class ParcelManage extends Component {
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
            console.log('1', tree);
            if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                let projectList = data.projectList || [];
                // 区域地块树
                await getThinClassTree(projectList);
            }
            let defaultProject = await getDefaultProject();
            console.log(defaultProject, 'defaultProject');
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
        console.log(tree, '树数据');
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <div
                style={{
                    padding: 20,
                    height: 'calc(100% - 37px)',
                    minHeight: '505px',
                    overflowY: 'auto'
                }}
            >
                <DynamicTitle title='地块管理' {...this.props} />
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
            </div>
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

export default ParcelManage;

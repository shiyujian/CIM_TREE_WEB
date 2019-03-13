import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class TreeTypeTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: ''
        };
    }

    onCheck (keys, info) {
        this.props.onCheck(keys, info);
    }

    genIconClass () {
        let icClass = '';
        let featureName = this.props.featureName;
        switch (featureName) {
            case 'geojsonFeature_track':
                icClass = 'tr-people';
                break;
            case 'geojsonFeature_risk':
                icClass = 'tr-hazard';
                break;
            case 'geojsonFeature_treetype':
                icClass = 'tr-area';
                break;
        }
        return icClass;
    }

    loop (p) {
        let me = this;
        if (p) {
            return (
                <TreeNode
                    title={p.properties.name}
                    key={p.key}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return me.loop(m);
                        })}
                </TreeNode>
            );
        }
    }

    componentDidMount () {
        console.log('sssssssssssssss');
    }

    render () {
        let {
            treetypesTree = [],
            treetypesTreeLoading
        } = this.props;
        const {
            searchTree,
            searchValue
        } = this.state;
        let treeData = [];
        let defaultCheckedKeys = [];
        if (searchValue) {
            treeData = searchTree;
        } else {
            let contents = [];
            for (let j = 0; j < treetypesTree.length; j++) {
                const element = treetypesTree[j];
                if (element !== undefined) {
                    contents.push(element);
                    defaultCheckedKeys.push(element.key);
                }
            }
            treeData = [
                {
                    properties: {
                        name: '全部'
                    },
                    key: '全部',
                    children: contents
                }
            ];
        }
        return (
            <div>
                <Spin spinning={treetypesTreeLoading}>
                    <Search
                        placeholder='请输入树种名称或顺序码'
                        onSearch={this.searchTree.bind(this)}
                        style={{ width: '100%', marginBotton: 10, paddingRight: 5 }}
                    />
                    <div className={this.genIconClass()}>
                        <Tree
                            checkable
                            showIcon
                            defaultCheckedKeys={defaultCheckedKeys}
                            onCheck={this.onCheck.bind(this)}
                            showLine
                        >
                            {treeData.map(p => {
                                return this.loop(p);
                            })}
                        </Tree>
                    </div>
                </Spin>
            </div>

        );
    }

    searchTree = async (value) => {
        const {
            treetypes = [],
            actions: {
                getTreeLocation
            }
        } = this.props;
        try {
            if (value) {
                let searchTree = [];
                let keys = [];
                treetypes.map((tree) => {
                    let name = tree.properties.name;
                    if (name.indexOf(value) !== -1) {
                        keys.push(tree.key);
                        searchTree.push(tree);
                    }
                });
                console.log('searchTree', searchTree);
                console.log('keys', keys);
                // 如果所搜索的数据非树种名称，则查看是否为顺序码
                if (searchTree.length === 0 && value) {
                    let location = {};
                    let treeData = await getTreeLocation({sxm: value});
                    let treeMess = treeData && treeData.content && treeData.content[0];
                    // 如果根据顺序码查到的数据存在坐标，则不修改左侧树信息，对树节点进行定位
                    if (treeMess && treeMess.X && treeMess.Y) {
                        location.X = treeMess.X;
                        location.Y = treeMess.Y;
                        console.log('location', location);
                        await this.props.onLocation(location);
                        this.setState({
                            searchValue: '',
                            searchTree: []
                        });
                    } else {
                        // 如果根据顺序码查到的数据不存在坐标，则树数据为空，同时没有坐标信息
                        this.setState({
                            searchValue: value,
                            searchTree
                        });
                    }
                } else {
                    // 如果搜索的数据为树种名称，则展示搜索数据
                    this.setState({
                        searchValue: value,
                        searchTree
                    });
                }
            } else {
                // 如果搜索的信息为空，则取消定位信息，同时展示所有的树种信息
                await this.props.cancelLocation();
                this.setState({
                    searchValue: '',
                    searchTree: []
                });
            }
        } catch (e) {
            console.log('e', 'searchTree');
        }
    }
}

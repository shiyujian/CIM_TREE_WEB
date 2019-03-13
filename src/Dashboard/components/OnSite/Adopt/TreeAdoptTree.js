import React, { Component } from 'react';
import { Tree, Input } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class TreeAdoptTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: ''
        };
        this.originOnSelect = this.props.onSelect;
    }

    onSelect (keys, info) {
        console.log('keys', keys);
        this.originOnSelect(keys, info);
    }

    loop (p) {
        if (p) {
            return (
                <TreeNode
                    title={p.SXM}
                    key={p.ID}
                />
            );
        }
    }

    render () {
        const {
            searchTree = [],
            searchValue
        } = this.state;
        let contents = [];
        if (searchValue) {
            contents = searchTree;
        }
        console.log('contents', contents);
        return (
            <div>
                <Search
                    placeholder='请输入结缘人姓名'
                    onSearch={this.searchTreeData.bind(this)}
                    style={{ width: '100%', marginBotton: 10, paddingRight: 5 }}
                />
                <Tree
                    showIcon
                    onSelect={this.onSelect.bind(this)}
                    showLine
                >
                    {contents.map(p => {
                        return this.loop(p);
                    })}
                </Tree>
            </div>

        );
    }

    searchTreeData = async (value) => {
        const {
            actions: {
                getAdoptTreeByAdopter,
                getTreeLocation
            }
        } = this.props;
        try {
            if (value) {
                let postdata = {
                    aadopter: value
                };
                let data = await getAdoptTreeByAdopter(postdata);
                console.log('data', data);
                let adoptTrees = (data && data.content) || [];
                console.log('adoptTrees', adoptTrees);
                for (let i = 0; i < adoptTrees.length; i++) {
                    let adoptTree = adoptTrees[i];
                    let SXM = adoptTree.SXM;
                    let treeData = await getTreeLocation({sxm: SXM});
                    let treeMess = treeData && treeData.content && treeData.content[0];
                    if (treeMess && treeMess.X && treeMess.Y) {
                        adoptTree.X = treeMess.X;
                        adoptTree.Y = treeMess.Y;
                    }
                }
                // 去除没有定位数据的
                for (let i = 0; i < adoptTrees.length; i++) {
                    if (!(adoptTrees[i] && adoptTrees[i].X && adoptTrees[i].Y)) {
                        adoptTrees.splice(i, 1);
                    }
                }
                console.log('adoptTrees', adoptTrees);
                this.props.onCheck(adoptTrees);
                this.setState({
                    searchTree: adoptTrees,
                    searchValue: value
                });
            } else {
                this.props.onCheck([]);
                this.setState({
                    searchTree: [],
                    searchValue: value
                });
            }
        } catch (e) {
            console.log('searchTree', e);
        }
    }
}

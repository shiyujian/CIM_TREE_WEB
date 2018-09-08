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
        this.originOnCheck = this.props.onCheck;
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
            searchTree,
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
                    placeholder='请输入养护人名称'
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
            let postdata = {
                aadopter: value
            };
            let data = await getAdoptTreeByAdopter(postdata);
            console.log('data', data);
            let adoptTrees = (data && data.content) || [];
            for (let i = 0; i < adoptTrees.length; i++) {
                let adoptTree = adoptTrees[i];
                let SXM = adoptTree.SXM;
                let treeData = await getTreeLocation({sxm: SXM});
                let treeMess = treeData && treeData.content && treeData.content[0];
                adoptTree.X = treeMess.X;
                adoptTree.Y = treeMess.Y;
            }
            console.log('adoptTrees', adoptTrees);
            this.originOnCheck(adoptTrees);
            this.setState({
                searchTree: adoptTrees,
                searchValue: value
            });
        } catch (e) {
            console.log('searchTree', e);
        }
    }
}

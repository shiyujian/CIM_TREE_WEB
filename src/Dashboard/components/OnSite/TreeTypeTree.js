import React, { Component } from 'react';
import { Tree, Input } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: ''
        };
        this.featureName = this.props.featureName;
        this.originOnCheck = this.props.onCheck;
        // this.originOnSelect = this.props.onSelect;
    }

    onCheck (keys, info) {
        this.originOnCheck(keys, info);
    }

    onSelect (keys, info) {
        this.originOnSelect(keys, info);
    }

    genIconClass () {
        let icClass = '';
        let featureName = this.featureName;
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

    render () {
        let {
            content = [],
            treetypeTreeKeys
        } = this.props;
        const {
            searchTree,
            searchValue
        } = this.state;
        let contents = [];
        if (searchValue) {
            contents = searchTree;
        } else {
            for (let j = 0; j < content.length; j++) {
                const element = content[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        }
        return (
            <div>
                <Search
                    placeholder='请输入树种名称'
                    onSearch={this.searchTree.bind(this)}
                    style={{ width: '100%', marginBotton: 10, paddingRight: 5 }}
                />
                <div className={this.genIconClass()}>
                    <Tree
                        checkable
                        showIcon
                        onCheck={this.onCheck.bind(this)}
                        showLine
                        defaultCheckedKeys={treetypeTreeKeys}
                    >
                        {contents.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                </div>
            </div>

        );
    }

    searchTree = (value) => {
        const {
            treetypes = []
        } = this.props;
        try {
            let searchTree = [];
            treetypes.map((tree) => {
                let name = tree.properties.name;
                if (name.indexOf(value) !== -1) {
                    searchTree.push(tree);
                }
            });
            this.setState({
                searchValue: value,
                searchTree
            });
        } catch (e) {
            console.log('e', 'searchTree');
        }
    }
}

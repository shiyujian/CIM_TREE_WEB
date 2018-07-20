import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DashPanel extends Component {
    constructor (props) {
        super(props);
        this.featureName = this.props.featureName;
        this.originOnCheck = this.props.onCheck;
        this.originOnSelect = this.props.onSelect;
    }

    onCheck (keys, info) {
        this.originOnCheck(keys, this.featureName, info);
    }

    onSelect (keys) {
        this.originOnSelect(keys, this.featureName);
    }

    genIconClass () {
        let icClass = '';
        let featureName = this.featureName;
        // console.log("featureName",featureName)
        switch (featureName) {
            case 'geojsonFeature_people':
                icClass = 'tr-people';
                break;
            case 'geojsonFeature_hazard':
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
            if (p.disabled) {
                return (
                    <TreeNode
                        title={p.properties.name}
                        key={p.key}
                        isLeaf={p.isLeaf}
                        disabled
                    >
                        {p.children &&
                            p.children.map(m => {
                                return me.loop(m);
                            })}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode
                        title={p.properties.name}
                        key={p.key}
                        isLeaf={p.isLeaf}
                    >
                        {p.children &&
                            p.children.map(m => {
                                return me.loop(m);
                            })}
                    </TreeNode>
                );
            }
        }
    }

    render () {
        let { content = [], loadData } = this.props;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element != undefined) {
                contents.push(element);
            }
        }
        let defaultCheckedKeys = '';
        let checkStatus = false;
        if (this.featureName === 'geojsonFeature_treetype') {
            if (contents && contents.length > 0) {
                defaultCheckedKeys = [contents[0].key];
                checkStatus = true;
            }
        }
        return (
            <div className={this.genIconClass()}>
                {this.featureName === 'geojsonFeature_people' ? (
                    <Tree
                        style={{ height: '200px' }}
                        checkable
                        showIcon
                        onCheck={this.onCheck.bind(this)}
                        showLine
                        onSelect={this.onSelect.bind(this)}
                        defaultExpandAll
                        //   checkedKeys={userCheckKeys}
                        loadData={loadData}
                    >
                        {contents.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                ) : checkStatus ? (
                    <Tree
                        checkable
                        showIcon
                        onCheck={this.onCheck.bind(this)}
                        showLine
                        onSelect={this.onSelect.bind(this)}
                        defaultExpandAll
                        defaultCheckedKeys={defaultCheckedKeys}
                    >
                        {contents.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                ) : (
                    <Tree
                        checkable
                        showIcon
                        onCheck={this.onCheck.bind(this)}
                        showLine
                        onSelect={this.onSelect.bind(this)}
                        defaultExpandAll
                    >
                        {contents.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                )}
            </div>
        );
    }
}

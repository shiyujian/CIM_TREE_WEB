import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DashPanel extends Component {
    constructor (props) {
        super(props);
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
        // console.log("featureName",featureName)
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
            trackTreeKeys = [],
            riskTreeKeys = []
        } = this.props;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element != undefined) {
                contents.push(element);
            }
        }
        return (
            <div className={this.genIconClass()}>
                {
                    this.featureName === 'geojsonFeature_track'
                        ? (
                            <Tree
                                checkable
                                showIcon
                                onCheck={this.onCheck.bind(this)}
                                showLine
                                // onSelect={this.onSelect.bind(this)}
                                defaultExpandAll
                                defaultCheckedKeys={trackTreeKeys}
                            >
                                {contents.map(p => {
                                    return this.loop(p);
                                })}
                            </Tree>
                        )
                        : (
                            <Tree
                                checkable
                                showIcon
                                onCheck={this.onCheck.bind(this)}
                                showLine
                                // onSelect={this.onSelect.bind(this)}
                                defaultExpandAll
                                defaultCheckedKeys={riskTreeKeys}
                            >
                                {contents.map(p => {
                                    return this.loop(p);
                                })}
                            </Tree>
                        )
                }
            </div>
        );
    }
}

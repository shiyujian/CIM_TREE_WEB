import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class TrackTree extends Component {
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

    loop (data = [], loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime > 1) {
            return (
                <TreeNode
                    title={data.CreateTime}
                    key={JSON.stringify(data)}
                    selectable={false}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        } else {
            return (
                <TreeNode
                    title={data.Full_Name}
                    key={data.ID}
                    selectable={false}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        let {
            content = []
        } = this.props;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element !== undefined) {
                contents.push(element);
            }
        }
        return (
            <div className={this.genIconClass()}>
                <Tree
                    checkable
                    showIcon
                    onCheck={this.onCheck.bind(this)}
                    showLine
                >
                    {contents.map(p => {
                        return this.loop(p);
                    })}
                </Tree>
            </div>
        );
    }
}

import React, { Component } from 'react';
import { Tree, Radio } from 'antd';
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

export default class DashPanel extends Component {
    constructor (props) {
        super(props);
        this.originOnCheck = this.props.onCheck;
        this.originOnSelect = this.props.onSelect;
        this.state = {
            checkkeys: [],
            radioValue: '细班选择'
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                changeSelectMap
            }
        } = this.props;
        try {
            // await changeSelectMap('细班选择');
        } catch (e) {

        }
    }

    onCheck (keys, info) {
        const {
            actions: {
                changeCheckedKeys
            }
        } = this.props;
        changeCheckedKeys(keys);
        this.originOnCheck(keys, info);
    }

    onSelect (keys, info) {
        this.originOnSelect(keys, info);
    }

    loop (p, loopTime) {
        let me = this;
        const that = this;
        let disableCheckbox = false;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 3) {
            disableCheckbox = true;
        }
        if (p) {
            return (
                <TreeNode
                    title={p.Name}
                    key={p.No}
                    disableCheckbox={disableCheckbox}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        let { content = [] } = this.props;
        const that = this;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element != undefined) {
                contents.push(element);
            }
        }
        return (
            <div>
                <RadioGroup onChange={this.handleRadioChange.bind(this)} value={this.state.radioValue} style={{marginBottom: 10}}>
                    <Radio value={'细班选择'}>细班选择</Radio>
                    <Radio value={'手动框选'}>手动框选</Radio>
                </RadioGroup>
                <Tree
                    checkable
                    // showIcon
                    checkedKeys={this.props.checkedKeys}
                    onCheck={this.onCheck.bind(that)}
                    showLine
                    onSelect={this.onSelect.bind(this)}
                    defaultExpandAll
                >
                    {contents.map(p => {
                        return that.loop(p);
                    })}
                </Tree>

            </div>
        );
    }

    handleRadioChange = async (e) => {
        const {
            actions: {
                changeSelectMap
            }
        } = this.props;
        console.log('radio checked', e.target.value);
        await changeSelectMap(e.target.value);
        this.setState({
            radioValue: e.target.value
        });
    }
}

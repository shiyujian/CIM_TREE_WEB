import React, { Component } from 'react';
import { Tree } from 'antd';
const { TreeNode } = Tree;
class TemplateTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            name: 1
        };
    }
    render () {
        console.log(this.props.dataList);
        const {
            dataList: {
                editableTemplates = [],
                uneditableTemplates = []
            },
            onSelect,
            selectedKeys = []
        } = this.props;
        return (
            <div>
                <Tree
                    showLine
                    defaultExpandedKeys={['0', '1']}
                    selectedKeys={selectedKeys}
                    onSelect={onSelect}
                >
                    <TreeNode title={`可编辑的模板（${editableTemplates.length}）`} key='0'>
                        {
                            editableTemplates.map(item => {
                                return <TreeNode title={item.Name} key={item.ID} />;
                            })
                        }
                    </TreeNode>
                    <TreeNode title={`已激活的模板（${uneditableTemplates.length}）`} key='1'>
                        {
                            uneditableTemplates.map(item => {
                                return <TreeNode title={item.Name} key={item.ID} />;
                            })
                        }
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}
export default TemplateTree;

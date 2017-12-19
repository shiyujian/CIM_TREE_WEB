import React from 'react';
import {string, array, func, object} from 'prop-types';
import {Button, Popconfirm, Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export default class TemplateTree extends React.Component {
  static propTypes = {
    name: string,
    data: object,
    onSelect: func,
  };

  static defaultProps = {
  	data: {},
  }

  constructor(props) {
    super(props);
  }

  render() {
  	const {
  		data: {
        editableTemplates = [],
        uneditableTemplates=[]
      },
  		onSelect,
      selectedKeys = [],
  	} = this.props;

    return (
      
		<Tree
			showLine
			defaultExpandedKeys={['0','1']}
      selectedKeys={selectedKeys}
			onSelect={onSelect}
		>
			<TreeNode title={`可编辑的模板（${editableTemplates.length}）`} key="0">
				{
					editableTemplates.map((item,index)=>{
						return (
							<TreeNode title={ item.name } key={item.id} />
						)
					})
				}
			</TreeNode>
      <TreeNode title={`已激活的模板（${uneditableTemplates.length}）`} key="1">
      {
        uneditableTemplates.map((item,index)=>{
          return (
            <TreeNode title={ item.name } key={item.id} />
          )
        })
      }
    </TreeNode>
		</Tree>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Spin, Tabs, Tree } from 'antd';
import moment from 'moment';
import reducer, { actions } from '../store/index';
import { actions as platformActions } from '_platform/store/global';
import './index.less'
import { DATASOURCEDIRTYPECODE, DATASOURCEDIRITEMCODE } from '_platform/api'
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
@connect(
	state => {
		const { platform, dataresource = {} } = state || {};
		return { ...dataresource, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
	}),
)
export default class DirTypeTree extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {
            actions: {
                getDirTree
            }
        } = this.props;

		getDirTree({ code: DATASOURCEDIRTYPECODE });

	}

	render() {
		const { dirTreeList = [] } = this.props;
		return (
			<Tree showLine
				defaultExpandAll={false}
				onSelect={this.props.onSelect}>
				{
					DirTypeTree.loop(dirTreeList)
				}
			</Tree>
		)


	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}--${item.obj_type}`}
						title={`${item.name}`}>
						{
							DirTypeTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}--${item.obj_type}`}
				title={`${item.name}`} />;
		});
	};
}
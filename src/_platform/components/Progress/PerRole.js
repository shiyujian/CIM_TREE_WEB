/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {Component} from 'react';
import {TreeSelect} from 'antd';
import {WORKFLOW_API} from '../../api'
import * as actions from './store';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


@connect(
	state => {
		const {progress = {}} = state || {};
		return {
			role: progress.role,

		};
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
		dispatch
	})
)


export default class PerRole extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			select: false,
			value: '',
			treeData: null,
		}
		this.treeNodes = [];
		this.treeData = [];
	}

	componentDidMount() {
		let {rootTreeNodes = []} = this.props;
		// let rootTreeData = rootTreeNodes
		Promise.all(this.createRoleMemberTree(rootTreeNodes)).then(values => {
			rootTreeNodes = this.createSelectTree(rootTreeNodes)

			this.setState({
				treeData: rootTreeNodes
			});
		})
	}

	render() {
		const {rootTreeNodes = []} = this.props;

		const {
			treeData
		} = this.state;

		console.log('treeData', treeData)
		return (
			<TreeSelect
				style={{width: '100%'}}
				value={this.state.value}
				dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
				treeData={treeData}
				placeholder="请选择执行人"
				treeDefaultExpandAll
				onChange={this.onChange}
				treeCheckable={true}
				allowClear={true}
			/>
		)
	}

	createSelectTree(rootTreeNodes) {
		for (var i = 0; i < rootTreeNodes.length; i++) {
			if (rootTreeNodes[i].children) {
				rootTreeNodes[i].type = 'role';
				rootTreeNodes[i].label = rootTreeNodes[i].name;
				rootTreeNodes[i].value = rootTreeNodes[i].type + '#' + rootTreeNodes[i].code + '#' + rootTreeNodes[i].name + '#' + rootTreeNodes[i].id;
				rootTreeNodes[i].key = rootTreeNodes[i].id;
				rootTreeNodes[i].children = this.createSelectTree(rootTreeNodes[i].children)
			} else {
				rootTreeNodes[i].label = rootTreeNodes[i].name;
				rootTreeNodes[i].value = rootTreeNodes[i].type + '#' + rootTreeNodes[i].code + '#' + rootTreeNodes[i].name + '#' + rootTreeNodes[i].pk + '#' + rootTreeNodes[i].username;
				rootTreeNodes[i].key = rootTreeNodes[i].pk;
			}
		}
		return rootTreeNodes;
	}

	onChange = (value) => {
		let index = this.props.index
		this.setState({value});
		this.props.selectMember(value, index)

	}
	createRoleMemberTree = (rootTree) => {

		return rootTree.map((roleNode, index) => {
			return this.recursiveTree(roleNode)
				.then(finalNode => rootTree[index] = finalNode);
		});

	}

	getRoleDetailInfo = (pk) => {
		const {
			actions: {
				getRoleTree,
			}
		} = this.props;
		let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
		let Workflow_API = '';
		const System_API = WORKFLOW_API;
		for (var i = 0; i < System_API.length; i++) {
			if (system.system === System_API[i].name) {
				Workflow_API = System_API[i].value;
			}
		}

		const data = {
			Workflow_API: Workflow_API,
			pk,
		};

		// return getRoleTree(data)
		return getRoleTree(data).then((payload) => {
			let tree = '';
			if (payload) {
				tree = {
					id: payload.id,
					name: payload.name,
					code: payload.code,
					type: 'role',
					label: payload.name,
					value: payload.code,
					key: payload.id,
					children: [],
				}

			}
			return tree
		});

	}
	getMembersByRoleCode = (pk) => {
		const {
			actions: {
				getRoleMember,
			}
		} = this.props;
		let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
		let Workflow_API = '';
		const System_API = API_CONFIG.Workflow_API;
		for (var i = 0; i < System_API.length; i++) {
			if (system.system === System_API[i].name) {
				Workflow_API = System_API[i].value;
			}
		}

		const data = {
			Workflow_API: Workflow_API,
			pk: pk
		};

		return getRoleMember(data).then((payload) => {
			const tree = [];
			if (payload) {
				for (var i = 0; i < payload.members.length; i++) {
					tree.push({
						pk: payload.members[i].id,
						code: payload.members[i].account.person_code,
						name: payload.members[i].account.person_name,
						username: payload.members[i].username,
						type: payload.members[i].account.person_type,
						label: payload.members[i].account.person_name,
						value: payload.members[i].account.person_code,
						key: payload.members[i].id,
					})
				}
			}
			return tree;
		});
	}

	recursiveTree = (currentNode, fatherNode = null, indexOfCurrNodeInFather = -1) => {
		return this.getRoleDetailInfo(currentNode.pk).then(rsp => {
			currentNode = rsp;

			const index = indexOfCurrNodeInFather;

			// find members
			return this.getMembersByRoleCode(currentNode.id).then(memberArray => {
				currentNode.children.push(...memberArray);
				return currentNode;
			});

			if (fatherNode && index !== -1) {
				fatherNode.children[index] = currentNode;
			}
			return currentNode;

		});

	}

}

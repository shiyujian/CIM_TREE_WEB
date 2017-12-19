/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {Component} from 'react';
import {Spin, Select} from 'antd';
import * as actions from './store';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUser} from '../../auth';
import {WORKFLOW_API} from '../../api'

const Option = Select.Option;


@connect(
	state => {
		const {institution = {}} = state.incompleteTask || {};
		return {
			userList: institution.userList,

		};
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
		dispatch
	})
)


export default class Per extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			select: false,
			dataList: [],
			value: '',
			fetching: false,
		}
		this.lastFetchId = 0;
		this.put = [];

	}


	render() {

		let {fetching, dataList, value} = this.state;
		let index = this.props.index;
		return (
			<div>
				<div>
					<Select style={{width: '100%'}}
					        id={"searchText" + index}
					        mode="multiple"
					        placeholder="请输入执行人姓名"
					        notFoundContent={fetching ? <Spin size="small"/> : null}
					        filterOption={false}
					        onSearch={this.fetchNode}
					        defaultActiveFirstOption={false}
					        onChange={this.handleChange}>
						{dataList.map(d => <Option key={d.value}>{d.text}</Option>)}
					</Select>
				</div>
			</div>
		);
	}

	handleChange = (value) => {
		let index = this.props.index
		this.setState({value});
		this.props.selectMember(value, index)
	}

	fetchNode = (value) => {
		let index = this.props.index;
		const searchText = document.getElementById("searchText" + index);
		let login = getUser();
		const {
			actions: {
				getUserList,
			}
		} = this.props;
		console.log('22222222222', searchText.value)

		if (searchText.value) {
			const postData = {
				keyword: searchText.value,
			}
			let system = JSON.parse(window.localStorage.getItem('USER_DATA'));
			let Workflow_API = '';
			const System_API = WORKFLOW_API;
			for (var i = 0; i < System_API.length; i++) {
				if (system.system === System_API[i].name) {
					Workflow_API = System_API[i].value;
				}
			}
			let url = {
				Workflow_API: Workflow_API,
			}
			this.lastFetchId += 1;
			const fetchId = this.lastFetchId;
			this.setState({fetching: true});
			getUserList(url, postData, {}).then((payload) => {
				if (fetchId !== this.lastFetchId) {
					return;
				}
				let tree = [];
				if (payload) {
					for (var i = 0; i < payload.length; i++) {
						tree.push({
							pk: payload[i].id,
							code: payload[i].account.person_code,
							name: payload[i].account.person_name,
							username: payload[i].username,
						})
					}
				}
				this.put = tree;
				let dataList = this.put.map(node => ({
					text: node.code + '-' + node.name,
					obj: JSON.stringify({
						code: node.code,
						name: node.name,
						pk: node.pk,
						username: node.username,
					}),
					value: 'C_PER' + '#' + node.code + '#' + node.name + '#' + node.pk + '#' + node.username,
					fetching: false,
				}));
				if (dataList.length === 0) {
					dataList = [{
						text: '未找到结果',
						value: 'none',
						fetching: false
					}];
				}
				this.setState({dataList});
			});
		} else {
			this.setState({dataList: []});
		}

	}

}

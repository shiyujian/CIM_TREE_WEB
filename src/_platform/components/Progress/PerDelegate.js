/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {Component} from 'react';
import {Spin, Select, TreeSelect} from 'antd';
import style from './index.css';
import * as actions from '../store/institution';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getUser} from '../../../auth';

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


export default class PerDelegate extends Component {
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
		return (
			<div>
				<div>
					<Select
						style={{width: '100%'}}
						id="DelegateSearchText"
						value={value}
						mode="combobox"
						placeholder="请输入委托人员姓名"
						notFoundContent={fetching ? <Spin size="small"/> : null}
						filterOption={false}
						onSearch={this.fetchNode}
						style={{width: '100%'}}
						defaultActiveFirstOption={false}
						onChange={this.handleChange}
					>
						{dataList.map(d => <Option key={d.value}>{d.text}</Option>)}
					</Select>
				</div>
			</div>
		);
	}

	handleChange = (value) => {
		let memberInfo = '';
		let memberValue = value.toString().split('#');
		if (memberValue[0] === 'C_PER') {
			memberInfo = memberValue[2]
			this.setState({value: memberInfo});
			this.props.selectDelegateMember(memberValue)
		}
	}

	fetchNode = (value) => {
		const searchText = document.getElementById("DelegateSearchText");
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
			const System_API = API_CONFIG.Workflow_API;
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

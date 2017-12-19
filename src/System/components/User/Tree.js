import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import {Button} from 'antd';

export default class Tree extends Component {
	static propTypes = {};

	render() {
		const {
			platform: {org: {children = []} = {}},
			sidebar: {node = {}} = {},
		} = this.props;
		const {code} = node || {};
		return (<SimpleTree dataSource={children} selectedKey={code} onSelect={this.select.bind(this)}/>);
	}

	componentDidMount() {
		const {actions: {getOrgTree}} = this.props;
		getOrgTree({}, {depth: 3});
	}

	select([code]) {
		const {
			platform: {org: {children = []} = {}},
			actions: {changeSidebarField, getUsers}
		} = this.props;
		const node = Tree.loop(children, code);
		changeSidebarField('node', node);
		const codes = Tree.collect(node);
		getUsers({}, {org_code: codes});
	}

	static loop = (list, code) => {
		let rst = null;
		list.find((item = {}) => {
			const {code: value, children = []} = item;
			if (value === code) {
				rst = item;
			} else {
				const tmp = Tree.loop(children, code);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};

	static collect = (node = {}) => {
		const {children = [], code} = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Tree.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	}
}

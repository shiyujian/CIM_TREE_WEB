import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import {Button, Popconfirm} from 'antd';

export default class Tree extends Component {
	static propTypes = {};

	render() {
		const {
			platform: {org: {children = []} = {}},
			sidebar: {node = {}} = {},
		} = this.props;
		const {code} = node || {};
		console.log("code",code)
		return (
			<div>
				<div style={{height: 35, paddingBottom: 5, borderBottom: '1px solid #dddddd', textAlign: 'center', marginBottom: 10}}>
					<Button style={{float: 'left'}} type="primary" ghost onClick={this.addOrg.bind(this)}>新建项目</Button>
					<Popconfirm title="是否真的要删除选中项目?"
					            onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
						<Button style={{float: 'right'}} type="danger" ghost>删除</Button>
					</Popconfirm>
				</div>
				<SimpleTree dataSource={children} selectedKey={code} onSelect={this.select.bind(this)}/>
			</div>);
	}

	componentDidMount() {
		const {actions: {getOrgTree, changeSidebarField}} = this.props;
		getOrgTree({}, {depth: 4}).then(rst => {
			const {children: [first] = []} = rst || {};
			if (first) {
				changeSidebarField('node', {...first, type: 'project'});
			}
		});
	}

	addOrg() {
		const {
			platform: {org = {}},
			actions: {changeAdditionField, changeSidebarField}
		} = this.props;
		console.log(this.props)
		changeSidebarField('parent', org);
		changeAdditionField('visible', true);
	}

	select(s, node) {
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const {
			platform: {org: {children = []} = {}},
			actions: {changeSidebarField}
		} = this.props;
		const org = Tree.loop(children, eventKey);
		changeSidebarField('node', org);
	}

	remove() {
		const {
			sidebar: {node = {}} = {},
			actions: {deleteOrg, getOrgTree}
		} = this.props;
		deleteOrg({code: node.code}).then(rst => {
			getOrgTree({}, {depth: 3});
		});
	}

	static loop = (list, code, deep = 0) => {
		let rst = null;
		list.find((item = {}) => {
			const {code: value, children = []} = item;
			if (value === code) {
				let type = '';
				switch (deep) {
					case 0:
						type = 'project';
						break;
					case 1:
						type = 'org';
						break;
					case 2:
						type = 'company';
						break;
					default:
						type = 'department';
						break;
				}
				rst = {...item, type};

			} else {
				const tmp = Tree.loop(children, code, deep + 1);
				if (tmp) {
					rst = tmp;
				}
			}
		});

		return rst;
	}
}

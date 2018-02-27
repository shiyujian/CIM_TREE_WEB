import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import {Button, Popconfirm} from 'antd';

export default class Tree extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			list: [],
		}
	}

	render() {
		const {
			platform: {org: {children = []} = {}},
			sidebar: {node = {}} = {},
		} = this.props;
		const {code} = node || {};
		console.log("code",code)
		// const list=this.filiter(children);
		return (
			<div>
				<div style={{height: 35, paddingBottom: 5, borderBottom: '1px solid #dddddd', textAlign: 'center', marginBottom: 10}}>
					<Button style={{float: 'left'}} type="primary" ghost onClick={this.addOrg.bind(this)}>新建机构类型</Button>
					<Popconfirm title="是否真的要删除选中组织结构?"
					            onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
						<Button style={{float: 'right'}} type="danger" ghost>删除</Button>
					</Popconfirm>
				</div>
				<SimpleTree dataSource={children} selectedKey={code} onSelect={this.select.bind(this)}/>
			</div>);
	}
	//根据标段信息显示组织结构，人员标段信息和组织机构标段信息要匹配
	filiter(list){
		const user=JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		if(!user.is_superuser){
			if(!user.account.sections||user.account.sections==[]){
				return []
			}
			else{
				for (let i = 0; i < list.length; i++) {
					const children = list[i].children;
					for (let j = 0; j < children.length; j++) {
						let c = children[j];
						if(!this.compare(user.account.sections,c.extra_params.sections)){
							 delete children[j]
						}
					}
				}
			}
		}
		return list;
	}
	//人员标段和组织机构标段比较器，如果满足条件返回true
	compare(l1,s){
		if(s==undefined){
			return false
		}
		let l2=s.split(',')
		for (let i = 0; i < l1.length; i++) {
			const e1 = l1[i];
			for (let j = 0; j < l2.length; j++) {
				const e2 = l2[j];
				if(e1==e2){
					return true
				}
			}
		}
		return false;
	}

	componentDidMount() {
		const {actions: {getOrgTree, changeSidebarField}} = this.props;
		getOrgTree({}, {depth: 4}).then(rst => {
			console.log(1111111,rst)
			const {children: [first] = []} = rst || {};
			this.setState({list:this.filiter(rst.children)});
			if (first) {
				changeSidebarField('node', {...first, type: 'org'});
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
						type = 'org';
						break;
					case 1:
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

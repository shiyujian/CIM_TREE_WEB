import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';

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
		const {actions: {getOrgTree, changeSidebarField, getUsers}} = this.props;
		getOrgTree({}, {depth: 3}).then(rst => {
			const {children: [first] = []} = rst || {};
			if (first) {
				changeSidebarField('node', first);
				const codes = Tree.collect(first);
				getUsers({}, {org_code: codes});
			}
		});
	}

	select(s, node) {
		const user=JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const {
			platform: {org: {children = []} = {}},
			actions: {changeSidebarField, getUsers,getTreeModal}
		} = this.props;
		const o = Tree.loop(children, eventKey);
		if(this.compare(user,user.account.sections,o.extra_params.sections)){
			if(o.code){
				getTreeModal(true)
			}else{
				getTreeModal(false)
				
			}
			changeSidebarField('node', o);
			const codes = Tree.collect(o);
			getUsers({}, {org_code: codes}).then((e) =>{
				getTreeModal(false)
			});
		}
	}
	//人员标段和组织机构标段比较器，如果满足条件返回true
	compare(user,l1,s){
		if(user.is_superuser){
			return true;
		}
		if(l1==undefined||s==undefined){
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
	static loop = (list, code) => {
		let rst = null;
		list.forEach((item = {}) => {
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

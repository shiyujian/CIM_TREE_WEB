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
		console.log(s,node)
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const {
			platform: {org: {children = []} = {}},
			actions: {changeSidebarField, getUsers}
		} = this.props;
		const o = Tree.loop(children, eventKey);
		changeSidebarField('node', o);
		const codes = Tree.collect(o);
		getUsers({}, {org_code: codes});
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

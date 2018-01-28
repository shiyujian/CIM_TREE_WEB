import React, {Component} from 'react';
import {Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export default class Roles extends Component {
	static propTypes = {};

	render() {
		const {platform: {roles = []} = {}, table: {role = {}} = {},} = this.props;
		const id = String(role.id);
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);
		return (
			<div>
				<Tree showLine style={{paddingLeft: '30px', marginTop: '10px'}}
				      onSelect={this.select.bind(this)} selectedKeys={[id]}>
					<TreeNode key="a" title="苗圃">
						{
							systemRoles.map(role => {
								return (<TreeNode key={role.id} title={role.name}/>)
							})
						}
					</TreeNode>
					<TreeNode key="b" title="施工">
						{
							projectRoles.map(role => {
								return (
									<TreeNode key={role.id} title={role.name} />
								)
							})
						}
					</TreeNode>
					<TreeNode key="c" title="监理">
						{
							professionRoles.map(role => {
								return (<TreeNode key={role.id} title={role.name}/>)
							})
						}
					</TreeNode>
					<TreeNode key="d" title="业主">
						{
							departmentRoles.map(role => {
								return (<TreeNode key={role.id} title={role.name}/>)
							})
						}
					</TreeNode>
				</Tree>
			</div>)
	}

	componentDidMount() {
		const {actions: {getRoles}, actions: {changeTableField}} = this.props;
		getRoles().then((roles = []) => {
			const [role = {}] = roles || []; //默认第一个
			role && changeTableField('role', role);
			role && role.permissions && changeTableField('permissions', role.permissions);
		});
	}

	select(s, node) {
		const {
			platform: {roles = []} = {},
			actions: {changeTableField}
		} = this.props;
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const role = roles.find(role => role.id === +eventKey);
		role && changeTableField('role', role);
		role && role.permissions && changeTableField('permissions', role.permissions);
	}
}

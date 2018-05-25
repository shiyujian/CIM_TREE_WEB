import React, {Component} from 'react';
import {Table, Checkbox, Button, Switch} from 'antd';
import { MODULES, MODULES2} from '_platform/api';
import Card from '_platform/components/panels/Card';
import {getUser} from '_platform/auth';
import './index.css'
export default class PermissionTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userLogin:""
		}
	}
	static propTypes = {};
	render() {
		let userPermi;
		if (this.state.userLogin === "admin") {
			userPermi = MODULES.map(ele => {
				return { ...ele };
			});
		} else {
			userPermi = MODULES.map(ele => {
				return { ...ele };
			});
		}
		const {
			table: {editing} = {},
			actions: {changeTableField},
		} = this.props;
		return (
			<div>
				<Card title="权限详情" extra={
					<div>
						{editing || <Button type="primary" ghost onClick={changeTableField.bind(this, 'editing', true)}>编辑</Button>}
						{editing && <Button type="primary" onClick={this.save.bind(this)}>保存</Button>}
					</div>}>
					<Table showLine columns={this.columns} dataSource={userPermi} bordered pagination={false} rowKey="id" className='tableLevel2'/>
				</Card>
			</div>);
	}
	componentDidMount(){
		const {
			actions: {getLoginUser },
		} = this.props;
		// 函数调用传参({id:value})
		let userid = getUser().id;
		getLoginUser({
			id: userid
		}).then(rst => {
			let flag = true;
			rst.groups.map(item => {
				if (item.name === "超级管理员"){
					flag = true;
				}else{
					flag = false;
				}
			})
			if (flag) {
				this.setState({
					userLogin:"admin"
				})
			} else {
				this.setState({
					userLogin: "common"
				})
			}
		})
	}
	save() {
		const {
			table: {role = {}, permissions = []} = {},
			actions: {changeTableField, putRole, getRoles},
		} = this.props;
		console.log("permissions",permissions)
		changeTableField('editing', false);
		putRole({id: role.id}, {name: role.name, grouptype: role.grouptype, permissions}).then((rst) => {
			getRoles().then((roles = []) => {
				let myrole = roles.find(theRole =>{
					return theRole.id === role.id;
				});
				myrole && changeTableField('role', myrole);
				myrole && myrole.permissions && changeTableField('permissions', myrole.permissions);
				// console.log('p2p22',permissions)
			});
		})
	}

	check(key) {
		const {table: {permissions = []} = {}, actions: {changeTableField}} = this.props;

		const has = permissions.some(permission => permission === key);
		let rst = [];
		if (has) {
			rst = permissions.filter(permission => permission !== key)
		} else {
			rst = [...permissions, key]
		}
		changeTableField('permissions', rst);

		// if(value=="0"){
		// 	let newValue="1";
		// 	for (var i = 0; i < permissions.length; i++) {
		// 		if (permissions[i].id == id){
		// 			permissions[i].value=newValue
		// 		}
		// 	}
		// }
		// if(value=="1"){
		// 	let newValue="0";
		// 	for (var i = 0; i < permissions.length; i++) {
		// 		if (permissions[i].id == id){
		// 			permissions[i].value=newValue
		// 		}
		// 	}
		// }
		// changeTableField('permissions', permissions);
		// console.log('pppppp',permissions)
	}

	columns = [{
		title: '模块',
		dataIndex: 'name',
		width: '50%',
	}
	, {
		title: '是否可见',
		width: '25%',
		render: (item) => {
			const {table: {editing, permissions = []} = {}} = this.props;

			const key = `appmeta.${item.id}.READ`;
			// permissions里面是当前用户拥有的所有的权限
			const value = permissions.some(permission => permission === key);
			return <Switch checked={value} disabled={!editing} checkedChildren="开" unCheckedChildren="关" onChange={this.check.bind(this, key)}/>

			// const key = 1
			// // permissions里面是当前用户拥有的所有的权限
			// for (var i = 0; i < permissions.length; i++) {
			// 	if (permissions[i].id == `${item.id}`) {
			// 		if (permissions[i].value & key == 1) {
			// 			return(
			// 				<Switch checked={true} disabled={!editing} checkedChildren="开" unCheckedChildren="关" onChange={this.check.bind(this, permissions[i].id,permissions[i].value)}/>)	
			// 		}else{
			// 			return (
			// 				<Switch checked={false} disabled={!editing} checkedChildren="开" unCheckedChildren="关" onChange={this.check.bind(this, permissions[i].id,permissions[i].value)}/>)
			// 		}
			// 	}				
			// }
		}
	}
    ];
	static loop = (MODULES, permissions = []) => {
		return MODULES.map(module => {
			const {children = []} = module || {};
			module.visible = permissions.some(permission => permission === module.id);
			module.editable = permissions.some(permission => permission === module.id);
			PermissionTable.loop(children, permissions);
			return module;
		});
	}

}

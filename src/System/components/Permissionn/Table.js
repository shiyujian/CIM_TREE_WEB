import React, {Component} from 'react';
import {Table, Checkbox, Button, Switch,Row,Col} from 'antd';
import { MODULES, MODULES2} from '_platform/api';
import Card from '_platform/components/panels/Card';
import {getUser} from '_platform/auth';


export default class PermissionTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userLogin:"",
			indeterminate:false

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
			userPermi = MODULES2.map(ele => {
				return { ...ele };
			});
		}
		console.log('userPermi',userPermi);
		const {
			table: {editing} = {},
			actions: {changeTableField},
		} = this.props;
		return (
			<div>
				<Row>
                   <Col span={24}>
                    <p style={{marginLeft:'10'}}>权限设置</p>
                    <div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
                    </div>
                   </Col> 
               </Row>
               <Row>
                   <Col span={24} style={{marginLeft:'60',width:'90%'}}>
                    {
                    	userPermi.map((item,index)=>{
                    		const {table: {editing, permissions = []} = {}} = this.props;
							const key = `appmeta.${item.id}.READ`;
							// permissions里面是当前用户拥有的所有的权限
							const value = permissions.some(permission => permission === key);
                    		console.log('item.children',item.children)
                    		return <div>
								{
									index%2==0?
									<div style={{background:'#99FFFF',height:'100'}}>
									  <div style={{paddingLeft:'20px',paddingTop:'2px'}}>
								          <Checkbox
								            indeterminate={this.state.indeterminate}
								            checked={value}
								            disabled={!editing}
								            onChange={this.check.bind(this, key)}
								          >
								            {item.name}
								          </Checkbox>
							          </div>
							          <br/>
							          {
								          	item.children && item.children.map((element)=>{
								          		const {table: {editing, permissions = []} = {}} = this.props;
												const key = `appmeta.${element.id}.READ`;
												// permissions里面是当前用户拥有的所有的权限
												const value = permissions.some(permission => permission === key);
								          		return <div style={{paddingLeft:'40px',float:'left'}}>
												          <Checkbox
												            indeterminate={this.state.indeterminate}
												            checked={value}
												            disabled={!editing}
												            onChange={this.check.bind(this, key)}
												           >
												            {element.name}
												          </Checkbox>
													   </div>
								          	})
							          }
							        </div>
							        :<div style={{height:'100'}}>
									  <div style={{paddingLeft:'20px',paddingTop:'2px'}}>
								          <Checkbox
								            indeterminate={this.state.indeterminate}
								            checked={value}
								            disabled={!editing}
								            onChange={this.check.bind(this, key)}
								          >
								            {item.name}
								          </Checkbox>
							          </div>
							          <br/>
							          {
								          	item.children && item.children.map((element)=>{
								          		const {table: {editing, permissions = []} = {}} = this.props;
												const key = `appmeta.${element.id}.READ`;
												// permissions里面是当前用户拥有的所有的权限
												const value = permissions.some(permission => permission === key);
								          		return <div style={{paddingLeft:'40px',float:'left'}}>
												          <Checkbox
												            indeterminate={this.state.indeterminate}
												            checked={value}
												            disabled={!editing}
												            onChange={this.check.bind(this, key)}
												           >
												            {element.name}
												          </Checkbox>
													   </div>
								          	})
							          }
							        </div>
								}
							</div>
                    	}) 
                    }
                   </Col> 
               </Row>
                <Row>
                   <Col span={24} style={{marginLeft:'60',marginTop:'10', width:'90%', textAlign:'center'}}>
                   		<div >
                   			<Button type="primary" onClick={changeTableField.bind(this, 'editing', true)} >修改</Button>
                   			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						    <Button type="primary" ghost onClick={this.save.bind(this)} >保存</Button>
                   		</div>
                   </Col>
                </Row>		
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
				if (item.name === "超级管理员") {
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
		changeTableField('editing', false);
		putRole({id: role.id}, {name: role.name, grouptype: role.grouptype, permissions}).then((rst) => {
			getRoles().then((roles = []) => {
				let myrole = roles.find(theRole =>{
					return theRole.id === role.id;
				});
				myrole && changeTableField('role', myrole);
				myrole && myrole.permissions && changeTableField('permissions', myrole.permissions);
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
	}

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

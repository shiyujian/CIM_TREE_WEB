import React, {Component} from 'react';
import {Table, Checkbox, Button, Switch,Row,Col} from 'antd';
import { MODULES, MODULES2} from '_platform/api';
import Card from '_platform/components/panels/Card';
import {getUser} from '_platform/auth';

const CheckboxGroup=Checkbox.Group;
const plainOptions = [
	{id: "HOME", name: "首页",children: ['新闻通知','待办任务','进程信息统计','质量信息统计']},
	{id: "DISPLAY", name: "综合展示", children: ['二维展示','安全隐患','工程影响']},
	{id: "MANAGE", name: "综合管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "DATUM", name: "资料管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "QUALITY", name: "质量管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "SCHEDULE", name: "进度管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "SAFETY", name: "安全管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "COST", name: "造价管理", children: ['二维展示','安全隐患','工程影响']},
	{id: "SELFCARE", name: "个人中心", children: ['二维展示','安全隐患','工程影响']}

];
export default class PermissionTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userLogin:"",
			checkedList: [],
    		indeterminate: true,
    		checkAll: false,
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
                    <Table  columns={this.columns} dataSource={plainOptions} 
                    		showHeader={false} pagination={false} rowKey="id"
                    		style={{padding:'0px 8px'}}/>
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

	columns = [{
		title: '模块',
		dataIndex: 'name',
		width: '100%',
		render:(text,record,index)=>{
			return <div>
				{
					index%2==0?
					<div style={{background:'#99FFFF',height:'50'}}>
			          <Checkbox
			            indeterminate={this.state.indeterminate}
			            onChange={this.onCheckAllChange}
			            checked={this.state.checkAll}
			          >
			            {record.name}
			          </Checkbox>
			          <br/>
			          <div style={{paddingLeft:'40px'}}>
				          <CheckboxGroup 
				          	options={record.children} 
				          	value={this.state.checkedList} 
				          	onChange={this.onChange}
				           />
			           </div>
			        </div>
			        :<div >
			          <Checkbox
			            indeterminate={this.state.indeterminate}
			            onChange={this.onCheckAllChange}
			            checked={this.state.checkAll}
			          >
			            {record.name}
			          </Checkbox>
			          <br/>
			          <div style={{paddingLeft:'40px'}}>
				          <CheckboxGroup 
				          	options={record.children} 
				          	value={this.state.checkedList} 
				          	onChange={this.onChange}
				           />
			           </div>
			        </div>
				}
			</div>
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
	// getArr=(list)=>{
	// 	let option=[];
	// 		for(let i=0;i<list.length;i++){
	// 			option.push(list[i].name)
	// 		}
	// 	return option;
	// }
	onChange = (checkedList) => {
	    this.setState({
	      checkedList,
	      indeterminate: !!checkedList.length && (checkedList.length < record.children.length),
	      checkAll: checkedList.length === record.children.length
	    });
    }
    onCheckAllChange = (e) => {
	    this.setState({
	      checkedList: e.target.checked ? record.children : [],
	      indeterminate: false,
	      checkAll: e.target.checked
	    });
    }

}

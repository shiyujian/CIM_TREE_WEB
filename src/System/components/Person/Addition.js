import React, { Component } from 'react';
import { Modal, Row, Col, Form, Input, Select, message } from 'antd';
import {getProjectUnits} from '../../../_platform/auth'
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

export default class Addition extends Component {
	static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			searchList:[],
			search:false,
			searchValue:''
        }
	}

	renderContent() {
		
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const { platform: { roles = [] } } = this.props;
		var systemRoles = []
		if(user.is_superuser){
			systemRoles.push({name:'苗圃角色',value:roles.filter(role => role.grouptype === 0)});
			systemRoles.push({name:'施工角色',value:roles.filter(role => role.grouptype === 1)});
			systemRoles.push({name:'监理角色',value:roles.filter(role => role.grouptype === 2)});
			systemRoles.push({name:'业主角色',value:roles.filter(role => role.grouptype === 3)});
		}
		else{
			for (let i = 0; i < user.groups.length; i++) {
				const rolea = user.groups[i].grouptype
				switch (rolea) {
					case 0:
						systemRoles.push({name:'苗圃角色',value:roles.filter(role => role.grouptype === 0)});
						break;
					case 1:
						systemRoles.push({name:'苗圃角色',value:roles.filter(role => role.grouptype === 0)});
						systemRoles.push({name:'施工角色',value:roles.filter(role => role.grouptype === 1)});
						break;
					case 2:
						systemRoles.push({name:'监理角色',value:roles.filter(role => role.grouptype === 2)});
						break;
					case 3:
						systemRoles.push({name:'业主角色',value:roles.filter(role => role.grouptype === 3)});
						break;
					default:
						break;
				}
			}
		}

		const objs=	systemRoles.map(roless => {
			return(<OptGroup label={roless.name}>
					{
						roless.value.map(role => {
							return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
						})
					}
					</OptGroup>)
		})
		return objs
	}

	render() {
		const { platform: { roles = [] }, addition = {}, actions: { changeAdditionField }, tags = [] } = this.props;
		const tagsOptions = this.initopthins(tags);
		console.log('addition',addition.tags)
		const{
			search
		}= this.state
		let nurseryData = [];
		let defaultNurse = this.query(addition)
		let units = this.getUnits()
		return (
			<Modal title={addition.id ? "编辑人员信息" : "新增人员"} visible={addition.visible} className="large-modal" width={800}
				maskClosable={false}
				onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<Row gutter={24}>
					<Col span={12}>
						<FormItem {...Addition.layout} label="用户名">
							<Input readOnly={!!addition.id} placeholder="请输入用户名" value={addition.username}
								onChange={changeAdditionField.bind(this, 'username')} />
						</FormItem>
						<FormItem {...Addition.layout} label="姓名">
							<Input placeholder="请输入姓名" value={addition.person_name} onChange={changeAdditionField.bind(this, 'person_name')} />
						</FormItem>
						<FormItem {...Addition.layout} label="性别">
							<Select placeholder="请选择性别" value={addition.gender} onChange={changeAdditionField.bind(this, 'gender')} style={{ width: '100%' }}>
								<Option value="女">女</Option>
								<Option value="男">男</Option>
							</Select>
						</FormItem>
						<FormItem {...Addition.layout} label="密码">
							<Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password}
								onChange={changeAdditionField.bind(this, 'password')} />
						</FormItem>
						<FormItem {...Addition.layout} label="标段">
							<Select placeholder="标段" value={addition.sections} onChange={changeAdditionField.bind(this, 'sections')}
								mode="multiple" style={{ width: '100%' }}>
								{
									units?
									units.map((item)=>{
										return <Option key={item.code} value={item.code} >{item.value}</Option>
									}):
									''
								}
							</Select>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...Addition.layout} label="邮箱">
							<Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} />
						</FormItem>
						<FormItem {...Addition.layout} label="手机号码">
							<Input placeholder="请输入手机号码" value={addition.person_telephone} onChange={changeAdditionField.bind(this, 'person_telephone')} />
						</FormItem>
						<FormItem {...Addition.layout} label="职务">
							<Input placeholder="请输入职务" value={addition.title} onChange={changeAdditionField.bind(this, 'title')} />
						</FormItem>
						<FormItem {...Addition.layout} label="角色">
							<Select placeholder="请选择角色" value={addition.roles} onChange={this.changeRoles.bind(this)}
								mode="multiple" style={{ width: '100%' }}>
								{
									this.renderContent()
								}
							</Select>
						</FormItem>
						<FormItem {...Addition.layout} label="苗圃">
							<Select placeholder="苗圃" showSearch   
							value={defaultNurse}
							optionFilterProp = 'children'
							filterOption={(input,option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							onChange={this.changeNursery.bind(this)}
							mode="multiple" style={{ width: '100%' }} >
								{/* {tagsOptions} */}
								{
									tags.map((rst)=>{
										return (<Option key={rst.ID} value={rst.ID} title={rst.Factory}>{rst.NurseryName+'-'+rst.Factory}</Option>)
									})
								}
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Modal>
		);
	}

	//获取项目的标段
	getUnits(){
		const {
			sidebar: { node = {} } = {},
			listStore = []
		} = this.props;
		let projectName = ''
		listStore.map((item,index)=>{
			item.map((rst)=>{
				if( (rst.name === node.name) && (rst.code === node.code)){
					projectName = listStore[index]?listStore[index][0].name:''
				}
			})
			
		})
		console.log('projectName',projectName)
		return getProjectUnits(projectName)
	}

	//初始化苗圃
	initopthins(list) {
		const ops = [];
		for (let i = 0; i < list.length; i++) {
			ops.push(<Option key={list[i].ID} >{list[i].NurseryName}</Option>)
		}
		return ops;
	}

	componentDidMount() {
		const { actions: { getRoles } } = this.props;
		getRoles();
	}

	changeRoles(value) {
		const { actions: { changeAdditionField } } = this.props;
		changeAdditionField('roles', value)
	}
	//将选择的苗圃传入redux
	changeNursery(value){
		const { actions: { changeAdditionField }, tags = [] } = this.props;
		let defaultTags = []
		//对于从select组建传过来的value，进行判断，如果是ID，直接push，如果是苗圃名字，那么找到对应的ID，再push
		value.map((item)=>{
			let data = item.toString().split('-');
			if(data.length===2){
				tags.map((rst)=>{
					if(rst && rst.ID){
						if(rst.NurseryName === data[0] && rst.Factory === data[1]){
							defaultTags.push(rst.ID.toString())
						}
					}
				})
			}else{
				defaultTags.push(item.toString())
			}
		})
		defaultTags = [...new Set(defaultTags)]
		changeAdditionField('tags', defaultTags)
	}
	//对苗圃的id显示为苗圃的名称
	query(value){
		if(value && value.tags){
			const {
				tags = []
			}= this.props
			let array = value.tags || []
			let defaultNurse = []
			array.map((item)=>{
				tags.map((rst)=>{
					if(rst && rst.ID){
						if(rst.ID.toString() === item){
							defaultNurse.push(rst.NurseryName+'-'+rst.Factory)
						}
					}
				})
			})
			return defaultNurse
		}
	}

	async save() {
		const {
			addition = {}, sidebar: { node } = {},
			actions: { postUser, clearAdditionField, getUsers, putUser }, tags = {}
		} = this.props;
		const roles = addition.roles || [];
		console.log("roles", roles)
		if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
			message.warn('请输入英文字符、数字');
		} else if (!addition.person_name) {
			message.warn('请输入姓名');
		} else {
			console.log("addition", addition)
			console.log("roles", roles)
			if (addition.id) {
				console.log("addition22", addition)
				console.log("organization", addition.organization)
				console.log("node", node)

				putUser({}, {
					id: addition.id,
					username: addition.username,
					email: addition.email,
					// password: addition.password, // 密码不能变？信息中没有密码
					account: {
						person_name: addition.person_name,
						person_type: "C_PER",
						person_avatar_url: "",
						organization: {
							pk: node.pk,
							code: addition.org_code,
							obj_type: "C_ORG",
							rel_type: "member",
							name: addition.organization
						},
					},
					tags: addition.tags,
					sections: addition.sections,
					//groups: [7],
					groups: roles.map(role => +role),
					is_active: true,
					basic_params: {
						info: {
							'电话': addition.person_telephone || '',
							'性别': addition.gender || '',
							'技术职称': addition.title || '',
							'phone': addition.person_telephone || '',
							'sex': addition.gender || '',
							'duty': ''
						}
					},
					extra_params: {},
					title: addition.title || ''
				}).then(async rst => {
					console.log("rst", rst)
					if (rst.code == 1) {
						const codes = Addition.collect(node);
						console.log("codes", codes);
						console.log("codescodescodescodescodescodes", codes);
						await getUsers({}, { org_code: codes });
						message.info('修改人员成功');
						clearAdditionField();
					} else {
						console.log("111")
						message.warn('服务器端报错！');
					}
				})
			} else {
				console.log("11", 111)
				console.log("roles", roles)
				postUser({}, {
					is_person: true,
					username: addition.username,
					email: addition.email || '',
					password: addition.password,
					account: {
						person_code: addition.code,
						person_name: addition.person_name,
						person_type: "C_PER",
						person_avatar_url: "",
						organization: {
							pk: node.pk,
							code: node.code,
							obj_type: "C_ORG",
							rel_type: "member",
							name: node.name
						},
					},
					tags: addition.tags,
					sections: addition.sections,
					groups: roles.map(role => +role),
					is_active: true,
					basic_params: {
						info: {
							'电话': addition.person_telephone || '',
							'性别': addition.gender || '',
							'技术职称': addition.title || '',
							'phone': addition.person_telephone || '',
							'sex': addition.gender || '',
							'duty': ''
						}
					},
					extra_params: {},
					title: addition.title || ''
				}).then(rst => {
					console.log("rst", rst)
					if (rst.code == 1) {
						message.info('新增人员成功');
						clearAdditionField();
						const codes = Addition.collect(node);
						getUsers({}, { org_code: codes });
					} else {
						console.log(rst)
						if (rst.code == 2) {

							message.warn('用户名已存在！');
						} else {
							console.log("222")
							message.warn('服务器端报错！');
						}
					}
				})
			}
		}
	}

	cancel() {
		const { actions: { clearAdditionField } } = this.props;
		clearAdditionField();
	}

	static collect = (node = {}) => {
		const { children = [], code } = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Addition.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}

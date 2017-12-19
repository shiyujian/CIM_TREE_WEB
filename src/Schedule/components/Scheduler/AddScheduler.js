import React, {Component} from 'react';

import {Input, Form, Spin,Icon,Button,DatePicker,Radio,Select,Checkbox } from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select;
const CheckboxGroup = Checkbox.Group;

export default class AddScheduler extends Component {

	constructor(props) {
		super(props);
		this.state = {
			supervisionUnit:null,
			constructionUnit:null,
			constructionPeopleList:[],
			supervisionPeopleList:[]
		};
	}

	render() {
		const {
			constructionUnitOrgs,
			supervisionUnitOrgs
			
		} =this.props
		const {
			constructionPeopleList,
			supervisionPeopleList
		}=this.state
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14}
		};
		const {
			form: {getFieldDecorator}
		} = this.props;
		const date = [
            1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
        ]
        const options = [
		  { label: '本期计划工程量', value: '本期计划工程量' },
		  { label: '累计完成工程量', value: '累计完成工程量' }
		];
		

		return (
			<Form>
				<FormItem {...formItemLayout} label="主题">
					{getFieldDecorator('subject', {
						rules: [
							{required: true, message: '请填写主题'}
						]
					})(
						<Input type="text" placeholder="请填写主题"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位">
					{getFieldDecorator('constructionUnit', {
						rules: [
							{required: true, message: '请选择施工单位'}
						]
					})(
						<Select  style={{ width: '100%' }}
							placeholder="请选择施工单位"
								onChange={(value)=>{
									let org = constructionUnitOrgs.find(rt=>rt.code === value);
									this.setConstructionPeopleList(org);
									this.setState({constructionUnit:org});
									this.props.form.setFieldsValue({
										informant: null
									});
								}}>
							{
								constructionUnitOrgs.map(r=>{
									return <Option value={r.code} key={r.code} >{r.name}</Option>
								})
							}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="填报人">
					{getFieldDecorator('informant', {
						rules: [
							{required: true, message: '请选择填报人'}
						]
					})(
						<Select  style={{ width: '100%' }}
							onSelect={this.constructSelect.bind(this)}
							placeholder="请选择填报人">
						{	
							constructionPeopleList.map(r=>{
								return <Option value={r.id} key={r.id} >{r.person_name}</Option>
							})
						}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="规定时间">
					{getFieldDecorator('starttime', {
						rules: [
							{required: true, message: '请选择时间'}
						]
					})(
						<RangePicker
						 style={{ width: '100%' }}
					     showTime={{ format: 'HH:mm' }}
					     format="YYYY-MM-DD HH:mm"
					     placeholder={['Start Time', 'End Time']}
					    />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="监理单位">
					{getFieldDecorator('supervisionUnit', {
						rules: [
							{required: true, message: '请选择监理单位'}
						]
					})(
						<Select  style={{ width: '100%' }}
							placeholder="请选择监理单位"
								onChange={(value)=>{
									let org = supervisionUnitOrgs.find(rt=>rt.code === value);
									this.setSupervisionPeopleList(org);
									this.setState({supervisionUnit:org})
									this.props.form.setFieldsValue({
										admin: null
									});
								}}>
							{
								supervisionUnitOrgs.map(r=>{
									return <Option value={r.code} key={r.code} >{r.name}</Option>
								})
							}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="审核人">
					{getFieldDecorator('admin', {
						rules: [
							{required: true, message: '请选择审核人'}
						]
					})(
						<Select style={{ width: '100%' }} 
						onSelect={this.superSelect.bind(this)}
						placeholder="请选择审核人">
						{	
							supervisionPeopleList.map(r=>{
								return <Option value={r.id} key={r.id} >{r.person_name}</Option>
							})
						}
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="审核时限">
					{getFieldDecorator('range', {
						rules: [
							{required: true, message: '请填写审核时限'}
						]
					})(
						<Select style={{ width: '100%' }}
                             placeholder="请选择审核时限"
                            >
                            {
                                date.map(r=>{
                                    return <Option value={r} key={r} >{r}</Option>
                                })
                            }
                            </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="填报内容">
					{getFieldDecorator('type', {
						rules: [
							{required: true, message: '请选择填报类型'}
						]
					})(
						<CheckboxGroup options={options}/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="周期">
					{getFieldDecorator('cycle', {
						rules: [
							{required: true, message: '请填写周期'}
						]
					})(
						<Select style={{ width: '100%' }} placeholder="请选择">
					      <Option value="week">每周</Option>
					      <Option value="day">每天</Option>
					      <Option value="workday">每工作日</Option>
					      <Option value="month">每月</Option>
					      <Option value="month3">每3个月</Option>
					      <Option value="week2">每2周</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="备注">
					{getFieldDecorator('remark')(
						<Input type="text" placeholder="选填"/>
					)}
				</FormItem>
			</Form>
		)
	}

	constructSelect(value){
		const{
			constructionPeopleList
		}=this.state
		const{
			actions:{
				reportMember
			}
		}=this.props
		let member = constructionPeopleList.find((rst)=> rst.id===value)
		console.log('member',member)
		reportMember(member)
	}

	superSelect(value){
		const{
			supervisionPeopleList
		}=this.state
		const{
			actions:{
				approvalMember
			}
		}=this.props

		let member = supervisionPeopleList.find((rst)=> rst.id===value)
		console.log('member',member)
		approvalMember(member)

	}
	
	setSupervisionPeopleList(unit){
		const {getOrgByCode,getEmployByOrgCode} = this.props.actions;
		let peopleList = [];
		let supervisionArray = []
		this.setState({supervisionPeopleList:[]});
		if(!unit){
			return;
		}
		if(unit.code){
			getOrgByCode({code:unit.code}).then((rst) => {
				if(rst.children){
					for(let i=0;i<rst.children.length;i++){
						getEmployByOrgCode({},{org_code:rst.children[i].code}).then((rsp) => {
							if(rsp.length!==0){    //该部门下面有员工
								for(let j=0;j<rsp.length;j++){
									let people = {};
									people.person_code = rsp[j].account.person_code;
									people.id = rsp[j].id;
									people.person_name = rsp[j].account.person_name;
									people.username = rsp[j].username;
									peopleList.push(people);
									console.log('peopleList',peopleList)
								}
								this.setState({supervisionPeopleList:peopleList});
								for(var i=0;i<peopleList.length;i++){

								}
							}
						});
					}
					
				}
			});
		}else{
			this.setState({supervisionPeopleList:[]});
			return;
		}
	}

	setConstructionPeopleList(unit){
		const {getOrgByCode,getEmployByOrgCode} = this.props.actions;
		let peopleList = [];
		this.setState({constructionPeopleList:[]});
		if(!unit){
			return;
		}
		if(unit.code){
			getOrgByCode({code:unit.code}).then((rst) => {
				if(rst.children){
					for(let i=0;i<rst.children.length;i++){
						getEmployByOrgCode({},{org_code:rst.children[i].code}).then((rsp) => {
							if(rsp.length!==0){    //该部门下面有员工
								for(let j=0;j<rsp.length;j++){
									let people = {};
									people.person_code = rsp[j].account.person_code;
									people.id = rsp[j].id;
									people.person_name = rsp[j].account.person_name;
									people.username = rsp[j].username;
									peopleList.push(people);
									console.log('peopleList',peopleList)
									this.setState({constructionPeopleList:peopleList});
								}
							}
						});
					}
					
				}
			});
		}else{
			this.setState({constructionPeopleList:[]});
			return;
		}

	}
}

import React, { Component } from 'react';
import { Modal, Row, Col, Form, Input, Select, message, Upload, Icon, Button, Switch } from 'antd';
import PropTypes from 'prop-types';

import { getProjectUnits } from '../../../_platform/auth'
import { base, STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import Tree from 'antd/lib/tree';
let fileTypes = 'application/jpeg,application/gif,application/png,image/jpeg,image/gif,image/png,image/jpg';

window.config = window.config || {};
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option, OptGroup } = Select;

// export default class Addition extends Component {
class Addition extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			searchList: [],
			search: false,
			searchValue: '',
			newKey: Math.random(),
			btns: true,
			btnf: true,
		}
	}

	renderContent() {

		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const { platform: { roles = [] } } = this.props;
		var systemRoles = []
		if (user.is_superuser) {
			systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
			systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
			systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
			systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
		}
		else {
			for (let i = 0; i < user.groups.length; i++) {
				const rolea = user.groups[i].grouptype
				switch (rolea) {
					case 0:
						systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
						break;
					case 1:
						systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
						systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
						break;
					case 2:
						systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
						break;
					case 3:
						systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
						break;
					default:
						break;
				}
			}
		}
		const objs = systemRoles.map(roless => {
			return (<OptGroup label={roless.name}>
				{
					roless.value.map(role => {
						return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
					})
				}
			</OptGroup>)
		})
		return objs
	}

	renderTitle() {

		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const { platform: { roles = [] } } = this.props;
		var systemRoles = []
		if (user.is_superuser) {
			systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
			systemRoles.push({ name: '施工职务', children: ["施工领导", "协调调度人", "质量负责人", "安全负责人", "文明负责人", "普通员工", "施工文书", "测量员"], value: roles.filter(role => role.grouptype === 1) });
			systemRoles.push({ name: '监理职务', children: ["总监", "监理组长", "普通监理", "监理文书"], value: roles.filter(role => role.grouptype === 2) });
			systemRoles.push({ name: '业主职务', children: ["业主", "业主文书", "业主领导"], value: roles.filter(role => role.grouptype === 3) });
		}
		else {
			for (let i = 0; i < user.groups.length; i++) {
				const rolea = user.groups[i].grouptype
				switch (rolea) {
					case 0:
						systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
						break;
					case 1:
						systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
						systemRoles.push({ name: '施工职务', children: ["施工领导", "协调调度人", "质量负责人", "安全负责人", "文明负责人", "普通员工", "施工文书", "测量员"], value: roles.filter(role => role.grouptype === 1) });
						break;
					case 2:
						systemRoles.push({ name: '监理职务', children: ["总监", "监理组长", "普通监理", "监理文书"], value: roles.filter(role => role.grouptype === 2) });
						break;
					case 3:
						systemRoles.push({ name: '业主职务', children: ["业主", "业主文书", "业主领导"], value: roles.filter(role => role.grouptype === 3) });
						break;
					default:
						break;
				}
			}
		}
		const objs = systemRoles.map(roless => {
			return (<OptGroup label={roless.name}>
				{
					roless.children.map(role => {
						return (<Option key={role} value={role}>{role}</Option>)
					})
				}
			</OptGroup>)
		})
		return objs
	}
	// 上传用户头像
	uploadChange(file) {

		const status = file.file.status;
		const { actions: { postUploadFilesImg, getImgBtn }, fileList = [] } = this.props;
		if (status === 'done') {
			let newFileList = file.file.response.download_url.split('/media')[1]
			// postUploadVideo(newFileList)
			getImgBtn(true)
			postUploadFilesImg(newFileList)
		}
		if (status === "removed") {
			getImgBtn(false)
			postUploadFilesImg()
		}
		if (event) {
			let { percent } = event;
			if (percent !== undefined) {

			}
			// this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	// 上传用户签名
	uploadChangew(file) {

		const status = file.file.status;
		const { actions: { postUploadAutograph, getAutographBtn }, postUploadAutographs = [] } = this.props;
		if (status === 'done') {
			let newFileList = file.file.response.download_url.split('/media')[1]
			// postUploadVideo(newFileList)
			getAutographBtn(true)
			postUploadAutograph(newFileList)
		}
		if (status === "removed") {
			getAutographBtn(false)
			postUploadAutograph()
		}
		if (event) {
			let { percent } = event;
			if (percent !== undefined) {

			}
			// this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	// 上传身份证正面照片
	uploadChanges(file) {
		console.log("file", file)
		const status = file.file.status;
		const { actions: { postUploadFilesNum, getImgNumBtn }, postUploadFilesNums = [] } = this.props;
		if (status === 'done') {
			let newFileList = postUploadFilesNums;
			let newFile = {
				name: file.file.name,
				filepath: STATIC_DOWNLOAD_API + "/media" + file.file.response.download_url.split('/media')[1]
			};
			// newFileList = newFileList.concat(newFile);
			getImgNumBtn(true)
			this.setState({ btnf: true })
			postUploadFilesNum(newFile)
		}
		if (status === "removed") {
			getImgNumBtn(false)
			postUploadFilesNum()
			this.setState({ btnf: false })
		}
		if (event) {
			let { percent } = event;
			if (percent !== undefined) {

			}
			// this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	// 上传身份证反面照片
	uploadChangea(file) {
		console.log("file", file)
		const status = file.file.status;
		const { actions: { postUploadNegative, getImgNegative }, postUploadNegatives = [] } = this.props;
		if (status === 'done') {
			let newFileList = postUploadNegatives;
			let newFile = {
				name: file.file.name,
				filepath: STATIC_DOWNLOAD_API + "/media" + file.file.response.download_url.split('/media')[1]
			};
			// newFileList = newFileList.concat(newFile);
			// console.log("")
			this.setState({ btns: true })

			getImgNegative(true)
			postUploadNegative(newFile)
		}
		if (status === "removed") {
			getImgNegative(false)
			postUploadNegative()
			this.setState({ btns: false })
		}
		if (event) {
			let { percent } = event;
			if (percent !== undefined) {

			}
			// this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	onChange(checked) {
		console.log("checked", checked);
	}

	render() {
		const { form: {
			getFieldDecorator
		}, platform: { roles = [] }, addition = {}, actions: { changeAdditionField, getImgArr }, tags = [] } = this.props;
		const tagsOptions = this.initopthins(tags);
		const {
			search
		} = this.state
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		let nurseryData = [];
		let defaultNurse = this.query(addition)
		let units = this.getUnits()
		let avatar_url = ''
		let avatar_urlName
		// 上传用户头像
		let fileList = []
		if (addition.person_avatar_url && addition.person_avatar_url != 'http://47.104.160.65:6511') {
			avatar_urlName = addition.person_avatar_url.split("/").pop()
			avatar_url = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + addition.person_avatar_url
			fileList = [{
				uid: -1,
				name: avatar_urlName,
				status: 'done',
				url: avatar_url,
				thumbUrl: avatar_url,
			}];
		}
		// 上传用户签名

		console.log("addition11111111111",addition)
		let autographList = []
		if (addition.relative_signature_url && addition.relative_signature_url != 'http://47.104.160.65:6511') {
			const avatar_urlName3 = addition.relative_signature_url.split("/").pop()
			const avatar_url3 = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + addition.relative_signature_url
			autographList = [{
				uid: -1,
				name: avatar_urlName3,
				status: 'done',
				url: avatar_url3,
				thumbUrl: avatar_url3,
			}];
		}
		// 上传身份证正面
		let fileList1 = []
		let id_image_url = ''
		let id_image_urlName
		if (addition.id_image && addition.id_image[0]) {

			if (addition.id_image[0].name && addition.id_image[0].filepath) {
				id_image_urlName = addition.id_image[0].name
				console.log('addition.id_image[0].filepath', addition.id_image[0].filepath)
				// filepath: STATIC_DOWNLOAD_API + "/media" + file.file.response.download_url.split('/media')[1]
				const id_img = addition.id_image[0].filepath.split('/media')[1]
				const id_imgs = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + id_img
				id_image_url = id_imgs ? id_imgs : addition.id_image[0].thumbUrl
				fileList1 = [{
					uid: 1,
					name: id_image_urlName,
					status: 'done',
					url: id_image_url,
					thumbUrl: id_image_url,
				}]
			}
		}

		// 上传身份证发面
		let fileList2 = []
		let id_image_url1 = ''
		let id_image_urlName1
		if (addition.id_image && addition.id_image[1]) {
			if (addition.id_image[1].name && addition.id_image[1].filepath) {

				const id_img = addition.id_image[1].filepath.split('/media')[1]
				const id_imgs = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + id_img
				

				id_image_urlName1 = addition.id_image[1].name
				// id_image_url1 = addition.id_image[1].filepath ? addition.id_image[1].filepath : addition.id_image[1].thumbUrl
				id_image_url1 = id_imgs ? id_imgs : addition.id_image[1].thumbUrl
				fileList2 = [{
					uid: 2,
					name: id_image_urlName1,
					status: 'done',
					url: id_image_url1,
					thumbUrl: id_image_url1,
				}]
			}
		}



		let marginTops = ''
		if (!user.is_superuser) {
			marginTops = '55px'
		}
		console.log("this.props,getImgBtns", this.props.getImgBtns)
		console.log("fileList", fileList)
		return (
			<div>
				{
					addition.visible && <Modal title={addition.id ? "编辑人员信息" : "新增人员"} visible={true} className="large-modal" width="80%"
						maskClosable={false}
						key={this.state.newKey}
						onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
						<Form>
							<Row gutter={24}>
								<Col span={12}>
									<FormItem   {...Addition.layout} label="用户名:">
										{
											getFieldDecorator('UserName', {
												initialValue: `${addition.username ? addition.username : ''}`,
												rules: [
													{ required: true, message: '请输入用户名' }
												]
											})
												(
												<Input readOnly={!!addition.id} placeholder="请输入用户名"
													onChange={changeAdditionField.bind(this, 'username')}
												/>
												)
										}

									</FormItem>
									<FormItem   {...Addition.layout} label="姓名:">
										{
											getFieldDecorator('FullName', {
												initialValue: `${addition.person_name ? addition.person_name : ''}`,
												rules: [
													{ required: true, message: '请输入姓名' }
												]
											})
												(
												<Input placeholder="请输入姓名"
													onChange={changeAdditionField.bind(this, 'person_name')}
												/>
												)
										}
									</FormItem>
									<FormItem   {...Addition.layout} label="性别:">
										{
											getFieldDecorator('sexName', {
												initialValue: `${addition.gender ? addition.gender : ''}`,
												rules: [
													{ required: true, message: '请选择性别' }
												]
											})
												(
												<Select placeholder="请选择性别" onChange={changeAdditionField.bind(this, 'gender')} style={{ width: '100%' }}>
													<Option value="女">女</Option>
													<Option value="男">男</Option>
												</Select>
												)
										}
									</FormItem>
									<FormItem   {...Addition.layout} label="身份证号码:">
										{
											getFieldDecorator('idcard', {
												initialValue: `${addition.id_num ? addition.id_num : ''}`,
												rules: [
													{ required: true, message: '请输入身份证号码' }
												]
											})
												(
												<Input placeholder="请输入身份证号码"
													onChange={changeAdditionField.bind(this, 'id_num')}
												/>
												)
										}
									</FormItem>
									{user.is_superuser ?
										<FormItem {...Addition.layout} label="部门编码">
											<Input placeholder="部门编码" value={addition.org_code} onChange={changeAdditionField.bind(this, 'org_code')} />
										</FormItem> : ''
									}
									{
										addition.id ? <FormItem {...Addition.layout} label="密码">
											<Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password}
												onChange={changeAdditionField.bind(this, 'password')} />
										</FormItem> : <FormItem   {...Addition.layout} label="密码:">
												{
													getFieldDecorator('PassWord', {
														initialValue: `${addition.password ? addition.password : ''}`,
														rules: [
															{ required: true, message: '请输入密码' }
														]
													})
														(
														<Input disabled={!!addition.id} placeholder="请输入密码"
															onChange={changeAdditionField.bind(this, 'password')} />
														)
												}
											</FormItem>
									}

									<FormItem {...Addition.layout} label="标段">
										<Select placeholder="标段" value={addition.id ? addition.sections : this.props.isSection} onChange={this.changeRolea.bind(this)}
											mode="multiple" style={{ width: '100%' }}>
											{
												units ?
													units.map((item) => {
														return <Option key={item.code} value={item.code} >{item.value}</Option>
													}) :
													''
											}
										</Select>
									</FormItem>
									<div style={{ marginLeft: '25%' }}>
										{/* {!addition.id || fileList.length == 0 || !this.state.btns ? */}
										<Upload name="file"
											multiple={true}
											accept={fileTypes}
											// showUploadList: false,
											action={base + "/service/fileserver/api/user/files/"}
											listType="picture"
											data={(file) => ({ name: file.fileName, a_file: file })}
											onChange={this.uploadChange.bind(this)}
											defaultFileList={fileList}
											disabled={fileList && fileList.length ? (this.props.getImgBtns == true ? this.props.getImgBtns : this.props.getImgBtns == false ? false : true) : this.props.getImgBtns}
										>
											<Button>
												<Icon type="upload" />
												<span>上传用户头像</span>
											</Button>
										</Upload>
									</div>

									<div style={{ marginLeft: '25%', marginTop: '30px' }}>
									{/* {!addition.id || fileList.length == 0 || !this.state.btns ? */}
									<Upload name="file"
											multiple={true}
											accept={fileTypes}
											// showUploadList: false,
											action={base + "/service/fileserver/api/user/files/"}
											listType="picture"
											data={(file) => ({ name: file.fileName, a_file: file })}
											onChange={this.uploadChangew.bind(this)}
											defaultFileList={autographList}
											// disabled={this.props.getAutographBtns}
											disabled={autographList && autographList.length ? (this.props.getAutographBtns == true ? this.props.getAutographBtns : this.props.getAutographBtns == false ? false : true) : this.props.getAutographBtns}
											
										>
											<Button>
												<Icon type="upload" />
												<span>上传用户签名</span>
											</Button>
										</Upload>
									</div>

								</Col>
								<Col span={12}>
									<FormItem {...Addition.layout} label="邮箱">
										<Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} />
									</FormItem>
									<FormItem   {...Addition.layout} label="手机号码:">
										{
											getFieldDecorator('telephone', {
												initialValue: `${addition.person_telephone ? addition.person_telephone : ''}`,
												rules: [
													{ required: true, message: '请输入手机号码' }
												]
											})
												(
												<Input placeholder="请输入手机号码" onChange={changeAdditionField.bind(this, 'person_telephone')} />
												)
										}
									</FormItem>
									<FormItem   {...Addition.layout} label="职务:">
										{
											getFieldDecorator('titles', {
												initialValue: `${addition.title ? addition.title : ''}`,
												rules: [
													{ required: true, message: '请选择职务' }
												]
											})
												(
												<Select placeholder="请选择职务" onChange={changeAdditionField.bind(this, 'title')}
													style={{ width: '100%' }}>
													{
														this.renderTitle()
													}
												</Select>
												)
										}
									</FormItem>

									<FormItem   {...Addition.layout} label="角色:">
										{
											getFieldDecorator('rolesNmae', {
												initialValue: addition.roles,
												rules: [
													{ required: true, message: '请选择角色' }
												]
											})
												(
												<Select placeholder="请选择角色"
													onChange={this.changeRoles.bind(this)}
													mode="multiple" style={{ width: '100%' }}>
													{
														this.renderContent()
													}
												</Select>
												)
										}
									</FormItem>
									{user.is_superuser ?
										<FormItem {...Addition.layout} label="部门名称">
											<Input placeholder="部门名称" value={addition.organization} onChange={changeAdditionField.bind(this, 'organization')} />
										</FormItem> : ''
									}
									<FormItem {...Addition.layout} label="苗圃">
										{/* <Select placeholder="苗圃" showSearch value={addition.tags} onChange={changeAdditionField.bind(this, 'tags')}
									mode="multiple" style={{ width: '100%' }} > */}
										{/* {tagsOptions} */}

										<Select placeholder="苗圃" showSearch
											value={defaultNurse}
											optionFilterProp='children'
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											onChange={this.changeNursery.bind(this)}
											style={{ width: '100%' }} >
											{tagsOptions}
										</Select>
									</FormItem>
									<Row >
										<Col span={8}>
											{user.is_superuser ?
												<FormItem {...Addition.layoutT} label="黑名单">
													{/* <Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} /> */}

													<Switch checked={addition.id ? (addition.is_black == 0 ? false : true) : false}
														onChange={changeAdditionField.bind(this, 'is_black')}
													/>

												</FormItem> : ''}
										</Col>
										<Col span={16}>
											{user.is_superuser ?
												<FormItem {...Addition.layoutR} label="原因">
													{/* <Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} /> */}

													<Input value={addition.black_remark}
														onChange={changeAdditionField.bind(this, 'black_remark')}
													/>
												</FormItem> : ''}
										</Col>

									</Row>

									<div style={{ marginLeft: '25%', marginTop: marginTops }}>
										{/* {!addition.id || fileList.length == 0 || !this.state.btns ? */}
										<Upload name="file"
											multiple={true}
											accept={fileTypes}
											// showUploadList: false,
											action={base + "/service/fileserver/api/user/files/"}
											listType="picture"
											data={(file) => ({ name: file.fileName, a_file: file })}
											onChange={this.uploadChanges.bind(this)}
											defaultFileList={fileList1}
											// disabled={this.props.getImgNumBtns}
											disabled={fileList1 && fileList1.length ? (this.props.getImgNumBtns == true ? this.props.getImgNumBtns : this.props.getImgNumBtns == false ? false : true) : this.props.getImgNumBtns}

										>
											<Button>
												<Icon type="upload" />
												<span>上传身份证正面照片</span>
											</Button>
										</Upload>
									</div>
									<div style={{ marginLeft: '25%', marginTop: '30px' }}>
										{/* {!addition.id || fileList.length == 0 || !this.state.btns ? */}
										<Upload name="file"
											multiple={true}
											accept={fileTypes}
											// showUploadList: false,
											action={base + "/service/fileserver/api/user/files/"}
											listType="picture"
											data={(file) => ({ name: file.fileName, a_file: file })}
											onChange={this.uploadChangea.bind(this)}
											defaultFileList={fileList2}
											// disabled={this.props.getImgNegatives}
											disabled={fileList2 && fileList2.length ? (this.props.getImgNegatives == true ? this.props.getImgNegatives : this.props.getImgNegatives == false ? false : true) : this.props.getImgNegatives}

										>
											<Button>
												<Icon type="upload" />
												<span>上传身份证反面照片</span>
											</Button>
										</Upload>
									</div>
								</Col>
							</Row>
						</Form>
					</Modal>
				}
			</div>

		);
	}

	//获取项目的标段
	getUnits() {
		const {
			sidebar: { node = {} } = {},
			listStore = []
		} = this.props;
		let projectName = ''
		listStore.map((item, index) => {
			item.map((rst) => {
				if ((rst.name === node.name) && (rst.code === node.code)) {
					projectName = listStore[index] ? listStore[index][0].name : ''
				}
			})

		})
		return getProjectUnits(projectName)
	}

	//初始化苗圃
	initopthins(list) {
		const ops = [];
		for (let i = 0; i < list.length; i++) {
			ops.push(<Option key={list[i].ID} value={list[i].ID} title={list[i].NurseryName + '-' + list[i].Factory}>{list[i].NurseryName + '-' + list[i].Factory}</Option>)
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
	changeRolea(value) {
		const { actions: { changeAdditionField, getSection } } = this.props;
		getSection(value)
		changeAdditionField('sections', value)
	}
	//将选择的苗圃传入redux
	changeNursery(value) {
		const { actions: { changeAdditionField }, tags = [] } = this.props;
		let defaultTags = []
		//对于从select组建传过来的value，进行判断，如果是ID，直接push，如果是苗圃名字，那么找到对应的ID，再push
		// value.map((item) => {
		let data = value.toString().split('-');
		if (data.length === 2) {
			tags.map((rst) => {
				if (rst && rst.ID) {
					if (rst.NurseryName === data[0] && rst.Factory === data[1]) {
						defaultTags.push(rst.ID.toString())
					}
				}
			})
		} else {
			defaultTags.push(value.toString())
		}
		// })
		defaultTags = [...new Set(defaultTags)]
		changeAdditionField('tags', defaultTags)
	}
	//对苗圃的id显示为苗圃的名称
	query(value) {
		if (value && value.tags) {
			const {
				tags = []
			} = this.props
			let array = value.tags || []
			let defaultNurse = []
			array.map((item) => {
				tags.map((rst) => {
					if (rst && rst.ID) {
						if (rst.ID.toString() === item) {
							defaultNurse.push(rst.NurseryName + '-' + rst.Factory)
						}
					}
				})
			})
			return defaultNurse
		}
	}

	save() {
		// const { actions: { postUploadFilesImg,getImgBtn }, fileList = [] } = this.props;

		const {
			addition = {}, sidebar: { node } = {},
			platform: { users = [] },
			actions: { postUser, clearAdditionField, getUsers, postUploadFilesImg, getImgBtn, postUploadNegative, getImgNegative, getAutographBtn,
				putUser, getSection, getTablePage, getIsBtn, postUploadFilesNum, getImgNumBtn, getSwitch,postUploadAutograph }, tags = {}
		} = this.props;
		const roles = addition.roles || [];
		console.log("addition", addition)
		if (!addition.id_image) {


			if (!this.props.postUploadFilesNums) {
				message.warn('请上传身份证正面照片');
				return
			}
			if (!this.props.postUploadNegatives) {
				message.warn('请上传身份证反面照片');
				return
			}

		} else {
			if (!this.props.postUploadFilesNums && !addition.id_image[0]) {

				message.warn('请上传身份证正面照片');
				return

			}
			if (!this.props.postUploadNegatives && !addition.id_image[1]) {

				message.warn('请上传身份证反面照片');
				return

			}

		}


		if (this.props.fileList) {
			addition.person_avatar_url = this.props.fileList
		} else {
			addition.person_avatar_url = addition.person_avatar_url
		}
		
		if (this.props.postUploadAutographs) {
			addition.relative_signature_url = this.props.postUploadAutographs
		} else {
			addition.relative_signature_url = addition.relative_signature_url
		}
		let blacksa
		let actives
		if (addition.is_black == true) {
			addition.is_active = false
			actives = false
			blacksa = 1
		}
		if (addition.is_black == false) {
			blacksa = 0
			addition.is_active = this.props.getIsActives
			actives = this.props.getIsActives
		}

		console.log("addition.id_image[1]", addition)
		let UploadFilesNums
		let UploadNegatives
		let imgBtnZ = true
		if (this.state.btnf == false && !this.props.postUploadFilesNums) {
			UploadFilesNums = null

			imgBtnZ = false
		} else if (this.state.btnf == true && this.props.postUploadFilesNums) {
			UploadFilesNums = this.props.postUploadFilesNums
			// addition.id_image=[]
			imgBtnZ = false
		} else {
			UploadFilesNums = addition.id_image[0]
			imgBtnZ = false
		}
		let imgBtnF = true
		if (this.state.btns == false && !this.props.postUploadNegatives) {
			UploadNegatives = null
			imgBtnF = false
		} else if (this.state.btns == true && this.props.postUploadNegatives) {
			UploadNegatives = this.props.postUploadNegatives
			imgBtnF = false
		} else {
			UploadNegatives = addition.id_image[1]
			imgBtnF = false
		}
		if (!imgBtnZ) {
			this.setState({ btnf: true })
		}
		if (!imgBtnF) {
			this.setState({ btns: true })
		}


		console.log("111111", UploadFilesNums)
		console.log("2222222", UploadNegatives)
		addition.id_image = [UploadFilesNums, UploadNegatives]
		if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
			message.warn('请输入英文字符、数字');
		} else {
			if (addition.id) {
				for (let i = 0; i < users.length; i++) {
					// const element = users[i];
					if (users[i].person_id == addition.person_id) {
						users[i] = addition
						users[i].account = addition
					}
				}
				this.props.form.validateFields((err, values) => {
					console.log("err", err)
					if (!err || !err.FullName && !err.UserName && !err.rolesNmae && !err.sexName && !err.telephone && !err.titles && !err.idcard) {
						putUser({}, {
							id: addition.id,
							username: addition.username,
							email: addition.email,
							// password: addition.password, // 密码不能变？信息中没有密码
							account: {
								person_name: addition.person_name,
								person_type: "C_PER",
								person_avatar_url: this.props.fileList || '',
								person_signature_url: this.props.postUploadAutographs || '',
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
							black_remark: addition.black_remark,
							is_active: actives,
							id_num: addition.id_num,
							is_black: blacksa,
							// id_image: [],
							id_image: [UploadFilesNums, UploadNegatives],
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
							if (rst.code == 1) {
								const codes = Addition.collect(node);
								message.info('修改人员成功');
								getSwitch()
								postUploadFilesImg()
								postUploadFilesNum()
								postUploadNegative()
								postUploadAutograph()
								// 控制是否通过角色条件分页
								// getIsBtn(true)
								let sectiona = []
								getSection(sectiona)
								clearAdditionField();
								this.setState({
									newKey: Math.random(),
								})

							} else {
								message.warn('服务器端报错！');
							}
						})
					}
				});

			} else {
				this.props.form.validateFields((err, values) => {

					if (!err) {
						postUser({}, {
							is_person: true,
							username: addition.username,
							email: addition.email || '',
							password: addition.password,
							account: {
								person_code: addition.code,
								person_name: addition.person_name,
								person_type: "C_PER",
								person_avatar_url: this.props.fileList || '',
								person_signature_url: this.props.postUploadAutographs || '',
								organization: {
									pk: node.pk,
									code: node.code,
									obj_type: "C_ORG",
									rel_type: "member",
									name: node.name
								},
							},
							tags: addition.tags,
							sections: addition.id ? addition.sections : this.props.isSection,
							groups: roles.map(role => +role),
							is_active: true,
							black_remark: addition.black_remark,
							id_num: addition.id_num,
							is_black: 0,
							id_image: [UploadFilesNums, UploadNegatives],
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
							if (rst.code == 1) {
								message.info('新增人员成功');
								let sectiona = []
								getSection(sectiona)
								clearAdditionField();
								postUploadFilesImg()
								postUploadFilesNum()
								postUploadNegative()
								postUploadAutograph()
								getAutographBtn()
								getImgBtn()
								getImgNumBtn()
								getImgNegative()
								const codes = Addition.collect(node);
								let paget = ''
								const totals = this.props.getTablePages.total
								if (totals >= 9) {
									if (totals.toString().length > 1) {
										const strs1 = totals.toString()
										const strs2 = strs1.substring(0, strs1.length - 1)
										paget = (strs2 * 1) + 1
									} else {
										paget = 1
									}
								} else {
									paget = 1
								}

								getUsers({}, { org_code: codes, page: paget }).then(rest => {
									let pagination = {
										current: paget,
										total: rest.count,
									};
									getTablePage(pagination)

								});
								this.setState({
									newKey: Math.random()
								})
							} else {
								if (rst.code == 2) {
									message.warn('用户名已存在！');
								} else {
									message.warn('服务器端报错！');
								}
							}
						})
					}
				});

			}
		}
	}

	cancel() {
		const { actions: { clearAdditionField, getImgBtn, getImgNumBtn, getSwitch, getImgNegative, getAutographBtn } } = this.props;
		getImgBtn()
		getImgNumBtn()
		getImgNegative()
		getAutographBtn()
		getSwitch()
		this.setState({
			newKey: Math.random(),
		})
		clearAdditionField();
	}

	static collect = (node = {}) => {
		const { children = [], code } = node;
		let rst = [];
		rst.push(code);
		// children.forEach(n => {
		// 	const codes = Addition.collect(n);
		// 	rst = rst.concat(codes);
		// });
		return rst;
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
	static layoutT = {
		labelCol: { span: 18 },
		wrapperCol: { span: 6 },
	};
	static layoutR = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
}
export default Form.create()(Addition)

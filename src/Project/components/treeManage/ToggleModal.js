import React, {Component} from 'react';
import {Modal, Form, Input, Upload, Icon, Row, Col, Button, Select, message} from 'antd';
import {base, STATIC_DOWNLOAD_API,DefaultZoomLevel} from '_platform/api';
import CodePicker from '_platform/components/panels/CodePicker';
const FormItem = Form.Item;
const Option = Select.Option;
const URL = window.config.VEC_W;

class ToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			// buildCode:'',
			leafletCenter: window.config.initLeaflet.center,
		}
	}
	static loop = (list, code) => {
		let rst = null;
		list.map((relation)=>{
			if(relation.children.filter(cd=>cd === code).length > 0){
				rst=relation;
			}
		});
		return rst;
	}
	componentDidMount() {
		const {
			actions:{postUploadFilesAc},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false
			},
			form: {setFieldsValue},
			fieldList=[],
			relation=[],
			selectField,
		} = this.props;
		if (toggleData.type === 'EDIT') {
			let fieldInfo = fieldList.filter(field => field.code === selectField)[0] || {};
			console.log(fieldInfo)
			setFieldsValue({
				'name': fieldInfo.name,
				'code': fieldInfo.code,
				'coordinates': fieldInfo.extra_params.coordinates.length===0 ? "" : JSON.stringify(fieldInfo.extra_params.coordinates),
				'group': ToggleModal.loop(relation,fieldInfo.code).code,
			});
			postUploadFilesAc([fieldInfo.extra_params.file_info])
			this.setState({
				coordinates:fieldInfo.extra_params.coordinates || []
			})

		}
	}

	uploadProps = {
		name: 'a_file',
		multiple: true,
		showUploadList: false,
		action: base + "/service/fileserver/api/user/files/",
		onChange:({file})=>{
			const status = file.status;
			if (status === 'done') {
				const {actions:{postUploadFilesAc}}=this.props;
				let newFile={
					download_url:'/media'+file.response.download_url.split('/media')[1],
					a_file:'/media'+file.response.a_file.split('/media')[1]
				};
				postUploadFilesAc([{...file.response,...newFile}])
			}
		},
	};

	closeModal() {
		const {actions: {toggleModalAc,postUploadFilesAc}} = this.props;
		postUploadFilesAc([]);
		toggleModalAc({
			type: null,
			visible: false,
		});
	}
	// changeCode(code){
	// 	console.log('====',code)
	// 	this.setState({
	// 		buildCode:code
	// 	})
	// }
	//发布公告
	postFieldData() {
		const {
			actions: {postFieldAc,getFieldAc,putFieldAc},
			form: {validateFields},
			toggleData: toggleData = {
				type:'ADD',
				visible: false,
			},
			fileList=[],
			fieldList=[],
			fieldGroup=[],
			selectField,
		} = this.props;
		validateFields((err, values) => {
			if (!err) {
				let postFunc=()=>{
					if(fileList.length === 0){
						message.warning('请上传区域文件！')
						return
					}
					let selectedGroup=fieldGroup.filter(group=>group.code === values["group"])
					//新增区域
					if(toggleData.type === 'ADD'){
						let fieldData={
							"name": values["name"],
							// "code": this.state.buildCode,
							"code": values["code"],
							"model_name": "",
							"obj_type": "C_LOC",
							"status": "A",
							"response_orgs":[],
							"extra_params": {
								"file_info":fileList[0],
								"coordinates":values["coordinates"] === '' ? [] : JSON.parse(values["coordinates"])
							},
							"parent": {"pk":selectedGroup[0]["pk"],"code":values["group"],"obj_type":selectedGroup[0]["obj_type"]},
							"related_documents":[]
						};
						console.log(
						'extra_params.coordinates',fieldData.extra_params.coordinates)
						postFieldAc({},fieldData)
							.then(rst=>{
								if(rst && rst.code){
									message.success('新增单元成功！')
									getFieldAc();
									this.closeModal();
								}else{
									message.error("新增单元失败！")
								}
							})
					}else{ //编辑
						let fieldInfo = fieldList.filter(field => field.code === selectField)[0] || {};
						let editData={
							"status": fieldInfo.status,
							"model_name": fieldInfo.model_name,
							"response_orgs":fieldInfo.response_orgs,
							"extra_params": {
								"file_info":fileList[0],
								"coordinates":values["coordinates"] === '' ? [] : JSON.parse(values["coordinates"])
							},
							"parent": {"pk":selectedGroup[0]["pk"],"code":values["group"],"obj_type":selectedGroup[0]["obj_type"]},
							"related_documents":fieldInfo.related_documents
						};

						putFieldAc({code:selectField},editData)
							.then(rst=>{
								if(rst && rst.code){
									message.success('编辑单元成功！')
									getFieldAc();
									this.closeModal();
								}else{
									message.error("编辑单元失败！")
								}
							})
					}
				}
				if(values["coordinates"] === ''){
					postFunc();
				}else{
					let key=true;
					try {
						JSON.parse(values["coordinates"]);
					} catch (err) {
						message.error('请检查经纬度字符串是否有误！')
						key=false;
					}
					if(key && JSON.parse(values["coordinates"]).length){
						postFunc();
					}else{
						message.error('请检查经纬度字符串是否有误！')
					}
				}
				// try{
				// 	JSON.parse(values["coordinates"]);
				//
				// }catch (err){
				// 	message.error('请检查经纬度字符串是否有误！')
				// }
			}
		});
	}
	_nameChange(value){
		console.log('_nameChange',value)
	}
	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			fileList=[],
			fieldGroup=[],
			// buildCode:buildCode={
			// 	name:'',
			// 	parent:''
			// }
		} = this.props;

		const {leafletCenter} = this.state;

		const formItemLayout = {
			labelCol: {span: 4},
            wrapperCol: {span: 18},
		};
		// console.log(1,buildCode.name)
		// console.log(2,buildCode.parent)
		return (
			<Modal
				title={toggleData.type === 'ADD' ? '新增树种' : '编辑树种'}
				visible={toggleData.visible}
				width='784px'
				maskClosable={false}
				onOk={this.postFieldData.bind(this)}
				onCancel={this.closeModal.bind(this)}
			>
				<div>
					<Form>
						<Row>
							<Col>
								<FormItem {...formItemLayout} label="单元地块名称">
									{getFieldDecorator('name', {
										rules: [{required: true, message: '请输入单元地块名称'}],
										initialValue: ''
									})(
										<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="单元地块名称"
										/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="所属区域">
									{getFieldDecorator('group', {
										rules: [{required: true, message: '请选择所属区域'}],
										initialValue: ''
									})(
										<Select
											placeholder="请选择所属区域"
										>
											{
												fieldGroup.map((group) => {
													return <Option value={group.code}
																   key={group.code}>{group.name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
									<FormItem {...formItemLayout} label="单元地块编码">
											{getFieldDecorator('code', {
                                       			 rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                                       				 initialValue: ''
                                    			})(
													<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="单元地块编码"/>
                                    			)}
										
									</FormItem>

								<FormItem {...formItemLayout} label="单元地块坐标">
									{getFieldDecorator('coordinates', {
										rules: [{required: true, message: '请输入单元地块坐标'}],
										initialValue: ''
									})(
										<Input type="textarea" rows={4}
											   placeholder='数据格式如下（Lat表示纬度，Lng表示经度，最少有3个点）：[{"Lat":22.5441736849,"Lng":113.894210769},{"Lat":22.5352372106,"Lng":113.894493147},{"Lat":22.5351600524,"Lng":113.88856872},{"Lat":22.5354355728,"Lng":113.88860357}]'
											   onBlur={this.coordinatesBlur.bind(this)}/>
									)}
								</FormItem>
								<Row style={{marginBottom:'20px'}}>
									<Col span={4}>
										<div style={{textAlign:'right',paddingRight:'8px'}}><i style={{color:'red'}}>*</i>&nbsp;单元地块文档:</div>
									</Col>
									<Col span={18}>
										<Row>
											<Col span={6}>
												<Upload {...this.uploadProps}>
													<Button>
														<Icon type="upload" />上传文件
													</Button>
												</Upload>
											</Col>
											<Col span={6}>
												{
													fileList.map((file,index)=>{
														return <div key={index}>{file.name}</div>
													})
												}
											</Col>
										</Row>

									</Col>
								</Row>
								<FormItem {...formItemLayout} label="单元地块地图">
									<Map center={leafletCenter} zoom={DefaultZoomLevel} zoomControl={false}
										 style={{position: 'relative', height: 260, width: '100%'}}>
										<TileLayer url={URL} subdomains={['7']}/>
										<Polygon positions={this._getPoints(this.state.coordinates || [])}/>
									</Map>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</div>
			</Modal>
		);
	}
	_getPoints(coordinates){
		let positions=[];
		coordinates.map(coordinate=>{
			positions.push([coordinate.Lat,coordinate.Lng])
		});
		return positions;
	}

	coordinatesBlur(){
		const {
			form: {getFieldValue},
		} = this.props;
		// try{
		// 	JSON.parse(getFieldValue('coordinates'))
		// 	this.setState({
		// 		coordinates:JSON.parse(getFieldValue('coordinates'))
		// 	})
		// }catch (err){
		// 	message.error('请输入正确的经纬度字符串！')
		// }
		let values=getFieldValue('coordinates');
		if(values === ''){
			return
		}
		let key=true;
		try {
			JSON.parse(values);
		} catch (err) {
			message.error('请检查经纬度字符串是否有误！');
			key=false;
		}
		if(key && JSON.parse(values).length){
			this.setState({
				coordinates: JSON.parse(values)
			})
		}else{
			message.error('请检查经纬度字符串是否有误！')
		}

	}
}

export default Form.create()(ToggleModal)

import React, {Component} from 'react';
import {Modal, Form, Input, Upload, Icon, Row, Col, Button, Select, message, TreeSelect, Spin} from 'antd';
import {getUser} from '../../../_platform/auth';
import {base, STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';
import {Map, TileLayer, Marker, Polygon} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
const Option = Select.Option;

const TreeNode = TreeSelect.TreeNode;
const URL = window.config.VEC_W;

class ToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			fileList: [],
			imagesList: [],
			buildCode: '',
			postLoading: false,
			leafletCenter: window.config.initLeaflet.center,
		}
	}

	static checkLoop = (list, checkCode) => {
		let rst = null;
		list.find((item = {}) => {
			const {code, children = []} = item;
			if (code === checkCode) {
				rst = item;
			} else {
				const tmp = ToggleModal.checkLoop(children, checkCode);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};

	componentDidMount() {
		const {
			actions: {postUploadFilesAc},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false
			},
			form: {setFieldsValue},
			unitList = [],
			selectUnit,
		} = this.props;
		if (toggleData.type === 'EDIT') {
			let unitInfo = ToggleModal.checkLoop(unitList, !selectUnit ? '' : selectUnit.split('--')[0]) || {};
			setFieldsValue({
				'name': unitInfo.name,
				'code': unitInfo.code,
				'desc': unitInfo.extra_params.desc,
				'coordinates': unitInfo.extra_params.coordinates.length === 0 ? "" : JSON.stringify(unitInfo.extra_params.coordinates),
				'images': this._setImages(unitInfo.extra_params.images),
				'unit': this._getUnitList(unitInfo.extra_params.unit || []),
				'projectUnit': this._getProjectUnitList(unitInfo.extra_params.projectUnit || []),
			});
			console.log(setFieldsValue.unit)
			this.setState({
				imagesList: this._setImages(unitInfo.extra_params.images),
				coordinates: unitInfo.extra_params.coordinates || []
			});
			postUploadFilesAc(unitInfo.extra_params.file_info ? [unitInfo.extra_params.file_info] : [])
		}
	}

	//重新组织参建单位
	_getUnitList(unit) {
		let arr = [];
		unit.map(item => {
			arr.push(`${item.code}--${item.name}--${item.type}`)
		});
		return arr
	}

	//重新其他单位工程
	_getProjectUnitList(projectUnit) {
		let newArr = [];
		projectUnit.map(pu => {
			newArr.push(`${pu.code}--${pu.name}--${pu.pk}`)
		});
		return newArr
	}


	uploadProps = {
		name: 'a_file',
		multiple: true,
		showUploadList: false,
		action: base + "/service/fileserver/api/user/files/",
		onChange: ({file}) => {
			const status = file.status;
			if (status === 'done') {
				const {actions: {postUploadFilesAc}} = this.props;
				let newFile = {
					download_url: '/media' + file.response.download_url.split('/media')[1],
					a_file: '/media' + file.response.a_file.split('/media')[1]
				};
				postUploadFilesAc([{...file.response, ...newFile}])
			}
		},
	};
	imagesProps = {
		name: 'a_file',
		multiple: true,
		listType: 'picture-card',
		action: base + "/service/fileserver/api/user/files/",
		onChange: ({fileList}) => {
			this.setState({
				imagesList: fileList
			})
		},
	};

	closeModal() {
		const {actions: {toggleModalAc, postUploadFilesAc}} = this.props;
		postUploadFilesAc([]);
		toggleModalAc({
			type: null,
			visible: false,
		});
	}

	_setImages(images = []) {
		let urls = [];
		images.map(image => {
			let newFile = {
				uid: image.id,
				name: image.name,
				status: 'done',
				url: SOURCE_API + image.a_file,
				image: image
			};
			urls.push(newFile)
		});
		return urls;
	}

	//生成新的图片列表
	_getImagesUrl(files = []) {
		let urls = [];
		files.map(file => {
			if (file.response) {
				let newFile = {
					download_url: '/media' + file.response.download_url.split('/media')[1],
					a_file: '/media' + file.response.a_file.split('/media')[1]
				};
				urls.push({...file.response, ...newFile})
			} else {
				urls.push(file.image)
			}

		});
		return urls;
	}

	//生成参建单位
	_setUnit(unit = []) {
		let newUnit = [];
		unit.map(item => {
			newUnit.push({
				code: item.split('--')[0],
				name: item.split('--')[1],
				type: item.split('--')[2],
			})
		})
		return newUnit
	}

	//生成关联单位工程
	_setProjectUnit(projectUnit = []) {
		let newProjectUnit = [];
		projectUnit.map(item => {
			newProjectUnit.push({
				code: item.split('--')[0],
				name: item.split('--')[1],
				pk: item.split('--')[2],
			})
		})
		return newProjectUnit
	}

	//获取元数据中的目录树
	_getTree(dirList = []) {
		let dirTree = [];
		dirList.map((dir) => {
			if (dir.parent === '') {
				dirTree.push(dir)
			}
			else {
				dirTree.map((tree) => {
					tree.children = dirList.filter((dir) => dir.parent === tree.code)
					if (tree.children) {
						tree.children.map((tr) => {
							tr.children = dirList.filter((dir) => dir.parent === tr.code)
						});
					}
				});
			}
		})
		return dirTree
	}

	//新增单位工程或编辑单位工程
	postUnitData() {
		const {
			actions: {postUnitAc, putUnitAc, getUnitAc, postInstance, postLogEvent,postLocationAc,setCAnJianList},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			selectUnit,
			unitList = [],
			// examines = [],
			fileList = [],
			dirList = [],
		} = this.props;
		validateFields((err, values) => {
			let parentNode = selectUnit.split('--');
			let dirData = this._getTree(dirList);
			if (!err) {
				let postFunc = () => {
					if (fileList.length === 0) {
						message.warning('请上传单位工程文件！')
						return
					}
					if (this.state.imagesList.length === 0) {
						message.warning('请上传相关图片！')
						return
					}
					if (toggleData.type === 'ADD') {
						this.setState({
							postLoading: true,
						})
						let postUnit = {
							"name": values["name"],
							"code": values["code"],
							"obj_type": parentNode[2] === "C_PJ" ? "C_WP_UNT" : "C_WP_UNT_S",
							"status": "A",
							"version": "A",
							"extra_params": {
								"desc": values["desc"],
								"coordinates": values["coordinates"] === '' ? [] : JSON.parse(values["coordinates"]),
								"file_info": fileList[0],
								"images": this._getImagesUrl(this.state.imagesList),
								"unit": this._setUnit(values["unit"] || []),
								"projectUnit": this._setProjectUnit(values["projectUnit"] || []),
							},
							"parent": {
								"name": parentNode[1],
								"code": parentNode[0],
								"obj_type": parentNode[2]
							},
							"response_orgs": [],
						};
						// 创建单位工程
						postUnitAc({}, postUnit)
							.then(rst1 => {
								if (rst1 && rst1.code) {
									if (parentNode[2] === "C_PJ") {
										// 创建单位工程
										const { selectUnit, dirTree = [], actions: { postDirAc, postDirListAc } } = this.props;
										let parentNode = selectUnit.split('--');
										let parentDir = dirTree.filter(dir => dir.code === parentNode[0])[0];
										// 创建单位工程的工程目录
										postDirAc({}, {
											"status": "A",
											"obj_type": "C_DIR",
											"code": values["code"],
											"name": values["name"],
											"extra_params": {},
										}).then((rst) => {
											// 以上的全部创建完毕之后，需要创建单位工程下面的文件夹
											let first_obj_list = {
												data_list: []
											};
											dirData.map((dir) => {
												let obj = {
													"status": "A",
													"obj_type": "C_DIR",
													"code": values["code"] + '_' + dir["code"],
													"name": dir["name"],
													"extra_params": dir["extra_params"],
													"parent": { "code": rst.code, "obj_type": "C_DIR" }
												};
												first_obj_list.data_list.push(obj)
											});
											//调用批量创建的接口
											postDirListAc({}, first_obj_list)
												.then(({ result }) => {
													//	新增二级目录
													let second_obj_list = {
														data_list: []
													};
													dirData.map(({ children }, index) => {
														let parent_o = result[index];
														children.map((child) => {
															let second_obj = {
																"status": "A",
																"obj_type": "C_DIR",
																"code": values["code"] + '_' + child["code"],
																"name": child["name"],
																"extra_params": child["extra_params"],
																"parent": {
																	"code": parent_o.code,
																	"obj_type": "C_DIR"
																}
															};
															second_obj_list.data_list.push(second_obj)
														})
													})
													postDirListAc({}, second_obj_list)
														.then(({ result }) => {
															//	新增三级目录
															let promise_index = -1;
															let third_obj_list = {
																data_list: []
															};
															dirData.map((child) => { //1级循环
																child.children.map(({ children }) => { //二级循环
																	promise_index = promise_index + 1;
																	let parent_t = result[promise_index];
																	children.map((cd) => { //三级循环
																		let third_obj = {
																			"status": "A",
																			"obj_type": "C_DIR",
																			"code": values["code"] + '_' + cd["code"],
																			"name": cd["name"],
																			"extra_params": cd["extra_params"],
																			"parent": {
																				"code": parent_t.code,
																				"obj_type": "C_DIR"
																			}
																		};
																		third_obj_list.data_list.push(third_obj)
																	})
																})
															});
															postDirListAc({}, third_obj_list).then(({ result }) => {
																this.setState({
																	postLoading: false,
																})
																// 修改单位工程的locations
																putUnitAc({code:rst1.code},{
																	"locations": [{
																		"pk": rst.pk,
																		"code": rst.code,
																		"obj_type": rst.obj_type
																	}],
																	"version":'A'
																}).then(rst => {
																	if (rst && rst.code) {
																		message.success('新增单位工程工程成功！')
																		message.success('新增工程文档目录成功')
																		getUnitAc();
																		this.closeModal();
																	}
																})
															}).catch(() => {
																message.error('新增失败！')
																this.setState({
																	postLoading: false,
																})
															})
														}).catch(() => {
															message.error('新增失败！')
															this.setState({
																postLoading: false,
															})
														})
												}).catch(() => {
													message.error('新增失败！')
													this.setState({
														postLoading: false,
													})
												})
										}).catch(() => {
											message.error('新增失败！')
											this.setState({
												postLoading: false,
											})
										})
									} else {
										this.setState({
											postLoading: false,
										})
										message.success('新增子单位工程工程成功！');
										getUnitAc();
										this.closeModal();
									}
								} else {
									this.setState({
										postLoading: false,
									})
									message.error("新增单位工程失败！")
								}
							})
					} else { //编辑
						let unitInfo = ToggleModal.checkLoop(unitList, !selectUnit ? '' : selectUnit.split('--')[0]) || {};
						let editData = {
							"status": "A",
							"version": "A",
							"extra_params":
								{
									...unitInfo.extra_params,
									...{
										"desc": values["desc"],
										"coordinates": values["coordinates"] === '' ? [] : JSON.parse(values["coordinates"]),
										"file_info": fileList[0],
										"images": this._getImagesUrl(this.state.imagesList),
										"unit": this._setUnit(values["unit"] || []),
										"projectUnit": this._setProjectUnit(values["projectUnit"] || []),
									}
								},
							"response_orgs": unitInfo.response_orgs || [],
						};
						putUnitAc({code: unitInfo.code}, editData)
							.then(rst => {
								if (rst && rst.code) {
									message.success('编辑单位工程成功！');
									getUnitAc();
									setCAnJianList(editData.extra_params.unit);
									this.closeModal();
								} else {
									message.error("编辑单位工程失败！")
								}
							})
					}
				};
				if (values["coordinates"] === '') {
					postFunc();
				} else {
					let key = true;
					try {
						JSON.parse(values["coordinates"]);
					} catch (err) {
						message.error('请检查经纬度字符串是否有误！')
						key = false;
					}
					if (key && JSON.parse(values["coordinates"]).length) {
						postFunc();
					} else {
						message.error('请检查经纬度字符串是否有误！')
					}
				}

			}
		});
	}

	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			fileList = [],
			// examines = [],
			orgList = [],
			unitList = [],
			unitListT = [],
			selectUnit
		} = this.props;
		const {leafletCenter} = this.state;

		const formItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 18},
		};
		const layoutT = {
			labelCol: {span: 8},
			wrapperCol: {span: 12},
		};
		return (
			<Modal
				title={toggleData.type === 'ADD' ? '新增单位工程' : '编辑单位工程'}
				visible={toggleData.visible}
				width="80%"
				maskClosable={false}
				onOk={this.postUnitData.bind(this)}
				onCancel={this.closeModal.bind(this)}
			>
				<div>
					<Spin tip="数据新增中，请稍后..." spinning={this.state.postLoading}>
						<Form>
							<Row>
								<Col>
									<Row>
										<Col span={12}>
											<FormItem {...layoutT} label="单位工程名称">
												{getFieldDecorator('name', {
													rules: [{ required: true, message: '请输入单位工程名称' }],
													initialValue: ''
												})(
													<Input disabled={toggleData.type === 'EDIT'} type="text"
														placeholder="单位工程名称" />
													)}
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...layoutT} label="单位工程编码">
                                                {getFieldDecorator('code', {
                                        		rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                                                    initialValue: ''
                                                })(
													<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="项目名称"/>
                                                )}
											</FormItem>
										</Col>
									</Row>
									<FormItem {...formItemLayout} label="单位工程简介">
										{getFieldDecorator('desc', {
											rules: [{ required: true, message: '请输入单位工程简介' }],
											initialValue: ''
										})(
											<Input type="textarea" rows={4} placeholder="单位工程简介" />
											)}
									</FormItem>
									<Row style={{ marginBottom: '20px' }}>
										<Col span={4}>
											<div style={{ textAlign: 'right', paddingRight: '8px' }}><i
												style={{ color: 'red' }}>*</i>&nbsp;相关文档:
											</div>
										</Col>
										<Col span={18}>
											<Row>
												<Col span={6}>
													<Upload {...this.uploadProps}>
														<Button>
															<Icon type="upload" />上传文档
														</Button>
													</Upload>
												</Col>
												<Col span={6}>
													{
														fileList.map((file, index) => {
															return <div key={index}>{file.name}</div>
														})
													}
												</Col>
											</Row>

										</Col>
									</Row>
									<FormItem {...formItemLayout} label="位置坐标">
										{getFieldDecorator('coordinates', {
											initialValue: ''
										})(
											<Input type="textarea" rows={4}
												placeholder='数据格式如下（Lat表示纬度，Lng表示经度，最少有3个点）：[{"Lat":22.5441736849,"Lng":113.894210769},{"Lat":22.5352372106,"Lng":113.894493147},{"Lat":22.5351600524,"Lng":113.88856872},{"Lat":22.5354355728,"Lng":113.88860357}]'
												onBlur={this.coordinatesBlur.bind(this)} />
											)}
									</FormItem>
									<Row>
										<Col span={12}>
											<FormItem {...layoutT} label="地图位置">
												<Map center={leafletCenter} zoom={12} zoomControl={false}
													style={{ position: 'relative', height: 240, width: '100%' }}>
													<TileLayer url={URL} subdomains={['7']} />
													<Polygon positions={this._getPoints(this.state.coordinates || [])} />
												</Map>
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...layoutT} label="模型位置">
												<Map center={leafletCenter} zoom={12} zoomControl={false}
													style={{ position: 'relative', height: 240, width: '100%' }}>
													<TileLayer url={URL} subdomains={['7']} />
													<Polygon positions={this._getPoints(this.state.coordinates || [])} />
												</Map>
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...layoutT} label="参建单位">
												{getFieldDecorator('unit', {
													rules: [{ required: true, message: '请选择参建单位' }],
													initialValue: ''
												})(
													<TreeSelect treeCheckable={true}
														showCheckedStrategy={TreeSelect.SHOW_CHILD}
													>
														{
															ToggleModal.sxqloop(orgList)
															// console.log(ToggleModal.sxqloop(testOrglist))
														}
													</TreeSelect>
													)}
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...layoutT} label="关联其他单位工程">
												{getFieldDecorator('projectUnit', {
													// rules: [{required: true, message: '请选择其他单位工程'}],
													initialValue: ''
												})(
													<TreeSelect treeCheckable={true}
														showCheckedStrategy={TreeSelect.SHOW_CHILD}
													>
														{
															ToggleModal.projectUnitLoop(unitListT)
														}
													</TreeSelect>
													)}
											</FormItem>
										</Col>
									</Row>
									<FormItem {...formItemLayout} label="相关图片">
										{getFieldDecorator('images', {
											rules: [{ required: true, message: '请输入相关图片' }],
											initialValue: ''
										})(
											<Upload {...this.imagesProps} fileList={this.state.imagesList}>
												<div>
													<Icon type="plus" />
													<div className="ant-upload-text">上传图片</div>
												</div>
											</Upload>
											)}
									</FormItem>

									{/*{*/}
									{/*toggleData.type === "ADD" ? (*/}
									{/*<FormItem {...formItemLayout} label="审批人">*/}
									{/*{getFieldDecorator('examine', {*/}
									{/*rules: [{required: true, message: '请选择审批人'}],*/}
									{/*initialValue: ''*/}
									{/*})(*/}
									{/*<Select*/}
									{/*placeholder="请选择审批人"*/}
									{/*>*/}
									{/*{*/}
									{/*examines.map((examine) => {*/}
									{/*return <Option value={examine.username}*/}
									{/*key={examine.id}>{examine.account.person_name}</Option>*/}
									{/*})*/}
									{/*}*/}
									{/*</Select>*/}
									{/*)}*/}
									{/*</FormItem>*/}
									{/*) : null*/}
									{/*}*/}
								</Col>
							</Row>
						</Form>
					</Spin>
				</div>
			</Modal>
		);
	}

	_getPoints(coordinates) {
		let positions = [];
		coordinates.map(coordinate => {
			positions.push([coordinate.Lat, coordinate.Lng])
		});
		return positions;
	}

	coordinatesBlur() {
		const {
			form: {getFieldValue},
		} = this.props;
		// try {
		// 	JSON.parse(getFieldValue('coordinates'))
		// 	this.setState({
		// 		coordinates: JSON.parse(getFieldValue('coordinates'))
		// 	})
		// } catch (err) {
		// 	message.error('请输入正确的经纬度字符串！')
		// }
		let values = getFieldValue('coordinates');
		if (values === '') {
			return
		}
		let key = true;
		try {
			JSON.parse(values);
		} catch (err) {
			message.error('请检查经纬度字符串是否有误！');
			key = false;
		}
		if (key && JSON.parse(values).length) {
			this.setState({
				coordinates: JSON.parse(values)
			})
		} else {
			message.error('请检查经纬度字符串是否有误！')
		}
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}--${item.extra_params.org_type}`}
							  value={`${item.code}--${item.name}--${item.extra_params.org_type}`}
							  title={`${item.code} ${item.name}`}>
						{
							ToggleModal.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}--${item.extra_params.org_type}`}
							 value={`${item.code}--${item.name}--${item.extra_params.org_type}`}
							 title={`${item.code} ${item.name}`}/>;
		});
	};
	static sxqloop(data = [], loopTimes = 0, father = '组织机构') {
		if (loopTimes > 1) {
			return;
		}
		if (data.length <= 0) {
			return;
		}
		return data.map((item) => {
			if (item.children && item.children.length>0) {
				return (
					<TreeNode
						key={`${item.code}--${item.name}--${father}`}
						value={`${item.code}--${item.name}--${father}`}
						title={`${item.code} ${item.name}`}>
						{
							ToggleModal.sxqloop(item.children, loopTimes + 1, item.name)
						}
					</TreeNode>
				);
			} else {
				return(<TreeNode
					disableCheckbox={loopTimes ===0&&true}
					key={`${item.code}--${item.name}--${father}`}
					value={`${item.code}--${item.name}--${father}`}
					title={`${item.code} ${item.name}`} />);
			}
		});
	};
	static projectUnitLoop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}--${item.pk}`}
							  value={`${item.code}--${item.name}--${item.pk}`}
							  title={`${item.code} ${item.name}`}>
						{
							ToggleModal.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}--${item.pk}`}
							 value={`${item.code}--${item.name}--${item.pk}`}
							 title={`${item.code} ${item.name}`}/>;
		});
	};
}

export default Form.create()(ToggleModal)
// {
// 	onValuesChange: (props, values) => {
// 		const {actions: {setBuildNameAc}} = props;
// 		for (let key in values) {
// 			if (key === 'name') {
// 				setBuildNameAc(values['name'])
// 			}
// 		}
// 	}
// }

// const testOrglist = [
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "C",
//         "name": "施工单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "390774532",
//         "children": [
//             {
//                 "status": "A",
//                 "obj_type": "C_ORG",
//                 "code": "CSG",
//                 "name": "XX施工单位",
//                 "basic_params": {},
//                 "obj_type_hum": "组织机构",
//                 "extra_params": {
//                     "introduction": "无"
//                 },
//                 "pk": "6498645056",
//                 "children": []
//             }
//         ]
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "D",
//         "name": "设计单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "388611844",
//         "children": [
//             {
//                 "status": "A",
//                 "obj_type": "C_ORG",
//                 "code": "DTJ",
//                 "name": "天津华汇",
//                 "basic_params": {},
//                 "obj_type_hum": "组织机构",
//                 "extra_params": {
//                     "introduction": "无"
//                 },
//                 "pk": "6446609472",
//                 "children": []
//             }
//         ]
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "G",
//         "name": "规划单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "382123780",
//         "children": []
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "J",
//         "name": "监理单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "392937220",
//         "children": [
//             {
//                 "status": "A",
//                 "obj_type": "C_ORG",
//                 "code": "XBC",
//                 "name": "XX监理单位",
//                 "basic_params": {},
//                 "obj_type_hum": "组织机构",
//                 "extra_params": {
//                     "introduction": "无"
//                 },
//                 "pk": "6475445312",
//                 "children": []
//             }
//         ]
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "K",
//         "name": "勘测单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "384286468",
//         "children": []
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "Q",
//         "name": "业主单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "379961092",
//         "children": [
//             {
//                 "status": "A",
//                 "obj_type": "C_ORG",
//                 "code": "QJT",
//                 "name": "雄安新区建设投资有限公司",
//                 "basic_params": {},
//                 "obj_type_hum": "组织机构",
//                 "extra_params": {
//                     "introduction": "无"
//                 },
//                 "pk": "6424982592",
//                 "children": [
//                     {
//                         "status": "A",
//                         "obj_type": "C_ORG",
//                         "code": "QJT_10",
//                         "name": "市民服务中心工作组",
//                         "basic_params": {},
//                         "obj_type_hum": "组织机构",
//                         "extra_params": {
//                             "introduction": "无"
//                         },
//                         "pk": "6431929408",
//                         "children": []
//                     },
//                     {
//                         "status": "A",
//                         "obj_type": "C_ORG",
//                         "code": "QJT_20",
//                         "name": "植树造林指挥部",
//                         "basic_params": {},
//                         "obj_type_hum": "组织机构",
//                         "extra_params": {
//                             "introduction": "无"
//                         },
//                         "pk": "6437303360",
//                         "children": []
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "T",
//         "name": "BIM总体单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "395099908",
//         "children": [
//             {
//                 "status": "A",
//                 "obj_type": "C_ORG",
//                 "code": "BIM",
//                 "name": "华东勘测设计研究院",
//                 "basic_params": {},
//                 "obj_type_hum": "组织机构",
//                 "extra_params": {
//                     "introduction": "无"
//                 },
//                 "pk": "6529840192",
//                 "children": []
//             }
//         ]
//     },
//     {
//         "status": "A",
//         "obj_type": "C_ORG",
//         "code": "X",
//         "name": "咨询单位",
//         "basic_params": {},
//         "obj_type_hum": "组织机构",
//         "extra_params": {
//             "org_type": ""
//         },
//         "pk": "386449156",
//         "children": []
//     }
// ]
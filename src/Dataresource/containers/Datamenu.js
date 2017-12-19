import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/index';
import { actions as platformActions } from '_platform/store/global';
import { Tabmenu, Contenttop, Contentmiddle, Contentbottom, Detailcontent, DatamenuModal, DirTypeTree, DirItemTree } from '../components';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Modal, Button, Tabs, Input, notification, Table, Upload, Icon, Row, Col, Popconfirm, message } from 'antd';
import moment from 'moment';
import allData from './data';
import {
	DATASOURCENAME, DATASOURCECODE, DATASOURCEDIRNAME, DATASOURCEDIRCODE, DATASOURCEDIRTYPENAME,
	DATASOURCEDIRTYPECODE, DATASOURCEDIRITEMNAME, DATASOURCEDIRITEMCODE, STATIC_DOWNLOAD_API, 
	USER, PASSWORD, SERVICE_API
} from '_platform/api'
const TabPane = Tabs.TabPane;
@connect(
	state => {
		const { platform, dataresource = {} } = state || {};
		return { ...dataresource, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
	})
)
export default class Datamenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			SelectedRow: {
				name: '国土资源',
				number: '180',
				index: '0',
			},
			selected: '',
			pageSize: 7,
			contentdata: [],
			currentcontentdata: [],
			detailcontent: {},
			tabindex: '0',
			isdetail: false,
			iscreat: true,
			ischange: false,
			creatvisible: false,
			contentfield: {},
			tabdata: [],
			pageindex: 1,
			totalDir: {},
			createBtnVisible: false,
			typeVisible: false,
			itemVisible: false,
			dataSourceDirItem: {},
			originalDirItem: {},
			dataSourceDirType: {},
			originalDirType: {},
			dirCode: null,
			docArray: null,
			dataSource: [],
			createDocVisible: false,//新建文档弹窗
			createDocBtnDisable: true,//新建文档按钮是否可用，默认禁用
			currInitialData: null,
			createItemBtnDisable: false,//添加新项目按钮是否可用，默认可用
			createTypeBtnDisable: false,//添加新类型按钮是否可用，默认可用
			newKey1: Math.random(),
			newKey2: Math.random() * 2,
			newKey3: Math.random() * 3,
			tabkey: 1,
		}
	}
	componentDidMount() {
		console.log(this.props.actions);
		let tabdata = allData.Datamenu.tabdata;
		this.setState({ tabdata }, () => {
			this.onTblRowClick(tabdata[0].children[0])
		})
		let me = this
		//创建目录数据
		let getDirData = {
			code: DATASOURCECODE
		}

		let postDirData = {
			"name": DATASOURCENAME,
			"code": DATASOURCECODE,
			"obj_type": "C_DIR",
			"status": "A",
			"extra_params": {},
		}
		//console.log('创建数据资源目录数据',postDirData)
		const {
			actions: {
				getDataResourceDir,
			postDataResourceDir,
			postDocument,
			getDocument,
			getDirTree
			}
		} = this.props;
		getDirTree({ code: DATASOURCEDIRTYPECODE });
		getDataResourceDir(getDirData).then((rst) => {
			if (rst && rst.code && rst.code != '') {
				console.log('存在数据资源目录', rst)
				getDataResourceDir({ code: DATASOURCEDIRCODE }).then((dir) => {
					if (dir && dir.code && dir.code != '') {
						console.log('存在数据目录目录', dir)
						getDataResourceDir({ code: DATASOURCEDIRTYPECODE }).then((type) => {
							if (type && type.code && type.code != '') {
								console.log('存在数据类型目录', type);
								me.setState({
									dataSourceDirType: type,
									originalDirType: type
								})
							} else {
								postDirData = {
									"name": DATASOURCEDIRTYPENAME,
									"code": DATASOURCEDIRTYPECODE,
									"obj_type": "C_DIR",
									"status": "A",
									"extra_params": {},
									"parent": { "pk": dir.pk, "code": dir.code, "obj_type": dir.obj_type }
								}
								postDataResourceDir({}, postDirData).then((test) => {
									console.log('创建数据类型目录', test)
									if (test && test.code && test.code != '') {
										me.setState({
											dataSourceDirType: test,
											originalDirType: test
										})
									}
								})
							}
						})
						getDataResourceDir({ code: DATASOURCEDIRITEMCODE }).then((item) => {
							if (item && item.code && item.code != '') {
								console.log('存在数据项目目录', item);
								//debugger
								me.setState({
									dataSourceDirItem: item,
									originalDirItem: item
								})
							} else {
								postDirData = {
									"name": DATASOURCEDIRITEMNAME,
									"code": DATASOURCEDIRITEMCODE,
									"obj_type": "C_DIR",
									"status": "A",
									"extra_params": {},
									"parent": { "pk": dir.pk, "code": dir.code, "obj_type": dir.obj_type }
								}
								postDataResourceDir({}, postDirData).then((test) => {
									console.log('创建数据项目目录', test)
									if (test && test.code && test.code != '') {
										me.setState({
											dataSourceDirItem: test,
											originalDirItem: test
										})
									}
								})
							}
						})
					} else {
						postDirData = {
							"name": DATASOURCEDIRNAME,
							"code": DATASOURCEDIRCODE,
							"obj_type": "C_DIR",
							"status": "A",
							"extra_params": {},
							"parent": { "pk": rst.pk, "code": rst.code, "obj_type": rst.obj_type }
						}
						postDataResourceDir({}, postDirData).then((dir2) => {
							console.log('创建数据目录目录', dir2)
							getDataResourceDir({ code: DATASOURCEDIRTYPECODE }).then((type) => {
								if (type && type.code && type.code != '') {
									console.log('存在数据类型目录', type);
									me.setState({
										dataSourceDirType: type,
										originalDirType: type
									})
								} else {
									postDirData = {
										"name": DATASOURCEDIRTYPENAME,
										"code": DATASOURCEDIRTYPECODE,
										"obj_type": "C_DIR",
										"status": "A",
										"extra_params": {},
										"parent": { "pk": dir2.pk, "code": dir2.code, "obj_type": dir2.obj_type }
									}
									postDataResourceDir({}, postDirData).then((test) => {
										console.log('创建数据类型目录', test)
										if (test && test.code && test.code != '') {
											me.setState({
												dataSourceDirType: test,
												originalDirType: test
											})
										}
									})
								}
							})
							getDataResourceDir({ code: DATASOURCEDIRITEMCODE }).then((item) => {
								if (item && item.code && item.code != '') {
									console.log('存在数据项目目录', item);
									me.setState({
										dataSourceDirItem: item,
										originalDirItem: item
									})
								} else {
									postDirData = {
										"name": DATASOURCEDIRITEMNAME,
										"code": DATASOURCEDIRITEMCODE,
										"obj_type": "C_DIR",
										"status": "A",
										"extra_params": {},
										"parent": { "pk": dir2.pk, "code": dir2.code, "obj_type": dir2.obj_type }
									}
									postDataResourceDir({}, postDirData).then((test) => {
										console.log('创建数据项目目录', test)
										if (test && test.code && test.code != '') {
											me.setState({
												dataSourceDirItem: test,
												originalDirItem: test
											})
										}
									})
								}
							})
						})
					}
				})
			} else {
				console.log('不存在数据资源目录', rst)
				postDataResourceDir({}, postDirData).then((roots) => {
					console.log('创建数据资源目录', roots)
					if (roots && roots.code && roots.code != '') {
						getDataResourceDir({ code: DATASOURCEDIRCODE }).then((dir) => {
							if (dir && dir.code && dir.code != '') {
								console.log('存在数据目录目录', dir)
								getDataResourceDir({ code: DATASOURCEDIRTYPECODE }).then((type) => {
									if (type && type.code && type.code != '') {
										console.log('存在数据类型目录', type);
										me.setState({
											dataSourceDirType: type,
											originalDirType: type
										})
									} else {
										postDirData = {
											"name": DATASOURCEDIRTYPENAME,
											"code": DATASOURCEDIRTYPECODE,
											"obj_type": "C_DIR",
											"status": "A",
											"extra_params": {},
											"parent": { "pk": dir.pk, "code": dir.code, "obj_type": dir.obj_type }
										}
										postDataResourceDir({}, postDirData).then((test) => {
											console.log('创建数据类型目录', test)
											if (test && test.code && test.code != '') {
												me.setState({
													dataSourceDirType: test,
													originalDirType: test
												})
											}
										})
									}
								})
								getDataResourceDir({ code: DATASOURCEDIRITEMCODE }).then((item) => {
									if (item && item.code && item.code != '') {
										console.log('存在数据项目目录', item);
										me.setState({
											dataSourceDirItem: item,
											originalDirItem: item
										})
									} else {
										postDirData = {
											"name": DATASOURCEDIRITEMNAME,
											"code": DATASOURCEDIRITEMCODE,
											"obj_type": "C_DIR",
											"status": "A",
											"extra_params": {},
											"parent": { "pk": dir.pk, "code": dir.code, "obj_type": dir.obj_type }
										}
										postDataResourceDir({}, postDirData).then((test) => {
											console.log('创建数据项目目录', test)
											if (test && test.code && test.code != '') {
												me.setState({
													dataSourceDirItem: test,
													originalDirItem: test
												})
											}
										})
									}
								})
							} else {
								postDirData = {
									"name": DATASOURCEDIRNAME,
									"code": DATASOURCEDIRCODE,
									"obj_type": "C_DIR",
									"status": "A",
									"extra_params": {},
									"parent": { "pk": roots.pk, "code": roots.code, "obj_type": roots.obj_type }
								}
								postDataResourceDir({}, postDirData).then((dir2) => {
									console.log('创建数据目录目录', dir2)
									getDataResourceDir({ code: DATASOURCEDIRTYPECODE }).then((type) => {
										if (type && type.code && type.code != '') {
											console.log('存在数据类型目录', type);
											me.setState({
												dataSourceDirType: type,
												originalDirType: type
											})
										} else {
											postDirData = {
												"name": DATASOURCEDIRTYPENAME,
												"code": DATASOURCEDIRTYPECODE,
												"obj_type": "C_DIR",
												"status": "A",
												"extra_params": {},
												"parent": { "pk": dir2.pk, "code": dir2.code, "obj_type": dir2.obj_type }
											}
											postDataResourceDir({}, postDirData).then((test) => {
												console.log('创建数据类型目录', test)
												if (test && test.code && test.code != '') {
													me.setState({
														dataSourceDirType: test,
														originalDirType: test
													})
												}
											})
										}
									})
									getDataResourceDir({ code: DATASOURCEDIRITEMCODE }).then((item) => {
										if (item && item.code && item.code != '') {
											console.log('存在数据项目目录', item);
											me.setState({
												dataSourceDirItem: item,
												originalDirItem: item
											})
										} else {
											postDirData = {
												"name": DATASOURCEDIRITEMNAME,
												"code": DATASOURCEDIRITEMCODE,
												"obj_type": "C_DIR",
												"status": "A",
												"extra_params": {},
												"parent": { "pk": dir2.pk, "code": dir2.code, "obj_type": dir2.obj_type }
											}
											postDataResourceDir({}, postDirData).then((test) => {
												console.log('创建数据项目目录', test)
												if (test && test.code && test.code != '') {
													me.setState({
														dataSourceDirItem: test,
														originalDirItem: test
													})
												}
											})
										}
									})
								})
							}
						})
					}
				})
			}
		})
	}
	onSelectType(code, info) {
		console.log("code", code, info);
		if (!info.selected) {
			return
		}
		this.setState({
			dataSource: [],
			/**20171102代码添加 start */
			createDocBtnDisable: false,
			/**20171102代码添加 start */
		})
		const {
			actions: {
				getDataResourceDir,
			postDataResourceDir,
			postDocument,
			getDocument,
			getDirTree,
			getDirDoc
			}
		} = this.props;
		let selectTypeCode = code[0].split('--')[0];

		getDirDoc({ code: selectTypeCode }).then((typeDoc) => {
			/**20171102代码注释，解除新建文档限制 start*/
			//if(typeDoc && typeDoc.children && typeDoc.children.length==0){
			if (typeDoc && typeDoc.children) {
				/**20171102代码注释，解除新建文档限制 start*/
				this.setState({
					dirCode: selectTypeCode,
					createDocBtnDisable: false,
				})
				if (typeDoc && typeDoc.stored_documents && typeDoc.stored_documents != 0) {
					this.setState({
						/**20171102代码注释，解除新建文档限制 start*/
						//createTypeBtnDisable:true,//不可以创建类型
						/**20171102代码注释，解除新建文档限制 end*/
						/**20171103代码新增，start*/
						dataSourceDirType: typeDoc
						/**20171103代码新增，start*/
					})
				} else {
					this.setState({
						createTypeBtnDisable: false,//可以创建类型
						dataSourceDirType: typeDoc,
					})
				}
				this.getDocList();
			} else {
				this.setState({
					/**20171102代码注释，解除新建文档限制 start*/
					//createDocBtnDisable:true,
					/**20171102代码注释，解除新建文档限制 end*/
					dataSource: [],
					createTypeBtnDisable: false,//可以创建类型
					dataSourceDirType: typeDoc,
				})
			}
		})
	}
	onSelectItem(code, info) {
		console.log("code", code, info);
		if (!info.selected) {
			return
		}
		this.setState({
			dataSource: [],
			/**20171102代码添加 start */
			createDocBtnDisable: false,
			/**20171102代码添加 start */
		})
		const {
			actions: {
				getDataResourceDir,
				postDataResourceDir,
				postDocument,
				getDocument,
				getDirTree,
				getDirDoc
			}
		} = this.props;
		let selectItemCode = code[0].split('--')[0];

		getDirDoc({ code: selectItemCode }).then((itemDoc) => {
			/**20171102代码注释，解除新建文档限制 end*/
			//if(itemDoc && itemDoc.children && itemDoc.children.length==0){
			if (itemDoc && itemDoc.children) {
				/**20171102代码注释，解除新建文档限制 end*/
				this.setState({
					dirCode: selectItemCode,
					createDocBtnDisable: false,
					//createBtnVisible:true,
				})
				if (itemDoc && itemDoc.stored_documents && itemDoc.stored_documents != 0) {
					this.setState({
						/**20171102代码注释，解除新建文档限制 end*/
						//createItemBtnDisable:true//不可以创建项目
						/**20171102代码注释，解除新建文档限制 end*/
						/**20171103代码新增，start*/
						dataSourceDirItem: itemDoc
						/**20171103代码新增，start*/
					})
				} else {
					this.setState({
						createItemBtnDisable: false,//可以创建项目
						dataSourceDirItem: itemDoc
					})
					debugger
				}
				this.getDocList();
			} else {
				this.setState({
					/**20171102代码注释，解除新建文档限制 end*/
					//createDocBtnDisable:true,
					/**20171102代码注释，解除新建文档限制 end*/
					dataSource: [],
					createItemBtnDisable: false,//可以创建项目
					dataSourceDirItem: itemDoc
				})
			}
		})

	}
	getDocList() {
		const {
			actions: {
				getDirDoc,
			getDocument
			}
		} = this.props;
		const {
			dirCode,
		} = this.state
		if (dirCode) {
			let docReqArr = [];
			let datas = [];
			getDirDoc({ code: dirCode }).then((typeDoc) => {
				/**20171102代码注释，解除新建文档限制 end*/
				//if(typeDoc && typeDoc.children && typeDoc.children.length==0){
				if (typeDoc && typeDoc.children) {
					/**20171102代码注释，解除新建文档限制 end*/
					if (typeDoc.stored_documents && typeDoc.stored_documents.length > 0) {
						for (let i = 0; i < typeDoc.stored_documents.length; i++) {
							docReqArr.push(getDocument({ code: typeDoc.stored_documents[i].code }));
						}
					}
				}
				Promise.all(docReqArr).then((rst) => {
					console.log('rst', rst)
					let docArray = []
					for (var i = 0; i < rst.length; i++) {
						if (rst[i] && rst[i].name) {
							docArray.push(rst[i])
						}
					}
					docArray.map((doc) => {
						datas.push({
							name: doc.basic_params.files[0].name,
							updateTime: doc.extra_params.createTime ? doc.extra_params.createTime : '',
							viewed: '',
							download: '',
							detail: doc.basic_params.files[0],
							docCode:doc.code
						})
					})
					this.setState({
						dataSource: datas
					})
				})
			})
		}

	}
	//创建项目
	createItem() {
		const {
			actions: {
				getDataResourceDir,
				postDataResourceDir,
				postDocument,
				getDocument,
				getDirTree
			}
		} = this.props;
		const {
			dataSourceDirItem
		} = this.state
		let name = document.getElementById('dirItemName').value;
		let code = document.getElementById('dirItemCode').value

		//创建目录数据
		let postDirData = {
			"name": name,
			"code": code,
			"obj_type": "C_DIR",
			"status": "A",
			"extra_params": {},
			"parent": { "pk": dataSourceDirItem.pk, "code": dataSourceDirItem.code, "obj_type": dataSourceDirItem.obj_type }
		}
		console.log('创建 项目 目录数据', postDirData)
		debugger
		postDataResourceDir({}, postDirData).then((value) => {
			console.log('创建 项目 目录', value)
			if (value && value.name != '' && value.code != '') {
				console.log('创建 项目 目录', value)
				notification.success({
					message: '创建项目成功',
					duration: 2
				})
				getDirTree({ code: DATASOURCEDIRITEMCODE });
				this.setState({
					createBtnVisible: true,
					itemVisible: false
				})
			} else {
				notification.error({
					message: '编码已存在',
					duration: 2
				})
			}

		})
	}
	//创建类型
	createType() {
		const {
			actions: {
				getDataResourceDir,
				postDataResourceDir,
				postDocument,
				getDocument,
				getDirTree
			}
		} = this.props;
		const {
			dataSourceDirType
		} = this.state
		let name = document.getElementById('dirTypeName').value;
		let code = document.getElementById('dirTypeCode').value

		//创建目录数据
		let postDirData = {
			"name": name,
			"code": code,
			"obj_type": "C_DIR",
			"status": "A",
			"extra_params": {},
			"parent": { "pk": dataSourceDirType.pk, "code": dataSourceDirType.code, "obj_type": dataSourceDirType.obj_type }
		}
		console.log('创建 类型 目录数据', postDirData)
		debugger
		postDataResourceDir({}, postDirData).then((value) => {
			console.log('创建类型目录', value)
			if (value && value.name != '' && value.code != '') {
				console.log('创建类型目录', value)
				notification.success({
					message: '创建类型成功',
					duration: 2
				})
				getDirTree({ code: DATASOURCEDIRTYPECODE });
				this.setState({
					createBtnVisible: false,
					typeVisible: false
				})
			} else {
				notification.error({
					message: '编码已存在',
					duration: 2
				})
			}
		})
	}

	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	download(record, index) {
		let apiGet = `${STATIC_DOWNLOAD_API}` + (record.detail.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		debugger
		this.createLink(this, apiGet);
	}

	createVisible() {
		this.setState({
			createDocVisible: true,
			newKey3: Math.random() * 3,
			currInitialData: null
		})
	}
	callback(key) {
		console.log(key);
		const {
			actions: {
				getDirTree
			}
		} = this.props;
		if (key == 2) {
			getDirTree({ code: DATASOURCEDIRITEMCODE });
			this.setState({
				createBtnVisible: true,
				dataSource: [],
				createDocBtnDisable: true,
				createItemBtnDisable: false,
				dataSourceDirItem: this.state.originalDirItem,
				tabkey:2
			})
		} else {
			getDirTree({ code: DATASOURCEDIRTYPECODE });
			this.setState({
				createBtnVisible: false,
				dataSource: [],
				createDocBtnDisable: true,
				createTypeBtnDisable: false,
				dataSourceDirType: this.state.originalDirType,
				tabkey:1
			})
		}
	}
	covertURLRelative = (originUrl) => {
		return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
	}
	beforeUploadPicFile = (file) => {
		let jsxThis = this;
		const fileName = file.name;
		// 上传图片到静态服务器
		const { actions: { uploadStaticFile, deleteStaticFile } } = this.props;
		let formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);
		uploadStaticFile({}, formdata, {
			Authorization: 'Basic ' + btoa(USER + ':' + PASSWORD)
		}).then(resp => {
			console.log('uploadStaticFile: ', resp)
			if (!resp || !resp.id) {
				notification.error({
					message: '文件上传失败',
					duration: 2
				})
				return;
			};
			const filedata = resp;
			filedata.a_file = this.covertURLRelative(filedata.a_file);
			filedata.download_url = this.covertURLRelative(filedata.a_file);
			const attachment = [{
				uid: file.uid,
				name: resp.name,
				status: 'done',
				url: resp.a_file,
				thumbUrl: resp.a_file
			}];
			// 删除 之前的文件
			if (jsxThis.state.currInitialData) {
				deleteStaticFile({ id: jsxThis.state.currInitialData.id },
					{}, { Authorization: 'Basic ' + btoa(USER + ':' + PASSWORD) });
			}
			jsxThis.setState({ currInitialData: filedata })
		});
		return false;
	}

	delete(record,index){
        let datas = this.state.dataSource;
        const { 
            actions: { 
                delDocument
            } 
        } = this.props;
        debugger
        //let c = datas[index].docCode;
        delDocument({code:datas[index].docCode}).then((rst) => {
			notification.success({
				message: "删除成功",
				duration: 2
			})
			datas.splice(index,1);
			this.setState({dataSource:datas});
		})
       
	}
	
	render() {
		const { } = this.props;
		console.log("this.props,Datamenu ",this.props);
		console.log("this.state, ", this.state);
		const {
        	SelectedRow,
			selected,
			tabindex,
			isdetail,
			iscreat,
			ischange,
			contentdata,
			currentcontentdata,
			detailcontent,
			contentfield,
			editindex,
			tabdata,
			pageSize,
			pageindex,
			createDocBtnDisable,
			createItemBtnDisable,
			createTypeBtnDisable
        } = this.state;
		var timekey = Date.parse(new Date());

		const columns = [{
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '更新时间',
			dataIndex: 'updateTime',
			sorter: (a, b) => moment(a.updateTime).unix() - moment(b.updateTime).unix(),
		}, {
			title: '查看次数',
			dataIndex: 'viewed',
			sorter: (a, b) => a.viewed - b.viewed,
		}, {
			title: '下载次数',
			dataIndex: 'download',
			sorter: (a, b) => a.download - b.download,
		}, {
			title: '操作',
			dataIndex: 'opt',
			//width: '15%',
			render: (text, record, index) => {
				return <div>
					{/* <a onClick={this.previewFiles.bind(this, record, index)}>查看详情</a>
					<span className="ant-divider" /> */}
					<a onClick={this.download.bind(this, record, index)}>下载</a>
					<span className="ant-divider" />
					<Popconfirm
						placement="rightTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, record, index)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				</div>
			}
		}]

		return (
			<Body>
				<Main>
					<DynamicTitle title="数据目录" {...this.props} />
					<Sidebar>
						<Row>
							<Col span={12}>
								{this.state.createBtnVisible
									? <Button type='primary' disabled={createItemBtnDisable} onClick={this.itemModalVisible.bind(this)} style={{ marginBottom: "20px" }}>添加项目</Button>
									: <Button type='primary' disabled={createTypeBtnDisable} onClick={this.typeModalVisible.bind(this)} style={{ marginBottom: "20px" }}>添加类型</Button>}
							</Col>
							{/* <Col span={12}>
								<Button type="danger" >删除节点</Button>
							</Col> */}
						</Row>
						
						<Modal
							title="创建项目" visible={this.state.itemVisible} key={this.state.newKey1} maskClosable={false}
							onOk={this.createItem.bind(this)} onCancel={this.createItemCancel.bind(this)}

						>
							<Input addonBefore="项目名称" id="dirItemName" style={{ marginBottom: "20px" }}></Input>
							<Input addonBefore="项目编码" id="dirItemCode"></Input>
						</Modal>
						<Modal
							title="创建类型" visible={this.state.typeVisible} key={this.state.newKey2} maskClosable={false}
							onOk={this.createType.bind(this)} onCancel={this.createTypeCancel.bind(this)}
						>
							<Input addonBefore="类型名称" id="dirTypeName" style={{ marginBottom: "20px" }}></Input>
							<Input addonBefore="类型编码" id="dirTypeCode"></Input>
						</Modal>
						<Tabs type="card" defaultActiveKey="1" onChange={this.callback.bind(this)}>
							<TabPane tab="类型" key="1">

							</TabPane>
							<TabPane tab="项目" key="2">

							</TabPane>
						</Tabs>
						{this.props.dirTreeList && this.props.dirTreeList.length != 0
							?
							(!this.state.createBtnVisible
								?
								<DirTypeTree {...this.props}
									onSelect={this.onSelectType.bind(this)} />
								: <DirItemTree {...this.props}
									onSelect={this.onSelectItem.bind(this)} />)
							:
							<Upload
								onChange={(info) => this.onFileChange(info)}
								showUploadList={false}
								beforeUpload={(file) => { this.beforeUploadExcel(file) }}
								action={`${SERVICE_API}/excel/upload-api/`}
							>
								<Button type="primary">
									<Icon type="upload" /> 上传目录树表格
								</Button>
							</Upload>}
					</Sidebar>
					<Content>
						<Button type='primary' style={{ marginBottom: "20px" }} onClick={this.createVisible.bind(this)} disabled={createDocBtnDisable}>新建文档</Button>
						<Table
							columns={columns}
							dataSource={this.state.dataSource}
							bordered />
						<Modal
							title="上传文档" visible={this.state.createDocVisible} key={this.state.newKey3} maskClosable={false}
							onOk={this.createDoc.bind(this)} onCancel={this.createDocCancel.bind(this)}>
							<Upload beforeUpload={this.beforeUploadPicFile.bind(this)} >
								<Button> 
									<Icon type="upload" />添加文件
								</Button>
							</Upload>
							{
								this.state.currInitialData ?
									<p>{this.state.currInitialData.name}
										<a href="javascript:;" style={{ marginLeft: '5px' }}
											onClick={() => {
												this.setState({ currInitialData: null });
											}}>删除</a></p> :
									''
							}
						</Modal>
					</Content>

					{/* !isdetail
						? */}

					{/* <Contenttop
									data={SelectedRow}
									selected={selected}
									ischange={ischange}
									Onselect={this.Onselect}
									Oncreat={this.Oncreat}
									Onchange={this.Onchange}
									datalength={contentdata.length}
								/>
								<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
								<Contentmiddle
									data={currentcontentdata}
									ischange={ischange}
									pageindex={pageindex}
									pageSize={pageSize}
									onDetailClick={this.onDetailClick}
									onEdit={this.onEdit}
									onDelete={this.onDelete}
								/>
								<Contentbottom onPageChange={this.onPageChange} pageSize={pageSize} total={contentdata.length} current={pageindex}/> */}
					{/* </Content> */}
					{/* : <Content>
							<Detailcontent 
								onReturnClick={this.onReturnClick}
								data={detailcontent}/>
						  	</Content> */}

					<Modal
						key={String(timekey)}
						width={900}
						maskClosable={false}
						title='新建数据'
						visible={this.state.creatvisible}
						onCancel={this.handleCancel}
						footer={null}
					>
						<DatamenuModal onOk={this.onOk} iscreat={iscreat} contentfield={contentfield} />
					</Modal>
				</Main>
			</Body>
		);
	}
	itemModalVisible = () => {
		this.setState({
			itemVisible: true,
			newKey1: Math.random(),
		})
	}

	typeModalVisible = () => {
		this.setState({
			typeVisible: true,
			newKey2: Math.random() * 2,
		})
	}
	createItemCancel = () => {
		this.setState({
			itemVisible: false
		})
	}
	createTypeCancel = () => {
		this.setState({
			typeVisible: false
		})
	}

	createDoc = () => {
		const {
			actions: {
				postDocument
			}
		} = this.props;
		const {
			currInitialData,
			dirCode
		} = this.state;
		if (!currInitialData) {
			notification.error({
				message: '请上传文档',
				duration: 2
			})
			return;
		}
		let values = {};
		let datas = this.state.dataSource;
		let docData = {
			"code": "dataresource" + moment().format("YYYYMMDDHHmmss"),
			"name": currInitialData.name,
			"obj_type": "C_DOC",
			"profess_folder": { "code": dirCode, "obj_type": "C_DIR" },
			"extra_params": {
				"createTime": moment().format("YYYY-MM-DD HH:mm:ss")
			},
			"basic_params": {
				"files": [
					{
						"a_file": (currInitialData.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"name": currInitialData.name,
						"download_url": (currInitialData.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"misc": "file",
						"mime_type": currInitialData.mime_type
					},
				]
			},
			"status": "A",
			"version": "A",
		}
		console.log("docData", docData)
		//debugger
		let jsxThis = this;
		postDocument({}, docData).then((val) => {
			if (val && val.name) {
				values = {
					name: val.basic_params.files[0].name,
					updateTime: val.extra_params.createTime ? val.extra_params.createTime : '',
					viewed: '',
					download: '',
					detail: val.basic_params.files[0]
				}
				datas.push(values);
			}
			jsxThis.setState({
				dataSource: datas,
				createDocVisible: false,
				newKey3: Math.random() * 3,
			})
			notification.success({
				message: '上传文档成功',
				duration: 2
			})
			return;
		});

	}
	createDocCancel() {
		this.setState({
			createDocVisible: false,
		})
	}
	onFileChange = (info) =>{
		console.log("onFileChange",info);
		const {
			originalDirType,
			originalDirItem,
			tabkey
		} = this.state;
		const {
			actions:{
				postDataResourceDirlist,
				getDirTree
			}
		} = this.props;
		let parentdata = {},
			treeCode = "";
		if(tabkey == 1){
			parentdata = originalDirType;
			treeCode = DATASOURCEDIRTYPECODE;
		}else{
			parentdata = originalDirItem;
			treeCode = DATASOURCEDIRITEMCODE;
		}
		if (info.file.status === 'done') {
            let dataSheet1 = info.file.response.Sheet1;
            console.log('dataSheet1',dataSheet1)
			let postDirlistData = {},
				dataList = [],
				objdata = {};
            for(var i=1;i<dataSheet1.length;i++){
				if(dataSheet1[i][0] == ""){
					objdata = {
						"name": dataSheet1[i][2],
						"code": dataSheet1[i][1],
						"obj_type": "C_DIR",
						"status": "A",
						"extra_params": {},
						"response_orgs":[],
						"parent": {"code":parentdata.code,"obj_type":"C_DIR"}
					}
					dataList.push(objdata)
				}else{
					objdata = {
						"name": dataSheet1[i][2],
						"code": dataSheet1[i][1],
						"obj_type": "C_DIR",
						"status": "A",
						"extra_params": {},
						"response_orgs":[],
						"parent": {"code":dataSheet1[i][0],"obj_type":"C_DIR"}
					}
					dataList.push(objdata)
				}
			}
			postDirlistData = {
				"data_list": dataList
			}
			console.log("postDirlistData",postDirlistData)
			debugger
            postDataResourceDirlist({},postDirlistData).then((rst) => {
				if(rst && rst.result && rst.result.length != 0){
					notification.success({
						message: '目录树创建成功',
						duration: 2
					});
				}
				getDirTree({ code: treeCode });
			})
		}else if (info.file.status === 'error') {
			notification.error({
                message: '文件上传失败',
                duration: 2
            });
            return;
		}
	}
	beforeUploadExcel = (file) =>{
		console.log("beforeUploadExcel",file)
		debugger
    	const isExcel = file.name.split('.')[1] === 'xls' || file.name.split('.')[1] === 'xlsx';
    	if(!isExcel){
    		 message.error('请上传Excel格式的文件!');
    	}
    	const hasNoChinese = escape(file.name).indexOf("%u") < 0 ? true : false;
    	if(!hasNoChinese){
    		message.error('文件名不能是中文，请修改文件名!');
    	}
    	return isExcel && hasNoChinese;
    }


	onTblRowClick = (record) => {
		const { tabindex } = this.state;
		let contentdata = [];
		try {
			contentdata = allData.Datamenu.contentdata[parseInt(tabindex)][parseInt(record.index)];
		} catch (e) {
			console.log(e)
		}
		this.setState({ SelectedRow: record, isdetail: false, contentdata }, () => {
			this.setCurrentContentData()
		})
	}
	onTabChange = (index) => {
		const { tabdata } = this.state;
		debugger
		let SelectedRow = tabdata[index].children[0];
		this.setState({
			SelectedRow: SelectedRow,
			tabindex: index,
			isdetail: false
		}, () => {
			this.onTblRowClick(SelectedRow)
		})
	}
	onPageChange = (index) => {
		this.setState({ pageindex: index }, () => {
			this.setCurrentContentData()
		})
	}
	setCurrentContentData = () => {
		const { pageindex, contentdata, pageSize } = this.state;
		let currentcontentdata = contentdata.slice(pageSize * (pageindex - 1), pageSize * pageindex)
		if (currentcontentdata.length == 0) {
			if (pageindex == 1) {
				this.setState({ currentcontentdata })
			} else {
				this.setState({ pageindex: pageindex - 1 }, () => {
					this.setCurrentContentData()
				})
			}
		} else {
			this.setState({ currentcontentdata })
		}
	}
	onDetailClick = (record,index) => {
		const { contentdata } = this.state;
		let detailcontent = {};
		try {
			detailcontent = contentdata[index].detail;
		} catch (e) {
			console.log(e)
		}
		this.setState({ isdetail: true, detailcontent })
	}
	onEdit = (index) => {
		const { contentdata } = this.state;
		let contentfield = {};
		try {
			contentfield = contentdata[index];
		} catch (e) {
			console.log(e)
		}
		this.setState({ iscreat: false, creatvisible: true, editindex: index, contentfield })
	}
	onDelete = (index) => {
		let { contentdata } = this.state;
		contentdata.splice(index, 1);
		this.setState({ contentdata }, () => {
			this.setCurrentContentData()
		})
	}
	onReturnClick = () => {
		this.setState({ isdetail: false })
	}
	Onselect = (num) => {
		this.setState({ selected: num })
	}
	handleCancel = () => {
		this.setState({ creatvisible: false })
	}
	Oncreat = () => {
		this.setState({ iscreat: true, creatvisible: true })
	}
	Onchange = () => {
		this.setState({ ischange: !this.state.ischange })
	}
	onOk = (fieldValues) => {
		const { iscreat, contentdata, editindex } = this.state;
		let newdata = {
			title: fieldValues.name,
			updatetime: "2017-08-09",
			looknum: 20,
			downnum: 30,
			gov: "政府机构",
			source: "权力清单和责任清单",
			detail: {
				name: fieldValues.name,
				datafield: fieldValues.datafield,
				abstract: fieldValues.abstract,
				datadense: fieldValues.datadense,
				dataprecision: fieldValues.dataprecision,
				dataprecisiontitle: "数据精度：",
				releasedata: "2017-10-14",
				updatetime: "2017-10-14",
				dataoffer: fieldValues.dataoffer,
				datapreserver: fieldValues.datapreserver,
				datarangeimgsrc: "./ImageIcon/datarange.png",
				dataexampleimgsrc: "./ImageIcon/dataexample.png"
			}
		}
		if (iscreat) {
			contentdata.unshift(newdata)
		} else {
			contentdata[editindex] = newdata;
		}
		this.setState({ contentdata, creatvisible: false }, () => {
			this.setCurrentContentData()
		})
	}
}

import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, Card,Popconfirm,message} from 'antd';
import {STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';

const FormItem = Form.Item;

export default class Info extends Component {

	render() {
		const {projectList = [], instanceDetail = [], selectProject, actions:{getDocuments,getProject}} = this.props;
		let projectInfo = projectList.filter(project => project.code === (!selectProject ? '' : selectProject.split('--')[0]))[0] || {};
		//判断是不是空对象
		if (JSON.stringify(projectInfo) != "{}") {
			getProject({code:projectInfo.code}).then(rst => {
				if (rst.related_documents.length > 0) {
					getDocuments({code:projectInfo.code +"REL_DOC_A"}).then(rst => {
						projectInfo.projectInfo.extra_params.desc = rst.extra_params.intro;
						projectInfo.extra_params.images = rst.basic_params.files[1];
						projectInfo.extra_params.file_info = rst.basic_params.files[0];
						this.forceUpdate();                    
					})
				}
			})
		}
		console.log("projectInfo:",projectInfo);
		return (
			<Row gutter={24} style={{marginBottom: 20}}>
				{
					projectInfo.name ? (
						<div>
							<Row>
								<Col span={24}>
									<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
										<span style={{
											fontSize: 16,
											fontWeight: 'bold',
											paddingRight: '1em'
										}}>项目详情</span>
										<Button onClick={this.editField.bind(this)}>编辑项目</Button>
										<Popconfirm title="确定删除此项目吗?" onConfirm={this.delProject.bind(this)} okText="确定" cancelText="取消">
											<Button style={{marginLeft:10}}>删除项目</Button>
										</Popconfirm>
									</div>
								</Col>
							</Row>
							<Col span={24}>
								<Row>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="项目名称">
											<Input readOnly value={projectInfo.name}/>
										</FormItem>
									</Col>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="项目编码">
											<Input readOnly value={projectInfo.code}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...Info.layout} label="项目简介">
									<Input type="textarea" rows={3} readOnly
											  value={projectInfo.extra_params.desc || ''}/>
								</FormItem>
								<FormItem {...Info.layout} label="相关文档">
									<div>
										{projectInfo.extra_params.file_info ? (
											<a href={projectInfo.extra_params.file_info ? `${STATIC_DOWNLOAD_API}${projectInfo.extra_params.file_info.download_url}` : ''}
											   target="_bank">
												{projectInfo.extra_params.file_info.name}
											</a>
										) : '无相关文档'}
									</div>
								</FormItem>
								<FormItem {...Info.layout} label="相关图片">
									<Row style={{marginBottom: '20px'}}>
										{
											projectInfo.extra_params.images ? (
												projectInfo.extra_params.images.map((img, index) => {
													return (
														<Col span={4} offset={1} key={index}>
															<Card bodyStyle={{padding: 0}}>
																<div style={{display: 'inline-block', float: 'left'}}>
																	<img width="100%"
																		 src={`${SOURCE_API}${img.a_file}`}/>
																</div>
															</Card>
														</Col>
													)
												})
											) : '无相关图片'
										}
									</Row>
								</FormItem>
							</Col>
						</div>
					) : '请选择项目！'
				}
			</Row>
		);
	}

	delProject() {
		const {
			actions: {
				deleteProjectAc,
				getProjectAc,
				setSelectProjectAc,
				delDirAc,
				deleteLocationAc
			},
			selectProject
		} = this.props;
		deleteProjectAc({ code: selectProject.split('--')[0] })
			.then(rst => {
				if (rst === "") {
					message.success("删除成功！");
					setSelectProjectAc(null);
					getProjectAc();
				}else{
					message.error("删除失败，请先删除其子节点！");
				}
			})
	}

	editField() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		})
		
	}
	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
	static layoutT = {
		labelCol: {span: 8},
		wrapperCol: {span: 12},
	};
}

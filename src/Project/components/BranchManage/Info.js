import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, Card,Popconfirm,message} from 'antd';
import {STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';

const FormItem = Form.Item;

export default class Info extends Component {

	render() {
		const {projectList = [], instanceDetail = [], selectProject} = this.props;
		let projectInfo = projectList.filter(project => project.code === (!selectProject ? '' : selectProject.split('--')[0]))[0] || {};

		console.log("projectInfo:",projectInfo);
		return (
			<Row gutter={24} style={{marginBottom: 20}}>
				{
					projectInfo.name ? (
						<div>
							<Row>
								<Col span={24}>
									<div style={{ borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20 }}>
										<span style={{
											fontSize: 16,
											fontWeight: 'bold',
											paddingRight: '1em'
										}}>部门详情</span>
										<Button onClick={this.editField.bind(this)}>编辑部门</Button>
										<Popconfirm title="确定删除此项目吗?" onConfirm={this.delProject.bind(this)} okText="确定" cancelText="取消">
											<Button style={{ marginLeft: 10 }}>删除部门</Button>
										</Popconfirm>
									</div>
								</Col>
							</Row>
							<Col span={24}>
								<FormItem {...Info.layout} label="部门名称">
									<Input readOnly value={projectInfo.name} />
								</FormItem>

								<FormItem {...Info.layout} label="部门编码">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="所属单位">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="部门地址">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="部门负责人">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="联系方式">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="关联工程">
									<Input readOnly value={projectInfo.name} />
								</FormItem>
								<FormItem {...Info.layout} label="是否供应商">
									<Input readOnly value={projectInfo.name} />
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

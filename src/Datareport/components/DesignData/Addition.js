import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import Card from '_platform/components/panels/Card';
const Option = Select.Option;


export default class Addition extends Component {
	render() {
		const { addition = {}, actions: { changeAdditionField } } = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '编码',
			dataIndex: 'value'
		}, {
			title: '项目名称',
			dataIndex: 'alias'
		}, {
			title: '项目阶段',
			dataIndex: 'description'
		}, {
			title: '提交单位',
			dataIndex: 'unit'
		}, {
			title: '文档名称',
			dataIndex: 'name'
		}, {
			title: '版本',
			dataIndex: 'version'
		}, {
			title: '文档类型',
			dataIndex: 'type'
		}, {
			title: '专业',
			dataIndex: 'specialty'
		}, {
			title: '描述WBS施工对象',
			dataIndex: 'wbsObject'
		}, {
			title: '描述设计对象',
			dataIndex: 'designObject'
		}, {
			title: '附件',
			dataIndex: 'annex'
		}, {
			title: '计划供图时间',
			dataIndex: 'chartTime'
		}, {
			title: '提交时间',
			dataIndex: 'time'
		}, {
			title: '操作',
			render: (text, record, index) => {
				return <span>
					<a className="fa fa-edit" style={{ fontSize: "20px", margin: '0 5px' }} onClick={this.edit.bind(this, record)}></a>
					<Popconfirm
						title={`确定删除?`}
						// onConfirm={this.handleDeleteRow.bind(this, record.value)}
						okText="是"
						cancelText="否"
					>
						<a className="fa fa-trash" style={{ fontSize: "20px", margin: '0 5px' }} ></a>
					</Popconfirm>
				</span>
			}
		}];
		return (

			<Modal

				width={1280}
				visible={addition.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.save.bind(this)}>

				
					<Row style={{ marginBottom: "30px" }}>
						<h3 style={{ textAlign: "center" }}>结果审核</h3>
					</Row>
					<Row style={{ marginBottom: "30px" }}>
						<Table bordered columns={columns} />
					</Row>

					<Row style={{ marginBottom: "30px" }} type="flex">
						<Col><Button style={{ marginRight: "30px" }}>模板下载</Button></Col>
						<Col>
							<Select style={{ marginRight: "30px" }} defaultValue="项目1">
								<Option value="项目1">项目1</Option>
								<Option value="项目2">项目2</Option>
							</Select>
						</Col>
						<Col>
							<Upload style={{ marginRight: "30px" }}>
								<Button>
									<Icon type="upload" /> 选择文件
						</Button>
							</Upload>
						</Col>
						<Col><Input placeholder="文件路径" style={{ width: "200px", marginRight: "30px" }} /></Col>
						<Col><Button style={{ marginRight: "50px" }}>上传并预览</Button></Col>
						<Col>导入方式:&emsp;</Col>
						<Col>
							<Select style={{ marginRight: "30px" }} defaultValue="1">
								<Option value="1">不导入重复的数据</Option>
								<Option value="2">项导入重复的数据</Option>
							</Select>
						</Col>
					</Row>
					<Row style={{ marginBottom: "30px" }}>
						<p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
						<p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
						<p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
						<p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
					</Row>
				


			</Modal>

		);
	}

	save() {

	}



	cancel() {
		const {
			actions: { clearAdditionField }
		} = this.props;
		clearAdditionField();
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}

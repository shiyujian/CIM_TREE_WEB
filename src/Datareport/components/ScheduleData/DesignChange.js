import React, { Component } from 'react';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Modify extends Component {

	render() {
		const columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '专业',
			dataIndex: 'major',
		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
		}, {
			title: '设计单位',
			dataIndex: 'designunit',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}];

		return(
			<Modal
				width = {1280}
				visible = {}
				onCancel = {}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>申请表变更页面</h2>
				</Row>
				<Row>
					<Table
						bordered
						className = 'foresttable'
						columns={columns}
					/>
				</Row>
				<Row style={{marginTop: '20px'}}>
					<Col span={2} push={22}>
						<Button type="default">确认变更</Button>
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>变更原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			</Modal>
		)
	}
}

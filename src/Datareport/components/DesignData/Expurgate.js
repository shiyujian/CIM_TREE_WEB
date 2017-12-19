import React, { Component } from 'react';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Expurgate extends Component {

	render() {
		const {expurgate = {}, actions: {changeExpurgateField}} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '文档编码',
			dataIndex: 'value'
		}, {
			title: '文档名称',
			dataIndex: 'alias'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'description'
		}, {
			title: '单位工程',
			dataIndex: 'description1'
		}, {
			title: '项目阶段',
			dataIndex: 'description2'
		}, {
			title: '提交单位',
			dataIndex: 'description3'
		}, {
			title: '文档类型',
			dataIndex: 'description4'
		}, {
			title: '专业',
			dataIndex: 'description5'
		}, {
			title: '描述的WBS对象',
			dataIndex: 'description6'
		}, {
			title: '描述的设计对象',
			dataIndex: 'description7'
		}, {
			title: '上传人员',
			dataIndex: 'description8'
		}];
		
		return(
			<Modal
				width = {1280}
				visible = {expurgate.visible}
				onCancel = {this.cancel.bind(this)}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>删除项目申请页面</h2>
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
						<Button type="default">确认导入</Button>
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>删除原因：</span>
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

	onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}

	cancel() {
		const {
			actions: {clearExpurgateField}
		} = this.props;
		clearExpurgateField();
	}
}

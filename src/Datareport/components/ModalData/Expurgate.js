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
			title: '编码',
			dataIndex: 'value'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'alias'
		}, {
			title: '单位工程',
			dataIndex: 'description1'
		}, {
			title: '模型名称',
			dataIndex: 'description2'
		}, {
			title: '提交单位',
			dataIndex: 'description4'
		}, {
			title: '模型描述',
			dataIndex: 'description5'
		}, {
			title: '模型类型',
			dataIndex: 'description6'
		}, {
			title: 'fdb模型',
			dataIndex: 'description7'
		}, {
			title: 'tdbx模型',
			dataIndex: 'description8'
		}, {
			title: '属性表',
			dataIndex: 'description9'
		}, {
			title: '上报时间',
			dataIndex: 'description10'
		}, {
			title: '上报人',
			dataIndex: 'description11'
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

import React, { Component } from 'react';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Check extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 1,
		}
	}

	render() {
		const {check = {}, actions: {changeCheckField}} = this.props;

		return(
			<Modal
				width = {1280}
				visible = {check.visible}
				onCancel = {this.cancel.bind(this)}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>结果审核</h2>
				</Row>
				<Row>
					<Table
						bordered
						className = 'foresttable'
						columns={this.columns}
					/>
				</Row>
				<Row style={{margin: '20px 0'}}>
					<Col span={2}>
						<span>审查意见：</span>
					</Col>
					<Col span={4}>
						<RadioGroup onChange={this.onChange} value={this.state.value}>
					        <Radio value={1}>通过</Radio>
					        <Radio value={2}>不通过</Radio>
					    </RadioGroup>
				    </Col>
				    <Col span={2} push={14}>
				    	<Button type='primary'>
        					导出表格
        				</Button>
				    </Col>
				    <Col span={2} push={14}>
				    	<Button type='primary'>
        					确认提交
        				</Button>
				    </Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			    <Row style={{marginBottom: '10px'}}>
			    	<div>审批流程</div>
			    </Row>
			    <Row>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：数据上传者</div>
			    			<div>执行时间：2017-11-22</div>
			    			<div>执行意见：XXXXXXXXXXXXX</div>
			    			<div style={{marginTop: '40px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传</div>
			    	</Col>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：数据审批</div>
			    			<div>执行时间：</div>
			    			<div>执行意见：</div>
			    			<div style={{marginTop: '40px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传审核</div>
			    	</Col>
			    </Row>
			</Modal>
		)
	}

	columns = [{
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

	onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}

	cancel() {
		const {
			actions: {clearCheckField}
		} = this.props;
		clearCheckField();
	}
}

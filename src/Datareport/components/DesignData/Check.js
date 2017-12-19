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
			title:"序号",
			dataIndex: 'order',
		},{
			title:"编码",
			dataIndex: 'code',
		},{
			title:"项目名称",
			dataIndex: 'project',
		},{
			title:"子项目",
			dataIndex: 'subproject',
		},{
			title:"项目阶段",
			dataIndex: 'projectphase',
		},{
			title:"提交单位",
			dataIndex: 'monad',
		},{
			title:"文档名称",
			dataIndex: 'name',
		},{
			title:"版本",
			dataIndex: 'versions',
		},{
			title:"文档类型",
			dataIndex: 'type',
		},{
			title:"专业",
			dataIndex: 'major',
		},{
			title:"描述WBS施工对象",
			dataIndex: 'roadwork',
		},{
			title:"描述设计对象",
			dataIndex: 'design',
		},{
			title:"附件",
			dataIndex: 'accessory',
		},{
			title:"计划供图时间",
			dataIndex: 'supply',
		},{
			title:"提交时间",
			dataIndex: 'commit',
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

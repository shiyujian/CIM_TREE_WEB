import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/query'; 
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Button, Table, Radio, Row, Col } from 'antd';
import './review.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(
	state => {
		const {selfcare: {query = {}} = {}, platform} = state || {};
		return {...query, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Review extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
            value:1
		}
	}
    
    onChange(e) {
        this.setState({
          value: e.target.value,
        });
      }

	render() {
		return (
			<div style={{marginLeft: 180}}>
                <DynamicTitle title="审批流程-详情" {...this.props}/>
				<Row style={{textAlign: 'center',height:30}}>
					<h2>审核流程</h2>
				</Row>
				<Row style={{textAlign: 'center',height:300}}>
					<Table
						bordered
						className = 'foresttable'
                        columns={this.columns}
                        dataSource={this.dataSource}
					/>
				</Row>
				<Row style={{margin: '20px 0',height:30}}>
					<Col span={2}>
						<span>审查意见：</span>
					</Col>
					<Col span={4}>
						<RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
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
			    <Row style={{margin: '20px 0',height:50}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			    <Row style={{marginBottom: '10px',height:30}}>
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

			</div>
		);
    }
    
    columns=[
		{
			title:'规范名称',
			dataIndex:'name',
			key:'name',
		},{
			title:'规范编号',
			dataIndex:'number',
			key:'number',
		},{
			title:'发布单位',
			dataIndex:'company',
			key:'company',
		},{
			title:'实施日期',
			dataIndex:'time',
			key:'time',
		},{
			title:'备注',
			dataIndex:'remark',
			key:'remark'
		},{
			title:'文档状态',
			dataIndex:'state',
			key:'state'
		}
    ];
    
    dataSource = [{
        key: '0',
        name: '市民服务中心00',
        number: '000',
        company:'华东院00',
        time:'2017-12-11',
        remark:'优先处理',
        state:'待审核'
      }, {
        key: '1',
        name: '市民服务中心11',
        number: '111',
        company:'华东院11',
        time:'2017-12-12',
        remark:'优先处理',
        state:'待审核'
      }, {
        key: '2',
        name: '市民服务中心22',
        number: '222',
        company:'华东院22',
        time:'2017-12-13',
        remark:'优先处理',
        state:'待审核'
      }, {
        key: '3',
        name: '市民服务中心33',
        number: '333',
        company:'华东院33',
        time:'2017-12-14',
        remark:'优先处理',
        state:'待审核'
      }, {
        key: '4',
        name: '市民服务中心44',
        number: '444',
        company:'华东院44',
        time:'2017-12-15',
        remark:'优先处理',
        state:'待审核'
      }, {
        key: '5',
        name: '市民服务中心55',
        number: '555',
        company:'华东院55',
        time:'2017-12-16',
        remark:'优先处理',
        state:'待审核'
      }]
};
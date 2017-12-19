import React, { Component } from 'react';
import { Form, Button, Input, Table,message } from 'antd';
import Card from '_platform/components/panels/Card';
import CodeStructure from '_platform/components/panels/CodeStructure';

const FormItem = Form.Item;

export default class Info extends Component {
	constructor(props){
		super(props);
		this.state = {
			inpValue:"",
			
		}
	}
	render() {
		const { code: { codeGroups = [], sidebar = {}, codeGroupStructure = {} } = {} } = this.props;
		console.log('b',this.props);
		const {struct} = this.state;
		const { codeGroup: codeGroupName = '', type = 1 } = sidebar || {};
		const codeGroup = codeGroups.find(codeGroups => codeGroups.name === codeGroupName) || {};
		let value = '';
		return (
			<div>
				<h3 style={{ marginBottom: 20 }}>{codeGroupName}详细信息</h3>
				<Card title="描述信息" extra={<Button type="primary" style={{ backgroundColor: '#169BD5' }} onClick={this.onPutCodegroup.bind(this)}>修改信息</Button>}>
					<Input type="textarea" value={this.state.inpValue}  onChange = {this.onChange.bind(this)}  autosize={{ minRows: 5, maxRow: 6 }} placeholder={codeGroup.description} style={{ marginBottom: 40 }} />
				</Card>
				<Card title="相关文档" extra={<Button type="primary" style={{ backgroundColor: '#169BD5' }}>上传文档</Button>}>
					<Table columns={this.columns} dataSource={[]} style={{ marginBottom: 40 }} />
				</Card>
				<Card title="编码结构" extra={
					<div>
						<Button type="primary" style={{ marginRight: 20, backgroundColor: '#169BD5' }}>修改结构</Button>
						<Button type="primary" style={{ backgroundColor: '#169BD5' }}>修改约束</Button>
					</div>}>
						<CodeStructure dataSource={codeGroupStructure}/>
						 {/* <CodeStructure dataSource={struct}/>  */}

				</Card>
			</div>
		);
	}


	onChange(e) {
		this.setState({
			inpValue:e.target.value
		});
	}
	//修改信息
	onPutCodegroup() {
		let description = this.state.inpValue;
		const { code: { codeGroups = [], sidebar = {}, codeGroupStructure = {} } = {} } = this.props;
		const codeGroup = codeGroups.find(codeGroups => codeGroups.name === codeGroupName) || {};
		const { codeGroup: codeGroupName = '', type = 1 } = sidebar || {};
		const {actions:{putCodeGroup,getCodeGroups
		
		}} = this.props;
		putCodeGroup({name:codeGroupName},{name:codeGroupName,description:description}).then( rst => {
			console.log("rst:",rst);
			getCodeGroups({}).then(rst => {
				if(rst) {
					message.warn("修改成功")
					this.setState({
						inpValue:""
					});
	
				}else{
					message.warn("修改失败")
					this.setState({
						 inpValue:""
					});
				}
			})
			
		});
	}

	columns = [{
		title: '序号',
		
		dataIndex: 'index'
	}, {
		title: '文档名称',
		dataIndex: 'name'
	}, {
		title: '文档类型',
		dataIndex: 'type'
	}, {
		title: '上传时间',
		dataIndex: 'time'
	}, {
		title: '预览',
		dataIndex: 'preview'
	}, {
		title: '下载',
		dataIndex: 'download'
	}, {
		title: '删除',
		dataIndex: 'delete'
	}];

	static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 16 },
	}


}

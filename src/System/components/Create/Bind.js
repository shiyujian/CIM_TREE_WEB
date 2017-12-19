import React, { Component } from 'react';
import CodeStructure from '_platform/components/panels/CodeStructure';
import queryString from 'query-string';
import Card from '_platform/components/panels/Card';
import { Button, message, Select,InputNumber  } from 'antd';
import {CODE_PROJECT} from '_platform/api';

const Option = Select.Option;

export default class Bind extends Component {
	constructor(props) {
		super(props);
		this.state = {
			connections: {},
			DictType: {},
			MinNum: {},
			MaxNum: {},
			MaxNum: {},
			Default: {},
		}
	}

	render() {
		const { create: { codeGroupStructure = {} } = {} } = this.props;
		const { all_fields = [] } = codeGroupStructure || {};
		const { connections = {},DictType = {},MinNum = {},MaxNum = {}, Default = {} } = this.state;
		
		
		return (
			<Card title="创建字段规则">
				<CodeStructure dataSource={codeGroupStructure} onChangeConnenction={this.changeConnection.bind(this)}>
					<tr>
						<td className="title">字段后连接符</td>
						{
							all_fields.map((field, index) => {
								if (index + 1 === all_fields.length) return (<td key={index} />);

								return (
									<td key={index}>
										<Select onChange={this.changeConnection.bind(this, field)} value={connections[field]}
											style={{ width: '100%' }}>
											<Option value="">空</Option>
											<Option value=",">,</Option>
											<Option value="|">|</Option>
											<Option value=" ">空格</Option>
											<Option value="~">~</Option>
											<Option value="-">-</Option>
											<Option value="_">_</Option>
											<Option value="+">+</Option>
											<Option value=".">.</Option>
											<Option value="#">#</Option>
										</Select>
									</td>)
							})
						}
					</tr>
					<tr>
						<td className="title">字符类型</td>
						{
							all_fields.map((field, index) => {
								return (
									<td key={index}>
										<Select mode='multiple' onChange={this.changeDictType.bind(this, field)} value={DictType[field]}
											style={{ width: '100%' }}>
											<Option value="A">A</Option>
											<Option value="N">N</Option>
											<Option value="C">C</Option>
										</Select>
									</td>)
							})
						}
					</tr>
					<tr>
						<td className="title">字符位数</td>
						{
							all_fields.map((field, index) => {
								return (
									<td key={index}>
										<InputNumber  
										 min={1} 
										 max={10} 
										 onChange={this.changeMinNum.bind(this, field)} 
										 value={MinNum[field]}
										 style={{ width: '40%' }}
										/>
										<span>-</span>
										<InputNumber  
										 min={1} 
										 max={10} 
										 onChange={this.changeMaxNum.bind(this, field)} 
										 value={MaxNum[field]}
										 style={{ width: '40%' }}
										/>
									</td>)
							})
						}
					</tr>


					<tr>
						<td className="title">是否可缺省</td>
						{
							all_fields.map((field, index) => {
								return (
									<td key={index}>
										<Select onChange={this.changeDefault.bind(this, field)} value={Default[field]}
											style={{ width: '100%' }}>
											<Option value={true}>是</Option>
											<Option value={false}>否</Option>
										</Select>
									</td>)
							})
						}
					</tr>
					
				</CodeStructure>
				<div style={{ textAlign: 'right', marginTop: 40 }}>
					<Button onClick={this.back.bind(this)} type="primary" style={{ marginRight: 24 }}>上一步</Button>
					<Button onClick={this.save.bind(this)} type="primary">保存</Button>
				</div>
			</Card>
		);
	}

	componentDidMount() {
		const { location = {}, actions: { getCodeGroupStructure } } = this.props;
		const { code_type = '' } = queryString.parse(location.search) || {};
		getCodeGroupStructure({}, { name: code_type, code_type });
		
	}

	changeConnection(field, value) {
		const { connections = {} } = this.state;
		this.setState({
			connections: { ...connections, [field]: value }
		});
		console.log('connections',connections)
	}

	changeDictType(field, value) {
		const { DictType = {} } = this.state;
		this.setState({
			DictType: { ...DictType, [field]: value }
		});
		console.log('DictType',DictType)
	}
	
	changeMinNum(field, value) {
		const { MinNum = {} } = this.state;
		this.setState({
			MinNum: { ...MinNum, [field]: value }
		});
		console.log('MinNum',MinNum)
	}
	changeMaxNum(field, value) {
		const { MaxNum = {} } = this.state;
		this.setState({
			MaxNum: { ...MaxNum, [field]: value }
		});
		console.log('MaxNum',MaxNum)
	}
	changeDefault(field, value) {
		const { Default = {} } = this.state;
		this.setState({
			Default: { ...Default, [field]: value }
		});
		console.log('D',Default)
	}
	save() {
		const {
			create: { codeGroupStructure = {} } = {},
			actions: { postCodeType, changeConnectField }, history, location
		} = this.props;
		const { all_fields = [] } = codeGroupStructure || {};
		const { connections,DictType,MinNum,MaxNum,Default } = this.state;
		const { code_type = '' } = queryString.parse(location.search) || {};
		const connectionList = all_fields.map(field => {
			return connections[field];
		}).filter(connection => typeof connection !== 'undefined');
		const restrictions = all_fields.map(field => {
			return {
				type:DictType[field],
				min:MinNum[field],
				max:MaxNum[field],
				nullable:Default[field],
			}
		})
		
		let typeList =  restrictions.map(item=>item.type);
		let minList = restrictions.map(item=>item.min);
		let maxList = restrictions.map(item=>item.max);
		let nullableList = restrictions.map(item=>item.nullable);
		
		if (connectionList.length + 1 !== all_fields.length) {
			message.warn('请选择连接符');
		} else if(typeList.some(item => item == undefined || item.length == 0)) {
			message.warn('字符类型不能为空');
		}else if(minList.some(item => item == undefined )){
			message.warn('最小位数不能为空');
		}else if(maxList.some(item => item == undefined )){
			message.warn('最大位数不能为空');
		}else if(nullableList.some(item => item == undefined)){
			message.warn('请选择是否可缺省');
		} else {
			postCodeType({}, {
				project: CODE_PROJECT,
				name: code_type,
				struct_type: codeGroupStructure.struct_type,
				struct: codeGroupStructure.struct,
				fields_connections: connectionList,
				field_restrictions: restrictions
			}).then(rst => {
				if (rst && rst.name) {
					changeConnectField('connections', []);
				    history.replace('/system/code');
				}
			});
		}
	}

	back() {

		const {
			create: { sidebar = {} } = {}, location = {}, history,
			actions: { postCodeGroupStructure, changeSidebarField, clearSidebarField, saveFlag },
		} = this.props;
		const { create: { nameInde } } = this.props;
		clearSidebarField();
		history.replace(`/system/code/create?current=1&code_type=${nameInde[0]}&independent=${nameInde[1]}`);

	}
}

import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, notification,Button, Icon,Progress,Select,Table,Popconfirm,} from 'antd';
import moment from 'moment';
import {FILE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
export default class AddStation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource:[],
			dataArray:[],
		};
    }
    onBtnClick = ()=>{
    	const { 
            actions: { 
                setDepthArray,
            } 
        } = this.props.props;
    	let a = document.getElementById("inputt").value;
    	const {dataSource,dataArray} = this.state;
    	if(a===""){
    		notification.info({
                message: '请输入值！',
                duration: 2
            });
    	}else{
    		dataSource.push({depth:a});
    		dataArray.push(a);
	    	this.setState({dataSource});
	    	setDepthArray(dataArray);
    	}
    }

    delete = (record,index) =>{
    	const { 
            actions: { 
                setDepthArray,
            } 
        } = this.props.props;
    	let {dataSource,dataArray} = this.state;
    	dataSource.splice(index,1); 
    	dataArray.splice(index,1); 
    	this.setState({dataSource});
    	setDepthArray(dataArray);
    }

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const columns = [
            {
                title:'深度',
                dataIndex:'depth',
                width: '10%',
            },{
                title:'操作',
                dataIndex:'opt',
                width: '15%',
                render: (text,record,index) => {
                    return <div>
                                <Popconfirm
                                 placement="rightTop"
                                 title="确定删除吗？"
                                 onConfirm={()=>{this.delete(record,index)}}
                                 okText="确认"
                                 cancelText="取消">
                                 <a>删除</a>
                                </Popconfirm>
                            </div>
                }
            }
        ];
		const {currentTypeValue,isSurvey} = this.props.state;
		let typeValue = currentTypeValue.split("-");
		return (
				<Form>
					<p style={{fontSize:14}}>{`${typeValue[1]}`}</p>
					<FormItem {...formItemLayout} label="监测点编号">
						{getFieldDecorator('number', {
							rules: [
								{required: true, message: '请输入监测点编号'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="仪器">
						{getFieldDecorator('instrument', {
							rules: [
								{required: true, message: '请输入仪器名称'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="经度">
						{getFieldDecorator('x', {
							rules: [
								{required: true, message: '请输入经度'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="纬度">
						{getFieldDecorator('y', {
							rules: [
								{required: true, message: '纬度'},
							]
						})(
							<Input placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="纵深">
						{getFieldDecorator('z', {
							rules: [
								{required: true, message: '请输入纵深'},
							]
						})(
							<Input placeholder="必填"/>
						)}
					</FormItem>
					{
						isSurvey === true ?
						<div>
							<Input size="small" id="inputt" style={{width:120,marginLeft:180}}/>
							<Button
							 type="primary"
							 icon="plus"
							 size="small"
							 style={{marginLeft:20}}
							 onClick={()=>{this.onBtnClick()}}
							 >添加深度</Button>
							<Table 
							 dataSource={this.state.dataSource}
							 columns={columns}
							 bordered
							 style={{width:300,marginLeft:180,marginTop:15}}
							 size="small"
							 pagination = {{pageSize:5}}
							> 
							</Table>
						</div>
											:
						null
					}
					<FormItem {...formItemLayout} label="工程部位" hasFeedback>
						{getFieldDecorator('position', {
						}, {})(
							<Select  placeholder="选填">
                                <Option value='部位1'>部位1</Option>
                                <Option value='部位2'>部位2</Option>
                                <Option value='部位3'>部位3</Option>
	                        </Select>
						)}
					</FormItem>
				</Form>
		)
	}
}
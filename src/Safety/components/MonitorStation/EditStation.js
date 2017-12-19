import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, notification,Button, Icon,Progress,Select,Table,Popconfirm,} from 'antd';
import moment from 'moment';
import {FILE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
export default class EditStation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource:this.props.state.depthArray,
			dataArray:this.props.state.record.depth,
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
		const {currentTypeValue} = this.props.state;
		let typeValue = currentTypeValue.split("-");
		let isSurvey = false;
		if(this.props.state.depthArray.length>0){
			isSurvey = true;
		}
		return (
				<Form>
					<p style={{fontSize:14}}>{this.props.state.record.monitorProject}</p>
					<FormItem {...formItemLayout} label="监测点编号">
						{getFieldDecorator('number', {
							initialValue: this.props.state.record.number,
							rules: [
								{required: true, message: '请输入监测点编号'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="仪器">
						{getFieldDecorator('instrument', {
							initialValue: this.props.state.record.instrument,
							rules: [
								{required: true, message: '请输入仪器名称'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="坐标X">
						{getFieldDecorator('x', {
							initialValue: this.props.state.record.x,
							rules: [
								{required: true, message: '请输入坐标X'},
							]
						})(
							<Input  placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="坐标Y">
						{getFieldDecorator('y', {
							initialValue: this.props.state.record.y,
							rules: [
								{required: true, message: '请输入坐标Y'},
							]
						})(
							<Input placeholder="必填"/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="坐标Z">
						{getFieldDecorator('z', {
							initialValue: this.props.state.record.z,
							rules: [
								{required: true, message: '请输入坐标Z'},
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
							initialValue: this.props.state.record.type,
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
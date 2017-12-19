import React, {Component} from 'react';

import {Input, Form, Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal} from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select

class AddRating extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource:[]
		};
	}
	//table input 输入
    tableDataChange(index, key ,e ){
		const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
	  	this.setState({dataSource});
	}
	//新增一行
	addRow(){
		let {dataSource} = this.state
		dataSource.push({
			"name": "", 
			"reduce_score": "", 
		})
		this.setState({dataSource})
	}
	//删除一行
	delete(index){
        let datas = this.state.dataSource;
        datas.splice(index,1);
        this.setState({dataSource:datas});
	}
	//ok
	onok(){
		this.props.form.validateFields(["check_item","item_property","score","ratio"],(err,values) => {
            if(!err){
				this.props.addCheckContent1(this.state.dataSource,values)
            }
        }); 
	}
	//自定义校验规则：数字
	checkNumber = (rule, value, callback) => {
		const form = this.props.form;
		let check = 1 * value;
		if (value && isNaN(check)) {
			callback('请输入数字');
		} else {
			callback();
		}
	}	
	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props;
		const columns = [{
            title: '序号',
            dataIndex: 'index',
            // width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '扣分标准',
			dataIndex: 'name',
			render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['name']} onChange={this.tableDataChange.bind(this,index,'name')}/>
            ),
        }, {
            title: '扣分',
			dataIndex: 'reduce_score',
			render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['reduce_score']} onChange={this.tableDataChange.bind(this,index,'reduce_score')}/>
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            // width: '10%',
            render: (text, record, index) => (
                <span>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }]
		return (
			<Modal
			title="安全管理检查评分表"
			key={this.props.ckey}
			visible={this.props.state.checkContentVisivle}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
				<div>
					<Form>
						<FormItem {...formItemLayout} label="检查项目" hasFeedback>
							{getFieldDecorator('check_item', {
								rules: [
									{ required: true, message: '请输入检查项目' },
								],
							}, {})(
								<Input type="text" placeholder="请输入检查项目"/>
								)}
						</FormItem>
						<FormItem {...formItemLayout} label="项目性质" hasFeedback>
							{getFieldDecorator('item_property', {
								rules: [
									{ required: true, message: '请输入项目性质' },
								],
							}, {})(
								<Input type="text" placeholder="请输入项目性质"/>
								)}
						</FormItem>
						<FormItem {...formItemLayout} label="分数" hasFeedback>
							{getFieldDecorator('score', {
								rules: [
									{ required: true, message: '请输入分数' },
									{ validator: this.checkNumber }
								],
							}, {})(
								<Input type="text" placeholder="请输入分数"/>
								)}
						</FormItem>
						<FormItem {...formItemLayout} label="分数比例" hasFeedback>
							{getFieldDecorator('ratio', {
								rules: [
									{ required: true, message: '请输入分数比例' },
									{ validator: this.checkNumber }
								],
							}, {})(
								<Input type="text" placeholder="请输入分数比例"/>
								)}
						</FormItem>
					</Form>
					<Row>
						<Button onClick={this.addRow.bind(this)} style={{float:'right', marginRight:'10px'}}>新增</Button>
					</Row>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
						columns={columns}
						dataSource={this.state.dataSource}
						bordered />
				</div>
			</Modal>
		)
	}
}
export default Form.create()(AddRating)
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification
} from 'antd';
const FormItem = Form.Item;

class Addition extends Component {
	static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			addVisible:false,
			newKey: Math.random()
        }
	}
	
	static layoutT = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };
    static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 20},
    };

	render() {
		const{
			addVisible = false,
		} = this.state;

		const { 
			form: { 
				getFieldDecorator 
			} 
		} = this.props;

		return (
			<div>
				<div style={{float:'right',marginBottom:12}}>
					<Button type='primary' onClick={this.add.bind(this)}>新增苗圃</Button>
				</div>
				
				<Modal title="新增苗圃"
				       width={920} visible={addVisible}
					   onOk={this.save.bind(this)}
					//    key={this.state.newKey}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<Row>
							<Col span={24}>
								<Row>
									<Col span={12}>
										<FormItem   {...Addition.layoutT} label="供应商:">
											{
												getFieldDecorator('SFactory', {
													rules: [
														{ required: true, message: '请输入供应商' }
													]
												})
												(
													<Input placeholder='请输入供应商'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={12}>
										<FormItem   {...Addition.layoutT} label="苗圃名称:">
											{
												getFieldDecorator('SNurseryName', {
													rules: [
														{ required: true, message: '请输入苗圃名称' }
													]
												})
												(
													<Input placeholder='请输入苗圃名称'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={12}>
										<FormItem   {...Addition.layoutT} label="行政区划:">
											{
												getFieldDecorator('SRegionName', {
													rules: [
														{ required: true, message: '请输入行政区划' }
													]
												})
												(
													<Input placeholder='请输入行政区划'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={12}>
										<FormItem   {...Addition.layoutT} label="行政区划编码:">
											{
												getFieldDecorator('SRegionCode', {
													rules: [
														{ required: true, message: '请输入行政区划编码' }
													]
												})
												(
													<Input placeholder='请输入行政区划编码'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={12}>
										<FormItem   {...Addition.layoutT} label="产地:">
											{
												getFieldDecorator('STreePlace', {
													rules: [
														{ required: true, message: '请输入产地' }
													]
												})
												(
													<Input placeholder='请输入产地'/>
												)
											}
                                        </FormItem>
									</Col>
								</Row>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}

	add(){
		this.setState({
			// newKey: Math.random(),
			addVisible:true
		})
	}

	cancel() {
		const{
			form:{setFieldsValue}
		} = this.props
		setFieldsValue({
			'SFactory': undefined,
			'SNurseryName': undefined,
			'SRegionCode': undefined,
			'SRegionName': undefined,
			'STreePlace': undefined,
		});

		this.setState({
			addVisible:false
		})
	}

	save() {
		const{
			actions:{
				postNursery,
				getNurseryList			
			},
			form:{setFieldsValue}
		}= this.props
        let me = this;
        me.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
            if (!err) {
				let postdata = {
					Factory:values.SFactory,
					NurseryName:values.SNurseryName,
					RegionCode:values.SRegionCode,
					RegionName:values.SRegionName,
					TreePlace:values.STreePlace
				}
				postNursery({},postdata).then((rst)=>{
					console.log('rst',rst)
					if(rst && rst.code){
						if(rst.msg && rst.msg === '苗圃已存在'){
							notification.error({
								message:'名称已存在',
								duration:3
							})
						}else{
							notification.success({
								message: '新增苗圃成功',
								duration: 2
							}) 
							getNurseryList()
							setFieldsValue({
								'SFactory': undefined,
								'SNurseryName': undefined,
								'SRegionCode': undefined,
								'SRegionName': undefined,
								'STreePlace': undefined,
							});
							me.setState({
								addVisible:false
							})
						}
						
					}else{
						notification.error({
                            message: '新增苗圃失败',
                            duration: 2
                        }) 
					}
					
				})
				
			}
		})
		
	}
}

export default Form.create()(Addition)
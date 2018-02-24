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
            addVisible:false
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
				<Button type='primary' onClick={this.add.bind(this)}>新增苗圃</Button>
				<Modal title="新增苗圃"
				       width={920} visible={addVisible}
				       onOk={this.save.bind(this)}
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
			addVisible:true
		})
	}

	cancel() {
		this.setState({
			addVisible:false
		})
	}

	save() {
		const{
			actions:{
				postNursery,
				getNurseryList			
			}
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
					if(rst && rst.msg){
						notification.success({
                            message: '新增苗圃成功',
                            duration: 2
						}) 
						getNurseryList()
						me.setState({
							addVisible:false
						})
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

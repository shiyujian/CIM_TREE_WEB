import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification
} from 'antd';
const FormItem = Form.Item;
const InputTextArea = Input.TextArea;

class Edite extends Component {
	static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			newKey: Math.random()
        }
	}
	
	static layoutT = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };
    static layout = {
		labelCol: {span: 3},
		wrapperCol: {span: 20},
    };

	render() {
		const { 
			form: { 
				getFieldDecorator 
            },
            record={},
            editVisible 
		} = this.props;
        console.log('renderrecord',record)
        console.log('editVisible',editVisible)
        const uploadProps={
			name:'file',
			action:'http://47.104.159.127/upload/treetype',	
			headers:{
				authorization:'authorization-text',

			}

		}
		return (
			<div>
				<Modal title="修改树种信息"
					   width={920} 
					   visible={editVisible}
					   onOk={this.save.bind(this)}
					   key={this.state.newKey}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<Row>
							<Col span={24}>
								<Row>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="树种ID:">
											{
												getFieldDecorator('EID', {
                                                    initialValue: `${record.ID?record.ID:''}`,
													rules: [
														{ required: true, message: '树种ID' }
													]
												})
												(
													<Input placeholder='请输入树种ID'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="树种学名:">
											{
												getFieldDecorator('ETreeTypeName', {
                                                    initialValue: `${record.TreeTypeName?record.TreeTypeName:''}`,
													rules: [
														{ required: true, message: '请输入树种学名' }
													]
												})
												(
													<Input placeholder='请输入树种学名'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="所属类型:">
											{
												getFieldDecorator('ETreeTypeGenera', {
                                                    initialValue: `${record.TreeTypeGenera?record.TreeTypeGenera:''}`,
													rules: [
														{ required: true, message: '请输入所属类型' }
													]
												})
												(
													<Input placeholder='请输入所属类型'/>
												)
											}
                                        
                                        </FormItem>
									</Col>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="编码:">
											{
												getFieldDecorator('ETreeTypeNo', {
                                                    initialValue: `${record.TreeTypeNo?record.TreeTypeNo:''}`,
													rules: [
														{ required: true, message: '请输入编码' }
													]
												})
												(
													<Input placeholder='请输入编码'/>
												)
											}
                                        </FormItem>
									</Col>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="习性:">
											{
												getFieldDecorator('EGrowthHabite', {
                                                    initialValue: `${record.GrowthHabit?record.GrowthHabit:''}`,
													rules: [
														{ required: true, message: '请输入习性' }
													]
												})
												(
													<InputTextArea  placeholder='请输入习性'
																	autosize={{minRows:3,maxRows:8}}
													/>
												)
											}
                                        </FormItem>
									</Col>
									<Col span={24}>
										<FormItem   {...Edite.layout} label="Pics:">
											{
												getFieldDecorator('EPics', {
                                                    initialValue: `${record.Pics?record.Pics:''}`,
													rules: [
														{ required: true, message: '请输入Pics' }
													]
												})
												(
													<Upload {...uploadProps}>
														<Icon type="plus" className="avatar-uploader-trigger"/>
													</Upload>
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

	cancel() {
        const{
			actions:{changeEditVisible}
		}=this.props
		this.setState({
			newKey: Math.random()
		})
		changeEditVisible(false)
	}

	save(){
		const{
			actions:{
				putNursery,
                getNurseryList,
                changeEditVisible			
			},
            form:{setFieldsValue},
            record
		}= this.props
		
		let me = this;
        me.props.form.validateFields((err, values) => {
			console.log('Received err of form: ', err);
			console.log('Received values of form: ', values);
			console.log('Received record of form: ', record);
            if (!err) {
				if((values.EFactory === record.Factory) && (values.ENurseryName === record.NurseryName) && (values.ERegionCode === record.RegionCode)
					&& (values.ERegionName === record.RegionName) && (values.ETreePlace === record.TreePlace)
				){
					notification.info({
						message:'请进行修改后再进行提交',
						duration:3
					})
				}else{
                    let postdata = {
                        'Factory': values.EFactory,
                        'NurseryName': values.ENurseryName,
                        'RegionCode': values.ERegionCode,
                        'RegionName': values.ERegionName,
                        'TreePlace': values.ETreePlace,
                        'ID' : record.ID
                    }
                    putNursery({},postdata).then((rst)=>{
                        if(rst && rst.code){
                            if(rst.msg && rst.msg === '苗圃已存在'){
                                notification.error({
                                    message:'名称已存在',
                                    duration:3
                                })
                            }else{
                                notification.success({
                                    message: '更新苗圃信息成功',
                                    duration: 2
                                }) 
								getNurseryList();
								
								changeEditVisible(false)
								this.setState({
									newKey: Math.random()
								})
                            }
                        }else{
                            notification.error({
                                message:'苗圃信息更改失败',
                                duration:3
                            })
                        }
                    })


					changeEditVisible(false)
				}

			}
		})
		
	}
}

export default Form.create()(Edite)

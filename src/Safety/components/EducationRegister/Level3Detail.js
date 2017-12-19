import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col} from 'antd';
import moment from 'moment';
import { Route } from 'react-router-dom';
import {STATIC_DOWNLOAD_API,SOURCE_API} from '../../../_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;
class Level3Detail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			class_edu_img:[],
			project_edu_img:[],
			company_edu_img:[]
		};
    }
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props;
		return (
            <Form>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="姓名" hasFeedback>
							{getFieldDecorator('name', {
								rules: [
									{ required: true, message: '请输入姓名' },
								]
							})(
								<Input type="text" placeholder="请输入姓名" />
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="性别" hasFeedback>
							{getFieldDecorator('female', {
								rules: [
									{ required: true, message: '请选择性别！' },
								]
							}, {})(
								<Input/>
								)}
						</FormItem>
					</Col>
				</Row>
				<Row >
					<Col span={12}>
						<FormItem {...formItemLayout} label="工种" hasFeedback>
							{getFieldDecorator('work', {
								rules: [
									{ required: true, message: '请选择工种' },
								],
							}, {})(
								<Input type="text" placeholder="请输入工种"/>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="年龄" hasFeedback>
							{getFieldDecorator('age', {
								rules: [
									{ required: true, message: '年龄' },
								]
							}, {})(
								<Input />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="工龄" hasFeedback>
							{getFieldDecorator('worktime', {
								rules: [
									{ required: true, message: '请输入工龄' },
								]
							})(
								<Input type="text" placeholder="请输入工龄" />
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="进场时间" hasFeedback>
							{getFieldDecorator('enter_time', {
								rules: [
									{ required: true, message: '请选择进场时间！' },
								]
							}, {})(
								<Input />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<FormItem {...formItemLayout} label="新工人入场三级安全教育登记表" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.register_form.a_file}`}>{this.props.register_form.name}</a>
						</FormItem>	
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="公司教育" hasFeedback>
							{getFieldDecorator('company_edu_time', {
								rules: [
									{ required: true, message: '请选择公司教育日期！' },
								]
							}, {})(
								<Input />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="公司（第一级）安全教育记录表" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.company_edu_record.a_file}`}>{this.props.company_edu_record.name}</a>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="公司（第一级）安全教育教材" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.company_edu_book.a_file}`}>{this.props.company_edu_book.name}</a>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<FormItem {...formItemLayout} label="照片" hasFeedback>
                        <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                            {   
                                this.props.company_edu_img &&
                                this.props.company_edu_img.map((item,index) => {
                                    return (
                                        <img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item.a_file}`} alt=""
                                             onClick={() => this.createLink(this,`${STATIC_DOWNLOAD_API}${item.a_file}`)}/>
                                    )
                                })
                            }
                        </div>
						</FormItem>		
					</Col>
				</Row>
				
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="项目部教育" hasFeedback>
							{getFieldDecorator('project_edu_time', {
								rules: [
									{ required: true, message: '请选择育日期！' },
								]
							}, {})(
								<Input />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="项目部（第二级）安全教育记录表" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.project_edu_record.a_file}`}>{this.props.project_edu_record.name}</a>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="项目部（第二级）安全教育教材" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.project_edu_book.a_file}`}>{this.props.project_edu_book.name}</a>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<FormItem {...formItemLayout} label="照片" hasFeedback>
                        <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                            {   
                                this.props.project_edu_img &&
                                this.props.project_edu_img.map((item,index) => {
                                    return (
                                        <img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item.a_file}`} alt=""
                                             onClick={() => this.createLink(this,`${STATIC_DOWNLOAD_API}${item.a_file}`)}/>
                                    )
                                })
                            }
                        </div>
						</FormItem>		
					</Col>
				</Row>

				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="班组教育" hasFeedback>
							{getFieldDecorator('class_edu_time', {
								rules: [
									{ required: true, message: '请选择日期！' },
								]
							}, {})(
								<Input />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="班组（第三级）安全教育记录表" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.class_edu_record.a_file}`}>{this.props.class_edu_record.name}</a>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="班组（第三级）安全教育教材" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.class_edu_book.a_file}`}>{this.props.class_edu_book.name}</a>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<FormItem {...formItemLayout} label="照片" hasFeedback>
                        <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                            {   
                                this.props.class_edu_img &&
                                this.props.class_edu_img.map((item,index) => {
                                    return (
                                        <img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item.a_file}`} alt=""
                                             onClick={() => this.createLink(this,`${STATIC_DOWNLOAD_API}${item.a_file}`)}/>
                                    )
                                })
                            }
                        </div>
						</FormItem>		
					</Col>
				</Row>
			</Form>
		)
	}
}
function dataTransform(obj){
    let res = {};
    for(let key in obj){
        res[key] = {
            value: obj[key]
        }
    }
    return res;
}
export default Form.create({
    mapPropsToFields(props){
        return {
            ...dataTransform(props.person),
            ...dataTransform(props)

        }
    }
})(Level3Detail);
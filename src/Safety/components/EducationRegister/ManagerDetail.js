import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col} from 'antd';
import {SOURCE_API,STATIC_DOWNLOAD_API} from '../../../_platform/api'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class ManagerDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			train_img:[]
		};
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
						<FormItem {...formItemLayout} label="姓名">
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
						<FormItem {...formItemLayout} label="职务">
							{getFieldDecorator('title', {
								rules: [
									{ required: true, message: '请输入职务' },
								],
							}, {})(
								<Input type="text" placeholder="请输入职务">
								</Input>
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
					<Col span={12}>
						<FormItem {...formItemLayout} label="安全教育记录表">
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.train_record.a_file}`}>{this.props.train_record.name}</a>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="安全教育教材" hasFeedback>
                            <a href={`${STATIC_DOWNLOAD_API}${this.props.train_book.a_file}`}>{this.props.train_book.name}</a>
						</FormItem>
					</Col>
				</Row>
				<Row>
                    <Col span={12}>
						<FormItem {...formItemLayout} label="培训单位">
							{getFieldDecorator('train_unit1', {
								rules: [
									{ required: true, message: '请输入培训单位' },
								],
							}, {})(
								<Input type="text" placeholder="请输入培训单位"></Input>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="培训日期" hasFeedback>
							{getFieldDecorator('train_date', {
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
                        <FormItem {...formItemLayout} label="培训课时">
                            {getFieldDecorator('train_hour', {
                                rules: [
                                    { required: true, message: '请输入培训课时' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入培训课时"></Input>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="考核成绩">
                            {getFieldDecorator('scoreone', {
                                rules: [
                                    { required: true, message: '请输入考核成绩' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入考核成绩"></Input>
                                )}
                        </FormItem>
                    </Col>
                </Row> 
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="发证单位">
                            {getFieldDecorator('verify_unit1', {
                                rules: [
                                    { required: true, message: '请输入发证单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入发证单位"></Input>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="证件编号">
                            {getFieldDecorator('certificate1', {
                                rules: [
                                    { required: true, message: '请输入证件编号' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入证件编号"></Input>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="培训主要内容">
                    {getFieldDecorator('train_content', {
                        rules: [
                            { required: false, message: '请输入培训主要内容' },
                        ],
                    }, {})(
                        <Input type="textarea" placeholder="请输入培训主要内容"></Input>
                        )}
                </FormItem>
				<Row>
					<Col span={24}>
						<FormItem {...formItemLayout} label="照片" hasFeedback>
                        <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                            {   
                                this.props.train_img &&
                                this.props.train_img.map((item,index) => {
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
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            train_unit1:{
                value:props.train_unit.name
            },
            certificate1:{
                value:props.certificate.code
            },
            verify_unit1:{
                value:props.verify_unit.name
            },
            ...dataTransform(props.person),
            ...dataTransform(props)

        }
    }
})(ManagerDetail);
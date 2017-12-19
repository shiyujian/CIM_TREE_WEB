import React, { Component } from 'react';
import { Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col, InputNumber  } from 'antd';
import {SOURCE_API,STATIC_DOWNLOAD_API} from '../../../_platform/api'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class ApproachCheckDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            check_report:[],
            images:[]
        };
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
			form: { getFieldDecorator }
		} = this.props;
        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="工程名称">
                            {getFieldDecorator('projectName', {
                                rules: [
                                    { required: true, message: '请输入工程名称' },
                                ],
                            })(
                                <Input type="text" placeholder="请输入工程名称" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="项目负责人" hasFeedback>
                            {getFieldDecorator('responsor1', {
                                rules: [
                                    { required: true, message: '请输入项目负责人' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入项目负责人" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="专职安全员">
                            {getFieldDecorator('safety_guard1', {
                                rules: [
                                    { required: true, message: '请输入专职安全员' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入专职安全员" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施名称">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请选择设备设施名称' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施名称" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备类型">
                            {getFieldDecorator('device_type', {
                                rules: [
                                    { required: true, message: '请输入设备类型' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备类型" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="规格型号">
                            {getFieldDecorator('device_spec', {
                                rules: [
                                    { required: true, message: '请输入规格型号' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入规格型号"/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="许可证号">
                            {getFieldDecorator('licence1', {
                                rules: [
                                    { required: true, message: '请输入许可证号' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入许可证号" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="合格证号">
                            {getFieldDecorator('certificate1', {
                                rules: [
                                    { required: true, message: '请输入合格证号' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入合格证号" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="检查验收报告结论">
                            {getFieldDecorator('conclusion', {
                                rules: [
                                    { required: true, message: '请输入检查验收报告结论' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入检查验收报告结论" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="数量">
                            {getFieldDecorator('number', {
                                rules: [
                                    { required: true, message: '请输入数量' },
                                ],
                            }, {})(
                                <Input placeholder="请输入数量" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收日期" hasFeedback>
                            {getFieldDecorator('accept_date', {
                                rules: [
                                    { required: true, message: '请选择日期！' },
                                ]
                            }, {})(
                                <Input />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收人">
                            {getFieldDecorator('acceptor1', {
                                rules: [
                                    { required: true, message: '请输入验收人' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入验收人" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                
                <FormItem {...formItemLayout} label="检查报告" hasFeedback>
                {   
                    this.props.check_report &&
                    this.props.check_report.map((item,index) => {
                           return (<p><a href={`${STATIC_DOWNLOAD_API}${item.a_file}`}>{item.name}</a></p>)
                    })
                }
                </FormItem>
                <FormItem {...formItemLayout} label="照片" hasFeedback>
                    <div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
                        {   
                            this.props.images &&
                            this.props.images.map((item,index) => {
                                return (
                                    <img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item.a_file}`} alt=""
                                            onClick={() => this.createLink(this,`${STATIC_DOWNLOAD_API}${item.a_file}`)}/>
                                )
                            })
                        }
                    </div>  
                </FormItem>		
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
            projectName:{
                value:props.project_unit.name
            },
            responsor1:{
                value:props.responsor.name
            },
            safety_guard1:{
                value:props.safety_guard.name
            },
            licence1:{
                value:props.licence.number
            },
            certificate1:{
                value:props.certificate.number
            },
            acceptor1:{
                value:props.acceptor.name
            },
            ...dataTransform(props)

        }
    }
    })(ApproachCheckDetail);

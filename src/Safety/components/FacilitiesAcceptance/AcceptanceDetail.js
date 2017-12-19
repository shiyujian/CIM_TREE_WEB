import React, { Component } from 'react';
import { Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import {SOURCE_API,STATIC_DOWNLOAD_API} from '../../../_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;

class AcceptanceDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detect_chart:[],
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
                                ]
                            })(
                                <Input type="text" placeholder="请输入工程名称" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="施工单位" hasFeedback>
                            {getFieldDecorator('construction_org1', {
                                rules: [
                                    { required: true, message: '请输入施工单位' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入施工单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="施工单位负责人" hasFeedback>
                            {getFieldDecorator('construction_per1', {
                                rules: [
                                    { required: true, message: '请输入施工单位负责人' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入施工单位负责人" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="监理单位">
                            {getFieldDecorator('supervising_org1', {
                                rules: [
                                    { required: true, message: '请输入监理单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入监理单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施类型" hasFeedback>
                            {getFieldDecorator('device_type', {
                                rules: [
                                    { required: false, message: '请输入设备设施类型' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施类型" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施名称">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请输入设备设施名称' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施名称" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备编号" hasFeedback>
                            {getFieldDecorator('code', {
                                rules: [
                                    { required: false, message: '请输入设备编号' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入设备编号" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="分包单位">
                            {getFieldDecorator('sub_contrator_org1', {
                                rules: [
                                    { required: false, message: '请选择分包单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请选择分包单位"/>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="分包单位责任人">
                            {getFieldDecorator('sub_contrator_per1', {
                                rules: [
                                    { required: false, message: '请选择分包单位责任人' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请选择分包单位责任人"/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="安装单位">
                            {getFieldDecorator('install_org1', {
                                rules: [
                                    { required: false, message: '请输入安装单位' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入安装单位" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="安装日期" hasFeedback>
                            {getFieldDecorator('install_date', {
                                rules: [
                                    { required: true, message: '请选择安装日期！' },
                                ]
                            }, {})(
                                <Input />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="出租单位">
                            {getFieldDecorator('rent_org1', {
                                rules: [
                                    { required: false, message: '请输入出租单位' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入出租单位" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="监测单位">
                            {getFieldDecorator('check_org1', {
                                rules: [
                                    { required: false, message: '请输入监测单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入监测单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收结论">
                            {getFieldDecorator('check_conclusion', {
                                rules: [
                                    { required: false, message: '请输入验收结论' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入验收结论" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收日期" hasFeedback>
                            {getFieldDecorator('accept_date', {
                                rules: [
                                    { required: true, message: '请选择验收日期！' },
                                ]
                            }, {})(
                                <Input />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="验收表">
                    <a href={`${STATIC_DOWNLOAD_API}${this.props.check_chart[0].a_file}`}>{this.props.check_chart[0].name}</a>
                </FormItem>
                <FormItem {...formItemLayout} label="检测材料表" hasFeedback>
                {   
                    this.props.detect_chart &&
                    this.props.detect_chart.map((item,index) => {
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
        construction_org1:{
            value:props.construction_org.name
        },
        construction_per1:{
            value:props.construction_per.name
        },
        supervising_org1:{
            value:props.supervising_org.name
        },
        sub_contrator_per1:{
            value:props.sub_contrator_per ? props.sub_contrator_per.name : ''
        },
        sub_contrator_org1:{
            value:props.sub_contrator_org ? props.sub_contrator_org.name : ''
        },
        install_org1:{
            value: props.install_org ? props.install_org.name : ''
        },
        rent_org1:{
            value:props.rent_org ? props.rent_org.name : ''
        },
        check_org1:{
            value:props.check_org ? props.check_org.name : ''
        },
        ...dataTransform(props)

    }
}
})(AcceptanceDetail);
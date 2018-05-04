import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import {FILE_API,base, SOURCE_API, DATASOURCECODE,SERVICE_API,PROJECT_UNITS,SECTIONNAME,WORKFLOW_CODE } from '../../../_platform/api';
import { getUser } from '../../../_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchInfo extends Component {
    constructor(props) {
		super(props);
		this.state = {
            optionArray:[]
		};
	}
    static propType = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };

    async componentDidMount(){
        this.getSection()
     }
 
 
     async componentDidUpdate(prevProps, prevState){
         const {
             leftkeycode
         }=this.props
         //地块修改，则修改标段
         if(leftkeycode != prevProps.leftkeycode ){
             this.getSection()
         }
     }
 
     async getSection(){
         const{
             leftkeycode
         }=this.props
         console.log('leftkeycode',leftkeycode)
         let user = getUser()
         let optionArray = []
         let sections = user.sections
         sections = JSON.parse(sections)
         if(sections && sections instanceof Array && sections.length>0){
             let section = sections[0]
             let code = section.split('-')
             if(code && code.length === 3){
                 //获取当前标段的名字
                 SECTIONNAME.map((item)=>{
                     if(code[2] === item.code){
                         let currentSectionName = item.name
                         optionArray.push(<Option key={currentSectionName} value={currentSectionName}>{currentSectionName}</Option>)
                     }
                 })
             }
         }else{
             PROJECT_UNITS.map((project)=>{
                 if(leftkeycode === project.code){
                     let units = project.units
                     units.map(d =>  optionArray.push(<Option key={d.value} value={d.value}>{d.value}</Option>))
                 }
             })
         }
         this.setState({
             optionArray:optionArray
         })
     }

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props
        const{
            optionArray
        }=this.state

        return (
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='标段'>
                                    {
                                        getFieldDecorator('SSection', {
                                            rules: [
                                                { required: false, message: '请选择标段' }
                                            ]
                                        })
                                            (<Select placeholder='请选择标段' allowClear>
                                                  {optionArray}
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='名称'>
                                    {
                                        getFieldDecorator('SSafeName', {
                                            rules: [
                                                { required: false, message: '请输入名称' }
                                            ]
                                        })
                                            (<Input placeholder='请输入名称' />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='编号'>
                                    {
                                        getFieldDecorator('SNumbercode', {
                                            rules: [
                                                { required: false, message: '请输入编号' }
                                            ]
                                        })
                                            (<Input placeholder='请输入编号' />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='文档类型'>
                                    {
                                        getFieldDecorator('SDocument', {
                                            rules: [
                                                { required: false, message: '请选择文档类型' }
                                            ]
                                        })
                                        (<Select placeholder='请选择文档类型' >
                                            <Option key={'安全管理体系'} value={'安全管理体系'}>安全管理体系</Option>
                                            <Option key={'安全应急预案'} value={'安全应急预案'}>安全应急预案</Option>
                                            <Option key={'安全专项方案'} value={'安全专项方案'}>安全专项方案</Option>
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='日期'>
                                    {
                                        getFieldDecorator('SSimedate', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择日期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='YYYY-MM-DD'  style={{ width: '100%', height: '100%' }}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('SStatus', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型' allowClear>
                                                <Option key={'执行中'} value={'2'}>执行中</Option>
                                                <Option key={'已完成'} value={'3'}>已完成</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button type='Primary' onClick={this.query.bind(this)}>查询</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>清除</Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>

            </Form>
        )
    }

    query() {

        this.props.gettaskSchedule()

        // const{
		// 	actions:{
		// 		getTaskSafety
		// 	}
        // }=this.props
        // let reqData={};
        // this.props.form.validateFields((err, values) => {
		// 	console.log("安全体系报批流程", values);
        //     console.log("err", err);
            
        //     values.SSection?reqData.subject_sectionName__contains = values.SSection : '';
        //     values.SSafeName?reqData.subject_Safename__contains = values.SSafeName : '';
        //     values.SNumbercode?reqData.subject_numbercode__contains = values.SNumbercode : '';
        //     values.SDocument?reqData.subject_document__contains = values.SDocument : '';
        //     values.SSimedate?reqData.real_start_time_begin = moment(values.SSimedate[0]._d).format('YYYY-MM-DD 00:00:00') : '';
        //     values.SSimedate?reqData.real_start_time_end = moment(values.SSimedate[1]._d).format('YYYY-MM-DD 23:59:59') : '';
        //     values.SStatus?reqData.status = values.SStatus : (values.SStatus === 0? reqData.SStatus = 0 : '');
        // })
        // let tmpData = Object.assign({}, reqData);
		// getTaskSafety({code:WORKFLOW_CODE.安全体系报批流程},tmpData)
    }

    clear() {
        this.props.form.setFieldsValue({
            SSection: undefined,
            SSafeName: undefined,
            SNumbercode: undefined,
            SDocument: undefined,
            SSimedate: undefined,
            SStatus: undefined
        })
        this.props.gettaskSchedule()
    }
}

export default SearchInfo = Form.create()(SearchInfo);
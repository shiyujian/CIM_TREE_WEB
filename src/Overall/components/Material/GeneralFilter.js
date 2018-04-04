import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API, UNITS ,SECTIONNAME} from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,Tabs,DatePicker,Select
} from 'antd';
import { getUser } from '../../../_platform/auth';
import GeneralAddition from './GeneralAddition';
const FormItem = Form.Item;
const Search = Input.Search;
const TabPane=Tabs.TabPane;
const {RangePicker}=DatePicker;

export default class GeneralFilter extends Component {
    constructor(props) {
		super(props);
		this.state = {
            optionArray:[]
		};
	}
	static propTypes = {};

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
   };

    async componentDidMount(){
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
            UNITS.map(d =>  optionArray.push(<Option key={d.value} value={d.value}>{d.value}</Option>))
        }
        this.setState({
            optionArray:optionArray
        })
    }
	render() {
		const { 
			form: { getFieldDecorator }
        } = this.props;
        const{
            optionArray
        }=this.state
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row >
					<Col span={20}>
						<Row >
							<Col span={12}>
								<FormItem {...GeneralFilter.layout} label='标段'>
                                    {
                                        getFieldDecorator('ssection', {
                                            rules: [
                                                { required: false, message: '请选择标段' }
                                            ]
                                        })
                                        (<Select placeholder='请选择标段'>
                                            {optionArray}
                                        </Select>)
                                    }
                                </FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...GeneralFilter.layout} label='编号'>
                                    {
                                        getFieldDecorator('scode', {
                                            rules: [
                                                { required: false, message: '请输入编号' }
                                            ]
                                        })
                                            (<Input placeholder='请输入编号' />)
                                    }
                                </FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={12}>
                                <FormItem {...GeneralFilter.layout} label='日期'>
                                    {
                                        getFieldDecorator('stimedate', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择时期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='YYYY-MM-DD'  style={{ width: '100%', height: '100%' }} />)
                                    }
                                </FormItem>
                            </Col>
							<Col span={12}>
                                <FormItem {...GeneralFilter.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('sstatus', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型' allowClear>
                                                {/* <Option key={Math.random*4} value={0}>编辑中</Option> */}
                                                {/* <Option key={Math.random*5} value={1}>已提交</Option> */}
                                                <Option key={Math.random*6} value={2}>执行中</Option>
                                                <Option key={Math.random*7} value={3}>已完成</Option>
                                                {/* <Option key={Math.random*8} value={4}>已废止</Option> */}
                                                {/* <Option key={Math.random*9} value={5}>异常</Option> */}
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
		);
	}

	query() {
        this.props.gettaskSchedule()
    }

    clear() {
        this.props.form.setFieldsValue({
            ssection: undefined,
            scode: undefined,
            stimedate: undefined,
            sstatus: undefined
        })
    }
	cancel() {

	}

	
};

import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker,notification } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchInfo extends Component {
    static propType = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    constructor(props) {
        super(props);
        this.state = {
            littleBan: [],
            thinBan: [],
        };
    }
    componentWillReceiveProps(props){
        let littleBan = [];
        if(props.state.littleBan){
            for(let i=0;i<props.state.littleBan.length;i++){
                littleBan.push(<Option value={props.state.littleBan[i]} key={Math.random()}>{props.state.littleBan[i]}</Option>)
            }
            this.setState({littleBan})
        }
    }
    onSelectChange(value){
        let data = this.props.state.rst;
        let temp = data.filter(item =>{
            return item.SmallClass === value;
        })
        let thinBan = [];
        temp.map(item =>{
            thinBan.push(<Option value={item.ThinClass} key={Math.random()}>{item.ThinClass}</Option>)
        })
        this.setState({thinBan});
    }

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props.props;

        return (
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='小班'>
                                    {
                                        getFieldDecorator('littleban', {
                                        })
                                            (<Select placeholder='请选择小班' onChange={this.onSelectChange.bind(this)}>
                                                {this.state.littleBan}
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='细班'>
                                    {
                                        getFieldDecorator('thinban', {
                                        })
                                        (<Select placeholder='请选择细班'>
                                            {this.state.thinBan}
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='编号'>
                                    {
                                        getFieldDecorator('number', {
                                        })
                                            (<Input placeholder='请输入编号' />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem {...SearchInfo.layout} label='日期'>
                                    {
                                        getFieldDecorator('date', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择时期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='YYYY-MM-DD' allowClear={false}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem {...SearchInfo.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('status', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型'>
                                                <Option value={2}>执行中</Option>
                                                <Option value={3}>已完成</Option>
                                                <Option value={4}>已废止</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button type='primary' onClick={this.query.bind(this)}>查询</Button>
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
        let keycode = this.props.state.leftkeycode;
        let len = keycode.split('-').length;
        if(len === 6){
            this.props.doQuery();
        }else{
            notification.warning({
                message:'请选择分项工程',
                duration: 2
            })
        }
    }

    clear() {
        this.props.props.form.setFieldsValue({
            littleban: undefined,
            thinban: undefined,
            date: undefined,
            status: undefined,
            number: undefined
        })
    }
}

export default SearchInfo = Form.create()(SearchInfo);
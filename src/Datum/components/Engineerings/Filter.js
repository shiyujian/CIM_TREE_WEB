import React, { Component } from 'react';
import {
    Form, Input, Select, Button, DatePicker, Row, Col, message, Popconfirm
} from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import { getUser } from '../../../_platform/auth';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;

class Filter extends Component {
    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };


    static propTypes = {};
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                console.log(values)
            }
            console.log(values)
            
        });
    }

    // static layout = {
    //     labelCol: {span: 1},
    //     wrapperCol: {span: 23}
    // };

    render() {
        const { actions: { toggleAddition }, Doc = [] } = this.props;
        const {
			platform: { users = [] },
            form: { getFieldDecorator }
		} = this.props;
        return (
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label="单位工程">
                                    {
                                        getFieldDecorator('UnitEngineering', {
                                            rules: [
                                                { required: false, message: '请选择单位工程' },
                                            ]
                                        })
                                            (<Select>
                                                <Option value="0">编辑中</Option>
                                                <Option value="1">已提交</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label="主题">
                                    {
                                        getFieldDecorator('theme', {
                                            rules: [
                                                { required: false, message: '请输入主题' },
                                            ]
                                        })
                                            (<Input placeholder="请输入..." />)
                                    }
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <FormItem {...Filter.layout} label="编号">
                                    {
                                        getFieldDecorator('numbers', {
                                            rules: [
                                                { required: false, message: '请输入编号' },
                                            ]
                                        })
                                            (<Input />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label="文档类型">
                                    {
                                        getFieldDecorator('documentType', )
                                            (<Select>
                                                <Option value="0">编辑中</Option>
                                                <Option value="1">已提交</Option>
                                            </Select>)
                                    }

                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="时间"
                                    {...Filter.layout}
                                >
                                    <Col span={11}>
                                        <FormItem>
                                            <DatePicker />
                                        </FormItem>
                                    </Col>
                                    <Col span={2}>
                                        <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                            -
                              </span>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem>
                                            <DatePicker defaultvalue="" />
                                        </FormItem>
                                    </Col>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label="流程状态">
                                    {
                                        getFieldDecorator('processState', {
                                            rules: [
                                                { required: false, message: '请输入任务类别' },
                                            ]
                                        })
                                            (<Select>
                                                <Option value="0">编辑中</Option>
                                                <Option value="1">已提交</Option>
                                                <Option value="2">执行中</Option>
                                                <Option value="3">已完成</Option>
                                                <Option value="4">已废止</Option>
                                                <Option value="5">异常</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button
                                    onClick={this.query.bind(this)}>查询</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>清空</Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>



                <Row gutter={24}>
                    <Col span={24}>
                        <Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
                        {
                            (Doc.length === 0) ?
                                <Button style={{ marginRight: 10 }} disabled>删除</Button> :
                                <Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
                                    <Button style={{ marginRight: 10 }} type="primary" onClick={this.delete.bind(this)}>删除</Button>
                                </Popconfirm>
                        }
                    </Col>
                </Row>
            </Form>
        );
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
    query(e) {
        const {actions:{getdocument},currentcode} =this.props; 

        console.log('get',getdocument)
         this.props.form.validateFields(async (err, values) => {
            let conditions = {
                name: values.theme || "",
            }
            getdocument({code:currentcode.code},conditions);
        })
    }
    clear() {
        console.log(this.props.form)
        this.props.form.setFieldsValue({
            theme: undefined,
            UnitEngineering: undefined,
            numbers: undefined,
            documentType: undefined,
            processState: undefined,

        })
    }

    delete() {
        const { selected } = this.props;
        // if (selected.length === 0) {
        //     message.warning('请先选择要删除的文件！');
        //     return;
        // }
    }

    confirm() {
        const {
	        coded = [],
            selected = [],
            currentcode = {},
            actions: { deletedoc, getdocument }
	    } = this.props;
        if (selected === undefined || selected.length === 0) {
            message.warning('请先选择要删除的文件！');
            return;
        }
        selected.map(rst => {
            coded.push(rst.code);
        });
        let promises = coded.map(function (code) {
            return deletedoc({ code: code });
        });
        message.warning('删除文件中...');
        Promise.all(promises).then(() => {
            message.success('删除文件成功！');
            getdocument({ code: currentcode.code })
                .then(() => {
                });
        }).catch(() => {
            message.error('删除失败！');
            getdocument({ code: currentcode.code })
                .then(() => {
                });
        });
    }

    cancel() { }
};
export default Filter = Form.create()(Filter);
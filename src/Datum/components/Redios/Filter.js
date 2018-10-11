import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Popconfirm,
    DatePicker
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class Filter extends Component {
    static propTypes = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    render () {
        const {
            form: { getFieldDecorator },
            Doc = []
        } = this.props;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...Filter.layout} label='影像名称'>
                                    {getFieldDecorator('searchName', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入影像名称'
                                            }
                                        ]
                                    })(<Input placeholder='请输入影像名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...Filter.layout} label='拍摄日期'>
                                    {getFieldDecorator('searchDate', {
                                        rules: [
                                            {
                                                type: 'array',
                                                required: false,
                                                message: '请选择日期'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            size='default'
                                            format='YYYY-MM-DD'
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={5} offset={1}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Button
                                    type='Primary'
                                    onClick={this.query.bind(this)}
                                >
                                    查询
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button onClick={this.clear.bind(this)}>
                                    清除
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        {!this.props.isTreeSelected ? (
                            <Button style={{ marginRight: 10 }} disabled>
                                新增
                            </Button>
                        ) : (
                            <Button
                                style={{ marginRight: 10 }}
                                type='primary'
                                onClick={this.addVisible.bind(this)}
                            >
                                新增
                            </Button>
                        )}
                        {(Doc.length === 0 || !this.props.isTreeSelected) ? (
                            <Button
                                style={{ marginRight: 10 }}
                                disabled
                                type='danger'
                            >
                                删除
                            </Button>
                        ) : (
                            <Popconfirm
                                title='确定要删除文件吗？'
                                onConfirm={this.confirm.bind(this)}
                                okText='Yes'
                                cancelText='No'
                            >
                                <Button
                                    style={{ marginRight: 10 }}
                                    type='danger'
                                >
                                    删除
                                </Button>
                            </Popconfirm>
                        )}
                    </Col>
                </Row>
            </Form>
        );
    }

    addVisible () {
        const {
            actions: {
                toggleAddition
            }
        } = this.props;
        toggleAddition(true);
    }

    query () {
        const {
            actions: { searchRedioMessage, getSearchRedioVisible },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            let search = {};
            console.log('err', err);

            if (values.searchName) {
                search.searchName = values.searchName;
            }
            // moment的比较日期的方法不能判断同一天的   所以前后各加一天
            if (values.searchDate) {
                search.searchDate_begin = moment(values.searchDate[0]._d)
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD');
                search.searchDate_end = moment(values.searchDate[1]._d)
                    .add(1, 'days')
                    .format('YYYY-MM-DD');
            }

            let postData = Object.assign({}, search);
            searchRedioMessage(postData);
            getSearchRedioVisible(true);
        });
    }
    clear () {
        const {
            actions: { searchRedioMessage }
        } = this.props;
        this.props.form.setFieldsValue({
            searchName: undefined,
            searchDate: undefined
        });
        searchRedioMessage({});
    }

    confirm () {
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
        Promise.all(promises)
            .then(() => {
                message.success('删除文件成功！');
                getdocument({ code: currentcode.code }).then(() => {});
            })
            .catch(() => {
                message.error('删除失败！');
                getdocument({ code: currentcode.code }).then(() => {});
            });
    }
}
export default Form.create()(Filter);

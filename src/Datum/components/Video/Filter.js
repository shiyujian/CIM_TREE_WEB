import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Popconfirm,
    DatePicker,
    Select
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
export const Datumcode = window.DeathCode.DATUM_VIDEO;

class Filter extends Component {
    static propTypes = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    render () {
        const {
            form: { getFieldDecorator },
            selected = []
        } = this.props;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={10}>
                                <FormItem {...Filter.layout} label='视频名称'>
                                    {getFieldDecorator('searchName', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入视频名称'
                                            }
                                        ]
                                    })(<Input placeholder='请输入视频名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={14} />
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
                        <Button
                            style={{ marginRight: 10 }}
                            type='primary'
                            onClick={this.addVisible.bind(this)}
                        >
                            新增
                        </Button>
                        {selected.length === 0 ? (
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
                                onCancel={this.cancel.bind(this)}
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
            actions: { searchVideoMessage, searchVideoVisible },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            let search = {};
            console.log('err', err);
            if (values.searchName) {
                search.searchName = values.searchName;
            }
            let postData = Object.assign({}, search);
            searchVideoMessage(postData);
            searchVideoVisible(true);
        });
    }
    clear () {
        const {
            actions: { searchVideoMessage, searchVideoVisible }
        } = this.props;
        this.props.form.setFieldsValue({
            searchName: undefined
        });
        searchVideoMessage();
        searchVideoVisible(true);
    }
    cancel () {}

    confirm () {
        const {
            selected = [],
            actions: {
                deleteForsetVideo,
                searchVideoMessage,
                searchVideoVisible,
                selectDocuments,
                selectTableRowKeys
            }
        } = this.props;
        if (selected === undefined || selected.length === 0) {
            message.warning('请先选择要删除的文件！');
            return;
        }
        let IDList = [];
        selected.map(rst => {
            IDList.push(rst.ID);
        });
        let promises = IDList.map(function (id) {
            return deleteForsetVideo({ ID: id });
        });
        message.warning('删除文件中...');
        Promise.all(promises)
            .then(() => {
                message.success('删除文件成功！');
                searchVideoMessage();
                searchVideoVisible(true);
                selectDocuments([]);
                selectTableRowKeys([]);
            })
            .catch(() => {
                message.error('删除失败！');
                searchVideoMessage();
                searchVideoVisible(true);
                selectDocuments([]);
                selectTableRowKeys([]);
            });
    }
}
export default Form.create()(Filter);

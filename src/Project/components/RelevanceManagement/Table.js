import React, { Component } from 'react';
import moment from 'moment';
import { Input, Select, Table, Modal, Form, message } from 'antd';
import { getUser, formItemLayout } from '_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            visible: false,
            record: {}
        };
        this.Checker = '';
        this.toSearch = this.toSearch.bind(this); // 查询
        this.handleCancel = this.handleCancel.bind(this); // 取消
        this.handleOk = this.handleOk.bind(this); // 审核
    }
    componentDidMount () {
        this.toSearch();
        this.Checker = getUser().id; // 登陆用户
    }
    columns = [
        {
            title: '供应商',
            dataIndex: 'SupplierName',
            key: '1'
        }, {
            title: '苗圃基地',
            dataIndex: 'NurseryName',
            key: '2'
        }, {
            title: '审核人',
            dataIndex: 'Checker',
            key: '3'
        }, {
            title: '审核信息',
            dataIndex: 'CheckInfo',
            key: '4'
        }, {
            title: '审核状态',
            dataIndex: 'CheckStatus',
            key: '5',
            render: (text) => {
                return text === 0 ? '未审核' : '已审核';
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: '6',
            render: (text, record) => {
                if (record.CheckStatus === 0) {
                    return <a onClick={this.toCheck.bind(this, record)}>审核</a>;
                }
            }
        }
    ]
    render () {
        const { dataList, visible } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='relevance-table'>
                <Table columns={this.columns} bordered
                    dataSource={dataList}
                    pagination={false}
                    rowKey='ID'
                />
                <Modal title='审核' visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='审核结果'
                        >
                            {getFieldDecorator('CheckStatus', {
                                rules: [{required: true, message: '必填项'}]
                            })(
                                <Select style={{ width: 150 }} allowClear>
                                    <Option value={1}>审核通过</Option>
                                    <Option value={2}>审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='审核备注'
                        >
                            {getFieldDecorator('CheckInfo', {
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    toSearch () {
        const { getNb2ss } = this.props.actions;
        getNb2ss().then(rep => {
            this.setState({
                dataList: rep
            });
        });
    }
    toCheck (record, e) {
        e.preventDefault();
        this.setState({
            visible: true,
            record
        });
    }
    handleCancel () {
        this.setState({
            visible: false
        });
    }
    handleOk () {
        const { checknb2s } = this.props.actions;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { id } = getUser();
            const param = {
                ID: this.state.record.ID,
                Checker: id,
                CheckStatus: values.CheckStatus,
                CheckInfo: values.CheckInfo,
                CheckTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            checknb2s({}, param).then((rep) => {
                console.log(rep);
                if (rep.code === 1) {
                    message.success('审核成功');
                    this.handleCancel();
                }
            });
        });
    }
}

export default Form.create()(Tablelevel);

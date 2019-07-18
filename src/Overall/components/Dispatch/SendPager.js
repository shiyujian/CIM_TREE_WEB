import React, { Component } from 'react';
import {
    Table,
    Tabs,
    Button,
    Row,
    Col,
    message,
    Modal,
    Popconfirm,
    Select,
    Input,
    Form,
    DatePicker
} from 'antd';
import { getUser } from '_platform/auth';
import moment from 'moment';
import ToggleModal from './ToggleModal';
import { STATIC_DOWNLOAD_API } from '_platform/api';
import 'Datum/components/Datum/index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class SendPage1 extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            showInfo: {},
            viewClickinfo: {},
            searchList: [],
            isUpdate: false
        };
    }

    _deleteClick (_id) {
        const {
            actions: { deleteSentDocAc, getSentInfoAc }
        } = this.props;
        const user = getUser();

        let orgCode = user.org;

        let orgListCodes = orgCode.split('_');
        orgListCodes.pop();
        let codeu = orgListCodes.join();
        let ucode = codeu.replace(/,/g, '_');
        if (user.username === 'admin') {
            deleteSentDocAc({
                id: _id,
                user: encodeURIComponent('admin')
            }).then(() => {
                message.success('删除发文成功！');
                getSentInfoAc({
                    user: encodeURIComponent('admin')
                });
            });
        } else {
            deleteSentDocAc({ id: _id, user: encodeURIComponent(ucode) }).then(
                () => {
                    message.success('删除发文成功！');
                    getSentInfoAc({
                        user: encodeURIComponent(ucode)
                    });
                }
            );
        }
    }
    _sentDoc () {
        const {
            actions: { toggleModalAc }
        } = this.props;
        toggleModalAc({
            type: 'NEWS',
            status: 'ADD',
            visible: true,
            editData: null
        });
    }
    handleCancel () {
        this.setState({
            visible: false,
            container: null
        });
    }
    // 清除
    clear () {
        this.props.form.setFieldsValue({
            title1: undefined,
            orgLists1: undefined,
            worktimes1: undefined,
            ccLists1: undefined
        });
        this.query();
    }
    // 查找
    query () {
        const {
            sendInfo = {}
        } = this.props;
        const { notifications = [] } = sendInfo;
        let searchList = [];
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            notifications.map(item => {
                let isName = false;
                let isRoles = false;
                let isTitle = false;
                let iscc = false;
                if (!values.orgLists1) {
                    isName = true;
                } else {
                    if (
                        values.orgLists1 &&
                        item.to_whom_s.indexOf(values.orgLists1) > -1
                    ) {
                        isName = true;
                    }
                }
                if (!values.ccLists1) {
                    iscc = true;
                } else {
                    if (item.cc_whom_s) {
                        if (
                            values.ccLists1 &&
                            item.cc_whom_s.indexOf(values.ccLists1) > -1
                        ) {
                            iscc = true;
                        }
                    }
                }

                if (!values.title1) {
                    isTitle = true;
                } else {
                    if (
                        values.title1 &&
                        item.notification_title.indexOf(values.title1) > -1
                    ) {
                        isTitle = true;
                    }
                }

                if (!values.worktimes1) {
                    isRoles = true;
                } else {
                    const create_time = moment(item.create_time)
                        .utc()
                        .utcOffset(+8)
                        .format('YYYY-MM-DD');
                    const worktimea1 = moment(values.worktimes1[0]).format(
                        'YYYY-MM-DD'
                    );
                    const worktimea2 = moment(values.worktimes1[1]).format(
                        'YYYY-MM-DD'
                    );
                    if (
                        moment(create_time).isBetween(worktimea1, worktimea2) ||
                        moment(create_time).isSame(worktimea1) ||
                        moment(create_time).isSame(worktimea2)
                    ) {
                        isRoles = true;
                    }
                }
                if (isName && isTitle && isRoles && iscc) {
                    searchList.push(item);
                }
            });
            this.setState({
                searchList: searchList,
                isUpdate: true
            });
        });
    }
    render () {
        const rowSelection = {
            // selectedRowKeys,
            onChange: this.onSelectChange
        };
        const {
            sendInfo = {},
            form: { getFieldDecorator },
            toggleData: toggleData = {
                type: 'NEWS',
                visible: false
            }
        } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let orgto_whom = [];
        let orgcc_whom = [];
        const { notifications = [] } = sendInfo;
        notifications.map(ese => {
            orgto_whom.push(ese.to_whom_s);
            if (ese.cc_whom_s) {
                orgcc_whom.push(ese.cc_whom_s);
            }
        });

        const { showInfo = {}, searchList } = this.state;
        const { notification = {} } = showInfo;
        let dataSource;
        if (this.state.isUpdate) {
            dataSource = searchList;
        } else {
            dataSource = notifications;
        }
        const orgto_whoms = Array.from(new Set(orgto_whom));
        const orgcc_whoms = Array.from(new Set(orgcc_whom));
        return (
            <Row>
                <Col span={22} offset={1}>
                    <Row>
                        <Col span={18}>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label='名称'>
                                        {getFieldDecorator('title1', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入名称'
                                                }
                                            ],
                                            initialValue: ''
                                        })(<Input type='text' />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='接收单位'
                                    >
                                        {getFieldDecorator('orgLists1', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入接收单位'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Select style={{ width: '100%' }}>
                                                {orgto_whoms.map(es => {
                                                    return (
                                                        <Option key={es}>
                                                            {es}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='抄送单位'
                                    >
                                        {getFieldDecorator('ccLists1', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入抄送单位'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Select style={{ width: '100%' }}>
                                                {orgcc_whoms.map(es => {
                                                    return (
                                                        <Option key={es}>
                                                            {es}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='发送时间'
                                    >
                                        {getFieldDecorator('worktimes1', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '发送时间'
                                                }
                                            ]
                                        })(
                                            <RangePicker
                                                style={{
                                                    verticalAlign: 'middle',
                                                    width: '98%'
                                                }}
                                                // defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
                                                showTime={{
                                                    format: 'HH:mm:ss'
                                                }}
                                                format={'YYYY/MM/DD HH:mm:ss'}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            style={{ paddingLeft: '50px' }}
                            span={4}
                            offset={1}
                        >
                            <Row
                                style={{
                                    marginTop: '-50px',
                                    marginLeft: '80%'
                                }}
                                span={8}
                            >
                                <Button
                                    type='primary'
                                    onClick={this._sentDoc.bind(this)}
                                >
                                    发文
                                </Button>
                            </Row>
                            <Row style={{ marginTop: '23px' }} span={8}>
                                <FormItem>
                                    <Button
                                        icon='search'
                                        onClick={this.query.bind(this)}
                                    >
                                        查找
                                    </Button>
                                </FormItem>
                            </Row>
                            <Row span={8}>
                                <FormItem>
                                    <Button
                                        icon='reload'
                                        onClick={this.clear.bind(this)}
                                    >
                                        清除
                                    </Button>
                                </FormItem>
                            </Row>
                        </Col>
                    </Row>
                    {/* <Row>
						<Col offset={22}>
							<Button type="primary" onClick={this._sentDoc.bind(this)}>发文</Button>
						</Col>
					</Row> */}
                    <Table
                        dataSource={this._getNewArrFunc(dataSource)}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        title={() => '发文查询'}
                        className='foresttables'
                        bordered
                        rowKey='_id'
                        // style={{marginTop:10}}
                    />
                </Col>
                {toggleData.visible &&
                    toggleData.type === 'NEWS' && (
                    <ToggleModal {...this.props} />
                )}
                <Modal
                    title='查看详情'
                    width='70%'
                    style={{ padding: '0 20px' }}
                    visible={this.state.visible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    closable={false}
                    maskClosable={false}
                    // footer={null}
                >
                    {notification.title && (
                        <Row style={{ padding: '0 80px', minHeight: '300px' }}>
                            <Col
                                span={24}
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <h1>{notification.title}</h1>
                            </Col>
                            <Row style={{ marginBottom: '20px' }}>
                                <Col span={24}>
                                    <h3 style={{ marginTop: '20px' }}>
                                        接受单位：
                                        {this.state.viewClickinfo.to_whom_s}
                                    </h3>
                                    <h3 style={{ marginTop: '20px' }}>
                                        抄送单位：
                                        {this.state.viewClickinfo.cc_whom_s}
                                    </h3>
                                    <h3 style={{ marginTop: '20px' }}>
                                        发送时间：
                                        {moment(notification.create_time)
                                            .utc()
                                            .utcOffset(+8)
                                            .format('YYYY-MM-DD HH:mm:ss')}
                                    </h3>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '20px' }}>
                                <Col span={2}>
                                    <h3>正文</h3>
                                </Col>
                                <Col span={22}>
                                    <div
                                        style={{
                                            maxHeight: '800px',
                                            minHeight: '50px',
                                            overflow: 'auto',
                                            border: '1px solid #ccc',
                                            padding: '10px'
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: notification.body_rich
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Col span={4}>
                                    <h3 style={{ width: '100%' }}>附件：</h3>
                                </Col>
                                <Col span={20}>
                                    {notification.fixed_external_attachments
                                        .length > 0 && (
                                        <a
                                            href={
                                                STATIC_DOWNLOAD_API +
                                                notification
                                                    .fixed_external_attachments[0]
                                                    .file_partial_url
                                            }
                                            target='_bank'
                                        >
                                            {
                                                notification
                                                    .fixed_external_attachments[0]
                                                    .file_name
                                            }
                                        </a>
                                    )}
                                </Col>
                                {/* <h3>附件：</h3>
								{
									notification.fixed_external_attachments.length > 0 &&
									<a href={STATIC_DOWNLOAD_API + notification.fixed_external_attachments[0].file_partial_url}
										target="_bank">{notification.fixed_external_attachments[0].file_name}</a>
								} */}
                            </Col>
                            {/* <Col span={6} offset={18}>
								<Button onClick={this._handleCancel.bind(this)}>退出</Button>
							</Col> */}
                        </Row>
                    )}
                </Modal>
            </Row>
        );
    }
    _getText (arr = []) {
        let text = '';
        arr.map(org => {
            text = text + org + '、';
        });
        if (text !== '') {
            text = text.slice(0, text.length - 1);
        }
        return text;
    }
    _getNewArrFunc (list = []) {
        let arr = list;
        list.map((itm, index) => {
            itm.index = index + 1;
        });
        return arr;
    }
    // 查看信息详情
    _viewClick (id, record) {
        //	获取详情
        const {
            actions: { getSendDetailAc }
        } = this.props;
        this.setState({
            visible: true,
            viewClickinfo: record
        });
        let orgCode = getUser().org;

        let orgListCodes = orgCode.split('_');
        const user = getUser();

        orgListCodes.pop();
        let codeu = orgListCodes.join();
        let ucode = codeu.replace(/,/g, '_');
        if (user.username === 'admin') {
            getSendDetailAc({
                id: id,
                user: encodeURIComponent('admin')
            }).then(rst => {
                this.setState({
                    showInfo: rst
                });
            });
        } else {
            getSendDetailAc({
                id: id,
                user: encodeURIComponent(ucode)
            }).then(rst => {
                this.setState({
                    showInfo: rst
                });
            });
        }
    }
    _handleCancel () {
        this.setState({
            visible: false,
            showInfo: {}
        });
    }
    confirms () {
        const user = getUser();
        if (user.username === 'admin') {
            return <a>删除</a>;
        } else {
            return [];
        }
    }
    columns = [
        // {
        // 	title: 'ID',
        // 	dataIndex: '_id',
        // },
        {
            title: 'ID',
            dataIndex: 'index'
        },
        {
            title: '名称',
            dataIndex: 'notification_title'
        },
        {
            title: '接收单位',
            dataIndex: 'to_whom_s'
        },
        {
            title: '抄送单位',
            dataIndex: 'cc_whom_s'
        },
        {
            title: '发送时间',
            dataIndex: 'create_time',
            render: create_time => {
                return moment(create_time)
                    .utc()
                    .utcOffset(+8)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '操作',
            render: record => {
                return (
                    <div>
                        <a
                            style={{ marginRight: '10px' }}
                            onClick={this._viewClick.bind(
                                this,
                                record._id,
                                record
                            )}
                        >
                            查看
                        </a>
                        {/* <Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定" cancelText="取消">
							<a>删除</a>
						</Popconfirm> */}
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this._deleteClick.bind(this, record._id)}
                            okText='确定'
                            cancelText='取消'
                        >
                            {/* <a>删除</a> */}
                            {this.confirms()}
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
}
export default Form.create()(SendPage1);

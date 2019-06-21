import React, { Component } from 'react';
// import { Table, Tabs, Button, Row, Col, message, Modal, Popconfirm } from 'antd';
import {
    Table,
    Tabs,
    Button,
    Row,
    Col,
    Modal,
    message,
    Popconfirm,
    Form,
    Input,
    DatePicker,
    Icon,
    Select,
    TreeSelect
} from 'antd';
import moment from 'moment';
import ToggleModal from './ToggleModal';
import { getUser } from '_platform/auth';
import { STATIC_DOWNLOAD_API } from '_platform/api';
import 'Datum/components/Datum/index.less';
const { TextArea } = Input;

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class ReceivePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            showInfo: {},
            code_id: '',
            searchList: [],
            isUpdate: false,
            datas: [],
            _viewClickinfo: {}
        };
    }

    // 删除
    _deleteClick (_id) {
        const {
            actions: { deleteReceiveDocAc, getReceiveInfoAc }
        } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let orgCode = getUser().org_code;

        let orgListCodes = orgCode.split('_');
        orgListCodes.pop();
        let codeu = orgListCodes.join();
        let ucode = codeu.replace(/,/g, '_');
        deleteReceiveDocAc({ id: _id, user: encodeURIComponent(ucode) }).then(
            () => {
                message.success('删除收文成功！');
                if (user.is_superuser) {
                    getReceiveInfoAc({
                        user: encodeURIComponent('admin')
                    });
                } else {
                    getReceiveInfoAc({
                        user: encodeURIComponent(ucode)
                    });
                }
            }
        );
    }

    // 查看信息详情
    _viewClick (id, record) {
        this.setState({ code_id: id });
        let orgCode = getUser().org_code;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let orgListCodes = orgCode.split('_');
        orgListCodes.pop();
        let codeu = orgListCodes.join();
        let ucode = codeu.replace(/,/g, '_');

        //	获取详情
        const {
            actions: { getReceiveDetailAc }
        } = this.props;
        this.setState({
            visible: true,
            _viewClickinfo: record
        });
        if (user.is_superuser) {
            getReceiveDetailAc({
                id: id,
                user: encodeURIComponent('admin')
            }).then(rst => {
                this.setState({
                    showInfo: rst
                });
            });
        } else {
            getReceiveDetailAc({
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

    _haveView (id) {
        const {
            actions: { patchReceiveDetailAc, getReceiveInfoAc }
        } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        patchReceiveDetailAc(
            {
                id: id,
                user: encodeURIComponent(getUser().org)
            },
            {
                is_read: true
            }
        ).then(rst => {
            if (rst._id) {
                message.success('已设置已阅！');
                if (user.is_superuser) {
                    getReceiveInfoAc({
                        user: encodeURIComponent('admin')
                    });
                } else {
                    getReceiveInfoAc({
                        user: encodeURIComponent(getUser().org)
                    });
                }
                this._handleCancel();
            }
        });
    }

    // 清除
    clear () {
        this.props.form.setFieldsValue({
            // mold: undefined,
            title: undefined,
            // orgList: undefined,
            orgLists: undefined,
            // numbers: undefined,
            worktimes: undefined
        });
        this.query();
    }
    // 查找
    query () {
        const {
            receiveInfo = {}
        } = this.props;
        const { notifications = [] } = receiveInfo;

        // const user = getUser();
        let searchList = [];
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            notifications.map(item => {
                let isName = false;
                let isRoles = false;
                let isTitle = false;
                if (!values.orgLists) {
                    isName = true;
                } else {
                    if (
                        values.orgLists &&
                        item.to_whom_name.indexOf(values.orgLists) > -1
                    ) {
                        isName = true;
                    }
                }

                if (!values.title) {
                    isTitle = true;
                } else {
                    if (
                        values.title &&
                        item.notification_title.indexOf(values.title) > -1
                    ) {
                        isTitle = true;
                    }
                }

                if (!values.worktimes) {
                    isRoles = true;
                } else {
                    const create_time = moment(item.create_time)
                        .utc()
                        .utcOffset(+8)
                        .format('YYYY-MM-DD');
                    const worktimes1 = moment(values.worktimes[0]).format(
                        'YYYY-MM-DD'
                    );
                    const worktimes2 = moment(values.worktimes[1]).format(
                        'YYYY-MM-DD'
                    );
                    if (
                        moment(create_time).isBetween(worktimes1, worktimes2) ||
                        moment(create_time).isSame(worktimes1) ||
                        moment(create_time).isSame(worktimes2)
                    ) {
                        isRoles = true;
                    }
                }
                if (isName && isTitle && isRoles) {
                    searchList.push(item);
                }
            });
            this.setState({
                searchList: searchList,
                isUpdate: true
            });
        });
    }

    handleCancel () {
        this.setState({
            visible: false,
            container: null
        });
    }

    // 回文弹出框
    _sentDoc (record) {
        const {
            actions: { toggleModalAc, setDocInfo }
        } = this.props;
        toggleModalAc({
            type: 'NEWS',
            status: 'EDIT',
            visible: true,
            editData: null
        });
    }

    render () {
        const {
            receiveInfo = {},
            form: { getFieldDecorator },
            toggleData: toggleData = {
                type: 'NEWS',
                visible: false
            }
        } = this.props;
        const { showInfo = {}, searchList } = this.state;
        const { notification = {}, is_read = false, _id = '' } = showInfo;
        const { notifications = [] } = receiveInfo;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let orgworm = [];
        notifications.map(ese => {
            orgworm.push(ese.to_whom_name);
        });
        let dataSource;
        if (this.state.isUpdate) {
            dataSource = searchList;
        } else {
            dataSource = notifications;
        }
        const orgworms = Array.from(new Set(orgworm));
        return (
            <Row>
                <Col span={22} offset={1}>
                    <Row>
                        <Col span={18}>
                            <Row>
                                {/* <Col span={8}>
									<FormItem {...formItemLayout} label="文件类型">
										{getFieldDecorator('mold', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(<Select style={{ width: '100%' }}>
											<Option value="申请">删除申请</Option>
											<Option value="工作联系单">工作联系单</Option>
											<Option value="监理通知">监理通知</Option>
										</Select>)}
									</FormItem>
								</Col> */}
                                {/* <Col span={8}>
									<FormItem {...formItemLayout} label="名称">
										{getFieldDecorator('title', {
											rules: [{ required: false, message: '请输入名称' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col> */}
                                {/* <Col span={8} >
									<FormItem {...formItemLayout} label="工程名称">
										{getFieldDecorator('orgList', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col> */}
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='名称'>
                                        {getFieldDecorator('title', {
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
                                <Col span={8}>
                                    {/* <FormItem {...formItemLayout} label="来文单位">
										{getFieldDecorator('orgLists', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem> */}
                                    <FormItem
                                        {...formItemLayout}
                                        label='来文单位'
                                    >
                                        {getFieldDecorator('orgLists', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入文件标题'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Select style={{ width: '100%' }}>
                                                {orgworms.map(es => {
                                                    return (
                                                        <Option
                                                            key={es}
                                                            value={es}
                                                        >
                                                            {es}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>

                                {/* <Col span={8}>
									<FormItem {...formItemLayout} label="编号">
										{getFieldDecorator('numbers', {
											rules: [{ required: false, message: '请输入编号' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col> */}
                                <Col span={8}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='收文日期'
                                    >
                                        {getFieldDecorator('worktimes', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择日期'
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
                        <Col span={4} offset={1}>
                            <Col span={12}>
                                <FormItem>
                                    <Button
                                        icon='search'
                                        onClick={this.query.bind(this)}
                                    >
                                        查找
                                    </Button>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <Button
                                        icon='reload'
                                        onClick={this.clear.bind(this)}
                                    >
                                        清除
                                    </Button>
                                </FormItem>
                            </Col>
                        </Col>
                    </Row>
                    {toggleData.visible &&
                        toggleData.type === 'NEWS' && (
                        <ToggleModal {...this.props} />
                    )}
                    <Table
                        dataSource={this._getNewArrFunc(dataSource)}
                        columns={this.columns}
                        title={() => '收文查询'}
                        className='foresttables'
                        bordered
                    />
                </Col>
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
                                    <h2 style={{ marginTop: '20px' }}>
                                        来文单位：
                                        {this.state._viewClickinfo.to_whom_name}
                                    </h2>
                                    <h2 style={{ marginTop: '20px' }}>
                                        发送时间：
                                        {moment(notification.create_time)
                                            .utc()
                                            .utcOffset(+8)
                                            .format('YYYY-MM-DD HH:mm:ss')}
                                    </h2>
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
                                            // width:'80%'
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: notification.body_rich
                                        }}
                                    />
                                    {/* <TextArea style={{ minWidth: '100%', minHeight: '50px' }} defaultValue={notification.body_rich}></TextArea> */}
                                    {/* <Input
										type="textarea"
										placeholder=""
										autosize
										value={notification.body_rich}

									></Input> */}
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
								!is_read &&
								<Button type="primary" onClick={this._haveView.bind(this, _id)}>已阅</Button>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<Button onClick={this._handleCancel.bind(this)}>退出</Button>
							</Col> */}
                        </Row>
                    )}
                </Modal>
            </Row>
        );
    }
    _getNewArrFunc (list = []) {
        let arr = list;
        list.map((itm, index) => {
            itm.index = index + 1;
        });
        return arr;
    }
    // columns = [
    // 	{
    // 		title: 'ID',
    // 		dataIndex: 'index',
    // 	}, {
    // 		title: '标题',
    // 		dataIndex: 'notification_title',
    // 	}, {
    // 		title: '来文单位',
    // 		dataIndex: 'from_whom'
    // 	},
    // 	/* {
    // 		title: '状态',
    // 		dataIndex: 'is_read',
    // 		render: is_read => {
    // 			return (is_read === false) ? "未阅" : "已阅";
    // 		}
    // 	}, */
    // 	{
    // 		title: '发送时间',
    // 		dataIndex: 'create_time',
    // 		render: create_time => {
    // 			return moment(create_time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
    // 		}
    // 	}, {
    // 		title: '操作',
    // 		render: record => {
    // 			return (
    // 				<span>
    // 					<Button onClick={this._viewClick.bind(this, record._id)}>查看</Button>
    // 					<Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定"
    // 								cancelText="取消">
    // 						<Button type="danger">删除</Button>
    // 					</Popconfirm>
    // 				</span>
    // 			)
    // 		},
    // 	}
    // ];
    confirms () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (user.is_superuser == true) {
            return <a>删除</a>;
        } else {
            return [];
        }
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        },
        // ,{
        // 	title: '文件类型',
        // 	dataIndex: 'doc_type',
        // 	key: 'doc_type'
        // }
        {
            title: '名称',
            dataIndex: 'notification_title',
            key: 'notification_title'
        },
        // , {
        // 	title: '工程名称',
        // 	dataIndex: 'project_name',
        // 	key: 'project_name'
        // }
        // ,{
        // 	title: '编号',
        // 	dataIndex: 'number',
        // 	key: 'number'
        // }
        {
            title: '来文单位',
            dataIndex: 'to_whom_name',
            key: 'to_whom_name'
        },
        {
            title: '收文日期',
            // dataIndex: 'create_time',
            // key: 'create_time'
            sorter: (a, b) => moment(a.create_time) - moment(b.create_time),
            render: notification => {
                return moment(notification.create_time)
                    .utc()
                    .utcOffset(+8)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '操作',
            render: record => {
                return (
                    <span>
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
                        {/* &nbsp;&nbsp;|&nbsp;&nbsp; */}
                        <a
                            style={{ marginRight: '10px' }}
                            onClick={this._sentDoc.bind(this, record)}
                        >
                            回文
                        </a>
                        {/* &nbsp;&nbsp;|&nbsp;&nbsp; */}
                        {/* <a onClick={this._download.bind(this)}>下载</a> */}
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this._deleteClick.bind(this, record._id)}
                            okText='确定'
                            cancelText='取消'
                        >
                            {/* <a >删除</a> */}
                            {this.confirms()}
                        </Popconfirm>
                    </span>
                );
            }
        }
    ];
}
export default Form.create()(ReceivePage);

import React, { Component } from 'react';
import {
    Table,
    Tabs,
    Button,
    Row,
    Col,
    Modal,
    Notification,
    Popconfirm,
    Form,
    Input,
    DatePicker,
    Divider,
    Select
} from 'antd';
import NoticeAddModal from './NoticeAddModal';
import NoticeEditModal from './NoticeEditModal';
import moment from 'moment';
import './index.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
class NoticeTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            noticeID: '', // 通知ID
            noticeTitle: '', // 通知名称
            noticeContent: '', // 通知内容
            detailDegree: '', // 紧急程度
            fileList: [], // 附件列表
            tipsTabValue: 'publish',
            editNoticeVisible: false,
            addNoticeVisible: false,
            record: '',
            detailVisible: false
        };
    }

    componentDidMount () {
        const {
            actions: { getNoticetypes, getNoticeList }
        } = this.props;
        // getNoticetypes({}, {});
        getNoticeList({}, {
            type: '',
            name: '',
            sdate: '',
            edate: '',
            page: '',
            size: ''
        });
    }
  
    // 查看通知
    handleNoticeView = async (ID) => {
        console.log(ID, '通知ID');
        const { getNoticeDetails } = this.props.actions;
        getNoticeDetails({
            ID
        }).then(rep => {
            let detailDegree = '';
            if (rep && rep.Notice_Type) {
                if (rep.Notice_Type === 1) {
                    detailDegree = '加急';
                } else if (rep.Notice_Type === 2) {
                    detailDegree = '特急';
                }
            } else if (rep.Notice_Type === 0) {
                detailDegree = '平件';
            }
            console.log('查看显示', rep);
            this.setState({
                detailVisible: true,
                fileList: rep.Files,
                noticeTitle: rep.Notice_Title,
                noticeContent: rep.Notice_Content,
                detailDegree
            });
        });
    }
    handleCancel = async () => {
        this.setState({
            detailVisible: false,
            detailDegree: ''
        });
    }
    // 编辑通知
    handleNoticeEdit = async (ID) => {
        console.log(ID);
        this.setState({
            editNoticeVisible: true,
            noticeID: ID
        });
    }
    handleNoticeEditModalCancel = async () => {
        this.setState({
            editNoticeVisible: false
        });
    }
    // 删除通知
    handleNoticeDelete = async (ID) => {
        const {
            actions: {
                deleteNotice
            }
        } = this.props;
        console.log('删除ID', ID);
        console.log('删除ID', typeof ID);
        deleteNotice({ID}, {}).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除通知成功！',
                    duration: 3
                });
                this.queryPublish();
            } else {
                Notification.error({
                    message: '删除通知失败！',
                    duration: 3
                });
            }
        });
    }
    // 发布通知
    handleNoticePublish = async (record) => {
        const {
            actions: {
                getTipsList,
                getDraftTipsList,
                patchData
            }
        } = this.props;
        let newData = {
            update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_draft: false
        };
        let rst = await patchData({ pk: record.id }, newData);
        if (rst.id) {
            Notification.success({
                message: '重新发布通知成功！',
                duration: 3
            });
            // 更新暂存的通知列表数据
            getTipsList({}, {
                tag: '公告',
                is_draft: false
            });
            getDraftTipsList({}, {
                tag: '公告',
                is_draft: true
            });
        }
    }
    // 发布的通知查询
    queryPublish () {
        const {
            actions: { getNoticeList }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(123, values, values.degree);
                let sdate = '', edate = '';
                if (values.worktime && values.worktime.length) {
                    sdate = moment(values.worktime[0]).format('YYYY-MM-DD');
                    edate = moment(values.worktime[1]).format('YYYY-MM-DD');
                }
                getNoticeList({}, {
                    type: values.degree || '',
                    name: values.theme || '',
                    sdate,
                    edate,
                    page: '',
                    size: ''
                });
            }
        });
    }
    // 清除
    clearPublish () {
        this.props.form.setFieldsValue({
            theme: '',
            worktime: '',
            degree: ''
        });
        this.queryPublish();
    }

    clearTemporary () {
        this.props.form.setFieldsValue({
            titles: undefined,
            worktimes: undefined,
            degrees: undefined
        });
    }
    // 通知列表和暂存的通知列表切换
    subTabChange (tipsTabValue) {
        this.setState({
            tipsTabValue
        });
    }
    // 发布新通知
    handlePublishNotice () {
        this.setState({
            addNoticeVisible: true
        });
    }
    handlePublishNoticeModalCancel = async () => {
        this.setState({
            addNoticeVisible: false
        });
    }

    render () {
        const {
            tipsList = [],
            draftTipsList = [],
            form: { getFieldDecorator }
        } = this.props;
        console.log('公告列表', tipsList);
        const {
            fileList,
            tipsTabValue,
            editNoticeVisible,
            addNoticeVisible,
            noticeTitle,
            detailDegree,
            noticeContent
        } = this.state;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Row>
                {
                    editNoticeVisible
                        ? <NoticeEditModal
                            {...this.props}
                            {...this.state}
                            handleNoticeEditModalCancel={this.handleNoticeEditModalCancel.bind(this)}
                        /> : ''
                }
                {
                    addNoticeVisible
                        ? <NoticeAddModal
                            {...this.props}
                            {...this.state}
                            handlePublishNoticeModalCancel={this.handlePublishNoticeModalCancel.bind(this)}
                        /> : ''
                }
                <Modal
                    title='通知预览'
                    width='800px'
                    visible={this.state.detailVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{noticeTitle}</h1>
                        <div>
                            <p>紧急程度 ：{detailDegree ? <span>{detailDegree}</span> : '暂无'}</p>
                            <p>
                                附件 ：{fileList.length ? fileList.map(item => {
                                    return (<div>
                                        <a href={item.FilePath}
                                            target='_blank'
                                        >{item.FileName}</a>
                                    </div>);
                                }) : '暂无'}
                            </p>
                            <div
                                style={{
                                    maxHeight: '800px',
                                    overflow: 'auto',
                                    marginTop: '5px'
                                }}
                                dangerouslySetInnerHTML={{ __html: noticeContent }}
                            />
                        </div>
                    </div>
                </Modal>
                <Col span={22} offset={1}>
                    <Tabs
                        activeKey={tipsTabValue}
                        onChange={this.subTabChange.bind(this)}
                        tabBarExtraContent={
                            <div style={{ marginBottom: '10px' }}>
                                <Button
                                    type='primary'
                                    onClick={this.handlePublishNotice.bind(this)}
                                >
                                    通知发布
                                </Button>
                            </div>
                        }
                    >
                        <TabPane tab='通知查询' key='publish'>
                            <Row>
                                <Col span={10}>
                                    <FormItem {...formItemLayout} label='名称'>
                                        {getFieldDecorator('theme', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入名称'
                                                }
                                            ]
                                        })(<Input placeholder='请输入名称' />)}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='创建时间'
                                    >
                                        {getFieldDecorator('worktime', {
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
                                                    width: '100%'
                                                }}
                                                format={'YYYY/MM/DD'}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='紧急程度'
                                    >
                                        {getFieldDecorator('degree', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '紧急程度'
                                                }
                                            ]
                                        })(
                                            <Select
                                                allowClear
                                                placeholder='请选择紧急程度'
                                                style={{ width: '100%' }}
                                            >
                                                <Option value='0'>平件</Option>
                                                <Option value='1'>加急</Option>
                                                <Option value='2'>特急</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={10}>
                                    <FormItem>
                                        {getFieldDecorator('search', {
                                            rules: [{ required: false, message: '请选择查询条件' }]
                                        })(
                                            <div style={{float: 'right'}}>
                                                <Button
                                                    icon='search'
                                                    style={{marginLeft: 30}}
                                                    onClick={this.queryPublish.bind(this)}
                                                >
                                                查询
                                                </Button>
                                                <Button
                                                    icon='reload'
                                                    style={{marginLeft: 30}}
                                                    onClick={this.clearPublish.bind(this)}
                                                >
                                                清除
                                                </Button>
                                            </div>
                                        )}
                                    </FormItem>

                                </Col>
                            </Row>

                            <Table
                                dataSource={tipsList}
                                className='foresttables'
                                columns={this.columns}
                                bordered
                                rowKey='ID'
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        );
    }
    columns = [
        {
            title: '通知查询ID',
            dataIndex: 'ID',
            key: 'ID',
            width: '10%'
        },
        {
            title: '名称',
            dataIndex: 'Notice_Title',
            key: 'Notice_Title',
            width: '40%'
        },
        {
            title: '紧急程度',
            dataIndex: 'Notice_Type',
            key: 'Notice_Type',
            width: '10%',
            render: text => {
                if (text === 0) {
                    return '平件';
                } else if (text === 1) {
                    return '加急';
                } else if (text === 2) {
                    return '特急';
                } else {
                    return '/';
                }
            }
        },
        {
            title: '创建时间',
            key: 'Notice_Time',
            width: '15%',
            render: (text, record) => {
                let date = '/';
                if (text) {
                    date = moment(record.Notice_Time).format(dateTimeFormat);
                }
                return date;
            }
        },
        {
            title: '操作',
            width: '15%',
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.handleNoticeView.bind(this, record.ID)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNoticeEdit.bind(this, record.ID)}>
                            修改
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this.handleNoticeDelete.bind(this, record.ID)}
                            okText='确定'
                            cancelText='取消'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                );
            }
        }
    ];
}

export default Form.create()(NoticeTable);

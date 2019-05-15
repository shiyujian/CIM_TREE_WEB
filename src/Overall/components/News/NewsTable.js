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
    Divider
} from 'antd';
import NewsAddModal from './NewsAddModal';
import NewsEditModal from './NewsEditModal';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
import './index.less';
moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class NewsTable extends Component {
    array = [];
    constructor (props) {
        super(props);
        this.state = {
            content: '',
            visible: false,
            container: null,
            newsTabValue: 'publish',
            editNewsVisible: false,
            addNewsVisible: false,
            newsDetail: ''
        };
    }
    columns = [
        {
            title: '新闻查询ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%'
        },
        {
            title: '名称',
            dataIndex: 'title',
            key: 'title',
            width: '50%'
        },
        {
            title: '发布单位',
            dataIndex: 'abstract',
            key: 'abstract',
            width: '10%',
            render: (text, record) => {
                if (record.abstract) {
                    return <p>{record.abstract}</p>;
                } else {
                    if (record.pub_unit && record.pub_unit.name) {
                        return <p>{record.pub_unit.name}</p>;
                    } else {
                        return <p> / </p>;
                    }
                }
            }
        },
        {
            title: '发布日期',
            key: 'pub_time',
            width: '15%',
            render: (text, record) => {
                if (record.pub_time) {
                    return moment(record.pub_time)
                        .utc()
                        .format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return '/';
                }
            }
        },
        {
            title: '操作',
            width: '15%',
            render: record => {
                return (
                    <span>
                        <a onClick={this.handleNewsView.bind(this, record)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNewsEdit.bind(this, record)}>
                            修改
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this.handleNewsDelete.bind(this, record)}
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
    draftColumns = [
        {
            title: '暂存新闻ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%'
        },
        {
            title: '名称',
            dataIndex: 'title',
            key: 'title',
            width: '50%'
        },
        {
            title: '发布单位',
            dataIndex: 'abstract',
            key: 'abstract',
            width: '10%',
            render: (text, record) => {
                if (record.abstract) {
                    return <p>{record.abstract}</p>;
                } else {
                    if (record.pub_unit && record.pub_unit.name) {
                        return <p>{record.pub_unit.name}</p>;
                    } else {
                        return <p> / </p>;
                    }
                }
            }
        },
        {
            title: '修改日期',
            dataIndex: 'pub_time',
            key: 'pub_time',
            width: '15%',
            render: pub_time => {
                return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '操作',
            width: '15%',
            render: record => {
                return (
                    <span>
                        <a
                            onClick={this.handleNewsPublish.bind(this, record)}
                        >
                            发布
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNewsView.bind(this, record)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNewsEdit.bind(this, record)}>
                            修改
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this.handleNewsDelete.bind(this, record)}
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

    componentDidMount () {
        const {
            actions: { getNewsList, getDraftNewsList }
        } = this.props;
        // 获取发布新闻
        getNewsList({}, {
            tag: '新闻',
            is_draft: false
        });
        // 获取暂存新闻
        getDraftNewsList({}, {
            tag: '新闻',
            is_draft: true
        });
    }
    // 查看新闻
    handleNewsView = async (record) => {
        this.setState({
            visible: true,
            container: record.raw,
            title: record.title,
            source: record.source ? record.source.name : '无'
        });
    }
    // 编辑新闻
    handleNewsEdit = async (record) => {
        this.setState({
            editNewsVisible: true,
            newsDetail: record
        });
    }
    handleNewsEditModalCancel = async () => {
        this.setState({
            editNewsVisible: false,
            newsDetail: ''
        });
    }
    // 删除新闻
    handleNewsDelete = async (record) => {
        const {
            actions: {
                deleteData,
                getNewsList,
                getDraftNewsList
            }
        } = this.props;
        const {
            newsTabValue
        } = this.state;
        let data = await deleteData({ pk: record.id });
        console.log('data', data);
        if (data) {
            Notification.error({
                message: '删除新闻失败！',
                duration: 3
            });
        } else {
            Notification.success({
                message: '删除新闻成功！',
                duration: 3
            });
            if (newsTabValue === 'publish') {
                await getNewsList({}, {
                    tag: '新闻',
                    is_draft: false
                });
            } else {
                await getDraftNewsList({}, {
                    tag: '新闻',
                    is_draft: true
                });
            }
        }
    }
    // 发布新闻
    handleNewsPublish = async (record) => {
        const {
            actions: {
                getNewsList,
                getDraftNewsList,
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
                message: '重新发布新闻成功！',
                duration: 3
            });
            // 更新暂存的新闻列表数据
            getNewsList({}, {
                tag: '新闻',
                is_draft: false
            });
            getDraftNewsList({}, {
                tag: '新闻',
                is_draft: true
            });
        } else {
            Notification.error({
                message: '重新发布新闻失败！',
                duration: 3
            });
        }
    }
    // 关闭新闻预览弹窗
    handleCancel () {
        this.setState({
            visible: false,
            container: null
        });
    }
    // 新闻列表和暂存的新闻列表切换
    subTabChange (newsTabValue) {
        this.setState({
            newsTabValue
        });
    }
    // 发布的新闻搜索
    queryPublish () {
        const {
            actions: { getNewsList }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            await getNewsList({}, {
                tag: '新闻',
                is_draft: false,
                pub_time_begin: values.worktime
                    ? moment(values.worktime[0]).format('YYYY-MM-DD') : '',
                pub_time_end: values.worktime
                    ? moment(values.worktime[1]).format('YYYY-MM-DD') : '',
                title: values.theme || ''
            });
        });
    }
    // 清除发布新闻的搜索条件
    clearPublish () {
        this.props.form.setFieldsValue({
            theme: undefined,
            worktime: undefined
        });
        this.queryPublish();
    }
    // 暂存的新闻进行搜索
    queryTemporary () {
        const {
            actions: { getDraftNewsList }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            await getDraftNewsList({}, {
                tag: '新闻',
                is_draft: true,
                pub_time_begin: values.worktimes ? moment(values.worktimes[0]).format('YYYY-MM-DD') : '',
                pub_time_end: values.worktimes ? moment(values.worktimes[1]).format('YYYY-MM-DD') : '',
                title: values.title1 || ''
            });
        });
    }
    // 清除暂存的新闻的搜索条件
    clearTemporary () {
        this.props.form.setFieldsValue({
            title1: undefined,
            worktimes: undefined
        });
        this.queryTemporary();
    }
    // 发布新闻
    handlePublishNews () {
        this.setState({
            addNewsVisible: true
        });
    }
    handlePublishNewsModalCancel = async () => {
        this.setState({
            addNewsVisible: false
        });
    }
    render () {
        const {
            newsList = [],
            draftNewsLis = [],
            form: { getFieldDecorator }
        } = this.props;
        const {
            newsTabValue,
            editNewsVisible,
            addNewsVisible
        } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Row>
                {
                    editNewsVisible
                        ? <NewsEditModal
                            {...this.props}
                            {...this.state}
                            handleNewsEditModalCancel={this.handleNewsEditModalCancel.bind(this)}
                        /> : ''
                }
                {
                    addNewsVisible
                        ? <NewsAddModal
                            {...this.props}
                            {...this.state}
                            handlePublishNewsModalCancel={this.handlePublishNewsModalCancel.bind(this)}
                        /> : ''
                }
                <Modal
                    title='新闻预览'
                    width='800px'
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        {this.state.source === '无' ? null : (
                            <p>{`来源 ：${this.state.source}`}</p>
                        )}
                        <div
                            style={{ maxHeight: '800px', overflow: 'auto' }}
                            dangerouslySetInnerHTML={{
                                __html: this.state.container
                            }}
                        />
                    </div>
                </Modal>
                <Col span={22} offset={1}>
                    <Tabs
                        activeKey={newsTabValue}
                        onChange={this.subTabChange.bind(this)}
                        tabBarExtraContent={
                            <div style={{ marginBottom: '10px' }}>
                                <Button
                                    type='primary'
                                    onClick={this.handlePublishNews.bind(this)}
                                >
                                    新闻发布
                                </Button>
                            </div>
                        }
                    >
                        <TabPane tab='新闻查询' key='publish'>
                            <Row>
                                <Col span={18}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem
                                                {...formItemLayout}
                                                label='名称'
                                            >
                                                {getFieldDecorator('theme', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请输入名称'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder='请输入名称' />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={10}>
                                            <FormItem
                                                {...formItemLayout}
                                                label='发布日期'
                                            >
                                                {getFieldDecorator('worktime', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请选择日期'
                                                        }
                                                    ]
                                                })(
                                                    <RangePicker
                                                        style={{
                                                            verticalAlign:
                                                                'middle',
                                                            width: '100%'
                                                        }}
                                                        format={
                                                            'YYYY/MM/DD'
                                                        }
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row />
                                </Col>
                                <Col span={2} offset={1}>
                                    <Button
                                        icon='search'
                                        onClick={this.queryPublish.bind(this)}
                                    >
                                        查找
                                    </Button>
                                </Col>
                                <Col span={2}>
                                    <Button
                                        icon='reload'
                                        onClick={this.clearPublish.bind(this)}
                                    >
                                        清空
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                dataSource={newsList}
                                columns={this.columns}
                                className='foresttables'
                                bordered
                                rowKey='id'
                            />
                        </TabPane>
                        <TabPane tab='暂存的新闻' key='temporary'>
                            <Row>
                                <Col span={18}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem
                                                {...formItemLayout}
                                                label='名称'
                                            >
                                                {getFieldDecorator('title1', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请输入名称'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder='请输入名称' />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={10}>
                                            <FormItem
                                                {...formItemLayout}
                                                label='修改日期'
                                            >
                                                {getFieldDecorator(
                                                    'worktimes',
                                                    {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请选择日期'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <RangePicker
                                                        style={{
                                                            verticalAlign:
                                                                'middle',
                                                            width: '100%'
                                                        }}
                                                        format={
                                                            'YYYY/MM/DD'
                                                        }
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={2} offset={1}>
                                    <Button
                                        icon='search'
                                        onClick={this.queryTemporary.bind(this)}
                                    >
                                        查找
                                    </Button>
                                </Col>
                                <Col span={2}>
                                    <Button
                                        icon='reload'
                                        onClick={this.clearTemporary.bind(this)}
                                    >
                                        清空
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                dataSource={draftNewsLis}
                                columns={this.draftColumns}
                                className='foresttables'
                                bordered
                                rowKey='id'
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        );
    }
}
export default Form.create()(NewsTable);

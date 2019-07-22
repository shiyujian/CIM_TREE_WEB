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
import { STATIC_PREVIEW_API, STATIC_DOWNLOAD_API } from '_platform/api';
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
            detailVisible: false,
            newsTitle: '', // 新闻标题
            newsContent: '', // 新闻内容
            newsThumbnail: '', // 新闻封面
            newsSource: '', // 新闻来源
            fileList: [], // 附件列表
            newsTabValue: 'publish',
            editNewsVisible: false,
            addNewsVisible: false,
            newsID: '',
            viewCoverVisible: false,
            coverArr: []
        };
    }
    columns = [
        {
            title: '新闻查询ID',
            dataIndex: 'ID',
            key: 'ID',
            width: '10%'
        },
        {
            title: '名称',
            dataIndex: 'Title',
            key: 'Title',
            width: '40%'
        },
        {
            title: '发布单位',
            dataIndex: 'News_Type',
            key: 'News_Type',
            width: '10%',
            render: (text, record) => {
                if (text === 4) {
                    return '业主单位';
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'Create_Time',
            key: 'Create_Time',
            width: '15%',
            render: (text, record) => {
                if (text) {
                    return moment(text)
                        .utc()
                        .format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return '/';
                }
            }
        },
        {
            title: '封面',
            dataIndex: 'Thumbnail',
            key: 'Thumbnail',
            width: '10%',
            render: (text, record) => {
                return (<a
                    onClick={this.handleViewCover.bind(this, text)}
                >
                    查看
                </a>);
            }
        },
        {
            title: '操作',
            width: '15%',
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.handleNewsView.bind(this, record.ID)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNewsEdit.bind(this, record.ID)}>
                            修改
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this.handleNewsDelete.bind(this, record.ID)}
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
            width: '40%'
        },
        {
            title: '发布单位',
            dataIndex: 'abstract',
            key: 'abstract',
            width: '10%',
            render: (text, record) => {
                if (record.abstract) {
                    return record.abstract;
                } else {
                    if (record.pub_unit && record.pub_unit.name) {
                        return record.pub_unit.name;
                    } else {
                        return '/';
                    }
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'pub_time',
            key: 'pub_time',
            width: '15%',
            render: pub_time => {
                return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '封面',
            dataIndex: 'cover',
            key: 'cover',
            width: '10%',
            render: (text, record, index) => {
                return (<a
                    onClick={this.handleViewCover.bind(this, text)}
                >
                    查看
                </a>);
            }
        },
        {
            title: '操作',
            width: '15%',
            render: record => {
                return (
                    <span>
                        <a onClick={this.handleNewsView.bind(this, record.ID)}>
                            查看
                        </a>
                        <Divider type='vertical' />
                        <a
                            onClick={this.handleNewsPublish.bind(this, record)}
                        >
                            发布
                        </a>
                        <Divider type='vertical' />
                        <a onClick={this.handleNewsEdit.bind(this, record.ID)}>
                            修改
                        </a>
                        <Divider type='vertical' />
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this.handleNewsDelete.bind(this, record.ID)}
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
            actions: { getNewsListNew }
        } = this.props;
        // 获取新闻
        getNewsListNew({}, {
            type: '',
            name: '',
            ishot: '',
            sdate: '',
            edate: '',
            page: '',
            size: ''
        });
    }
    // 查看封面
    handleViewCover = async (imgUrl) => {
        let coverArr = [];
        if (imgUrl) {
            coverArr.push(
                <img style={{ width: '490px' }} src={imgUrl} alt='图片' />
            );
        }
        this.setState({
            viewCoverVisible: true,
            coverArr
        });
    }
    handleViewCoverCancel = async () => {
        this.setState({
            viewCoverVisible: false,
            coverArr: []
        });
    }
    // 查看新闻
    handleNewsView (ID) {
        console.log(ID, '查看');
        const { getNewsDetails } = this.props.actions;
        getNewsDetails({ID}, {}).then(rep => {
            console.log(rep, '详情信息');
            this.setState({
                detailVisible: true,
                newsTitle: rep.Title,
                newsSource: rep.Source,
                newsThumbnail: rep.Thumbnail,
                newsContent: rep.Content,
                fileList: rep.Files
            });
        });
    }
    // 关闭新闻预览弹窗
    handleCancel () {
        this.setState({
            detailVisible: false,
            newsContent: '',
            newsTitle: '',
            newsSource: ''
        });
    }
    // 编辑新闻
    handleNewsEdit = async (ID) => {
        console.log(ID, '编辑');
        this.setState({
            editNewsVisible: true,
            newsID: ID
        });
    }
    handleNewsEditModalCancel = async () => {
        this.setState({
            editNewsVisible: false
        });
    }
    // 删除新闻
    handleNewsDelete = async (ID) => {
        const {
            actions: {
                deleteNews
            }
        } = this.props;
        deleteNews({ID}, {}).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除新闻成功！',
                    duration: 3
                });
                this.queryPublish();
            } else {
                Notification.error({
                    message: '删除新闻失败！',
                    duration: 3
                });
            }
        });
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
    // 新闻列表和暂存的新闻列表切换
    subTabChange (newsTabValue) {
        this.setState({
            newsTabValue
        });
    }
    // 发布的新闻查询
    queryPublish () {
        const {
            actions: { getNewsListNew }
        } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(123, values);
                getNewsListNew({}, {
                    type: '',
                    name: values.theme || '',
                    ishot: '',
                    sdate: values.worktime ? moment(values.worktime[0]).format('YYYY-MM-DD') : '',
                    edate: values.worktime ? moment(values.worktime[1]).format('YYYY-MM-DD') : '',
                    page: '',
                    size: '',
                });
            }
        });
    }
    // 清除发布新闻的搜索条件
    clearPublish () {
        this.props.form.setFieldsValue({
            theme: '',
            worktime: ''
        });
        this.queryPublish();
    }
    // 暂存的新闻进行搜索
    queryTemporary () {
        const {
            actions: { getDraftNewsList }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log('values', values);
            console.log('err', err);
            await getDraftNewsList({}, {
                tag: '新闻',
                is_draft: true,
                pub_time_begin: values.worktimes && values.worktimes instanceof Array && values.worktimes.length > 0
                    ? moment(values.worktimes[0]).format('YYYY-MM-DD') : '',
                pub_time_end: values.worktimes && values.worktimes instanceof Array && values.worktimes.length > 0
                    ? moment(values.worktimes[1]).add(1, 'days').format('YYYY-MM-DD') : '',
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
            addNewsVisible,
            newsSource,
            detailVisible,
            newsThumbnail,
            newsContent,
            fileList,
            newsTitle,
            viewCoverVisible,
            coverArr
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
                    visible={detailVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{newsTitle}</h1>
                        <p>来源 ：{newsSource ? <span>{newsSource}</span> : '未知'}</p>
                        <p>
                            封面 ：{ newsThumbnail ? <a href={newsThumbnail}
                                target='_blank'>
                                微信图片.jpg
                            </a> : '暂无'}
                        </p>
                        <p>
                            附件 ：{fileList.length ? fileList.map(item => {
                                return <a href={item.FilePath} target='_blank' style={{marginRight: 10}}>{item.FileName}</a>;
                            }) : '暂无'}
                        </p>
                        <div
                            style={{ maxHeight: '800px', overflow: 'auto' }}
                            dangerouslySetInnerHTML={{
                                __html: newsContent
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    width={522}
                    title='封面'
                    style={{ textAlign: 'center' }}
                    visible={viewCoverVisible}
                    onCancel={this.handleViewCoverCancel.bind(this)}
                    footer={null}
                >
                    {coverArr}
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleViewCoverCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                            关闭
                        </Button>
                    </Row>
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
                                    <FormItem>
                                        {getFieldDecorator('search', {
                                            rules: [{ required: false, message: '请选择查询条件' }]
                                        })(
                                            <Button
                                                icon='search'
                                                onClick={this.queryPublish.bind(this)}
                                            >
                                                查询
                                            </Button>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <FormItem>
                                        {getFieldDecorator('reload', {
                                            rules: [{ required: false, message: '请选择查询条件' }]
                                        })(
                                            <Button
                                                icon='reload'
                                                onClick={this.clearPublish.bind(this)}
                                            >
                                            清除
                                            </Button>
                                        )}
                                    </FormItem>
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
                                    <FormItem>
                                        {getFieldDecorator('search', {
                                            rules: [{ required: false, message: '请选择查询条件' }]
                                        })(
                                            <Button
                                                icon='search'
                                                onClick={this.queryTemporary.bind(this)}
                                            >
                                                查询
                                            </Button>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <FormItem>
                                        {getFieldDecorator('reload', {
                                            rules: [{ required: false, message: '请选择查询条件' }]
                                        })(
                                            <Button
                                                icon='reload'
                                                onClick={this.clearTemporary.bind(this)}
                                            >
                                            清除
                                            </Button>
                                        )}
                                    </FormItem>
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

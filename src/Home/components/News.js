import React, { Component } from 'react';
import { Table, Row, Col, Modal, Tabs } from 'antd';
import moment from 'moment';
import { STATIC_PREVIEW_API, STATIC_DOWNLOAD_API } from '_platform/api';

import './styles.less';

const TabPane = Tabs.TabPane;

export default class News extends Component {
    constructor (props) {
        super(props);
        this.state = {
            newsVisible: false,
            newsContainer: null,
            newsTitle: '',
            newsSource: '',
            newsDetail: '',
            // 通知
            noticeDetailVisible: false,
            noticeDetail: '',
            noticeTitle: '',
            noticeDetailDegree: ''
        };
    }
    columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            key: 'title',
            width: 400,
            render (text, record) {
                if (text.length > 30) {
                    text = text.slice(0, 30) + '...';
                }
                return <p>{text}</p>;
            }
        },

        {
            title: '发布时间',
            dataIndex: 'pub_time',
            key: 'pub_time',
            width: 200,
            render: pub_time => {
                return moment(pub_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss');
            }
        },

        {
            title: '操作',
            width: 100,
            render: record => {
                return (
                    <span>
                        <a onClick={this.handleNewsView.bind(this, record)}>
                            查看
                        </a>
                    </span>
                );
            }
        }
    ];

    draftColumns = [
        {
            title: '通知标题',
            dataIndex: 'title',
            key: 'title',
            width: 400,
            render (text, record) {
                if (text.length > 30) {
                    text = text.slice(0, 30);
                }
                return <p>{text}</p>;
            }
        },

        {
            title: '发布时间',
            dataIndex: 'pub_time',
            key: 'pub_time',
            width: 200,
            render: pub_time => {
                return moment(pub_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss');
            }
        },

        {
            title: '操作',
            width: 100,
            render: record => {
                return (
                    <span>
                        <a onClick={this.handleNoticeView.bind(this, record)}>
                            查看
                        </a>
                    </span>
                );
            }
        }
    ];
    componentDidMount () {
        const {
            actions: { getNewsList, getTipsList }
        } = this.props;
        getNewsList();
        getTipsList();
    }
    // 查看新闻
    handleNewsView (record) {
        console.log('');
        this.setState({
            newsVisible: true,
            newsContainer: record.raw,
            newsTitle: record.title,
            newsSource: record.source,
            newsDetail: record
        });
    }
    // 查看通知
    handleNoticeView = async (record) => {
        let noticeDetailDegree = '';
        if (record && record.degree) {
            if (record.degree === 1) {
                noticeDetailDegree = '加急';
            } else if (record.degree === 2) {
                noticeDetailDegree = '特急';
            }
        } else if (record.degree === 0) {
            noticeDetailDegree = '平件';
        }
        console.log('noticeDetailDegree', noticeDetailDegree);
        this.setState({
            noticeDetail: record,
            noticeDetailVisible: true,
            noticeDetailDegree,
            noticeTitle: record.title
        });
    }
    // 新闻和通知的列表切换
    subTabChange (tabValue) {
        const {
            actions: { setTabActive }
        } = this.props;
        setTabActive(tabValue);
    }

    handleNewsCancel () {
        this.setState({
            newsVisible: false,
            newsContainer: '',
            newsTitle: '',
            newsSource: '',
            newsDetail: ''
        });
    }
    handleNoticeCancel () {
        this.setState({
            noticeDetail: '',
            noticeDetailVisible: false,
            noticeDetailDegree: '',
            noticeTitle: ''
        });
    }

    render () {
        const { newsList = [], tipsList = [] } = this.props;
        const {
            newsTitle,
            newsVisible,
            newsDetail,
            newsSource,
            newsContainer,

            noticeDetailVisible,
            noticeDetail,
            noticeDetailDegree,
            noticeTitle
        } = this.state;
        let newsFileList = [];
        if (newsDetail.attachment && newsDetail.attachment.fileList &&
            newsDetail.attachment.fileList instanceof Array &&
            newsDetail.attachment.fileList.length > 0) {
            newsFileList = newsDetail.attachment.fileList;
        }

        let noticeFileList = [];
        if (noticeDetail.attachment && noticeDetail.attachment.fileList &&
            noticeDetail.attachment.fileList instanceof Array &&
            noticeDetail.attachment.fileList.length > 0) {
            noticeFileList = noticeDetail.attachment.fileList;
        }
        return (
            <Row>
                <Col style={{ position: 'relative' }} span={22} offset={1}>
                    <Tabs
                        className='tabless'
                        onChange={this.subTabChange.bind(this)}
                    >
                        <TabPane tab='新闻' key='1'>
                            <Table
                                dataSource={newsList}
                                columns={this.columns}
                                bordered
                                pagination={{
                                    showQuickJumper: true,
                                    pageSize: 5
                                }}
                                rowKey='id'
                            />
                        </TabPane>
                        <TabPane tab='通知' key='2'>
                            <Table
                                dataSource={tipsList}
                                columns={this.draftColumns}
                                bordered
                                pagination={{
                                    showQuickJumper: true,
                                    pageSize: 5
                                }}
                                rowKey='id'
                            />
                        </TabPane>
                    </Tabs>
                </Col>
                <Modal
                    title={newsTitle}
                    width='800px'
                    visible={newsVisible}
                    onCancel={this.handleNewsCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{newsTitle}</h1>
                        {
                            newsSource && newsSource.name
                                ? <p>{`来源 ：${newsSource.name}`}</p> : (
                                    <p>{`来源 ：暂无`}</p>
                                )
                        }
                        {
                            newsDetail && newsDetail.cover && newsDetail.cover.a_file
                                ? (
                                    <p>
                                        封面 ：<a href={STATIC_PREVIEW_API + newsDetail.cover.a_file}
                                            target='_blank'>
                                            {newsDetail.cover.name}
                                        </a>
                                    </p>
                                ) : <p>{`封面 ：暂无`}</p>
                        }
                        {
                            newsFileList.map((file) => {
                                if (file && file.response && file.response.download_url) {
                                    return (
                                        <p>
                                            附件 ：<a href={STATIC_DOWNLOAD_API + file.response.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '')}>
                                                {file.name}
                                            </a>
                                        </p>
                                    );
                                } else {
                                    return (<p>{`附件 ：暂无`}</p>);
                                }
                            })
                        }
                        <div
                            style={{ maxHeight: '800px', overflow: 'auto' }}
                            dangerouslySetInnerHTML={{
                                __html: newsContainer
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    title={noticeTitle}
                    width='800px'
                    visible={noticeDetailVisible}
                    onCancel={this.handleNoticeCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{noticeTitle}</h1>
                        <div>
                            {noticeDetailDegree ? (
                                <p>{`紧急程度 ：${noticeDetailDegree}`}</p>)
                                : (<p>{`紧急程度 ：暂无`}</p>)
                            }
                            {
                                noticeFileList.map((file) => {
                                    if (file && file.response && file.response.download_url) {
                                        return (
                                            <p>
                                            附件 ：<a href={STATIC_DOWNLOAD_API + file.response.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '')}>
                                                {file.name}
                                            </a>
                                            </p>
                                        );
                                    } else {
                                        return (<p>{`附件 ：暂无`}</p>);
                                    }
                                })
                            }
                            <div
                                style={{
                                    maxHeight: '800px',
                                    overflow: 'auto',
                                    marginTop: '5px'
                                }}
                                dangerouslySetInnerHTML={{ __html: noticeDetail && noticeDetail.raw }}
                            />
                        </div>
                    </div>
                </Modal>
            </Row>
        );
    }
}

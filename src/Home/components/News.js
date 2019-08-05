import React, { Component } from 'react';
import { Table, Row, Col, Modal, Tabs } from 'antd';
import moment from 'moment';

import './styles.less';

const TabPane = Tabs.TabPane;

export default class News extends Component {
    constructor (props) {
        super(props);
        this.state = {
            newsVisible: false, // 新闻
            newsTitle: '',
            newsSource: '',
            newThumbnail: '',
            newsFileList: [],
            newsContainer: '',

            noticeDetailVisible: false, // 公告
            noticeTitle: '',
            noticeDetailDegree: '',
            noticeFileList: [],
            noticeContainer: ''
        };
    }
    columns = [
        {
            title: '新闻标题',
            dataIndex: 'Title',
            key: 'Title',
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
            dataIndex: 'Publish_Time',
            key: 'Publish_Time',
            width: 200,
            render: (text, record) => {
                let date = '';
                if (text) {
                    date = moment(text).format('YYYY-MM-DD HH:mm:ss');
                }
                return date;
            }
        },

        {
            title: '操作',
            width: 100,
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.handleNewsView.bind(this, record.ID)}>
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
            dataIndex: 'Notice_Title',
            key: 'Notice_Title',
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
            dataIndex: 'Notice_Time',
            key: 'Notice_Time',
            width: 200,
            render: (text, record) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },

        {
            title: '操作',
            width: 100,
            render: record => {
                return (
                    <span>
                        <a onClick={this.handleNoticeView.bind(this, record.ID)}>
                            查看
                        </a>
                    </span>
                );
            }
        }
    ];
    componentDidMount () {
        const {
            actions: { getNewsListNew, getNoticeList }
        } = this.props;
        getNewsListNew();
        getNoticeList();
    }
    // 查看新闻
    handleNewsView (ID) {
        console.log(ID);
        const { getNewsDetails } = this.props.actions;
        getNewsDetails({ID}, {}).then(rep => {
            this.setState({
                newsVisible: true,
                newsTitle: rep.Title,
                newsSource: rep.Source,
                newThumbnail: rep.Thumbnail,
                newsContainer: rep.Content,
                newsFileList: rep.Files
            });
        });
    }
    // 查看通知
    handleNoticeView = async (ID) => {
        const { getNoticeDetails } = this.props.actions;
        getNoticeDetails({ID}, {}).then(rep => {
            let noticeDetailDegree = '';
            if (rep.Notice_Type) {
                if (rep.Notice_Type === 1) {
                    noticeDetailDegree = '加急';
                } else if (rep.Notice_Type === 2) {
                    noticeDetailDegree = '特急';
                }
            } else if (rep.Notice_Type === 0) {
                noticeDetailDegree = '平件';
            }
            this.setState({
                noticeDetailVisible: true,
                noticeTitle: rep.Notice_Title,
                noticeDetailDegree,
                noticeContainer: rep.Notice_Content,
                noticeFileList: rep.Files
            });
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
            newsSource: ''
        });
    }
    handleNoticeCancel () {
        this.setState({
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
            newsSource,
            newThumbnail,
            newsFileList,
            newsContainer,

            noticeDetailVisible,
            noticeFileList,
            noticeDetailDegree,
            noticeTitle,
            noticeContainer
        } = this.state;
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
                                rowKey='ID'
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
                                rowKey='ID'
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
                        <p>来源 ：{newsSource ? <span>{newsSource}</span> : '未知'}</p>
                        <p>封面 ：{newThumbnail ? <a href={newThumbnail} target='_blank'>微信图片.jpg</a> : '暂无'}</p>
                        <p>
                            {newsFileList.length ? newsFileList.map(item => {
                                return (<p>
                                    附件 ：<a
                                        href={item.FilePath}
                                        target='_blank'
                                    >{item.FileName}</a>
                                </p>);
                            }) : (<p>{`附件 ：暂无`}</p>)}
                        </p>
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
                            <p>紧急程度 ：{noticeDetailDegree ? <span>{noticeDetailDegree}</span> : <span>暂无</span>}</p>
                            <p>
                                {noticeFileList.length ? noticeFileList.map(item => {
                                    return (<p>
                                        附件 ：<a href={item.FilePath}
                                            target='_blank'
                                        >{item.FileName}</a>
                                    </p>);
                                }) : (<p>{`附件 ：暂无`}</p>)}
                            </p>
                            <div
                                style={{
                                    maxHeight: '800px',
                                    overflow: 'auto',
                                    marginTop: '5px'
                                }}
                                dangerouslySetInnerHTML={{ __html: noticeContainer }}
                            />
                        </div>
                    </div>
                </Modal>
            </Row>
        );
    }
}

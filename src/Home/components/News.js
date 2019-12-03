import React, { Component } from 'react';
import { Table, Row, Col, Modal, Card } from 'antd';
import moment from 'moment';

import './styles.less';
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
            render: (text, record, index) => {
                let name = text;
                if (text.length > 30) {
                    name = text.slice(0, 30) + '...';
                }
                return (
                    <span>
                        <a
                            title={text}
                            className='hoverStyle'
                            onClick={this.handleNewsView.bind(this, record.ID)}>
                            {name}
                        </a>
                    </span>
                );
            }
        },
        {
            title: '发布时间',
            dataIndex: 'Publish_Time',
            key: 'Publish_Time',
            render: (text, record) => {
                let date = '';
                if (text) {
                    date = moment(text).format('YYYY-MM-DD');
                }
                return date;
            }
        }
    ];

    componentDidMount () {
        const {
            actions: { getNewsListNew }
        } = this.props;
        getNewsListNew({}, {type: 0});
    }
    // 查看新闻
    handleNewsView (ID) {
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

    handleNewsCancel () {
        this.setState({
            newsVisible: false,
            newsContainer: '',
            newsTitle: '',
            newsSource: ''
        });
    }

    render () {
        const {
            newsList = []
        } = this.props;
        const {
            newsTitle,
            newsVisible,
            newsSource,
            newThumbnail,
            newsFileList,
            newsContainer
        } = this.state;
        return (
            <Row>
                <Card title='新闻' className='HomeCard' style={{marginLeft:'2%'}}>
                    <Table
                        size='small'
                        dataSource={newsList}
                        columns={this.columns}
                        // bordered
                        showHeader={false}
                        pagination={{
                            showQuickJumper: true,
                            pageSize: 5
                        }}
                        rowKey='ID'
                    />
                </Card>
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
                                return (<p key={item.FilePath}>
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
            </Row>
        );
    }
}

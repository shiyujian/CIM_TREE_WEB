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

    draftColumns = [
        {
            title: '通知标题',
            dataIndex: 'Notice_Title',
            key: 'Notice_Title',
            render: (text, record, index) => {
                let name = text;
                if (text && text.length > 15) {
                    name = text.slice(0, 15) + '...';
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
            dataIndex: 'Notice_Time',
            key: 'Notice_Time',
            render: (text, record) => {
                return moment(text).format('YYYY-MM-DD');
            }
        }
    ];
    // 查看新闻
    handleNewsView (ID) {
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
    componentDidMount () {
        const {
            actions: { getNoticeList }
        } = this.props;
        getNoticeList();
    }
    handleNoticeCancel () {
        this.setState({
            noticeDetailVisible: false,
            noticeDetailDegree: '',
            noticeTitle: ''
        });
    }

    render () {
        const {
            tipsList = []
        } = this.props;
        const {
            noticeDetailVisible,
            noticeFileList,
            noticeDetailDegree,
            noticeTitle,
            noticeContainer
        } = this.state;
        return (
            <Row>
                <Card title='通知' className='HomeCard' style={{marginRight:'1%'}}>
                    <Table
                        size='small'
                        dataSource={tipsList}
                        columns={this.draftColumns}
                        // bordered
                        showHeader={false}
                        pagination={{
                            showQuickJumper: true,
                            pageSize: 5
                        }}
                        style={{width: '100%', height: '100%'}}
                        rowKey='ID'
                    />
                </Card>
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
                                    return (<p key={item.FilePath}>
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

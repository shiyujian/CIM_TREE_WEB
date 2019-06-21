import React, { Component } from 'react';
import { Table, Row, Col, Modal, Tabs } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import { Link } from 'react-router-dom';

import styles from './styles.less';
import { getUser } from '_platform/auth';

const TabPane = Tabs.TabPane;

export default class News extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            container: null,
            title: '',
            source: '',
            attachment: []
        };
    }

    static propTypes = {};

    componentDidMount () {
        const {
            actions: { getNewsList, getTipsList }
        } = this.props;
        const user = getUser();
        let user_id = user.id;
        getNewsList({}, { tag: '新闻', is_draft: false });
        getTipsList({}, { tag: '公告', is_draft: false });
    }

    clickNews (record, type) {
        if (type === 'VIEW') {
            this.setState({
                visible: true,
                container: record.raw,
                title: record.title,
                source: record.source ? record.source.name : '无',
                attachment: record.attachment
            });
        }
    }

    // 新闻和通知的列表切换
    subTabChange (tabValue) {
        const {
            actions: { setTabActive }
        } = this.props;
        setTabActive(tabValue);
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
                        <a onClick={this.clickNews.bind(this, record, 'VIEW')}>
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
                        <a onClick={this.clickNews.bind(this, record, 'VIEW')}>
                            查看
                        </a>
                    </span>
                );
            }
        }
    ];

    handleCancel () {
        this.setState({
            visible: false,
            container: null
        });
    }

    render () {
        const { newsList = [], tipsList = [] } = this.props;

        return (
            // <Blade title="新闻">
            // 		<div className="tableContainer">
            // 			<Table bordered={false} dataSource={newsList} columns={this.columns}
            // 			       rowKey="id" size="small" pagination={{pageSize: 8}}/>
            // 		</div>
            // 		<Modal title="新闻预览" width={800} visible={this.state.visible}
            // 			onOk={this.handleCancel.bind(this)} onCancel={this.handleCancel.bind(this)} footer={null}>
            // 			<div style={{maxHeight: '800px', overflow: 'auto'}}
            // 			     dangerouslySetInnerHTML={{__html: this.state.container}}/>
            // 		</Modal>
            // </Blade>

            <Row>
                <Col style={{ position: 'relative' }} span={22} offset={1}>
                    {/* <Link  to='/overall/news'>
						<span style={{position:'absolute', top: "10px",right:'0',zIndex:'200' }} >MORE</span>
					</Link> */}
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
                    title={<p style={{ fontSize: 16 }}>{this.state.title}</p>}
                    width={800}
                    visible={this.state.visible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        {this.state.source === '无' ? null : (
                            <p>{`来源 ：${this.state.source}`}</p>
                        )}
                        <div
                            style={{
                                maxHeight: '800px',
                                overflow: 'auto',
                                marginTop: '5px'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: this.state.container
                            }}
                        />
                        <h4>
                            通知附件：{this.state.attachment &&
                            this.state.attachment.fileList &&
                            this.state.attachment.fileList.length > 0
                                ? this.state.attachment.fileList.map(
                                    (file, index) => {
                                        return (
                                            <div key={index}>
                                                <a
                                                    target='_bank'
                                                    href={file.down_file}
                                                >
                                                      附件{index + 1}、{
                                                        file.name
                                                    }
                                                </a>
                                            </div>
                                        );
                                    }
                                )
                                : '暂无附件'}
                        </h4>
                    </div>
                </Modal>
            </Row>
        );
    }
}

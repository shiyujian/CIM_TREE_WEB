import React, { Component } from 'react';
import { Table, Row, Col, Modal } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class Bulletin extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            container: null
        };
    }

	static propTypes = {};

	componentDidMount () {
	    const { actions: { getTrenList } } = this.props;
	    getTrenList({}, { tag: '公告', is_draft: false });
	}

	clickNews (record, type) {
	    if (type === 'VIEW') {
	        this.setState({
	            visible: true,
	            container: record
	        });
	    }
	}

	columns = [
	    {
	        title: '新闻标题',
	        dataIndex: 'title',
	        key: 'title'
	    },

	    {
	        title: '发布时间',
	        dataIndex: 'pub_time',
	        key: 'pub_time',
	        render: pub_time => {
	            return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
	        }
	    },

	    {
	        title: '操作',
	        render: record => {
	            return (
    <span>
    <a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>
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
	    const {
	        trenList = []
	    } = this.props;
	    const {
	        container
	    } = this.state;
	    console.log('container', container);

	    return (
	        <Blade title='安全事故快报'>
        <Link to='/safety/safetyTrend'>
    <span style={{ float: 'right', marginTop: '-30px' }} >MORE</span>
	            </Link>
	            <Table
	                bordered={false}
	                dataSource={trenList}
	                columns={this.columns}
        rowKey='id' size='small' pagination={{ pageSize: 8 }}
	            />
        <Modal title='新闻预览' width={800} visible={this.state.visible}
    onOk={this.handleCancel.bind(this)} onCancel={this.handleCancel.bind(this)} footer={null}>
    <div style={{ maxHeight: '800px', overflow: 'auto', marginTop: '5px' }}
	                    dangerouslySetInnerHTML={{ __html: container ? (container.raw ? container.raw : '') : '' }} />
    <h4>
						公告附件：{
	                        container
	                            ? (container.attachment.fileList.length > 0 ? (
	                                container.attachment.fileList.map((file, index) => {
	                                    return (
    <div key={index}>
    <a target='_bank' href={file.down_file}>附件{index + 1}、{file.name}</a>
	                                        </div>
	                                    );
	                                })
	                            ) : '暂无附件') : '暂无附件'
	                    }
	                </h4>
	            </Modal>
    </Blade>
	    );
	}
}

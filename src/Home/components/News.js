import React, {Component} from 'react';
import {Table, Row, Col, Modal,} from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import styles from './styles.less';

export default class News extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null
		}
	}

	static propTypes = {};

	componentDidMount() {
		const {actions: {getNewsList}} = this.props;
		getNewsList({}, {tag: '新闻', is_draft: false});
	}

	clickNews(record, type) {
		if (type === 'VIEW') {
			this.setState({
				visible: true,
				container: record.raw
			})
		}
	}

	columns = [
		{
			title: '新闻标题',
			dataIndex: 'title',
			key: 'title',
			width: 400
		},

		{
			title: '发布时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			width: 200,
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		},

		{
			title: '操作',
			width: 100,
			render: record => {
				return (
					<span>
						<a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		},

	];

	handleCancel() {
		this.setState({
			visible: false,
			container: null
		})
	}

	render() {
		const {
			newsList = [],
		} = this.props;

		return (
			<Blade title="新闻标题">
					<div className="tableContainer">
						<Table bordered={false} dataSource={newsList} columns={this.columns}
						       rowKey="id" size="small" pagination={{pageSize: 8}}/>
					</div>
					<Modal title="新闻预览" width={800} visible={this.state.visible}
						onOk={this.handleCancel.bind(this)} onCancel={this.handleCancel.bind(this)} footer={null}>
						<div style={{maxHeight: '800px', overflow: 'auto'}}
						     dangerouslySetInnerHTML={{__html: this.state.container}}/>
					</Modal>
			</Blade>
		);
	}
}



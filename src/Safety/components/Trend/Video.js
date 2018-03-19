// import './video.less'

import React, { Component } from 'react';
import { Table, Row, Col, Modal } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import $ from 'jquery';
import { Icon } from 'react-fa';
import './video.less'
import { Link } from 'react-router-dom';
export default class Video extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
			video: ''
		}
	}

	static propTypes = {};
	componentWillMount() {

	}
	componentDidMount() {
		const { actions: { getVideoList } } = this.props;

		getVideoList({}, { tag: '公告', is_draft: false });

	}
	play(k) {
		console.log(k)
		if (k < 3) {
			const newsListT = this.props.videoList || []
			const newsListTT = newsListT[k].attachment.fileList[0] || {}
			console.log(newsListTT)
			const videos = newsListTT.down_file
			console.log(videos)
			this.setState({ video: videos })
			this.setState({
				visible: true
			})
		}
	}
	modalClick() {
		this.setState({
			visible: false
		})
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
		const videoa = []
		const newsListT = this.props.videoList || []
		for (var k = 0; k < newsListT.length; k++) {
			const newsListTT = newsListT[k].attachment.fileList[0] || {}
			if (k < 3) {
				videoa.push(
					<div className="video box ">
						<video
							onClick={this.play.bind(this, k)}
							className="firstVideo"
							preload="auto"
							width="60%"
							height="300px"
							src={newsListTT.down_file}
						>
							<source src="newsListTT.down_file" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
							<source src="newsListTT.down_file" type='video/ogg; codecs="theora, vorbis"' />
							<source src="newsListTT.down_file" type='video/webm; codecs="vp8, vorbis"' />

						</video>

						{/* {newsListTT.name} */}
						<Icon
							className="Icon"
							onClick={this.play.bind(this, k)}
							name="play-circle"></Icon>
					</div>
				)
			}
		}
		return (
			<Blade style={{ height: "300px", background: "#eee" }} title="安全生产视频">
				<Link to='/safety/safetyTrend'>
					<span style={{ float: "right", marginTop: "-30px" }} >MORE</span>
				</Link>
				<div className="container">
					{videoa}
				</div>
				<Modal
					visible={this.state.visible}
					footer={null}
					width="70%"
					maskClosable={false}
					onOk={this.modalClick.bind(this)}
					onCancel={this.modalClick.bind(this)}
				>
					<video
						controls
						preload="auto"
						width="100%"
						height="500px"
						src={this.state.video}
					>
						<source src="this.state.video" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
						<source src="this.state.video" type='video/ogg; codecs="theora, vorbis"' />
						<source src="this.state.video" type='video/webm; codecs="vp8, vorbis"' />
					</video>
				</Modal>
			</Blade>
		);
	}
}



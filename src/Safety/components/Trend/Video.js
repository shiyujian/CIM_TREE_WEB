// import './video.less'

import React, { Component } from 'react';
import { Table, Row, Col, Modal } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import $ from 'jquery';
import { Icon } from 'react-fa';
import './video.less'
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
	componentWillReceiveProps(nextProps) {

		// const {
		// 	fileList = [],
		// } = this.props;
		// console.log(this.props)		
		const newsListT = nextProps.videoList || []
		for (var i = 0; i < newsListT.length; i++) {

			const newsListTT = newsListT[i].attachment.fileList || []
			for (var j = 0; j < newsListTT.length; j++) {

				const videos = newsListTT[j].down_file
				this.setState({ video: videos })
				break;
			}
			break;
		}
	}
	componentWillMount() {

	}
	componentDidMount() {
		const { actions: { getVideoList } } = this.props;

		getVideoList({}, { tag: '公告', is_draft: false });

	}
	play() {
		this.setState({
			visible: true
		})
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

	data = [
		{ down_file: "http://47.104.160.65:6512/media/documents/2018/01/1510116943014_Hbu2FIz.mp4", name: "1510116943014.mp4" },
		{ down_file: "http://47.104.160.65:6512/media/documents/2018/01/1510116943014_Hbu2FIz.mp4", name: "1510116943014.mp4" },
		{ down_file: "http://47.104.160.65:6512/media/documents/2018/01/1510116943014_Hbu2FIz.mp4", name: "1510116943014.mp4" },
	]
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
		console.log(this.props)
		
		for (var k = 0; k < this.data.length; k++) {
			videoa.push(
				<div className="video box ">
					<video
						// onClick={this.play.bind(this)}
						className="firstVideo"
						preload="auto"
						width="60%"
						height="300px"
						src={this.data[k].down_file}
					>
					</video>
					<Icon
						className="Icon"
						onClick={this.play.bind(this)}
						name="play-circle"></Icon>
				</div>
			)
		}
		return (
			<Blade style={{ height: "300px", background: "#eee" }} title="安全生产视频">
				<div className="container">
					{videoa}
					{/* <div className="video box " style={{ width: "60%", height: "300px", float: "left", textAlign: "center" }}>
						<video
							// onClick={this.play.bind(this)}
							className="firstVideo"
							preload="auto"
							width="60%"
							height="300px"
							src={this.state.video}
						>
						</video>
						<Icon
							className="Icon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 60, width: "60px", height: "60px" }} name="play-circle"></Icon>
					</div>
					<div className="video box" style={{ width: "40%", height: "150px", float: "right", textAlign: "center" }} >
						<video
							// onClick={this.play.bind(this)}
							id="firstVideo"
							preload="auto"
							width="40%"
							height="150px"
							src={this.state.video}
						>
						</video>
						<Icon
							className="Icon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px" }} name="play-circle"></Icon>
					</div>
					<div className="video box" style={{ width: "40%", height: "150px", float: "right", textAlign: "center" }}>
						<video
							// onClick={this.play.bind(this)}
							id="firstVideo"
							preload="auto"
							width="40%"
							height="150px"
							src={this.state.video}
						>
						</video>
						<Icon
							className="Icon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px" }} name="play-circle"></Icon>
					</div> */}
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
					</video>
				</Modal>
			</Blade>
		);
	}
}



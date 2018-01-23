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
		console.log(nextProps)
		// const {
		// 	fileList = [],
		// } = this.props;
		// console.log(this.props)		
		const newsListT = nextProps.newsList || []
		for (var i = 0; i < newsListT.length; i++) {
			console.log(newsListT[i])
			const newsListTT = newsListT[i].attachment.fileList || []
			for (var j = 0; j < newsListTT.length; j++) {
				console.log(newsListTT[j])
				const videos = newsListTT[j].down_file
				this.setState({ video: videos })
				break;
			}
			break;
		}
	}
	componentWillMount() {
		console.log(this.props)
	}
	componentDidMount() {
		const { actions: { getNewsList } } = this.props;
		console.log(this.props)
		console.log(this.props.getNewsList)
		getNewsList({}, { tag: '新闻', is_draft: false });

		// // 视频一
		// $(".firstVideo").mouseover(function () {
		// 	$(".firstVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".firstIcon").css({ display: "block", zIndex: "100" })
		// })
		// $(".firstIcon").mouseover(function () {
		// 	$(".firstVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".firstIcon").css({ display: "block", zIndex: "100" })
		// })
		// $(".firstVideo").mouseout(function () {
		// 	$(".firstVideo").css({ "background-color": "", zIndex: "0" })
		// 	$(".firstIcon").css({ display: "none", zIndex: "0" })

		// })
		var boxs=document.getElementsByClassName("box")[0]
		console.log(boxs)
		boxs.onmouseover=function(){
			console.log("1111")
			boxs.classList.add("box")
		}
		boxs.onmouseout=function(){
			console.log("2222")
			boxs.classList.remove("box")
		}

		// // 视频二
		// $(".secondVideo").mouseover(function () {
		// 	$(".secondVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".secondIcon").css({ display: "block", zIndex: "101" })
		// })
		// $(".secondIcon").mouseover(function () {
		// 	$(".secondVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".secondIcon").css({ display: "block", zIndex: "101" })
		// })
		// $(".secondVideo").mouseout(function () {
		// 	$(".secondVideo").css({ "background-color": "", zIndex: "0" })
		// 	$(".secondIcon").css({ display: "none", zIndex: "0" })

		// })
		// 视频三
		// $(".thirdVideo").mouseover(function () {
		// 	$(".thirdVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".thirdIcon").css({ display: "block", zIndex: "101" })
		// })
		// $(".thirdIcon").mouseover(function () {
		// 	$(".thirdVideo").css({ "background-color": "#eee", zIndex: "100" })
		// 	$(".thirdIcon").css({ display: "block", zIndex: "101" })
		// })
		// $(".thirdVideo").mouseout(function () {
		// 	$(".thirdVideo").css({ "background-color": "", zIndex: "0" })
		// 	$(".thirdIcon").css({ display: "none", zIndex: "0" })

		// })
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

		console.log(this.state.video)
		return (
			<Blade style={{ height: "300px", background: "#eee" }} title="安全生产视频">
				{/* <Row >
					<Col style={{ height: "300px" }} span={16}>
						<video
							style={{ position: "relative" }}
							onClick={this.play.bind(this)}
							className="firstVideo"
							preload="auto"
							width="100%"
							height="100%"
							src={this.state.video}
						>
						</video>
						<Icon className="firstIcon" 
						onClick={this.play.bind(this)}
						style={{ fontSize: 60, width: "60px", height: "60px", display: "none", position: "absolute", top: "0", bottom: "0", left: "0", right: "0", margin: "auto" }} name="play-circle"></Icon>
					</Col>
					<Col style={{ height: "300px" }} span={8}>
						<Row style={{ height: "150px" }}>
							<video
								style={{ position: "relative" }}
								onClick={this.play.bind(this)}
								className="secondVideo"
								preload="auto"
								width="100%"
								height="100%"
								src={this.state.video}

							>
							</video>
							<Icon className="secondIcon" 
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px", display: "none", position: "absolute", top: "0", bottom: "0", left: "0", right: "0", margin: "auto" }} name="play-circle"></Icon>
						</Row>
						<Row style={{ height: "150px" }}>
							<video
								style={{ position: "relative" }}
								onClick={this.play.bind(this)}
								className="thirdVideo"
								preload="auto"
								width="100%"
								height="100%"
								src={this.state.video}

							>
							</video>
							<Icon className="thirdIcon" 
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px", display: "none", position: "absolute", top: "0", bottom: "0", left: "0", right: "0", margin: "auto" }} name="play-circle"></Icon>
						</Row>

					</Col>



				</Row> */}

				<div className="container">
					<div className="box" style={{width:"60%",height:"300px",float:"left"}}>
						<video
							// onClick={this.play.bind(this)}
							className="firstVideo"
							preload="auto"
							width="60%"
							height="300px"
							src={this.state.video}
						>
						</video>
						<Icon className="firstIcon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 60, width: "60px", height: "60px", display: "none"  }} name="play-circle"></Icon>
					</div>
					<div  className="box" style={{width:"40%",height:"150px", float:"right"}} >
						<video
							// onClick={this.play.bind(this)}
							className="firstVideo"
							preload="auto"
							width="40%"
							height="150px"
							src={this.state.video}
						>
						</video>
						<Icon className="firstIcon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px" }} name="play-circle"></Icon>
					</div>
					<div  className="box" style={{width:"40%",height:"150px",float:"right"}}>
						<video
							// onClick={this.play.bind(this)}
							className="firstVideo"
							preload="auto"
							width="40%"
							height="150px"
							src={this.state.video}
						>
						</video>
						<Icon className="firstIcon"
							onClick={this.play.bind(this)}
							style={{ fontSize: 30, width: "30px", height: "30px" }} name="play-circle"></Icon>
					</div>
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



import React, { Component } from 'react';
import { Table, Row, Col, Modal } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import $ from 'jquery';
import { Icon } from 'react-fa';
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
				const videos = newsListTT[3].down_file
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

		$(".box").mouseover(function(){
			$(".box").css({"background-color":"#eee",zIndex:"100"})
		})
		$(".box").mouseout(function(){
			$(".box").css({"background-color":"",zIndex:"0"})
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
			<Blade title="安全生产视频">
				<Row>
					<Col span={16}>
						<video
							className="box"
							preload="auto"
							width="300px"
							height="300px"
							src={"http://47.104.160.65:6510/media/documents/2018/01/1510116943014_APkNixj.mp4"}
						>
						</video>
						<Icon style={{widtg:"30px",height:"30px"}} className={"playBtn Icon Icon-play_b"}></Icon>
					</Col>
					<Col span={8}>
						<Row>
							<video
								preload="auto"
								width="200px"
								height="150px"
								src={"http://47.104.160.65:6510/media/documents/2018/01/1510116943014_APkNixj.mp4"}

							>
							</video>
						</Row>
						<Row>
							<video
								preload="auto"
								width="200px"
								height="150px"
								src={"http://47.104.160.65:6510/media/documents/2018/01/1510116943014_APkNixj.mp4"}

							>
							</video>
						</Row>

					</Col>



				</Row>


			</Blade>
		);
	}
}



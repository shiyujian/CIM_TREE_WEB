import React, { Component } from 'react';
import { Table, Row, Col, Modal, Popover } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import { base, PDF_FILE_API } from '_platform/api';
import { Link } from 'react-router-dom';
import styles from './styles.less';
import { getUser, clearUser, getPermissions, removePermissions } from '../../_platform/auth';


export default class Datum extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null
		}
	}

	componentDidMount() {
		// const {actions: {getDatumList,setnewdoc}} = this.props;
		// getDatumList().then(rst =>{
		// 	console.log('rst',rst)
		// 	const a =[];
		// 	rst.result.map(item=>{
		// 		if(item.extra_params.state && item.extra_params.state !== "作废"){
		// 			a.push(item)
		// 		}
		// 	});
		// 	setnewdoc(a)
		// });

		// const { actions: { getNewsList,getTasks} } = this.props;
		// console.log('this.props',this.props)
		// getNewsList();
		// getTasks();

		const { actions: { getTaskPerson} } = this.props;
		const { username = '', name = '',id = '', } = getUser();
		let user=getUser();
        getTaskPerson({userid:user.id});
        let ttt =getTaskPerson({userid:user.id});
        console.log('ttt',ttt)

	}

	clickNews(record, type) {
		if (type === 'VIEW') {
			this.setState({
				visible: true,
				container: record.description
			})
		}
	}

	// columns = [
	// 	{
	// 		title: '任务标题',
	// 		dataIndex: 'name',
	// 		width: 400
	// 	},
	// 	{
	// 		title: '提交时间',
	// 		width: 200,
	// 		render: (record) => {
	// 			return moment(record.extra_params.submitTime).format('YYYY-MM-DD HH:mm:ss');
	// 		}
	// 	},
	// 	{
	// 		title: '操作',
	// 		width: 100,
	// 		render: record => {
	// 			return (
	// 				<span>
	// 					<Popover content={this.genDownload(record.basic_params.files)}
	// 						             placement="right">
	// 						<a>查看</a>
	// 					</Popover>
	// 				</span>
	// 			)
	// 		}
	// 	},

	// ];

	columns = [
		{
			title: '任务标题',
			dataIndex: 'workflowactivity.workflow.name',
			key: 'workflowactivity.workflow.name',
			width: 400,
			render(text,record){
				if(text.length > 30){
					text = text.slice(0,30);
				}
				return <p>{text}</p>
			}
		},

		{
			title: '提交时间',
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
			render(record){
				console.log('rrrr',record)
				return (
					<span>
						{/*<a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>*/}
						<Link to={"/selfcare/task/198?state_id="+record.workflowactivity.current[0].id}><span>查看</span></Link>
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
		// const { tasks=[] } = this.props;
		const {
			home: {
				datum: {
					usertasks = []
				} ={}
			} = {}
		}=this.props
		// const { platform: { tasks = [] } } = this.props;
		console.log('task222',this.props.usertasks)
		return (
			<Blade title="待办任务">
			<Link to='/selfcare'>
					<span style={{ float: "right", marginTop: "-30px" }} >MORE</span>
				</Link>
				<div style={{marginBottom:'14px',marginTop:'-9px'}}><hr/></div>
				<div className="tableContainer">
					<Table
						bordered={true}
						dataSource={this.props.usertasks}
						columns={this.columns}
						pagination={{showQuickJumper:true,pageSize:5}}
						rowKey="pk"  pagination={{ pageSize: 8 }} />
				</div>

				<Modal title="预览" width={800} visible={this.state.visible}
					onOk={this.handleCancel.bind(this)} onCancel={this.handleCancel.bind(this)} footer={null}>
					<div style={{ maxHeight: '800px', overflow: 'auto' }}
						dangerouslySetInnerHTML={{ __html: this.state.container }} />
				</Modal>
			</Blade>

		);
	}



	// genDownload = (text)=>{
	// 	return(
	// 		text.map((rst, index) =>{
	// 			return (
	// 				<div key={index}>
	// 					<a onClick={this.previewFile.bind(this,rst)}>{rst.name}</a>
	// 				</div>)
	// 		})
	// 	)
	// };

	// previewFile(file) {
	// 	const {actions: {openPreview}} = this.props;
	// 	if(JSON.stringify(file) === "{}"){
	// 		return
	// 	}else {
	// 		const newfile ={
	// 			a_file :PDF_FILE_API+file.a_file,
	// 			download_url:file.download_url,
	// 			mime_type:file.mime_type,
	// 			misc:file.file,
	// 			name:file.name
	// 		};
	// 		openPreview(newfile);
	// 	}
	// }
}

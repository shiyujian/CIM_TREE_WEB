import React, {Component} from 'react';
import {Table, Row, Col, Modal,Popover} from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import {base, PDF_FILE_API} from '_platform/api';
import styles from './styles.less';


export default class News extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null
		}
	}

	columns = [
		{
			title: '文档标题',
			dataIndex: 'name',
			width: 400
		},
		{
			title: '发布时间',
			width: 200,
			render: (record) => {
				return moment(record.extra_params.submitTime).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{
			title: '操作',
			width: 100,
			render: record => {
				return (
					<span>
						<Popover content={this.genDownload(record.basic_params.files)}
							             placement="right">
							<a>预览</a>
						</Popover>
					</span>
				)
			}
		},

	];

	render() {

		const {NewDoc = []} = this.props;
		console.log(999,NewDoc);

		return (
			<Blade title="工程文档">
				<div className="tableContainer">
					<Table
						bordered={false}
						dataSource={NewDoc}
						columns={this.columns}
						rowKey="pk" size="small" pagination={{pageSize: 8}}/>
				</div>
			</Blade>
		);
	}

	componentDidMount() {
		const {actions: {getDatumList,setnewdoc}} = this.props;
		getDatumList().then(rst =>{
			console.log('rst',rst)
			const a =[];
			rst.result.map(item=>{
				if(item.extra_params.state && item.extra_params.state !== "作废"){
					a.push(item)
				}
			});
			setnewdoc(a)
		});
	}

	genDownload = (text)=>{
		return(
			text.map((rst, index) =>{
				return (
					<div key={index}>
						<a onClick={this.previewFile.bind(this,rst)}>{rst.name}</a>
					</div>)
			})
		)
	};

	previewFile(file) {
		const {actions: {openPreview}} = this.props;
		if(JSON.stringify(file) === "{}"){
			return
		}else {
			const newfile ={
				a_file :PDF_FILE_API+file.a_file,
				download_url:file.download_url,
				mime_type:file.mime_type,
				misc:file.file,
				name:file.name
			};
			openPreview(newfile);
		}
	}
}

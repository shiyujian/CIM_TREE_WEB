import React, {Component} from 'react';
import {Table, Radio, Button} from 'antd';
import {DOWNLOAD_FILE, PDF_FILE_API} from '../../../_platform/api';
import moment from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ProjectApprovalTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			radioVale: '1',
			tableList: [],
		}
	}

	setTableList(type, unit) {
		const {extra_params: {blockIndex = []}} = unit;
		if (blockIndex.length == 0) {//	查看是否填报了项目批文
			this.setState({
				tableList: [],
			})
		} else {
			if (type == 1) {
				let list = blockIndex.slice(0, 1);
				this.setState({
					tableList: this._getListFunc(list),
				})
			} else if (type == 2) {
				let list = blockIndex.slice(1, 4);
				this.setState({
					tableList: this._getListFunc(list),
				})
			} else {
				let list = blockIndex.slice(4, 11);
				this.setState({
					tableList: this._getListFunc(list),
				})
			}
		}
	}

	_getListFunc(list) {
		let arr = [];
		list.map(itm => {
			if (itm.workStatus === 'done') {
				arr.push(itm)
			}
		})
		return arr;
	}

	render() {
		return (
			<div style={{padding: '0 10px'}}>
				<RadioGroup value={this.state.radioVale} size="small" onChange={(e) => {
					let val = e.target.value;
					this.setState({
						radioVale: val,
					});
					this.setTableList(val, this.props.unit);
				}}>
					<RadioButton value="1">工程可行性研究阶段</RadioButton>
					<RadioButton value="2">方案设计阶段</RadioButton>
					<RadioButton value="3">施工图设计阶段</RadioButton>
				</RadioGroup>
				<div>
					<Table columns={this.columns} size="small"
						   dataSource={this.state.tableList}
						   rowKey='blockId'
					></Table>
				</div>
			</div>
		)
	}

	componentDidMount() {
		this.setTableList('1', this.props.unit);
	}

	componentWillReceiveProps(nextProps) {
		let {unit} = nextProps;
		if (unit !== this.props.unit) {
			this.setState({
				radioVale: '1',
			});
			this.setTableList('1', unit);
		}
	}

	//预览准备材料done
	previewFile(preFileInfo) {
		const {actions: {openPreview}} = this.props;
		let _file = {
			...preFileInfo,
			a_file: PDF_FILE_API + '/media' + preFileInfo.a_file.split('/media')[1]
		};
		openPreview(_file);
	}

	columns = [
		{title: '批复文件', dataIndex: 'name', key: 'name'},
		{title: '负责人', dataIndex: 'worker', key: 'worker'},
		{title: '审核人', dataIndex: 'maker', key: 'maker'},
		{
			title: '办理时间', dataIndex: 'uploadAt', key: 'uploadAt',
			render: uploadAt => {
				return moment(uploadAt).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{
			title: '操作', dataIndex: 'subject', key: 'subject', render: (subject) => {
			const {appfileList} = subject;
			const appfileLi = JSON.parse(appfileList);
			return (
				<div>
					{
						appfileLi.map(
							(appfile, index) => {
								return (
									<div key={index}>
										<Button
											onClick={this.previewFile.bind(this, appfile.response)}
										>预览</Button>
									</div>
								)
							}
						)
					}
				</div>
			)
		}
		},
	]


}

export default ProjectApprovalTab;
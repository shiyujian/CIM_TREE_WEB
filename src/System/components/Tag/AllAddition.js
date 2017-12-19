import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {fileTypes} from '../../../_platform/store/global/file';
import {SERVICE_API} from '../../../_platform/api';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class AllAddition extends Component {

	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			fileList: [],
			imagesList: [],
			buildCode:'',
		}
	}

	render() {
		const{
			AddVisible = false,
			newdoc={},
			filter=[],
			fileList = [],
		} = this.props;

		return (
			<div>
				<Modal title="批量添加"
				       width={920} visible={AddVisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Row>
						<Col span={6}>
							<Upload {...this.uploadProps}>
								<Button>
									<Icon type="upload"/>上传文档
								</Button>
							</Upload>
						</Col>
						<Col span={6}>
							{
								fileList.map((file, index) => {
									return <div key={index}>{file.name}</div>
								})
							}
						</Col>
					</Row>
				</Modal>
			</div>
		);
	}

	uploadProps = {
		name: 'file',
		action: `${SERVICE_API}/excel/upload-api/`,
		showUploadList: false,
		multiple: true,
		onChange: ({file}) => {
			const status = file.status;
			if (status === 'done') {
				const {actions: {changeDocs}} = this.props;
				changeDocs([{...file}])
			}
		},
	};

	cancel() {
		const {
			actions: {Adding,changeDocs},
			docs={}
		} = this.props;
		Adding(false);
		changeDocs();
	}

	save() {
		const {actions:{putdocument,Adding,gettaglist,changeDocs},fileList=[]} = this.props;
		let arry = [];
		fileList.map(file => {
			let files = file.response.Sheet1.slice(1);
			files.map((rst) =>{
				let obj ={
					code:rst[0],
					name:rst[1],
					unit:rst[2],
					simple:rst[3]
				};
				arry.push(obj)
			})
		});
		putdocument({code:'Taglist'},{metalist:arry}).then(rst =>{
			message.success('批量添加成功');
			changeDocs();
			Adding(false);
			gettaglist({code:'Taglist'}).then(rst =>{
				let newtaglists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newtaglists[index].on = index+1;
				});
				const {actions:{setnewtaglist}} = this.props;
				setnewtaglist(newtaglists);
			})
		})
	}

}

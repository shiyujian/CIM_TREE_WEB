import React, {Component} from 'react';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import {fileTypes} from '../../../_platform/store/global/file';
import {SERVICE_API,STATIC_DOWNLOAD_API} from '../../../_platform/api';
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
								<Button onClick={this.down.bind(this,true)}>
									<Icon type="download"/>下载文档
								</Button>
						</Col>
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

	down(){
		let down_load = "http://bimcd.ecidi.com:6542/media/documents/meta/model.xlsx";
		window.open(down_load);
	}

	cancel() {
		const {
			actions: {Adding,changeDocs},
			docs={}
		} = this.props;
		Adding(false);
		changeDocs();
	}

	save() {
		const {actions:{putdocument,Adding,getwplist,changeDocs},fileList=[],taglist=[]} = this.props;
		let files = fileList[0].response.sheet.slice(1);
		let newfile =[];
		let arrt =[];
		let filess =[];
		files.map(rst=>{
			let arry = rst[5].split("，");
			let code = rst[3];
			let name = rst[4];
			let extra = arry;
			let k = [code,name,extra];
			newfile.push(k)
		});
		newfile.map(file=>{
			let codes = file[2];
			codes.map(code =>{
				let find = taglist.filter(itm=>itm.code === code);
				if(file[3] === undefined){
					let s = [find[0]];
					file.push(s);
				}else{
					file[3].push(find[0]);
				}
			});
			 filess.push(file)
		});
		filess.map(file => {
			if(file[3][0] === undefined){
				let obj ={
					code:file[0],
					name:file[1],
				};
				arrt.push(obj)
			}else{
				let obj ={
					code:file[0],
					name:file[1],
					extra:file[3]
				};
				arrt.push(obj)
			}
		});
		putdocument({code:'wpitemtypes'},{metalist:arrt}).then(rst =>{
			message.success('批量添加成功');
			changeDocs();
			Adding(false);
			getwplist({code:'wpitemtypes'}).then(rst =>{
				let newwplists = rst.metalist;
				if(rst.metalist === undefined){
					return
				}
				rst.metalist.map((wx,index) => {
					newwplists[index].on = index+1;
				});
				const {actions:{setnewwplist}} = this.props;
				setnewwplist(newwplists);
			});
		})
	}

}

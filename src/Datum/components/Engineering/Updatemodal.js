import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
	Form, Input,Button, Row, Col, Modal, Upload,Progress,
	Icon, message, Table,Select,DatePicker
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
const Dragger = Upload.Dragger;
const Option = Select.Option;
let fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';

export default class Addition extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16}
	};
    state={
        progress:0,
        isUploading: false
    }

	render() {
		const{updatevisible = false,
			docs = [],
			newkey =[],
            judgeFile = ''
		} = this.props;
        let content = judgeFile.indexOf('照片') == -1 ? "支持 pdf、doc、docx 文件" : "支持 jpg、jpeg、png 文件";
        fileTypes = judgeFile.indexOf('照片') == -1 ? 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword' : 'image/jpg,image/jpeg,image/png';
        let {progress,isUploading} = this.state;
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = isUploading ? null : arr;
		const docCols = newkey.map(rst=>{
			if(rst.name === "文件名" ||rst.name === "卷册名" ||rst.name === "事件"|| rst.name === "名称"){
				return 	{
					title:rst.name,
					dataIndex:'name',
					key:rst.name
				}
			}else if(rst.name === "设计阶段"){
				return {
					title:rst.name,
                    key:rst.name,
					render: (doc,record,index) => {
						const { designstage = []} = this.props;
						return <Select placeholder="选择设计阶段" style={{width:130}}
                                       onChange={this.changeDesignStage.bind(this, rst.code,record,index)}>
							{
								designstage.metalist.map((data, index) => {
									return <Option key={index}
                                                   value={data.name}>{data.name}</Option>;
								})
							}
                        </Select>;
					}
				}
			}else if(rst.name === "专业"){
				return {
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						const {professionlist = []} = this.props;
						return <Select placeholder="专业" style={{width:200}}
						               onChange={this.changeprofessionlist.bind(this, rst.code,record,index)}>
							{
								professionlist.map((data, index) => {
									return <Option key={index}
									               value={data.name}>{data.name}</Option>;
								})
							}
						</Select>;
					}
				}
			}else if(rst.name.indexOf("日期") !== -1 || rst.name.indexOf("时间") !== -1){
				return{
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						return <DatePicker onChange={this.time.bind(this, rst.code,record,index)}/>;
					}
				}
			}
			else if(rst.name === "项目负责人"){
				return{
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						return <Input onChange={this.proj.bind(this, rst.code,record,index)}/>;
					}
				}
			}
			else if(rst.name === "专业负责人"){
				return{
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						return <Input onChange={this.prof.bind(this, rst.code,record,index)}/>;
					}
				}
			}
			else if(rst.name === "设计单位"){
				return{
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						return <Input onChange={this.unit.bind(this, rst.code,record,index)}/>;
					}
				}
			}
			else if(rst.name !== "操作"){
				return 	{
					title:rst.name,
					key:rst.name,
					render: (doc,record,index) => {
						return <Input onChange={this.company.bind(this, rst.code,record,index)}/>;
					}
				}
			}else{
				return{
					title:'操作',
					key:'操作',
					render: (doc) => {
						return (
							<a onClick={this.remove.bind(this, doc)}>删除</a>
						);
					}
				}
			}
		});

		return (
			<Modal title="更新资料"
			       width={920} visible={updatevisible}
			       closable={false}
                   footer={footer}
                   maskClosable={false}>
				<Form>
					<Row gutter={24}>
						<Col span={24} style={{marginTop: 16, height: 160}}>
							<Dragger {...this.uploadProps}
							         accept={fileTypes}
							         onChange={this.changeDoc.bind(this)}>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox"/>
								</p>
								<p className="ant-upload-text">点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									{content}
								</p>
							</Dragger>
							<Progress percent={progress} strokeWidth={5}/>
						</Col>
					</Row>
					<Row gutter={24} style={{marginTop: 35}}>
						<Col span={24}>
							<Table rowSelection={this.rowSelection}
							       columns={docCols}
							       dataSource={docs}
							       bordered rowKey="uid"/>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys) => {
			const {actions: {selectDocuments}} = this.props;
			selectDocuments(selectedRowKeys);
		}
	};

	cancel() {
		const {
			actions: {updatevisible},
		} = this.props;
		updatevisible(false);
        this.setState({
            progress:0
        })
	}

	uploadProps = {
		name: 'file',
		action: `${FILE_API}/api/user/files/`,
		showUploadList: false,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		beforeUpload(file) {
			const valid = fileTypes.indexOf(file.type) >= 0;
            const errorMsg = fileTypes.indexOf('image') == -1 ? '只能上传 pdf、doc、docx 文件！':'只能上传 jpg、jpeg、png 文件！';
			if (!valid) {
				message.error(errorMsg);
			}
			return valid;
			this.setState({ progress: 0 });
		},
	};

	changeDoc({file, fileList, event}) {
		const {
			docs = [],
			actions: {changeDocs}
		} = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		this.setState({
            isUploading: file.status === 'done' ? false : true
        })
		// console.log('file',file);
        if(event){
            let {percent} = event;
            if(percent!==undefined)
                this.setState({progress:parseFloat(percent.toFixed(1))});
        }
	}

	company(code,doc,record,event) {
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		let newname = code;
		let value = event.target.value;
		updoc[newname] = value;
		updoc.state ='正常状态';
		updoc.name = doc.name;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	changeDesignStage(code,record,index,event){
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		record.updoc[code] = event;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	changeprofessionlist(code,doc,record,event) {
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		updoc[code] = event;
		changeupdoc(updoc);
		console.log(666666, updoc);
		changeDocs(docs);
	}

	time(name,doc,record,event,data){
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		updoc[name] = data;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	proj(code,doc,record,event){
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		let value = event.target.value;
		updoc.projectPrincipal = {
			person_name:value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	prof(code,doc,record,event){
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		let value = event.target.value;
		updoc.professionPrincipal = {
			person_name:value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	unit(code,doc,record,event){
		const {
			docs = [],
			updoc ={},
			actions: {changeDocs,changeupdoc}
		} = this.props;
		let value = event.target.value;
		doc.updoc.designUnit = {
			name:value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	remove(doc) {
		const {
			docs = [],
			actions: {changeDocs}
		} = this.props;
		changeDocs(docs.filter(d => d !== doc));
        this.setState({
            progress:0
        })
	}

	save() {
		const {
			currentcode = {},
			updoc = {},
			docs = [],
			actions: {updatevisible, postDocument, getdocument,changeDocs}
		} = this.props;
		const promises = docs.map(doc => {
			const response = doc.response;
			let files=DeleteIpPort(doc);
			return postDocument({}, {
				code: `${currentcode.code}_${response.id}`,
				name: doc.name,
				obj_type: 'C_DOC',
				profess_folder: {
					code: currentcode.code, obj_type: 'C_DIR'
				},
				basic_params: {
					files:[files]
				},
				extra_params: {
					...updoc,
					submitTime: moment.utc().format()
				}
			});
		});
		message.warning('新增文件中...');
		Promise.all(promises).then(rst => {
			const {oldfile = {},currentcode = {},actions:{putdocument}}=this.props;
			message.success('新增文件成功！');
			putdocument({code:oldfile.code},{
				extra_params: {
						state: '作废'
				}
			});
			changeDocs([]);
			updatevisible(false);
			setTimeout(()=>{getdocument({code: currentcode.code})},1000)
		});
        this.setState({
            progress:0
        })
	}

}

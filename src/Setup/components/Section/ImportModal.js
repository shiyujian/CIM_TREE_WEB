import React, {Component} from 'react';
import {Modal, Tag, Upload, Icon, Row, Col, Button, Table, Card, message} from 'antd';
import {SERVICE_API} from '../../../_platform/api';
import './ImportModal.css'

class ToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorList: [],
			successList: [],
		}
	}

	uploadProps = {
		name: 'file',
		multiple: true,
		showUploadList: false,
		action: SERVICE_API + "/excel/upload-api/?t_code=t-02",
		onChange: ({file}) => {
			this.setState({
				errorList: [],
				successList: [],
			});
			const status = file.status;
			if (status === 'done') {
				// console.log(file.response)
				//TODO 成功和失败分离
				this.setState({
					errorList: file.response.errors,
					successList: file.response.WP.slice(2, file.response.WP.length),
				})
			}
		},
	};

	closeModal() {
		const {actions: {importModalAc}} = this.props;
		importModalAc(false)
	}

	//新增项目或编辑项目
	postProjectData() {
		const {
			actions: {getWbsProjectAc,postWorkPackageAc},
			tableList = [],
			createType
		} = this.props;
		const {successList} = this.state;
		if(successList.length === 0){
			message.warning('请先上传编码文件或检查上传的编码文件中存在的问题！');
			return;
		}
		let promises=successList.map((item)=>{
			let postData = {
				"name": item[1],
				"code": item[0],
				"description": "",
				"obj_type": createType,
				"status": "A",
				"version":"A",
				"extra_params": {},
				"parent": {
					"name": tableList[0]["name"],
					"code": tableList[0]["code"],
					"obj_type": tableList[0]["obj_type"]
				},
				"response_orgs": [],
			};
			return postWorkPackageAc({}, postData)
		});
		Promise.all(promises).then(()=>{
			message.success('新增成功！');
			getWbsProjectAc();
			this.closeModal();
		});
	}

	//下载模板
	_getTemplate() {
		const {
			templatesList = {},
		} = this.props;
		console.log(templatesList)
		if (templatesList['t-02']) { //TODO 模板下载的t-code暂未确定
			window.location.href = templatesList['t-02']
		} else {
			message.warning('暂无可用模板下载')
		}
	}
    
	render() {
		const {
			importVisible = false,
		} = this.props;
		const {successList,errorList} = this.state;
		return (
			<Modal
				title="导入创建"
				visible={importVisible}
				width="80%"
				okText="保存正确编码"
				cancelText="关闭"
				maskClosable={false}
				onOk={this.postProjectData.bind(this)}
				onCancel={this.closeModal.bind(this)}
			>
				<Row>
					<Col span={12}>
						<Button onClick={this._getTemplate.bind(this)}>
							<Icon type="download"/>下载文件模板
						</Button>
					</Col>
					<Col span={12}>
						<Upload {...this.uploadProps}>
							<Button>
								<Icon type="upload"/>上传编码文件
							</Button>
						</Upload>
					</Col>
				</Row>
				{
					(successList.length > 0 || errorList.length > 0) &&
					<Row style={{marginTop: '20px'}}>
						<Card title="检验结果">
							<Col span={11}>
								<Card title="检验通过">
									{
										successList.map((item,index)=>{
											return <Tag style={{marginBottom:'4px'}} key={index} color="#87d068">{`${item[0]}~${item[1]}`}</Tag>
										})
									}
								</Card>
							</Col>
							<Col span={11} offset={2}>
								<div className='error-import'>
									<Card title="检验未通过">
										{
											errorList.map((item,idx)=>{
												return <Tag style={{marginBottom:'4px'}} key={idx} color="#f50">{item}</Tag>
											})
										}
									</Card>
								</div>
							</Col>
						</Card>
					</Row>
				}
			</Modal>
		);
	}
}

export default ToggleModal
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input } from 'antd';
import {STATIC_DOWNLOAD_API,PDF_FILE_API} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import MakePlanPanel from './MakePlanPanel';
import './style/approvalPanelStyle.less'


export default class TipRender extends Component {

	static propTypes = {
	};

	//下载文件done
	downloadFile(download_url) {
		let downloadLink = STATIC_DOWNLOAD_API + '/media' + download_url.split('/media')[1]
		window.open(downloadLink);
	}
		
	//预览准备材料done
	previewFile(preFileInfo) {
		const {actions: {openPreview},currentBlock} = this.props;
		if(JSON.stringify(currentBlock) == "{}"){
			return
		}else {
			let _file = {
				...preFileInfo,
				a_file:  PDF_FILE_API + '/media' + preFileInfo.a_file.split('/media')[1]
			};
			openPreview(_file);
		}
	}
		
	getAppDocJSX(selectedBlock) {
		if (selectedBlock.subject) {
			const {appfileList} = selectedBlock.subject;
			const appfileLi = JSON.parse(appfileList);

		return (<div>
			{
				appfileLi.map(
					(appfile)=>{
						return(
						<div>
							{appfile.name}
							<Button
								size='small'
								onClick={this.previewFile.bind(this,appfile.response)}
							>预览</Button>
							<Button
								size='small'
								onClick={this.downloadFile.bind(this,appfile.response.download_url)}							
							>下载</Button>							
						</div>
						)
					}
				)
			}
		</div>);
		}
	}

	getPreDocJSX(selectedBlock) {
		if (selectedBlock.subject) {
			const {prefileList} = selectedBlock.subject;
			const prefileLi = JSON.parse(prefileList);

		return (<div>
			{
				prefileLi.map(
					(prefile)=>{
						return(
						<div>
							{prefile.name}
							<Button
								size='small'							
								onClick={this.previewFile.bind(this,prefile.response)}
							>预览</Button>
							<Button
								size='small'							
								onClick={this.downloadFile.bind(this,prefile.response.download_url)}
							>下载</Button>							
						</div>
						)
					}
				)
			}
		</div>);
		}
	}
	
	render() {

		const { selectedBlock = {} } = this.props;

		return (
			<Card title="详情预览" className='approval-panel-div'>

				<label>
				报审阶段
				</label>
				<Input value={selectedBlock.name} ></Input>

				<label>
				批复文件
				</label>
				{this.getAppDocJSX(selectedBlock)}

				<label>
				计划办理时间
				</label>
				<Input value={selectedBlock.subject.deadlineDate} ></Input>


				<label>
				实际办理时间
				</label>
				<Input value={selectedBlock.subject.realDoneAt} ></Input>

				<label>
				办理人
				</label>
				<Input value={selectedBlock.worker}></Input>

				<label>
				批文审核人
				</label>
				<Input value={selectedBlock.maker}></Input>

				<label>
				准备材料
				</label>
				<Input value={selectedBlock.subject.preparationHint} ></Input>
				{this.getPreDocJSX(selectedBlock)}


				<label>
				文件批复部门
				</label>
				<Input value={selectedBlock.subject.officeHint} ></Input>

				<label>
				联系方式
				</label>
				<Input value={selectedBlock.subject.phoneHint} ></Input>

				<label>
				联系地址
				</label>
				<Input value={selectedBlock.subject.addressHint} ></Input>

			</Card>
		);
	}
}

import React, {Component} from 'react';
import {Sidebar, Content} from '_platform/components/layout';
import ProjectUnitWrapper from '../../components/ProjectUnitWrapper';
import {Row,Col,Button,Select,Card,Input,Upload,Icon,DatePicker} from 'antd';
import { FILE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import './style/submit-panel.less';
const {TextArea} = Input;

export default class SubmitPanel extends Component {


	selectProject(project, unitProject, isAuto) {
		
		console.log('# project : ',project,'\n# unitP : ',unitProject,'\n# isAuto : ',isAuto );
	}

	deExpUploadProps = {
		name: 'designExplainFile',
		action: `${FILE_API}/api/user/files/`,
		headers: {
			authorization: 'authorization-text',
		},
		// accept: fileTypes,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		onChange: this.deExpHandleChange.bind(this),
	};

	deExpHandleChange(info) {
		let deExpFileList = info.fileList;
		this.setState({ deExpFileList });
	}

	render() {
		return (
			<div>
				<Sidebar>
					<div className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.selectProject}></ProjectUnitWrapper>
					</div>
				</Sidebar>

				<Content>
					<Card className="submit-panel">
					<Row>
						<Col span={8}>
							<label>项目名称：</label>
						</Col>
						<Col span={8}>
						<label>单位工程：</label>
						</Col>
						<Col span={8}>
						<label>交底人：</label>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
						<label>施工单位：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
						<Col span={8}>
						<label>设计单位：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
						<Col span={8} >
							<label>交底时间：</label>
							<DatePicker 
								onChange={(date) => {
								console.log('date:', date);
								this.setState({ deadlineDate: date })
								}}/>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
						<label>卷册名称：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
						<Col span={8}>
							<label>版本：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
						<Col span={8}>
							<label>专业：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
					</Row>
					<Row>
						<label>交底说明：</label>
						<TextArea rows={4}/>
					</Row>
					<Row>
					<label>附件：</label>
					<Upload {...this.deExpUploadProps}>
					<Button type='primary' size='small'>
						<Icon type='upload'/> 点击上传附件
					</Button>
					</Upload>
					</Row>
					<Row>
						<Col span={8}>
						<label>施工单位校核：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>
						</Col>
						<Col span={8}>
							<label>监理单位校核：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
						<Col span={8}>
							<label>建设单位校核：</label>
							<Select size={'small'} style={{ minWidth: 120 }}></Select>							
						</Col>
					</Row>
					<Row>
						<div className='buttons-div'>
						<Button className='submit-button' type='primary'>
							提交
						</Button>
						<Button className='submit-button'>
							保存
						</Button>
						</div>
					</Row>
					</Card>

				</Content>
			</div>
		);
	}
}
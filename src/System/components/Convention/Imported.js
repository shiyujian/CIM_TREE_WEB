import React, {Component} from 'react';
import {Modal, Input, Form, Button, Upload, message, Icon} from 'antd';
import {CODE_API, FILE_API} from '_platform/api';
import {sliceFile} from '_platform/components/panels/Dragger'

const FormItem = Form.Item;
const ButtonGroup = Button.Group;


export default class Imported extends Component {
	render() {
		const {sidebar = {}, imported = {}, actions: {changeImportedField}} = this.props;
		const {type = 1} = sidebar;
		let downloadUrl = `${CODE_API}/api/v1/data-template/dict/`;
		if (type === 2) {
			downloadUrl = `${CODE_API}/api/v1/data-template/code/`;
		}
		return (
			<Modal title="上传文件" visible={imported.visible}
			       footer={[
				       <Button onClick={this.cancel.bind(this)} key="back">取消</Button>,
				       <Button onClick={this.save.bind(this)} key="submit" type="primary">开始上传</Button>,
			       ]}>
				<a href={downloadUrl}>
					<Button><Icon type="download"/>下载文件模板</Button>
				</a>
				<Upload style={{marginLeft: 240}} {...this.uploadProps} action={downloadUrl}>
					<Button>
						<Icon type="upload"/>上传编码文件
					</Button>
				</Upload>
			</Modal>
		);
	}

	save() {
		const {
			addition = {},
			actions: {postFields, getFields, getSystemFields, clearImportedField}
		} = this.props;
		postFields({}, {
			name: addition.name,
			is_system_owned: addition.is_system_owned,
			is_flow: addition.is_flow
		}).then(rst => {
			if (rst) {
				//todo 成功提示
				clearImportedField();
			}
		})

	}

	cancel() {
		const {
			actions: {changeImportedField}
		} = this.props;
		changeImportedField('visible', false);
	}

	uploadProps = {
		name: 'file',
		headers: {
			authorization: 'authorization-text',
		},
		showUploadList: false,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		beforeUpload(file) {
			// const valid = file.type === 'application/pdf';
			// if (!valid) {
			// 	message.error('只能上传 word、dwg、pdf、excel 文件！');
			// }
			// return valid;
		},
		onChange: ({file}) => {
			if (file.status === 'done') {
				console.log(file);
				// onChange(sliceFile(file));
			}
		},
	};

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'antd';
import {STATIC_DOWNLOAD_API,PDF_FILE_API} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';

export default class TipRender extends Component {

	static propTypes = {
	};

	downloadFile(a_file) {
		let downloadLink = STATIC_DOWNLOAD_API + '/media' + a_file.split('/media')[1]

		window.open(downloadLink);
	}

	previewFile(currentBlock) {
        const {actions: {openPreview}} = this.props;
        if(JSON.stringify(currentBlock) == "{}"){
            return
        }else {
			let _file = {
				...currentBlock.fileInfo,
				a_file:  PDF_FILE_API + '/media' + currentBlock.fileInfo.a_file.split('/media')[1]
			};
			console.log('_file:',_file);

			openPreview(_file);
        }
	}

	render() {

		const { currentBlock = {} } = this.props;

		console.log('!!!!!!!!!!',PDF_FILE_API);

		return (
			<Card title="详情预览">
				<div>
					{console.log('viewinfo:state,props:\n', this.state, this.props)}
					
					当前正在预览批文：{currentBlock.name}<br />
					当前批文状态：{currentBlock.workStatus === 'done' ? '已经上传' : '未完成'}<br/>
					
					<Button 
						onClick={this.previewFile.bind(this, currentBlock)}
					>
						预览文档
					</Button>

					<Button
						onClick={this.downloadFile.bind(this, currentBlock.fileInfo.a_file)}
					>
						下载文档
					</Button>

				</div>

			</Card>
		);
	}
}

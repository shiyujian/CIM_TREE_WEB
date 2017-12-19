import React, {Component} from 'react';
import {Card} from 'antd';
import Preview from '../../../_platform/components/layout/Preview';

export default class Docs extends Component {
	render() {
		const {task: {subject = []} = {}} = this.props;
		return (
			<div>
				<h3>报审文件列表</h3>
				<Card title="设计报审文件" style={{margin: 20}} extra={<a key={0} href="#">批量下载</a>}>
					{
						subject.map((file = {}, index) => {
							return <a key={`${file.code}-${index}`} onClick={this.previewFile.bind(this, file)}>{file.name}</a>
						})
					}
				</Card>
				<Preview />
			</div>
		);
	}

	previewFile(file) {
		const {actions: {openPreview, closeLoading}} = this.props;
		openPreview(file);
		setTimeout(() => {
			closeLoading();
		}, 1500);
	}
}

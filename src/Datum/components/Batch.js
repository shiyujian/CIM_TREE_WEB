import React, {Component} from 'react';
import {Button, message} from 'antd';

export default class Batch extends Component {

	static propTypes = {};

	render() {
		const {actions: {changeAdditionField}} = this.props;
		return (
			<div>
				<Button onClick={changeAdditionField.bind(this, 'visible', true)}>新增</Button>
				<Button>移动至</Button>
				<Button onClick={this.remove.bind(this)}>删除</Button>
			</div>
		);
	}

	remove() {
		const {selectedDocs} = this.props;
		if (selectedDocs.length === 0) {
			message.warning('请先选择要删除的文件！');
			return;
		}
		const {
			tree: {current} = {},
			actions: {deleteDocument, getDocuments, filterLoad}
		} = this.props;
		let promises = selectedDocs.map(function (code) {
			return deleteDocument({code: code});
		});
		message.warning('删除文件中...');
		Promise.all(promises).then(() => {
			message.success('删除文件成功！');
			filterLoad(true);
			getDocuments({code: current})
				.then(() => {
					filterLoad(false);
				});
		}).catch(() => {
			message.error('删除失败！');
			filterLoad(true);
			getDocuments({code: current})
				.then(() => {
					filterLoad(false);
				});
		});
	}
}



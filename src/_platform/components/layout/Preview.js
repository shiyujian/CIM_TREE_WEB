import React from 'react';
import {connect} from 'react-redux';
import {message, Modal, Spin} from 'antd';
import {bindActionCreators} from 'redux';
import * as actions from '_platform/store/global/preview';
import {previewWord_API} from '../../api';
import './Preview.less';

@connect(
	state => {
		return {
			preview: state.platform.preview,
		}
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch)
	})
)
export default class Preview extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		console.log('preview rendering');
		const {
			preview: {
				previewVisible = false,
				loading = false,
			} = {}
		} = this.props;
		return (
			<Modal
			zIndex={1500}
			title="文件预览" footer={false} visible={previewVisible} className="preview" onOk={this.previewModal.bind(this)}
			       onCancel={this.previewModal.bind(this)} height="100%">
				{
					this.previewRender()
				}
			</Modal>
		)
	}

	previewRender() {
		const {
			preview: {
				previewUrl,
				previewType = 'office',
				canPreview = false,
			} = {}
		} = this.props;
		if (!canPreview) {
			return null
		} else {
			if (previewType === 'office') {
				return <iframe src={`${previewWord_API}${previewUrl}`}
				               width="100%" height="100%" frameBorder="0" style={{minHeight: 480}}/>
			} else {
				return <iframe src={`/pdfjs/web/viewer.html?file=${previewUrl}`}
				               width="100%" height="100%" scrolling="no" frameBorder="0" style={{minHeight: 480}}/>
			}
		}
	}

	previewModal() {
		const {actions: {closePreview}} = this.props;
		closePreview()
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.preview && !nextProps.preview.canPreview) {
			message.warning('暂不支持此类文件的预览！');
		}
	}
}
import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select,Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {WORKFLOW_MAPS, SubItem_WordTemplate, previewWord_API,STATIC_UPLOAD_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;



class ImgShow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: '',
		};
    }
    componentDidMount(){
		
	}


	//预览
	handlePreview = (e) => {
		this.setState({
		  previewImage: e.target.src,
		  previewVisible: true,
		});
	  }
	render() {
		const {img = []} = this.props;
		let {previewVisible,previewImage} = this.state
		return (
			<div style={{height:'100px',width:'100%',overflow:'auto',textAlign: 'left'}}>
				{
					img.map((item,index) => {
						return (
							<img style={{height:'100%',margin:'8px'}} src={`${SOURCE_API}${item}`} alt="" onClick={this.handlePreview}/>
						)
					})
				}
				<Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible:false})}>
					<img alt="无法预览" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		)
	}
}
export default ImgShow;
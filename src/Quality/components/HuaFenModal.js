import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Upload} from 'antd';
import {PDF_FILE_API,STATIC_DOWNLOAD_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,DOWNLOAD_FILE,SERVICE_USER_PWD} from '_platform/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';

export default class HuaFenModal extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    ok(){
        let str = document.getElementById('edit').value;
        this.props.ok(str);
    }
	render() {
        return(
                <Modal
                    onOk = {this.ok.bind(this)}
                    width={400}
                    visible = {this.props.visible}
                    onCancel = {this.props.cancel}
                    cancelText = '取消'
                    okText='确定'> 
                    <label style={{marginBottom:'10px'}}>输入名称:</label>
                    <br/>
                    <Input style={{marginBottom:'20px',marginTop:'10px'}} id = 'edit'/>
                </Modal>
        );
	}
}
const InputStyle = {
    width:'200px',
    margin:'10px'
}

// let testHoc = (Wcomponent) => class extends Component{

//     render(){
//         return(<Wcomponent {...props}/>)
//     }
// }
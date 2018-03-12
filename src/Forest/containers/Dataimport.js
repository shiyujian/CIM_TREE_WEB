import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store';
import {PkCodeTree,TreeTable} from '../components';
import {Table,Row,Col,Select,DatePicker,Button,Modal,Upload,Icon,message,Notification} from 'antd';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {nurseryLocation_template} from '_platform/api';
import { FOREST_API,SERVICE_API } from '_platform/api';
import {getUser} from '_platform/auth'
const { Option} = Select;
var moment = require('moment');
var download = window.config.nurseryLocation;
@connect(
	state => {
		const {forest,platform} = state;
		return {...forest,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Dataimport extends Component {
    user = {}
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	imgsrc: '',
        	title: ''
        }
    }
    componentDidMount() {
        if(!this.user.id){
            this.user = getUser();
        }
    }

	render() {
        let jthis = this;
        const props = {
            action: `${SERVICE_API}/excel/upload-api/`,
            headers: {
            },
            showUploadList: false,
            beforeUpload(file) {
                if(file.name.indexOf('xls') !== -1 || file.name.indexOf('xlxs') !== -1){
                    return true
                }else{
                    message.warning('只能上传excel文件')
                }
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    if (importData.length === 1) {
                        Notification.error({
                            message: `${info.file.name}解析失败`
                        });
                        return
                    }
                    jthis.handleExcelData(importData);
                    Notification.success({
                        message: `${info.file.name}解析成功`
                    });
                } else if (info.file.status === 'error') {
                    Notification.error({
                        message: `${info.file.name}解析失败，请检查输入`
                    });
                }
            },
        };
		return (
				<Body>
					<Main>
						<DynamicTitle title="定位数据导入" {...this.props}/>
						<Row style={{fontSize:"20px",margin:'30px 20px 20px 20px'}}>
                            <Col>
                                <span >请按照数据格式要求上传定位数据：</span>
                            </Col>                  
                        </Row>
                        <Row style={{fontSize:"20px", marginTop:'20px'}}>
                            <Col span={2}>
                                <Upload  {...props}>
                                    <Button type='primary' style={{fontSize: '14px'}}>
                                        点击上传
                                    </Button>
                                </Upload>
                            </Col>
                            <Col span={18}>
                                <span >只能上传xls/xlsx文件，且不超过10Mb，苗木定位数据模板</span>
                                <a onClick={this.onDownloadClick.bind(this)}>下载。</a>
                            </Col>                  
                        </Row>
					</Main>
				</Body>);
    }
    async handleExcelData(data) {
        const { actions: { postPositionData } } = this.props;
        data.splice(0, 1);
        let generateData = [];
        data.map(item => {
            let single = {
                // index:item[0] || '',
                SXM:item[1] || '',
                X:item[2] || '',
                Y:item[3] || '',
                H:item[4] || '',
            };
            generateData.push(single);
        })
        postPositionData({id:this.user.id},generateData).then(rst => {
            debugger
            if(rst.code){
                message.info('定位数据导入成功')
            }
        })
    }
    onDownloadClick(){
        window.open(download)
        // document.querySelector('#root').insertAdjacentHTML('afterend', '<iframe src="'+`${download}`+'" style="display: none"></iframe>')
    }
    beforeUpload(file) {
        if(file.name.indexOf('xls') !== -1 || file.name.indexOf('xlxs') !== -1){
            return true
        }else{
            message.warning('只能上传excel文件')
        }
    }
    onFileChangeChange(file){
        if(file.status === 'done'){
            debugger
        }
    }
}

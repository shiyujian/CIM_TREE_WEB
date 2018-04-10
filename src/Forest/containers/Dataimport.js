import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store';
import '../components/index.less';
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
    //
    user = {}
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	imgsrc: '',
            title: '',
            dataSource:[]
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
                let sections = JSON.parse(jthis.user.sections)
                if(file.name.indexOf('xls') !== -1 || file.name.indexOf('xlxs') !== -1){
                    if(sections.length === 0){
                        message.info('该用户未关联标段，不能上传文件。')
                        return false
                    }else{
                        return true
                    }
                }else{
                    message.warning('只能上传excel文件')
                    return false
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
        let columns = [{
			title:"序号",
			dataIndex: 'index',
		},{
			title:"编号",
			dataIndex: 'SXM',
		},{
			title:"X",
			dataIndex: 'X'
		},{
			title:"Y",
			dataIndex: 'Y'
		},{
			title:"H",
			dataIndex: 'H'
		},{
			title:"定位时间",
			dataIndex: 'CreateTime'
		}]
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
                                    <Button type='primary' style={{fontSize: '14px',marginLeft:21}}>
                                        点击上传
                                    </Button>
                                </Upload>
                            </Col>
                            <Col span={18}>
                                <span >只能上传xls/xlsx文件，且不超过10Mb，苗木定位数据模板</span>
                                <a onClick={this.onDownloadClick.bind(this)}>下载。</a>
                            </Col>                  
                        </Row>
                        <Content>
                            <Table bordered
                            columns={columns}
                            pagination={{showQuickJumper:true,pageSize:10}}
                            dataSource={this.state.dataSource}
                            />
                        </Content>
					</Main>
                    <Button type='primary' onClick={this.postData.bind(this)} style={{marginLeft:21}}>确定上传</Button>
				</Body>);
    }
    async handleExcelData(data) {
        let sections = JSON.parse(this.user.sections)
        let patt = /^\d{4,}-(?:0?\d|1[12])-(?:[012]?\d|3[01]) (?:[01]?\d|2[0-4]):(?:[0-5]?\d|60):(?:[0-5]?\d|60)$/;
        data.splice(0, 1);
        let dataSource = [];
        data.map(item => {
            if(item[0] !== ''){
                let single = {
                    index:item[0] || '',
                    Section:sections[0],
                    SXM:item[1] || '',
                    X:item[2] || '',
                    Y:item[3] || '',
                    H:item[4] || '',
                    CreateTime:item[5] || ''
                };
                if(!patt.test(single.CreateTime)){
                    message.info('第'+single.index+'条信息时间格式错误，请确认后再次提交');
                    return
                }
                dataSource.push(single);
            }
        })
        this.setState({dataSource})
    }
    postData(){
        const { actions: { postPositionData } } = this.props;
        const {dataSource} = this.state;
        if(dataSource.length === 0){
            message.info('上传数据不能为空');
            return;
        }
        postPositionData({id:this.user.id},dataSource).then(rst => {
            if(rst.code){
                message.info('定位数据导入成功')
            }else{
                message.error('定位信息导入失败，请确认模板正确！')
            }
        })
    }
    onDownloadClick(){
        window.open(download)
    }
}

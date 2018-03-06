import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store';
import {PkCodeTree,TreeTable} from '../components';
import {Table,Row,Col,Select,DatePicker,Button,Modal,Upload,Icon,message} from 'antd';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {nurseryLocation_template} from '_platform/api';
const { Option} = Select;
var moment = require('moment');
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
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	imgsrc: '',
        	title: ''
        }
    }
    componentDidMount() {
    }

	render() {
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
                                <Upload  
                                 style={{marginLeft: '20px'}}
                                 showUploadList={true}
                                 action='http://www.baidu.com'
                                 beforeUpload={this.beforeUpload.bind(this)}
                                >
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
    onDownloadClick(){
        let a = "http://bimcd.ecidi.com:6540/media/documents/2017/11/nurseryLocation.xlsx";
        document.querySelector('#root').insertAdjacentHTML('afterend', '<iframe src="'+`${a}`+'" style="display: none"></iframe>')
    }
    beforeUpload(file) {
        message.warning('上传失败，请稍后再试');
        // const {actions: {postFile}} = this.props;
        // let formdata = new FormData();
        // formdata.append('a_file',file);
        // formdata.append('name',file.name);
        // console.log(formdata)
        // postFile({},formdata).then(rst=>{
        //     if(rst.indexOf('error') == -1){
        //         message.success('上传成功');
        //     } else {
        //         message.error(`上传失败:${rst}`,3);
        //     }
        // });
        return false;
    }
}

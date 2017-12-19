import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/item';
import {actions as actions2} from '../store/cells';
import {actions as platformActions} from '_platform/store/global';
import {message,Select,Table,Input,Button,Upload,Modal,Spin,Radio,Carousel, Row, Col, Form} from 'antd';
import WorkflowHistory from './WorkflowHistory.js';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SOURCE_API,STATIC_DOWNLOAD_API,} from '_platform/api';
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
@connect(
	state => {
		const {item = {}} = state.quality || {};
		return item;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
		cellActions: bindActionCreators({...actions2}, dispatch),
	}),
)
export default class Query extends Component {

	static propTypes = {};
	constructor(props){
		super(props);		
		this.state={
		};
	}
	componentDidMount(){

	}
	render() {
		const {visible,pk} = this.props;
		return (
                {
                    visible &&
                    <Modal
                        width={800}
                        height={600}
                        title="验收详情"
                        visible={visible}
                        onCancel={() => {this.setState({selectedRow: null, detailModalVisible: false,wk:null})}}
                        footer={null}
                        maskClosable={false}
                    >
                        {this.getModalContent(pk)}
                    </Modal>
                }
		);
	}
	//生成模态框内容
	 getModalContent = async (wkpk) => {
        const {getWorkPackageDetail,getWorkflow} = this.props.cellActions
        let workpackage = await getWorkPackageDetail({pk:wkpk});
        let pk = workpackage.extra_params.workflowid || workpackage.extra_params.workflow_id || workpackage.extra_params.workflow || workpackage.extra_params.wfid;
        //显示流程详情
        let wk = await getWorkflow({pk:pk})
        const imgArr = workpackage.extra_params.img || []
        const file = workpackage.extra_params.file ? workpackage.extra_params.file : ''
        const formItemLayout = {
            labelCol: { span: 8},
            wrapperCol: { span: 12},
		}
        return (
            <div>
                <div style={{marginBottom: 10}}>
                    现场记录:
                </div>
                {!imgArr.length ? '暂无图片' :
                    <div style={{overflowX:'scroll',height:"500px"}}>
                        {
                            imgArr.map(x => (
								<img className="picImg" style={{margin:'8px'}} src={`${SOURCE_API}${x}`} alt=""/>
                                /*<div className="picDiv" style={{display:'inline'}}>
                                    <img className="picImg" style={{display:'inline'}} src={`${SOURCE_API}${x}`} alt=""/>
                                </div>*/
                            ))
                        }
                    </div>
                }
                <div style={{margin: '10px 0 10px 0'}}>
                    <span style={{marginRight: 20}}>附件:</span>
                    <span>
                        {file && file.length
                            ?
                            file.map((item) => {
                                return (<p><a href={`${STATIC_DOWNLOAD_API}${item.download_url}`}>{item.name}</a></p>)
                            })
                            :'暂无附件'
                        }
                    </span>
                </div>
				<WorkflowHistory wk={wk}/>
            </div>
        )
    }
}


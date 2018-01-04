import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,notification,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import {actions} from '../../store/workdata';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select;

@connect(
	state => {
        const {datareport: {workdata = {}} = {}, platform} = state;
		return {...workdata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class WorkDeleteCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            opinion:1,
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk});
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("workdata_doc_delete_visible",false);
        notification.success({
            message: '操作成功！',
            duration: 2
        });
    }
    // 点x消失
    oncancel() {
        this.props.closeModal("workdata_doc_delete_visible", false)
    }
    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        const {actions:{
            logWorkflowEvent,
            delDocList
        }} = this.props;
        
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let code_list = "";
        dataSource.map(item=>{
            item.delcode+=",";
            code_list += item.delcode;
        })
        let rst = await delDocList({},{code_list});
        if(rst.result){
            notification.success({
                message: '删除文档成功！',
                duration: 2
            });
        }else{
            notification.error({
                message: '删除文档失败！',
                duration: 2
            });
        }
    }
   //不通过
   async reject() {
    const { wk } = this.props
    const { actions: { deleteWorkflow } } = this.props
    let executor = {};
    let person = getUser();
    executor.id = person.id;
    executor.username = person.username;
    executor.person_name = person.name;
    executor.person_code = person.code;
    await logWorkflowEvent(
        {
            pk:wk.id
        },
        {
            state:wk.current[0].id,
            executor:executor,
            action:"退回",
            note:"不通过",
            attachment:null
        }
    );
    notification.success({
        message:"操作成功!",
        duration:2
    })
}
    onChange(e){
        this.setState({opinion:e.target.value})
    }
	render() {
        const columns =
        [{
            title: '序号',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: 'WBS编码',
            dataIndex: 'code',
        }, {
            title: '任务名称',
            dataIndex: 'name',
        }, {
            title: '项目/子项目',
            dataIndex: 'project',
        }, {
            title: '单位工程',
            dataIndex: 'unit',
        }, {
            title: '施工单位',
            dataIndex: 'construct_unit',
        }, {
            title: '施工图工程量',
            dataIndex: 'quantity',
        }, {
            title: '实际工程量',
            dataIndex: 'factquantity',
        }, {
            title: '计划开始时间',
            dataIndex: 'planstarttime',
        }, {
            title: '计划结束时间',
            dataIndex: 'planovertime',
        }, {
            title: '实际开始时间',
            dataIndex: 'factstarttime',
        }, {
            title: '实际结束时间',
            dataIndex: 'factovertime',
        }, {
            title: '上传人员',
            dataIndex: 'uploads',
        },]
		return (
            <Modal
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
            onCancel={this.oncancel.bind(this)}
            >
                <h1 style ={{textAlign:'center',marginBottom:20}}>删除审核</h1>
                <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    />
                <Row>
                    <Col span={2}>
                        <span>审查意见：</span>
                    </Col>
                    <Col span={4}>
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>不通过</Radio>
                        </RadioGroup>
                    </Col>
                    <Col span={2} push={14}>
                        <Button type='primary' onClick={this.submit.bind(this)}>
                            确认提交
                        </Button>
                        <Preview />
                    </Col>
                </Row>
                {
                    this.state.dataSource[0] && this.state.dataSource[0].deleteInfo && <Row>
                        <Col span={4}>
                            申请变更原因:{this.state.dataSource[0].deleteInfo}
                            <br/>
                        </Col>
                    </Row>
                }
                {
                    this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                }
            </Modal>
		)
    }
}

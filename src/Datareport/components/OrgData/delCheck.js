import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/orgdata';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions,...actions2}, dispatch)
	})
)
export default class DelCheck extends Component {

	constructor(props) {   
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        console.log("dataSource:",dataSource);
        this.setState({dataSource,wk})
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
        this.props.closeModal("dr_base_del_visible",false,"submit")
        notification.success({
            message:"操作成功"
        })
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent, deleteOrgList, getOrgPk}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        console.log("dataSource",dataSource);
        let data_list = [];
        dataSource.map((item, index) => {
            data_list.push({
                code:"" + item.code,
                parent:{
                    pk: ""+ item.pk,
                    code:"" + item.code,
                    obj_type:item.obj_type
                },
                version:'A'
            })
        })
        deleteOrgList({},{data_list: data_list}).then(rst => {
            console.log("rst:",rst);
        })
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{logWorkflowEvent}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent(
            {
                pk:wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '退回',
                note: '不通过',
                attachment: null,
            }
        );
        notification.success({
            message: "操作成功",
            duration: 2
        })
    }
    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }
	render() {
        const columns = [{
            title: '组织机构编码',
            dataIndex: 'code',
            key: 'Code',
        }, {
            title: '组织机构类型',
            dataIndex: 'extra_params.org_type',
            key: 'Type',
        }, {
            title: '参建单位名称',
            dataIndex: 'extra_params.canjian',
            key: 'Canjian',
        }, {
            title: '组织机构部门',
            dataIndex: 'name',
            key: 'Name',
        }, {
            title: '直属部门',
            dataIndex: 'extra_params.direct',
            key: 'Direct',
        }, {
            title: '负责项目/子项目名称',
            dataIndex: 'extra_params.project',
            key: 'Project',
        },{
            title: '负责单位工程名称',
            dataIndex: 'extra_params.unit',
            key: 'Unit'
        },{
            title: '备注',
            dataIndex: 'extra_params.remarks',
            key: 'Remarks'
        }]
		return (
            <Modal
            visible={true}
            width= {1280}
            // footer={null}
            onOk = {this.submit.bind(this)}
            onCancel = {this.props.closeModal.bind(this,"dr_base_del_visible",false)}
			maskClosable={false}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>删除审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
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
                            <Button type='primary'>
                                导出表格
                            </Button>
                        </Col>
                    </Row>
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                    }
                </div>
            </Modal>
		)
    }
}

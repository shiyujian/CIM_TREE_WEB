import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/persondata';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,Notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,USER_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
import '../index.less';
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
export default class ExpCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
            signatures:[]
        };
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        let tempData = [...dataSource];
        this.setState({dataSource,tempData,wk})
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        let tempData = [...dataSource];
        this.setState({dataSource,tempData,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("person_expcheck_visible", false, 'submit')
        Notification.success({
            message: "操作成功"
        })
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{deleteUserList,logWorkflowEvent,updateWpData,addDocList,putDocList,postPersonList,postAllUsersId,getOrgCode}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null})
        let dataList = this.state.dataSource.map((data) => {
            deleteUserList({pk:data.id}).then(rst => {
            })
        })
    }
    //不通过
    // async reject(){
    //     const {wk} = this.props
    //     const {actions:{deleteWorkflow}} = this.props
    //     await deleteWorkflow({pk:wk.id})
    // }
    async reject(){
        const {wk} = this.state;
        const {actions: {logWorkflowEvent}} = this.props;
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
                action: '拒绝',
                note: '不通过',
                attachment: null,
            }
        );
        Notification.success({
            message: "操作成功",
            duration: 2
        })
    };
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
        const {wk} = this.props;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'Index',
        }, {
            title: '人员编码',
            dataIndex: 'account.person_code',
            key: 'Code',
        }, {
            title: '姓名',
            dataIndex: 'account.person_name',
            key: 'Name',
        }, {
            title: '所在组织机构单位',
            dataIndex: 'account.organization',
            key: 'Org',
        }, {
            title: '所属部门',
            dataIndex: 'account.org_code',
            key: 'Depart',
        }, {
            title: '职务',
            dataIndex: 'account.title',
            key: 'Job',
        }, {
            title: '性别',
            dataIndex: 'account.gender',
            key: 'Sex'
        }, {
            title: '手机号码',
            dataIndex: 'account.person_telephone',
            key: 'Tel'
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'Email'
        }, {
            title: '二维码',
            // dataIndex: 'account.person_signature_url',
            // key: 'Signature'
            render:(record) => {
                if(record.account.relative_signature_url !== '') {
                    return <img style={{width: 60}} src={record.account.relative_signature_url}/>
                }else {
                    return <span>暂无</span>
                }
            }
        }]
        return (
            <Modal
            // key={Math.random()}
            visible={true}
            width= {1280}
            onOk={this.submit.bind(this)}
            onCancel = {() => this.props.closeModal("person_expcheck_visible",false)}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>删除审核</h1>
                    <Table 
                        style={{ marginTop: '10px', marginBottom:'10px' }}
                        className='foresttable'
                        columns={columns}
                        dataSource={this.state.tempData}
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
                            <Preview />
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

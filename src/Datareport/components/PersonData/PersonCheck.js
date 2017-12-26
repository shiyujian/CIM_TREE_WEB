import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/persondata';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,USER_API } from '_platform/api';
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
export default class PersonCheck extends Component {

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
        console.log("oijiioj:",dataSource);
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
        this.props.closeModal("dr_base_person_visible",false)
        message.info("操作成功")
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList,postPersonList,postAllUsersId,getOrgCode}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let data_list = [];
        
        let promises = JSON.parse(wk.subject[0].data).map((o) => {
            return getOrgCode({code: o.depart})
        })
        let rst = await Promise.all(promises);
        dataSource.map((item, index) => {
            console.log('item',item)
            data_list.push({
                "code": "" + item.code,
                "name":item.name,
                "basic_params":{
                    "photo":item.signature.download_url,
                    "signature":item.signature.a_file
                },
                "extra_params": {
                    "depart": item.depart,
                    "email":item.email,
                    "job":item.job,
                    "性别":item.sex,
                    "电话":item.tel,
                    "email":item.email
                },
                "obj_type":"C_PER",
                "org":{
                    "code":item.depart,
                    "obj_type": "C_ORG",
                    "pk": rst[index].pk,
                    "rel_type": "member"
                },
                "title":"title",
                "status": "A",
                "version": "A",
                "first_name":"",
                "last_name":""
            })                    
        })
        console.log('data_list',data_list)
        postPersonList({},{data_list:data_list}).then(rst => {
            console.log('rst', rst)
            if (rst.result.length) {
                message.success("审核成功");
            }
        })
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null})
        .then((rst) => {
            let personId = rst.id;
            postAllUsersId({id:personId})
            .then((item) => {})
        });
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
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
        console.log("thissd;ljfidg:",this.state.tempData);
        const {wk} = this.props;
        console.log("wk",wk);
        const columns = [{
            title: '人员编码',
            dataIndex: 'code',
            key: 'Code',
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'Name',
        }, {
            title: '所在组织机构单位',
            dataIndex: 'org',
            key: 'Org',
        }, {
            title: '所属部门',
            dataIndex: 'depart',
            key: 'Depart',
        }, {
            title: '职务',
            dataIndex: 'job',
            key: 'Job',
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'Sex'
        }, {
            title: '手机号码',
            dataIndex: 'tel',
            key: 'Tel'
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'Email'
        }, {
            title: '二维码',
            render:(record) => {
                console.log("record:",record);
                return (
                    <img style={{width:"60px"}} src = {record.signature.preview_url} />
                )
            }
        }];
		return (
            <Modal
			title="人员信息审批表"
			key={Math.random()}
            visible={true}
            width= {1280}
            footer={null}
            onCancel = {() => this.props.closeModal("dr_base_person_visible",false)}
			maskClosable={false}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
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
                            <Button type='primary'>
                                导出表格
                            </Button>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
                            </Button>
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

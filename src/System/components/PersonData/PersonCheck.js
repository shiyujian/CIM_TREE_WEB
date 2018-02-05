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
        console.log("wk:",wk);
        let dataSource = JSON.parse(wk.subject[0].data)
        let tempData = [...dataSource];
        console.log("tempData:",tempData);
        this.setState({dataSource,tempData,wk})
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        let tempData = [...dataSource];
        console.log("tempData:",tempData);
        this.setState({dataSource,tempData,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("dr_base_person_visible", false, 'submit')
        Notification.success({
            message: "操作成功"
        })
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        console.log("wk:",wk);
        // return;
        const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList,postPersonList,postAllUsersId,getOrgCode}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        // let data_list = [];
        
        // let promises = JSON.parse(wk.subject[0].data).map((o) => {
        //     return getOrgCode({code: o.depart})
        // })
        // let rst = await Promise.all(promises);
        // dataSource.map((item, index) => {               
        //     data_list.push({
        //         "code": "" + item.code,
        //         "name":item.name,
        //         "basic_params":{
        //             "photo":item.signature ? item.signature.download_url : '',
        //             "signature":item.signature ? item.signature.a_file : '',
        //             info: {
        //                 "技术职称":item.job,
        //                 "性别":item.sex,
        //                 "电话":"" + item.tel,
        //                 "邮箱":"" + item.email,
        //             }
        //         },
        //         "extra_params": {
        //             "depart": item.depart,
        //         },
        //         "obj_type":"C_PER",
        //         "org":{
        //             "code":item.depart,
        //             "obj_type": "C_ORG",
        //             "pk": rst[index].pk,
        //             "rel_type": "member"
        //         },
        //         "title":item.job,
        //         "status": "A",
        //         "version": "A",
        //         "first_name":"",
        //         "last_name":""
        //     })                    
        // })
        // postPersonList({},{data_list:data_list}).then(rst => {
        //     if (rst.result.length) {
        //         // Notification.success("审核成功");
        //     }
        // })
        logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null}).then((rst) => {
            let personId = rst.id;
            postAllUsersId({id:personId}).then(res => {
                console.log("res:",res);
            })
        });
    }
    //不通过
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
            title: '姓名',
            dataIndex: 'account.person_name',
            key: 'Name',
        }, {
            title: '所在组织机构单位',
            dataIndex: 'account.organization.name',
            key: 'Org',
        }, {
            title: '所属部门',
            dataIndex: 'account.organization.name',
            key: 'Depart',
        }, {
            title: '职务',
            dataIndex: 'basic_params.info.技术职称',
            key: 'Job',
        }, {
            title: '性别',
            dataIndex: 'basic_params.info.性别',
            key: 'Sex'
        }, {
            title: '手机号码',
            dataIndex: 'basic_params.info.电话',
            key: 'Tel'
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'Email'
        }, {
            title: '二维码',
            render:(record) => {
                if(record.account.person_avatar_url) {
                    return <img style={{width: 60}} src={record.account.person_avatar_url}/>
                }else {
                    return <span>暂无</span>
                }
            }
        }];
		return (
            <Modal
            visible={true}
            width= {1280}
            onOk={this.submit.bind(this)}
            onCancel = {() => this.props.closeModal("dr_base_person_visible",false)}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>填报审核</h1>
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

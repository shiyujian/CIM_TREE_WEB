import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/DesignData';
import {actions as platformActions} from '_platform/store/global';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col,DatePicker,Select } from 'antd';
import WorkflowHistory from '../WorkflowHistory'
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import {getUser} from '_platform/auth';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 
import moment from 'moment';
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const {Option} = Select
const { TextArea } = Input;
@connect(
	state => {
		const {datareport: {designdata = {}} = {}, platform} = state;
		return {...designdata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Check extends Component {

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
        let dataSource = this.addindex(JSON.parse(wk.subject[0].data))
        this.setState({dataSource,wk});
        const {actions:{
            getScheduleDir,
            postScheduleDir,
        }} = this.props;
        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(!topDir.obj_type){
            let postData = {
                name:'数据报送的顶级节点',
                code:'the_only_main_code_datareport',
                "obj_type": "C_DIR",
                "status": "A",
            }
            topDir = await postScheduleDir({},postData);
        }
        this.setState({topDir});
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = this.addindex(JSON.parse(wk.subject[0].data))
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("design_check_visbile",false)
        message.info("操作成功")
    }
    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        const {actions:{
            logWorkflowEvent,
            addDocList,
            getScheduleDir,
            postScheduleDir,
            getWorkPackageDetailpk
        }} = this.props;
        //the unit in the dataSource array is same
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'datareport_designdata';
        //get workpackage by unit's code 
        let workpackage = await getWorkPackageDetailpk({pk:unit.pk});
        
        let postDirData = {
            "name": '设计信息目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'designdata_wp_dirctory', // 自定义，要确保唯一性
            }],
            "parent":{"pk":topDir.pk,"code":topDir.code,"obj_type":topDir.obj_type}
        }
        let dir = await getScheduleDir({code:code});
        //no such directory
        if(!dir.obj_type){  
            dir = await postScheduleDir({},postDirData);
        }

        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        
        //prepare the data which will store in database
        const docData = [];
        let i=0;   //asure the code of every document only
        dataSource.map(item=>{
            i++;
            docData.push({
                code:'designdata'+moment().format("YYYYMMDDHHmmss")+i,
                name:item.file.name,
                obj_type:"C_DOC",
                status:'A',
                profess_folder: {code: dir.code, obj_type: 'C_DIR'},
                workpackages:[{
                    pk: workpackage.pk,
                    code: workpackage.code,
                    obj_type: workpackage.obj_type,
                    rel_type: 'designdata_wp_document', // 自定义，要确保唯一性
                }],
                related_projects:[{
                    pk:item.project.pk,
                    code:item.project.code,
                    obj_type:'C_PJ',
                    rel_type: 'designdata_pj_document'
                }],
                basic_params: {
                    files: [
                        {
                            a_file: item.file.a_file,
                            name: item.file.name,
                            download_url: item.file.download_url,
                            misc: "file",
                            mime_type: item.file.mime_type,
                            id:item.file.id
                        },
                    ]
                },
                extra_params:{
                    code:item.code,
                    filename:item.file.name,
                    pubUnit:item.pubUnit,
                    filetype:item.filetype,
                    stage:item.stage,
                    unit:item.unit,
                    project:item.project,
                    upPeople:item.upPeople,
                    major:item.major,
                    wbsObject:item.wbsObject,
                    designObject:item.designObject
                }
            })
        });
        let rst = await addDocList({},{data_list:docData});
        if(rst.result){
            message.success('创建文档成功！');
        }else{
            message.error('创建文档失败！');
        }
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
    cancel() {
    	this.props.closeModal("design_check_visbile",false)
    }
    addindex(arr) {
        arr.forEach((item,index) => {
            arr[index].index = ++index
        })
        return arr
    }
	render() {
        const columns = 
        [{
            title:'序号',
            dataIndex: 'index'
		}, {
			title: '文档编码',
			dataIndex: 'code'
		}, {
			title: '文档名称',
			dataIndex: 'name'
		}, {
			title:'项目/子项目名称',
            dataIndex:'project',
            render: (text, record, index) => (
                <span>
                    {record.project.name}
                </span>
            ),
		}, {
			title:'单位工程',
            dataIndex:'unit',
            render: (text, record, index) => (
                <span>
                    {record.unit.name}
                </span>
            ),
		}, {
			title:'项目阶段',
            dataIndex:'stage',
		}, {
			title:'提交单位',
            dataIndex:'pubUnit.name',
		}, {
			title:'文档类型',
            dataIndex:'filetype',
		}, {
			title:'专业',
            dataIndex:'major',
		}, {
			title:'描述的WBS对象',
            dataIndex:'wbsObject',
		}, {
			title: '描述的设计对象',
			dataIndex: 'designObject'
		}, {
            title: '上传人',
            dataIndex: 'upPeople'
        }, {
            title:'附件',
			render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,record.index-1)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
			}
        }]
		return (
            <Modal
			visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
			onCancel={this.cancel.bind(this)}
			>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>填报审核</h1>
                    <Table 
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
                        <Col span={2} push={16}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
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
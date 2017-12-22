import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,notification,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import {actions} from '../../store/safety';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select;

@connect(
	state => {
        const {datareport: {safety = {}} = {}, platform} = state;
		return {...safety, platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class SafetyDocCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            option:1,
            topDir:{},
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
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
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("safety_doc_check_visible",false);
        message.info("操作成功");
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        const {actions:{
            logWorkflowEvent,
            addDocList,
            getScheduleDir,
            postScheduleDir,
            getWorkpackagesByCode
        }} = this.props;
        debugger
        //the unit in the dataSource array is same
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'datareport_safetydoc_1112';
        //get workpackage by unit's code 
        let workpackage = await getWorkpackagesByCode({code:unit.code});
        
        let postDirData = {
            "name": '安全文档目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'safetydoc_wp_dirctory', // 自定义，要确保唯一性
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
                code:'safetydoc'+moment().format("YYYYMMDDHHmmss")+i,
                name:item.file.name,
                obj_type:"C_DOC",
                status:'A',
                profess_folder: {code: dir.code, obj_type: 'C_DIR'},
                "basic_params": {
                    "files": [
                        {
                          "a_file": item.file.a_file,
                          "name": item.file.name,
                          "download_url": item.file.download_url,
                          "misc": "file",
                          "mime_type": item.file.mime_type
                        },
                    ]
                  },
                extra_params:{
                    code:item.code,
                    filename:item.file.name,
                    pubUnit:item.pubUnit,
                    type:item.type,
                    doTime:item.doTime,
                    remark:item.remark,
                    upPeople:item.upPeople,
                    unit:item.unit.name,
                    project:item.project.name
                }
            })
        });
        let rst = await addDocList({},{data_list:docData});
        if(rst.result){
            notification.success({
                message: '创建文档成功！',
                duration: 2
            });
        }else{
            notification.error({
                message: '创建文档失败！',
                duration: 2
            });
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

    onChange(e){
        this.setState({option:e.target.value})
    }
	render() {
        const columns = [
            {
                title:'编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'项目名称',
                dataIndex:'projectName',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            },{
                title:'单位工程',
                dataIndex:'unit',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            },{
                title:'文件名称',
                dataIndex:'filename',
                width: '10%',
            },{
                title:'发布单位',
                dataIndex:'pubUnit',
                width: '10%',
            },{
                title:'版本号',
                dataIndex:'type',
                width: '10%',
            },{
                title:'实施日期',
                dataIndex:'doTime',
                width: '10%',
            },{
                title:'备注',
                dataIndex:'remark',
                width: '10%',
            },{
                title:'提交人',
                dataIndex:'upPeople',
                width: '10%',
            }, {
                title:'附件',
                width:"10%",
                render:(text,record,index) => {
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                            <span className="ant-divider" />
                            <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                        </span>)
                }
            }
        ];
		return (
            <Modal
			title="安全信息审批表"
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
                <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered />
                <Row>
                    <Col span={2}>
                        <span>审查意见：</span>
                    </Col>
                    <Col span={4}>
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.option}>
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
            </Modal>
		)
    }
}

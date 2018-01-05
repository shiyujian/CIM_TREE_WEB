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
export default class DocEditFileCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            option:1,
		};
    }
    async componentDidMount(){
        const {wk} = this.props;
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
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("safety_doc_edit_visible",false,'submit');
        notification.success({
            message:'操作成功'
        })
    }
    cancel() {
        this.props.closeModal("safety_doc_edit_visible", false);
      }
    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        const {actions:{
            logWorkflowEvent,
            putDocument
        }} = this.props;
        
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        
        const docData = [];
        dataSource.map(item=>{
            docData.push({
                code:item.docCode,
                status:'A',
                version: 'A',
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
                    filename:item.filename,
                    pubUnit:item.pubUnit,
                    type:item.type,
                    doTime:item.doTime,
                    remark:item.remark,
                    upPeople:item.upPeople,
                    unit:item.unit,
                    project:item.projectName
                }
            })
        });
        
        let rst = await putDocument({},{data_list:docData});
        if(rst.result){
            notification.success({
                message: '修改文档成功！',
                duration: 2
            });
        }else{
            notification.error({
                message: '修改文档失败！',
                duration: 2
            });
        }
    }
    //不通过
    async reject(){
        const {wk} = this.props
        // const {actions:{deleteWorkflow}} = this.props
        // await deleteWorkflow({pk:wk.id})
        const { actions:{ logWorkflowEvent }} = this.props;
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent(
            {
                pk:wk.id
            },{
                state:wk.current[0].id,
                executor:executor,
                action:'拒绝',
                note:'不通过',
                attachment:null
            }
        );
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
                title:'文档编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'项目名称',
                dataIndex:'projectName',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.projectName}
                    </span>
                ),
            },{
                title:'单位工程',
                dataIndex:'unit',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.unit}
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
            key={this.props.akey}
            visible={true}
            width= {1280}
            footer={null}
            onCancel={this.cancel.bind(this)}
			maskClosable={false}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>变更审核</h1>
                <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered />
                <Row>
                    <Col span={2}>
                        <span>审查意见：</span>
                    </Col>
                    <Col span={6}>
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.option}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>不通过</Radio>
                        </RadioGroup>
                    </Col>
                    {/* <Col span={2} push={14}>
                        <Button type='primary'>
                            导出表格
                        </Button>
                    </Col> */}
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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/CostListData';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
import '../index.less';
import moment from 'moment'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class PriceListExamine extends Component {

	constructor(props) {
		super(props);
		this.state = {
			wk:null,
            dataSource:[],
            option:1,
            topDir:{},
		}
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
        this.props.closeModal("cost_pri_ck_visible",false)
        message.info("操作成功")
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state
        const {actions:{
            logWorkflowEvent,
            addDocList,
            putDocList,
            postScheduleDir,
            getScheduleDir,
            getWorkpackagesByCode
        }} = this.props;
        //the unit in the dataSource array is same
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'datareport_pricelist_demo';
        //get workpackage by unit's code 
        let workpackage = await getWorkpackagesByCode({code:unit.code});
        
        let postDirData = {
            "name": '计价清算目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'pricelist_wp_dirctory', // 自定义，要确保唯一性
            }],
            "parent":{"pk":topDir.pk,"code":topDir.code,"obj_type":topDir.obj_type}
        }
        let dir = await getScheduleDir({code:code});
        //no such directory
        if(!dir.obj_type){  
            dir = await postScheduleDir({},postDirData);
        }
        
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
        dataSource.map(item => {
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
                    code: item.projectcoding,
                    subproject: item.project.name,
                    projectcoding:item.projectcoding,
                    total:item.total,
                    valuation: item.valuation,
                    rate: item.rate,
                    company: item.company,
                    remarks: item.remarks,
                    unitengineering: item.unit.name
                },
                workpackage: {
                    pk: item.unit.pk || "wp_pk",
                    code: item.unit.code,
                    obj_type: item.unit.obj_type,
                    rel_type: "related"
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
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }

	render() {
      const  columns = 
        [{
            title:'序号',
            dataIndex:'code',
            render:(text,record,index) => {
                console.log(text)
                return index+1
            }
        },{
            title:'项目/子项目',
            dataIndex:'subproject',
            render: (text, record, index) => (
                <span>
                    {record.project.name}
                </span>
            ),

        },{
            title:'单位工程',
            dataIndex:'unitengineering',
            render: (text, record, index) => (
                <span>
                    {record.unit.name}
                </span>
            ),
        },{
            title:'清单项目编码',
            dataIndex:'projectcoding'
        },{
            title:'计价单项',
            dataIndex:'valuation'
        },{
            title:'工程内容/规格编号',
            dataIndex:'rate'
        },{
            title:'计价单位',
            dataIndex:'company'
        },{
            title:'结合单价（元）',
            dataIndex:'total'
        },{
            title:'备注',
            dataIndex:'remarks'
        }]
		return(
			<Modal
                title="计价清单信息上传表"
                key={Math.random()}
				width = {1280}
				visible = {true}
                maskClosable={false}
                footer = {null}
			>
				<div>
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
            </div>
			</Modal>
		)
	}
}

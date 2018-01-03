import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/CostListData';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API, NODE_FILE_EXCHANGE_API} from '_platform/api';
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
export default class PriceListCheck extends Component {

	constructor(props) {
        super(props);
        this.header = ['序号','项目/子项目','单位工程','清单项目编号','计价单项',
						'工程内容/规格编号','计量单位','结合单价(元)','备注'];
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
            addTagList,
            sendTags,
            getWorkpackagesByCode,
            getScheduleDir
        }} = this.props;
        //the unit in the dataSource array is same
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'datareport_pricelist_check';
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
        const tagLists = [];
        let i=0;   //asure the code of every document only
        dataSource.map(item => {
            i++;
            tagLists.push({
                "name": 'priceListName' + moment().format("YYYYMMDDHHmmss")+i,
                "code": JSON.stringify(item.projectcoding),
                "obj_type": "C_QTO",
                "status": "A",
                "version": "A",
                "unit": "元",
                "unit_price": +item.total,
                "kind": "01",
                "description": "计价清单创建工程量项",
                "extra_params": {
                    code: item.code,
                    subproject: item.project.name,
                    projectcoding:item.projectcoding,
                    total:item.total,
                    valuation: item.valuation,
                    rate: item.rate,
                    company: item.company,
                    remarks: item.remarks,
                    unitengineering: item.unit.name
                },
                "workpackage":{
                    "pk":item.unit.pk || "wp_pk",
                    "code":item.unit.code, 
                    "obj_type":item.unit.obj_type,
                    "rel_type":"price_list_check"
                }
            })
        });
        let rst = await addTagList({},{data_list:tagLists});
        
        if(rst.result){
            notification.success({
                message: '创建工程量项成功！',
                duration: 2
            });
        }else{
            notification.error({
                message: '创建工程量项失败！',
                duration: 2
            });
        }
    }
    //不通过
    async reject(){
        const { wk } = this.state;
        const { actions: { logWorkflowEvent, } } = this.props;
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;

        await logWorkflowEvent( // step3: 提交填报 [post] /instance/{pk}/logevent/ 参数
            {
                pk: wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '退回',
                note: '不通过',
                attachment: null
            }
        );
        notification.success({
            message: '操作成功！',
            duration: 2
        });
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
        this.setState({option:e.target.value})
    }

    getExcel () {
        const {actions:{jsonToExcel}} = this.props;
		const showDs = this.state.dataSource;
		if(!showDs.length) {
			message.warn('至少需要一条数据');
			return;
		};
        let rows = [];
        rows.push(this.header);
        showDs.map((item,index) => {
            rows.push([index+1,item.project.name,item.project.code,item.projectcoding,item.valuation,item.rate,item.company,item.total,item.remarks]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            // console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink('计价清单下载',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
		}).catch(e => {
			console.log(e);
        })
        debugger;
    }

    //下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	render() {
      const  columns = 
        [{
            title:'序号',
            dataIndex:'code',
            render:(text,record,index) => {
                return record.key
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
                key="priceListCheck"
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
                    bordered 
                    pagination={{showQuickJumper:true,showSizeChanger:true,total:this.state.dataSource.length}} 
                    />
                <Row >
                    {
                        this.state.dataSource.length && 
                        <Col span={3} push={12} style={{ position: 'relative', top: -40, fontSize: 12 }}>
                            [共：{this.state.dataSource.length}行]
                        </Col>
                    }
                </Row>
                    
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
                        <Button type='primary' onClick={this.getExcel.bind(this)}>
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

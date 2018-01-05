import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/UnitData';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,Notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
import {actions as projactions} from '../../store/ProjectData';
import '../index.less';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions,...actions2,...projactions}, dispatch)
	})
)
export default class HandelChangeProjModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
		};
    }
    async componentDidMount(){
        const {wk} = this.props;
        let data = JSON.parse(wk.subject[0].data);
        this.setState({dataSource:data,wk});
    }
    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data);
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();        
        }else{
            await this.reject();
        }
        this.props.closeModal("dr_change_proj_visible",false,'submit');
        Notification.success({
            message: "操作成功"
        });
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,putDocListAc,putProjectListAc}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let dataList = this.state.dataSource.map(data=>{
            let rst = {
                code:data.code,
                version:'A',
                extra_params:{coordinate:data.coordinate}
            };
            if(data.relPer){
                rst.response_persons = [{
                    pk:data.relPer.pk,
                    code:data.relPer.code,
                    obj_type:data.relPer.obj_type
                }];
            }
            return rst;
        });
        let docList = this.state.dataSource.map(data=>{
            let rst = {
                code:data.related_documents[0].code,
                version:'A',
                extra_params:{
                    intro:data.intro,
                    area:data.area,
                    address:data.address,
                    cost:data.cost,
                    etime:data.etime,
                    stime:data.stime,
                    projType:data.projType,
                    range:data.range
                },
                basic_params:{
                    files:[
                        data.file,data.pic
                    ]
                }
            };
            return rst;
        });
        let rst = await putProjectListAc({},{data_list:dataList});
        let docRst = await putDocListAc({},{data_list:docList});
        if(rst && rst.result && rst.result.length>0){
            await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        }
    }
    beforeUpload(record,file){
        const fileName = file.name;
		// 上传到静态服务器
		const { actions:{uploadStaticFile} } = this.props;
		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
                     //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.file = loadedFile;
            record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
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
                action: '退回',
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
    beforeUpload(record,file){
        const fileName = file.name;
		// 上传到静态服务器
		const { actions:{uploadStaticFile} } = this.props;
		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
                     //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.file = loadedFile;
            record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
	render() {
     const  columns =  [{
        title: '编码',
        dataIndex: 'code',
        key: 'Code',
    }, {
		title: '项目/子项目名称',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '所属区域',
		dataIndex: 'area',
		key: 'Area',
	}, {
		title: '项目规模',
		dataIndex: 'range',
		key: 'Range',
	}, {
		title: '项目类型',
		dataIndex: 'projType',
		key: 'ProjType',
	}, {
		title: '项目地址',
		dataIndex: 'address',
		key: 'Address',
	}, {
		title: '项目红线坐标',
		render:(record)=>{
			return (<span>{record.coordinate||''}</span>);
		},
		key: 'Project',
	},  {
		title: '项目投资',
		dataIndex: 'cost',
		key: 'cost',
	},{
		title: '项目负责人',
		render:(record)=>{
			return (<span>{record.relPer?record.relPer.name:(record.response_persons[0]?record.response_persons[0].name:'')}</span>);
		},
		key: 'Remarks'
	}, {
		title: '计划开工日期',
		dataIndex: 'stime',
		key: 'Stime'
	}, {
		title: '计划竣工日期',
		dataIndex: 'etime',
		key: 'Etime'
	},{
		title: '简介',
		dataIndex: 'intro',
		key: 'Intro'
	}, {
		title: '附件',
		key: 'oper',
		render: (record) => (
            <a> {record.file ? record.file.name : '暂无'}</a>
		)
	}, {
		title: '项目图片',
		key: 'pic',
		render: (record) => (
            <a> {record.pic ? record.pic.name : '暂无'}</a>
		)
	}];
      let projname = this.state.project?this.state.project.name:'';
		return (
            <Modal
            visible={true}
            width= {1280}
            onOk={this.submit.bind(this)}
            onCancel = {() => this.props.closeModal("dr_change_proj_visible",false)}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>变更审核</h1>
                    <Table 
                        style={{ marginTop: '10px', marginBottom:'10px' }}
                        className='foresttable'
                        columns={columns}
                        dataSource={this.state.dataSource||[]}
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
                        this.state.wk && <WorkflowHistory wk={this.state.wk} />
                    }
                </div>
            </Modal>
        )
    }
}

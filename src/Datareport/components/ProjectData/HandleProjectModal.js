import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as projactions} from '../../store/ProjectData';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,Notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import Preview from '../../../_platform/components/layout/Preview';
import {actions as action2} from '../../store/quality';
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
		actions: bindActionCreators({ ...platformActions,...projactions,...action2}, dispatch)
	})
)
export default class HPModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
        }
    }
    async getPersonsList(dataSource){
        let perSet = {};
        let {getPersonByCode} = this.props.actions;
        for(let i=0;i< dataSource.length;i++){
            perSet[dataSource[i].projBoss] = await getPersonByCode({code:dataSource[i].projBoss});
        }
        return perSet;
    }
    async componentDidMount(){
        const {wk} = this.props
        //  const {actions:{ getWorkflow }} = this.props
        //  getWorkflow({pk:wk.id}).then(rst => {
        //      let dataSource = JSON.parse(rst.subject[0].data)
        //      this.setState({dataSource,wk:rst})
        //  })
        let dataSource = JSON.parse(wk.subject[0].data);
        let perSet = await this.getPersonsList(dataSource);
        this.setState({dataSource,wk,perSet});
    }

    async componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data);
        let perSet = await this.getPersonsList(dataSource);
        this.setState({dataSource,wk,perSet});
    }
    async submit(){
        if(this.state.opinion !==1){
            await this.reject();
        }
        let {postProjectAc ,getProjectAc,postProjectListAc,postDocListAc} = this.props.actions;
        let projRoot = await getProjectAc();
        let doclist = this.state.dataSource.map(data=>{
            data.pic.misc = 'pic';
            return{
                "code": data.code + 'REL_DOC_A',
                "name": data.name + '项目关联文档',
                "obj_type": "C_DOC",
                "status": "A",
                "version": "A",
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
            }
        });
        let doclistRst = await postDocListAc({},{data_list:doclist});
        if(doclistRst.result && doclistRst.result.length>0){
            let reldocs = doclistRst.result;
            let projList =  this.state.dataSource.map((data,index)=>{
                let per = this.state.perSet[data.projBoss];
                return{
                    "code": data.code,
                    "name": data.name,
                    "obj_type": "C_PJ",
                    response_persons:[{
                        code:per.code,
                        obj_type:per.obj_type,
                        response:'dutyPerson',
                        pk:per.pk
                    }],
                    "extra_params": {coordinate:data.coordinate},
                    "version": "A",
                    "status": "A",
                    "parent": {code:projRoot.code,obj_type:projRoot.obj_type,pk:projRoot.pk},
                    related_documents:[{
                        pk:reldocs[index].pk,
                        code:reldocs[index].code,
                        obj_type :reldocs[index].obj_type,
                        rel_type:'storeRelDoc'
                    }]
                }
            });
            let rst = await postProjectListAc({},{data_list:projList});
            if(rst.result &&rst.result.length>0){
                Notification.success({
                    message: '操作成功'
                });
                this.props.closeModal('dr_xm_xx_visible',false,'submit');
            }
        }
    }
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,postDocListAc,putProjectListAc}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let dataList = this.state.dataSource.map(data=>{

            return {
                code:data.code,
                parent:{
                    pk: data.pk,
                    code:data.code,
                    obj_type:data.obj_type
                },
                version:'A'
            };
        });
        let rst = await putProjectListAc({},{data_list:dataList});
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
        this.props.closeModal("dr_xm_xx_visible",false)
    };
    render(){ 

        const columns =
            [{
                title: '序号',
                dataIndex: 'index',
                key: 'Index',
            }, {
                title: '编码',
                dataIndex: 'code',
                key: 'Code',
            }, {
                title: '项目/子项目名称',
                dataIndex: 'name',
                key: 'Name',
            }, {
                title: '所属项目',
                dataIndex: 'genus',
                key: 'Genus',
            }, {
                title: '所属区域',
                dataIndex: 'area',
                key: 'Area',
            }, {
                title: '项目类型',
                dataIndex: 'projType',
                key: 'Type',
            }, {
                title: '项目地址',
                dataIndex: 'address',
                key: 'Address',
            }, {
                title: '项目规模',
                dataIndex: 'range',
                key: 'Range',
            }, {
                title: '项目红线坐标',
                dataIndex: 'coordinate',
                key: 'Coordinate',
            }, {
                title: '项目总投资（万元）',
                dataIndex: 'cost',
                key: 'Cost',
            }, {
                title: '项目负责人',
                render:(record)=>{
                    return(
                        <span>{this.state.perSet?this.state.perSet[record.projBoss].name:''}</span>
                    )
                },
                key: 'Duty'
            }, {
                title: '计划开工日期',
                dataIndex: 'stime',
                key: 'Stime'
            }, {
                title: '计划竣工日期',
                dataIndex: 'etime',
                key: 'Etime'
            }, {
                title: '项目简介',
                dataIndex: 'intro',
                key: 'Intro'
            }, {
                title: '附件',
                key: 'nearby',
                render: (record) => (
                    <a> {record.file.name || '暂无'}</a>
                )
            }, {
                title: '图片',
                key: 'pic',
                render: (record) => (
                    <a>{record.pic.name || '暂无'}</a>
                )
            }];
        return (
            <Modal
                visible={true}
                width={1280}
                onOk={this.submit.bind(this)}
                onCancel = {() => this.props.closeModal("dr_xm_xx_visible",false)}>
                <div>
                    <h1 style={{ textAlign: 'center', marginBottom: 20 }}>填报审核</h1>
                    <Table 
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                        className='foresttable'
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
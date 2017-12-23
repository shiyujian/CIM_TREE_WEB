import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as projactions} from '../../store/ProjectData';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import Preview from '../../../_platform/components/layout/Preview';
import {actions as action2} from '../../store/quality';
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
            radioValue:1
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

        if(this.state.radioValue !==1){
            return;
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
                message.info('创建成功');
                this.props.closeModal('dr_xm_xx_visible',false);
            }
        }
    }
    render(){       
        const columns =
            [{
                title: '序号',
                dataIndex: 'index',
                key: 'Index',
            }, {
                title: '项目编码',
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
                title="项目信息审批表"
                visible={true}
                width={1280}
                footer={null}>
                <div>
                    <h1 style={{ textAlign: 'center', marginBottom: 20 }}>结果审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <Row>
                        <Col span={2}>
                            <span>审查意见：</span>
                        </Col>
                        <Col span={4}>
                            <RadioGroup 
                             value = {this.state.radioValue||1}
                             onChange={(event) => {
                                this.setState({radioValue:event.target.value});
                            }}>
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
                        this.state.wk && <WorkflowHistory wk={this.state.wk} />
                    }
                </div>
            </Modal>
        )
    }

}
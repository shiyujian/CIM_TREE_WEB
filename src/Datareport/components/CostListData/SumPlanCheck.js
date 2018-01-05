import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/SumPlanCost';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
import moment from "moment";
import './TableStyle.less';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { datareport: { SumPlanCost = {} } = {}, platform } = state;
		return { ...SumPlanCost, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)
export default class SumSpeedExamine extends Component {

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
        //  const {actions:{ getWorkflow }} = this.props
        //  getWorkflow({pk:wk.id}).then(rst => {
        //      let dataSource = JSON.parse(rst.subject[0].data)
        //      this.setState({dataSource,wk:rst})
        //  })
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("dr_qua_jsjh_visible",false,'submit')
        notification.success({
            message:'操作成功'
        })
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        let i = 0;
        dataSource.map((o) => {
            i++;
            // 创建文档对象
            let doc = o.related_documents&&o.related_documents.find(x => {
                return x.rel_type === 'many_jsjh_rspeed'
            })
            if(doc){
                doclist_p.push({
                    code:doc.code,
                    extra_params:{
                        ...o
                    }
                })
            }else{
                // console.log('o',o)
                doclist_a.push({
                    code: "rel_doc_jsjh_" + moment().format("YYYYMMDDHHmmss") + i,
                    name:`rel_doc_jsjh_${o.unit.pk}`,
                    obj_type:"C_DOC",
                    status:"A",
                    version:"A",
                    workpackages:[{
                        code:o.unit.code,
                        obj_type:o.unit.obj_type,
                        pk:o.unit.pk,
                        rel_type:"many_jsjh_rspeed"
                    }],
                    extra_params:{
                        ...o
                    }
                })
            }
            //施工包批量
            // wplist.push({
            //     code:o.code,
            //     extra_params:{
            //         rate:o.rate,
            //         check_status:2
            //     }
            // })
        })
        await addDocList({},{data_list:doclist_a});
        await putDocList({},{data_list:doclist_p})
        // await updateWpData({},{data_list:wplist});
        notification.success({
            message:'创建文档成功'
        })
    }
    //不通过
    async reject(){
        const {wk} = this.state;
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
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }
    cancel() {
        this.props.closeModal("dr_qua_jsjh_visible", false);
      }
	render() {
        const columns = [
            {
              title: "序号",
              dataIndex: "number",
              render: (text, record, index) => {
                return index + 1;
              }
            },
            {
              title: "项目/子项目",
              dataIndex: "project",
              render: (text, record, index) => <span>{record.project.name}</span>
            },
            {
              title: "单位工程",
              dataIndex: "unit",
              render: (text, record, index) => <span>{record.unit.name}</span>
            },
            {
              title: "工作节点目标",
              dataIndex: "nodetarget"
            },
            {
              title: "完成时间",
              dataIndex: "completiontime"
            },
            {
              title: "支付金额（万元）",
              dataIndex: "summoney"
            },
            {
              title: "累计占比",
              dataIndex: "ratio"
            },
            {
              title: "备注",
              dataIndex: "remarks"
            }
          ]
		return (
            <Modal
            visible={true}
            width= {1280}
            footer={null}
            onCancel={this.cancel.bind(this)}
			maskClosable={false}
            >
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>填报审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <Row>
                        <Col span={2}>
                            <span>审查意见：</span>
                        </Col>
                        <Col span={6}>
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
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
                </div>
            </Modal>
		)
    }
}

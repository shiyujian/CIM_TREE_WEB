import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,notification,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import {actions} from '../../store/SumPlanCost';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';
import './TableStyle.less';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select;

@connect(
	state => {
		const { datareport: { SumPlanCost = {} } = {}, platform } = state;
		return { ...SumPlanCost, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)
export default class SumPlanChangeCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            option:1,
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk});
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }



   //test
   test(){
    const {dataSource,wk,topDir} = this.state;
    console.log('data',dataSource,wk,topDir)
    let delateArr = [];
    dataSource.map(item=>{
        delateArr.push(item.code)
    });

    // console.log(delateArr.join(','));
   }
   //提交
    async submit(){
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("dr_qua_jsjh_change_visible",false,'submit');
        notification.success({
            message:'操作成功'
        })
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        let doclist_c = [];
        dataSource.map(item=>{
            doclist_c.push({
                code:item.code,
                obj_type: "C_DOC",
                status:"A",
                version:"A",
                extra_params:item
            })
        });
        const {actions:{
            logWorkflowEvent,
            putDocList
        }} = this.props;
        
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        await putDocList({},{data_list:doclist_c}).then(rst =>{
            console.log('rst',rst);
            if(rst.result){
                notification.success({
                    message: '变更数据成功！',
                    duration: 2
                });
            }else{
                notification.error({
                    message: '变更数据失败！',
                    duration: 2
                });
            }
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
    //取消
    cancel() {
        this.props.closeModal("dr_qua_jsjh_change_visible", false);
      }
    onChange(e){
        this.setState({option:e.target.value})
    }
	render() {
        console.log(this.state.dataSource)
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
              dataIndex: "subproject"
            },
            {
              title: "单位工程",
              dataIndex: "unit"
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
                        <Button type='primary' onClick = {this.test.bind(this)}>
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

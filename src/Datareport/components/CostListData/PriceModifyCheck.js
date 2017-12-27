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
export default class PriceModifyCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
			wk:null,
            dataSource:[],
            option:1
		}
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
   //提交
    async submit(){
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("cost_pri_modify_visible",false)
        message.info("操作成功")
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state
        const {actions:{
            logWorkflowEvent,
            addDocList,
            addTagList,
            putDocList
        }} = this.props;

        let doclist_c = [];
        dataSource.map(item=>{
            doclist_c.push({
                code:item.code,
                obj_type: "C_QTO",
                status:"A",
                version:"A",
                extra_params:item
            })
        });
        let rst = await putDocList({},{data_list:doclist_c});
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        
        if(rst.result){
            notification.success({
                message: '变更工程量项成功！',
                duration: 2
            });
        }else{
            notification.error({
                message: '变更工程量项失败！',
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
    //radio变化
    onChange(e){
        this.setState({option:e.target.value})
    }

    cancel() {
        this.props.closeModal("cost_sum_cckk_visible", false);
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
            dataIndex:'subproject'

        },{
            title:'单位工程',
            dataIndex:'unitengineering'
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
                title="计价清单信息删除审批表"
                key={Math.random()}
				width = {1280}
				visible = {true}
                maskClosable={false}
                footer = {null}
                onCancel={this.cancel.bind(this)}
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

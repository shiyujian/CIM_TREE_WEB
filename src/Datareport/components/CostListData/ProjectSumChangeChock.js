import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,notification,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import {getUser} from '_platform/auth';
import {actions} from '../../store/WorkunitCost';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select;

@connect(
	state => {
        const {datareport: {WorkunitCost = {}} = {}, platform} = state;
		return {...WorkunitCost, platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class ProjectSumChangeChock extends Component {

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
   //提交
    async submit(){
        if(this.state.option === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("cost_sum_cckk_visible", false);
        message.info("操作成功");
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state;
        const {actions:{
            logWorkflowEvent,
            putDocList
        }} = this.props;
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
        await putDocList({},{data_list:doclist_c})
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
 
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
    }
    onChange(e){
        this.setState({option:e.target.value})
    }
    cancel() {
        this.props.closeModal("cost_pri_modify_visible", false);
      }
	render() {
        const columns = [
            {
              title: "序号",
              dataIndex: "index",
              render: (text, record, index) => {
                return index + 1;
              }
            },{
                title: '项目/子项目',
                dataIndex: 'subproject',
            }, {
                title: '单位工程',
                dataIndex: 'unit',
            }, {
                title: '清单项目编号',
                dataIndex: 'projectcoding',
            }, {
                title: '项目名称',
                dataIndex: 'projectname',
            }, {
                title: '计量单位',
                dataIndex: 'company',
            }, {
                title: '数量',
                dataIndex: 'number',
            }, {
                title: '综合单价(元)',
                dataIndex: 'total',
            }, {
                title: '备注',
                dataIndex: 'remarks',
            }
          ]
		return (
            <Modal
			title="工程量结算信息变更审批表"
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
            onCancel={this.cancel.bind(this)}
            >
                <h1 style ={{textAlign:'center',marginBottom:20}}>工程量结算变更审核</h1>
                <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered 
                    rowKey="key"
                    />
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

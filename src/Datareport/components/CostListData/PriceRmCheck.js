import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/CostListData';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API, NODE_FILE_EXCHANGE_API } from '_platform/api';
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
export default class PriceRmCheck extends Component {

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
        this.props.closeModal("cost_pri_rm_visible",false)
        message.info("操作成功")
    }

    //通过
    async passon(){
        const {dataSource,wk,topDir} = this.state
        const {actions:{
            logWorkflowEvent,
            addDocList,
            addTagList,
            removeDocList
        }} = this.props;
        
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let docList = []
        dataSource.map(item => docList.push(item.code))
        //prepare the data which will store in database
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let rst = await removeDocList({},{code_list:docList.join(',')});
        
        if(rst.result){ 
            notification.success({
                message: '删除工程量项成功！',
                duration: 2
            });
        }else{  
            notification.error({
                message: '删除工程量项失败！',
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
        debugger;
    }
    //radio变化
    onChange(e){
        this.setState({option:e.target.value})
    }

    getExcel () {
		const {actions:{jsonToExcel}} = this.props;
		const showDs = this.state.dataSource;
		if(!showDs.length) {
			message.warn('至少选择一条数据');
			return;
		};
        let rows = [];
        rows.push(this.header);
        showDs.map((item,index) => {
            rows.push([index+1,item.subproject,item.unitengineering,item.projectcoding,item.valuation,item.rate,item.company,item.total,item.remarks]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            // console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink('计价清单下载',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
		}).catch(e => {
			console.log(e);
		})
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
                key="priceRmCheck"
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
                    this.state.dataSource[0] && this.state.dataSource[0].deleteInfoNew && <Row>
                        <Col span={4}>
                            申请删除原因:{this.state.dataSource[0].deleteInfoNew}
                            <br/>
                        </Col>
                    </Row>
                }
                {
                this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                }
            </div>
			</Modal>
		)
	}
}

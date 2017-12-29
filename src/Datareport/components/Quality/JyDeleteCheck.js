import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class JianyanpiDelete extends Component {

	constructor(props) {
		super(props);
		this.state = {
            dataSource:[],
            opinion:1
		};
    }
    async componentDidMount(){
        const {wk} = this.props
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
        this.props.closeModal("dr_qua_jy_del_visible",false)
        message.info("操作成功")
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,delDocList}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let code_list = "";
        dataSource.map((o) => {
            debugger
            let doc = o.related_documents.find(x => {
                return x.rel_type === 'many_jyp_rel' || x.rel_type === 'many_jy_rel'
            })
            if(doc){
                //拼接code
                code_list += `${doc.code},`
            }
        })
        await delDocList({code_list:code_list})
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
        // let executor = {};
        // let person = getUser();
        // executor.id = person.id;
        // executor.username = person.username;
        // executor.person_name = person.name;
        // executor.person_code = person.code;
        // await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'退回',note:'滚',executor:executor,attachment:null});
    }
//radio变化
onChange(e){
    this.setState({opinion:e.target.value})
}   //预览
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
	render() {
        let columns = 
        [{
            title:'序号',
            width:"5%",
			dataIndex:'key',
			render: (text,record,index) => (
				record.key + 1
			),
		},{
			title:'项目/子项目',
            dataIndex:'project',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.project ? record.project.name : ''}
                </span>
            ),
		},{
			title:'单位工程',
            dataIndex:'unit',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.unit ? record.unit.name : ''}
                </span>
            ),
		},{
			title:'WBS编码',
            dataIndex:'code',
            width:"13%",
		},{
			title:'名称',
            dataIndex:'name',
            width:"13%",
		},{
			title:'检验合格率',
            dataIndex:'rate',
            width:"8%",
            render: (text, record, index) => {
				if(record.rate){
					return (
						<span>
							{(parseFloat(record.rate)*100).toFixed(1) + '%'} 
						</span>
					)
				}else{
					return (<span>-</span>)
				}
			}
		},{
			title:'质量等级',
            dataIndex:'level',
            width:"12%",
		},{
			title:'施工单位',
            dataIndex:'construct_unit',
            width:"12%",
            render: (text, record, index) => (
                <span>
                    {record.construct_unit ? record.construct_unit.name : "-"}
                </span>
            ),
		}, {
            title:'附件',
            width:"11%",
			render:(text,record,index) => {
				if(record.file.a_file){
					return (<span>
                        <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
				}else{
					return (<span>暂无</span>)
				}
			}
        }]
		return (
            <Modal
			title="检验信息删除"
            visible={true}
            width= {1280}
            key={this.props.visible}
            footer={null}
			maskClosable={true}>
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
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={2}>不通过</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span={2} push={14}>
                            <Button onClick={this.getExcel.bind(this)} type='primary'>
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
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
	getExcel(){
		let exhead = ['序号','项目/子项目','单位工程','WBS编码','名称','检验合格率','质量等级','施工单位'];
		let rows = [exhead];
		let excontent =this.state.dataSource.map((data,index)=>{
			let con_name = data.construct_unit ? data.construct_unit.name : '暂无'
			return [index+1,data.project.name,data.unit.name,data.code,data.name,data.rate||'',data.level||'',con_name,];
		});
		rows = rows.concat(excontent);
		const {actions:{jsonToExcel}} = this.props;
        jsonToExcel({},{rows:rows}).then(rst => {
            console.log(rst);
            this.createLink('检验信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
	}
}

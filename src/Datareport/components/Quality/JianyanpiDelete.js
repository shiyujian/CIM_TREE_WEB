import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
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
            checkers:[],//审核人下来框选项
            check:null,//审核人,
		};
    }
    componentDidMount(){
        const {actions:{getAllUsers},deleteData} = this.props
        if(deleteData.length){
            this.setState({dataSource:deleteData})
        }
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
    }
    componentWillReceiveProps(props){
        const {deleteData} = props
        this.setState({dataSource:deleteData})
    }
    //ok
	onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.props.onok(this.state.dataSource,per)
    }
//下拉框选择人
selectChecker(value){
    let check = JSON.parse(value)
    this.setState({check})
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
					return (<span>暂无</span>)
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
                    {record.construct_unit ? record.construct_unit.name : "暂无"}
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
            onCancel={this.props.oncancel}
            onOk={() => this.onok()}
			maskClosable={true}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>检验信息删除</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <div>
                    <span>
                        审核人：
                        <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                this.state.checkers
                            }
                        </Select>
                    </span> 
                    </div>
                    <div style={{marginTop:20}}>
                        注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                        &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                        &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                        &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                    </div>
                </div>
            </Modal>
		)
    }
}

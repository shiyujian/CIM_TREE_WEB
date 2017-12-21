import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions}, dispatch)
	})
)
export default class SafetySpecialCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[]
		};
    }
    async componentDidMount(){
        
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
        console.log('vip-dataSource1',dataSource);
    }
    
    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
        console.log('vip-dataSource2',dataSource);
   }
   //提交
    submit(){
        this.props.closeModal("Safety_Special_check_visible",false)
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
        // columns = [
        //     {
        //         title: '序号',
        //         dataIndex: 'index',
        //         width: '5%',
        //     }
        //     ,
        //     {
        //         title: '项目/子项目名称',
        //         dataIndex: 'projectName',
        //         width: '15%',
        //         render: (text, record, index) => {
        //             return <Select style={{ width: '100px' }} className="btn" onSelect={this.selectProject.bind(this)}>
        //                 {
        //                     this.state.projects
        //                 }
        //             </Select>
        //         }
        //     },
        //     {
        //         title: '单位工程',
        //         dataIndex: 'unitProject',
        //         width: '10%',
        //         width: '8%',
        //         render: (text, record, index) => {
        //             return <Select value={this.state.beginUnit} style={{ width: '100px' }} className="btn" onSelect={this.selectUnit.bind(this)}>
        //                 {
        //                     this.state.units
        //                 }
        //             </Select>
        //         }
        //     }, {
        //         title: '方案名称',
        //         dataIndex: 'scenarioName',
        //         width: '10%',
        //     }, {
        //         title: '编制单位',
        //         dataIndex: 'organizationUnit',
        //         width: '10%',
        //     }, {
        //         title: '评审时间',
        //         dataIndex: 'reviewTime',
        //         width: '10%',
        //     }, {
        //         title: '评审意见',
        //         dataIndex: 'reviewComments',
        //         width: '10%',
    
        //     }, {
        //         title: '评审人员',
        //         dataIndex: 'reviewPerson',
        //         width: '10%',
        //     }, {
        //         title: '备注',
        //         dataIndex: 'remark',
        //         width: '10%',
        //     }
        //     , {
        //         title:'附件',
        //         width:"10%",
        //         render:(text,record,index) => {
        //             return (<span>
        //                     <a onClick={this.handlePreview.bind(this,index)}>预览</a>
        //                     <span className="ant-divider" />
        //                     <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
        //                 </span>)
        //         }
        //     }
        // ];
        const columns = [
            {
                title:'编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'项目名称',
                dataIndex:'projectName',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            },{
                title:'单位工程',
                dataIndex:'unit',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            },{
                title:'文件名称',
                dataIndex:'filename',
                width: '10%',
            },{
                title:'发布单位',
                dataIndex:'pubUnit',
                width: '10%',
            },{
                title:'版本号',
                dataIndex:'type',
                width: '10%',
            },{
                title:'实施日期',
                dataIndex:'doTime',
                width: '10%',
            },{
                title:'备注',
                dataIndex:'remark',
                width: '10%',
            },{
                title:'提交人',
                dataIndex:'upPeople',
                width: '10%',
            }, {
                title:'附件',
                width:"10%",
                render:(text,record,index) => {
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                            <span className="ant-divider" />
                            <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                        </span>)
                }
            }
        ];
		return (
            <Modal
			title="安全信息审批表"
			key={Math.random()}
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}>
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
                            <RadioGroup onChange={this.onChange} value={this.state.value}>
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

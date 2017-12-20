import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {
    Table,
    Row,
    Col,
    Form,
    Modal,
    Button,
    Input,
    Popconfirm,
    notification
} from 'antd';
import {actions} from '../store/quality';
import {getUser} from '_platform/auth'
import { actions as platformActions } from '_platform/store/global';
import AddFile from '../components/SafetyDoc/AddFile';
import {getNextStates} from '_platform/components/Progress/util';

const Search = Input.Search;

@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)
class SafetyDoc extends Component {
	constructor(){
        super();
        this.state = {
            dataSource:[],
            selectedRowKeys: [],
			setEditVisiable:false,
        }
	}
	goCancel = () =>{
        this.setState({setEditVisiable:false});
    }
    onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}

	setEditData = (data,participants) =>{
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"安全管理信息批量录入",
			code:"TEMPLATE_032",
			description:"安全管理信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
						this.setState({addvisible:false})						
					})
		})
	}
	onAddClick = () =>{
		this.setState({setEditVisiable:true});
	}
	
	render() {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const columns = [
            {
                title:'编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'项目名称',
                dataIndex:'projectName',
                width: '10%',
            },{
                title:'单位工程',
                dataIndex:'unit',
                width: '10%',
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
                width:'10%',
                render:(text,record,index) => {
                    return <span>
                        <a>预览</a>
                        <span className="ant-divider" />
                        <a>下载</a>
                    </span>
                }
            }
        ];
		return (
            <Main>
            <DynamicTitle title="安全管理" {...this.props} />
				<Content>
				<Row style={{ marginBottom: "30px" }}>
                    <Col span={15}>
                        <Button 
                        style={{ marginRight: "30px" }}
                        onClick={()=>this.onAddClick()}
                        >发起填报</Button>
                        <Button 
                        style={{ marginRight: "30px" }}>申请变更</Button>
                        <Button 
                        style={{ marginRight: "30px" }}>申请删除</Button>
                        <Button 
                        style={{ marginRight: "30px" }}>导出表格</Button>
                        <Search
                            placeholder="请输入内容"
                            style={{ width: 200, marginLeft: "20px" }}
                        />
                    </Col>
                </Row>
					<Table 
					 columns={columns} 
					 dataSource={this.state.dataSource}
                     bordered
                     rowSelection={rowSelection}
					 style={{height:380,marginTop:20}}
					 pagination = {{pageSize:10}} 
					/>
				</Content>
				{
					this.state.setEditVisiable &&
					<AddFile {...this.props} oncancel={this.goCancel.bind(this)} akey={Math.random()*1234} onok={this.setEditData.bind(this)}/>
				}
			</Main>)
	}
};
export default Form.create()(SafetyDoc);
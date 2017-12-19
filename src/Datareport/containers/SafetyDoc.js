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

	setEditData = () =>{
		
	}
	onAddClick = () =>{
		debugger
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
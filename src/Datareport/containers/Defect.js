import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/quality';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button} from 'antd';
import DefectModal from '../components/Quality/DefectModal'
import './quality.less'
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Defect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible:false
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title:'项目',
			dataIndex:'project'
		},{
			title:'单位工程',
			dataIndex:'unit'
		},{
			title:'WBS编码',
			dataIndex:'code'
		},{
			title:'责任单位',
			dataIndex:'name'
		},{
			title:'事故类型',
			dataIndex:'rate'
		},{
			title:'上报时间',
			dataIndex:'level'
		},{
			title:'核查时间',
			dataIndex:'construct_unit'
		},{
			title:'整改时间',
			dataIndex:'code'
		},{
			title:'事故描述',
			dataIndex:'name'
		},{
			title:'排查结果',
			dataIndex:'rate'
		},{
			title:'整改期限',
			dataIndex:'level'
		},{
			title:'整改结果',
			dataIndex:'construct_unit'
		}, {
			title:'附件',
			render:(text,record,index) => {
				return <span>
					<a>预览</a>
					<span className="ant-divider" />
					<a>下载</a>
				</span>
			}
		}];
	}
	//批量上传回调
	setData(data){
		alert()
		this.setState({addvisible:false})
	}
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="检验批信息" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>批量导入</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="input search text"
						onSearch={value => console.log(value)}
						enterButton/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]}/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<DefectModal {...this.props} oncancel={() => {this.setState({addvisible:false})}} akey={Math.random()*1234} onok={this.setData.bind(this)}/>
				}
			</div>
		);
	}
}

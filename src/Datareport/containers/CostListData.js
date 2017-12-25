import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/CostListData';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message,Popconfirm} from 'antd';
import PriceList from '../components/CostListData/PriceList';
import {getUser} from '_platform/auth';
import './quality.less';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api.js';
var moment = require('moment');
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {CostListData = {}} = {}, platform} = state;
		return {...CostListData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class CostListData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible:false,
			dataSource: []
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
            title:'项目/子项目',
            dataIndex:'subproject',
        },{
            title:'单位工程',
            dataIndex:'unitengineering'
        },{
			title:'清单项目编号',
			dataIndex:'projectcoding'
		},{
			title:'计价单项',
			dataIndex:'valuation' 
		},{
			title:'工程内容/规格编号',
			dataIndex:'rate'
		},{
			title:'计量单位',
			dataIndex:'company'
		},{
			title:'结合单价（元）',
			dataIndex:'total'
		}, {
			title:'备注',
			dataIndex:'remarks'
		},{
			title: '删除',
			dataIndex:'edit',
			render: (text, record, index) => {
				return (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, index)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				)
			}
		}];
	}

	async componentDidMount () {
		const {actions:{
            getScheduleDir,
			postScheduleDir,
			getTagLists,
			getWorkPackageDetails,
			getSearcher
		}} = this.props;
		
		let dataSource = [];
		let data = await getSearcher({key:"priceListName"});
		data.result.map(item=>{
            // getDocument({code:item.code}).then(single=>{
				let temp = {
					code:item.extra_params.code,
					company:item.extra_params.company,
					rate:item.extra_params.rate,
					projectcoding:item.extra_params.projectcoding,
					remarks:item.extra_params.remarks,
					total:item.extra_params.total,
					valuation:item.extra_params.valuation,
					subproject: item.extra_params.subproject,
					unitengineering: item.extra_params.unitengineering
				}
                dataSource.push(temp);
				this.setState({dataSource});
            // })
		})

        // let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        // if(topDir.obj_type){
        //     let dir = await getScheduleDir({code:'datareport_pricelist_demo'});
		// 	console.log(dir);
		// 	debugger;
        //     if(dir.obj_type){
        //         if(dir.stored_documents.length>0){
		// 			this.generateTableData(dir.stored_documents);
		// 			let datas = await getSearcher({key:"helloname"})
		// 			console.log(datas);
        //         }
        //     }
		// }
	}

	// async generateTableData(data){
    //     const {actions:{
    //         getDocument,
    //     }} = this.props;
    //     let dataSource = [];
    //     console.log(data);
    //     data.map(item=>{
    //         getDocument({code:item.code}).then(single=>{
	// 			let temp = {
	// 				code:single.extra_params.code,
	// 				company:single.extra_params.company,
	// 				rate:single.extra_params.rate,
	// 				projectcoding:single.extra_params.projectcoding,
	// 				remarks:single.extra_params.remarks,
	// 				total:single.extra_params.total,
	// 				valuation:single.extra_params.valuation,
	// 				subproject: single.extra_params.subproject,
	// 				unitengineering: single.extra_params.unitengineering
	// 			}
    //             dataSource.push(temp);
	// 			this.setState({dataSource});
    //         })
	// 	})
	// }
	
	delete(index) {
		let { dataSource } = this.state
		dataSource.splice(index, 1)
		this.setState({ dataSource })
	}

	//批量上传回调
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"计价清单信息填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息填报",
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
						this.setState({addvisible:false}),
						message.info("发起成功")						
					})
		})
	}
	oncancel(){
		this.setState({addvisible:false})
	}
	setAddVisible(){
		this.setState({addvisible:true})
	}
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="计价清单" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>批量导入</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
						/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={this.state.dataSource} rowKey="key"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<PriceList {...this.props} oncancel={() => {this.setState({addvisible:false})}} onok={this.setData.bind(this)}/>
				}
			</div>
		);
	}
}

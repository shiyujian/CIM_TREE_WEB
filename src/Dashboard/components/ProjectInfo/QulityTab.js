import React, {Component} from 'react';
import {Table, Radio, Button,Spin} from 'antd';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let nameList=[];
class QulityTab extends Component{
	constructor(props) {
		super(props);
		this.state = {
			radioVale: '2',
			tableList: [],
			loading:false,
		}
	}
    render(){
        return(
			<Spin tip="加载中..." spinning={this.state.loading}>
				<div style={{padding: '0 10px',overflow:'hidden'}}>
					<RadioGroup value={this.state.radioVale} size="small" onChange={(e) => {
						let val = e.target.value;
						this.setState({
							radioVale: val,
						});
						// this.setTableList(val, this.props.unit);
					}}>
						{/*<RadioButton value="1">质量验收</RadioButton>*/}
						<RadioButton value="2">质量缺陷</RadioButton>
					</RadioGroup>
					<div>
						<Table columns={this.columns} size="small"
							   scroll={{y:200}}
							   pagination={false}
							   dataSource={this.state.tableList}
							   rowKey='id'
						></Table>
					</div>
				</div>
			</Spin>
		)
    }
	componentDidMount() {
    	if(this.props.unit){
			this._initQulityFunc(this.props.unit.code)
		}
	}
	componentWillReceiveProps(nextProps) {
		let {unit} = nextProps;
		if (unit !== this.props.unit) {
			this._initQulityFunc(unit.code)
		}
	}
	_initQulityFunc(code){
		this.setState({
			loading:true,
		})
    	const {actions:{getChildrenOrgTree,fetchDefectDataByLoc}}=this.props;
		getChildrenOrgTree({code:code})
			.then(rst=>{
				nameList=[];
				let list=QulityTab.loop(rst.children);
				if(list.length === 0){
					this.setState({
						tableList:[],
						loading:false,
					})
				}else{
					let promises=list.map((itm)=>{
						return fetchDefectDataByLoc({keyword:itm})
					})
					Promise.all(promises)
						.then(lists=>{
							let tableList=[]
							lists.map((ll)=>{
								tableList=tableList.concat(ll)
							});
							// console.log('tableList',tableList)
							this.setState({
								tableList:tableList,
								loading:false,
							})
						})
						.catch(()=>{
							this.setState({
								tableList:[],
								loading:false,
							})
						});
				}

			})
			.catch(()=>{
				this.setState({
					tableList:[],
					loading:false,
				})
			})
	}
	static loop(data = []) {
		data.map((item) => {
			if(item.obj_type === 'C_WP_PTR_S' || item.obj_type === 'C_WP_PTR'){
				// console.log(item.obj_type)
				nameList.push(item.name)
			}
			if (item.children && item.children.length) {
				QulityTab.loop(item.children)
			}
		});
		return nameList;
	};
	columns=[{
		title: '缺陷编码',
		dataIndex: 'id',
		key: 'id',
	}, {
		title: '缺陷级别',
		dataIndex: 'risk_level_c.name',
		key: 'risk_level_c.name',
	}, {
		title: '工程部位',
		dataIndex: 'project_location.project_name',
		key: 'project_location.project_name',
	},{
		title: '缺陷内容',
		dataIndex: 'risk_content',
		key: 'risk_content',
	},{
		title: '上报时间',
		dataIndex: 'created_on',
		key: 'created_on',
		render:(created_on)=>{
			return moment(created_on).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')
		}
	},{
		title: '整改时间',
		dataIndex: 'deadline',
		key: 'deadline',
	},
	// 	{
	// 	title: '审核时间==',
	// 	dataIndex: 'path',
	// 	key: 'path==',
	// },
		{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		render:(status)=>{
			switch(status){
				case 0:
					return "待确认";
				case 1:
					return "整改中";
				case 2:
					return "不认可";
				case 3:
					return "已完成";
				default:
					return ''
			}
		}
	}
	// ,{
	// 	title: '上报人==',
	// 	dataIndex: 'milestone',
	// 	key: 'milestone',
	// },{
	// 	title: '整改人==',
	// 	dataIndex: 'milestone',
	// 	key: 'milestone',
	// },{
	// 	title: '审核人==',
	// 	dataIndex: 'milestone',
	// 	key: 'milestone',
	// }
	]
}

export default QulityTab;
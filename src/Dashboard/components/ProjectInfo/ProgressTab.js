import React, {Component} from 'react';
import {Table, Radio, Button,Spin} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ProgressTab extends Component{
	constructor(props) {
		super(props);
		this.state = {
			radioVale: '1',
			tableList: [],
			loading:true,
		}
	}
    render(){
    	const columns = this.state.radioVale == 1 ? this.columns_plan : this.columns_plan;
        return(
			<Spin tip="加载中..." spinning={this.state.loading}>
				<div style={{padding: '0 10px'}}>
					<RadioGroup value={this.state.radioVale} size="small" onChange={(e) => {
						let val = e.target.value;
						this.setState({
							radioVale: val,
						});
						// this.setTableList(val, this.props.unit);
					}}>
						<RadioButton value="1">进度计划</RadioButton>
						{/*<RadioButton value="2">施工进度</RadioButton>*/}
					</RadioGroup>
					<div>
						<Table columns={columns} size="small"
							   dataSource={this.state.tableList}
							   rowKey='code'
						></Table>
					</div>
				</div>
			</Spin>
		)
    }
	componentDidMount() {
		this._getScheduleFunc(this.props.unit.code);
	}
	componentWillReceiveProps(nextProps) {
		let {unit} = nextProps;
		if (unit !== this.props.unit) {
			this._getScheduleFunc(unit.code)
		}
	}
	_getScheduleFunc(code){
		const {actions:{getImodelInfoAc}}=this.props;
		this.setState({
			loading:true,
		})
		getImodelInfoAc({pk:'schedule_'+code}).then((rst)=>{
			if(rst.pk){
				const {extra_params:{scheduleMaster=[]}}=rst;
				this.setState({
					tableList:scheduleMaster
				})
			}else{
				this.setState({
					tableList:[]
				})
			}
			this.setState({
				loading:false,
			})
		})
	}

	columns_plan = [{
		title: 'WBS编码',
		dataIndex: 'code',
		key: 'code',
	}, {
		title: '任务名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '作业类别',
		dataIndex: 'type',
		key: 'type',
	},{
		title: '计划工期',
		dataIndex: 'schedule',
		key: 'schedule',
	},{
		title: '计划开始时间',
		dataIndex: 'startTime',
		key: 'startTime',
	},{
		title: '计划结束时间',
		dataIndex: 'endTime',
		key: 'endTime',
	},{
		title: '关键是否',
		dataIndex: 'path',
		key: 'path',
	},{
		title: '里程碑是否',
		dataIndex: 'milestone',
		key: 'milestone',
	}]

	columns_real = [{
		title: 'WBS编码',
		dataIndex: 'code',
		key: 'code',
	}, {
		title: '任务名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '作业类别',
		dataIndex: 'type',
		key: 'type',
	}, {
		title: '单位',
		dataIndex: 'type',
		key: 'type',
	}, {
		title: '工程数量',
		dataIndex: 'type',
		key: 'type',
	},{
		title: '计划工期',
		dataIndex: 'schedule',
		key: 'schedule',
	},{
		title: '计划开始时间',
		dataIndex: 'startTime',
		key: 'startTime',
	},{
		title: '实际开始时间',
		dataIndex: 'endTime',
		key: 'endTime',
	},{
		title: '计划结束时间',
		dataIndex: 'endTime',
		key: 'endTime',
	},{
		title: '实际结束时间',
		dataIndex: 'endTime',
		key: 'endTime',
	},{
		title: '关键是否',
		dataIndex: 'path',
		key: 'path',
	},{
		title: '里程碑是否',
		dataIndex: 'milestone',
		key: 'milestone',
	}
	]
}

export default ProgressTab;
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/SumSpeedCost';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message} from 'antd';
import {getUser} from '_platform/auth';
import SumSpeed from '../components/CostListData/SumSpeed';
import SumSpeedDelete from '../components/CostListData/SumSpeedDelete';
import './quality.less';
import {WORKFLOW_CODE} from '_platform/api.js';
import {getNextStates} from '_platform/components/Progress/util';


var moment = require('moment');
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
export default class BalanceSchedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
            addvisible:false,
            deletevisible:false,
            selectedRowKeys: [],
            dataSourceSelected:[],
		};
		this.columns =[
            {
              title: "序号",
              dataIndex: "number",
              render: (text, record, index) => {
                return index + 1;
              }
            },
            {
              title: "项目/子项目",
              dataIndex: "project"
            },
            {
              title: "单位工程",
              dataIndex: "unit"
            },
            {
              title: "工作节点目标",
              dataIndex: "nodetarget"
            },
            {
              title: "完成时间",
              dataIndex: "completiontime"
            },
            {
              title: "支付金额（万元）",
              dataIndex: "summoney"
            },
            {
              title: "累计占比",
              dataIndex: "ratio"
            },
            {
              title: "备注",
              dataIndex: "remarks"
              },
          ];
    }
    async componentDidMount(){
      const {actions:{getAllresult}} =this.props;
      let dataSource =[];
      getAllresult ().then(o=>{
        let dataSource = [];
        o.result.map(single=>{
          let temp = {
            project: single.extra_params.project.name,
            nodetarget: single.extra_params.nodetarget,
            completiontime: single.extra_params.completiontime,
            remarks: single.extra_params.remarks,
            ratio: single.extra_params.ratio,
            unit: single.extra_params.unit.name,
            summoney: single.extra_params.summoney
          }
          dataSource.push(temp);
          this.setState({ dataSource });
        })
      })
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
			name:"结算进度信息填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"结算进度信息填报",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		//发起流程
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
						// message.info("发起成功")					
					})
		})
  }
  //删除流程
  setDeleteData = (data,participants) =>{
    const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
let creator = {
  id:getUser().id,
  username:getUser().username,
  person_name:getUser().person_name,
  person_code:getUser().person_code,
}
let postdata = {
  name:"结算进度信息批量删除",
  code:WORKFLOW_CODE["数据报送流程"],
  description:"结算进度信息批量删除",
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
        this.setState({deletevisible:false})
        	message.info("发起成功")							
      })
})
}
  onSelectChange = (selectedRowKeys) => {
    const {dataSource} = this.state;
    let dataSourceSelected = [];
    for(let i=0;i<selectedRowKeys.length;i++){
        dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
    }
    this.setState({selectedRowKeys,dataSourceSelected});
}
	oncancel(){
        this.setState({addvisible:false})
        this.setState({deletevisible:false})
	}
	setAddVisible(){
        this.setState({addvisible:true})
       
  }
  setdltVisible(){
    this.setState({deletevisible:true})
  }

	render() {
    const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="结算进度" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={this.setAddVisible.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" >申请变更</Button>
					<Button className="btn" type="default" onClick={this.setdltVisible.bind(this)}>申请删除</Button>
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
						<Table columns={this.columns} bordered dataSource={this.state.dataSource} rowSelection={rowSelection} rowKey="key"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<SumSpeed {...this.props} oncancel={this.oncancel.bind(this)} onok={this.setData.bind(this)}/>
                }
                {
					this.state.deletevisible &&
					<SumSpeedDelete {...this.props} {...this.state } oncancel={this.oncancel.bind(this)} onok={this.setDeleteData.bind(this)}/>
                }
			</div>
		);
	}
}

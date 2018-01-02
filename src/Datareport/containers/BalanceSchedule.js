import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Main,
  Aside,
  Body,
  Sidebar,
  Content,
  DynamicTitle
} from "_platform/components/layout";
import { actions } from "../store/SumSpeedCost";
import { actions as platformActions } from "_platform/store/global";
import { Row, Col, Table, Input, Button, message, Progress,pagination } from "antd";
import { getUser } from "_platform/auth";
import SumSpeed from "../components/CostListData/SumSpeed";
import SumSpeedDelete from "../components/CostListData/SumSpeedDelete";
import SumSpeedChange from "../components/CostListData/SumSpeedChange";
import SumSpeedExport from "../components/CostListData/SumSpeedExport";
import "./quality.less";
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_SettlementProgress} from '_platform/api.js';
import { getNextStates } from "_platform/components/Progress/util";

var moment = require("moment");
const Search = Input.Search;
@connect(
  state => {
    const { datareport: { SumSpeedCost = {} } = {}, platform } = state;
    return { ...SumSpeedCost, platform };
  },
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
  })
)
export default class BalanceSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addvisible: false,
      deletevisible: false,
      changevisible: false,
      exportvisible: false,
      selectedRowKeys: [],
      dataSourceSelected: [],
      dataSource: [],
      cacheDataSource: [],
			percent: 0,
        };
    this.columns = [
      {
        title: "序号",
        dataIndex: "key",
        width:"5%"
      },
      {
        title: "项目/子项目",
        dataIndex: "project",
        key:'Project'
      },
      {
        title: "单位工程",
        dataIndex: "unit",
        Key:'Unit'
      },
      {
        title: "工作节点目标",
        dataIndex: "nodetarget",
        key:"Nodetarget"
      },
      {
        title: "完成时间",
        dataIndex: "completiontime",
        key:'Completiontime'
      },
      {
        title: "支付金额（万元）",
        dataIndex: "summoney",
        key:'Summoney'
      },
      {
        title: "累计占比",
        dataIndex: "ratio",
        key:'Ratio'
      },
      {
        title: "备注",
        dataIndex: "remarks",
        key:'Remarks',
        render: (text, record, index) => {
          return record.remarks ? record.remarks:"—"
        }
      }
    ];
    this.header =['项目/子项目','单位工程','工作节点目标','完成时间','支付金额（万元）','累计占比','备注'];
  }
  // async componentDidMount() {
  //   const { actions: { getAllresult } } = this.props;
  //   // let dataSource =[];
  //   getAllresult().then(o => {
  //     let dataSource = [];
  //     console.log("o", o);
  //     this.setState({percent:0})
  //     o.result.map((rst,key) => {
  //       let temp = {
  //         key:key+1,
  //         code: rst.code,
  //         project: rst.extra_params.project.name || rst.extra_params.project,
  //         nodetarget: rst.extra_params.nodetarget,
  //         completiontime: rst.extra_params.completiontime,
  //         remarks: rst.extra_params.remarks,
  //         ratio: rst.extra_params.ratio,
  //         unit: rst.extra_params.unit.name || rst.extra_params.unit,
  //         summoney: rst.extra_params.summoney,
  //         deletecode: rst.code
  //       };
  //       dataSource.push(temp);
  //       this.setState({ dataSource, showDat: dataSource ,loading:false,percent:100});
  //     });
  //   });
  // }
  generateTableData(data) {
    let dataSource = [];
    // console.log(data);
   data.map((rst,key) => {
     let datas = {
      key:key+1,
      code: rst.code,
      project: rst.extra_params.project.name || rst.extra_params.project,
      nodetarget: rst.extra_params.nodetarget,
      completiontime: rst.extra_params.completiontime,
      remarks: rst.extra_params.remarks,
      ratio: rst.extra_params.ratio,
      unit: rst.extra_params.unit.name || rst.extra_params.unit,
      summoney: rst.extra_params.summoney,
      deletecode: rst.code
     }
     dataSource.push(datas)
   })
   this.setState({
     dataSource:dataSource,
     showDat:dataSource
   })
 }
 componentDidMount(){
  const {actions:{ getAllresult }}=this.props;
  this.setState({loading:true,percent:0})
  getAllresult().then(rst=>{
    this.setState({loading:false,percent:100})
    this.generateTableData(rst.result)
  })
}
  //批量上传回调
  setData(data, participants) {
    const { actions: { createWorkflow, logWorkflowEvent } } = this.props;
    let creator = {
      id: getUser().id,
      username: getUser().username,
      person_name: getUser().person_name,
      person_code: getUser().person_code
    };
    let postdata = {
      name: "结算进度信息填报",
      code: WORKFLOW_CODE["数据报送流程"],
      description: "结算进度信息填报",
      subject: [
        {
          data: JSON.stringify(data)
        }
      ],
      creator: creator,
      plan_start_time: moment(new Date()).format("YYYY-MM-DD"),
      deadline: null,
      status: "2"
    };
    //发起流程
    createWorkflow({}, postdata).then(rst => {
      let nextStates = getNextStates(rst, rst.current[0].id);
      logWorkflowEvent(
        { pk: rst.id },
        {
          state: rst.current[0].id,
          action: "提交",
          note: "发起填报",
          executor: creator,
          next_states: [
            {
              participants: [participants],
              remark: "",
              state: nextStates[0].to_state[0].id
            }
          ],
          attachment: null
        }
      ).then(() => {
        this.setState({ addvisible: false });
        // message.info("发起成功")
      });
    });
  }
  //变更流程
  setChangeData(data, participants) {
    const { actions: { createWorkflow, logWorkflowEvent } } = this.props;
    let creator = {
      id: getUser().id,
      username: getUser().username,
      person_name: getUser().person_name,
      person_code: getUser().person_code
    };
    let postdata = {
      name: "结算进度信息变更",
      code: WORKFLOW_CODE["数据报送流程"],
      description: "结算进度信息变更",
      subject: [
        {
          data: JSON.stringify(data)
        }
      ],
      creator: creator,
      plan_start_time: moment(new Date()).format("YYYY-MM-DD"),
      deadline: null,
      status: "2"
    };
    //发起流程
    createWorkflow({}, postdata).then(rst => {
      let nextStates = getNextStates(rst, rst.current[0].id);
      logWorkflowEvent(
        { pk: rst.id },
        {
          state: rst.current[0].id,
          action: "提交",
          note: "发起填报",
          executor: creator,
          next_states: [
            {
              participants: [participants],
              remark: "",
              state: nextStates[0].to_state[0].id
            }
          ],
          attachment: null
        }
      ).then(() => {
        this.setState({ changevisible: false });
        message.info("发起流程成功");
      });
    });
  }
  //删除流程
  setDeleteData = (data, participants) => {
    const { actions: { createWorkflow, logWorkflowEvent } } = this.props;
    let creator = {
      id: getUser().id,
      username: getUser().username,
      person_name: getUser().person_name,
      person_code: getUser().person_code
    };
    let postdata = {
      name: "结算进度信息批量删除",
      code: WORKFLOW_CODE["数据报送流程"],
      description: "结算进度信息批量删除",
      subject: [
        {
          data: JSON.stringify(data)
        }
      ],
      creator: creator,
      plan_start_time: moment(new Date()).format("YYYY-MM-DD"),
      deadline: null,
      status: "2"
    };
    createWorkflow({}, postdata).then(rst => {
      let nextStates = getNextStates(rst, rst.current[0].id);
      logWorkflowEvent(
        { pk: rst.id },
        {
          state: rst.current[0].id,
          action: "提交",
          note: "发起填报",
          executor: creator,
          next_states: [
            {
              participants: [participants],
              remark: "",
              state: nextStates[0].to_state[0].id
            }
          ],
          attachment: null
        }
      ).then(() => {
        this.setState({ deletevisible: false });
        message.info("发起成功");
      });
    });
  };
  onSelectChange =(selectedRowKeys,selecteRows)  => {
    const { dataSource } = this.state;
    let dataSourceSelected = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
    }
    this.setState({ selectedRowKeys, dataSourceSelected:selecteRows });
  };
  oncancel() {
    this.setState({ addvisible: false });
    this.setState({ deletevisible: false });
    this.setState({ changevisible: false });
    this.setState({ exportvisible: false });
  }
  setAddVisible() {
    this.setState({ addvisible: true });

  }
  setchgVisible() {
    
    let {selectedRowKeys,dataSourceSelected,dataSource} =this.state;
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length>0){
			this.setState({ changevisible: true });
		} else {
			message.warning('至少选择一条数据')
		}
  }
  setdleVisible() {
    
    let {selectedRowKeys,dataSourceSelected,dataSource} =this.state;
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length>0){
			this.setState({ deletevisible: true });
		} else {
			message.warning('至少选择一条数据')
		}
  }
  //导出数据
  setexpVisible() {
    let {selectedRowKeys,dataSourceSelected,dataSource} =this.state;
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length>0){
			// this.setState({ exportvisible: true });
      const {actions:{jsonToExcel}} =this.props;
      const {dataSourceSelected} = this.state;
      let rows =[];
      rows.push(this.header);
      dataSourceSelected.map(o=>{
        rows.push([o.project,o.unit,o.nodetarget,o.completiontime,o.summoney,o.ratio,o.remarks]);
      })
      jsonToExcel({},{rows:rows}).then(rst=>{
        this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
      })
		} else { 
			message.warning('至少选择一条数据')
		}
  }
  // setexpVisible() {
  //   if(this.state.dataSourceSelected.length <=0){
	// 		message.warning('请先选择要导出的数据');
	// 		return
	// 	}
	// 	const { actions:{jsonToExcel}} = this.props;
	// 	const {dataSourceSelected} = this.state;
	// 	console.log('this',this.state);
	// 	let rows = [];
	// 	rows.push(this.header);
	// 	console.log('this',dataSourceSelected);
	// 	dataSourceSelected.map(item =>{
	// 		rows.push([o.key,o.project,o.unit,o.nodetarget,o.completiontime,o.summoney,o.ratio,o.remarks]);
	// 	})
	// 	console.log('rows',rows);
	// 	jsonToExcel({},{rows:rows}).then(
	// 		rst=>{
	// 			this.createLink('name',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
	// 			console.log(rst,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
	// 		}
	// 	)
  // }

  // 搜索
  // onSearch(value) {
  //   if (!value.length) {
  //     this.setState({
  //       dataSource: this.state.cacheDataSource
  //     });
  //     return;
  //   }

  //   let dataSource = this.state.cacheDataSource;
  //   let res = [];
  //   for (var i = 0; i < dataSource.length; ++i) {
  //     for (var j in dataSource[i]) {
  //       if (dataSource[i][j] === value) {
  //         res.push(dataSource[i]);
  //         break;
  //       }
  //     }
  //   }
  //   if (res.length) {
  //     this.setState({
  //       dataSource: res
  //     });
  //   }
  //   console.log("value:", value);
  // }
  createLink = (name, url) => {    //下载
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute('download', this);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
  downloadT () {
    console.log(DataReportTemplate_SettlementProgress)
    this.createLink(this,DataReportTemplate_SettlementProgress);
    // const url = "http://10.215.160.38:6542/media/documents/meta/%E7%BB%93%E7%AE%97%E8%BF%9B%E5%BA%A6%E6%95%B0%E6%8D%AE%E5%A1%AB%E6%8A%A5%E6%A8%A1%E6%9D%BF.xlsx";
    // this.createLink(this,url);
  }
  render() {
    const paginationInfo = {
			showSizeChanger: true,
			pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
			showQuickJumper: true,
		}
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div style={{ overflow: "hidden", padding: 20 }}>
        <DynamicTitle title="结算进度" {...this.props} />
        <Row>
          <Button onClick={this.downloadT.bind(this)} style={{ margin: "10px 10px 10px 0px" }} type="default">
            模板下载
          </Button>
          <Button
            className="btn"
            type="default"
            onClick={this.setAddVisible.bind(this)}
          >
            发起填报
          </Button>
          <Button
            className="btn"
            type="default"
            onClick={this.setchgVisible.bind(this)}
          >
            申请变更
          </Button>
          <Button
            className="btn"
            type="default"
            onClick={this.setdleVisible.bind(this)}
          >
            申请删除
          </Button>
          <Button
            className="btn"
            type="default"
            onClick={this.setexpVisible.bind(this)}
          >
            导出表格
          </Button>
          <Search
            className="btn"
            style={{ width: "200px" }}
            placeholder="输入搜索条件"
            onSearch={ text => {
              let result = this.state.dataSource.filter(data => {
                console.log(data)
                return data.project.indexOf(text) >= 0 || data.unit.indexOf(text) >= 0 || data.completiontime.indexOf(text) >= 0 || data.remarks.indexOf(text) >= 0 || data.nodetarget.indexOf(text) >= 0;
              })
              if( text === ''){
                result = this.state.dataSource
              }
              this.setState({showDat:result});
            }
            }
          />
        </Row>
        <Row>
          <Col>
            <Table
              columns={this.columns}
              bordered
              dataSource={this.state.showDat}
              onChange={this.handleChange}
              rowSelection={rowSelection}
              rowKey="key"
              loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="exception" strokeWidth={5}/>,spinning:this.state.loading}}
              pagination={paginationInfo}
              />
          </Col>
        </Row>
        {this.state.addvisible && (
          <SumSpeed
            {...this.props}
            oncancel={this.oncancel.bind(this)}
            onok={this.setData.bind(this)}
          />
        )}
        {this.state.deletevisible && (
          <SumSpeedDelete
            {...this.props}
            {...this.state}
            oncancel={this.oncancel.bind(this)}
            onok={this.setDeleteData.bind(this)}
          />
        )}
        {this.state.changevisible && (
          <SumSpeedChange
            {...this.props}
            {...this.state}
            oncancel={this.oncancel.bind(this)}
            onok={this.setChangeData.bind(this)}
          />
        )}
        {this.state.exportvisible && (
          <SumSpeedExport
            {...this.props}
            {...this.state}
            oncancel={this.oncancel.bind(this)}
            // onok={this.setExportData.bind(this)}
          />
        )}
      </div>
    );
  }
}

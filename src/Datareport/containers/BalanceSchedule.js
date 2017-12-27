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
import { Row, Col, Table, Input, Button, message } from "antd";
import { getUser } from "_platform/auth";
import SumSpeed from "../components/CostListData/SumSpeed";
import SumSpeedDelete from "../components/CostListData/SumSpeedDelete";
import SumSpeedChange from "../components/CostListData/SumSpeedChange";
import SumSpeedExport from "../components/CostListData/SumSpeedExport";
import "./quality.less";
import { WORKFLOW_CODE } from "_platform/api.js";
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
    };
    this.columns = [
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
      }
    ];
  }
  async componentDidMount() {
    const { actions: { getAllresult } } = this.props;
    // let dataSource =[];
    getAllresult().then(o => {
      let dataSource = [];
      console.log("o", o);
      console.log("");
      o.result.map(rst => {
        let temp = {
          code: rst.code,
          project: rst.extra_params.project.name || rst.extra_params.project,
          nodetarget: rst.extra_params.nodetarget,
          completiontime: rst.extra_params.completiontime,
          remarks: rst.extra_params.remarks,
          ratio: rst.extra_params.ratio,
          unit: rst.extra_params.unit.name || rst.extra_params.unit,
          summoney: rst.extra_params.summoney,
          deletecode: rst.code
        };
        dataSource.push(temp);
        this.setState({ dataSource,cacheDataSource: dataSource });
      });
    });
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
  onSelectChange = selectedRowKeys => {
    const { dataSource } = this.state;
    let dataSourceSelected = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
    }
    this.setState({ selectedRowKeys, dataSourceSelected });
  };
  oncancel() {
    this.setState({ addvisible: false });
    this.setState({ deletevisible: false });
    this.setState({ changevisible: false });
    this.setState({exportvisible:false})
  }
  setAddVisible() {
    this.setState({ addvisible: true });
  }
  setchgVisible() {
    this.setState({ changevisible: true });
  }
  setdleVisible() {
    this.setState({ deletevisible: true });
  }
  setexpVisible() {
    console.log(11)
    this.setState({exportvisible : true});
  }

  // 搜索
  // async onSearch(value) {
  //   const { dataSource } = this.state;
  //   if (!value) {
  //     this.componentDidMount();
  //     return;
  //   }
  //   const { actions: { getSearcher } } = this.props;
  //   let deletecode = [];
  //   dataSource.map(item => {
  //     console.log("item:", item.code);
  //     deletecode.push(item.code);
  //     console.log("deletecode:", deletecode);
  //   });
  //   const code_Todir = deletecode;
  //   //http://10.215.160.38:6544/service/construction/api/searcher/?keyword=rel_doooco_&obj_type=C_DOC
  //   // const code_Todir = "rel_doooco_"+moment().format("YYYYMMDDHHmmss")
  //   // console.log('code_Todir',code_Todir)
  //   // let sunjects = code_Todir + "/?doc_code=BalanceSchedule&keys=project&values=" + value; // 项目/子项目名称
  //   // console.log('sunjects:',sunjects)

  //   // const code_Todir = "datareport_safetyspecial_05";
	// 	let param1 = code_Todir + "/?doc_code=BalanceSchedule&keys=project&values=" + value;
  //   let datas = await getSearcher({
  //     keyword: param1
  //   }).then(rst => {
  //     if (rst.result.length <= 0) return [];
  //     let dataSource = this.handleData(rst.result);
  //     return dataSource;
  //   });
  //   this.setState({
  //     dataSource: Object.assign(datas)
  //   });
  //   console.log("dataSource:", this.state.dataSource);
  // }
  onSearch(value) {
		if(!value.length) {
			this.setState({
				dataSource: this.state.cacheDataSource
			});
			return;
    }
    
		let dataSource = this.state.cacheDataSource;
		let res = [];
		for(var i  =0; i < dataSource.length; ++i) {
			for(var j in dataSource[i]) {
				if (dataSource[i][j] === value){
					res.push(dataSource[i]);
					break;
				}
			}
		}
		if(res.length) {
			this.setState({
				dataSource: res
			})
    }
    console.log('value:',value)
	}
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div style={{ overflow: "hidden", padding: 20 }}>
        <DynamicTitle title="结算进度" {...this.props} />
        <Row>
          <Button style={{ margin: "10px 10px 10px 0px" }} type="default">
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
          <Button className="btn" type="default"
          onClick={this.setexpVisible.bind(this)}
          >
            导出表格
          </Button>
          <Search
            className="btn"
            style={{ width: "200px" }}
            placeholder="输入搜索条件"
            onSearch={this.onSearch.bind(this)}
          />
        </Row>
        <Row>
          <Col>
            <Table
              columns={this.columns}
              bordered
              dataSource={this.state.dataSource}
              rowSelection={rowSelection}
              rowKey="key"
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

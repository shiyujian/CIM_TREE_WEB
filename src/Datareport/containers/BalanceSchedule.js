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
import { Row, Col, Table, Input, Button, Popconfirm } from "antd";
import SumSpeed from "../components/CostListData/SumSpeed";
import { getUser } from "_platform/auth";
import "./quality.less";
import { getNextStates } from "_platform/components/Progress/util";
import { WORKFLOW_CODE } from "_platform/api.js";
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
      dataSource: [],
      selectedRowKeys: []
    };
  }
  async componentDidMount() {
    const { actions: { getScheduleDir } } = this.props;
    let topDir = await getScheduleDir({ code: "the_only_main_code_sumspeed" });
    if (topDir.obj_type) {
      let dir = await getScheduleDir({ code: "datareport_sumspeed_chenck" });
      if (dir.obj_type) {
        if (dir.stored_documents.length > 0) {
          this.generateTableData(dir.stored_documents);
        }
      }
    }
  }
  async generateTableData(data) {
    const { actions: { getDocument } } = this.props;
    let dataSource = [];
    data.map(item => {
      getDocument({ code: item.code }).then(single => {
        console.log("single:", single);
        let temp = {
          code: single.extra_params.code,
          project: single.extra_params.project,
          nodetarget: single.extra_params.nodetarget,
          completiontime: single.extra_params.completiontime,
          remarks: single.extra_params.remarks,
          ratio: single.extra_params.ratio,
          unit: single.extra_params.unit,
          summoney: single.extra_params.summoney
        };
        dataSource.push(temp);
        this.setState({ dataSource });
      });
    });
  }

  // code:item.code,
  // project:item.project.name,
  // nodetarget:item.nodetarget,
  // completiontime:item.completiontime,
  // remarks:item.remarks,
  // ratio:item.ratio,
  // unit:item.unit.name,
  // summoney:item.summoney

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
      });
    });
  }
  oncancel() {
    this.setState({ addvisible: false });
  }
  setAddVisible() {
    this.setState({ addvisible: true });
  }
  delete(index) {
    let { dataSource } = this.state;
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const columns = [
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
    // {
    //     	title: '编辑',
    //     	dataIndex: 'edit',
    //     	render:(text,record,index) => {
    //     		return  (
    //     				<Popconfirm
    //     						placement="leftTop"
    //     						title="确定删除吗？"
    //     						onConfirm={this.delete.bind(this, index)}
    //     						okText="确认"
    //     						cancelText="取消">
    //     						<a>删除</a>
    //     				</Popconfirm>
    //     		)
    //     }
    //   }
    ];
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
            onClick={() => {
              this.setState({ addvisible: true });
            }}
          >
            发起填报
          </Button>
          <Button className="btn" type="default">
            申请变更
          </Button>
          <Button className="btn" type="default">
            导出表格
          </Button>
          <Search
            className="btn"
            style={{ width: "200px" }}
            placeholder="输入搜索条件"
            onSearch={value => console.log(value)}
          />
        </Row>
        <Row>
          <Col>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.dataSource}
              bordered
            />
          </Col>
        </Row>
        {this.state.addvisible && (
          <SumSpeed
            {...this.props}
            oncancel={() => {
              this.setState({ addvisible: false });
            }}
            onok={this.setData.bind(this)}
          />
        )}
      </div>
    );
  }
}

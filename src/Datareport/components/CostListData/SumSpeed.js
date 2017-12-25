import React, { Component } from "react";

import {
  Input,
  Form,
  Spin,
  Upload,
  Icon,
  Button,
  Modal,
  Cascader,
  Select,
  Popconfirm,
  message,
  Table,
  Row,
  Col,
  notification
} from "antd";
import {
  UPLOAD_API,
  SERVICE_API,
  FILE_API,
  STATIC_DOWNLOAD_API,
  SOURCE_API
} from "_platform/api";
import "../../containers/quality.less";
import Preview from "../../../_platform/components/layout/Preview";
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumSpeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      checkers: [], //审核人下来框选项
      check: null, //审核人
      project: {},
      unit: {},
      options: []
    };
  }

  componentDidMount() {
    const { actions: { getAllUsers, getProjectTree } } = this.props;
    getAllUsers().then(rst => {
      let checkers = rst.map(o => {
        return (
          <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
        );
      });
      this.setState({ checkers });
    });
    getProjectTree({ depth: 1 }).then(rst => {
      if (rst.status) {
        let projects = rst.children.map(item => {
          return {
            value: JSON.stringify(item),
            label: item.name,
            isLeaf: false
          };
        });
        this.setState({ options: projects });
      } else {
        //获取项目信息失败
      }
    });
  }
  beforeUpload = info => {
    if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
      return true;
    } else {
      notification.warning({
        message: "只能上传Excel文件！",
        duration: 2
      });
      return false;
    }
  };
  uplodachange = info => {
    //info.file.status/response
    if (info && info.file && info.file.status === "done") {
      notification.success({
        message: "上传成功！",
        duration: 2
      });
      let name = Object.keys(info.file.response);
      let dataList = info.file.response[name[0]];
      let dataSource = [];
      for (let i = 1; i < dataList.length; i++) {
        dataSource.push({
          nodetarget: dataList[i][0] ? dataList[i][0] : "",
          completiontime: dataList[i][1] ? dataList[i][1] : "",
          summoney: dataList[i][2] ? dataList[i][2] : "",
          ratio: dataList[i][3] ? dataList[i][3] : "",
          remarks: dataList[i][4] ? dataList[i][4] : "",
          project: {
            code: "",
            name: "",
            obj_type: ""
          },
          unit: {
            code: "",
            name: "",
            obj_type: ""
          }
        });
      }
      this.setState({ dataSource });
    }
  };

  //下拉框选择人
  selectChecker(value) {
    let check = JSON.parse(value);
    this.setState({ check });
  }

  onSelectProject = (value, selectedOptions) => {
    let project = {};
    let unit = {};
    if (value.length === 2) {
      let temp1 = JSON.parse(value[0]);
      let temp2 = JSON.parse(value[1]);
      project = {
        name: temp1.name,
        code: temp1.code,
        obj_type: temp1.obj_type,
        pk:temp1.pk
      };
      unit = {
        name: temp2.name,
        code: temp2.code,
        obj_type: temp2.obj_type,
        pk:temp2.pk
      };
      this.setState({ project, unit });
      return;
    }
    //must choose all,otherwise make it null
    this.setState({ project: {}, unit: {} });
  };

  loadData = selectedOptions => {
    const { actions: { getProjectTree } } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    getProjectTree({ depth: 2 }).then(rst => {
      if (rst.status) {
        let units = [];
        rst.children.map(item => {
          if (item.code === JSON.parse(targetOption.value).code) {
            //当前选中项目
            units = item.children.map(unit => {
              return {
                value: JSON.stringify(unit),
                label: unit.name
              };
            });
          }
        });
        targetOption.loading = false;
        targetOption.children = units;
        this.setState({ options: [...this.state.options] });
      } else {
        //获取项目信息失败
      }
    });
  };

  onok() {
    if (!this.state.check) {
      message.info("请选择审核人");
      return;
    }
    if (this.state.dataSource.length === 0) {
      message.info("请上传excel");
      return;
    }
    // let temp = this.state.dataSource.some((o,index) => {
    //                 return !o.file.id
    //             })
    // if(temp){
    //     message.info(`有数据未上传附件`)
    //     return
    // }
    const { project, unit } = this.state;
    if (!project.name) {
      message.info(`请选择项目和单位工程`);
      return;
    }

    let { check } = this.state;
    let per = {
      id: check.id,
      username: check.username,
      person_name: check.account.person_name,
      person_code: check.account.person_code,
      organization: check.account.organization
    };
    for (let i = 0; i < this.state.dataSource.length; i++) {
      this.state.dataSource[i].project = project;
      this.state.dataSource[i].unit = unit;
    }
    this.props.onok(this.state.dataSource, per);
    notification.success({
      message: "信息上传成功！",
      duration: 2
    });
  }

  //删除
  delete(index) {
    let { dataSource } = this.state;
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  remove(index) {
    const { actions: { deleteStaticFile } } = this.props;
    let { dataSource } = this.state;
    let id = dataSource[index]["file"].id;
    deleteStaticFile({ id: id });
    let nodetarget = dataSource[index].nodetarget;
    let completiontime = dataSource[index].completiontime;
    let remarks = dataSource[index].remarks;
    let summoney = dataSource[index].summoney;
    let unit = dataSource[index].unit;
    let ratio = dataSource[index].ratio;
    dataSource[index] = {
      project: "",
      unit: unit,
      nodetarget: nodetarget,
      completiontime: completiontime,
      remarks: remarks,
      summoney: summoney,
      ratio: ratio,
      project: {
        code: "",
        name: "",
        obj_type: ""
      },
      unit: {
        code: "",
        name: "",
        obj_type: ""
      },
      construct_unit: {
        code: "",
        name: "",
        type: ""
      },
      file: {}
    };
    this.setState({ dataSource });
  }
  render() {
    const columns = [
      {
        title: "序号",
        dataIndex: "number",
        render: (text, record, index) => {
          return index + 1;
        }
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
      {
        title: "编辑",
        dataIndex: "edit",
        render: (text, record, index) => {
          return (
            <Popconfirm
              placement="leftTop"
              title="确定删除吗？"
              onConfirm={this.delete.bind(this, index)}
              okText="确认"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          );
        }
      }
    ];
    return (
      <Modal
        title="结算进度上传表"
        visible={true}
        width={1280}
        onOk={this.onok.bind(this)}
        maskClosable={false}
        onCancel={this.props.oncancel}
      >
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          bordered
          pagination={{ pageSize: 10 }}
        />
        <Row style={{ marginBottom: "30px" }} type="flex">
          <Col>
            <Button style={{ margin: "10px 10px 10px 0px" }}>模板下载</Button>
          </Col>
          <Col>
            <Upload
              onChange={this.uplodachange.bind(this)}
              name="file"
              showUploadList={false}
              action={`${SERVICE_API}/excel/upload-api/`}
              beforeUpload={this.beforeUpload.bind(this)}
            >
              <Button style={{ margin: "10px 10px 10px 0px" }}>
                <Icon type="upload" />上传并预览
              </Button>
            </Upload>
          </Col>
          <Col>
            <span>
              审核人：
              <Select
                mode="combobox"
                style={{width:200}}
                className = "btn"
                placeholder="可搜索审查人"
                onChange = {this.selectChecker.bind(this)}
              >
                    {this.state.checkers}
              </Select>
            </span>
          </Col>
          <Col>
            <span>
              项目-单位工程：
              <Cascader
                options={this.state.options}
                className="btn"
                loadData={this.loadData.bind(this)}
                onChange={this.onSelectProject.bind(this)}
                changeOnSelect
              />
            </span>
          </Col>
        </Row>
        <Preview />
        <div style={{ marginTop: 20 }}>
          注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
          &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
          &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
          &emsp;&emsp;
          4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
        </div>
      </Modal>
    );
  }
}

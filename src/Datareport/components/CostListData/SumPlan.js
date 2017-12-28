import React, { Component } from "react";

import {
  Input, Form, Spin, Upload, Icon, Button, Modal, Cascader, Select, Popconfirm, message, Table, Row, Col, notification } from "antd";
import {
  UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from "_platform/api";
import "../../containers/quality.less";
import Preview from "../../../_platform/components/layout/Preview";
const FormItem = Form.Item;
const Option = Select.Option;

export default class SumPlan extends Component {
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
        //   upPeople: dataList[i][5] ? dataList[i][5] : "",
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
          file: {}
        });
      }
      console.log('dataSource',dataSource)
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
      console.log('temo',temp1,temp2)
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
    // let temp = this.state.dataSource.some((o, index) => {
    //   return !o.file.id;
    // });
    // if (temp) {
    //   message.info(`有数据未上传附件`);
    //   return;
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
        message: '信息上传成功！',
        duration: 2
    });
  }

  //删除
  delete(index) {
    let { dataSource } = this.state;
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }

  //预览
  handlePreview(index) {
    const { actions: { openPreview } } = this.props;
    let f = this.state.dataSource[index].file;
    let filed = {};
    filed.misc = f.misc;
    filed.a_file =
      `${SOURCE_API}` + f.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, "");
    filed.download_url =
      `${STATIC_DOWNLOAD_API}` +
      f.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, "");
    filed.name = f.name;
    filed.mime_type = f.mime_type;
    openPreview(filed);
  }

//   remove(index) {
//     const { actions: { deleteStaticFile } } = this.props;
//     let { dataSource } = this.state;
//     let id = dataSource[index]["file"].id;
//     deleteStaticFile({ id: id });
//     let type = dataSource[index].type;
//     let doTime = dataSource[index].doTime;
//     let remark = dataSource[index].remark;
//     let upPeople = dataSource[index].upPeople;
//     let pubUnit = dataSource[index].pubUnit;
//     dataSource[index] = {
//       filename: "",
//       pubUnit: pubUnit,
//       type: type,
//       doTime: doTime,
//       remark: remark,
//       upPeople: upPeople,
//       project: {
//         code: "",
//         name: "",
//         obj_type: ""
//       },
//       unit: {
//         code: "",
//         name: "",
//         obj_type: ""
//       },
//       construct_unit: {
//         code: "",
//         name: "",
//         type: ""
//       },
//       file: {}
//     };
//     this.setState({ dataSource });
//   }

  covertURLRelative = originUrl => {
    return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, "");
  };
  beforeUploadPicFile = (index, file) => {
    // 上传到静态服务器
    const fileName = file.name;
    let { dataSource, unit, project } = this.state;
    let temp = fileName.split(".")[0];
    const { actions: { uploadStaticFile } } = this.props;
    const formdata = new FormData();
    formdata.append("a_file", file);
    formdata.append("name", fileName);
    let myHeaders = new Headers();
    let myInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata
    };
    //uploadStaticFile({}, formdata)
    fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
      resp = await resp.json();
      console.log("uploadStaticFile: ", resp);
      if (!resp || !resp.id) {
        message.error("文件上传失败");
        return;
      }
      const filedata = resp;
      filedata.a_file = this.covertURLRelative(filedata.a_file);
      filedata.download_url = this.covertURLRelative(filedata.a_file);
      const attachment = {
        size: resp.size,
        id: filedata.id,
        name: resp.name,
        status: "done",
        url: filedata.a_file,
        //thumbUrl: SOURCE_API + resp.a_file,
        a_file: filedata.a_file,
        download_url: filedata.download_url,
        mime_type: resp.mime_type
      };
      let unitProject = {
        name: unit.name,
        code: unit.code,
        obj_type: unit.obj_type
      };
      let projectt = {
        name: project.name,
        code: project.code,
        obj_type: project.obj_type
      };
      dataSource[index]["file"] = attachment;
      dataSource[index]["unit"] = unitProject;
      dataSource[index]["project"] = projectt;
      this.setState({ dataSource });
    });
    return false;
  };

  render() {
    const columns = [
      {
        title: "序号",
        dataIndex: "code",
        width: "10%",
        render:(text,record,index)=>{
          return index+1
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
        title: "操作",
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
        title="结算计划文档上传表"
        visible={true}
        width={1280}
        onOk={this.onok.bind(this)}
        maskClosable={false}
        onCancel={this.props.oncancel}
      >
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          // bordered
          pagination={{ pageSize: 10 }}
        />
        <Row style={{ marginBottom: "30px" }} type="flex">
          {/* <Col>
            <Button style={{ margin: "10px 10px 10px 0px" }}>模板下载</Button>
          </Col> */}
          <Col>
            <Upload
              onChange={this.uplodachange.bind(this)}
              name="file"
              showUploadList={false}
              action={`${SERVICE_API}/excel/upload-api/`}
              beforeUpload={this.beforeUpload.bind(this)}
            >
              <Button style={{ margin: "10px 10px 10px 0px" }}>
                <Icon type="upload" />上传并预览(文件名需为英文)
              </Button>
            </Upload>
          </Col>
          <Col>
            <span>
              审核人：
              <Select
                style={{ width: "200px" }}
                className="btn"
                onSelect={this.selectChecker.bind(this)}
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
        <Row style={{ marginBottom: "30px" }}>
          <p>
            <span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；
          </p>
          <p style={{ paddingLeft: "25px" }}>
            2、数值用半角阿拉伯数字，如：1.2
          </p>
          <p style={{ paddingLeft: "25px" }}>
            3、日期必须带年月日，如2017年1月1日
          </p>
          <p style={{ paddingLeft: "25px" }}>
            4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.
          </p>
        </Row>
      </Modal>
    );
  }
}

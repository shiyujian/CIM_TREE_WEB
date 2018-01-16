import React, { Component } from 'react';
import { Sidebar, DynamicTitle } from '_platform/components/layout';
import {
  Form, Input, Button, Row, Col, message, Popconfirm, DatePicker, Table
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink
} from 'react-router-dom';
class ImageInfo extends Component {

  static layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  toggleAddition() {
    console.log(this.props)
    
    const {actions: {getModalState}} = this.props;
    getModalState(true)
  }
  render() {
    // const {actions: {toggleAddition},Doc=[]} = this.props;
    console.log(this.props.getModalState)

    let columns = [
      {
        title: '影像名称',
        // dataIndex: 'name',
        // key: 'name',
      }, {
        title: '影像编号',
        // dataIndex: 'extra_params.number',
        // key: 'extra_params.number',
      }, {
        title: '发布单位',
        // dataIndex: 'extra_params.company',
        // key: 'extra_params.company',
      }, {
        title: '拍摄日期',
        // dataIndex: 'extra_params.time',
        // key: 'extra_params.time',
      }, {
        title: '备注',
        // dataIndex: 'extra_params.remark',
        // key: 'extra_params.remark'
      }, {
        title: '操作',
        render: () => {
          let nodes = [];
          nodes.push(
            <div>
              <a onClick={this.previewFile}>预览</a>
              <span className="ant-divider" />
              <a onClick={this.update}>更新</a>
              <span className="ant-divider" />
              <a style={{ marginRight: 10 }} type="primary" onClick={this.download}>下载</a>
            </div>
          );
          return nodes;
        }
      }
    ];
    return (

      <Form style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={14}>
            <FormItem>
              <Search placeholder="输入内容"
                onSearch={this.query.bind(this)} />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              label="拍摄日期"
              {...ImageInfo.layout}
            >
              <Col span={11}>
                <FormItem>
                  <DatePicker />
                </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  -
                        </span>
              </Col>
              <Col span={11}>
                <FormItem>
                  <DatePicker defaultvalue="" />
                </FormItem>
              </Col>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Button style={{ marginBottom: "20px" }} type="primary" onClick={this.toggleAddition.bind(this)}>添加文件</Button>
            <Button style={{ marginBottom: "20px", marginLeft: "10px" }} type="primary" onClick={this.download.bind(this)}>下载文件</Button>
            <Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
              <Button style={{ marginBottom: "20px", marginLeft: "10px" }} type="primary" onClick={this.delete}>删除文件</Button>
            </Popconfirm>
          </Col>
        </Row>

        <Row gutter={24}>
          <Table
            bordered
            rowKey="code"
            columns={columns}
          />
        </Row>
      </Form>
    );
  }

  download(){
    const {selected=[],file =[],files=[],down_file=[]} = this.props;
  if(selected.length == 0){
    message.warning('没有选择无法下载');
  }
    selected.map(rst =>{
        file.push(rst.basic_params.files);
    });
    file.map(value =>{
        value.map(cot =>{
            files.push(cot.download_url)
        })
    });
    files.map(down =>{
        let down_load = STATIC_DOWNLOAD_API + "/media"+down.split('/media')[1];
        this.createLink(this,down_load);
    });
}
  query() {

  }
}
export default ImageInfo = Form.create()(ImageInfo);
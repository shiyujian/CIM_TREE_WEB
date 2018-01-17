import React, { Component } from 'react';
import { Sidebar, DynamicTitle } from '_platform/components/layout';
import {
  Form, Input, Button, Row, Col, message, Popconfirm, DatePicker, Table
} from 'antd';
import '../Datum/index.less'

const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Jim Red',
  age: 32,
  address: 'London No. 2 Lake Park',
}];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
  }),
};

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
    const { actions: { getModalUpdate } } = this.props;
    getModalUpdate(true)
  }
  onChange(pagination, filters, sorter) {

  }
  updateT(file){
    const {actions: {getModalUpdate}} = this.props;
    getModalUpdate(true)
  }

  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: 'Age',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
    }, {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: '操作',
      render: (record) => {
        let nodes = [];
        nodes.push(
          <div>
            <a >预览</a>
            <a onClick={this.updateT.bind(this,record)} style={{ marginLeft: 10 }}>更新</a>					
          </div>
        );
        return nodes;
      }
    }];
    // const {actions: {toggleAddition},Doc=[]} = this.props;

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
            className='foresttable'
            onChange={this.onChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
          />
        </Row>
      </Form>
    );
  }

  download() {
    const { selected = [], file = [], files = [], down_file = [] } = this.props;
    if (selected.length == 0) {
      message.warning('没有选择无法下载');
    }
    selected.map(rst => {
      file.push(rst.basic_params.files);
    });
    file.map(value => {
      value.map(cot => {
        files.push(cot.download_url)
      })
    });
    files.map(down => {
      let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
      this.createLink(this, down_load);
    });
  }
  query() {

  }
}
export default ImageInfo = Form.create()(ImageInfo);
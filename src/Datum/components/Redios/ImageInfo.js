import React, { Component } from 'react';
import { Sidebar, DynamicTitle } from '_platform/components/layout';

import {
  Form, Input, Button, Row, Col, message, Popconfirm, DatePicker, Table, Modal
} from 'antd';


import '../Datum/index.less'

const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

const data = [{
  key: '1',
  name: '九号一区造林工程正射影像',
  age: '雄安集团',
  address: '正常文档',
  video: 'http://47.104.160.65:6510/media/documents/2018/01/1510116943014_6c2DEME.mp4',
  remarks:'',
  imageNumber:'20171115',
}, {
  key: '2',
  name: '九号一区造林工程正射影像',
  age: '雄安集团',
  address: '正常文档',
  video: 'http://47.104.160.65:6510/media/documents/2018/01/1510116943014_6c2DEME.mp4',
  remarks:'',
  imageNumber:'20171115',  
}, {
  key: '3',
  name: '九号一区造林工程正射影像',
  age: '雄安集团',
  address: '正常文档',
  video: 'http://47.104.160.65:6510/media/documents/2018/01/1510116943014_6c2DEME.mp4',
  remarks:'',
  imageNumber:'20171115',  
}, {
  key: '4',
  name: '九号一区造林工程正射影像',
  age: '雄安集团',
  address: '正常文档',
  video: 'http://47.104.160.65:6510/media/documents/2018/01/1510116943014_6c2DEME.mp4',
  remarks:'',
  imageNumber:'20171115',  
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
  constructor(props) {
    super(props);
    this.state = {
      previewModalVisible: false
    }
  }

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
  updateT(file) {
    const { actions: { getModalUpdate } } = this.props;
    getModalUpdate(true)
  }
  preview(file) {
    this.setState({ previewModalVisible: true })
  }
  cancelT() {
    this.setState({ previewModalVisible: false })
  }
  determine() {

  }


  render() {
    const columns = [{
      title: '影像名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: '影像编号',
      dataIndex: 'imageNumber',
      sorter: (a, b) => a.age - b.age,
    }, {
      title: '发布单位',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
    }
    , {
      title: '备注',
      dataIndex: 'remarks',
    }, {
      title: '影像状态',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: '操作',
      render: (record) => {
        let nodes = [];
        nodes.push(
          <div>
            <a onClick={this.preview.bind(this)}>预览
            <Modal title="影像预览"
                closable
                width={920} visible={this.state.previewModalVisible}
                footer={null}
                onCancel={this.cancelT.bind(this)}
                cancelText={"关闭"}
                maskClosable={false}>
                <video
                  controls
                  preload="auto"
                  width="100%"
                  height="500px"
                >
                  <source src={record.video} />
                </video>
              </Modal>
            </a>
            <a onClick={this.updateT.bind(this)} style={{ marginLeft: 10 }}>更新</a>
          </div>
        );
        return nodes;
      }
    }];
    // const {actions: {toggleAddition},Doc=[]} = this.props;

    return (

      <Form style={{ marginBottom: 24, marginLeft: 50 }}>
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
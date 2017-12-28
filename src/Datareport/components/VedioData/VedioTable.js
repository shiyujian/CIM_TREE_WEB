import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row, Col, Table, Icon, Popconfirm, Input} from 'antd';
import './index.less';

export default class VedioTable extends Component{

    page = 1//当前页数

    render(){
        const {dataSource=[],loading =false,storeSelectRows =null} = this.props;
        const rowSelection = storeSelectRows? this.rowSelect : null;
        return(<Row className="rowSpacing">
            <Col span={24}>
                <Table
                loading={loading}
                dataSource={dataSource}
                columns={this.columns}
                rowKey='index'
                pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showTotal: showTotal,
                    onChange: (page)=>{this.page = page}
                }}
                rowSelection={rowSelection}
                bordered
                />
            </Col>
        </Row>)
    }

    deleteData = (index)=>{
        const {dataSource = [],storeExcelData} = this.props;
        let data = JSON.parse(JSON.stringify(dataSource));
        data.splice(index,1);
        storeExcelData(data);
    }

    rowSelect = {
        onChange:(selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            const {storeSelectRows} = this.props;
            storeSelectRows(selectedRows);
        }
    }

    renderColumns = (text,index,dataIndex)=>{
        const {edit = false} = this.props;
        return(
            <EditableCell
              editable={edit}
              value={text}
              onChange={value => this.handleChange(value,index,dataIndex)}
            />
        )
    }
    handleChange = (value,index,dataIndex)=>{
        const {storeData,dataSource} = this.props;
        dataSource[(this.page-1)*10 + index][dataIndex] = value;
        storeData(dataSource);
    }

    columns = [{
        title: '序号',
        dataIndex: 'index'
    },{
        title: '摄像头编码',
        dataIndex: 'cameraId',
        render: (text,record,index) => this.renderColumns(text,index,'cameraId')
    },{
        title: '项目/子项目名称',
        dataIndex: 'projectName'
    },{
        title: '单位工程',
        dataIndex: 'enginner'
    },{
        title: '摄像头名称',
        dataIndex: 'cameraName',
        render: (text,record,index) => this.renderColumns(text,index,'cameraName')
    },{
        title: 'IP',
        dataIndex: "ip",
        render: (text,record,index) => this.renderColumns(text,index,'ip')
    },{
        title: '端口',
        dataIndex: 'port',
        render: (text,record,index) => this.renderColumns(text,index,'port')
    },{
        title: '用户名',
        dataIndex: 'username',
        render: (text,record,index) => this.renderColumns(text,index,'username')
    },{
        title: '密码',
        dataIndex: 'password',
        render: (text,record,index) => this.renderColumns(text,index,'password')
    },{
        title: 'X坐标',
        dataIndex: 'xAxes',
        render: (text,record,index) => this.renderColumns(text,index,'xAxes')
    },{
        title: 'Y坐标',
        dataIndex: 'yAxes',
        render: (text,record,index) => this.renderColumns(text,index,'yAxes')
    },{
        title: '型号',
        dataIndex: 'modal',
        render: (text,record,index) => this.renderColumns(text,index,'modal')
    },{
        title: '摄像头上线时间',
        dataIndex: 'uptime',
        render: (text,record,index) => this.renderColumns(text,index,'uptime')
    },{
        title: 'wbs编码',
        dataIndex: 'wbsCode',
        render: (text,record,index) => this.renderColumns(text,index,'wbsCode')
    }];

    operation = {
        title: '操作',
        render: (text, record, index)=>{
            return (
                <Popconfirm
                 placement="leftTop"
                 title="确定删除吗？"
                 onConfirm={()=>{ this.deleteData(index) }}
                 okText="确认"
                 cancelText="取消">
                    <a>删除</a>
                </Popconfirm>
            )
        }
    }
}

VedioTable.PropTypes ={
    dataSource: PropTypes.array.isRequired
}

const showTotal = (total,range) =>{ //显示数据总量和当前数据顺序
    //console.log("showTotal",total,range);
}

const EditableCell = ({ editable, value, onChange }) => (
    <div>
      {editable
        ? <Input style={{ margin: '-5px' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
      }
    </div>
);
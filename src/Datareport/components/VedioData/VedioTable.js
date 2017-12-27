import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row, Col, Table, Icon, Popconfirm} from 'antd';
import './index.less';

export default class VedioTable extends Component{

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
                    showTotal: showTotal
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

    columns = [{
        title: '序号',
        dataIndex: 'index'
    },{
        title: '摄像头编码',
        dataIndex: 'cameraId'
    },{
        title: '项目/子项目名称',
        dataIndex: 'projectName'
    },{
        title: '单位工程',
        dataIndex: 'enginner'
    },{
        title: '摄像头名称',
        dataIndex: 'cameraName'
    },{
        title: 'IP',
        dataIndex: "ip"
    },{
        title: '端口',
        dataIndex: 'port'
    },{
        title: '用户名',
        dataIndex: 'username'
    },{
        title: '密码',
        dataIndex: 'password'
    },{
        title: 'X坐标',
        dataIndex: 'xAxes'
    },{
        title: 'Y坐标',
        dataIndex: 'yAxes'
    },{
        title: '型号',
        dataIndex: 'modal'
    },{
        title: '摄像头上线时间',
        dataIndex: 'uptime'
    },{
        title: 'wbs编码',
        dataIndex: 'wbsCode'
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
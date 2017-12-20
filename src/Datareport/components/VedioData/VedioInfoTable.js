import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row, Col, Table, Upload, Button, Icon, Popconfirm} from 'antd';
import './index.less';

export default class VedioInfoTable extends Component{
    
    render(){
        const {dataSource = []} = this.props;
        return(<Row className="rowSpacing">
            <Col span={24}>
                <Table
                dataSource={dataSource}
                columns={this.columns}
                rowKey={(record)=>{
                    return record.index
                }}
                pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showTotal: showTotal
                }}
                rowSelection={rowSelection}
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

    beforeUpload = (index)=>{   //附件上传

    }

    columns = [{
        title: '序号',
        dataIndex: 'index'
    },{
        title: '项目/子项目名称',
        dataIndex: 'projectName'
    },{
        title: '影像上传',
        render: (text, record, index)=>{
            return (
                <Upload showUploadList={false} beforeUpload={()=>{ this.beforeUpload(index) }}>
                    <Button>
                        <Icon type="upload" />上传附件
                    </Button>
                </Upload>
            )
        }
    },{
        title: '拍摄时间',
        dataIndex: 'ShootingDate'
    },{
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
    }];
}

VedioInfoTable.PropTypes ={
    dataSource: PropTypes.object.isRequired
}

const showTotal = (total,range) =>{ //显示数据总量和当前数据顺序
    console.log("showTotal",total,range);
}

const rowSelection = {
    onChange:(selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
}
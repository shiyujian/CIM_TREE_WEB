import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row,Col,Table} from 'antd';
import './index.less';

export default class VedioInfoTable extends Component{
    componentDidMount(){
    }
    
    render(){
        return(<Row className="rowSpacing">
            <Col span={24}>
                <Table
                columns={columns}
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
}

VedioInfoTable.PropTypes ={
    //columns:PropTypes.array.isRequired
}

const showTotal = (total,range) =>{ //显示数据总量和当前数据顺序
    console.log("showTotal",total,range);
}

const rowSelection = {
    onChange:(selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
}

const columns = [{
    title: '序号',
    dataIndex: 'index'
},{
    title: '项目/子项目名称'
},{
    title: '影像上传'
},{
    title: '拍摄时间'
}]
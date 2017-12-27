import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row, Col, Table, Upload, Button, Icon, Popconfirm} from 'antd';
import './index.less';
import {FILE_API} from '_platform/api';
import {uploadFile} from './commonFunc';

export default class VedioInfoTable extends Component{
    
    render(){
        const {dataSource=[], loading=false} = this.props;
        return(<Row className="rowSpacing">
            <Col span={24}>
                <Table
                loading={loading}
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
                bordered
                />
            </Col>
        </Row>)
    }

    deleteData = (index)=>{
        this.fileRemove(index);
        const {dataSource = [],storeExcelData} = this.props;
        let data = JSON.parse(JSON.stringify(dataSource));
        data.splice(index,1);
        storeExcelData(data);
    }

    beforeUpload = async (index,file)=>{   //附件上传
        const {dataSource} = this.props,
            filename = name.replace(/\.\w+$/,'');
        if(dataSource.some(data => {
            return data.code === filename
        })){
            message.info("该检验批已经上传过了");
            return false
        }

        const attachment = await uploadFile(file);
        let sourceData = JSON.parse(JSON.stringify(dataSource));
        Object.assign(sourceData[index],{
            file:attachment
        })
        const {storeExcelData} = this.props;
        storeExcelData(sourceData)

		return false;
    }

    fileRemove = async (index)=>{
        const {dataSource, storeExcelData, actions:{deleteStaticFile}} = this.props,
            {file:{ id }} = dataSource[index];
        await deleteStaticFile({id:id});

        let sourceData = JSON.parse(JSON.stringify(dataSource));
        delete sourceData[index].file;
        storeExcelData(sourceData);
    }

    columns = [{
        title: '序号',
        dataIndex: 'index'
    },{
        title: '项目/子项目名称',
        dataIndex: 'projectName'
    },{
        title: '影像上传',
        dataIndex: 'file',
        render: (text, record, index)=>{
            let revert = null,fileIndex = record.index-1;
            if(text&&text.name){
                revert = (<div>
                    <div className="inlineBlockNospacing">{text.name} </div>
                    {
                        this.props.fileDel &&
                        <Popconfirm
                        {...popAttribute}
                        onConfirm={()=>{ this.fileRemove(fileIndex) }}
                        >
                            <a><Icon type="close"/></a>
                        </Popconfirm>
                    }
                </div>)
            }else{
                revert = <Upload 
                         showUploadList={false}
                         beforeUpload={(file, fileList)=>{ this.beforeUpload(fileIndex,file) }}
                         customRequest = {()=>{}}
                        >
                        <Button>
                            <Icon type="upload" />上传影像
                        </Button>
                    </Upload>
            }
            return revert
        }
    },{
        title: '拍摄时间',
        dataIndex: 'ShootingDate'
    }];

    operation = {
        title: '操作',
        render: (text, record, index)=>{
            return (
                <Popconfirm
                {...popAttribute}
                onConfirm={()=>{ this.deleteData(index) }}
                >
                    <a>删除</a>
                </Popconfirm>
            )
        }
    }
}

VedioInfoTable.PropTypes ={
    dataSource: PropTypes.array.isRequired
}

const showTotal = (total,range) =>{ //显示数据总量和当前数据顺序
    //console.log("showTotal",total,range);
}

const rowSelection = {
    onChange:(selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
}

const popAttribute = {
    placement: "top",
    title: "确定删除吗？",
    okText: "确认",
    cancelText: "取消"
}
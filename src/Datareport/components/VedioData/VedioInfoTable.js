import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Row, Col, Table, Upload, Button, Icon, Popconfirm} from 'antd';
import './index.less';
import {FILE_API} from '_platform/api';

export default class VedioInfoTable extends Component{

    /* componentDidMount(){
        const {fileDel=false} = this.props;
        if(fileDel){
            this.columns.push(this.operation);
        }
    } */
    
    render(){
        const {dataSource=[]} = this.props;
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

    beforeUpload = async (index,file)=>{   //附件上传
        const {dataSource} = this.props,
            {name} = file,
            filename = name.replace(/\.\w+$/,'');
        if(dataSource.some(data => {
            return data.code === filename
        })){
            message.info("该检验批已经上传过了");
            return false
        }

        /* 编码？应该不需要
        const detail = await getWorkPackageDetail({code:filename});
        if(!detail.name){
            message.info("编码值错误");
            return false;
        }
        编码end */

        const formdata = new FormData(),
            myHeaders = new Headers();
		formdata.append('a_file', file);
        formdata.append('name', name);
        const myInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        };

        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            resp = await resp.json()
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            let filedata = resp;
            filedata.a_file = covertURLRelative(filedata.a_file);
            filedata.download_url = covertURLRelative(filedata.a_file);

            const {size,id,name,a_file,download_url,mime_type} = filedata;
            const attachment = {
                size,id, name, a_file ,download_url, mime_type,
                status: 'done',
                url: a_file
            };
            const jcode = file.name.replace(/\.\w+$/,'');

            let sourceData = JSON.parse(JSON.stringify(dataSource));

            /* wbs编码
            const info = await this.getInfo(jcode);
            sourceData[index] = Object.assign({},dataSource[index],info)
            wbs编码end */
            Object.assign(sourceData[index],{
                file:attachment
            })

            const {storeExcelData} = this.props;
            storeExcelData(sourceData)
        });
        
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
            let revert = null;
            if(text&&text.name){
                revert = (<div>
                    <div className="inlineBlockNospacing">{text.name} </div>
                    {
                        this.props.fileDel &&
                        <Popconfirm
                        {...popAttribute}
                        onConfirm={()=>{ this.fileRemove(index) }}
                        >
                            <a><Icon type="close"/></a>
                        </Popconfirm>
                    }
                </div>)
            }else{
                revert = <Upload 
                         showUploadList={false}
                         beforeUpload={(file, fileList)=>{ this.beforeUpload(index,file) }}
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
    dataSource: PropTypes.object.isRequired
}

const showTotal = (total,range) =>{ //显示数据总量和当前数据顺序
    //console.log("showTotal",total,range);
}

const rowSelection = {
    onChange:(selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
}

const covertURLRelative = (originUrl) => {
    return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
}

const popAttribute = {
    placement: "top",
    title: "确定删除吗？",
    okText: "确认",
    cancelText: "取消"
}
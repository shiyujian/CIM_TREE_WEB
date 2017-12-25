import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader ,Select, Popconfirm,message, Table, Row, Col, notification } from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DeleteFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSourceSelected,
            checkers:[],//审核人下来框选项
            check:null,//审核人
            project:{},
            unit:{},
            options:[],
        };
    }

    componentDidMount(){
        const {actions:{getAllUsers,getProjectTree}} = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
    }
    

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value);
        this.setState({check})
    }


    onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return;
        }
        let {check} = this.state;
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.props.onok(this.state.dataSource,per);
    }

    //删除
    delete(index){
        let {dataSource} = this.state;
        dataSource.splice(index,1);
        this.setState({dataSource});
    }

    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }

    render() {
        const columns = [
            {
                title:'编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'文件名称',
                dataIndex:'filename',
                width: '10%',
            },{
                title:'发布单位',
                dataIndex:'pubUnit',
                width: '10%',
            },{
                title:'版本号',
                dataIndex:'type',
                width: '10%',
            },{
                title:'实施日期',
                dataIndex:'doTime',
                width: '10%',
            },{
                title:'备注',
                dataIndex:'remark',
                width: '10%',
            },{
                title:'提交人',
                dataIndex:'upPeople',
                width: '10%',
            }, {
                title:'附件',
                width:'10%',
                render:(text,record,index) => {
                    return (<span>
                                <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                            </span>)
                }
            },{
                title:'操作',
                render:(text,record,index) => {
                    return  (
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            onConfirm={this.delete.bind(this, index)}
                            okText="确认"
                            cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    )
                }
            }
        ];
        return (
            <Modal
			title="安全隐患删除表"
			key={this.props.akey}
            visible={true}
            width= {1280}
			onOk={this.onok.bind(this)}
			maskClosable={false}
			onCancel={this.props.oncancel}>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col>
                        <span>
                            审核人：
                            <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span> 
                    </Col>
                </Row>
                <Preview />
            </Modal>
        )
    }
}

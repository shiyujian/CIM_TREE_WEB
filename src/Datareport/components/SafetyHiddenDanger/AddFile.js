import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Modal,Select, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API } from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers:[],//审核人下来框选项
            check:null,//审核人
        };
    }
    componentDidMount(){
        const {actions:{getAllUsers}} = this.props
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({checkers})
        })
    }
    beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }

    onok(){
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        if(this.state.dataSource.length === 0){
            message.info("请上传excel")
            return
        }
        let temp = this.state.dataSource.some((o,index) => {
                        return !o.file.id
                    })
        if(temp){
            message.info(`有数据未上传附件`)
            return
        }
        let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.props.setEditData(this.state.dataSource,per)
    }
    uplodachange = (info) => {
        //info.file.status/response
        if (info && info.file && info.file.status === 'done') {
            notification.success({
                message: '上传成功！',
                duration: 2
            });
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let dataSource = [];
            for (let i = 1; i < dataList.length; i++) {
                dataSource.push({
                    code: dataList[i][0] ? dataList[i][0] : '',
                    projectName: dataList[i][1] ? dataList[i][1] : '',
                    unit: dataList[i][2] ? dataList[i][2] : '',
                    wbs: dataList[i][3] ? dataList[i][3] : '',
                    resUnit: dataList[i][4] ? dataList[i][4] : '',
                    type: dataList[i][5] ? dataList[i][5] : '',
                    upTime: dataList[i][6] ? dataList[i][6] : '',
                    checkTime: dataList[i][7] ? dataList[i][7] : '',
                    editTime: dataList[i][8] ? dataList[i][8] : '',
                    result: dataList[i][9] ? dataList[i][9] : '',
                    deadline: dataList[i][10] ? dataList[i][10] : '',
                    editResult: dataList[i][11] ? dataList[i][11] : '',
                })
            }
            this.setState({ dataSource });
        }
    }

    //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }

    render() {
        const columns = [
            {
                title: '编码',
                dataIndex: 'code',
                width: '8%'
            }, {
                title: '项目名称',
                dataIndex: 'project',
                width: '8%',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            }, {
                title: '单位工程',
                dataIndex: 'unit',
                width: '8%',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            }, {
                title: 'WBS',
                dataIndex: 'wbs',
                width: '8%',
            }, {
                title: '责任单位',
                dataIndex: 'resUnit',
                width: '8%',
            }, {
                title: '隐患类型',
                dataIndex: 'type',
                width: '5%',
            }, {
                title: '上报时间',
                dataIndex: 'upTime',
                width: '9%',
            }, {
                title: '核查时间',
                dataIndex: 'checkTime',
                width: '9%',
            }, {
                title: '整改时间',
                dataIndex: 'editTime',
                width: '9%',
            }, {
                title: '排查结果',
                dataIndex: 'result',
                width: '6%',
            }, {
                title: '整改期限',
                dataIndex: 'deadline',
                width: '8%',
            }, {
                title: '整改结果',
                dataIndex: 'editResult',
                width: '6%',
            }, {
                title:'附件',
                width:'5%',
                render:(text,record,index) => {
                    return <span>
                        <a>预览</a>
                        <span className="ant-divider" />
                        <a>下载</a>
                    </span>
                }
            }
        ];
        return (
            <Modal
			title="安全文档上传表"
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
                    style={{ height: 380, marginTop: 20 }}
                    pagination={{ pageSize: 10 }}
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                <Col><Button style={{ margin:'10px 10px 10px 0px' }}>模板下载</Button></Col>
                <Col>
                    <Upload
                        onChange={this.uplodachange.bind(this)}
                        name='file'
                        showUploadList={false}
                        action={`${SERVICE_API}/excel/upload-api/`}
                        beforeUpload={this.beforeUpload.bind(this)}
                    >
                        <Button style={{ margin:'10px 10px 10px 0px' }}>
                            <Icon type="upload" />上传并预览(文件名需为英文)
                         </Button>
                    </Upload>
                </Col>
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
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
            </Modal>
        )
    }
}

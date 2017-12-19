import React, { Component } from 'react';

import { Input, Table, Row, Button, DatePicker, Radio, Select, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API } from '_platform/api';
import '../../containers/quality.less';
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select

class WorkModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            dataSource: [],
            checkers: [],//审核人下拉框选项
            check: null,//审核人
        };
    }
    componentDidMount() {
        const { actions: { getAllUsers } } = this.props
        getAllUsers().then(res => {
            let checkers = res.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers })
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    //table input 输入
    tableDataChange(index, key, e) {
        const { dataSource } = this.state;
        dataSource[index][key] = e.target['value'];
        this.setState({ dataSource });
    }
    //下拉框选择变化
    handleSelect(index, key, value) {
        const { dataSource } = this.state;
        dataSource[index][key] = value;
        this.setState({ dataSource });
    }
    //ok
    onok() {
        if (!this.state.check) {
            message.info("请选择审核人")
            return
        }
        if (this.state.dataSource.length === 0) {
            message.info("请上传excel")
            return
        }
        let temp = this.state.dataSource.some((o, index) => {
            return !o.file.id
        })
        if (temp) {
            message.info(`有数据未上传附件`)
            return
        }
        this.props.onok(this.state.dataSource)
    }
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //根据附件名称 也就是wbs编码获取其他信息
    async getInfo(code) {
        console.log(this.props)
        let res = {};
        // gerWorkpackageDetail
        const { actions: { getWorkPackageDetail } } = this.props
        let workschedule = await getWorkPackageDetail({ code: code })
        res.name = workschedule.name
        res.code = workschedule.code
        let fenxiang = await getWorkPackageDetail({ code: workschedule.parent.code })
        if (fenxiang.parent.obj_type_hum === "子分部工程") {
            let zifenbu = await getWorkPackageDetail({ code: fenxiang.parent.code })
            let fenbu = await getWorkPackageDetail({ code: zifenbu.parent.code })
            let zidanwei = {}, danwei = {};
            if (fenbu.parent.obj_type_hum === "子单位工程") {
                zidanwei = await getWorkPackageDetail({ code: fenbu.parent.code })
                danwei = await getWorkPackageDetail({ code: zidanwei.parent.code })

            } else {
                danwei = await getWorkPackageDetail({ code: fenbu.parent.code })
            }
            let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
            res.construct_unit = construct_unit
            res.unit = {
                name: danwei.name,
                code: danwei.code,
                obj_type: danwei.obj_type
            }
            res.project = danwei.parent
        } else {
            let fenbu = await getWorkPackageDetail({ code: fenxiang.parent.code })
            let zidanwei = {}, danwei = {};
            if (fenbu.parent.obj_type_hum === "子单位工程") {
                zidanwei = await getWorkPackageDetail({ code: fenbu.parent.code })
                danwei = await getWorkPackageDetail({ code: zidanwei.parent.code })

            } else {
                danwei = await getWorkPackageDetail({ code: fenbu.parent.code })
            }
            let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
            res.construct_unit = construct_unit
            res.unit = {
                name: danwei.name,
                code: danwei.code,
                obj_type: danwei.obj_type
            }
            res.project = danwei.parent
        }
        return res
    }
    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value)
        this.setState({ check })
    }
    //删除
    delete(index) {
        let { dataSource } = this.state
        dataSource.splice(index, 1)
        this.setState({ dataSource })
    }
    render() {
        const columns =
            [{
                title: '序号',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: 'WBS编码',
                dataIndex: 'code',
            }, {
                title: '任务名称',
                dataIndex: 'name',
            }, {
                title: '项目/子项目',
                dataIndex: 'project',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            }, {
                title: '单位工程',
                dataIndex: 'unit',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            }, {
                title: '施工单位',
                dataIndex: 'construct_unit',
                render: (text, record, index) => (
                    <span>
                        {record.construct_unit.name}
                    </span>
                ),
            }, {
                title: '施工图工程量',
                dataIndex: 'quantity',
            }, {
                title: '实际工程量',
                dataIndex: 'factquantity',
            }, {
                title: '计划开始时间',
                dataIndex: 'planstarttime',
            }, {
                title: '计划结束时间',
                dataIndex: 'planovertime',
            }, {
                title: '实际开始时间',
                dataIndex: 'factstarttime',
            }, {
                title: '实际结束时间',
                dataIndex: 'factovertime',
            }, {
                title: '上传人员',
                dataIndex: 'uploads',
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return <a onClick={this.delete.bind(this, index)}>删除</a>
                }
            }]
        let jthis = this
        //上传
        const props = {
            action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
            headers: {
            },
            showUploadList: false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    let { dataSource } = jthis.state
                    dataSource = jthis.handleExcelData(importData)
                    jthis.setState({ dataSource })
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name}解析失败，请检查输入`);
                }
            },
        };
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Modal
                title="施工进度信息上传表"
                key={this.props.akey}
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                maskClosable={false}
                onCancel={this.props.oncancel}>
                <div>
                    <Button style={{ margin: '10px 10px 10px 0px' }} type="primary">模板下载</Button>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered 
                        rowSelection={rowSelection}
                        pagination={{  //分页
                            pageSize: 6,  //显示几条一页
                            defaultPageSize: 6, //默认显示几条一页
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}/>
                    <Upload {...props}>
                        <Button style={{ margin: '10px 10px 10px 0px' }}>
                            <Icon type="upload" />上传附件
                        </Button>
                    </Upload>
                    <span>
                        审核人：
                        <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                this.state.checkers
                            }
                        </Select>
                    </span>
                    <Button className="btn" type="primary" onClick={this.onok.bind(this)}>提交</Button>
                </div>
                <div style={{ marginTop: 20 }}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
            </Modal>
        )
    }
    //处理上传excel的数据
    handleExcelData(data) {
        data.splice(0, 1);
        let res = data.map(item => {
            return {
                code:item[0],
                name:item[1],
                
                project: {
                    code: "",
                    name: "",
                    obj_type: ""
                },
                unit: {
                    code: "",
                    name: "",
                    obj_type: ""
                },
                construct_unit: {
                    code: "",
                    name: "",
                    type: "",
                },
                quantity:item[5],
                factquantity:item[6],
                planstarttime:item[7],
                planovertime:item[8],
                factstarttime:item[9],
                factovertime:item[10],
                uploads:item[11],   
            }
        })
        return res
    }
}
export default WorkModal
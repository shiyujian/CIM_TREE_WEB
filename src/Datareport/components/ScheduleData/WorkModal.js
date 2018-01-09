import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, WORKFLOW_CODE, DataReportTemplate_ConstructionProgress } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
var moment = require('moment');

export default class AddFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers: [],//审核人下来框选项
            check: null,//审核人
            project: {},
            unit: {},
            options: [],
            isconunit: "",
            iswbs: "",
        };
    }

    componentDidMount() {
        const { actions: { getAllUsers, getProjectTree } } = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map((o, index) => {
                return (
                    <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers })
        })
        getProjectTree({ depth: 1 }).then(rst => {
            if (rst.status) {
                let projects = rst.children.map(item => {
                    return (
                        {
                            value: JSON.stringify(item),
                            label: item.name,
                            isLeaf: false
                        }
                    )
                })
                this.setState({ options: projects });
            } else {
                //获取项目信息失败
            }
        });
    }
    beforeUpload = (info) => {
        if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
            const { unit } = this.state;
            if (!unit.code) {
                notification.warning({
                    message: '先选择单位工程！',
                    duration: 2
                });
                return false;
            }
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
    }
    //判断数据是否重复
    isRepeat(arr) {
        var hash = {};
        let repeatCode = [];
        for (var i in arr) {
            if (hash[arr[i]]) {
                repeatCode.push(arr[i])
            }
            hash[arr[i]] = true;
        }
        return repeatCode;
    }
    uplodachange = async (info) => {
        //info.file.status/response
        const { actions: { getOrg, getTreeRootNode } } = this.props;
        const { unit } = this.state;
        if (info && info.file && info.file.status === 'done') {
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            let dataSource = [];
            let wbscodes = [];
            for (let i = 1; i < dataList.length; i++) {
                wbscodes.push(dataList[i][0])
                let data = await getOrg({ code: dataList[i][2] });
                if (!data.code) {
                    notification.error({
                        message: '您输入的设计单位有误！',
                        duration: 2
                    });
                    this.setState({ isconunit: false })
                }
                let rst = await getTreeRootNode({ code: dataList[i][0] });
                if (rst && rst.children[0] && rst.children[0].children[0] && rst.children[0].children[0].code) {
                    if (rst.children[0].children[0].code !== unit.code) {
                        notification.error({
                            message: '您输入的wbs编码与选择的单位工程不匹配！',
                            duration: 2,
                        });
                        return;
                    }
                } else {
                    return;
                }
                dataSource.push({
                    key: i,
                    code: dataList[i][0] ? dataList[i][0] : '',
                    name: dataList[i][1] ? dataList[i][1] : '',
                    construct_unit: {
                        code: data.code ? data.code : dataList[i][2],
                        name: data.name ? data.name : "",
                        type: data.type ? data.type : ""
                    },
                    quantity: dataList[i][3] ? dataList[i][3] : '',
                    factquantity: dataList[i][4] ? dataList[i][4] : '',
                    opvalue: dataList[i][5] ? dataList[i][5] : '',
                    planstarttime: dataList[i][6] ? dataList[i][6] : '',
                    planovertime: dataList[i][7] ? dataList[i][7] : '',
                    factstarttime: dataList[i][8] ? dataList[i][8] : '',
                    factovertime: dataList[i][9] ? dataList[i][9] : '',
                    uploads: getUser().username,
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
                })
            }
            let repeatCode = this.isRepeat(wbscodes);
            if (repeatCode.length > 1) {
                this.setState({ iswbs: false })
                notification.error({
                    message: '您输入的wbs编码重复！',
                    duration: 2
                });
            }
            this.setState({ repeatCode ,dataSource});
            notification.success({
                message: '上传成功！',
                duration: 2
            });
        }
    }
    //校验组织机构
    fixOrg(index) {
        const { actions: { getOrg } } = this.props;
        let { dataSource } = this.state;
        getOrg({ code: dataSource[index].construct_unit.code }).then(rst => {
            if (rst.code) {
                dataSource[index]['construct_unit'] = {
                    name: rst.name,
                    code: rst.code,
                    type: rst.obj_type
                }
                this.setState({ dataSource, isconunit: true });
            } else {
                notification.warning({
                    message: '请确认后再次输入！',
                    duration: 2
                });
                this.setState({ isconunit: false })
            }
        })
    }
    tableDataChange1(index, e) {
        const { dataSource } = this.state;
        dataSource[index]["construct_unit"] = {
            name: '',
            code: e.target.value,
            type: ''
        }
        this.setState({ dataSource });
    }
    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }

    onSelectProject = (value, selectedOptions) => {
        let project = {};
        let unit = {};
        if (value.length === 2) {
            let temp1 = JSON.parse(value[0]);
            let temp2 = JSON.parse(value[1]);
            project = {
                name: temp1.name,
                code: temp1.code,
                obj_type: temp1.obj_type,
                pk: temp1.pk,
            }
            unit = {
                name: temp2.name,
                code: temp2.code,
                obj_type: temp2.obj_type,
                pk: temp2.pk,
            }
            this.setState({ project, unit });
            return;
        }
        //must choose all,otherwise make it null
        this.setState({ project: {}, unit: {} });
    }

    loadData = (selectedOptions) => {
        const { actions: { getProjectTree } } = this.props;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getProjectTree({ depth: 2 }).then(rst => {
            if (rst.status) {
                let units = [];
                rst.children.map(item => {
                    if (item.code === JSON.parse(targetOption.value).code) {  //当前选中项目
                        units = item.children.map(unit => {
                            return (
                                {
                                    value: JSON.stringify(unit),
                                    label: unit.name
                                }
                            )
                        })
                    }
                })
                targetOption.loading = false;
                targetOption.children = units;
                this.setState({ options: [...this.state.options] })
            } else {
                //获取项目信息失败
            }
        });
    }
    //模板下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    onok() {
        if (!this.state.check) {
            notification.warning({
                message: '请选择审核人！',
                duration: 2
            });
            return
        }
        if (this.state.dataSource.length === 0) {
            notification.warning({
                message: '请上传excel！',
                duration: 2
            });
            return
        }
        const { project, unit } = this.state;
        if (!project.name) {
            notification.warning({
                message: '请选择项目和单位工程！',
                duration: 2
            });
            return;
        }
        if (this.state.isconunit === false) {
            notification.error({
                message: '您输入的实施单位有误！',
                duration: 2
            });
        }
        if (this.state.iswbs === false) {
            notification.error({
                message: '您输入的wbs编码有重复！',
                duration: 2
            });
            return;
        }

        let { check } = this.state
        let per = {
            id: check.id,
            username: check.username,
            person_name: check.account.person_name,
            person_code: check.account.person_code,
            organization: check.account.organization
        }
        for (let i = 0; i < this.state.dataSource.length; i++) {
            this.state.dataSource[i].project = project;
            this.state.dataSource[i].unit = unit;
        }
        this.props.onok(this.state.dataSource, per);
    }

    //删除
    delete(index) {
        let dataSource = this.state.dataSource;
        dataSource.splice(index, 1);
        dataSource.map((item, key) => {
            item.key = key + 1;
        })
        this.setState({ dataSource });
    }
    //table input 输入
    tableDataChange(index, key, e) {
        const { dataSource } = this.state;
        dataSource[index][key] = e.target['value'];
        this.setState({ dataSource });
    }
    render() {
        const columns =
            [{
                title: '序号',
                dataIndex: "key",
                key: "key",
            }, {
                title: 'WBS编码',
                dataIndex: 'code',
                render: (text, record, index) => {

                    if (this.state.repeatCode.indexOf(record.code) != -1) {
                        return (
                            <span style={{ "color": "red" }}>{record.code}</span>
                        )
                    } else {
                        return (
                            <span>{record.code}</span>
                        )
                    }
                }

            }, {
                title: '任务名称',
                dataIndex: 'name',
                key: "name",
                render: (text, record, index) => {
                    return <Input value={record.name || ""} onChange={ele => {
                        record.name = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '实施单位',
                dataIndex: 'construct_unit',
                key: "construct_unit",
                render: (text, record, index) => {
                    if (record.construct_unit && record.construct_unit.name) {
                        return <span>{record.construct_unit.name}</span>
                    } else {
                        return (<Input style={{ color: 'red' }} value={record.construct_unit ? record.construct_unit.code : ''} onBlur={this.fixOrg.bind(this, index)} onChange={this.tableDataChange1.bind(this, index)} />)
                    }
                },
            }, {
                title: '施工图工程量',
                dataIndex: 'quantity',
                key: "quantity",
                render: (text, record, index) => {
                    return <Input value={record.quantity || ""} onChange={ele => {
                        record.quantity = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '实际工程量',
                dataIndex: 'factquantity',
                key: "factquantity",
                render: (text, record, index) => {
                    return <Input value={record.factquantity || ""} onChange={ele => {
                        record.factquantity = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '产值(万元)',
                dataIndex: 'opvalue',
                key: "opvalue",
                render: (text, record, index) => {
                    return <Input value={record.opvalue || ""} onChange={ele => {
                        record.opvaluey = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '计划开始时间',
                dataIndex: 'planstarttime',
                key: "planstarttime",
                render: (text, record, index) => {
                    return <Input value={record.planstarttime || ""} onChange={ele => {
                        record.planstarttime = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '计划结束时间',
                dataIndex: 'planovertime',
                key: "planovertime",
                render: (text, record, index) => {
                    return <Input value={record.planovertime || ""} onChange={ele => {
                        record.planovertime = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '实际开始时间',
                dataIndex: 'factstarttime',
                key: "factstarttime",
                render: (text, record, index) => {
                    return <Input value={record.factstarttime || ""} onChange={ele => {
                        record.factstarttime = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '实际结束时间',
                dataIndex: 'factovertime',
                key: "factovertime",
                render: (text, record, index) => {
                    return <Input value={record.factovertime || ""} onChange={ele => {
                        record.factovertime = ele.target.value
                        this.forceUpdate();
                    }} />
                }
            }, {
                title: '上传人员',
                dataIndex: 'uploads',
                key: "uploads",
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            onConfirm={this.delete.bind(this, record.key - 1)}
                            okText="确认"
                            cancelText="取消">
                            <a><Icon type="delete" /></a>
                        </Popconfirm>
                    )
                }
            }]
        return (
            <Modal
                key={this.props.akey}
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                maskClosable={false}
                onCancel={this.props.oncancel}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>发起填报</h1>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    rowKey='key'
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ margin: '10px 10px 10px 0px' }} onClick={this.createLink.bind(this, 'muban', `${DataReportTemplate_ConstructionProgress}`)}>模板下载</Button></Col>
                    <Col>
                        <Upload
                            onChange={this.uplodachange.bind(this)}
                            name='file'
                            showUploadList={false}
                            action={`${SERVICE_API}/excel/upload-api/`}
                            beforeUpload={this.beforeUpload.bind(this)}
                        >
                            <Button style={{ margin: '10px 10px 10px 0px' }}>
                                <Icon type="upload" />上传并预览
                             </Button>
                        </Upload>
                    </Col>
                    <Col>
                        <span>
                            审核人：
                            <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)} placeholder='请选择审核人'>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span>
                    </Col>
                    <Col>
                        <span>
                            项目-单位工程：
                        <Cascader
                                options={this.state.options}
                                className='btn'
                                loadData={this.loadData.bind(this)}
                                onChange={this.onSelectProject.bind(this)}
                                changeOnSelect
                                placeholder='请选择'
                            />
                        </span>
                    </Col>
                </Row>
                <Preview />
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

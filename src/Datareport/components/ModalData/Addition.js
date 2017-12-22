import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, WORKFLOW_CODE } from '_platform/api';
import '../../containers/quality.less';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Addition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkers: [],//审核人下来框选项
            check: null,//审核人
            project: {},
            unit: {},
            options: [],
        };
    }

    componentDidMount() {
        const { actions: { getAllUsers, getProjectTree } } = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map(o => {
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
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
            return true;
        } else {
            notification.warning({
                message: '只能上传Excel文件！',
                duration: 2
            });
            return false;
        }
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
                    coding: dataList[i][1] ? dataList[i][1] : '',
                    modelName: dataList[i][2] ? dataList[i][2] : '',
                    submittingUnit: dataList[i][3] ? dataList[i][3] : '',
                    modelDescription: dataList[i][4] ? dataList[i][4] : '',
                    modeType: dataList[i][5] ? dataList[i][5] : '',
                    tdbxMode: dataList[i][7] ? dataList[i][7] : '',
                    attributeTable: dataList[i][8] ? dataList[i][8] : '',
                    reportingTime: dataList[i][9] ? dataList[i][9] : '',
                    reportingName: dataList[i][10] ? dataList[i][10] : '',

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
                    ftbfile: '',
                    tdbxfile: '',
                    attributefile: '',

                })
            }
            this.setState({ dataSource });
        }
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
                obj_type: temp1.obj_type
            }
            unit = {
                name: temp2.name,
                code: temp2.code,
                obj_type: temp2.obj_type
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

    onok() {
        debugger
        if (!this.state.check) {
            message.info("请选择审核人")
            return
        }
        if (this.state.dataSource.length === 0) {
            message.info("请上传excel")
            return
        }
        // let temp = this.state.dataSource.some((o,index) => {
        //                 return !o.file.id
        //             })
        // if(temp){
        //     message.info(`有数据未上传附件`)
        //     return
        // }
        const { project, unit } = this.state;
        if (!project.name) {
            message.info(`请选择项目和单位工程`);
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
        this.setData(this.state.dataSource, per);
    }
    //批量上传回调
    setData(data, participants) {
        const { actions: { createWorkflow, logWorkflowEvent, clearAdditionField } } = this.props
        let creator = {
            id: getUser().id,
            username: getUser().username,
            person_name: getUser().person_name,
            person_code: getUser().person_code,
        }
        let postdata = {
            name: "模型信息批量录入",
            code: WORKFLOW_CODE["数据报送流程"],
            description: "模型信息批量录入",
            subject: [{
                data: JSON.stringify(data)
            }],
            creator: creator,
            plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
            deadline: null,
            status: "2"
        }
        createWorkflow({}, postdata).then((rst) => {
            let nextStates = getNextStates(rst, rst.current[0].id);
            logWorkflowEvent({ pk: rst.id },
                {
                    state: rst.current[0].id,
                    action: '提交',
                    note: '发起填报',
                    executor: creator,
                    next_states: [{
                        participants: [participants],
                        remark: "",
                        state: nextStates[0].to_state[0].id,
                    }],
                    attachment: null
                }).then(() => {
                    message.success("成功")
                    clearAdditionField();
                })
        })
    }
    //删除
    delete(index) {
        let { dataSource } = this.state
        dataSource.splice(index, 1)
        this.setState({ dataSource })
    }

    //预览
    handlePreview(index, name) {
        const { actions: { openPreview } } = this.props;
        let f = this.state.dataSource[index][name]
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }

    remove(index, name) {
        const { actions: { deleteStaticFile } } = this.props
        let { dataSource } = this.state
        let id = dataSource[index][name].id
        deleteStaticFile({ id: id })
        dataSource[index] = {

            file: {
            }
        }
        this.setState(dataSource)

    }

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPicFile = (index, name, file) => {
        // 上传到静态服务器
        const fileName = file.name;
        let { dataSource, unit, project } = this.state;
        let temp = fileName.split(".")[0]
        const { actions: { uploadStaticFile } } = this.props;
        const formdata = new FormData();
        formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        };
        //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
            resp = await resp.json()
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
                //thumbUrl: SOURCE_API + resp.a_file,
                a_file: filedata.a_file,
                download_url: filedata.download_url,
                mime_type: resp.mime_type
            };
            let unitProject = {
                name: unit.name,
                code: unit.code,
                obj_type: unit.obj_type
            }
            let projectt = {
                name: project.name,
                code: project.code,
                obj_type: project.obj_type
            }
            dataSource[index][name] = attachment;
            dataSource[index]['unit'] = unitProject;
            dataSource[index]['project'] = projectt;
            this.setState({ dataSource });
        });
        return false;
    }

    //下拉框选择
    handleSelect(index, key, value) {
        const { dataSource } = this.state;
        dataSource[index][key] = value;
        // console.log('value', value)
        this.setState({ dataSource });
    }
    cancel() {
        const {
			actions: { clearAdditionField }
		} = this.props;
        clearAdditionField();
    }
    render() {
        const { addition = {}, actions: { changeAdditionField } } = this.props;
        const columns = [
            {
                title: '序号',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '模型编码',
                dataIndex: 'coding'
            }, {
                title: '模型名称',
                dataIndex: 'modelName'
            }, {
                title: '提交单位',
                dataIndex: 'submittingUnit'
            }, {
                title: '模型描述',
                dataIndex: 'modelDescription'
            }, {
                title: '模型类型',
                dataIndex: 'modeType',
                render: (text, record, index) => (
                    <Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, index, 'modeType')} value={this.state.dataSource[index]['modeType']}>
                        <Option value="设计模型">设计模型</Option>
                        <Option value="施工模型">施工模型</Option>
                        <Option value="竣工模型">竣工模型</Option>
                    </Select>
                ),
            }, {
                title: 'fdb模型',
                dataIndex: 'fdbMode',
                render: (text, record, index) => {
                    if (record.fdbfile && record.fdbfile.id) {
                        return (<span>
                            <a onClick={this.handlePreview.bind(this, index, 'fdbfile')}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, index, 'fdbfile')}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
                        </span>)
                    } else {
                        return (
                            <span>
                                <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index, 'fdbfile')}>
                                    <Button>
                                        <Icon type="upload" />上传附件
	                            </Button>
                                </Upload>
                            </span>
                        )
                    }
                }
            }, {
                title: 'tdbx模型',
                dataIndex: 'tdbxMode',
                render: (text, record, index) => {
                    if (record.tdbxfile && record.tdbxfile.id) {
                        return (<span>
                            <a onClick={this.handlePreview.bind(this, index, 'tdbxfile')}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, index, 'tdbxfile')}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
                        </span>)
                    } else {
                        return (
                            <span>
                                <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index, 'tdbxfile')}>
                                    <Button>
                                        <Icon type="upload" />上传附件
	                            </Button>
                                </Upload>
                            </span>
                        )
                    }
                }
            }, {
                title: '属性表',
                dataIndex: 'attributeTable',
                render: (text, record, index) => {
                    if (record.attributefile && record.attributefile.id) {
                        return (<span>
                            <a onClick={this.handlePreview.bind(this, index, 'attributefile')}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, index, 'attributefile')}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
                        </span>)
                    } else {
                        return (
                            <span>
                                <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index, 'attributefile')}>
                                    <Button>
                                        <Icon type="upload" />上传附件
	                            </Button>
                                </Upload>
                            </span>
                        )
                    }
                }
            }, {
                title: '上报时间',
                dataIndex: 'reportingTime',
                render: (text,record,index) => {
                    var myDate = new Date()
                    
                   }
            }, {
                title: '上报人',
                dataIndex: 'reportingName'
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
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
        // console.log('shu:', addition.visible)
        return (
            <Modal
                title="模型信息上传表"
                key={this.props.akey}
                visible={addition.visible}
                width={1280}
                onOk={this.onok.bind(this)}
                maskClosable={false}
                onCancel={this.cancel.bind(this)}
            >
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button style={{ margin: '10px 10px 10px 0px' }}>模板下载</Button></Col>
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
                            <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
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
                            />
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

import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader, Select, Popconfirm, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
export default class ChangeFile extends Component {

    constructor(props, state) {
        super(props);
        this.state = {
            dataSource: [],
            changeInfo: '',
            users: [],
            projects: [],
            checkers: [],//审核人下来框选项
            check: null,//审核人
            units: [],
            project: {},
            unit: {},
            beginUnit: '',
            options: [],
        };
    }

    componentDidMount() {
        console.log('vip-state', this.props);
        const dataSource = this.props.subDataSource;
        this.setState({
            dataSource,
        })

        // 下拉框
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
    onChangeText(e) {
        this.setState({
            changeInfo: e.target.value
        });
    }
    paginationOnChange(e) {
        console.log('vip-分页', e);
    }
    //附件删除
    remove(index) {
        debugger;
        const { actions: { deleteStaticFile } } = this.props
        let { dataSource } = this.state
        let id = dataSource[index]['file'].id
        deleteStaticFile({ id: id })
        let rate = dataSource[index].rate
        let level = dataSource[index].level
        dataSource[index] = {
            rate: rate,
            level: level,
            name: "",
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
            file: {

            }
        }
        this.setState({ dataSource })
    }

    covertURLRelative(originUrl) {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPicFile(index, file) {
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
        fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
            resp = await resp.json()
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
            dataSource[index]['file'] = attachment;
            dataSource[index]['unit'] = unitProject;
            dataSource[index]['project'] = projectt;
            this.setState({ dataSource })
        });
        return false;
    }

    //删除
    delete(index, i) {
        // debugger;
        let { dataSource } = this.state
        // dataSource.splice(index, 1)
        this.setState({
            dataSource: this.state.dataSource.filter(item => {
                return item.i !== i;
            })
        })
    }

    //预览
    handlePreview(index) {
        const { actions: { openPreview } } = this.props;
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
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '5%',
                render: (text, record, index) => {
                    return index + 1
                },
            },
            {
                title: '单位工程',
                dataIndex: 'unitProject',
                width: '10%',
            },
            {
                title: '项目/子项目名称',
                dataIndex: 'projectName',
                width: '10%',
            }, {
                title: '方案名称',
                dataIndex: 'scenarioName',
                width: '15%',
            }, {
                title: '编制单位',
                dataIndex: 'organizationUnit',
                width: '10%',
            }, {
                title: '评审时间',
                dataIndex: 'reviewTime',
                width: '6%',
            }, {
                title: '评审意见',
                dataIndex: 'reviewComments',
                width: '6%',
            }, {
                title: '评审人员',
                dataIndex: 'reviewPerson',
                width: '6%',
            }, {
                title: '备注',
                dataIndex: 'remark',
                width: '15%',
            }
            , {
                title: '附件',
                width: "15%",
                render: (text, record, index) => {
                    // debugger;
                    if (record.file.a_file) {
                        return (<span>
                            <a onClick={this.handlePreview.bind(this, index)}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, index)}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
                        </span>)
                    } else {
                        return (
                            <span>
                                <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
                                    <Button>
                                        <Icon type="upload" />上传附件
                                </Button>
                                </Upload>
                            </span>
                        )
                    }
                }
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            onConfirm={this.delete.bind(this, index, record.i)}
                            okText="确认"
                            cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    )
                }
            }
        ];
        const paginationInfoModal = {
            defaultPageSize: 4,
            onChange: this.paginationOnChange.bind(this),
            showSizeChanger: true,
            pageSizeOptions: ['4', '8', '16', '32', '64'],
            showQuickJumper: true,
        }
        return (
            <Modal
                key={`this.props.newKey2*123`}
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
            >
                <h1 style={{ textAlign: 'center', fontSize: 14, color: '#333' }}>变更申请页面</h1>
                <Row >
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                        pagination={paginationInfoModal}
                        rowKey={record => record.i}
                    />
                </Row>
                <Row >
                    {
                        !this.state.dataSource.length ? <p></p>
                            :
                            (
                                <Col span={3} push={12} style={{ position: 'relative', top: -40, fontSize: 12 }}>
                                    [共：{this.state.dataSource.length}行]
								</Col>
                            )
                    }
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <span>
                            审核人：
                            <Select style={{ width: '200px' }} onSelect={this.selectChecker.bind(this)}>
                                {
                                    this.state.checkers
                                }
                            </Select>
                        </span>
                    </Col>
                    <Col span={6} push={1}>
                        <span>
                            项目-单位工程：
                             <Cascader style={{ width: '200px' }}
                                options={this.state.options}
                                loadData={this.loadData.bind(this)}
                                onChange={this.onSelectProject.bind(this)}
                                changeOnSelect
                                placeholder="请选择项目及子单位工程"
                            />
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Input
                        type="textarea"
                        onChange={this.onChangeText.bind(this)}
                        autosize={{ minRows: 5, maxRow: 6 }}
                        placeholder="请填写变更原因"
                        style={{ marginBottom: 40 }}
                    />
                </Row>
            </Modal>
        )
    }; // render
    onok() {
        if (!this.state.check) {
            message.error('审批人未选择');
            return;
        }
        let temp = this.state.dataSource.some((o, index) => {
            return !o.file.a_file
        })
        if (temp) {
            message.info(`有数据未上传附件`)
            return
        }
        const { project, unit } = this.state;
        if (!project.name) {
            message.info(`请选择项目和单位工程`);
            return;
        }
        if (!this.state.changeInfo) {
            message.info(`请填写变更原因`);
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
        this.props.setChangeData(this.state.dataSource, per);
        notification.success({
            message: '变更已发起！',
            duration: 2
        });
    }
    cancel() {
        this.props.goCancel();
    }
    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }
    onSelectProject(value, selectedOptions) {
        console.log('vip-value', value)
        console.log('vip-selectedOptions', selectedOptions)
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

    loadData(selectedOptions) {
        // console.log('vip-selectedOptions', selectedOptions)
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
}

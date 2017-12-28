import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader, Select, Popconfirm, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DeleteFile extends Component {

    constructor(props, state) {
        super(props);
        this.state = {
            dataSource: [],
            deleteInfoNew: '',
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
        // console.log('vip-state', this.props);
        // const dataSource = this.props.subDataSource;
        this.setState({
            dataSource,
        })

        // 下拉框
        const { actions: { getAllUsers, getProjectTree } } = this.props;
        getAllUsers().then(rst => {
            let checkers = rst.map((o, index) => {
                return (
                    <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers })
        })
    }
    onChangeText(e) {
        this.setState({
            deleteInfoNew: e.target.value
        });
    }

    paginationOnChange(e) {
        // console.log('vip-分页', e);
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'i',
                width: '5%',

            },
            {
                title: '项目/子项目名称',
                dataIndex: 'projectName',
                width: '15%',
            },
            {
                title: '单位工程',
                dataIndex: 'unitProject',
                width: '10%',
            },
            {
                title: '方案名称',
                dataIndex: 'scenarioName',
                width: '10%',
            },
            {
                title: '编制单位',
                dataIndex: 'organizationUnit',
                width: '10%',
            },
            {
                title: '评审时间',
                dataIndex: 'reviewTime',
                width: '10%',
            },
            {
                title: '评审意见',
                dataIndex: 'reviewComments',
                width: '10%',
            },
            {
                title: '评审人员',
                dataIndex: 'reviewPerson',
                width: '10%',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                width: '15%',
            }
            ,
            {
                title: '附件',
                width: '10%',
                render: (text, record) => {
                    return (<span>
                        <a onClick={this.handlePreview.bind(this, record.codeId, record.i)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
                }
            }
            ,
            {
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            // onConfirm={this.delete.bind(this, index, record.i)}
                            onConfirm={this.delete.bind(this, record)}
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
                key={`this.props.newKey3*123`}
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
            >
                <h1 style={{ textAlign: 'center', marginBottom: "20px" }}>删除项目申请页面</h1>
                <Row >
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                        pagination={paginationInfoModal}
                        rowKey={record => record.i}

                    />
                </Row>
                <Row>
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
                </Row>
                <Row style={{ marginBottom: 16 }}>
                    <Input
                        type="textarea"
                        onChange={this.onChangeText.bind(this)}
                        autosize={{ minRows: 5, maxRow: 6 }}
                        placeholder="请填写删除原因"
                        style={{ marginBottom: 40 }}
                    />
                </Row>
            </Modal>
        )
    }; // render

    //删除
    delete(record) {
        let { dataSource } = this.state;
        this.setState({
            ...this.state,
            dataSource: dataSource.filter((item, i) => {
                return item.index !== record.index;
            })
        });
    }

    onok() {
        if (!this.state.check) {
            message.error('审批人未选择');
            return;
        }
        if (!this.state.deleteInfoNew) {
            message.info(`请填写删除原因`);
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
        let { deleteInfoNew } = this.state
        for (let i = 0; i < this.state.dataSource.length; i++) {
            this.state.dataSource[i].deleteInfoNew = deleteInfoNew;
        }
        this.props.setDeleteData(this.state.dataSource, per);
        notification.success({
            message: '删除已发起！',
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
    //预览
    handlePreview(codeId, i) {
        const { actions: { openPreview } } = this.props;
        let f = this.state.dataSource[i].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
}

import React, { Component } from 'react';

import {
    Input, Form, Spin, Upload, Icon, Button, Modal,
    Cascader, Select, Popconfirm, message, Table, Row, Col, notification, DatePicker
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import EditableCell from '../EditableCell';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class EditFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSourceSelected,
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
    }


    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }


    onok() {
        if (!this.state.check) {
            notification.warning({
				message:'请选择审核人'
			})
            return;
        }
        let temp = this.state.dataSource.some((o, index) => {
            return !o.file.a_file
        })
        if (temp) {
            notification.warning({
				message:'有数据未上传附件'
			})
            return;
        }
        let { check } = this.state;
        let per = {
            id: check.id,
            username: check.username,
            person_name: check.account.person_name,
            person_code: check.account.person_code,
            organization: check.account.organization
        }
        this.props.onok(this.state.dataSource, per);
    }

    //删除
    delete(index) {
        let { dataSource } = this.state;
        dataSource.splice(index, 1);
        this.setState({ dataSource });
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
    onCellChange = (index, key, record) => {      //编辑某个单元格
        const { dataSource } = this.state;
        return (value) => {
            dataSource[index][key] = value;
            record[key] = value;
        };
    }
    remove(index) {
        const { actions: { deleteStaticFile } } = this.props
        let { dataSource } = this.state
        let id = dataSource[index]['file'].id
        deleteStaticFile({ id: id })
        let type = dataSource[index].type;
        let doTime = dataSource[index].doTime;
        let remark = dataSource[index].remark;
        let upPeople = dataSource[index].upPeople;
        let pubUnit = dataSource[index].pubUnit;
        dataSource[index] = {
            filename: '',
            pubUnit: pubUnit,
            type: type,
            doTime: doTime,
            remark: remark,
            upPeople: upPeople,
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
        this.setState({ dataSource });
    }

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPicFile = (index, file) => {
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
                notification.error({
                    message:'文件上传失败'
                })
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
            this.setState({ dataSource });
        });
        return false;
    }
    onDateChange = (index,dateString,str) =>{
        const {dataSource} = this.state;
        dataSource[index][str] = dateString;
        this.setState({dataSource});
    }

    render() {
        const columns = [
            {
                title: '文档编码',
                dataIndex: 'code',
                width: '10%',
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.code}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "code", record)}
                        />
                    </div>
                ),
            }, {
                title: '文件名称',
                dataIndex: 'filename',
                width: '10%',
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            value={record.filename}
                            editOnOff={false}
                            onChange={this.onCellChange(index, "filename", record)}
                        />
                    </div>
                ),
            }, {
                title: '发布单位',
                dataIndex: 'pubUnit',
                width: '10%',
            }, {
                title: '版本号',
                dataIndex: 'type',
                width: '10%',
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            editOnOff={false}
                            value={record.type}
                            onChange={this.onCellChange(index, "type", record)}
                        />
                    </div>
                ),
            }, {
                title: '实施日期',
                dataIndex: 'doTime',
                width: '10%',
                render: (text, record, index) => (
                    <div>
                        <DatePicker
                            onChange={(date,dateString)=>{this.onDateChange(record,dateString,'doTime')}}
                            defaultValue={moment(record.doTime)} />
                    </div>
                ),
            }, {
                title: '备注',
                dataIndex: 'remark',
                width: '10%',
                render: (text, record, index) => (
                    <div>
                        <EditableCell
                            editOnOff={false}
                            value={record.remark}
                            onChange={this.onCellChange(index, "remark", record)}
                        />
                    </div>
                ),
            }, {
                title: '提交人',
                dataIndex: 'upPeople',
                width: '10%',
            }, {
                title: '附件',
                width: '10%',
                render: (text, record, index) => {
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
                key={this.props.akey}
                visible={true}
                width={1280}
                onOk={this.onok.bind(this)}
                maskClosable={false}
                onCancel={this.props.oncancel}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>申请变更</h1>
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
                            <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
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

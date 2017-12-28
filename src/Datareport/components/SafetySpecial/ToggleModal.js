import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader, Select, Popconfirm, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, DataReportTemplate_SafetySpecial } from '_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import index from 'antd/lib/icon';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
export default class ToggleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],//审核人下来框选项
            check: null,//审核人
            units: [],
            project: {},
            unit: {},
            beginUnit: '',
            options: [],
        }
    }
    render() {
        const { visible = false } = this.props;
        let jthis = this;
        return (
            <Modal
                key={`this.props.newKey1*123`}
                visible={true}
                visible={visible}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <Table
                    columns={this.columns}
                    bordered={true}
                    dataSource={this.state.dataSource}
                    rowKey={(item, index) => index}
                >
                </Table>
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
                <Row style={{ marginBottom: "30px" }} type="flex">
                    <Col><Button
                        style={{ margin: '10px 10px 10px 0px' }}
                        onClick={this.DownloadFile.bind(this, "重大安全专项方案", DataReportTemplate_SafetySpecial)}

                    >模板下载</Button></Col>
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
                                style={{ width: '300px' }}
                                options={this.state.options}
                                className='btn'
                                loadData={this.loadData.bind(this)}
                                onChange={this.onSelectProject.bind(this)}
                                changeOnSelect
                                placeholder="请选择项目及子单位工程"
                            />
                        </span>
                    </Col>
                </Row>
                <Preview />
                <Row style={{ marginBottom: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、请将日期的Excel单元格设置为文本格式，且必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </Row>
            </Modal>
        )
    }

    // 下载模板
    DownloadFile(name, url) {
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    selectChecker(value) {
        let check = JSON.parse(value);
        this.setState({ check })
    }

    uplodachange(info) {
        if (info && info.file && info.file.status === 'done') {
            let name = Object.keys(info.file.response);
            let dataList = info.file.response[name[0]];
            // 模板判断
            if (dataList[0][1] !== "重大安全专项方案") {
                message.error('Excel模板不相符，请下载最新模板！');
                return;
            }
            let dataSource = [];
            for (let i = 2; i < dataList.length; i++) {
                dataSource.push({
                    resUnit: dataList[i][0] ? dataList[i][0] : '',
                    index: dataList[i][1] ? dataList[i][1] : '',
                    projectName: dataList[i][2] ? dataList[i][2] : '',
                    unitProject: dataList[i][3] ? dataList[i][3] : '',
                    scenarioName: dataList[i][4] ? dataList[i][4] : '',
                    organizationUnit: dataList[i][5] ? dataList[i][5] : '',
                    reviewTime: dataList[i][6] ? dataList[i][6] : '',
                    reviewComments: dataList[i][7] ? dataList[i][7] : '',
                    reviewPerson: dataList[i][8] ? dataList[i][8] : '',
                    remark: dataList[i][9] ? dataList[i][9] : '',
                    wbs: dataList[i][9] ? dataList[i][9] : '',
                    fj: dataList[i][10] ? dataList[i][10] : '',
                    code: '05',
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
                    file: {
                    }
                })
            }
            this.setState({ dataSource });
        }
    }

    onSelectProject(value, selectedOptions) {
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
    onok() {
        if (!this.state.check) {
            message.error('审批人未选择');
            return;
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
        const { actions: { ModalVisible, ModalVisibleOrg } } = this.props;
        this.props.setData(this.state.dataSource, per);

        ModalVisible(false);
        notification.success({
            message: '发起成功！',
            duration: 2
        });
    }
    cancel() {
        const { actions: { ModalVisibleOrg, ModalVisible } } = this.props;
        ModalVisible(false);
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
            dataSource[index]['file'] = attachment;
            this.setState({ dataSource })
        });
        return false;
    }


    //附件删除
    remove(index, record) {
        const { actions: { deleteStaticFile } } = this.props
        let { dataSource } = this.state
        // let id = dataSource[index]['file'].id
        let file = {};
        file = dataSource.filter((item, i) => {
            return item.index === record.index;
        })
        let id = file.id
        deleteStaticFile({ id: id })
        dataSource[index]['file'] = {}
        this.setState({ dataSource })
    }
    //删除
    delete(index, record) {
        let { dataSource } = this.state;
        // dataSource.splice(index, 1);
        this.setState({
            ...this.state,
            dataSource: dataSource.filter((item, i) => {
                return item.index !== record.index;
            })
        });
    }

    //预览
    handlePreview(index, record) {
        // debugger;
        const { actions: { openPreview } } = this.props;
        // let f = this.state.dataSource[index].file
        let { dataSource } = this.state;
        let ff = {}, f = {};
        ff = dataSource.filter((item, i) => {
            return item.codeId === codeId;
        });
        f = ff[0].file;
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    beforeUpload(info) {
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
    selectUnit(value) {
        let unit = JSON.parse(value);
        this.setState({ unit, beginUnit: value });
    }

    selectProject(value) {
        let project = JSON.parse(value);
        this.setState({ project, units: [] });
        const { actions: { getProjectTree } } = this.props;
        let beginUnit = '';
        let i = 0;
        getProjectTree({ depth: 2 }).then(rst => {
            if (rst.status) {
                let units = [];
                rst.children.map(item => {
                    if (item.code === project.code) {  //当前选中项目
                        units = item.children.map(unit => {
                            i++;
                            if (i === 1) {
                                beginUnit = JSON.stringify(unit);
                            }
                            return (
                                <Option value={JSON.stringify(unit)}>{unit.name}</Option>
                            )
                        })
                    }
                })
                this.setState({ units, beginUnit });
            } else {
                //获取项目信息失败
            }
        });
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index1',
            width: '5%',
            render: (text, record, index1) => {
                return record.index
            }
        }
        ,
        // {
        //     title: '项目/子项目名称',
        //     dataIndex: 'projectName',
        //     width: '15%',
        //     render: (text, record, index) => (
        //         <span>
        //             {record.project.name}
        //         </span>
        //     )
        // },
        // {
        //     title: '单位工程',
        //     dataIndex: 'unitProject',
        //     width: '10%',
        //     width: '8%',
        //     render: (text, record, index) => (
        //         <span>
        //             {record.unit.name}
        //         </span>
        //     )
        // }
        // , 
        {
            title: '方案名称',
            dataIndex: 'scenarioName',
            width: '15%',
        }, {
            title: '编制单位',
            dataIndex: 'organizationUnit',
            width: '15%',
        }, {
            title: '评审时间',
            dataIndex: 'reviewTime',
            width: '10%',
        }, {
            title: '评审意见',
            dataIndex: 'reviewComments',
            width: '10%',

        }, {
            title: '评审人员',
            dataIndex: 'reviewPerson',
            width: '10%',
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: '15%',
        }
        , {
            title: '附件',
            width: "15%",
            render: (text, record, index1) => {
                if (record.file.id) {
                    return (<span>
                        <a onClick={this.handlePreview.bind(this, index1, record)}>预览</a>
                        <span className="ant-divider" />
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            onConfirm={this.remove.bind(this, index1, record)}
                            okText="确认"
                            cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>)
                } else {
                    return (
                        <span>
                            <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index1)}>
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
            render: (text, record, index1) => {
                return (
                    <Popconfirm
                        placement="leftTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index1, record)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                )
            }
        }
    ];
}
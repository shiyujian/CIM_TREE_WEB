import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input, Modal, Upload, Select, Icon, notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
const Search = Input.Search;
export default class ToggleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers:[],//审核人下来框选项
            check:null,//审核人
            units:[],
            project:{},
            unit:{},
            beginUnit:'',
        }
    }
    render() {
        const { visible = false } = this.props;
        let jthis = this;
        // const props = {
        //     action: `${SERVICE_API}/excel/upload-api/`,
        //     headers: {
        //     },
        //     showUploadList: false,
        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //         }
        //         if (info.file.status === 'done') {
        //             let importData = info.file.response.Sheet1;
        //             let dataSource = jthis.handleExcelData(importData);
        //             jthis.setState({
        //                 dataSource
        //             })
        //             message.success(`${info.file.name} file uploaded successfully`);
        //         } else if (info.file.status === 'error') {
        //             message.error(`${info.file.name}解析失败，请检查输入`);
        //         }
        //     },
        // };
        return (
            <Modal
                key={this.props.newKey1}
                visible={true}
                visible={visible}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
                <Table
                    style={{ "textAlign": "center" }}
                    columns={this.columns}
                    bordered={true}
                    dataSource={this.state.dataSource}
                >
                </Table>
                <Upload
                    onChange={this.uplodachange.bind(this)}
                    name='file'
                    showUploadList={false}
                    action={`${SERVICE_API}/excel/upload-api/`}
                    beforeUpload={this.beforeUpload.bind(this)}
                >
                    <Button style={{ margin: '10px 10px 10px 0px' }}>
                        <Icon type="upload" />上传附件
                     </Button>
                </Upload>
                <span>
                    审核人：
                        <Select style={{ width: '200px' }} className="btn" onSelect={ele => {
                        // console.log(ele);
                        this.setState({ passer: ele })
                    }} >
                        {
                            this.state.checkers
                        }
                    </Select>
                </span>
                <Button type="primary" onClick={this.onok.bind(this)}>提交</Button>
                <div style={{ marginTop: "30px" }}>
                    <p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
                    <p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
                    <p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
                    <p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
                </div>
            </Modal>
        )
    }
    covertURLRelative = (originUrl) => {
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
        //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
            resp = await resp.json()
            // console.log('uploadStaticFile: ', resp)
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


    // //处理上传excel的数据
    // handleExcelData(data) {
    //     debugger;
    //     data.splice(0, 2);
    //     let res = data.map(item => {
    //         return {
    //             unitName: item[0],
    //             index: item[1],
    //             projectName: item[2],
    //             unitProject: item[3],
    //             scenarioName: item[4],
    //             organizationUnit: item[5],
    //             reviewTime: item[6],
    //             reviewComments: item[7],
    //             reviewPerson: item[8],
    //             remark: item[9],
    //         }
    //     })
    //     return res;
    // }

    onok() {
        const { actions: { ModalVisible, ModalVisibleOrg } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
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
                        <Option value={JSON.stringify(item)}>{item.name}</Option>
                    )
                })
                this.setState({ projects });
            } else {
                //获取项目信息失败
            }
        });
    }

    //附件删除
    remove(index) {
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
    //删除
    delete(index) {
        let { dataSource } = this.state
        dataSource.splice(index, 1)
        this.setState({ dataSource })
    }
  
    //预览
    handlePreview(index){ 
        // debugger;
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
        // debugger
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
            dataIndex: 'index',
            width: '5%',
        }
        ,
        {
            title: '项目/子项目名称',
            dataIndex: 'projectName',
            width: '15%',
            render: (text, record, index) => {
                return <Select style={{ width: '100px' }} className="btn" onSelect={this.selectProject.bind(this)}>
                    {
                        this.state.projects
                    }
                </Select>
            }
        },
        {
            title: '单位工程',
            dataIndex: 'unitProject',
            width: '10%',
            width: '8%',
            render: (text, record, index) => {
                return <Select value={this.state.beginUnit} style={{ width: '100px' }} className="btn" onSelect={this.selectUnit.bind(this)}>
                    {
                        this.state.units
                    }
                </Select>
            }
        }, {
            title: '方案名称',
            dataIndex: 'scenarioName',
            width: '10%',
        }, {
            title: '编制单位',
            dataIndex: 'organizationUnit',
            width: '10%',
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
            width: '10%',
        }
        , {
            title: '附件',
            width: "5%",
            render: (text, record, index) => {
                if (record.file.id) {
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
}
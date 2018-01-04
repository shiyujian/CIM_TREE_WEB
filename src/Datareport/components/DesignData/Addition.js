import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload, Cascader, notification } from 'antd';
import { getNextStates } from '_platform/components/Progress/util';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, WORKFLOW_CODE, DataReportTemplate_DesignInformation } from '_platform/api';
import { getUser } from '_platform/auth';
const Option = Select.Option;
var moment = require('moment');

export default class Addition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
            projecttrees: [],
            project: {},
            unit: {},
            options: [],
        };
    }
    componentDidMount() {
        const { actions: { getAllUsers, getProjectTree } } = this.props
        getProjectTree({ depth: 1 })
            .then(res => {
                if (res.status) {
                    let projects = res.children.map(item => {
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
            })
    }
    render() {
        const { addition = {}, common = {}, actions: { changeAdditionField } } = this.props;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
        }, {
            title: '文档编码',
            dataIndex: 'code'
        }, {
            title: '文档名称',
            dataIndex: 'name'
        }, {
            title: '项目阶段',
            render: (text, record, index) => (
                <Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, record.index - 1, 'stage')} value={addition.dataSource[record.index - 1]['stage']}>
                    <Option value="初设阶段">初设阶段</Option>
                    <Option value="施工图阶段">施工图阶段</Option>
                    <Option value="竣工阶段">竣工阶段</Option>
                </Select>
            ),
        }, {
            title: '提交单位',
            render: (text, record, index) => {

                if (record.pubUnit && record.pubUnit.name) {
                    return record.pubUnit.name
                } else {
                    return (<Input style={{ color: 'red' }} value={record.pubUnit ? record.pubUnit.code : ''} onBlur={this.fixOrg.bind(this, record.index - 1)} onChange={this.tableDataChange1.bind(this, record.index - 1)} />)
                }
            },
        }, {
            title: '文档类型',
            render: (text, record, index) => (
                <Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, record.index - 1, 'filetype')} value={addition.dataSource[record.index - 1]['filetype']}>
                    <Option value="图纸">图纸</Option>
                    <Option value="报告">报告</Option>
                </Select>
            ),
        }, {
            title: '专业',
            render: (text, record, index) => (
                <Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, record.index - 1, 'major')} value={addition.dataSource[record.index - 1]['major']}>
                    <Option value="建筑">建筑</Option>
                    <Option value="结构">结构</Option>
                </Select>
            ),
        }, {
            title: '描述的WBS对象',
            dataIndex: 'wbsObject'
        }, {
            title: '描述的设计对象',
            dataIndex: 'designObject'
        }, {
            title: '上传人',
            dataIndex: 'upPeople'
        }, {
            title: '附件',
            render: (text, record, index) => {
                if (record.file && record.file.id) {
                    return (<span>
                        <a onClick={this.handlePreview.bind(this, record.index - 1)}>预览</a>
                        <span className="ant-divider" />
                        <Popconfirm
                            placement="leftTop"
                            title="确定删除吗？"
                            onConfirm={this.remove.bind(this, record.index - 1)}
                            okText="确认"
                            cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>)
                } else {
                    return (
                        <span>
                            <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, record.index - 1)}>
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
                        onConfirm={this.delete.bind(this, record.index - 1)}
                        okText="确认"
                        cancelText="取消">
                        <a><Icon type='delete' /></a>
                    </Popconfirm>
                )
            }
        }];
        let jthis = this
        //上传
        const props = {
            action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
            headers: {
            },
            showUploadList: false,
            onChange: async (info) => {
                if (info.file.status !== 'uploading') {
                   
                }
                if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    // console.log(importData);
                    let abc = await jthis.handleExcelData(importData)
                    // console.log('111111111', abc)
                    changeAdditionField('dataSource', abc)
                    notification.success({ message: '成功！' });
                } else if (info.file.status === 'error') {
                    notification.error({ message: `${info.file.name}解析失败，请检查输入` });
                }
            },
        };
        return (
            <Modal
                key={addition.key}
                width={1280}
                visible={addition.visible}
                maskClosable={false}
                onCancel={this.cancel.bind(this)}
                onOk={this.onok.bind(this)}
            >
                <h1 style={{ textAlign: 'center', marginBottom: 20 }}>发起填报</h1>
                <div>
                    <Table
                        bordered
                        columns={columns}
                        rowKey='index'
                        dataSource={addition.dataSource}
                    />
                    <Button style={{ marginRight: 10 }} onClick={this.createLink.bind(this, 'muban', `${DataReportTemplate_DesignInformation}`)} type="default">模板下载</Button>
                    <Upload {...props} beforeUpload={this.beforeUpload.bind(this)}>
                        <Button style={{ margin: '10px 10px 10px 0px' }}>
                            <Icon type="upload" />上传并预览
	                    </Button>
                    </Upload>
                    <span>
                        审核人：
                        <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                common.checkers
                            }
                        </Select>
                    </span>
                    <span>
                        项目-单位工程：
                        <Cascader
                            options={this.state.options}
                            className='btn'
                            loadData={this.loadData.bind(this)}
                            onChange={this.onSelectProject.bind(this)}
                            changeOnSelect
                            placeholder="请选择项目及子单位工程"
                        />
                    </span>
                    {/* <Button className="btn" type="primary" onClick={this.onok.bind(this)}>提交</Button> */}
                </div>
                <div style={{ marginTop: 20 }}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
            </Modal>
        );
    }
    tableDataChange1(index, e) {
        const { addition, actions: { getOrg, changeAdditionField } } = this.props;
        let { dataSource } = addition;
        dataSource[index]['pubUnit'] = {
            name: '',
            code: e.target.value,
            type: ''
        }
        changeAdditionField('dataSource', dataSource)
    }
    //校验组织机构
    fixOrg(index) {
        const { addition, actions: { getOrg, changeAdditionField } } = this.props;
        let { dataSource } = addition;
        // console.log('qqqq', dataSource[index].pubUnit)
        getOrg({ code: dataSource[index].pubUnit.code }).then(rst => {
            if (rst.code) {
                dataSource[index]['pubUnit'] = {
                    name: rst.name,
                    code: rst.code,
                    type: rst.obj_type
                }
                changeAdditionField('dataSource', dataSource)
            } else {
                notification.info({ message: "提交单位错误,请重新输入!" })
            }
        })
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
    //下拉框选择变化
    handleSelect(index, key, value) {
        const { addition, actions: { changeAdditionField } } = this.props;
        let { dataSource } = addition;
        dataSource[index][key] = value;
        changeAdditionField('dataSource', dataSource)
    }
    onSelectProject(value, selectedOptions) {
        let project = {};
        let unit = {};
        if (value.length === 2) {
            let temp1 = JSON.parse(value[0]);
            let temp2 = JSON.parse(value[1]);
            project = {
                name: temp1.name,
                pk: temp1.pk,
                code: temp1.code,
                obj_type: temp1.obj_type
            }
            unit = {
                name: temp2.name,
                pk: temp2.pk,
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
    //附件上传
    beforeUploadPicFile = (index, file) => {
        const fileName = file.name;
        const { addition, actions: { changeAdditionField } } = this.props;
        let { dataSource } = addition;
        let temp = fileName.split(".")[0]
        //判断有无重复
        // if(dataSource.some(o => {
        //    return o.code === temp
        // })){
        //     message.info("该附件已经上传过了")
        //     return false
        // }
        // 上传到静态服务器
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
                notification.error({ message: '文件上传失败' })
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
            let jcode = file.name.split('.')[0]
            //let info = await this.getInfo(jcode)
            dataSource[index]['file'] = attachment
            dataSource[index]['name'] = fileName
            //dataSource[index] = Object.assign(dataSource[index],info)
            changeAdditionField('dataSource', dataSource)
        });
        return false;
    }
    //删除
    delete(index) {
        const { addition, actions: { changeAdditionField } } = this.props;
        let { units, projecttrees } = this.state;
        let { dataSource } = addition;
        this.remove(index);
        dataSource.splice(index, 1);
        units.splice(index, 1);
        projecttrees.splice(index, 1);
        changeAdditionField('dataSource', this.addindex(dataSource))
        this.setState({ units, projecttrees })
    }
    //附件删除
    remove(index) {
        const { actions: { deleteStaticFile } } = this.props
        const { addition, actions: { changeAdditionField } } = this.props;
        let { dataSource } = addition;
        let id = dataSource[index]['file'].id;
        deleteStaticFile({ id: id });

        dataSource[index].file = '';
        changeAdditionField('dataSource', dataSource)
    }
    //下拉框选择人
    selectChecker(value) {
        let check = JSON.parse(value)
        this.setState({ check })
    }
    //预览
    handlePreview(index) {
        const { addition: { dataSource }, actions: { openPreview } } = this.props;
        let f = dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    onok() {
        const { addition, actions: { changeAdditionField } } = this.props;
        let { dataSource } = addition;
        if (!this.state.check) {
            notification.info({ message: "请选择审核人!" })
            return
        }
        if (dataSource.length === 0) {
            notification.info({ message: "请上传excel!" })
            return
        }
        let temp = dataSource.some((o, index) => {
            return !o.file.id
        })
        if (temp) {
            notification.info({ message: `有数据未上传附件!` })
            return
        }
        let temp1 = dataSource.some((o, index) => {
            return !o.pubUnit.name
        })
        if (temp1) {
            notification.info({ message: `有数据未填写正确的提交单位!` })
            return
        }
        const { project, unit } = this.state;
        if (!project.name) {
            notification.info({ message: `请选择项目和单位工程!` });
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
        for (let i = 0; i < dataSource.length; i++) {
            dataSource[i].project = project;
            dataSource[i].unit = unit;
        }
        this.setData(dataSource, per)
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
            name: "设计信息批量录入",
            code: WORKFLOW_CODE["数据报送流程"],
            description: "设计信息批量录入",
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
                    notification.success({ message: "成功!" })
                    clearAdditionField();
                })
        })
    }

    //处理上传excel的数据
    async handleExcelData(data) {
        const { actions: { getOrg } } = this.props;
        data.splice(0, 1);
        let res = data.map(async (item, index) => {
            let judge = await getOrg({ code: item[2] });
            // console.log('judge', judge)
            return {
                code: item[0],
                name: '',
                stage: item[1],
                pubUnit: {
                    code: judge.code ? judge.code : item[2],
                    name: judge.name ? judge.name : "",
                    type: judge.type ? judge.type : ""
                },
                filetype: item[3],
                major: item[4],
                wbsObject: item[5],
                designObject: item[6],
                file: '',
                upPeople: getUser().username,
            }
        })
        let ret = this.addindex(await Promise.all(res));
        return ret;
    }

    cancel() {
        const {
			actions: { clearAdditionField }
		} = this.props;
        clearAdditionField();
    }
    addindex(arr) {
        arr.forEach((item, index) => {
            arr[index].index = ++index
        })
        return arr
    }
    //下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
}

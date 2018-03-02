import React, { Component } from 'react';
import { Table, Button, Popconfirm, Notification, Input, Icon, Modal, Upload, Select, Divider, Switch } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, DataReportTemplate_PersonInformation } from '_platform/api';
const Search = Input.Search;
const { Option, OptGroup } = Select;
export default class ToggleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            org: [],
            subErr: true,
            flag_code: true,
            repeatCode: [],
            editing: false,
            tempData: [],
            usernames: []
        }
    }
    initopthins(list) {
        const ops = [];
        for (let i = 0; i < list.length; i++) {
            ops.push(<Option key={list[i].ID} >{list[i].NurseryName}</Option>)
        }
        return ops;
    }
    render() {
        const { platform: { roles = [] }, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;
        const systemRoles = roles.filter(role => role.grouptype === 0);
        const projectRoles = roles.filter(role => role.grouptype === 1);
        const professionRoles = roles.filter(role => role.grouptype === 2);
        const departmentRoles = roles.filter(role => role.grouptype === 3);
        const tagsOptions = this.initopthins(tags);
        const { visible, actions: { getOrgReverse } } = this.props;
        let jthis = this;
        let accept = 'image/jpg, image/jpeg, image/png';
        const props = {
            action: `${SERVICE_API}/excel/upload-api/`,
            headers: {
            },
            showUploadList: false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    if (importData.length === 1) {
                        Notification.error({
                            message: `${info.file.name}上传失败`
                        });
                        return
                    }
                    jthis.handleExcelData(importData);
                    Notification.success({
                        message: `${info.file.name}上传成功`
                    });
                } else if (info.file.status === 'error') {
                    Notification.error({
                        message: `${info.file.name}解析失败，请检查输入`
                    });
                }
            },
        };
        const columns1 = [
            {
                title: '重名行号',
                dataIndex: 'index',
                key: 'Index',
                render: (text, record, index) => {

                    return record.index + 1
                }
            },
            {
                title: '重复用户名',
                dataIndex: 'username',
                key: 'username',
            },
        ]
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'Index',
            },
            //  {
            //     title: '人员编码',
            //     dataIndex: 'code',
            //     key: 'Code'
            // }, 
            {
                title: '姓名',
                dataIndex: 'record.name',
                key: 'Name',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Input style={{ width: '60px' }} value={record.name || ""} onChange={ele => {
                            record.name = ele.target.value
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span>{record.name}</span>
                    }
                }
            }, {
                title: '用户名',
                dataIndex: 'record.usernames',
                key: 'Usernamess',
                render: (text, record, index) => {
                    // console.log("record", record)
                    if (record.editing === true) {
                        return <Input style={{ width: '60px' }} value={record.usernames || ""} onChange={ele => {
                            record.usernames = ele.target.value
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span>{record.usernames}</span>
                    }
                }
            }, {
                title: '密码',
                dataIndex: 'record.passwords',
                key: 'Passwords',
                render: (text, record, index) => {
                    // console.log("record", record)
                    if (record.editing === true) {
                        return <Input style={{ width: '60px' }} value={record.passwords || ""} onChange={ele => {
                            record.passwords = ele.target.value
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span>{record.passwords}</span>
                    }
                }
            }
            // , {
            //     title: '所在组织机构单位',
            //     dataIndex: 'record.org',
            //     key: 'Org',
            //     render: (text, record, index) => {
            //         if (record.account) {
            //             return record.org = record.account.org
            //         } else {
            //             return record.org = record.org
            //         }
            //     }
            // }
            , {
                title: '所属部门',
                // dataIndex: 'account.org_code',
                key: 'Depart',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        if (record.org) {
                            return <Input
                                style={{ width: '60px' }}
                                value={record.depart || ""}
                                onChange={this.tableDataChange.bind(this, index)}
                            // onBlur={this.fixOrg.bind(this,index)}
                            />
                        } else {
                            return <Input
                                style={{ width: '60px', color: 'red' }}
                                value={record.depart || ""}
                                onChange={this.tableDataChange.bind(this, index)}
                            // onBlur={this.fixOrg.bind(this,index)}
                            />
                        }
                    } else {
                        return <span>{record.depart}</span>
                    }
                }
            }, {
                title: '职务',
                dataIndex: 'record.job',
                key: 'Job',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Input value={record.job || ""} onChange={ele => {
                            record.job = ele.target.value
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span>{record.job}</span>
                    }
                }
            }, {
                title: '性别',
                dataIndex: 'record.sex',
                key: 'Sex',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Select style={{ width: 42 }} value={record.sex} onChange={ele => {
                            record.sex = ele
                            this.forceUpdate();
                        }}>
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
                    } else {
                        return <span>{record.sex}</span>
                    }
                }
            }, {
                title: '手机号码',
                dataIndex: 'record.tel',
                key: 'Tel',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Input style={{ color: record.tel_red }} value={record.tel || ""} onChange={ele => {
                            record.tel = ele.target.value
                            let regTel = /^1[3|4|5|7|8][0-9]{9}$/
                            if (!regTel.test(record.tel)) {
                                record.tel_red = "red";
                            } else {
                                record.tel_red = "";
                            }
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span style={{ color: record.tel_red }} >{record.tel}</span>
                    }
                }
            }, {
                title: '邮箱',
                dataIndex: 'record.email',
                key: 'Email',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Input style={{ color: record.email_red }} value={record.email || ""} onChange={ele => {
                            record.email = ele.target.value
                            let regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                            if (!regEmail.test(record.email)) {
                                record.email_red = "red";
                            } else {
                                record.email_red = "";
                            }
                            this.forceUpdate();
                        }} />
                    } else {
                        return <span style={{ color: record.email_red }}>{record.email}</span>
                    }
                }
            }
            , {
                title: '标段',
                key: 'sections',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Select placeholder="标段" value={addition.sections || record.sections}
                            onChange={(e) => {
                                console.log("e:", e);
                                record.sections = e;
                                this.forceUpdate();
                            }}
                            mode="multiple" style={{ width: '100%' }}>
                            <Option key={'P009-01-01'} >1标段</Option>
                            <Option key={'P009-01-02'} >2标段</Option>
                            <Option key={'P009-01-03'} >3标段</Option>
                            <Option key={'P009-01-04'} >4标段</Option>
                            <Option key={'P009-01-05'} >5标段</Option>
                        </Select>
                    } else {
                        return <span style={{ color: record.email_red }}>{record.sections}</span>
                    }
                }
            }
            , {
                title: '苗圃',
                key: 'tags',
                render: (text, record, index) => {
                    if (record.editing === true) {
                        return <Select placeholder="苗圃" showSearch value={addition.tags || record.tags}
                            onChange={this.changeTags.bind(this, record)}
                            mode="multiple" style={{ width: "100%" }}>
                            {tagsOptions}
                        </Select>
                    } else {
                        return <span style={{ color: record.email_red }}>{record.tags}</span>
                    }
                }
            }
            , {
                title: '角色',
                key: 'groups',
                render: (text, record, index) => {
                    console.log("record",record)
                    if (record.editing === true) {
                        return <Select placeholder="请选择角色" value={addition.groups || record.groups} onChange={this.changeRoles.bind(this, record)}
                        mode="multiple" style={{ width: '100%' }}>
                        <OptGroup label="苗圃角色">
                            {
                                systemRoles.map(role => {
                                    return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
                                })
                            }
                        </OptGroup>
                        <OptGroup label="施工角色">
                            {
                                projectRoles.map(role => {
                                    return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
                                })
                            }
                        </OptGroup>
                        <OptGroup label="监理角色">
                            {
                                professionRoles.map(role => {
                                    return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
                                })
                            }
                        </OptGroup>
                        <OptGroup label="业主角色">
                            {
                                departmentRoles.map(role => {
                                    return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
                                })
                            }
                        </OptGroup>
                    </Select>
                    } else {
                        return <span style={{ color: record.email_red }}>{record.groups}</span>
                    }
                }
            }
            , {
                title: '二维码',
                render: (record) => {
                    return (
                        <Upload
                            beforeUpload={this.beforeUploadPic.bind(this, record)}
                            accept={accept}
                        >
                            <a>{record.signature ? record.signature.name : '点击上传'}</a>
                        </Upload>
                    )
                }
            }, {
                title: '操作',
                width: "7%",
                render: (text, record, index) => {
                    return <span>
                        {
                            record.editing
                            ||
                            <span>
                                <a><Icon type="edit" onClick={(e) => {
                                    record.editing = true
                                    this.forceUpdate();
                                }} /></a>
                                <Popconfirm
                                    title="确认删除吗"
                                    onConfirm={this.delete.bind(this, record.index - 1)}
                                    okText="确认"
                                    onCancel="取消"
                                >
                                    <span style={{ "margin": "7px" }}>|</span>
                                    <a><Icon type="delete" /></a>
                                </Popconfirm>
                            </span>
                        }
                        {
                            record.editing
                            &&
                            <a onClick={(e) => {
                                record.editing = false
                                this.forceUpdate();
                            }}>完成</a>
                        }
                    </span>
                }
            }]
        return (
            <Modal
                visible={visible}
                width={1280}
                onOk={this.onok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>发起填报</h1>
                <div>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={columns}
                        size='middle'
                        dataSource={this.state.dataSource}
                        bordered />
                    <Button style={{ margin: '10px 10px 10px 0px' }} onClick={this.createLink.bind(this, 'muban', `${DataReportTemplate_PersonInformation}`)} type="default">模板下载</Button>
                    <Upload {...props}>
                        <Button style={{ margin: '10px 10px 10px 0px' }}>
                            <Icon type="upload" />上传并预览
                        </Button>
                    </Upload>
                    {/* <span>
                        审核人：
                    <Select style={{ width: '200px' }} className="btn" onSelect = {ele=>{
                            this.setState({passer:ele})
                        }} >
                            {
                                this.state.checkers
                            }
                        </Select>
                    </span> */}
                </div>
                <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                    columns={columns1}
                    size='small'
                    dataSource={this.state.usernames}
                    bordered />
                <div style={{ marginTop: 20 }}>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </div>
            </Modal>
        )
    }
    changeRoles(record, value) {
        record.groups = value;
        const { actions: { changeAdditionField } } = this.props;
        changeAdditionField('groups', value)
    }
    changeTags(record, value) {
        record.tags = value;
        const { actions: { changeAdditionField } } = this.props;
        changeAdditionField('tags', value)
    }
    submit() {

    }
    selectChecker() {

    }
    validateCode(record, e) {
        let codes = [];
        record.code = e.target.value;
        this.forceUpdate();
        this.state.dataSource.map(item => {
            codes.push(item.code);
        })
        let repeatCode = this.isRepeat(codes);
        if (repeatCode.length > 1) {
            this.setState({ flag_code: false })
        } else {
            this.setState({ flag_code: true })
        }
        this.setState({ repeatCode });
    }

    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    beforeUploadPic(record, file) {
        const fileName = file.name;
        const imageType = 'image/jpg, image/jpeg, image/png';
        const isJPG = imageType.indexOf(file.type) >= 0;
        if (!isJPG) {
            Notification.warning({
                message: '请上传图片！'
            });
            return false;
        }
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
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.signature = loadedFile;
            this.forceUpdate();
        });
        return false;
    }
    async onok() {
        if (this.state.dataSource.length === 0) {
            Notification.warning({
                message: "请上传人员信息"
            })
            return;
        }
        console.log("this.state.dataSource", this.state.dataSource)
        for (let i = 0; i < this.state.dataSource.length; i++) {
            const element = this.state.dataSource[i];
            // console.log("element", element)
            // if (element.org === "") {
            //     Notification.warning({
            //         message: "该部门不存在"
            //     })
            //     return;
            // }
            if (element.tel_red === "red") {
                Notification.warning({
                    message: "存在错误的手机号"
                })
                return;
            }
            if (element.email_red === "red") {
                Notification.warning({
                    message: "存在错误的邮箱号"
                })
                return;
            }
        }
        const { actions: { PostPeople, getOrgName, ModalVisible, is_fresh, putUser, postUser, getUsers, postName } } = this.props;
        let data_list = [];
        let pks = [];
        for (let i = 0; i < this.state.dataSource.length; i++) {
            let rst = await getOrgName({ code: this.state.dataSource[i].depart })
            pks.push(rst.pk);
        }
        let arrr = this.state.dataSource;
        let codes = [];
        let arrName = []
        arrr.map((item, index) => {
            codes.push(item.code)
            arrName.push(item.usernames)
        })

        postName({}, { "user_list": arrName }).then(rst => {
            if (rst.length > 0) {
                this.setState({
                    usernames: rst
                })
            } else {
                let arrr = this.state.dataSource;
                let codes = [];
                let arrName = []
                let promisess = arrr.map((item, index) => {
                    console.log("item", item.groups)
                    codes.push(item.code)
                    arrName.push(item.usernames)
                    return postUser({}, {
                        is_person: true,
                        username: item.usernames || '',
                        email: item.email || '',
                        password: item.passwords,
                        account: {
                            person_code: '',
                            person_name: item.name,
                            person_type: "C_PER",
                            person_avatar_url: "",
                            organization: {
                                pk: pks[index],
                                code: item.depart,
                                obj_type: "C_ORG",
                                rel_type: "member",
                                name: '11'
                            },
                        },
                        tags: item.tags,
                        sections: item.sections,
                        groups: item.groups,
                        is_active: true,
                        basic_params: {
                            info: {
                                '电话': "11" + item.tel,
                                '性别': item.sex || '',
                                '技术职称': item.job || '',
                                'phone': item.tel || '',
                                'sex': item.sex || '',
                                'duty': '',
                            }
                        },
                        extra_params: {},
                        title: item.job || ''
                    });
                })
                Promise.all(promisess).then(rst => {
                    console.log("rst", rst)
                    let count = 0
                    let count1 = 0
                    for (let i = 0; i < rst.length; i++) {
                        const element = rst[i];
                        if (element.code == 1) {
                            count++
                        }
                        else {
                            count1++
                        }
                    }
                    Notification.success({
                        message: "成功创建" + count + "条数据" + (count1 ? "失败" + count1 + "条数据" : '')
                    })
                    ModalVisible(false);
                    is_fresh(true);
                })
            }

        })
    }
    cancel() {
        const { actions: { ModalVisible } } = this.props;
        ModalVisible(false);
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

    tableDataChange(index, e) {
        const { actions: { getOrgReverse } } = this.props;
        const { dataSource } = this.state;
        console.log("dataSource", dataSource)
        console.log("index", index)
        console.log("e", e)
        dataSource[index].depart = e.target.value;
        console.log("dataSource[index].depart", dataSource[index].depart)

        getOrgReverse({ code: dataSource[index].depart }).then(rst => {
            console.log("rst", rst)
            if (rst.children.length !== 0) {
                dataSource[index]['account'] = {
                    org: rst.children[0].name
                }
            } else {
                dataSource[index]['account'] = {
                    org: ''
                }
            }
            this.setState({ dataSource });
        })
    }
    delete(index) {
        let dataSource = this.state.dataSource;
        dataSource.splice(index, 1);
        this.setState({ flag_code: true, subErr: true })
        this.delData(dataSource);
        this.setState({ dataSource })
    }

    //判断数据重复
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
    // 处理数据删除之后的校验
    delData(data) {
        const { actions: { getOrgReverse } } = this.props;
        let codes = [];
        let promises = data.map(item => {
            codes.push(item.code)
            return getOrgReverse({ code: item.depart });
        })
        let repeatCode = this.isRepeat(codes);
        if (repeatCode.length > 1) {
            this.setState({ flag_code: false })
        }
        this.setState({ repeatCode })
        let res, orgname = [];
        Promise.all(promises).then(rst => {
            rst.map(item => {
                if (item.children.length === 0) {
                    orgname.push('');
                    this.setState({
                        subErr: false
                    })
                }
                else {
                    orgname.push(item.children[0].name);
                }
            })
            res = data.map((item, index) => {
                // console.log("item",item)
                return {
                    index: index + 1,
                    code: item.code || '',
                    name: item.name || '',
                    org: orgname[index] || '',
                    depart: item.depart || '',
                    job: item.job || '',
                    sex: item.sex || '',
                    tel: item.tel || '',
                    usernames: item.usernames || '',
                    sections: item.sections || '',
                    tags: item.tags || '',
                    groups: item.groups || '',
                    email: item.email || '',
                    // passwords: 111111,
                }
            })
            this.setState({
                dataSource: res
            })
        })
    }
    //处理上传excel的数据
    async handleExcelData(data) {
        const { actions: { getOrgReverse, getOrgName } } = this.props;
        data.splice(0, 1);
        let data_person, orgname = [], orgpk = [], orgcode = [], orgReverse = [], codes = [], org_names = [];
        console.log("data:", data);
        let set = {};
        for (let i = 0; i < data.length; i++) {
            set[data[i][2]] = data[i][2]
            codes.push(data[i][0])
        }
        let repeatCode = this.isRepeat(codes);

        let orgCodes = Object.keys(set);
        console.log("orgCodes", orgCodes)

        for (let i = 0; i < orgCodes.length; i++) {
            let result_names = await getOrgName({ code: orgCodes[i] })
            console.log("result_names", result_names)
            let orgNames = result_names.name;
            let orgCode = orgCodes[i];
            org_names.push({
                orgNames: orgNames,
                orgCode: orgCode
            });
            let rst = await getOrgReverse({ code: orgCodes[i] })
            let tempCode = orgCodes[i];
            rst["orgCode"] = tempCode
            orgReverse.push(rst);
        }
        if (repeatCode.length > 1) {
            this.setState({ flag_code: false })
        }
        this.setState({ repeatCode })

        data_person = data.map((item, index) => {
            let regTel = /^1[3|4|5|7|8|9][0-9]{9}$/;
            let tel_red = ""
            if (!regTel.test(item[5])) {
                tel_red = "red";
            }
            let regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            let email_red = "";
            if (!regEmail.test(item[6])) {
                email_red = "red";
            }
            let org = '', orgcode = '', orgpk = '', partname = '';
            // console.log(orgReverse)
            for (let i = 0; i < orgReverse.length; i++) {
                if (orgReverse[i].orgCode === item[2]) {
                    if (orgReverse[i].children.length > 0) {
                        org = orgReverse[i].children[0].name;
                        orgcode = orgReverse[i].children[0].code;
                        orgpk = orgReverse[i].children[0].pk;
                        partname = org_names[i].orgNames
                        // console.log("org",org)
                        // console.log("orgcode",orgcode)
                        // console.log("orgpk",orgpk)
                        // console.log("partname",partname)
                    } else {
                        org = '';
                        orgcode = '';
                        orgpk = '';
                        partname = ''
                    }
                }
            }
            console.log(item)
            const group = item[11].toString()
            const tag = item[10].toString()
            const section = item[9].toString()
            const groups = group.split(",")
            const tags = tag.split(",")
            const sections = section.split(",")
            return {
                index: index + 1,
                name: item[1] || '',
                org: org || '',
                orgpk: orgpk || '',
                orgcode: orgcode || '',
                org_names: partname,
                depart: item[2] || '',
                job: item[3] || '',
                sex: item[4] || '',
                tel: item[5] || '',
                tel_red: tel_red,
                email: item[6] || '',
                email_red: email_red,
                signature: '',
                usernames: item[7] || '',
                passwords: item[8] || '',
                sections: sections || '',
                tags: tags || '',
                groups: groups || '',
                editing: false,
            }
        })
        console.log("1111111111data_person", data_person)
        this.setState({
            dataSource: data_person,
            tempData: data_person
        })
    }
    componentDidMount() {
        const { actions: { getAllUsers, getOrgList } } = this.props;
        getAllUsers().then(rst => {
            let users = [];
            if (rst.length) {
                let checkers = rst.map(o => {
                    return (
                        <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                    )
                })
                this.setState({ checkers })
            }
        });
    }

}
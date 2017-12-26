import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input, Icon, Modal, Upload, Select, Divider } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API } from '_platform/api';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { WORKFLOW_CODE } from '_platform/api';
import ECCB from '../EditCellWithCallBack';
var moment = require('moment');
const Search = Input.Search;
const { Option } = Select
export default class SubmitChangeModal extends Component {
    constructor(props) {
        super(props);
        let ds = props.dataSource.map(data => {
            let rst = { ...data, ...data.extra_params };
            rst.file = rst.files.find(f=>{
                return f.misc === 'file';
            });
            rst.pic = rst.files.find(f=>{
                return f.misc === "pic";
            });
            return rst;
        });
        console.log(ds);
        this.state = {
            dataSource: ds
        };
    }
    render() {
        return (
            <Modal
                onCancel={this.props.onCancel}
                title="项目变更申请表"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}>
                <Table
                    columns={this.columns}
                    bordered={true}
                    dataSource={this.state.dataSource || []}
                />
            </Modal>
        )
    }
    columns = [
        {
            title: '项目/子项目名称',
            dataIndex: 'name',
            key: 'Name',
        }, {
            title: '所属区域',
            render: (record) => {
                let checkVal = (value) => {
                    record.area = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.area}
                        checkVal={checkVal}
                        value={record.area} />
                )
            },
            key: 'Area',
        }, {
            title: '项目规模',
            render: (record) => {
                let checkVal = (value) => {
                    record.range = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.range}
                        checkVal={checkVal}
                        value={record.range} />
                )
            },
            key: 'Range',
        }, {
            title: '项目类型',
            render: (record) => {
                return (
                    <Select style={{ width: '70px' }} className="btn" value={record.projType || ''} onSelect={ele => {
                        record.projType = ele;
                        this.forceUpdate();
                    }} >
                        <Option value='建筑'>建筑</Option>
                        <Option value='市政'>市政</Option>
                        <Option value='园林'>园林</Option>
                    </Select>)
            },
            key: 'ProjType',
        }, {
            title: '项目地址',
            render: (record) => {
                let checkVal = (value) => {
                    record.address = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.address}
                        checkVal={checkVal}
                        value={record.address} />
                )
            },
            key: 'Address',
        }, {
            title: '项目红线坐标',
            render: (record) => {
                let checkVal = (value) => {
                    record.coordinate = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.coordinate}
                        checkVal={checkVal}
                        value={record.coordinate} />
                )
            },
            // render: (record) => {
            //     return (<span>{record.extra_params.coordinate || ''}</span>);
            // },
            key: 'Project',
        }, {
            title: '项目负责人',
            render: (record) => {
                let checkVal =async (code) => {
                    let perName = '数据错误';
                    let {getPersonByCode}  = this.props.actions;
                    let perRst = await getPersonByCode({code:code});
                    if(perRst.code && perRst.code.length>0){
                        return perRst.name;
                        record.relPer = perRst;
                    }
                    record.error = true;
                    this.forceUpdate();
                    return perName;
                }
                return (
                        <ECCB
                            error = {record.error}
                            initCheckedValue={record.response_persons[0] ? record.response_persons[0].name : ''}
                            checkVal={checkVal.bind(this)}
                            value={record.response_persons[0] ? record.response_persons[0].code : ''} />
                )
            },
            key: 'Remarks'
        }, {
            title: '计划开工日期',
            render: (record) => {
                let checkVal = (value) => {
                    record.stime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.stime}
                        checkVal={checkVal}
                        value={record.stime} />
                )
            },
            key: 'Stime'
        }, {
            title: '计划竣工日期',
            render: (record) => {
                let checkVal = (value) => {
                    record.etime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.etime}
                        checkVal={checkVal}
                        value={record.etime} />
                )
            },
            key: 'Etime'
        }, {
            title: '简介',
            render: (record) => {
                let checkVal = (value) => {
                    record.intro = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.intro}
                        checkVal={checkVal}
                        value={record.intro} />
                )
            },
            key: 'Intro'
        }, {
            title: '附件',
            key: 'oper',
            render: (record) => (
                <Upload
                    beforeUpload={this.beforeUpload.bind(this, record)}
                >
                    <a> {record.file ? record.file.name : '上传附件'}</a>
                </Upload>
            )
        }, {
            title: '项目图片',
            key: 'pic',
            render: (record) => (
                <Upload
                    beforeUpload={this.beforeUploadPic.bind(this, record)}
                >
                    <a>{record.pic ? record.pic.name : '点击上传'}</a>
                </Upload>
            )
        }]
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    beforeUploadPic(record, file) {
        const fileName = file.name;
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
            record.pic = loadedFile;
            this.forceUpdate();
        });
        return false;
    }
    beforeUpload(record, file) {
        console.log(record, file);
        const fileName = file.name;
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
            record.file = loadedFile;
            // record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }

}
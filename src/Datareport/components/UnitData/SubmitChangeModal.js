import React, { Component } from 'react';
import { Table, Button, Popconfirm, notification, Input, Icon, Modal, Upload, Select, Divider, Row, Col } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API } from '_platform/api';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { WORKFLOW_CODE } from '_platform/api';
import ECCB from '../EditCellWithCallBack';
var moment = require('moment');
const Search = Input.Search;
const TextArea = Input.TextArea;

const { Option } = Select
export default class SubmitChangeUnitModal extends Component {
    constructor(props) {
        super(props);
        let ds = props.dataSource.map(data => {
            let rst = { ...data, ...data.extra_params };
            rst.file = rst.files.find(f => {
                return f.misc === 'file';
            });
            return rst;
        });
        console.log(ds);
        this.state = {
            dataSource: ds,
            description:""
        };
    }
    componentDidMount() {
        const { actions: { getAllUsers } } = this.props
        getAllUsers().then(res => {
            console.log(res);
            let set = {};
            let checkers = res.map(o => {
                set[o.id] = o;
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers, usersSet: set })
        });
    }
    submit() {
        const { actions: { createWorkflow, logWorkflowEvent } } = this.props
        let creator = {
            id: getUser().id,
            username: getUser().username,
            person_name: getUser().person_name,
            person_code: getUser().person_code,
        }
        let postdata = {
            name: "单位工程批量变更申请",
            code: WORKFLOW_CODE["数据报送流程"],
            description: this.state.description,
            subject: [{
                data: JSON.stringify(this.state.dataSource)
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
                    note: this.state.description,
                    executor: creator,
                    next_states: [{
                        participants: [this.state.passer],
                        remark: "",
                        state: nextStates[0].to_state[0].id,
                    }],
                    attachment: null
                });
        });
        this.props.onCancel();
        notification.success({
            message:"流程发起成功"
        })
    }
    description(e) {
		this.setState({description:e.target.value})
	}
    render() {
        return (
            <Modal
                onCancel={this.props.onCancel}
                visible={true}
                width={1280}
                // footer={null}
                onOk = {() => {
                    if (!this.state.passer) {
                        notification.warning({
                            message:"请选择审核人"
                        })
                        return;
                    }
                    let err = this.state.dataSource.some(data => {
                        return data.error;
                    });
                    if (err) {
                        notification.warning({
                            message:"表格数据有错误"
                        })
                        return;
                    }
                    this.submit();
                }}
                maskClosable={false}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>申请变更</h1>
                <Table
                    columns={this.columns}
                    bordered={true}
                    dataSource={this.state.dataSource || []}
                />
                <span>
                    审核人：
                        <Select style={{ width: '200px' }} className="btn" onSelect={ele => {
                        this.setState({ passer: JSON.parse(ele) })
                    }} >
                        {
                            this.state.checkers || []
                        }
                    </Select>
                </span>
                <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea placeholder="变更原因" rows={2} onChange={this.description.bind(this)}/>
				    </Col>
			    </Row>
            </Modal>
        )
    }
    columns =
        [{
            title: '单位工程编码',
            dataIndex: 'code',
            key: 'Code',
        },{
            title: '单位工程名称',
            dataIndex: 'name',
            key: 'Name',
        },
        {
            title: '所属项目名称',
            dataIndex: 'fatherName',
            key: 'fatherName',
        } ,
        {
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
            key: 'Type',
        }, {
            title: '项目阶段',
            render: (record) => {
                return (
                    <Select style={{ width: '70px' }} className="btn" value={record.stage || ''} onSelect={ele => {
                        record.stage = ele;
                        this.forceUpdate();
                    }} >
                        <Option value='初设阶段'>初设阶段</Option>
                        <Option value='施工阶段'>施工阶段</Option>
                        <Option value='竣工阶段'>竣工阶段</Option>
                    </Select>)
            },
            key: 'Stage',
        }, {
            title: '单位红线坐标',
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
            key: 'coordinate'
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
            title: '单位工程简介',
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
            title: '建设单位',
            render: (record) => {
                let checkVal =async (code) => {
                    let perName = '数据错误';
                    let {getOrgByCode}  = this.props.actions;
                    let orgRst = await getOrgByCode({code:code});
                    if(orgRst.pk){                        
                        record.rsp_org = orgRst;
                        record.error = null;
                        this.forceUpdate();
                        return orgRst.name;
                    }
                    record.error = true;
                    this.forceUpdate();
                    return perName;
                }
                return (
                        <ECCB
                            error = {record.error}
                            initCheckedValue={record.rsp_orgName ? record.rsp_orgName[0] : ''}
                            checkVal={checkVal.bind(this)}
                            value={record.rsp_orgCode ? record.rsp_orgCode[0] : ''} />
                )
            },
            // render: (record) => {
            //     let ogrname = '';
            //     if (record.rsp_orgName && record.rsp_orgName.length > 0) {
            //         ogrname = record.rsp_orgName[0];
            //     }
            //     return (<span>{ogrname}</span>)
            // },
            key: 'Org'
        }, {
            title: '附件',
            key: 'file',
            render: (record) => (
                <Upload
                    beforeUpload={this.beforeUpload.bind(this, record)}
                >
                    <a> {record.file ? record.file.name : '上传附件'}</a>
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
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { notification, Input, Col, Card, Table, Row, Button, DatePicker, Radio, Select, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import { getUser } from '_platform/auth';
import { actions } from '../../store/safety';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(
    state => {
        const { datareport: { safetyspecial = {} } = {}, platform } = state;
        return { platform, ...safetyspecial }
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions, ...actions }, dispatch)
    })
)
export default class SafetySpecialEditCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            option: 1,
            topDir: {},
        };
    }
    async componentDidMount() {
        const { wk } = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk })
    }
    componentWillReceiveProps(props) {
        const { wk } = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk })
    }
    cancel() {
        this.props.closeModal("Safety_Special_edit_visible", false)
    }
    //提交
    async submit() {
        if (this.state.option === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("Safety_Special_edit_visible", false);
        message.info("操作成功")
    }

    //通过
    async passon() {
        const { dataSource, wk, topDir } = this.state;
        const { actions: { logWorkflowEvent, updateDocList, getScheduleDir, postScheduleDir, getWorkpackagesByCode } } = this.props;
      
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;

        await logWorkflowEvent( // step3: 提交填报 [post] /instance/{pk}/logevent/ 参数
            {
                pk: wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '通过',
                note: '同意',
                attachment: null
            }
        );
        const docCode = [];
        dataSource.map(item=>{
            debugger;
            i++;
            docData.push({
                code: item.codeId,
                name: item.file.name,
                obj_type: "C_DOC",
                status: 'A',
                profess_folder: { code: dir.code, obj_type: 'C_DIR' },
                "basic_params": {
                    "files": [
                        {
                            "a_file": item.file.a_file,
                            "name": item.file.name,
                            "download_url": item.file.download_url,
                            "misc": "file",
                            "mime_type": item.file.mime_type
                        },
                    ]
                },
                extra_params: {
                    code: item.code,
                    filename: item.file.name,
                    resUnit: item.resUnit,
                    index: item.index,
                    projectName: item.projectName,
                    unitProject: item.unitProject,
                    scenarioName: item.scenarioName,
                    organizationUnit: item.organizationUnit,
                    reviewTime: item.reviewTime,
                    reviewComments: item.reviewComments,
                    reviewPerson: item.reviewPerson,
                    remark: item.remark,
                    project: item.project,
                    unit: item.unit,
                    changeInfo: item.changeInfo,
                    codeId: item.codeId,
                }
            })
        })

        let rst = await updateDocList({}, { data_list: docCode });
        if (rst.result) {
            notification.success({
                message: '文档变更成功！',
                duration: 2
            });
        } else {
            notification.error({
                message: '文档变更失败！',
                duration: 2
            });
        }
    }
    //不通过
    async reject() {
        const { wk } = this.props
        const { actions: { deleteWorkflow } } = this.props
        await deleteWorkflow({ pk: wk.id })
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
    onChange(e) {
        this.setState({
            ...this.state,
            option: e.target.value
        })
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '5%'
            },
            {
                title: '编码',
                dataIndex: 'code',
                width: '10%'
            }, {
                title: '项目名称',
                dataIndex: 'projectName',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            }, {
                title: '单位工程',
                dataIndex: 'unit',
                width: '10%',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            }, {
                title: '方案名称 ',
                dataIndex: 'scenarioName',
                width: '10%',
            }, {
                title: '发布单位',
                dataIndex: 'pubUnit',
                width: '10%',
            }, {
                title: '评审意见',
                dataIndex: 'reviewComments',
                width: '10%',
            }, {
                title: '评审时间',
                dataIndex: 'reviewTime',
                width: '10%',
            },
            {
                title: '附件',
                width: "10%",
                render: (text, record, index) => {
                    return (<span>
                        <a onClick={this.handlePreview.bind(this, index)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
                }
            },
            {
                title: '评审人员',
                dataIndex: 'reviewPerson',
                width: '10%',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                width: '10%',
            },
        ];
        return (
            <Modal
                title="安全专项变更审批表"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}
                onCancel={this.cancel.bind(this)}
                >

                <div>
                    <h1 style={{ textAlign: 'center', marginBottom: 20 }}>结果审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <Row>
                        <Col span={2}>
                            <span>审查意见：</span>
                        </Col>
                        <Col span={4}>
                            <RadioGroup
                                onChange={this.onChange.bind(this)}
                                value={this.state.option}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={2}>不通过</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary'>
                                导出表格
                            </Button>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
                            </Button>
                            <Preview />
                        </Col>
                    </Row>
                    {/* {
                        this.state.dataSource[0].deleteInfo ? <Row>
                            <Col span={4}>
                                申请删除原因：{this.state.dataSource[0].changeInfo}
                            </Col>
                        </Row>
                            :
                            ""
                    } */}
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk} />
                    }
                </div>
            </Modal>
        )
    }
}

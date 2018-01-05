import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../../store/quality';
import { Input, Col, Card, Table, Row, Button, DatePicker, Radio, Select, Popconfirm, Modal, Upload, Icon, message,notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '_platform/components/layout/Preview';
import { getUser } from '_platform/auth';
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select;
var moment = require('moment');
@connect(
    state => {
        const { platform } = state;
        return { platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class DefectCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            opinion: 1,
            topDir: {}
        };
    }
    async componentDidMount() {
        //创建一级文档目录
        const { wk } = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk });
        const { actions: {
            getScheduleDir,
            postScheduleDir,
        } } = this.props;
        let topDir = await getScheduleDir({ code: 'the_only_main_code_datareport' });
        if (!topDir.obj_type) {
            let postData = {
                name: '数据报送的顶级节点',
                code: 'the_only_main_code_datareport',
                "obj_type": "C_DIR",
                "status": "A",
            }
            topDir = await postScheduleDir({}, postData);
        }
        this.setState({ topDir });
    }

    componentWillReceiveProps(props) {
        const { wk } = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk })
    }

    //提交
    async submit() {
        if (this.state.opinion === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("dr_qua_defect_visible", false);
        notification.success({
            message: '操作成功！',
            duration: 2
        });
    }
    //通过
    async passon() {
        const { dataSource, wk, topDir } = this.state
        const { actions: { logWorkflowEvent, updateWpData, addDocList, putDocList, getScheduleDir, postScheduleDir } } = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let code = 'datareport_defect_bubu';
        let postDirData = {
            "name": '质量缺陷目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            "parent": { "pk": topDir.pk, "code": topDir.code, "obj_type": topDir.obj_type }
        }
        let dir = await getScheduleDir({ code: code });
        //no such directory
        if (!dir.obj_type) {
            dir = await postScheduleDir({}, postDirData);
        }

        await logWorkflowEvent({ pk: wk.id }, { state: wk.current[0].id, action: '通过', note: '同意', executor: executor, attachment: null });
        //prepare the data which will store in database
        const docData = [];
        let i = 0;   //asure the code of every document only
        dataSource.map(item => {
            i++;
            docData.push({
                code: 'quality_defect' + moment().format("YYYYMMDDHHmmss") + i,
                name: item.name + 'quality_defect',
                obj_type: "C_DOC",
                status: 'A',
                profess_folder: { code: dir.code, obj_type: 'C_DIR' },
                "basic_params": {
                    "files": [
                        item.file
                    ]
                },
                extra_params: {
                    code: item.code,
                    acc_type: item.acc_type,
                    uploda_date: item.uploda_date,
                    check_date: item.check_date,
                    do_date: item.do_date,
                    descrip: item.descrip,
                    check_result: item.check_result,
                    deadline: item.deadline,
                    result: item.result,
                    project: item.project.name,
                    respon_unit: item.respon_unit.name,
                    unit: item.unit.name
                }
            })
        });
        let rst = await addDocList({}, { data_list: docData });
        if (rst.result) {
            notification.success({
                message: '创建文档成功！',
                duration: 2
            });
        } else {
            notification.error({
                message: '创建文档失败！',
                duration: 2
            });
        }
    }
    //不通过
    async reject() {
        const { wk } = this.props
        const { actions: { deleteWorkflow } } = this.props
        await deleteWorkflow({ pk: wk.id })
        // let executor = {};
        // let person = getUser();
        // executor.id = person.id;
        // executor.username = person.username;
        // executor.person_name = person.name;
        // executor.person_code = person.code;
        // await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'退回',note:'滚',executor:executor,attachment:null});
    }
    //radio变化
    onChange(e) {
        this.setState({ opinion: e.target.value })
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
        let columns = [{
            title: '序号',
            width: '4%',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '项目/子项目名称',
            dataIndex: 'projectName',
            render: (text, record, index) => {
                return <span>{record.project ? record.project.name : ''}</span>
            }
        }, {
            title: '单位工程',
            dataIndex: 'unit',
            render: (text, record, index) => {
                return <span>{record.unit ? record.unit.name : ''}</span>
            }
        }, {
            title: 'WBS编码',
            dataIndex: 'code',
        }, {
            title: '责任单位',
            dataIndex: 'respon_unit',
            render: (text, record, index) => {
                return <span>{record.respon_unit ? record.respon_unit.name : ''}</span>
            }
        }, {
            title: '事故类型',
            dataIndex: 'acc_type',
        }, {
            title: '上报时间',
            dataIndex: 'uploda_date',
        }, {
            title: '核查时间',
            dataIndex: 'check_date',
        }, {
            title: '整改时间',
            dataIndex: 'do_date',
        }, {
            title: '事故描述',
            dataIndex: 'descrip',
        }, {
            title: '排查结果',
            dataIndex: 'check_result',
        }, {
            title: '整改期限',
            dataIndex: 'deadline',
        }, {
            title: '整改结果',
            dataIndex: 'result',
        }, {
            title: '附件',
            render: (text, record, index) => {
                return (<span>
                    <a onClick={this.handlePreview.bind(this, index)}>预览</a>
                    <span className="ant-divider" />
                    <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                </span>)
            }
        }];
        return (
            <Modal
                title="质量问题缺陷"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}>
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
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
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
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk} />
                    }
                </div>
            </Modal>
        )
    }
}

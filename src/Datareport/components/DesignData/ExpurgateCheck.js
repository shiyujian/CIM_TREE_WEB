import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../store/DesignData';
import { actions as platformActions } from '_platform/store/global';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col, DatePicker, Select, notification } from 'antd';
import WorkflowHistory from '../WorkflowHistory'
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import { getUser } from '_platform/auth';
import { CODE_PROJECT } from '_platform/api';
import '../index.less';
import moment from 'moment';
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Option } = Select
const { TextArea } = Input;
@connect(
    state => {
        const { datareport: { designdata = {} } = {}, platform } = state;
        return { ...designdata, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class ExpurgateCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            origindataSource: [],
            opinion: 1,//1表示通过 2表示不通过
        };
    }
    async componentDidMount() {
        const { wk } = this.props
        let dataSource = this.addindex(JSON.parse(wk.subject[0].data).changedata)
        let origindataSource = this.addindex(JSON.parse(wk.subject[0].data).origindata)
        this.setState({ dataSource, origindataSource, wk });
    }

    //提交
    async submit() {
        if (this.state.opinion === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("design_expurgatecheck_visbile", false, 'submit')
        notification.info({ message: "操作成功！" })
    }
    //通过
    async passon() {
        const { dataSource, origindataSource, wk } = this.state;
        const { actions: {
            logWorkflowEvent,
            deleteDocument,
            deleteStaticFile,
        } } = this.props;
        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({ pk: wk.id }, { state: wk.current[0].id, action: '通过', note: '同意', executor: executor, attachment: null });
        let all = [];
        dataSource.forEach((item, index) => {
            all.push(deleteDocument({ code: origindataSource[index].code }))   //删除文档对象
            all.push(deleteStaticFile({ id: dataSource[index].file.id }))  //删除附件
        });
        await Promise.all(all)
            .then(rst => {
                notification.success({ message: '删除成功' });
            })
    }
    //不通过
    // async reject(){
    //     const {wk} = this.props
    //     const {actions:{deleteWorkflow}} = this.props
    //     await deleteWorkflow({pk:wk.id})
    // }

    //不通过
    async reject() {
        const { wk, } = this.state;
        const { actions: { logWorkflowEvent, } } = this.props;
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
                action: '拒绝',
                note: '不通过',
                attachment: null
            }
        );
        notification.success({
            message: '操作成功',
            duration: 2
        });
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
    //radio变化
    onChange(e) {
        this.setState({ opinion: e.target.value })
    }
    cancel() {
        this.props.closeModal("design_expurgatecheck_visbile", false)
    }
    addindex(arr) {
        arr.forEach((item, index) => {
            arr[index].index = ++index
        })
        return arr
    }
    render() {
        const columns =
            [{
                title: '序号',
                dataIndex: 'index'
            }, {
                title: '文档编码',
                dataIndex: 'code'
            }, {
                title: '文档名称',
                dataIndex: 'filename'
            }, {
                title: '项目/子项目名称',
                dataIndex: 'project',
                render: (text, record, index) => (
                    <span>
                        {record.project.name}
                    </span>
                ),
            }, {
                title: '单位工程',
                dataIndex: 'unit',
                render: (text, record, index) => (
                    <span>
                        {record.unit.name}
                    </span>
                ),
            }, {
                title: '项目阶段',
                dataIndex: 'stage',
            }, {
                title: '提交单位',
                dataIndex: 'pubUnit',
            }, {
                title: '文档类型',
                dataIndex: 'filetype',
            }, {
                title: '专业',
                dataIndex: 'major',
            }, {
                title: '描述的WBS对象',
                dataIndex: 'wbsObject',
            }, {
                title: '描述的设计对象',
                dataIndex: 'designObject'
            }, {
                title: '上传人',
                dataIndex: 'upPeople'
            }, {
                title: '附件',
                render: (text, record, index) => {
                    return (<span>
                        <a onClick={this.handlePreview.bind(this, record.index - 1)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
                }
            }]
        return (
            <Modal

                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}
                onCancel={this.cancel.bind(this)}
            >
                <div>
                    <h1 style={{ textAlign: 'center', marginBottom: 20 }}>删除审核</h1>
                    <Table

                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                        rowKey='index'
                    />
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
                        <Col span={2} push={16}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
                            </Button>
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
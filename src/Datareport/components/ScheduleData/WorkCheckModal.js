import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
    state => {
        const { platform } = state;
        return { platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions }, dispatch)
    })
)
export default class WorkCheckModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            opinion: 1,//1表示通过 2表示不通过
        };
    }
    async componentDidMount() {
        const { wk } = this.props
        //  const {actions:{ getWorkflow }} = this.props
        //  getWorkflow({pk:wk.id}).then(rst => {
        //      let dataSource = JSON.parse(rst.subject[0].data)
        //      this.setState({dataSource,wk:rst})
        //  })
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk })
    }

    componentWillReceiveProps(props) {
        const { wk } = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({ dataSource, wk })
    }
    //提交
    submit() {
        if (this.state.opinion === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("dr_wor_sg_visible", false)
        message.info("操作成功")
    }
    //通过
    async passon() {
        const { dataSource, wk } = this.state
        const { actions: { logWorkflowEvent, updateWpData, addDocList, putDocList } } = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({ pk: wk.id }, { state: wk.current[0].id, action: '通过', note: '同意', executor: executor, attachment: null });
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        dataSource.map((o) => {
            //创建文档对象
            let doc = o.related_documents.find(x => {
                return x.rel_type === 'sg_rel'
            })
            if (doc) {
                doclist_p.push({
                    code: doc.code,
                    extra_params: {
                        ...o
                    }
                })
            } else {
                doclist_a.push({
                    code: `rel_doc_${o.code}`,
                    name: `rel_doc_${o.pk}`,
                    obj_type: "C_DOC",
                    status: "A",
                    version: "A",
                    "basic_params": {
                        // "files": [
                        //     {
                        //     "a_file": file.a_file,
                        //     "name": file.name,
                        //     "download_url": file.download_url,
                        //     "misc": file.misc,
                        //     "mime_type": file.mime_type
                        //     },
                        // ]
                    },
                    workpackages: [{
                        code: o.code,
                        obj_type: o.obj_type,
                        pk: o.pk,
                        rel_type: "sg_rel"
                    }],
                    extra_params: {
                        ...o
                    }
                })
            }
            //施工包批量
            wplist.push({
                code: o.code,
                extra_params: {
                    rate: o.rate,
                    check_status: 2
                }
            })
        })
        await addDocList({}, { data_list: doclist_a });
        await putDocList({}, { data_list: doclist_p })
        await updateWpData({}, { data_list: wplist });
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
    render() {
        const columns =
            [{
                title: '序号',
                render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: 'WBS编码',
                dataIndex: 'code',
            }, {
                title: '任务名称',
                dataIndex: 'name',
            }, {
                title: '项目/子项目',
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
                title: '施工单位',
                dataIndex: 'construct_unit',
                render: (text, record, index) => (
                    <span>
                        {record.construct_unit.name}
                    </span>
                ),
            }, {
                title: '施工图工程量',
                dataIndex: 'quantity',
            }, {
                title: '实际工程量',
                dataIndex: 'factquantity',
            }, {
                title: '计划开始时间',
                dataIndex: 'planstarttime',
            }, {
                title: '计划结束时间',
                dataIndex: 'planovertime',
            }, {
                title: '实际开始时间',
                dataIndex: 'factstarttime',
            }, {
                title: '实际结束时间',
                dataIndex: 'factovertime',
            }, {
                title: '上传人员',
                dataIndex: 'uploads',
            },]
        return (
            <Modal
                title="施工进度审批表"
                key={Math.random()}
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
                            <RadioGroup onChange={this.onChange} value={this.state.opinion}>
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

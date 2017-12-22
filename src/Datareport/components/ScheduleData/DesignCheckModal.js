import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { Input, Col, Card, Table, Row, Button, DatePicker, Radio, Select, notification, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import { getUser } from '_platform/auth';
import { actions } from '../../store/scheduledata';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(
    state => {
        const { datareport: { scheduledata = {} } = {}, platform } = state;
        return { ...scheduledata, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class DesignCheckModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            opinion: 1,
            topDir: {},
        };
    }
    async componentDidMount() {
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
    // 点x消失
    oncancel() {
        this.props.closeModal("dr_de_sj_visible", false)
    }
    //提交
    async submit() {
        if (this.state.opinion === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("dr_de_sj_visible", false);
        message.info("操作成功");
    }

    //通过
    async passon() {
        const { dataSource, wk, topDir } = this.state;
        const { actions: {
            logWorkflowEvent,
            addDocList,
            getScheduleDir,
            postScheduleDir,
            getWorkpackagesByCode
        } } = this.props;
        //the unit in the dataSource array is same
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'datareport_designdata_1111';
        //get workpackage by unit's code 
        let workpackage = await getWorkpackagesByCode({ code: unit.code });

        let postDirData = {
            "name": '设计进度目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'sj_rel', // 自定义，要确保唯一性
            }],
            "parent": { "pk": topDir.pk, "code": topDir.code, "obj_type": topDir.obj_type }
        }
        let dir = await getScheduleDir({ code: code });
        //no such directory
        if (!dir.obj_type) {
            dir = await postScheduleDir({}, postDirData);
        }

        // send workflow
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({ pk: wk.id }, { state: wk.current[0].id, action: '通过', note: '同意', executor: executor, attachment: null });

        //prepare the data which will store in database
        const docData = [];
        let i = 0;   //asure the code of every document only
        dataSource.map(item => {
            i++;
            docData.push({
                code: 'designdata' + moment().format("YYYYMMDDHHmmss") + i,
                name: 'designdata' + moment().format("YYYYMMDDHHmmss") + i,
                obj_type: "C_DOC",
                status: 'A',
                profess_folder: { code: dir.code, obj_type: 'C_DIR' },
                extra_params: {
                    code: item.code,
                    volume:item.volume,
                    name: item.name,
                    major: item.major,
                    factovertime: item.factovertime,
                    factquantity: item.factquantity,
                    uploads: item.uploads,
                    designunit: item.designunit,
                    unit: item.unit.name,
                    project: item.project.name
                },
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
    }

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
                title: '编码',
                dataIndex: 'code',
            }, {
                title: '卷册',
                dataIndex: 'volume',
            }, {
                title: '名称',
                dataIndex: 'name',
            }, {
                title: '专业',
                dataIndex: 'major',
            }, {
                title: '实际供图时间',
                dataIndex: 'factovertime',
            }, {
                title: '设计单位',
                dataIndex: 'designunit',
            }, {
                title: '上传人员',
                dataIndex: 'uploads',
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
            },]
        return (
            <Modal
                title="设计进度审批表"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}
                onCancel={this.oncancel.bind(this)}>
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

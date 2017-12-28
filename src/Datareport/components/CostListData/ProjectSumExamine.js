import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { Input, Col, Card, Table, Row, Button, DatePicker, Radio, Select, notification, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import { getUser } from '_platform/auth';
import { actions } from '../../store/WorkunitCost';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(
    state => {
        const { datareport: { WorkunitCost = {} } = {}, platform } = state;
        return { ...WorkunitCost, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class ProjectSumExamine extends Component {

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
        let topDir = await getScheduleDir({ code: 'the_only_main_code_costsumplans' });
        if (!topDir.obj_type) {
            let postData = {
                name: '数据报送的顶级节点',
                code: 'the_only_main_code_costsumplans',
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
        this.props.closeModal("cost_pro_ck_visible", false);
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
            getWorkpackagesByCode,
            updateWpData,
            getQuantities,
            getSearcher
        } } = this.props;
 
        let unit = dataSource[0].unit;
        let project = dataSource[0].project;
        let code = 'ck';
        let workpackage = await getWorkpackagesByCode({ code: unit.code });

        let postDirData = {
            "name": '工程量结算目录树',
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            related_objects: [{
                pk: workpackage.pk,
                code: workpackage.code,
                obj_type: workpackage.obj_type,
                rel_type: 'costsumplan_wp_plan', // 自定义，要确保唯一性
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
        let wplist = [];
        let i = 0;   //asure the code of every document only

        let jialist = await getSearcher({keyword:'priceListName'})
        let pairMap = {};
        let pairs = jialist.result.map(item => {
            pairMap[item.extra_params.projectcoding] = {
                projectcoding: item.extra_params.projectcoding,
                rate: item.extra_params.rate
            }
        })
       
        dataSource.map(item => {
            i++;
            docData.push({
                code: 'hfdsjhbsadfhb' + moment().format("YYYYMMDDHHmmss") + i,
                name: 'hfdsjhbsadfhb' + moment().format("YYYYMMDDHHmmss") + i,
                obj_type: "C_DOC",
                status: 'A',
                profess_folder: { code: dir.code, obj_type: 'C_DIR' },

                extra_params: {
                    code: item.code,
                    subproject: item.project.name,//项目/子项目
                    unit: item.unit.name,//单位工程
                    projectcoding: item.projectcoding,//项目编号
                    projectname: item.projectname,//项目名称
                    company: item.company,//计量单位
                    number: item.number,//数量
                    total: item.total,//单价
                    remarks: item.remarks,//备注
                },

            }) 
            //施工包批量
          

            wplist.push({
                code: item.unit.code,
                extra_params: pairMap[item.projectcoding]
               
            })
        
        });
 
        let rst = await addDocList({}, { data_list: docData });
        await updateWpData({}, { data_list: wplist });
        
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
        this.setState({ opinion: e.target.value })
    }
    cancel() {
      
        this.props.closeModal("cost_pro_ck_visible", false)
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'code',
            }, {
                title: '项目/子项目',
                dataIndex: 'subproject',
                width: '10%',
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
                title: '项目编号',
                dataIndex: 'projectcoding',
            }, {
                title: '项目名称',
                dataIndex: 'projectname',
            }, {
                title: '计量单位',
                dataIndex: 'company',
            }, {
                title: '数量',
                dataIndex: 'number',
                width: '10%',
            }, {
                title: '单价',
                dataIndex: 'total',
            }, {
                title: '备注',
                dataIndex: 'remarks',
            }
        ];
        return (
            <Modal
			title="工程量结算信息审批表"
            visible={true}
            width= {1280}
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

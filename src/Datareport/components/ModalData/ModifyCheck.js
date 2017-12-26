import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { Input, Col, Card, Table, Row, Button, DatePicker, Radio, Select, notification, Popconfirm, Modal, Upload, Icon, message } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory';
import { getUser } from '_platform/auth';
import { actions } from '../../store/safety';
import Preview from '../../../_platform/components/layout/Preview';
import moment from 'moment';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(
    state => {
        const { datareport: { ModalData = {} } = {}, platform } = state;
        return { ...ModalData, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
    })
)
export default class ModifyCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wk: null,
            dataSource: [],
            option: 1,
        };
    }
    async componentDidMount() {
        const { wk } = this.props
        let dataSources = JSON.parse(wk.subject[0].data)
       
        let dataSource = [];
        dataSources.map(item => {
            dataSource.push(item)
        })
        this.setState({ dataSource, wk });
    }


    //提交
    async submit() {
        if (this.state.option === 1) {
            await this.passon();
        } else {
            await this.reject();
        }
        this.props.closeModal("modify_check_visbile", false);
        message.info("操作成功");
    }

    //通过
    async passon() {
       
    }
    //不通过
    async reject() {
        const { wk } = this.props
        const { actions: { deleteWorkflow } } = this.props
        await deleteWorkflow({ pk: wk.id })
    }
    onChange(e) {
        this.setState({ option: e.target.value })
    }
    render() {
      

        const columns = [{
            title: '序号',
            dataIndex: 'numbers',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '模型编码',
            dataIndex: 'coding'
        }, {
            title: '项目/子项目名称',
            dataIndex: 'project'
        }, {
            title: '单位工程',
            dataIndex: 'unit'
        }, {
            title: '模型名称',
            dataIndex: 'modelName'
        }, {
            title: '提交单位',
            dataIndex: 'submittingUnit'
        }, {
            title: '模型描述',
            dataIndex: 'modelDescription'
        }, {
            title: '模型类型',
            dataIndex: 'modeType'
        }, {
            title: 'fdb模型',
            dataIndex: 'fdbMode',

        }, {
            title: 'tdbx模型',
            dataIndex: 'tdbxMode',

        }, {
            title: '属性表',
            dataIndex: 'attributeTable',

        }, {
            title: '上报时间',
            dataIndex: 'reportingTime'
        }, {
            title: '上报人',
            dataIndex: 'reportingName'
        }];


        return (
            <Modal
                title="模型信息删除审批表"
                footer={null}
                visible={true}
                width={1280}
                onCancel={this.cancel.bind(this)}

            >
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
                        <RadioGroup onChange={this.onChange.bind(this)} value={this.state.option}>
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
            </Modal>
        )
    }

    cancel() {
        this.props.closeModal("modify_check_visbile", false)
    }
}
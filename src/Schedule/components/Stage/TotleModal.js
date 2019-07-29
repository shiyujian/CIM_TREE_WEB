import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Icon,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    notification,
    Card,
    Steps,
    Divider
} from 'antd';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Step = Steps.Step;

export default class TotleModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workID: '', // 任务ID
            TableList: [], // 表格数据
            workDetails: {}, // 任务详情
            workFlow: [], // 任务流程
            TreatmentData: [],
            history: []
        };
    }
    async componentDidMount () {
        this.getTaskDetail(); // 获取任务详情
    }
    getTaskDetail () {
        const {
            workID,
            actions: { getWorkDetails },
            form: { setFieldsValue }
        } = this.props;
        this.setState({
            workID: workID
        });
        getWorkDetails({
            ID: workID
        }, {}).then(rep => {
            let FormParams = [];
            if (rep.FormValues && rep.FormValues.length > 0 && rep.FormValues[0].FormParams) {
                FormParams = rep.FormValues[0].FormParams;
            }
            let param = {};
            let TableList = [];
            FormParams.map(item => {
                if (item.Key === 'TableInfo') {
                    TableList = JSON.parse(item.Val);
                } else {
                    param[item.Key] = item.Val;
                }
            });
            setFieldsValue(param);
            this.setState({
                workDetails: rep,
                TableList,
                workFlow: rep.Works
            });
        });
    }
    onViewClick (record, index) {
        const {
            actions: { openPreview }
        } = this.props;
        let filed = {};
        filed.misc = record.misc;
        filed.a_file =
            `${SOURCE_API}` +
            record.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url =
            `${STATIC_DOWNLOAD_API}` +
            record.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.fileName;
        filed.mime_type = record.mime_type;
        openPreview(filed);
    }
    render () {
        const {
            sectionArray,
            form: { getFieldDecorator }
        } = this.props;
        const { workFlow } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <div>
                <Modal
                    title='总进度计划流程详情'
                    width={800}
                    onCancel={this.props.oncancel}
                    visible
                    footer={null}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='标段'
                                            >
                                                {getFieldDecorator(
                                                    'Section',
                                                    {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请选择标段'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Select
                                                        disabled
                                                        style={{width: 220}}
                                                        placeholder='请选择'
                                                        allowClear
                                                    >
                                                        {sectionArray.map(item => {
                                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                                        })}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='编号'
                                            >
                                                {getFieldDecorator(
                                                    'NumberCode',
                                                    {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入编号'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='文档类型'
                                            >
                                                {getFieldDecorator(
                                                    'FileType',
                                                    {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入文档类型'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            columns={this.columns}
                                            pagination
                                            dataSource={
                                                this.state.TableList
                                            }
                                            rowKey='uid'
                                            className='foresttable'
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                        <Card title={'审批流程'} style={{ marginTop: 10 }}>
                            <Steps
                                direction='vertical'
                                size='small'
                                current={workFlow.length - 1}
                            >
                                {workFlow.map(item => {
                                    console.log();
                                    if (item.RunTime) {
                                        return <Step title={
                                            <div>
                                                <span>{item.CurrentNodeName}</span>
                                                <span style={{marginLeft: 10}}>-(已完成)</span>
                                            </div>
                                        } description={
                                            <div>
                                                <span>
                                                    {item.CurrentNodeName}人：
                                                    {item.ExecutorObj && item.ExecutorObj.Full_Name}({item.ExecutorObj && item.ExecutorObj.User_Name})
                                                </span>
                                                <span style={{marginLeft: 20}}>
                                                    {item.CurrentNodeName}时间：
                                                    {item.RunTime}
                                                </span>
                                            </div>
                                        } />;
                                    } else {
                                        if (item.ExecutorObj) {
                                            // 未结束
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-(执行中)</span>
                                                    <span style={{marginLeft: 20}}>
                                                        当前执行人：
                                                        <span style={{color: '#108ee9'}}>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                                    </span>
                                                </div>
                                            } />;
                                        } else {
                                            // 已结束
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-(已结束)</span>
                                                </div>
                                            } />;
                                        }
                                    }
                                })}
                            </Steps>
                        </Card>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.props.onok}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
    getCurrentState () {
        const { platform: { task = {} } = {}, location = {} } = this.props;
        // const { state_id = '0' } = queryString.parse(location.search) || {};
        const { states = [] } = task;
        return states.find(state => state.status === 'processing');
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            width: '35%'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: '30%'
        },
        {
            title: '操作',
            dataIndex: 'active',
            key: 'active',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        {/* <a
                            href=''
                            onClick={this.onViewClick.bind(this, record.url, index)}
                        >
                            预览
                        </a> */}
                        {/* <Divider type='vertical' /> */}
                        <a href={record.url} target='_blank'>
                            下载
                        </a>
                    </div>
                );
            }
        }
    ];
}

// export default Form.create()(TotleModal)

import React, { Component } from 'react';
import {
    Icon,
    Row,
    Tabs,
    Input,
    Form,
    Col,
    Card,
    Button,
    Modal,
    Select,
    DatePicker,
    Upload,
    Notification,
    Popconfirm,
    message
} from 'antd';
import moment from 'moment';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const newDateTimeFormat = 'YYYY/MM/DD HH:mm:ss';
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
    }
};
const formItemLayoutTwo = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
const { TabPane } = Tabs;
class ModalCheck extends Component {
    constructor (props) {
        super(props);
        this.state = {
            NextPerson: '', // 业主执行人
            CheckFile: '', //  附件地址
            FileName: '', //  附件名称
            CheckContent: '', // 审核意见
            // CheckFile: '', // 附件地址
            // CheckStatus: '', // 审核结果
            Works: [], // 流程列表
            CurrentNode: '', // 当前节点ID
            CurrentNodeName: '', // 当前节点名称
            passNodeID: '', // 通过节点ID
            noPassNodeID: '', // 不通过节点ID
            layerType: '', // 分类
            dataList: [], // 导入后产生数据
            isSuperAdmin: false, // 是否是超级管理员
            page: 1,
            total: 0
        };
        this.handleLayer = this.handleLayer.bind(this); // 分类改变
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    async componentDidMount () {
        console.log(getUser());
        // 获取任务详情
        await this.getWorkDetails();
        // 获取下一个执行节点ID
        await this.getNextNode();
    }
    getNextNode () {
        const {
            flowID,
            actions: { getDirectionList }
        } = this.props;
        const { CurrentNode } = this.state;
        let param = {
            fiowid: flowID,
            fromnodeid: CurrentNode,
            name: '',
            status: '',
            page: '',
            size: ''
        };
        getDirectionList({}, param).then(rep => {
            if (rep && rep.length === 2) {
                let passNodeID = '', noPassNodeID = '';
                rep.map(item => {
                    if (item.Name === '通过') {
                        passNodeID = item.ToNode;
                    } else {
                        noPassNodeID = item.ToNode;
                    }
                });
                this.setState({
                    passNodeID,
                    noPassNodeID
                });
            } else if (rep && rep.length === 1) {
                let passNodeID = '', noPassNodeID = '';
                rep.map(item => {
                    if (item.Name === '通过') {
                        passNodeID = item.ToNode;
                        noPassNodeID = item.ToNode;
                    } else {
                        passNodeID = item.ToNode;
                        noPassNodeID = item.ToNode;
                    }
                });
                this.setState({
                    passNodeID,
                    noPassNodeID
                });
            }
        });
    }
    getWorkDetails = async () => {
        const {
            workID,
            actions: { getWorkDetails },
            form: { setFieldsValue }
        } = this.props;
        let workDetails = await getWorkDetails({ID: workID}, {});
        if (workDetails && workDetails.StarterObj && workDetails.Works) {
            let Summary = '', Content = '';
            // 获取概要和内容
            if (workDetails.Works.length && workDetails.Works[0].FormValues && workDetails.Works[0].FormValues.length) {
                let FormParams = workDetails.Works[0].FormValues[0].FormParams;
                FormParams.map(item => {
                    if (item.Key === 'Summary') {
                        Summary = item.Val;
                    } else if (item.Key === 'Content') {
                        Content = item.Val;
                    }
                });
            }
            setFieldsValue({
                Title: workDetails.Title,
                constructionOrg: workDetails.StarterObj.OrgObj && workDetails.StarterObj.OrgObj.OrgName,
                Starter: workDetails.StarterObj.Full_Name,
                StarterPhone: workDetails.StarterObj.Phone,
                Createtime: moment(workDetails.CreateTime, newDateTimeFormat),
                Summary: Summary,
                Content: Content
            });
            console.log('Works', workDetails.Works);
            this.setState({
                CurrentNode: workDetails.CurrentNode,
                CurrentNodeName: workDetails.CurrentNodeName,
                Works: workDetails.Works
            });
        }
    }
    handleLayer (value) {
        this.setState({
            layerType: value
        });
    }
    handleOk () {
        const {
            flowID,
            flowName,
            workID,
            actions: { postSendwork },
            form: { validateFields }
        } = this.props;
        const { CurrentNode, CurrentNodeName } = this.state;
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleCheckContent (e) {
        this.setState({
            CheckContent: e.target.value
        });
    }
    onClickNoPass () {
        const {
            flowID,
            flowName,
            workID,
            actions: { postSendwork },
            form: { validateFields }
        } = this.props;
        const { CurrentNode, CurrentNodeName, noPassNodeID, CheckFile, FileName } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [
                    {
                        Key: 'CheckStatus', // 审核结果
                        FieldType: 0,
                        Val: '不同意'
                    },
                    {
                        Key: 'CheckContent', // 审核意见
                        FieldType: 0,
                        Val: values.CheckContent
                    },
                    {
                        Key: 'CheckFile', // 审核附件
                        FieldType: 0,
                        Val: CheckFile
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: FileName
                    }
                ];
                let params = {
                    FlowID: flowID, // 流程ID
                    FlowName: flowName, // 流程名称
                    WorkID: workID, // 任务ID
                    CurrentNode: CurrentNode, // 当前节点
                    CurrentNodeName: CurrentNodeName, // 当前节点名称
                    NextNode: noPassNodeID,
                    NextNodeName: '',
                    FormValue: {
                        FormParams: FormParams,
                        NodeID: '' // 下一节点ID
                    }, // 表单值
                    NextExecutor: 0, // 下一节点执行人
                    Executor: getUser().ID // 当前节点执行人
                };
                postSendwork({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '审核操作成功'
                        });
                        this.props.getWorkList();
                        this.props.handleCancel();
                    } else {
                        Notification.error({
                            message: `操作失败，${rep.msg}`
                        });
                    }
                });
            }
        });
    }
    onClickPass () {
        const {
            flowID,
            flowName,
            workID,
            actions: { postSendwork },
            form: { validateFields }
        } = this.props;
        const { CurrentNode, CurrentNodeName, NextPerson, passNodeID, CheckFile, FileName } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [
                    {
                        Key: 'CheckStatus', // 审核结果
                        FieldType: 0,
                        Val: '同意'
                    },
                    {
                        Key: 'CheckContent', // 审核意见
                        FieldType: 0,
                        Val: values.CheckContent
                    },
                    {
                        Key: 'CheckFile', // 审核附件
                        FieldType: 0,
                        Val: CheckFile
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: FileName
                    }
                ];
                let params = {
                    FlowID: flowID, // 流程ID
                    FlowName: flowName, // 流程名称
                    WorkID: workID, // 任务ID
                    CurrentNode: CurrentNode, // 当前节点
                    CurrentNodeName: CurrentNodeName, // 当前节点名称
                    NextNode: passNodeID,
                    NextNodeName: '',
                    FormValue: {
                        FormParams: FormParams,
                        NodeID: '' // 下一节点ID
                    }, // 表单值
                    NextExecutor: NextPerson || 0, // 下一节点执行人
                    Executor: getUser().ID // 当前节点执行人
                };
                postSendwork({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '审核操作成功'
                        });
                        this.props.getWorkList();
                        this.props.handleCancel();
                    } else {
                        Notification.error({
                            message: `操作失败，${rep.msg}`
                        });
                    }
                });
            }
        });
    }
    handleNextPerson (value) {
        this.setState({
            NextPerson: value
        });
    }
    getCheckStatusVal (FormValues) {
        let CheckStatusVal = '已完成';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckStatus') {
                    CheckStatusVal = item.Val;
                }
            });
        }
        return CheckStatusVal;
    }
    getCheckContentVal (FormValues) {
        let CheckContentVal = '';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckContent') {
                    CheckContentVal = item.Val;
                }
            });
        }
        return CheckContentVal;
    }
    getCheckFileVal (FormValues) {
        let CheckFileVal = '', FileNameVal = '';
        if (FormValues.length && FormValues[0].FormParams) {
            FormValues[0].FormParams.map(item => {
                if (item.Key === 'CheckFile') {
                    CheckFileVal = item.Val;
                } else if (item.Key === 'FileName') {
                    FileNameVal = item.Val;
                }
            });
        }
        return (<div style={{float: 'left'}}>
            <Icon type='link' />
            <a
                target='_blank'
                href={CheckFileVal}
                style={{marginLeft: 10}}
            >
                {FileNameVal}
            </a>
        </div>);
    }
    getFormatTime (time) {
        return moment(time).format('YYYY-MM-DD');
    }
    render () {
        const { Works, CurrentNodeName } = this.state;
        const {
            OwnerList,
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div>
                <Modal
                    okButtonProps={{disabled: true}}
                    title='工程洽商记录'
                    maskClosable={false}
                    footer={null}
                    visible={this.props.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Tabs defaultActiveKey='1' style={{paddingBottom: 10, borderBottom: '1px solid #ccc'}}>
                        <TabPane tab='表单详情' key='1'>
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label='工程名称'
                                >
                                    {
                                        getFieldDecorator('Title', {

                                        })(
                                            <Input style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='施工单位'
                                >
                                    {
                                        getFieldDecorator('constructionOrg', {

                                        })(
                                            <Input style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayoutTwo}
                                            label='发起人'
                                        >
                                            {
                                                getFieldDecorator('Starter', {

                                                })(
                                                    <Input style={{width: 140}} readOnly />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayoutTwo}
                                            label='联系电话'
                                        >
                                            {
                                                getFieldDecorator('StarterPhone', {

                                                })(
                                                    <Input style={{width: 140}} readOnly />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem
                                    {...formItemLayout}
                                    label='发起时间'
                                >
                                    {
                                        getFieldDecorator('Createtime', {

                                        })(
                                            <DatePicker
                                                disabled
                                                style={{width: '100%'}}
                                                showTime={{ format: 'HH:mm:ss' }}
                                                format={dateTimeFormat}
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='洽商概要'
                                >
                                    {
                                        getFieldDecorator('Summary', {

                                        })(
                                            <Input style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='洽商内容'
                                >
                                    {
                                        getFieldDecorator('Content', {

                                        })(
                                            <TextArea rows={4} style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane tab='流程细节' key='2'>
                            {
                                Works.map((item, index) => {
                                    if (CurrentNodeName === item.CurrentNodeName) {
                                        return '';
                                    } else {
                                        return <Card size='small' key={index} style={{width: '100%'}} title={item.CurrentNodeName} extra={<div>
                                            <span>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                            <span style={{display: 'inline-block', marginLeft: 20, width: 90}}>
                                                {this.getFormatTime(item.RunTime)}
                                            </span>
                                        </div>}>
                                            <div>
                                                <span style={{display: 'inline-block', width: 50}}>
                                                    {this.getCheckStatusVal(item.FormValues)}
                                                </span>
                                                {this.getCheckContentVal(item.FormValues)}
                                            </div>
                                        </Card>;
                                    }
                                })
                            }
                        </TabPane>
                    </Tabs>
                    <Form style={{marginTop: 10}}>
                        {
                            getUser().roles.ID === 13 ? '' : <Row style={{marginTop: 10}}>
                                <FormItem
                                    {...formItemLayout}
                                    label='选择业主'
                                >
                                    {
                                        getFieldDecorator('NextPerson', {
                                            rules: [
                                                { required: true, message: '请选择业主文书' }
                                            ]
                                        })(
                                            <Select
                                                style={{ width: '100%' }}
                                                showSearch
                                                filterOption={
                                                    (input, option) => {
                                                        return option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0;
                                                    }
                                                }
                                                maxTagCount={4}
                                                dropdownStyle={{height: 100}}
                                                dropdownMenuStyle={{height: 100}}
                                                allowClear
                                                onChange={this.handleNextPerson.bind(this)}
                                            >
                                                {
                                                    OwnerList.map(item => {
                                                        return <Option
                                                            value={item.id}
                                                            title={`${item.Full_Name}(${item.User_Name})`}
                                                            key={item.id}>
                                                            {`${item.Full_Name}(${item.User_Name})`}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Row>
                        }
                        <FormItem
                            {...formItemLayout}
                            label='备注说明'
                        >
                            {
                                getFieldDecorator('CheckContent', {
                                })(
                                    <TextArea rows={4} />
                                )
                            }
                        </FormItem>
                    </Form>
                    <Row style={{marginTop: 10}}>
                        <Col span={12} style={{textAlign: 'center'}}>
                            <Button type='primary' onClick={this.onClickNoPass.bind(this)}>不通过</Button>
                        </Col>
                        <Col span={12} style={{textAlign: 'center'}}>
                            <Button type='primary' onClick={this.onClickPass.bind(this)}>通过</Button>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(ModalCheck);

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
import './index.less';
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
            userInfo: {}, // 用户信息
            FileName: '', //  附件名称
            CheckFile: '', //  附件地址
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
        this.handleCancel = this.handleCancel.bind(this);
    }
    async componentDidMount () {
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
            actions: { getWorkDetails }
        } = this.props;
        let workDetails = await getWorkDetails({ID: workID}, {});
        if (workDetails && workDetails.StarterObj && workDetails.Works) {
            let DrawingNo = '', VersionNum = '', Section = '', SituationDescription = '';
            // 获取表单信息
            if (workDetails.Works.length && workDetails.Works[0].FormValues && workDetails.Works[0].FormValues.length) {
                let FormParams = workDetails.Works[0].FormValues[0].FormParams;
                FormParams.map(item => {
                    if (item.Key === 'DrawingNo') {
                        DrawingNo = item.Val;
                    } else if (item.Key === 'VersionNum') {
                        VersionNum = item.Val;
                    } else if (item.Key === 'Section') {
                        Section = item.Val;
                    } else if (item.Key === 'SituationDescription') {
                        SituationDescription = item.Val;
                    }
                });
            };
            this.setState({
                Title: workDetails.Title,
                constructionOrg: workDetails.StarterObj.OrgObj && workDetails.StarterObj.OrgObj.OrgName,
                Starter: workDetails.StarterObj.Full_Name,
                StarterPhone: workDetails.StarterObj.Phone,
                Createtime: moment(workDetails.CreateTime, newDateTimeFormat),
                DrawingNo,
                VersionNum,
                Section,
                SituationDescription,
                userInfo: getUser(),
                CurrentNode: workDetails.CurrentNode,
                CurrentNodeName: workDetails.CurrentNodeName,
                Works: workDetails.Works
            });
        }
    }
    handleCancel () {
        this.props.handleCancel();
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
                console.log('审核数据', JSON.stringify(params));
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
        const { CurrentNode, CurrentNodeName, passNodeID, CheckFile, FileName } = this.state;
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
                    NextExecutor: values.NextPerson || 0, // 下一节点执行人
                    Executor: getUser().ID // 当前节点执行人
                };
                console.log('审核数据', JSON.stringify(params));
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
        let node = '';
        if (FileNameVal && CheckFileVal) {
            node = (<div style={{float: 'left'}}>
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
        return node;
    }
    getFormatTime (time) {
        return moment(time).format('YYYY-MM-DD');
    }
    render () {
        const {
            Title,
            DrawingNo,
            SituationDescription,
            constructionOrg,
            Starter,
            Section,
            VersionNum,
            StarterPhone,
            Createtime,
            Works,
            CurrentNodeName,
            userInfo
        } = this.state;
        const {
            CostList,
            OwnerList,
            form: { getFieldDecorator }
        } = this.props;
        const Uploadprops = {
            name: '',
            action: '',
            beforeUpload: (file) => {
                const {
                    actions: { uploadFileHandler }
                } = this.props;
                const formdata = new FormData();
                formdata.append('a_file', file);
                uploadFileHandler({}, formdata).then(rep => {
                    console.log(rep);
                    this.setState({
                        FileName: file.name,
                        CheckFile: rep
                    });
                });
                return false;
            }
        };
        return (
            <div>
                <Modal
                    className='tableList-modal'
                    okButtonProps={{disabled: true}}
                    title='工程量现场确认单'
                    maskClosable={false}
                    visible={this.props.showModal}
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
                                            initialValue: Title
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
                                            initialValue: constructionOrg
                                        })(
                                            <Input style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayoutTwo}
                                            label='图号'
                                        >
                                            {
                                                getFieldDecorator('DrawingNo', {
                                                    initialValue: DrawingNo
                                                })(
                                                    <Input style={{width: 140}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayoutTwo}
                                            label='版本号'
                                        >
                                            {
                                                getFieldDecorator('VersionNum', {
                                                    initialValue: VersionNum
                                                })(
                                                    <Input style={{width: 140}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem
                                    {...formItemLayout}
                                    label='标段'
                                >
                                    {
                                        getFieldDecorator('Section', {
                                            initialValue: Section
                                        })(
                                            <Input
                                                style={{width: '100%'}}
                                            />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='情况描述'
                                >
                                    {
                                        getFieldDecorator('SituationDescription', {
                                            initialValue: SituationDescription
                                        })(
                                            <Input style={{width: '100%'}} />
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
                                                    initialValue: Starter
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
                                                    initialValue: StarterPhone
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
                                            initialValue: Createtime
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
                                            <div>
                                                {
                                                    this.getCheckFileVal(item.FormValues)
                                                }
                                            </div>
                                        </Card>;
                                    }
                                })
                            }
                        </TabPane>
                    </Tabs>
                    <Form style={{marginTop: 10}}>
                        {
                            userInfo.roles && userInfo.roles.RoleName === '监理文书' ? <Row style={{marginTop: 10}}>
                                <FormItem
                                    {...formItemLayout}
                                    label='选择造价'
                                >
                                    {
                                        getFieldDecorator('NextPerson', {
                                            rules: [
                                                { required: true, message: '请选择造价文书' }
                                            ]
                                        })(
                                            <Select
                                                style={{width: '100%'}}
                                                maxTagCount={4}
                                                dropdownStyle={{height: 100}}
                                                dropdownMenuStyle={{height: 100}}
                                                allowClear
                                            >
                                                {
                                                    CostList.map(item => {
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
                            </Row> : ''
                        }
                        {
                            userInfo.roles && userInfo.roles.RoleName === '造价文书' ? <Row style={{marginTop: 10}}>
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
                                                style={{width: '100%'}}
                                                maxTagCount={4}
                                                dropdownStyle={{height: 100}}
                                                dropdownMenuStyle={{height: 100}}
                                                allowClear
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
                            </Row> : ''
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
                        <FormItem
                            {...formItemLayout}
                            label='上传附件'
                        >
                            <Upload {...Uploadprops}>
                                <Button>
                                    <Icon type='upload' /> 上传附件
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                    <Row style={{marginTop: 20}}>
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

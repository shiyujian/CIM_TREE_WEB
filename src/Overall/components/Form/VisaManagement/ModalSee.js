import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Input,
    Form,
    Spin,
    Button,
    Table,
    Modal,
    Select,
    DatePicker,
    Upload,
    Card,
    Notification,
    Tabs
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
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            CheckFile: '', // 附件地址
            Works: [], // 流程列表
            layerType: '', // 分类
            dataList: [], // 导入后产生数据
            isSuperAdmin: false, // 是否是超级管理员
            page: 1,
            total: 0
        };
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentDidMount () {
        // 获取任务详情
        this.getWorkDetails();
    }
    getWorkDetails = async () => {
        const {
            workID,
            actions: { getWorkDetails }
        } = this.props;
        let workDetails = await getWorkDetails({ID: workID}, {});
        if (workDetails && workDetails.StarterObj && workDetails.Works) {
            let DrawingNo = '', VersionNum = '', Section = '', SituationDescription = '', CheckContent = '', CheckFile = '', FileName = '';
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
                    } else if (item.Key === 'CheckContent') {
                        CheckContent = item.Val;
                    } else if (item.Key === 'CheckFile') {
                        CheckFile = item.Val;
                    } else if (item.Key === 'FileName') {
                        FileName = item.Val;
                    }
                });
            };
            if (workDetails.WFState === 1) {
                workDetails.Works.pop();
            }
            this.setState({
                Title: workDetails.Title,
                constructionOrg: workDetails.StarterObj.OrgObj && workDetails.StarterObj.OrgObj.OrgName,
                Starter: workDetails.StarterObj.Full_Name,
                StarterPhone: workDetails.StarterObj.Phone,
                StarterTime: moment(workDetails.CreateTime, newDateTimeFormat),
                DrawingNo,
                VersionNum,
                Section,
                SituationDescription,
                CheckContent,
                CheckFile,
                FileName,
                Works: workDetails.Works
            });
        }
    }
    handleCancel () {
        this.props.handleCancel();
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
            StarterTime,
            CheckContent,
            Works,
            CheckFile,
            FileName
        } = this.state;
        const {
            form: { getFieldDecorator }
        } = this.props;
        const Uploadprops = {
            name: '',
            action: '',
            fileList: FileName ? [{
                uid: '1',
                name: FileName,
                status: 'done',
                url: CheckFile
            }] : [],
            beforeUpload: (file) => {
                const {
                    actions: { uploadFileHandler }
                } = this.props;
                const formdata = new FormData();
                formdata.append('a_file', file);
                uploadFileHandler({}, formdata).then(rep => {
                    this.setState({
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
                    <Tabs defaultActiveKey='1'>
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
                                                    <Input style={{width: 140}} readOnly />
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
                                                    <Input style={{width: 140}} readOnly />
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
                                            <Input style={{width: '100%'}} readOnly />
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
                                        getFieldDecorator('StarterTime', {
                                            initialValue: StarterTime
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
                                    label='备注'
                                >
                                    {
                                        getFieldDecorator('CheckContent', {
                                            initialValue: CheckContent
                                        })(
                                            <TextArea rows={4} style={{width: '100%'}} readOnly />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='附件'
                                >
                                    <Upload {...Uploadprops}>
                                        <Button disabled>
                                            <Icon type='upload' /> 上传附件
                                        </Button>
                                    </Upload>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane tab='流程细节' key='2'>
                            {
                                Works.map((item, index) => {
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
                                })
                            }
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Tablelevel);

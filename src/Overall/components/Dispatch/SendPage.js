import React, { Component } from 'react';
import {
    Table,
    Tabs,
    Button,
    Row,
    Col,
    Notification,
    Modal,
    Popconfirm,
    Select,
    Input,
    Form,
    DatePicker
} from 'antd';
import { getUser } from '_platform/auth';
import moment from 'moment';
import SendPageModal from './SendPageModal';
import './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class SendPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            detail: '',
            sentDocVisible: false,
            dataSource: [],
            stime: '',
            etime: '',
            fileList: [],
            receivingUnitName: ''
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '名称',
            dataIndex: 'FileName'
        },
        {
            title: '接收单位',
            dataIndex: 'ReceivingUnit',
            render: (text, record, index) => {
                const {
                    companyList
                } = this.props;
                let orgName = '';
                if (text) {
                    let receivingUnitList = text.split(',');
                    receivingUnitList.map((receivingUnit, index) => {
                        companyList.map((company) => {
                            if (company.ID === receivingUnit) {
                                if (orgName) {
                                    orgName = orgName + ',' + company.OrgName;
                                } else {
                                    orgName = company.OrgName;
                                }
                            }
                        });
                    });
                }
                return <span>{orgName}</span>;
            }
        },
        {
            title: '抄送单位',
            dataIndex: 'CopyUnit',
            render: (text, record, index) => {
                const {
                    companyList
                } = this.props;
                let orgName = '';
                if (text) {
                    let copyUnitList = text.split(',');
                    copyUnitList.map((copyUnit, index) => {
                        companyList.map((company) => {
                            if (company.ID === copyUnit) {
                                if (orgName) {
                                    orgName = orgName + ',' + company.OrgName;
                                } else {
                                    orgName = company.OrgName;
                                }
                            }
                        });
                    });
                }
                return <span>{orgName}</span>;
            }
        },
        {
            title: '发送时间',
            dataIndex: 'CreateTime',
            render: CreateTime => {
                return moment(CreateTime)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '操作',
            render: record => {
                return (
                    <div>
                        <a
                            style={{ marginRight: '10px' }}
                            onClick={this._viewClick.bind(
                                this,
                                record
                            )}
                        >
                            查看
                        </a>
                        <Popconfirm
                            title='确定删除吗?'
                            onConfirm={this._deleteClick.bind(this, record.ID)}
                            okText='确定'
                            cancelText='取消'
                        >
                            {this.confirms()}
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];
    componentDidMount = () => {
        this.query();
    }

    confirms () {
        const user = getUser();
        if (user.username === 'admin') {
            return <a>删除</a>;
        } else {
            return [];
        }
    }

    _deleteClick = async (ID) => {
        const {
            actions: { deleteDispatch }
        } = this.props;
        let data = await deleteDispatch({id: ID});
        if (data) {
            Notification.success({
                message: '删除发文成功！',
                duration: 3
            });
            this.query();
        } else {
            Notification.error({
                message: '删除发文失败！',
                duration: 3
            });
        }
    }
    // 查看信息详情
    _viewClick = async (record) => {
        const {
            companyList
        } = this.props;
        try {
            let fileList = [];
            if (record.Accessories) {
                let fileUrlList = record.Accessories.split(',');
                fileUrlList.map((url) => {
                    let nameList = url.split('_');
                    let name = nameList[nameList.length - 1];
                    fileList.push({
                        FilePath: url,
                        FileName: name
                    });
                });
            }
            let receivingUnitName = '';
            if (record.ReceivingUnit) {
                let copyUnitList = record.ReceivingUnit.split(',');
                copyUnitList.map((copyUnit, index) => {
                    companyList.map((company) => {
                        if (company.ID === copyUnit) {
                            if (receivingUnitName) {
                                receivingUnitName = receivingUnitName + ',' + company.OrgName;
                            } else {
                                receivingUnitName = company.OrgName;
                            }
                        }
                    });
                });
            }
            //	获取详情
            this.setState({
                detail: record,
                visible: true,
                fileList,
                receivingUnitName
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    _sentDoc () {
        this.setState({
            sentDocVisible: true
        });
    }
    // 关闭弹窗
    closeSendModal () {
        this.setState({
            sentDocVisible: false
        });
    }
    // 发文成功后关闭弹窗并搜索数据
    sendSuccessCloseModal () {
        this.setState({
            sentDocVisible: false
        });
        this.query();
    }
    handleCancel () {
        this.setState({
            visible: false,
            detail: ''
        });
    }
    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    // 清除
    clear () {
        this.props.form.setFieldsValue({
            title1: undefined,
            orgLists1: undefined,
            worktimes1: undefined,
            ccLists1: undefined
        });
        this.setState({
            stime: '',
            etime: ''
        }, () => {
            this.query();
        });
    }
    // 查询
    query () {
        const {
            actions: {
                getDispatchs
            },
            permission,
            parentOrgID
        } = this.props;
        const {
            stime,
            etime
        } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log('values', values);
            console.log('err', err);
            let postData = {
                filename: values.title1 || '', // 邮件名称
                receivingunit: values.orgLists1 || '', // 接收单位
                sendunit: permission ? '' : parentOrgID, // 如果不是管理员，获取自己公司的收文
                copyunit: values.ccLists1 || '', // 抄送单位
                sTime: stime, // 开始时间
                eTime: etime // 结束时间
            };
            let data = await getDispatchs({}, postData);
            let dataSource = [];
            if (data && data.content) {
                dataSource = data.content;
            }
            this.setState({
                dataSource: dataSource
            });
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            companyList = []
        } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const {
            dataSource,
            sentDocVisible,
            detail,
            receivingUnitName,
            fileList
        } = this.state;
        return (
            <Row>
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入名称'
                                            }
                                        ]
                                    })(<Input type='text' placeholder='请输入名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='接收单位'
                                >
                                    {getFieldDecorator('orgLists1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择接收单位'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择接收单位'
                                            style={{ width: '100%' }}>
                                            {
                                                companyList.map((company) => {
                                                    return <Option
                                                        value={company.ID}
                                                        title={company.OrgName}
                                                        key={company.ID}>
                                                        {company.OrgName}
                                                    </Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='抄送单位'
                                >
                                    {getFieldDecorator('ccLists1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择抄送单位'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择抄送单位'
                                            style={{ width: '100%' }}>
                                            {
                                                companyList.map((company) => {
                                                    return <Option
                                                        value={company.ID}
                                                        title={company.OrgName}
                                                        key={company.ID}>
                                                        {company.OrgName}
                                                    </Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='发送时间'
                                >
                                    {getFieldDecorator('worktimes1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '发送时间'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            style={{
                                                verticalAlign: 'middle',
                                                width: '100%'
                                            }}
                                            showTime={{
                                                format: 'HH:mm:ss'
                                            }}
                                            onChange={this.datepick.bind(this)}
                                            format={'YYYY/MM/DD HH:mm:ss'}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        style={{ paddingLeft: '50px' }}
                        span={4}
                        offset={1}
                    >
                        <Row
                            style={{
                                marginTop: '-50px',
                                marginLeft: '80%'
                            }}
                            span={8}
                        >
                            <Button
                                type='primary'
                                onClick={this._sentDoc.bind(this)}
                            >
                                    发文
                            </Button>
                        </Row>
                        <Row style={{ marginTop: '23px' }} span={8}>
                            <FormItem>
                                <Button
                                    icon='search'
                                    type='primary'
                                    onClick={this.query.bind(this)}
                                >
                                        查询
                                </Button>
                            </FormItem>
                        </Row>
                        <Row span={8}>
                            <FormItem>
                                <Button
                                    icon='reload'
                                    onClick={this.clear.bind(this)}
                                >
                                        清除
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    title={() => '发文查询'}
                    className='foresttables'
                    bordered
                    rowKey='ID'
                />
                {
                    sentDocVisible ? (
                        <SendPageModal
                            closeSendModal={this.closeSendModal.bind(this)}
                            sendSuccessCloseModal={this.sendSuccessCloseModal.bind(this)}
                            {...this.state}
                            {...this.props} />
                    ) : ''
                }
                <Modal
                    title='查看详情'
                    width='70%'
                    style={{ padding: '0 20px' }}
                    visible={this.state.visible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    closable={false}
                    maskClosable={false}
                    // footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{detail && detail.FileName}</h1>
                        <p>收文单位 ：{receivingUnitName ? <span>{receivingUnitName}</span> : ''}</p>
                        <p>
                            {fileList.length ? fileList.map(item => {
                                return (<p key={item.FilePath}>
                                    附件 ：<a href={item.FilePath}
                                        target='_blank'
                                    >{item.FileName}</a>
                                </p>);
                            }) : (<p>{`附件 ：暂无`}</p>)}
                        </p>
                        <div
                            style={{ maxHeight: '800px', overflow: 'auto' }}
                            dangerouslySetInnerHTML={{
                                __html: detail && detail.Text
                            }}
                        />
                    </div>
                </Modal>
            </Row>
        );
    }
}
export default Form.create()(SendPage);

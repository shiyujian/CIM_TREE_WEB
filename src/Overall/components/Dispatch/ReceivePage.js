import React, { Component } from 'react';
import {
    Table,
    Button,
    Row,
    Col,
    Modal,
    Notification,
    Popconfirm,
    Form,
    Input,
    DatePicker,
    Select,
    Divider
} from 'antd';
import moment from 'moment';
import ReceivePageModal from './ReceivePageModal';
import {
    getUser,
    trim
} from '_platform/auth';
import './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class ReceivePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            detail: '',
            receiveDocVisible: false,
            dataSource: [],
            stime: '',
            etime: '',
            fileList: [],
            communicationsUnitName: '',
            receiveRecordDetail: ''
        };
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '名称',
            dataIndex: 'FileName',
            key: 'FileName'
        },
        {
            title: '来文单位',
            dataIndex: 'Communicationsunit',
            key: 'Communicationsunit',
            render: (text, record, index) => {
                const {
                    companyList
                } = this.props;
                let orgName = '/';
                if (text) {
                    companyList.map((company) => {
                        if (company.ID === text) {
                            orgName = company.OrgName;
                        }
                    });
                }
                return <span>{orgName}</span>;
            }
        },
        {
            title: '收文日期',
            sorter: (a, b) => moment(a.CreateTime) - moment(b.CreateTime),
            render: (text, record, index) => {
                return moment(record.CreateTime).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '操作',
            render: record => {
                const {
                    permission,
                    parentOrgID
                } = this.props;
                if (permission) {
                    return (
                        <span>
                            <a
                                onClick={this._viewClick.bind(this, record)}
                            >
                                查看
                            </a>
                        </span>
                    );
                } else {
                    if (record.ReceivingUnit.indexOf(parentOrgID) !== -1) {
                        return (
                            <span>
                                <a
                                    onClick={this._viewClick.bind(this, record)}
                                >
                                    查看
                                </a>
                                <Divider type='vertical' />
                                <a
                                    onClick={this._sentDoc.bind(this, record)}
                                >
                                    回文
                                </a>
                            </span>
                        );
                    } else {
                        return (
                            <span>
                                <a
                                    onClick={this._viewClick.bind(this, record)}
                                >
                                    查看
                                </a>
                            </span>
                        );
                    }
                }
            }
        }
    ];
    componentDidMount = () => {
    }
    componentWillReceiveProps = (nextProps) => {
        const {
            getMessageStatus
        } = this.props;
        if (nextProps.getMessageStatus && nextProps.getMessageStatus !== getMessageStatus) {
            this.query();
        }
    }
    confirms () {
        const user = getUser();
        if (user.username === 'admin') {
            return <a>删除</a>;
        } else {
            return [];
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
            let communicationsUnitName = '';
            if (record.Communicationsunit) {
                companyList.map((company) => {
                    if (company.ID === record.Communicationsunit) {
                        communicationsUnitName = company.OrgName;
                    }
                });
            }
            //	获取详情
            this.setState({
                detail: record,
                visible: true,
                fileList,
                communicationsUnitName
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    _handleCancel () {
        this.setState({
            visible: false,
            detail: '',
            fileList: [],
            communicationsUnitName: ''
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
            title: undefined,
            orgLists: undefined,
            worktimes: undefined
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
            console.log('err', err);
            let receivePostData = {
                filename: trim(values.title) || '', // 邮件名称
                sendunit: values.orgLists || '', // 发文单位id
                receivingunit: permission ? '' : parentOrgID, // 如果不是管理员，获取自己公司的收文
                // copyunit:       //抄送单位
                sTime: stime, // 开始时间
                eTime: etime // 结束时间
            };
            let receiveData = await getDispatchs({}, receivePostData);
            let dataSource = [];
            if (receiveData && receiveData.content && receiveData.content.length > 0) {
                dataSource = receiveData.content;
            }
            if (!permission) {
                let copyPostData = {
                    filename: values.title || '', // 邮件名称
                    sendunit: values.orgLists || '', // 发文单位id
                    // receivingunit: permission ? '' : parentOrgID, // 如果不是管理员，获取自己公司的收文
                    copyunit: permission ? '' : parentOrgID, // 如果不是管理员，获取自己公司的收文
                    sTime: stime, // 开始时间
                    eTime: etime // 结束时间
                };
                let copyData = await getDispatchs({}, copyPostData);
                if (copyData && copyData.content && copyData.content.length > 0) {
                    dataSource = dataSource.concat(copyData.content);
                }
            }
            this.setState({
                dataSource: dataSource
            });
        });
    }

    handleCancel () {
        this.setState({
            visible: false,
            container: null
        });
    }

    // 回文弹出框
    _sentDoc (record) {
        this.setState({
            receiveDocVisible: true,
            receiveRecordDetail: record
        });
    }
    closeSendModal () {
        this.setState({
            receiveDocVisible: false,
            receiveRecordDetail: ''
        });
    }

    render () {
        const {
            form: { getFieldDecorator },
            companyList = []
        } = this.props;
        const {
            dataSource,
            detail,
            fileList,
            communicationsUnitName,
            receiveDocVisible
        } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Row>
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入名称'
                                            }
                                        ],
                                        initialValue: ''
                                    })(<Input
                                        type='text'
                                        placeholder='请输入名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='来文单位'
                                >
                                    {getFieldDecorator('orgLists', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择来文单位'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择来文单位'
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
                                    label='收文日期'
                                >
                                    {getFieldDecorator('worktimes', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择日期'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            style={{
                                                verticalAlign: 'middle',
                                                width: '100%'
                                            }}
                                            onChange={this.datepick.bind(this)}
                                            showTime={{
                                                format: 'HH:mm:ss'
                                            }}
                                            format={'YYYY/MM/DD HH:mm:ss'}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={4} offset={1}>
                        <Row span={8}>
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
                {
                    receiveDocVisible ? (
                        <ReceivePageModal
                            closeSendModal={this.closeSendModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                    ) : ''
                }
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    title={() => '收文查询'}
                    className='foresttables'
                    bordered
                />
                <Modal
                    title={detail && detail.FileName}
                    width='800px'
                    visible={this.state.visible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    closable={false}
                    maskClosable={false}
                    footer={null}
                // footer={null}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>{detail && detail.FileName}</h1>
                        <p>发文单位 ：{communicationsUnitName ? <span>{communicationsUnitName}</span> : ''}</p>
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
                        <Row>
                            <Button
                                onClick={this.handleCancel.bind(this)}
                                style={{float: 'right'}}>
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </Row>
        );
    }
}
export default Form.create()(ReceivePage);

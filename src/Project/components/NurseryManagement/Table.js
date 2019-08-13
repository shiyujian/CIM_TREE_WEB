import React, { Component } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Input,
    Button,
    Select,
    Table,
    Modal,
    Form,
    Spin,
    Notification
} from 'antd';
import Edit from './Edit';
import Addition from './Addition';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import './Table.less';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            status: '', // 审核状态
            nurseryname: '', // 苗圃名称
            loading: true,
            nurseryList: [], // 苗圃列表
            visible: false, // 新增编辑苗圃弹框
            visibleTitle: '', // 弹框标题
            seeVisible: false, // 查看弹框
            auditVisible: false, // 审核弹框
            RegionCodeList: [], // 行政区划option
            record: null,
            imageUrl: '', // 身份证正反面
            Leader: '', // 负责人姓名
            optionList: [],
            permission: false, // 是否为业主或管理员
            blackVisible: false, // 拉黑modal
            blackRecord: '', // 拉黑的信息
            addVisible: false,
            editVisible: false,
            pagination: {
                current: 1,
                showQuickJumper: true
            }
        };
        this.onClear = this.onClear.bind(this); // 清空
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleStatus = this.handleStatus.bind(this); // 状态
        this.handleName = this.handleName.bind(this); // 查询苗圃名称
        this.toAdd = this.toAdd.bind(this); // 新增苗圃弹框
        this.handleAudit = this.handleAudit.bind(this); // 苗圃审核
        this.handleCancel = this.handleCancel.bind(this); // 隐藏弹框
        this.handleTableChange = this.handleTableChange.bind(this); // 换页
    }
    columns = [
        {
            title: '苗圃名称',
            key: 0,
            width: 100,
            dataIndex: 'NurseryName'
        }, {
            title: '行政区划编码',
            key: 2,
            dataIndex: 'RegionCode'
        }, {
            title: '产地',
            key: 3,
            width: 150,
            dataIndex: 'TreePlace'
        }, {
            title: '负责人姓名',
            key: 4,
            dataIndex: 'Leader'
        }, {
            title: '负责人手机号',
            key: 5,
            dataIndex: 'LeaderPhone'
        }, {
            title: '负责人身份证号',
            key: 6,
            dataIndex: 'LeaderCardNo'
        }, {
            title: '身份证正面',
            key: 7,
            dataIndex: 'LeaderCard',
            render: (text, record) => {
                return text ? <a onClick={this.seeModal.bind(this, record, 'LeaderCard')}>查看</a> : '';
            }
        }, {
            title: '身份证反面',
            key: 8,
            dataIndex: 'LeaderCardBack',
            render: (text, record) => {
                return text ? <a onClick={this.seeModal.bind(this, record, 'LeaderCardBack')}>查看</a> : '';
            }
        }, {
            title: '状态',
            key: 9,
            dataIndex: 'CheckStatus',
            render: (text) => {
                if (text === 0) {
                    return <span>未审核</span>;
                } else if (text === 1) {
                    return <span>审核通过</span>;
                } else {
                    return <span>审核不通过</span>;
                }
            }
        }, {
            title: '操作',
            key: 10,
            width: 160,
            dataIndex: 'action',
            render: (text, record) => {
                const {
                    permission
                } = this.state;
                const user = getUser();
                if (user && user.username === 'admin') {
                    return (
                        <span>
                            {
                                record && record.IsBlack
                                    ? <a onClick={this.toDelete.bind(this, record)}>删除</a>
                                    : [
                                        <a key='1' onClick={this.toEdit.bind(this, record)}>修改</a>,
                                        <span key='2' className='ant-divider' />,
                                        <a onClick={this.toDelete.bind(this, record)}>删除</a>
                                    ]
                            }
                            {
                                record && !record.IsBlack && record.CheckStatus === 0
                                    ? [
                                        <span key='4' className='ant-divider' />,
                                        <a key='3' onClick={this.toAudit.bind(this, record)}>审核</a>
                                    ]
                                    : []
                            }
                            {
                                record && !record.IsBlack && record.CheckStatus === 1
                                    ? ([
                                        <span key='4' className='ant-divider' />,
                                        <a onClick={this.toBlack.bind(this, record)}>拉黑</a>
                                    ]) : ''
                            }
                        </span>
                    );
                } else if (permission) {
                    return (
                        <span>
                            {
                                record && record.IsBlack
                                    ? <a onClick={this.toDelete.bind(this, record)}>删除</a>
                                    : [
                                        <a key='1' onClick={this.toEdit.bind(this, record)}>修改</a>,
                                        <span key='2' className='ant-divider' />,
                                        <a onClick={this.toDelete.bind(this, record)}>删除</a>
                                    ]
                            }
                            {
                                record && !record.IsBlack && record.CheckStatus === 0
                                    ? [
                                        <span key='4' className='ant-divider' />,
                                        <a key='3' onClick={this.toAudit.bind(this, record)}>审核</a>
                                    ]
                                    : []
                            }
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {
                                record.CheckStatus === 1
                                    ? ''
                                    : <span>
                                        <a onClick={this.toEdit.bind(this, record)}>修改</a>
                                        <span className='ant-divider' />
                                    </span>
                            }
                        </span>
                    );
                }
            }
        }
    ];
    componentDidMount () {
        const { getRegionCodes, getSupplierList } = this.props.actions;
        // 获取当前组织机构的权限
        const user = getUser();
        let userRoles = user.roles || '';
        this.groupId = userRoles && userRoles.ID;
        let permission = getUserIsManager();
        this.setState({
            permission
        });
        // 获取行政区划编码
        const RegionCodeList = JSON.parse(window.localStorage.getItem('RegionCodeList'));
        if (RegionCodeList) {
            this.setState({
                RegionCodeList
            });
        } else {
            getRegionCodes().then(rep => {
                let RegionCodeList = [];
                rep.map(item => {
                    if (item.LevelType === '1') {
                        RegionCodeList.push({
                            value: item.ID,
                            label: item.Name
                        });
                    }
                });
                RegionCodeList.map(item => {
                    let arrCity = [];
                    rep.map(row => {
                        if (row.LevelType === '2' && item.value === row.ParentId) {
                            arrCity.push({
                                value: row.ID,
                                label: row.Name
                            });
                        }
                    });
                    arrCity.map(row => {
                        let arrCounty = [];
                        rep.map(record => {
                            if (record.LevelType === '3' && row.value === record.ParentId) {
                                arrCounty.push({
                                    value: record.ID,
                                    label: record.Name
                                });
                            }
                        });
                        row.children = arrCounty;
                    });
                    item.children = arrCity;
                });
                window.localStorage.setItem('RegionCodeList', JSON.stringify(RegionCodeList));
                this.setState({
                    RegionCodeList
                });
            });
        }
        // 获取所有供应商
        getSupplierList({}, {
            status: 1
        }).then(rep => {
            this.setState({
                optionList: rep.content
            });
        });
        this.onSearch();
    }
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        }, () => {
            this.onSearch();
        });
    }
    onClear () {
        const pagination = { ...this.state.pagination };
        pagination.current = 1;
        this.setState({
            pagination,
            nurseryname: ''
        }, () => {
            this.onSearch();
        });
    }
    seeModal (record, str) {
        this.setState({
            seeVisible: true,
            imageUrl: record[str],
            Leader: record.Leader,
            textCord: record.LeaderCardNo
        });
    }
    onSearch () {
        const {
            status,
            nurseryname
        } = this.state;
        const {
            actions: {
                getNurseryList
            }
        } = this.props;
        const pagination = { ...this.state.pagination };
        const page = pagination.current;
        const param = {
            status: status === undefined ? '' : status,
            nurseryname,
            size: 10,
            page
        };
        this.setState({
            loading: true
        });
        getNurseryList({}, param).then((rep) => {
            if (rep && rep.code && rep.code === 200) {
                let pageinfo = (rep && rep.pageinfo) || '';
                pagination.total = (pageinfo && pageinfo.total) || 0;
                pagination.current = (pageinfo && pageinfo.page) || 1;
                pagination.pageSize = 10;
                this.setState({
                    nurseryList: rep.content,
                    loading: false,
                    pagination
                });
            }
        });
    }
    handleAudit () {
        const { checkNursery } = this.props.actions;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { ID } = getUser();
            const param = {
                ID: this.state.record.ID,
                Checker: ID,
                CheckStatus: values.CheckStatus,
                CheckInfo: values.CheckInfo,
                CheckTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            checkNursery({}, param).then((rep) => {
                if (rep.code === 1) {
                    Notification.success({
                        message: '审核成功',
                        duration: 2
                    });
                    this.onSearch();
                    this.handleCancel();
                }
            });
        });
    }
    toAdd () {
        this.setState({
            addVisible: true,
            visibleTitle: '新增苗圃'
        });
    }
    toEdit (record, e) {
        e.preventDefault();
        this.setState({
            editVisible: true,
            visibleTitle: '编辑苗圃',
            record
        });
    }
    toAudit (record, e) {
        e.preventDefault();
        this.setState({
            auditVisible: true,
            record
        });
    }
    toDelete (record, e) {
        e.preventDefault();
        const { deleteNursery } = this.props.actions;
        const {
            nurseryList
        } = this.state;
        const pagination = { ...this.state.pagination };
        const self = this;
        confirm({
            title: '此操作会删除该苗圃下 所有的绑定关系，你确定继续吗?',
            content: '详情请查看绑定管理',
            okType: 'danger',
            onOk () {
                deleteNursery({ID: record.ID}).then((rep) => {
                    if (rep.code === 1) {
                        Notification.warning({
                            message: '如未删除成功，请确认该组织机构下无用户',
                            duration: 2
                        });
                        if (nurseryList instanceof Array && nurseryList.length === 1) {
                            if (pagination.current > 1) {
                                pagination.current = pagination.current - 1;
                            }
                        }
                        self.setState({
                            pagination
                        }, () => {
                            self.onSearch();
                        });
                    } else {
                        Notification.warning({
                            message: '如未删除成功，请确认本机构下无用户',
                            duration: 2
                        });
                        self.onSearch();
                    }
                });
            },
            onCancel () {

            }
        });
    }
    toBlack = async (record) => {
        this.setState({
            blackVisible: true,
            blackRecord: record
        });
    }
    handleBlackCancel = async () => {
        this.setState({
            blackVisible: false,
            blackRecord: ''
        });
    }
    // 设置拉入黑名单的背景颜色
    setBlackListColor (record, i) {
        if (record && record.IsBlack) {
            return 'background';
        } else {
            return '';
        }
    }
    // 拉黑
    handleBlackOk = async () => {
        const {
            actions: {
                getUsers,
                postForestUserBlackList,
                postNurseryBlack
            }
        } = this.props;
        const {
            blackRecord
        } = this.state;
        try {
            this.props.form.validateFields(async (err, values) => {
                if (err) {
                    return;
                }
                // 首先需要根据身份证号查到所有的苗圃
                // 然后根据苗圃的orgpk查到苗圃下的所有人员，将所有人员进行拉黑
                let nuseryList = [];
                nuseryList.push(blackRecord);
                // 需要对人员列表根据身份证做去重处理，人员身份证List
                let userIDNumList = [];
                for (let index = 0; index < nuseryList.length; index++) {
                    let nursery = nuseryList[index];
                    // 当前被拉黑苗圃下的人员
                    let userAllResults = [];
                    let orgID = nursery.ID;
                    let postData = {
                        org: orgID,
                        page: 1,
                        size: 20
                    };
                    let userList = await getUsers({}, postData);
                    if (userList && userList.code && userList.code === 200) {
                        userAllResults = userAllResults.concat((userList && userList.content) || []);
                        let total = userList.pageinfo.total;
                        // 为了防止人员过多，对人员进行分页获取处理
                        if (total > 20) {
                            for (let i = 0; i < (total / 20) - 1; i++) {
                                postData = {
                                    org: orgID,
                                    page: i + 2,
                                    size: 20
                                };
                                let datas = await getUsers({}, postData);
                                if (datas && datas.code && datas.code === 200) {
                                    userAllResults = userAllResults.concat((datas && datas.content) || []);
                                }
                            }
                        }
                    }
                    // 人员拉黑请求数组
                    let blackPostRequestList = [];

                    userAllResults.map((user) => {
                        // 之前没有对该身份证进行拉黑，则push进入拉黑请求数组中
                        if (user && user.ID && !user.IsBlack && user.Number && userIDNumList.indexOf(user.Number) === -1) {
                            let blackPostData = {
                                id: user.ID + '',
                                is_black: 1,
                                black_remark: `苗圃基地${nursery.NurseryName}: ${values.BlackInfo}`
                            };
                            blackPostRequestList.push(postForestUserBlackList({}, blackPostData));
                            userIDNumList.push(user.Number);
                        }
                    });
                    let blackData = await Promise.all(blackPostRequestList);
                    if (blackData && blackData instanceof Array && blackData.length > 0) {
                        Notification.success({
                            message: '苗圃人员拉黑成功',
                            duration: 2
                        });
                    }
                    let nurseryPostData = {
                        ID: nursery.ID,
                        BlackInfo: values.BlackInfo
                    };
                    let nurseryBlackData = await postNurseryBlack({}, nurseryPostData);
                    if (nurseryBlackData && nurseryBlackData.code && nurseryBlackData.code === 1) {
                        Notification.success({
                            message: '苗圃拉黑成功',
                            duration: 2
                        });
                    } else {
                        Notification.error({
                            message: '苗圃拉黑失败',
                            duration: 2
                        });
                    }
                }
                await this.onSearch();
                this.setState({
                    blackVisible: false,
                    blackRecord: ''
                });
            });
        } catch (e) {
            console.log('handleBlackOk', e);
        }
    }
    handleStatus (value) {
        this.setState({
            status: value
        }, () => {
            this.onSearch();
        });
    }
    handleName (e) {
        this.setState({
            nurseryname: e.target.value
        });
    }
    handleCancel () {
        this.setState({
            addVisible: false,
            editVisible: false,
            seeVisible: false,
            auditVisible: false,
            record: null
        });
    }
    handleQuery = () => {
        const pagination = { ...this.state.pagination };
        pagination.current = 1;
        this.setState({
            pagination
        }, () => {
            this.onSearch();
        });
    }
    render () {
        const {
            status,
            nurseryList,
            editVisible,
            addVisible,
            seeVisible,
            auditVisible,
            fileListBack,
            imageUrl,
            nurseryname,
            Leader,
            textCord,
            blackVisible,
            pagination
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        let img = getForestImgUrl(imageUrl);
        return (
            <div className='table-level'>
                <Row>
                    <Col span={6}>
                        <h3>苗圃列表</h3>
                    </Col>
                    <Col span={12}>
                        <label
                            style={{marginRight: 10}}
                        >
                            苗圃名称:
                        </label>
                        <Input className='search_input' value={nurseryname} onChange={this.handleName} />
                        <Button
                            type='primary'
                            onClick={this.handleQuery.bind(this)}
                            style={{minWidth: 30, marginRight: 20}}
                        >
                            查询
                        </Button>
                        <Button
                            onClick={this.onClear}
                            style={{minWidth: 30}}
                        >
                            清空
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            type='primary'
                            style={{ float: 'right' }}
                            onClick={this.toAdd}
                        >
                            新增苗圃
                        </Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: 5 }}>
                    <Col span={6}>
                        <label
                            style={{marginRight: 10}}
                        >
                            状态:
                        </label>
                        <Select
                            defaultValue={status}
                            allowClear
                            style={{width: 150}}
                            onChange={this.handleStatus}>
                            <Option value={0}>未审核</Option>
                            <Option value={1}>审核通过</Option>
                            {/* <Option value={2}>审核不通过</Option> */}
                            <Option value={''}>全部</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <Spin tip='Loading...' spinning={this.state.loading}>
                            <Table
                                columns={this.columns}
                                bordered
                                rowClassName={this.setBlackListColor.bind(this)}
                                dataSource={nurseryList}
                                pagination={pagination}
                                onChange={this.handleTableChange.bind(this)}
                                rowKey='ID' />
                        </Spin>
                    </Col>
                </Row>
                <Modal
                    title='查看'
                    visible={seeVisible}
                    onCancel={this.handleCancel}
                    style={{textAlign: 'center'}}
                    footer={null}
                >
                    <p style={{fontSize: 20}}>{Leader}&nbsp;&nbsp;{textCord}</p>
                    <img src={img} width='100%' height='100%' alt='图片找不到了' />
                </Modal>
                <Modal title='拉黑' visible={blackVisible}
                    onCancel={this.handleBlackCancel.bind(this)}
                    onOk={this.handleBlackOk.bind(this)}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='拉黑备注'
                        >
                            {getFieldDecorator('BlackInfo', {
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                {
                    auditVisible
                        ? <Modal title='审核' visible
                            onOk={this.handleAudit} onCancel={this.handleCancel}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label='审核结果'
                                >
                                    {getFieldDecorator('CheckStatus', {
                                        rules: [{required: true, message: '必填项'}]
                                    })(
                                        <Select style={{ width: 150 }} allowClear>
                                            <Option value={1}>审核通过</Option>
                                            <Option value={2}>审核不通过</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='审核备注'
                                >
                                    {getFieldDecorator('CheckInfo', {
                                    })(
                                        <TextArea rows={4} />
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                        : null
                }
                {
                    editVisible
                        ? <Edit
                            {...this.props}
                            {...this.state}
                            fileListBack={fileListBack}
                            handleCancel={this.handleCancel}
                            onSearch={this.onSearch}
                        />
                        : null
                }
                {
                    addVisible
                        ? <Addition
                            {...this.props}
                            {...this.state}
                            handleCancel={this.handleCancel}
                            onSearch={this.onSearch}
                        />
                        : null
                }
            </div>
        );
    }
}

export default Form.create()(Tablelevel);

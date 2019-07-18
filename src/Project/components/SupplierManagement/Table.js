import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Input, Button, Select, Table, Pagination, Modal, Form, Spin, Notification } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import AddEdit from './AddEdit';
import Addition from './Addition';
import Edit from './Edit';
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
            suppliername: '', // 供应商名称
            total: 0,
            page: 1,
            loading: true,
            supplierList: [], // 供应商列表
            visible: false, // 新增编辑供应商弹框
            visibleTitle: '', // 弹框标题
            seeVisible: false, // 查看弹框
            auditVisible: false, // 审核弹框
            RegionCode: '',
            RegionCodeList: [], // 行政区划option
            record: null,
            imageUrl: '', // 图片URL
            textCord: '', // 编码
            LegalPerson: '', // 姓名
            optionList: [],
            permission: false, // 是否为业主或管理员
            blackRecord: '',
            blackVisible: false,
            addVisible: false,
            editVisible: false
        };
        this.Checker = '';
        this.groupId = ''; // 用户分组ID
        this.onClear = this.onClear.bind(this); // 清空
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handlePage = this.handlePage.bind(this); // 换页
        this.handleStatus = this.handleStatus.bind(this); // 状态
        this.handleName = this.handleName.bind(this); // 查询供应商名称
        this.toAdd = this.toAdd.bind(this); // 新增供应商弹框
        this.handleAudit = this.handleAudit.bind(this); // 供应商审核
        this.handleCancel = this.handleCancel.bind(this); // 隐藏弹框
    }
    columns = [
        {
            title: '供应商名称',
            key: 0,
            width: 120,
            fixed: 'left',
            dataIndex: 'SupplierName'
        }, {
            title: '行政区划编码',
            key: 2,
            width: 100,
            fixed: 'left',
            dataIndex: 'RegionCode'
        }, {
            title: '详细地址',
            key: 3,
            width: 200,
            dataIndex: 'Address'
        }, {
            title: '统一信用代码',
            key: 5,
            width: 200,
            dataIndex: 'USCC'
        }, {
            title: '法人姓名',
            key: 7,
            dataIndex: 'LegalPerson'
        }, {
            title: '法人手机',
            key: 8,
            width: 150,
            dataIndex: 'LegalPersonPhone'
        }, {
            title: '法人身份证号',
            key: 9,
            width: 200,
            dataIndex: 'LegalPersonCardNo'
        }, {
            title: '身份证正面',
            key: 10,
            dataIndex: 'LegalPersonCard',
            render: (text, record) => {
                return text ? <a onClick={this.seeModal.bind(this, record, 'LegalPersonCard', 'LegalPersonCardNo')}>查看</a> : '';
            }
        }, {
            title: '身份证反面',
            key: 11,
            dataIndex: 'LegalPersonCardBack',
            render: (text, record) => {
                return text ? <a onClick={this.seeModal.bind(this, record, 'LegalPersonCardBack', 'LegalPersonCardNo')}>查看</a> : '';
            }
        }, {
            title: '营业执照/门面照片',
            key: 12,
            dataIndex: 'BusinessLicense',
            render: (text, record) => {
                if (text) {
                    return <a onClick={this.seeModal.bind(this, record, 'BusinessLicense', 'USCC')}>查看</a>;
                } else if (record.Facade) {
                    return <a onClick={this.seeModal.bind(this, record, 'Facade', 'USCC')}>查看</a>;
                } else {
                    return '';
                }
            }
        }, {
            title: '状态',
            key: 13,
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
            key: 14,
            width: 160,
            fixed: 'right',
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
                                    ] : []
                            }
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {
                                record.CheckStatus === 1
                                    ? ''
                                    : <a onClick={this.toEdit.bind(this, record)}>修改</a>
                            }
                        </span>
                    );
                }
            }
        }
    ];
    componentDidMount () {
        const { getRegionCodes, getNurseryList } = this.props.actions;
        // 获取当前组织机构的权限
        const user = getUser();
        let userRoles = user.roles || '';
        this.groupId = userRoles && userRoles.roles.ID;
        let permission = getUserIsManager();
        console.log('permission', permission);
        this.setState({
            permission
        });
        const RegionCodeList = JSON.parse(window.localStorage.getItem('RegionCodeList'));
        if (RegionCodeList) {
            this.setState({
                RegionCodeList
            });
        } else {
            // 获取行政区划编码
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
        // 获取所有苗圃
        getNurseryList({}, {
            status: 1
        }).then(rep => {
            this.setState({
                optionList: rep.content
            });
        });
        this.onSearch();
    }
    handlePage (page) {
        this.setState({
            page
        }, () => {
            this.onSearch();
        });
    }
    handleAudit () {
        const { checkSupplier } = this.props.actions;
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
            checkSupplier({}, param).then((rep) => {
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
    onClear () {
        this.setState({
            suppliername: ''
        }, () => {
            this.onSearch();
        });
    }
    seeModal (record, str, textCord) {
        this.setState({
            seeVisible: true,
            imageUrl: record[str],
            LegalPerson: record.LegalPerson,
            textCord: record[textCord]
        });
    }
    handleName (e) {
        this.setState({
            suppliername: e.target.value
        });
    }
    toAdd () {
        this.setState({
            addVisible: true,
            visibleTitle: '新增供应商'
        });
    }
    toEdit (record, e) {
        e.preventDefault();
        this.setState({
            editVisible: true,
            visibleTitle: '编辑供应商',
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
        const { deleteSupplier } = this.props.actions;
        const self = this;
        confirm({
            title: '此操作会删除该供应商下 所有的绑定关系，你确定继续吗?',
            content: '详情请查看绑定管理',
            okType: 'danger',
            onOk () {
                deleteSupplier({ID: record.ID}).then((rep) => {
                    if (rep.code === 1) {
                        Notification.warning({
                            message: '如未删除成功，请确认该组织机构下无用户',
                            duration: 2
                        });
                        self.onSearch();
                    } else {
                        Notification.warning({
                            message: '如未删除成功，请确认该组织机构下无用户',
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
                postSupplierBlack
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
                // 首先需要根据身份证号查到所有的供应商
                // 然后根据供应商的orgpk查到供应商下的所有人员，将所有人员进行拉黑
                let supplierList = [];
                supplierList.push(blackRecord);
                // 需要对人员列表根据身份证做去重处理，人员身份证List
                let userIDNumList = [];
                for (let index = 0; index < supplierList.length; index++) {
                    let supplier = supplierList[index];
                    // 当前被拉黑供应商下的人员
                    let userAllResults = [];
                    let orgCode = supplier.OrgPK;
                    let postData = {
                        org_code: orgCode,
                        page: 1,
                        page_size: 20
                    };
                    let userList = await getUsers({}, postData);
                    userAllResults = userAllResults.concat((userList && userList.results) || []);
                    let total = userList.count;
                    // 为了防止人员过多，对人员进行分页获取处理
                    if (total > 20) {
                        for (let i = 0; i < (total / 20) - 1; i++) {
                            postData = {
                                org_code: orgCode,
                                page: i + 2,
                                page_size: 20
                            };
                            let datas = await getUsers({}, postData);
                            userAllResults = userAllResults.concat((datas && datas.results) || []);
                        }
                    }
                    // 人员拉黑请求数组
                    let blackPostRequestList = [];
                    userAllResults.map((user) => {
                        // 之前没有对该身份证进行拉黑，则push进入拉黑请求数组中
                        if (user && user.account && user.account.id_num && !(user.account.is_black === 1) && userIDNumList.indexOf(user.account.id_num) === -1) {
                            let blackPostData = {
                                id: user.id,
                                is_black: 1,
                                black_remark: `供应商${supplier.SupplierName}: ${values.BlackInfo}`,
                                change_all: true
                            };
                            blackPostRequestList.push(postForestUserBlackList({}, blackPostData));
                            userIDNumList.push(user.account.id_num);
                        }
                    });
                    let blackData = await Promise.all(blackPostRequestList);
                    console.log('blackData', blackData);
                    if (blackData && blackData.length > 0) {
                        Notification.success({
                            message: '供应商人员拉黑成功',
                            duration: 2
                        });
                    }
                    let nurseryPostData = {
                        ID: supplier.ID,
                        BlackInfo: values.BlackInfo
                    };
                    let supplierBlackData = await postSupplierBlack({}, nurseryPostData);
                    console.log('supplierBlackData', supplierBlackData);
                    if (supplierBlackData && supplierBlackData.code && supplierBlackData.code === 1) {
                        Notification.success({
                            message: '供应商拉黑成功',
                            duration: 2
                        });
                    } else {
                        Notification.error({
                            message: '供应商拉黑失败',
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
    onSearch () {
        const { page, status, suppliername } = this.state;
        const { getSupplierList } = this.props.actions;
        const param = {
            status: status === undefined ? '' : status,
            suppliername,
            size: 10,
            page
        };
        this.setState({
            loading: true
        });
        getSupplierList({}, param).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    total: rep.pageinfo.total,
                    supplierList: rep.content,
                    page: rep.pageinfo.page,
                    loading: false
                });
            }
        });
    }
    handleStatus (value) {
        this.setState({
            status: value
        }, () => {
            this.onSearch();
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
    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            supplierList,
            page,
            total,
            visible,
            addVisible,
            editVisible,
            seeVisible,
            auditVisible,
            imageUrl,
            suppliername,
            status,
            textCord,
            LegalPerson,
            blackVisible
        } = this.state;

        let img = getForestImgUrl(imageUrl);
        return (
            <div className='table-level'>
                <Row>
                    <Col span={6}>
                        <h3>供应商列表</h3>
                    </Col>
                    <Col span={12}>
                        <label
                            style={{marginRight: 10}}
                        >
                            供应商名称:
                        </label>
                        <Input className='search_input' value={suppliername} onChange={this.handleName} />
                        <Button
                            type='primary'
                            onClick={this.onSearch}
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
                            添加供应商
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
                                dataSource={supplierList}
                                scroll={{ x: 1550 }}
                                pagination={false} rowKey='ID' />
                            <Pagination total={total} current={page} pageSize={10} style={{marginTop: '10px'}}
                                showQuickJumper onChange={this.handlePage} />
                        </Spin>
                    </Col>
                </Row>
                <Modal title='查看' visible={seeVisible}
                    onCancel={this.handleCancel}
                    style={{textAlign: 'center'}}
                    footer={null}
                >
                    <p style={{fontSize: 20}}>{LegalPerson}&nbsp;&nbsp;{textCord}</p>
                    <img src={img} width='100%' height='100%' alt='图片找不到了' />
                </Modal>
                {
                    auditVisible
                        ? (
                            <Modal title='审核' visible
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
                        )
                        : null
                }
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
                    visible
                        ? <AddEdit
                            {...this.props}
                            {...this.state}
                            handleCancel={this.handleCancel}
                            onSearch={this.onSearch}
                        /> : null
                }
                {
                    addVisible
                        ? <Addition
                            {...this.props}
                            {...this.state}
                            handleCancel={this.handleCancel}
                            onSearch={this.onSearch}
                        /> : null
                }
                {
                    editVisible
                        ? <Edit
                            {...this.props}
                            {...this.state}
                            handleCancel={this.handleCancel}
                            onSearch={this.onSearch}
                        /> : null
                }
            </div>
        );
    }
}

export default Form.create()(Tablelevel);

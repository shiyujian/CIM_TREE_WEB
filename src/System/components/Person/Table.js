import React, { Component } from 'react';

import {
    Table,
    Row,
    Col,
    Select,
    Button,
    Popconfirm,
    message,
    Input,
    Modal,
    Form,
    Spin
} from 'antd';
import {getSectionNameBySection} from '_platform/gisAuth';
import { getUser } from '_platform/auth';
import './index.less';
import moment from 'moment';
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class Users extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sections: [],
            loading: false,
            percent: 0,
            edit: true,
            searchRoles: [], // 角色
            selectedRowKeys: [],
            TreeCodes: '',
            record: null,
            showModal: false,
            dataList: [], // 表格数据用户
            searchKeyword: '', // 用户名称
            searchUserStatus: '', // 状态
            searchOveralSituation: '' // 是否全局搜索，默认不
        };
        this.Checker = ''; // 登陆用户ID
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    columns = [
        {
            title: '序号',
            key: '0',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '姓名',
            key: '1',
            dataIndex: 'person_name',
            render: (text, record) => {
                return record.account ? record.account.person_name : '';
            }
        },
        {
            title: '用户名',
            key: '2',
            dataIndex: 'username'
        },
        {
            title: '性别',
            key: '3',
            dataIndex: 'gender',
            render: (text, record) => {
                return record.account ? record.account.gender : '';
            }
        },
        {
            title: '角色',
            width: '15%',
            key: '4',
            render: (text, record) => {
                return record.groups.length > 0 ? record.groups[0].name : '';
            }
        },
        {
            title: '职务',
            key: '5',
            dataIndex: 'title',
            render: (text, record) => {
                return record.account ? record.account.title : '';
            }
        },
        {
            title: '手机号码',
            key: '6',
            dataIndex: 'person_telephone',
            render: (text, record) => {
                return record.account ? record.account.person_telephone : '';
            }
        },
        {
            title: '所属部门',
            key: '7',
            dataIndex: 'organization',
            render: (text, record) => {
                return record.account ? record.account.organization : '';
            }
        },
        {
            title: '标段',
            key: '8',
            render: (text, record) => {
                const {
                    platform: { tree = {} }
                } = this.props;
                let bigTreeList = tree.bigTreeList;
                if (record && record.account && record.account.sections && record.account.sections.length > 0) {
                    let name = getSectionNameBySection(record.account.sections[0], bigTreeList);
                    return name;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '状态',
            key: '9',
            dataIndex: 'is_active',
            render: text => {
                return text ? '已审核' : '未审核';
            }
        },
        {
            title: '操作',
            key: '10',
            render: (text, record) => {
                const {
                    sidebar: {
                        node = {}
                    } = {}
                } = this.props;
                const userc = JSON.parse(
                    window.localStorage.getItem('QH_USER_DATA')
                );
                let groups = userc.groups || [];
                // 是否为供应商文书
                let userIsSupplierDocument = false;
                // 是否为施工，监理，业主文书
                let userIsProjectDocument = false;
                groups.map((group) => {
                    if (group.name === '供应商文书') {
                        userIsSupplierDocument = true;
                    }
                    if (group.name === '业主文书' || group.name === '监理文书' || group.name === '施工文书') {
                        userIsProjectDocument = true;
                    }
                });

                let editVisible = true;
                if (userc && userc.username !== 'admin' && (node.topParent === '苗圃基地' || node.topParent === '供应商')) {
                    editVisible = false;
                }
                let arr = [
                    <a
                        onClick={this.edit.bind(this, record)}
                        key={1}
                        style={{ marginRight: '.5em' }}
                    >
                        编辑
                    </a>,
                    <Popconfirm
                        title='是否真的要删除用户?'
                        key={2}
                        onConfirm={this.del.bind(this, record)}
                        okText='是'
                        cancelText='否'
                    >
                        <a>删除</a>
                    </Popconfirm>
                ];
                if (userc.is_superuser === true) {
                    if (record.is_active === true) {
                        arr.push(<a
                            key={3}
                            style={{marginLeft: '.5em'}}
                            onClick={this.disable.bind(this, record)}
                        >
                            禁用
                        </a>);
                    } else {
                        arr.push(<a
                            key={3}
                            style={{ marginLeft: '.5em', color: 'red' }}
                            onClick={this.disable.bind(this, record)}
                        >
                            启用
                        </a>, <a
                            key={4}
                            style={{marginLeft: '.5em'}}
                            onClick={this.toAudit.bind(this, record)}
                        >
                            审核
                        </a>);
                    }
                } else {
                    if (editVisible) {
                        arr = [
                            <a
                                onClick={this.edit.bind(this, record)}
                                key={4}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>
                        ];
                    } else {
                        arr = ['/'];
                    }
                }
                // 供应商文书权限 // 项目相关文书，施工，监理，业主文书权限
                if (userIsSupplierDocument || userIsProjectDocument) {
                    if (record.is_active) {
                        arr = [
                            <a
                                onClick={this.edit.bind(this, record)}
                                key={1}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>
                        ];
                    } else {
                        arr = [
                            <a
                                onClick={this.edit.bind(this, record)}
                                key={1}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>, <a
                                key={2}
                                style={{marginLeft: '.5em'}}
                                onClick={this.toAudit.bind(this, record)}
                            >
                                审核
                            </a>
                        ];
                    }
                }
                return arr;
            }
        }
    ];
    componentDidMount () {
        this.Checker = getUser().id;
    }
    componentWillReceiveProps (nextProps) {
        this.setState({ TreeCodes: this.props.getTreeCodes });
        if (this.state.TreeCodes !== this.props.getTreeCodes) {
            // 在重新选择树节点之后，将页数进行修改
            this.setState({
                searchRoles: [],
                searchUserStatus: '',
                searchOveralSituation: '',
                searchKeyword: ''
            });
        }
        if (nextProps.platform.users) {
            this.setState({
                dataList: nextProps.platform.users
            });
        }
    }
    // 人员标段和组织机构标段比较器，如果满足条件返回true
    compare (user, node, eventKey) {
        const {
            orgTreeDataArr = []
        } = this.props;
        try {
            let groups = user.groups;
            let isClericalStaff = false;
            groups.map((group) => {
                if (group.name === '施工文书') {
                    isClericalStaff = true;
                }
            });
            if (isClericalStaff && (node.topParent === '苗圃基地' || node.topParent === '供应商')) {
                return true;
            }
            if (user.is_superuser) {
                return true;
            }
            let status = false;
            orgTreeDataArr.map((code) => {
                if (code === eventKey) {
                    status = true;
                }
            });
            return status;
        } catch (e) {
            console.log('Table-compare', e);
        }
    }
    // 添加和删除用户的按钮
    confirms () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (user.is_superuser === true) {
            return (<div>
                <Col span={3}>
                    <Button onClick={this.append.bind(this)}>添加用户</Button>
                </Col>,
                <Col span={3}>
                    <Popconfirm
                        title='是否真的要删除选中用户?'
                        onConfirm={this.remove.bind(this)}
                        okText='是'
                        cancelText='否'
                    >
                        <Button>批量删除</Button>
                    </Popconfirm>
                </Col>
            </div>);
        } else {
            return (
                <Col span={3}>
                    <Button onClick={this.append.bind(this)}>添加用户</Button>
                </Col>
            );
        }
    }
    // 设置拉入黑名单的背景颜色
    setBlackListColor (record, i) {
        if (record.is_black === 1 || record.is_black === true) {
            return 'background';
        } else {
            return '';
        }
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            platform: { roles = [] },
            sidebar: {
                node: { code } = {},
                node = {}
            } = {}
        } = this.props;
        const { showModal, dataList, searchKeyword } = this.state;
        const systemRoles = roles.filter(role => role.grouptype === 0);
        const projectRoles = roles.filter(role => role.grouptype === 1);
        const professionRoles = roles.filter(role => role.grouptype === 2);
        const departmentRoles = roles.filter(role => role.grouptype === 3);
        const userc = JSON.parse(
            window.localStorage.getItem('QH_USER_DATA')
        );
        let userName = userc.username;
        let permissionStatus = false;
        if (userc.is_superuser) {
            permissionStatus = true;
        } else {
            if (code) {
                permissionStatus = this.compare(userc, node, code);
            }
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        };
        return permissionStatus ? (
            <div>
                <Spin
                    tip='加载中'
                    percent={this.state.percent}
                    status='active'
                    strokeWidth={5}
                    spinning={this.state.loading}
                >
                    <div>
                        <Row className='system-person-search-layout'>
                            <div className='system-person-mrg10'>
                                <label className='system-person-search-span'>
                                    用户名:
                                </label>
                                <Input
                                    id='NurseryData'
                                    className='system-person-forestcalcw4'
                                    value={searchKeyword}
                                    onChange={this.handleChangeKeyword.bind(this)}
                                />
                            </div>
                            <div className='system-person-mrg20'>
                                <Select
                                    placeholder='请选择角色'
                                    value={this.state.searchRoles || []}
                                    onChange={this.changeRoles.bind(this)}
                                    mode='multiple'
                                    style={{ width: '100%' }}
                                >
                                    <OptGroup label='苗圃角色'>
                                        {systemRoles.map(role => {
                                            return (
                                                <Option
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.name}
                                                </Option>
                                            );
                                        })}
                                    </OptGroup>
                                    <OptGroup label='施工角色'>
                                        {projectRoles.map(role => {
                                            return (
                                                <Option
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.name}
                                                </Option>
                                            );
                                        })}
                                    </OptGroup>
                                    <OptGroup label='监理角色'>
                                        {professionRoles.map(role => {
                                            return (
                                                <Option
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.name}
                                                </Option>
                                            );
                                        })}
                                    </OptGroup>
                                    <OptGroup label='业主角色'>
                                        {departmentRoles.map(role => {
                                            return (
                                                <Option
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.name}
                                                </Option>
                                            );
                                        })}
                                    </OptGroup>
                                </Select>
                            </div>
                            <div className='system-person-mrg20'>
                                <Select
                                    placeholder='请选择状态'
                                    value={this.state.searchUserStatus || []}
                                    onChange={this.changeUserStatus.bind(this)}
                                    style={{ width: '100%' }}
                                >
                                    <Option key='已审核' title='已审核' value='true' >已审核</Option>
                                    <Option key='未审核' title='未审核' value='false' >未审核</Option>
                                </Select>
                            </div>
                            {
                                userName === 'admin'
                                    ? (<div className='system-person-mrg20'>
                                        <Select
                                            placeholder='是否全局搜索'
                                            value={this.state.searchOveralSituation}
                                            onChange={this.changeOveralSituation.bind(this)}
                                            style={{ width: '100%' }}
                                        >
                                            <Option key='全局' title='全局' value >全局</Option>
                                            <Option key='部门' title='部门' value={''} >部门</Option>
                                        </Select>
                                    </div>)
                                    : ''
                            }
                        </Row>
                        <Row style={{marginBottom: 10}}>
                            <Col span={2} >
                                <Button
                                    type='primary'
                                    onClick={this.handleTableChange.bind(this, {current: 1})}
                                    style={{
                                        minWidth: 30,
                                        display: 'inline-block',
                                        marginLeft: 20
                                    }}
                                >
                                    查询
                                </Button>
                            </Col>
                            <Col span={20} />
                            <Col span={2} >
                                <Button
                                    type='primary'
                                    onClick={this.clear.bind(this)}
                                    style={{
                                        minWidth: 30,
                                        display: 'inline-block',
                                        marginRight: 20
                                    }}
                                >
                                    清空
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '20px' }}>
                            {this.confirms()}
                        </Row>
                    </div>
                    <Table
                        rowKey='id'
                        size='middle'
                        bordered
                        rowSelection={this.rowSelection}
                        columns={this.columns}
                        dataSource={dataList}
                        rowClassName={this.setBlackListColor.bind(this)}
                        pagination={this.props.getTablePages}
                        onChange={this.handleTableChange.bind(this)}
                    />
                </Spin>
                <Modal visible={showModal} title='审核'
                    onOk={this.handleAudit.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
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
            </div>
        ) : (
            <h3>{'没有权限'}</h3>
        );
    }
    // 搜索条件输入用户名
    handleChangeKeyword (e) {
        this.setState({
            searchKeyword: e.target.value
        });
    }
    // 搜索条件选择角色
    changeRoles (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('roles', value);
        this.setState({
            searchRoles: value
        });
    }
    // 搜索条件选择是否已审核
    changeUserStatus (value) {
        this.setState({
            searchUserStatus: value
        });
    }
    // 搜索条件选择是否全局搜索
    changeOveralSituation (value) {
        this.setState({
            searchOveralSituation: value
        });
    }
    // 表格翻页
    handleTableChange = async (pagination) => {
        const {
            getTablePages,
            actions: {
                getTablePage
            }
        } = this.props;
        const pager = { ...getTablePages };
        pager.current = pagination.current;
        await getTablePage(pagination);
        this.search(pagination.current);
    }
    // 点击查询按钮，进行搜索
    search = async (page) => {
        let text = document.getElementById('NurseryData').value;
        const {
            actions: { getUsers, getTablePage },
            getTreeCodes
        } = this.props;
        const {
            searchRoles,
            searchUserStatus,
            searchOveralSituation
        } = this.state;
        try {
            let postData = {
                page: page,
                keyword: text,
                roles: searchRoles,
                is_active: searchUserStatus
            };
            const userc = JSON.parse(
                window.localStorage.getItem('QH_USER_DATA')
            );
            let userName = userc.username;
            if (!searchOveralSituation || userName !== 'admin') {
                postData.org_code = getTreeCodes;
            }
            this.setState({ loading: true });
            let data = await getUsers({}, postData);
            let pagination = {
                current: page,
                total: data.count
            };
            await getTablePage(pagination);
            this.setState({
                loading: false,
                dataList: data.results,
                pagination
            });
        } catch (e) {
            console.log('search', e);
        }
    }
    // 清空查询条件
    clear = async () => {
        document.getElementById('NurseryData').value = '';
        this.setState({
            searchKeyword: '',
            searchRoles: [],
            searchUserStatus: '',
            searchOveralSituation: ''
        });
        const {
            actions: { getUsers, getTablePage },
            getTablePages
        } = this.props;
        try {
            const pager = { ...getTablePages };
            let postData = {
                org_code: this.props.getTreeCodes,
                page: pager.current || 1
            };
            let rst = await getUsers({}, postData);
            let pagination = {
                current: pager.current || 1,
                total: rst.count
            };
            await getTablePage(pagination);
        } catch (e) {
            console.log('clear', e);
        }
    }
    // 打开审核的弹窗
    toAudit (record) {
        this.setState({
            showModal: true,
            record
        });
    }
    // 表格多选
    rowSelection = {
        onChange: selectedRowKeys => {
            this.setState({ selectedRowKeys: selectedRowKeys });
            this.selectedCodes = selectedRowKeys;
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User' // Column configuration not to be checked
        })
    };
    // 添加用户按钮
    append () {
        const {
            sidebar: { node } = {},
            actions: { changeAdditionField, getSection }
        } = this.props;
        let sectiona = [];
        getSection(sectiona);
        if (node.extra_params.sections) {
            if (node.extra_params.sections instanceof Array) {
                sectiona = node.extra_params.sections;
            } else {
                sectiona = node.extra_params.sections.split(',');
            }
            getSection(sectiona);
        }

        if (node.children && node.children.length > 0) {
            message.warn('请选择最下级组织结构目录');
        } else {
            changeAdditionField('visible', true);
        }
    }
    // 删除用户
    remove () {
        if (this.state.selectedRowKeys.length === 0) {
            message.warn('请选择需要删除的数据！');
        } else {
            this.setState({ loading: true });
            const {
                actions: { deleteUser },
                getTablePages
            } = this.props;
            let actionArr = [];
            this.selectedCodes.map(userId => {
                actionArr.push(deleteUser({ userID: userId }));
            });
            Promise.all(actionArr).then((rst) => {
                let code = 1;
                rst.map(item => {
                    if (!item.code === 1) {
                        code = 0;
                    }
                });
                if (code === 1) {
                    message.success('批量删除成功');
                }
                const pager = { ...getTablePages };
                this.setState({
                    selectedRowKeys: []
                });
                this.search(pager.current || 1);
            });
        }
    }
    // 关闭审核弹窗
    handleCancel () {
        this.setState({
            showModal: false,
            record: null
        });
    }
    // 确认审核
    handleAudit () {
        const { record } = this.state;
        const {
            getTablePages,
            actions: {
                checkUsers
            }
        } = this.props;
        const pager = { ...getTablePages };
        this.props.form.validateFields((err, values) => {
            if (!err) {
                checkUsers({}, {
                    ID: record.id + '',
                    Checker: this.Checker,
                    CheckTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    CheckInfo: values.CheckInfo || '用户信息填写有误',
                    CheckStatus: values.CheckStatus
                }).then(rep => {
                    if (rep.code === 1) {
                        message.success('审核成功');
                        this.props.form.resetFields();
                        this.setState({
                            showModal: false,
                            record: null
                        }, () => {
                            // 刷新列表
                            this.search(pager.current || 1);
                        });
                    } else {
                        message.success('审核失败');
                        this.props.form.resetFields();
                        this.setState({
                            showModal: false,
                            record: null
                        });
                    }
                });
            }
        });
    }
    // 禁用或启用
    disable (user, event) {
        const {
            sidebar: { node } = {},
            actions: { putUser }
        } = this.props;
        let actives;
        if (user.is_black !== 1) {
            if (user.is_active === true) {
                user.is_active = false;
                actives = false;
            } else {
                user.is_active = true;
                actives = true;
            }
        } else {
            message.warn('用户已加入黑名单,不可启用');
            return;
        }
        let groupe = [];
        for (let j = 0; j < user.groups.length; j++) {
            const element = user.groups[j];
            groupe.push(element.id);
        }
        putUser(
            {},
            {
                id: user.id,
                username: user.username,
                email: user.email,
                account: {
                    person_name: user.person_name,
                    person_type: 'C_PER',
                    person_avatar_url: user.person_avatar_url || '',
                    person_signature_url: user.person_signature_url || '',
                    organization: {
                        pk: node.pk,
                        code: user.org_code,
                        obj_type: 'C_ORG',
                        rel_type: 'member',
                        name: user.organization
                    }
                },
                tags: user.tags || [],
                sections: user.sections,
                // groups: [7],
                groups: groupe,
                is_active: actives,
                // black_remark: user.black_remark,
                id_num: user.id_num,
                // is_black: userblack,
                id_image: user.id_image,
                basic_params: {
                    info: {
                        电话: user.person_telephone || '',
                        性别: user.gender || '',
                        技术职称: user.title || '',
                        phone: user.person_telephone || '',
                        sex: user.gender || '',
                        duty: ''
                    }
                },
                extra_params: {},
                title: user.title || ''
            }
        ).then(rst => {
            this.forceUpdate();
        });
    }
    // 用户编辑按钮
    edit (user, event) {
        if (user.is_black === 1 || user.is_black === true) {
            message.warn('用户已加入黑名单,不可编辑');
            return;
        }
        const {
            sidebar: { node } = {},
            actions: { getSection }
        } = this.props;
        let sectiona = [];
        getSection(sectiona);
        if (node.extra_params.sections) {
            if (node.extra_params.sections instanceof Array) {
                sectiona = node.extra_params.sections;
            } else {
                sectiona = node.extra_params.sections.split(',');
            }
            getSection(sectiona);
        }

        event.preventDefault();
        const groups = user.groups || [];
        const {
            actions: { resetAdditionField, getIsActive, getSwitch, changeEditUserVisible }
        } = this.props;
        getIsActive(user.is_active);

        getSwitch(user.is_black);
        changeEditUserVisible(true);
        resetAdditionField({
            roles: groups.map(group => String(group.id)),
            ...user,
            ...user.account
        });
    }
    // 单个用户的删除功能
    del = async (user) => {
        const {
            actions: { deleteUser },
            getTablePages
        } = this.props;
        const pager = { ...getTablePages };
        if (user.id) {
            this.setState({
                loading: true
            });
            let rep = await deleteUser({ userID: user.id });
            if (rep && rep.code && rep.code === 1) {
                message.success('删除用户成功');
                // 更新表格
                await this.search(pager.current || 1);
            } else {
                message.error('删除用户失败');
                this.setState({
                    loading: false
                });
            }
        }
    }
}

export default Form.create()(Users);

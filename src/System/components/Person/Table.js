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
    Spin,
    Notification
} from 'antd';
import Addition from './Addition';
import Edit from './Edit';
import CheckUserModal from './CheckUserModal';
import {getSectionNameBySection} from '_platform/gisAuth';
import { getUser } from '_platform/auth';
import './index.less';
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
            searchRoles: '', // 角色
            selectedRowKeys: [],
            record: null,
            showModal: false,
            dataList: [], // 表格数据用户
            searchKeyword: '', // 用户名称
            searchUserStatus: '', // 状态
            searchOveralSituation: '', // 是否全局搜索，默认不
            additionVisible: false,
            editVisible: false,
            editUserRecord: '',
            queryUserPostData: {}
        };
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
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            key: '2',
            dataIndex: 'User_Name'
        },
        {
            title: '性别',
            key: '3',
            dataIndex: 'Sex',
            render: (text, record) => {
                return record.Sex ? '女' : '男';
            }
        },
        {
            title: '角色',
            width: '15%',
            key: '4',
            render: (text, record) => {
                if (record.Roles && record.Roles instanceof Array && record.Roles.length > 0) {
                    return record.Roles[0].RoleName;
                } else {
                    return '';
                }
            }
        },
        {
            title: '职务',
            key: '5',
            dataIndex: 'Duty'
        },
        {
            title: '手机号码',
            key: '6',
            dataIndex: 'Phone'
        },
        {
            title: '所属部门',
            key: '7',
            dataIndex: 'OrgObj',
            render: (text, record) => {
                if (record.OrgObj && record.OrgObj.OrgName) {
                    return record.OrgObj.OrgName;
                }
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
                if (record && record.Section) {
                    let name = getSectionNameBySection(record.Section, bigTreeList);
                    return name;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '状态',
            key: '9',
            dataIndex: 'Status',
            render: (text, record) => {
                if (record.Status) {
                    return '已审核';
                } else {
                    return '未审核';
                }
            }
        },
        {
            title: '操作',
            key: '10',
            render: (text, record) => {
                const user = getUser();
                let userRoles = user.roles || '';
                // 是否为供应商文书
                let userIsSupplierDocument = false;
                // 是否为施工，监理，业主文书
                // let userIsProjectDocument = true;
                let userIsProjectDocument = false;
                if (userRoles && userRoles.RoleName) {
                    if (userRoles.RoleName === '供应商文书') {
                        userIsSupplierDocument = true;
                    }
                    if (userRoles.RoleName === '业主文书' || userRoles.RoleName === '监理文书' || userRoles.RoleName === '施工文书') {
                        userIsProjectDocument = true;
                    }
                }
                let arr = [];
                if (user && user.username && user.username === 'admin') {
                    if (!record.Status) {
                        arr.push(<a
                            key={4}
                            style={{marginRight: '.5em'}}
                            onClick={this.toAudit.bind(this, record)}
                        >
                            审核
                        </a>);
                    } else if (record.IsBlack) {
                        arr = [];
                    } else if (record.IsForbidden) {
                        arr.push(<a
                            key={3}
                            style={{ marginRight: '.5em', color: 'red' }}
                            onClick={this.handleUserDisabled.bind(this, record)}
                        >
                            启用
                        </a>);
                    } else if (!record.IsForbidden) {
                        arr.push(<a
                            key={3}
                            style={{marginRight: '.5em'}}
                            onClick={this.handleUserDisabled.bind(this, record)}
                        >
                            禁用
                        </a>);
                        arr.push(
                            <a
                                onClick={this.edit.bind(this, record)}
                                key={1}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>
                        );
                    }
                    arr.push(
                        <Popconfirm
                            title='是否要删除用户?'
                            key={2}
                            onConfirm={this.del.bind(this, record)}
                            okText='是'
                            cancelText='否'
                        >
                            <a>删除</a>
                        </Popconfirm>
                    );
                } else if (userIsProjectDocument || userIsSupplierDocument) {
                    if (!record.Status) {
                        arr.push(<a
                            key={4}
                            style={{marginRight: '.5em'}}
                            onClick={this.toAudit.bind(this, record)}
                        >
                            审核
                        </a>);
                    } else if (record.IsBlack) {
                        arr = [];
                        arr.push('/');
                    } else if (!record.IsForbidden) {
                        arr.push(
                            <a
                                onClick={this.edit.bind(this, record)}
                                key={1}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>
                        );
                    }
                } else {
                    arr.push('/');
                }
                return arr;
            }
        }
    ];
    componentDidMount = async () => {
        const {
            actions: {
                getRoles
            },
            platform: {
                roles = []
            }
        } = this.props;
        if (!(roles && roles instanceof Array && roles.length > 0)) {
            await getRoles();
        }
    }
    componentWillReceiveProps (nextProps) {
        const {
            sidebar: { node } = {}
        } = this.props;
        const {
            sidebar: {
                node: nextNode
            } = {}
        } = nextProps;
        if (nextNode && nextNode.ID && nextNode.ID !== (node && node.ID)) {
            // 在重新选择树节点之后，将页数进行修改
            this.setState({
                searchRoles: '',
                searchUserStatus: '',
                searchOveralSituation: '',
                searchKeyword: ''
            });
            document.getElementById('NurseryData').value = '';
        }
        if (nextProps.platform.users) {
            this.setState({
                dataList: nextProps.platform.users
            });
        }
    }
    renderContent () {
        const {
            platform: {
                roles = []
            }
        } = this.props;
        let systemRoles = [];
        let parentRoleType = [];
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0) {
                parentRoleType.push(role);
            }
        });
        console.log('parentRoleType', parentRoleType);
        parentRoleType.map((type) => {
            systemRoles.push({
                name: type && type.RoleName,
                value: roles.filter(role => role.ParentID === type.ID)
            });
        });
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name}>
                    {roless.value.map(role => {
                        return (
                            <Option key={role.ID} value={String(role.ID)}>
                                {role.RoleName}
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        });
        return objs;
    }
    // 人员标段和组织机构标段比较器，如果满足条件返回true
    compare (user, node, eventKey) {
        const {
            orgTreeDataArr = []
        } = this.props;
        try {
            let userRoles = user.roles || '';
            let isClericalStaff = false;
            if (userRoles.RoleName === '施工文书') {
                isClericalStaff = true;
            }
            if (isClericalStaff && (node.topParent === '苗圃基地' || node.topParent === '供应商')) {
                return true;
            }
            if (user.username === 'admin') {
                return true;
            }
            let status = false;
            orgTreeDataArr.map((ID) => {
                if (ID === eventKey) {
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
        const {
            sidebar: { node } = {}
        } = this.props;
        const {
            selectedRowKeys = []
        } = this.state;
        const user = getUser();
        if (user.username === 'admin') {
            return (<div>
                <Col span={3}>
                    <Button
                        type='primary'
                        disabled={!(node && node.ID)}
                        onClick={this.append.bind(this)}>
                            添加用户
                    </Button>
                </Col>
                <Col span={3}>
                    {/* {
                        selectedRowKeys.length > 0
                            ? <Popconfirm
                                title='是否真的要删除选中用户?'
                                onConfirm={this.remove.bind(this)}
                                okText='是'
                                cancelText='否'
                            >
                                <Button type='danger'>
                                    批量删除
                                </Button>
                            </Popconfirm>
                            : <Button type='danger' disabled>
                                批量删除
                            </Button>
                    } */}
                    <Button type='danger' disabled>
                                批量删除
                    </Button>
                </Col>
            </div>);
        } else {
            return (
                <Col span={3}>
                    <Button
                        onClick={this.append.bind(this)}
                        disabled={!(node && node.ID)}
                    >
                        添加用户
                    </Button>
                </Col>
            );
        }
    }
    // 设置拉入黑名单的背景颜色
    setBlackListColor (record, i) {
        if (record && record.IsBlack && (record.IsBlack === 1)) {
            return 'background';
        } else {
            return '';
        }
    }
    render () {
        const {
            sidebar: {
                node = {}
            } = {}
        } = this.props;
        const {
            showModal,
            dataList,
            searchKeyword,
            additionVisible,
            editVisible
        } = this.state;
        // 用户的查看权限
        const user = getUser();
        let username = user.username;
        let permissionStatus = false;
        let dataSource = [];
        if (username === 'admin') {
            permissionStatus = true;
            dataSource = dataList;
        } else {
            if (node && node.ID) {
                dataSource = dataList;
                permissionStatus = this.compare(user, node, node.ID);
            }
        }
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
                            <div className='system-person-mrg20'>
                                <Input
                                    id='NurseryData'
                                    placeholder='请输入关键字'
                                    style={{ width: '100%' }}
                                    value={searchKeyword}
                                    onChange={this.handleChangeKeyword.bind(this)}
                                />
                            </div>
                            <div className='system-person-mrg20'>
                                <Select
                                    placeholder='请选择角色'
                                    value={this.state.searchRoles || undefined}
                                    onChange={this.changeRoles.bind(this)}
                                    style={{ width: '100%' }}
                                >
                                    {this.renderContent()}
                                </Select>
                            </div>
                            <div className='system-person-mrg20'>
                                <Select
                                    placeholder='请选择状态'
                                    value={this.state.searchUserStatus || undefined}
                                    onChange={this.changeUserStatus.bind(this)}
                                    style={{ width: '100%' }}
                                >
                                    <Option key='已审核' title='已审核' value='true' >已审核</Option>
                                    <Option key='未审核' title='未审核' value='false' >未审核</Option>
                                </Select>
                            </div>
                            {
                                username === 'admin'
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
                            <div style={{display: 'inlineBlock'}}>
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
                                <Button
                                    type='primary'
                                    onClick={this.clear.bind(this)}
                                    style={{
                                        minWidth: 30,
                                        display: 'inline-block',
                                        marginLeft: 20
                                    }}
                                >
                                    清空
                                </Button>
                            </div>
                        </Row>
                        <Row style={{ marginBottom: '20px' }}>
                            {this.confirms()}
                        </Row>
                    </div>
                    <Table
                        rowKey='ID'
                        size='middle'
                        bordered
                        rowSelection={this.rowSelection}
                        columns={this.columns}
                        dataSource={dataSource}
                        rowClassName={this.setBlackListColor.bind(this)}
                        pagination={this.props.getTablePages}
                        onChange={this.handleTableChange.bind(this)}
                    />
                </Spin>
                {
                    showModal
                        ? <CheckUserModal
                            handleSuccessCheckModal={this.handleSuccessCheckModal.bind(this)}
                            handleCloseCheckModal={this.handleCloseCheckModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                        : ''
                }
                {
                    additionVisible
                        ? <Addition
                            handleCloseAdditionModal={this.handleCloseAdditionModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                        : ''
                }
                {
                    editVisible
                        ? <Edit
                            handleCloseEditModal={this.handleCloseEditModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                        : ''}
            </div>
        ) : (
            <h3>{'没有权限'}</h3>
        );
    }
    // 取消审核窗口
    handleCloseCheckModal = () => {
        this.setState({
            record: '',
            showModal: false
        });
    }
    // 审核成功关闭审核窗口
    handleSuccessCheckModal = () => {
        const {
            getTablePages
        } = this.props;
        const pager = { ...getTablePages };
        this.setState({
            record: '',
            showModal: false
        }, async () => {
            // 刷新列表
            this.search(pager.current || 1);
        });
    }
    // 关闭新增人员窗口
    handleCloseAdditionModal = () => {
        this.setState({
            additionVisible: false
        });
    }
    // 关闭编辑人员窗口
    handleCloseEditModal = () => {
        this.setState({
            editVisible: false,
            editUserRecord: ''
        });
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
            actions: {
                changeAdditionField
            }
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
        const {
            actions: {
                getUsers,
                getTablePage
            },
            sidebar: {
                node = {}
            }
        } = this.props;
        const {
            searchRoles,
            searchUserStatus,
            searchOveralSituation
        } = this.state;
        try {
            let text = document.getElementById('NurseryData').value;
            let postData = {
                page: page,
                size: 10,
                keyword: text,
                role: searchRoles,
                Status: searchUserStatus
            };
            if (!searchOveralSituation) {
                if (node && node.ID) {
                    postData.org = (node && node.ID) || '';
                } else {
                    Notification.error({
                        message: '请先选择部门'
                    });
                    return;
                }
            }
            console.log('postData', postData);
            this.setState({ loading: true });
            let data = await getUsers({}, postData);
            if (data && data.code && data.code === 200) {
                let pagination = {
                    current: page,
                    total: data && data.pageinfo && data.pageinfo.total
                };
                await getTablePage(pagination);
                this.setState({
                    loading: false,
                    dataList: data.content,
                    queryUserPostData: postData
                });
            } else {
                message.warning('获取用户失败，请重新获取');
                this.setState({
                    loading: false,
                    dataList: [],
                    queryUserPostData: postData
                });
                return;
            }
        } catch (e) {
            console.log('search', e);
        }
    }
    // 清空查询条件
    clear = async () => {
        const {
            actions: {
                getUsers,
                getTablePage
            },
            getTablePages,
            sidebar: {
                node = {}
            }
        } = this.props;
        const {
            searchOveralSituation
        } = this.state;
        try {
            if (!searchOveralSituation) {
                if (!(node && node.ID)) {
                    Notification.error({
                        message: '请先选择部门'
                    });
                    return;
                }
            }
            document.getElementById('NurseryData').value = '';
            this.setState({
                searchKeyword: '',
                searchRoles: '',
                searchUserStatus: '',
                searchOveralSituation: ''
            });
            this.setState({
                loading: true
            });

            const pager = { ...getTablePages };
            let postData = {
                org: (node && node.ID) || '',
                page: pager.current || 1,
                size: 10
            };
            let rst = await getUsers({}, postData);
            if (rst && rst.code && rst.code === 200) {
                let pagination = {
                    current: pager.current || 1,
                    total: rst && rst.pageinfo && rst.pageinfo.total
                };
                await getTablePage(pagination);
                this.setState({
                    loading: false,
                    dataList: rst.content,
                    queryUserPostData: postData
                });
            } else {
                message.warning('获取用户失败，请重新获取');
                this.setState({
                    loading: false,
                    dataList: [],
                    queryUserPostData: postData
                });
                return;
            }
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
        onChange: (selectedRowKeys) => {
            this.setState({
                selectedRowKeys: selectedRowKeys
            });
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User' // Column configuration not to be checked
        })
    };
    // 删除用户
    remove = async () => {
        const {
            selectedRowKeys = []
        } = this.state;
        if (selectedRowKeys && selectedRowKeys instanceof Array) {
            if (selectedRowKeys.length === 0) {
                message.warn('请选择需要删除的数据！');
            } else {
                this.setState({ loading: true });
                const {
                    actions: {
                        deleteForestUser
                    },
                    getTablePages
                } = this.props;
                let actionArr = [];
                selectedRowKeys.map(userId => {
                    actionArr.push(deleteForestUser({ userID: userId }));
                });
                let rst = await Promise.all(actionArr);
                let code = 1;
                rst.map((item, index) => {
                    if (!(item && item.code && item.code === 1)) {
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
                await this.search(pager.current || 1);
            }
        }
    }
    // 禁用或启用
    handleUserDisabled = async (user, event) => {
        const {
            actions: {
                postForestUserBlackDisabled
            },
            getTablePages
        } = this.props;
        try {
            this.setState({ loading: true });
            let isActive = true;
            let changeName = '';
            console.log('user', user);
            if (user.IsForbidden === 1) {
                isActive = true;
                changeName = '启用';
            } else if (user.IsForbidden === 0) {
                isActive = false;
                changeName = '禁用';
            } else {
                this.setState({ loading: false });
                message.error(`此用户状态不能更改`);
                return;
            }
            let postData = {
                id: user.ID + '',
                is_active: isActive
            };
            let data = await postForestUserBlackDisabled({}, postData);
            if (data && data.code && data.code === 1) {
                message.success(`用户${changeName}成功`);
                const pager = { ...getTablePages };
                this.setState({ loading: false });
                await this.search(pager.current || 1);
            } else {
                message.error(`用户${changeName}失败`);
                this.setState({ loading: false });
            }
        } catch (e) {
            console.log('handleUserDisabled', e);
        }
    }
    // 添加用户按钮
    append () {
        const {
            sidebar: { node } = {}
        } = this.props;
        if (node && node.ID) {
            if (node.children && node.children.length > 0) {
                message.warn('请选择最下级组织结构目录');
            } else {
                this.setState({
                    additionVisible: true
                });
            }
        }
    }
    // 用户编辑按钮
    edit (user) {
        if (user.IsBlack === 1) {
            message.warn('用户已加入黑名单,不可编辑');
            return;
        }
        if (user && user.ID) {
            this.setState({
                editVisible: true,
                editUserRecord: user
            });
        } else {
            message.warn('当前用户不可编辑');
        }
    }
    // 单个用户的删除功能
    del = async (user) => {
        const {
            actions: {
                deleteForestUser
            },
            getTablePages
        } = this.props;
        const pager = { ...getTablePages };
        if (user && user.ID) {
            this.setState({
                loading: true
            });
            let rep = await deleteForestUser({ userID: user.ID });
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

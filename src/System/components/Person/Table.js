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
    Progress,
    Modal,
    Form,
    Spin
} from 'antd';
import { PROJECT_UNITS } from './../../../_platform/api';
import { formItemLayout } from '../common';
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
            tag: null,
            searchList: [],
            loading: false,
            percent: 0,
            edit: true,
            roles: [],
            selectedRowKeys: [],
            btn: '',
            fristText: '',
            fristRoles: [],
            TreeCodes: '',
            isBtn: true,
            objPage: '',
            objPages: '',
            record: null,
            showModal: false,
            dataList: [], // 表格数据用户
            page: 1,
            total: 0
        };
        this.handleAudit = this.handleAudit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    componentDidMount () {
        this.Checker = getUser().id; // 登陆用户
    }
    componentWillReceiveProps (nextProps) {
        this.setState({ TreeCodes: this.props.getTreeCodes });
        if (this.state.TreeCodes !== this.props.getTreeCodes) {
            this.setState({ roles: [] });
        }
        if (nextProps.platform.users) {
            this.setState({
                dataList: nextProps.platform.users
            });
        }
        if (nextProps.getTablePages) {
            this.setState({
                page: nextProps.getTablePages.current,
                total: nextProps.getTablePages.total
            });
        }
    }
    changeRoles (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('roles', value);
        this.setState({
            roles: value
        });
    }
    changeSections (value) {
        this.setState({ sections: value });
    }

    changeTagss (value) {
        this.setState({ tag: value });
    }
    initopthins (list) {
        const ops = [];
        for (let i = 0; i < list.length; i++) {
            ops.push(<Option key={i}>{list[i].NurseryName}</Option>);
        }
        return ops;
    }
    // 人员标段和组织机构标段比较器，如果满足条件返回true
    compare (user, l1, s, node) {
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
        if (l1 == undefined || s == undefined) {
            return false;
        }

        if (s.startsWith(l1)) {
            return true;
        }
    }

    search () {
        let text = document.getElementById('NurseryData').value;
        const {
            actions: { getUsers, getTablePage, getIsBtn }
        } = this.props;
        if (text || (this.state.roles && this.state.roles.length > 0)) {
            this.setState({ loading: true });
            getUsers(
                {},
                {
                    org_code: this.props.getTreeCodes,
                    keyword: text,
                    roles: this.state.roles,
                    page: 1
                }
            ).then(items => {
                let pagination = {
                    current: 1,
                    total: items.count
                };
                getTablePage(pagination);
                this.setState({
                    btn: true,
                    fristText: text,
                    fristRoles: this.state.roles,
                    isBtn: false,
                    loading: false
                });
                getIsBtn(false);
            });
        } else {
            getUsers(
                {},
                {
                    org_code: this.props.getTreeCodes,
                    page: this.state.objPages || 1
                }
            ).then(e => {
                let pagination = {
                    current: this.state.objPages || 1,
                    total: e.count
                };
                getTablePage(pagination);
                this.setState({
                    btn: false,
                    fristText: '',
                    fristRoles: [],
                    isBtn: true
                });
                getIsBtn(true);
            });
        }
    }

    clear () {
        document.getElementById('NurseryData').value = '';
        this.setState({
            roles: []
        });
        const {
            actions: { getUsers, getTablePage, getIsBtn }
        } = this.props;

        getUsers(
            {},
            {
                org_code: this.props.getTreeCodes,
                page: this.state.objPages || 1
            }
        ).then(e => {
            let pagination = {
                current: this.state.objPages || 1,
                total: e.count
            };
            getTablePage(pagination);
            this.setState({
                btn: false,
                fristText: '',
                fristRoles: [],
                isBtn: true
            });
            getIsBtn(true);
        });
    }

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
    query (value) {
        if (value && value.tags) {
            const { tags = [] } = this.props;
            let array = value.tags || [];
            let defaultNurse = [];
            array.map(item => {
                tags.map(rst => {
                    if (rst && rst.ID) {
                        if (rst.ID.toString() === item) {
                            defaultNurse.push(
                                rst.NurseryName + '-' + rst.Factory
                            );
                        }
                    }
                });
            });
            return defaultNurse;
        }
    }
    setColor (record, i) {
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
        const { showModal, dataList, page, total } = this.state;
        const systemRoles = roles.filter(role => role.grouptype === 0);
        const projectRoles = roles.filter(role => role.grouptype === 1);
        const professionRoles = roles.filter(role => role.grouptype === 2);
        const departmentRoles = roles.filter(role => role.grouptype === 3);
        const columns = [
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
                    let str = '';
                    PROJECT_UNITS.map(item => {
                        item.units.map(row => {
                            if (record.account && row.code === record.account.sections[0]) {
                                str = row.value;
                            }
                        });
                    });
                    return str;
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

                    // 供应商文书权限
                    if (userc.groups.length > 0 && userc.groups[0]['id'] === 64) {
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
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let is_active = false;
        if (user.is_superuser) {
            is_active = true;
        } else {
            if (code) {
                const ucodes = user.account.org_code.split('_');
                if (ucodes.length > 5) {
                    ucodes.pop();
                    const codeu = ucodes.join();
                    const ucode = codeu.replace(/,/g, '_');
                    is_active = this.compare(user, ucode, code, node);
                } else {
                    const ucode = user.account.org_code.substring(0, 9);
                    is_active = this.compare(user, ucode, code, node);
                }
            }
        }
        return is_active ? (
            <div>
                <Spin
                    tip='加载中'
                    percent={this.state.percent}
                    status='active'
                    strokeWidth={5}
                    spinning={this.state.loading}
                >
                    <div>
                        <Row style={{ marginBottom: '20px' }}>
                            <Col span={9}>
                                <label
                                    style={{
                                        minWidth: 60,
                                        display: 'inline-block'
                                    }}
                                >
                                    用户名:
                                </label>
                                <Input
                                    id='NurseryData'
                                    className='search_input'
                                />
                            </Col>
                            <Col span={7}>
                                <Select
                                    placeholder='请选择角色'
                                    value={this.state.roles || []}
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
                            </Col>
                            <Col span={4}>
                                <Button
                                    type='primary'
                                    onClick={this.search.bind(this)}
                                    style={{
                                        minWidth: 30,
                                        display: 'inline-block',
                                        marginLeft: 20
                                    }}
                                >
                                    查询
                                </Button>
                            </Col>
                            <Col span={4}>
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
                        columns={columns}
                        dataSource={dataList}
                        rowClassName={this.setColor.bind(this)}
                        pagination={{current: page, total: total}}
                        onChange={this.changePage.bind(this)}
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.props.getTreeModals
                        }}
                    />
                </Spin>
                <Modal visible={showModal} title='审核'
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
            </div>
        ) : (
            <h3>{'没有权限'}</h3>
        );
    }
    toAudit (record) {
        this.setState({
            showModal: true,
            record
        });
    }

    async changePage (obj) {
        let text = document.getElementById('NurseryData').value;
        const {
            actions: { getUsers, getTreeModal }
        } = this.props;
        if (this.props.getIsBtns) {
            getUsers(
                {},
                { org_code: this.props.getTreeCodes, page: obj.current }
            ).then(e => {
                this.setState({
                    objPages: obj.current,
                    page: obj.current,
                    total: e.count
                });
            });
        } else {
            getTreeModal(true);
            getUsers(
                {},
                {
                    org_code: this.props.getTreeCodes,
                    keyword: text,
                    roles: this.state.roles,
                    page: obj.current
                }
            ).then(e => {
                this.setState({
                    objPages: obj.current,
                    page: obj.current,
                    total: e.count
                });
                getTreeModal(false);
            });
        }
    }
    saves () {
        const {
            platform: { users = [] }
        } = this.props;
        const {
            // addition = {},
            sidebar: { node } = {},
            actions: { putUser }
        } = this.props;
        // const roles = addition.roles || [];
        // if (this.selectedCodes == undefined) {
        // 	message.warn('请您选择需要添加角色的人');
        // 	return
        // }
        for (let i = 0; i < users.length; i++) {
            const element = users[i];
            for (let j = 0; j < this.selectedCodes.length; j++) {
                const selectedCode = this.selectedCodes[j];
                if (element.id === selectedCode) {
                    putUser(
                        {},
                        {
                            /*						username: element.username,
												email: element.email,
												// password: addition.password, // 密码不能变？信息中没有密码
												account: {
													person_name: element.person_name,
													person_type: "C_PER",
													person_avatar_url: "",
													// organization: {
													// 	pk: '229356816973',
													// 	code: "ORG_02_31_02",
													// 	obj_type: "C_ORG",
													// 	rel_type: "member",
													// 	name: '施工队'
													// },
												},
												tags: [{ id: tags[this.state.tag].ID, name: tags[this.state.tag].NurseryName }],
												//sections: this.state.sections,
												// groups: roles.map(role => +role),
												is_active: true,
												basic_params: {
													info: {
														'电话': element.person_telephone || '',
														'性别': element.gender || '',
														'技术职称': element.title || '',
														'phone': element.person_telephone || '',
														'sex': element.gender || '',
														'duty': ''
													}
												},
												extra_params: {},
												title: element.title || '' */

                            id: element.id,
                            username: element.username,
                            email: element.email,
                            // password: addition.password, // 密码不能变？信息中没有密码
                            account: {
                                person_name: element.person_name,
                                person_type: 'C_PER',
                                person_avatar_url: '',
                                organization: {
                                    pk: node.pk,
                                    code: element.org_code,
                                    obj_type: 'C_ORG',
                                    rel_type: 'member',
                                    name: element.organization
                                }
                            },
                            tags: element.tags,
                            sections: element.sections,
                            // groups: [7],
                            groups: [1],
                            is_active: true,
                            id_num: '',
                            is_black: 0,
                            id_image: [],
                            basic_params: {
                                info: {
                                    电话: element.person_telephone || '',
                                    性别: element.gender || '',
                                    技术职称: element.title || '',
                                    phone: element.person_telephone || '',
                                    sex: element.gender || '',
                                    duty: ''
                                }
                            },
                            extra_params: {},
                            title: element.title || ''
                        }
                    ).then(rst => {
                        // if (rst.id) {
                        // 	clearAdditionField();
                        // 	console.log("element", element)
                        // 	// console.log("Addition",Addition)
                        // 	// const codes = element.collect(node);
                        // 	// console.log("codes", codes)
                        // 	// getUsers({}, { org_code: element.org_code });
                        // } else {
                        // 	console.log("111")
                        // 	message.warn('服务器端报错！');
                        // }
                    });
                }
            }
            // const selectedCodes=this.selectedCodes[0] || ''
            // return;
        }
    }

    rowSelection = {
        onChange: selectedRowKeys => {
            console.log('selectedRowKeys', selectedRowKeys);
            this.setState({ selectedRowKeys: selectedRowKeys });
            this.selectedCodes = selectedRowKeys;
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User' // Column configuration not to be checked
        })
    };
    changeTags (record, value) {
        record.tags = value;
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('tags', value);
    }

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

    remove () {
        console.log('this.state.selectedRowKeys', this.state.selectedRowKeys);
        if (this.state.selectedRowKeys.length === 0) {
            message.warn('请选择需要删除的数据！');
        } else {
            this.setState({ loading: true });
            const {
                sidebar: { node } = {},
                actions: { deleteUser, getUsers }
            } = this.props;
            const codes = Users.collect(node);
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
                getUsers({}, { org_code: codes, page: this.state.page }).then((items) => {
                    this.setState({
                        loading: false,
                        dataList: items.results,
                        selectedRowKeys: []
                    });
                });
            });
        }
    }
    black (user, event) {
        const {
            sidebar: { node } = {},
            actions: { putUser }
        } = this.props;
        let blacks;
        let actives;
        if (user.is_black === 0) {
            user.is_black = 1;
            blacks = 1;
            user.is_active = false;
            actives = false;
        } else {
            user.is_black = 0;
            blacks = 0;
            user.is_active = true;
            actives = true;
        }
        // let actives
        // if (user.is_active == true) {
        // 	user.is_active = false
        // 	actives = false
        // } else {
        // 	user.is_active = true
        // 	actives = true
        // }

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
                // password: addition.password, // 密码不能变？信息中没有密码
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
                tags: user.tags,
                sections: user.sections,
                // groups: [7],
                groups: groupe,
                is_active: actives,
                black_remark: user.black_remark,
                id_num: user.id_num,
                is_black: blacks,
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
    handleCancel () {
        this.setState({
            showModal: false,
            record: null
        });
    }
    handleAudit () {
        const { record } = this.state;
        const {
            sidebar: { node } = {},
            actions: { putUser }
        } = this.props;
        let groupe = [];
        for (let j = 0; j < record.groups.length; j++) {
            const element = record.groups[j];
            groupe.push(element.id);
        }
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let is_active = values['CheckStatus'] === 1;
            const param = {
                id: record.id,
                username: record.username,
                email: record.email,
                account: {
                    person_name: record.person_name,
                    person_type: 'C_PER',
                    person_avatar_url: record.person_avatar_url || '',
                    person_signature_url: record.person_signature_url || '',
                    organization: {
                        pk: node.pk,
                        code: record.org_code,
                        obj_type: 'C_ORG',
                        rel_type: 'member',
                        name: record.organization
                    }
                },
                tags: record.tags,
                sections: record.sections,
                groups: groupe,
                is_active,
                id_num: record.id_num,
                id_image: record.id_image,
                basic_params: {
                    info: {
                        电话: record.person_telephone || '',
                        性别: record.gender || '',
                        技术职称: record.title || '',
                        phone: record.person_telephone || '',
                        sex: record.gender || '',
                        duty: ''
                    }
                },
                extra_params: {},
                title: record.title || ''
            };
            putUser({}, param).then((rep) => {
                if (rep.code === 1) {
                    this.setState({
                        showModal: false,
                        record: null
                    });
                    // 刷新列表
                    this.clear();
                    message.success('审核成功');
                }
            });
        });
    }
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
        // let userblack;
        // if (user.is_black === true) {
        //     userblack = 1;
        // } else if (user.is_black === false) {
        //     userblack = 0;
        // } else {
        //     userblack = user.is_black;
        // }
        putUser(
            {},
            {
                id: user.id,
                username: user.username,
                email: user.email,
                // password: addition.password, // 密码不能变？信息中没有密码
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
                tags: user.tags,
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

    edit (user, event) {
        if (user.is_black === 1 || user.is_black === true) {
            message.warn('用户已加入黑名单,不可编辑');
            return;
        }

        event.preventDefault();
        const groups = user.groups || [];
        const {
            actions: { resetAdditionField, getIsActive, getSwitch }
        } = this.props;
        getIsActive(user.is_active);

        // if (node.children && node.children.length > 0) {
        // 	message.warn('请选择最下级组织结构目录');

        // } else {

        // }
        getSwitch(user.is_black);
        resetAdditionField({
            visible: true,
            roles: groups.map(group => String(group.id)),
            ...user
            // ...account,
        });
    }

    del (user) {
        const {
            sidebar: { node } = {},
            actions: { deleteUser, getUsers, getForestAllUsersData }
        } = this.props;
        const codes = Users.collect(node);
        let text = document.getElementById('NurseryData').value;
        if (user.id) {
            deleteUser({ userID: user.id }).then(rep => {
                if (rep.code === 1) {
                    message.success('删除用户成功');
                }
                getForestAllUsersData().then((userData) => {
                    if (userData && userData.content) {
                        window.localStorage.removeItem('LZ_TOTAL_USER_DATA');
                        let content = userData.content;
                        window.localStorage.setItem(
                            'LZ_TOTAL_USER_DATA',
                            JSON.stringify(content)
                        );
                    }
                });
                if (this.props.getIsBtns) {
                    getUsers({}, { org_code: codes, page: this.state.page }).then(es => {
                        this.setState({
                            loading: false,
                            dataList: es.results
                        });
                    });
                } else {
                    getUsers(
                        {},
                        {
                            org_code: this.props.getTreeCodes,
                            keyword: text,
                            roles: this.state.roles
                        }
                    ).then(items => {
                        if (items && items.length === 0) {
                            let currents;
                            if (this.props.getTablePages.current === 0) {
                                currents = 1;
                            } else {
                                currents = this.props.getTablePages.current;
                            }
                            this.setState({
                                loading: false,
                                objPages: currents,
                                page: currents,
                                total: 0
                            });
                        } else {
                            this.setState({
                                loading: false,
                                page: 1,
                                total: items.length + 1
                            });
                        }
                    });
                }
            });
        }
    }

    static collect = (node = {}) => {
        const { children = [], code } = node;
        let rst = [];
        rst.push(code);
        children.forEach(n => {
            const codes = Users.collect(n);
            rst = rst.concat(codes);
        });
        return rst;
    };
}

export default Form.create()(Users);

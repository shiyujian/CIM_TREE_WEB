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
    Spin
} from 'antd';
import { PROJECT_UNITS } from './../../../_platform/api';
import './index.less';
const { Option, OptGroup } = Select;

// class Users extends Component {

export default class Users extends Component {
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
            objPages: ''
        };
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    changeRoles (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('roles', value);
        console.log('value', value);
        this.setState({
            roles: value
        });
    }
    changeSections (value) {
        console.log('value', value);
        this.setState({ sections: value });
    }

    changeTagss (value) {
        console.log('value', value);
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
    compare (user, l1, s) {
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
        console.log('text', text);
        console.log('this.state.roles', this.state.roles);
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
                console.log('items111111', items);
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
    sectiontitle (record) {
        let sectione = [];
        for (let i = 0; i < PROJECT_UNITS.length; i++) {
            const item = PROJECT_UNITS[i];
            for (let j = 0; j < item.units.length; j++) {
                const element = item.units[j];
                for (let z = 0; z < record.sections.length; z++) {
                    const items = record.sections[z];
                    if (items === element.code) {
                        sectione.push(element.value);
                    }
                }
            }
        }
        return sectione;
    }
    setColor (record, i) {
        // console.log("users",users)
        if (record.is_black === 1 || record.is_black === true) {
            return 'background';
        } else {
            return '';
        }
    }
    render () {
        const {
            platform: { roles = [] },
            sidebar: {
                node: { code } = {}
            } = {}
        } = this.props;
        const systemRoles = roles.filter(role => role.grouptype === 0);
        const projectRoles = roles.filter(role => role.grouptype === 1);
        const professionRoles = roles.filter(role => role.grouptype === 2);
        const departmentRoles = roles.filter(role => role.grouptype === 3);

        const {
            platform: { users = [] }
        } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: index => {
                    return index + 1;
                }
            },
            {
                title: '姓名',
                dataIndex: 'person_name'
            },
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '性别',
                dataIndex: 'gender'
            },
            {
                title: '角色',
                width: '15%',
                render: user => {
                    if (user.roles) {
                        const {
                            platform: { roles = [] }
                        } = this.props;
                        let add = [];
                        for (let i = 0; i < user.roles.length; i++) {
                            for (let j = 0; j < roles.length; j++) {
                                if (user.roles[i] === roles[j].id) {
                                    add.push(roles[j].name);
                                }
                            }
                        }
                        return add.join('、');
                    } else {
                        const { groups = [] } = user || {};
                        const roles = groups.map(group => group.name);
                        return roles.join('、');
                    }
                }
            },
            {
                title: '职务',
                dataIndex: 'title'
            },
            {
                title: '手机号码',
                dataIndex: 'person_telephone'
            },
            // , {
            // 	title: '邮箱',
            // 	dataIndex: 'email',
            // }
            {
                title: '所属部门',
                dataIndex: 'organization'
            },
            {
                title: '标段',
                // dataIndex: "sections",
                // key: 'Sections',
                render: (text, record, index) => {
                    let sectiones = this.sectiontitle(record);
                    return sectiones.join();
                }
            },
            // , {
            // 	title: '苗圃',
            // 	// dataIndex: "tags",
            // 	// key: 'tags',
            // 	render: (text, record, index) => {
            // 		let defaultNurse = this.query(record)
            // 		return defaultNurse.join()
            // 	}
            // }
            // , {
            // 	title: '电子签章',
            // 	dataIndex: 'relative_signature_url',
            // 	render: (sign) => {
            // 		return <img width={30} src={`${sign}`} alt="" />;
            // 	}
            // }, {
            // 	title: '头像',
            // 	dataIndex: 'relative_avatar_url',
            // 	render: (avatar) => {
            // 		return <img width={20} src={`${avatar}`} alt="" />;
            // 	}
            // }
            {
                title: '操作',
                render: user => {
                    const userc = JSON.parse(
                        window.localStorage.getItem('QH_USER_DATA')
                    );
                    if (userc.is_superuser === true) {
                        let add = ''; // 是否禁用启用
                        let acc = ''; // 是否禁用启用颜色
                        // let aee = ''; // 是否是黑名单
                        // let att = ''; // 是否是黑名单颜色
                        if (user.is_active === true) {
                            add = '禁用';
                            acc = '';
                        } else {
                            add = '启用';
                            acc = 'red';
                        }
                        // if(user.is_black== 1){
                        // 	att = 'red'
                        // 	 aee = '取消黑名单'
                        // }else if(user.is_black== 0){
                        // 	 aee = '加入黑名单'
                        // 	 att=''
                        // }
                        return [
                            <a
                                onClick={this.edit.bind(this, user)}
                                key={1}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>,
                            <Popconfirm
                                title='是否真的要删除用户?'
                                key={2}
                                onConfirm={this.del.bind(this, user)}
                                okText='是'
                                cancelText='否'
                            >
                                <a>删除</a>
                            </Popconfirm>,
                            <a
                                key={3}
                                style={{ marginLeft: '.5em', color: acc }}
                                onClick={this.disable.bind(this, user)}
                            >
                                {add}
                            </a>
                            // <a style={{ marginLeft: '.5em', color: att  }} onClick={this.black.bind(this, user)} >{aee}</a>
                        ];
                    } else {
                        return (
                            <a
                                onClick={this.edit.bind(this, user)}
                                key={4}
                                style={{ marginRight: '.5em' }}
                            >
                                编辑
                            </a>
                        );
                    }
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
                    is_active = this.compare(user, ucode, code);
                } else {
                    const ucode = user.account.org_code.substring(0, 9);
                    is_active = this.compare(user, ucode, code);
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
                        dataSource={users}
                        rowClassName={this.setColor.bind(this)}
                        pagination={this.props.getTablePages}
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
            </div>
        ) : (
            <h3>{'没有权限'}</h3>
        );
    }
    componentWillReceiveProps (nextProps) {
        this.setState({ TreeCodes: this.props.getTreeCodes });
        if (this.state.TreeCodes !== this.props.getTreeCodes) {
            this.setState({ roles: [] });
        }
    }
    async changePage (obj) {
        let text = document.getElementById('NurseryData').value;
        const {
            actions: { getUsers, getTreeModal, getTablePage }
        } = this.props;
        if (this.props.getIsBtns) {
            getTreeModal(true);
            getUsers(
                {},
                { org_code: this.props.getTreeCodes, page: obj.current }
            ).then(e => {
                let pagination = {
                    current: obj.current,
                    total: e.count
                };
                this.setState({ objPages: obj.current });
                getTablePage(pagination);
                getTreeModal(false);
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
                let pagination = {
                    current: obj.current,
                    total: e.count
                };

                this.setState({ objPage: obj.current });
                getTablePage(pagination);
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
                actions: { deleteUser, getUsers, getTablePage }
            } = this.props;
            const codes = Users.collect(node);
            let actionArr = [];
            this.selectedCodes.map(userId => {
                actionArr.push(deleteUser({ userID: userId }));
            });
            Promise.all(actionArr).then((rst) => {
                getUsers({}, { org_code: codes, page: 1 }).then((items) => {
                    console.log('wwwwwwwwwwwwww');
                    let pagination = {
                        current: 1,
                        total: items.count
                    };
                    getTablePage(pagination);
                    this.setState({ loading: false, selectedRowKeys: [] });
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
        console.log('groupe', groupe, user);
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
            // console.log("rst", rst)
            // console.log("333333333", JSON.parse(rst.msg))
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
            console.log('rst', rst);
            console.log('333333333', JSON.parse(rst.msg));
        });
    }

    edit (user, event) {
        console.log('user', user);
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
        // 	// console.log("user", user)
        // 	// console.log("resetAdditionField", resetAdditionField)

        // }
        getSwitch(user.is_black);
        console.log('11111111111111', user.is_black);
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
            platform: { users = [] },
            actions: { deleteUser, getUsers, getTablePage, getAllUsersData }
        } = this.props;
        const codes = Users.collect(node);
        // 		const usera = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        // console.log("usera",usera)
        // 		let is_active = false
        // 		if (usera.is_superuser) {

        // 		}
        let text = document.getElementById('NurseryData').value;
        let pages;
        if (users && users.length === 1) {
            pages = this.props.getTablePages.current - 1;
        } else {
            pages = this.props.getTablePages.current;
        }
        if (user.id) {
            console.log(
                'this.props.getTablePages.current',
                this.props.getTablePages.current
            );
            deleteUser({ userID: user.id }).then(as => {
                console.log('as', as);
                getAllUsersData().then((userData) => {
                    console.log('userData', userData);
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
                    getUsers({}, { org_code: codes, page: pages }).then(es => {
                        console.log('es', es);
                        let pagination = {
                            current: this.props.getTablePages.current,
                            total: es.count
                        };
                        getTablePage(pagination);

                        this.setState({ loading: false });
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
                        console.log('items', items);

                        if (items && items.length === 0) {
                            let pagination = {
                                current: 0,
                                total: 0
                            };
                            getTablePage(pagination);

                            let currents;
                            if (this.props.getTablePages.current === 0) {
                                currents = 1;
                            } else {
                                currents = this.props.getTablePages.current;
                            }
                            this.setState({
                                loading: false,
                                objPages: currents
                            });
                        } else {
                            let pagination = {
                                current: 1,
                                total: items.length + 1
                            };
                            getTablePage(pagination);
                            this.setState({ loading: false });
                        }

                        // this.setState({  loading: false })
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
// export default Form.create()(Users)

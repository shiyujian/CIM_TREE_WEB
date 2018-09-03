import React, { Component } from 'react';
import { Modal, Table, Checkbox, Spin, Input, Row, Col } from 'antd';

export default class Member extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            orgSet: null,
            searchList: [],
            search: false,
            searchUser: [],
            objIndex: {},
            personIndex: {},
            checkeds: ''
        };
    }
    search (value) {
        let searchList = [];
        const users = this.props.getUserList || [];
        users.map(item => {
            if (item.username) {
                if (value && item.username.indexOf(value) > -1) {
                    searchList.push(item);
                }
            }
        });
        if (value) {
            this.setState({
                searchList: searchList,
                search: true
            });
        } else {
            this.setState({
                searchList: users,
                search: false
            });
        }
    }
    render () {
        const Search = Input.Search;
        const { searchList } = this.state;
        const {
            member: { visible, role = {} } = {}
        } = this.props;
        const title = `关联用户 | ${role ? role.name : ''}`;
        let { platform: { users = [] } = {} } = this.props;
        const infoList = this.props.getUserFristDatas || {};

        const results = infoList.results || [];
        let users2 = results.map(ele => {
            return { ...ele };
        });
        const getUserList = this.props.getUserList || [];
        // console.log("111111111",getUserList)
        let users1 = getUserList.map((ele, i) => {
            ele.index = i + 1;
            return { ...ele };
        });
        let dataSource = [];
        if (this.state.search === true) {
            dataSource = searchList;
        } else {
            dataSource = users1;
        }
        console.log('this.state.searchUser', this.state.searchUser);
        console.log('users2', users2);

        this.state.orgSet &&
            users2.forEach(ele => {
                if (this.state.orgSet[ele.person_id]) {
                    ele.organization = this.state.orgSet[ele.person_id];
                }
            });
        return (
            <Modal
                title={title}
                style={{ top: 0 }}
                visible={visible}
                width='90%'
                onOk={this.ok.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <Spin spinning={this.props.getUserLoadings}>
                    {/* <div style={{ overflow: "scroll", height: "600px" }}> */}
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={6}>
                            <h2 style={{ marginLeft: '10px' }}>
                                已经关联的用户
                            </h2>
                        </Col>
                        <Col span={6}>
                            <Search
                                placeholder='请输入搜索的用户名'
                                style={{
                                    width: '200px',
                                    margin: '0 0 0 5px'
                                }}
                                onSearch={value => {
                                    this.search.bind(this, value)();
                                }}
                            />
                        </Col>
                    </Row>
                    <Table
                        bordered
                        rowKey='id'
                        size='small'
                        columns={this.columns1}
                        dataSource={dataSource}
                    />

                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={6}>
                            <h2 style={{ marginLeft: '10px' }}>所有用户</h2>
                        </Col>
                        <Col span={6}>
                            <Search
                                placeholder='请输入搜索的用户名'
                                style={{
                                    width: '200px',
                                    margin: '0 0 0 5px'
                                }}
                                onSearch={value => {
                                    this.searchByName.bind(this, value)();
                                }}
                            />
                        </Col>
                    </Row>
                    <Table
                        bordered
                        rowKey='id'
                        size='small'
                        columns={this.columns}
                        dataSource={
                            this.state.searchUser
                                ? this.state.searchUser.length > 0
                                    ? this.state.searchUser
                                    : users2
                                : users2
                        }
                        onChange={this.changePage.bind(this)}
                        pagination={
                            this.state.searchUser
                                ? this.state.searchUser.length > 0
                                    ? { current: 1, total: 1 }
                                    : this.props.getUserFristPages
                                : this.props.getUserFristPages
                        }
                    />
                    {/* </div> */}
                </Spin>
            </Modal>
        );
    }
    searchByName (value) {
        const {
            actions: { getUsers }
        } = this.props;
        if (value) {
            getUsers({}, { username: value }).then(item => {
                if (item.length > 0) {
                    if (value === item[0].username) {
                        this.setState({ searchUser: item, objIndex: '' });
                    }
                }
            });
        } else {
            this.setState({
                searchUser: this.props.getUserFristDatas,
                objIndex: this.state.personIndex
            });
        }
    }
    ok () {
        const {
            actions: { changeMemberField },
            member: { members = [], role = {} } = {}
        } = this.props;

        changeMemberField('visible', false);
    }
    // cancelRelation() {

    // }
    cancel () {
        const {
            actions: {
                changeMemberField
            }
        } = this.props;
        changeMemberField('members', undefined);
        this.searchByName('');
        this.search('');
        this.setState({ objIndex: '', personIndex: '', search: false });
        changeMemberField('visible', false);
    }
    async changePage (obj) {
        const {
            actions: { getUsersPage, getUserFristPage, getUserFristData }
        } = this.props;

        getUsersPage({ page: obj.current }).then(rst2 => {
            let pagination = {
                current: obj.current,
                total: rst2.count
            };
            getUserFristPage(pagination);
            getUserFristData(rst2);
            this.setState({ objIndex: obj, personIndex: obj });
        });
    }
    componentDidMount () {
        const {
            member: { role: { id } = {} } = {},
            actions: { getMembers },
            platform: { users = [] } = {}
        } = this.props;
        this.setState({ loading: true });
        id && getMembers({ id });
    }
    componentWillUnmount () {
        this.setState({ orgSet: null });
    }
    columns = [
        {
            title: '序号',
            // dataIndex: 'index',
            render: (text, record, index) => {
                const current = this.state.objIndex.current;
                const pageSize = this.state.objIndex.pageSize;
                if (current !== undefined && pageSize !== undefined) {
                    return index + 1 + (current - 1) * pageSize;
                } else {
                    return index + 1;
                }
            }
        },
        {
            title: '名称',
            dataIndex: 'account.person_name'
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '所属部门',
            dataIndex: 'account.organization'
        },
        {
            title: '职务',
            dataIndex: 'account.title'
        },
        {
            title: '手机号码',
            dataIndex: 'account.person_telephone'
        },
        {
            title: '关联',
            render: user => {
                const { member = {} } = this.props;
                const members = member.members || [];
                const checked = members.some(member => member === user.id);

                return (
                    <Checkbox
                        checked={checked}
                        onChange={this.check.bind(this, user)}
                    />
                );
            }
        }
    ];
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index'
            // render: (text,record,index) => {
            // 	return index + 1;
            // }
        },
        {
            title: '名称',
            dataIndex: 'account.person_name'
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '所属部门',
            dataIndex: 'account.organization'
        },
        {
            title: '职务',
            dataIndex: 'account.title'
        },
        {
            title: '手机号码',
            dataIndex: 'account.person_telephone'
        },
        {
            title: '关联',
            render: user => {
                const { member = {} } = this.props;
                const members = member.members || [];
                const checked = members.some(member => member === user.id);
                return (
                    <Checkbox
                        checked={checked}
                        onChange={this.cancelRelation.bind(this, user)}
                    />
                );
            }
        }
    ];
    // user是关联用户里面的其中一行记录

    check (user) {
        console.log('22222222', user);
        const {
            actions: { changeMemberField },
            member: { role = [], members = [] }
        } = this.props;
        const has = members.some(member => member === user.id);
        let rst = [];
        let groupsa = [];
        for (let i = 0; i < user.groups.length; i++) {
            const element = user.groups[i];
            if (has) {
                rst = members.filter(member => member !== user.id);
                if (element.id === role.id) {
                } else {
                    groupsa.push(element.id);
                }
            } else {
                rst = [...members, user.id];
                groupsa.push(role.id);
                groupsa.push(element.id);
            }
            changeMemberField('members', rst);
        }
        console.log('groupsa', groupsa);
        let setGroups = Array.from(new Set(groupsa));
        console.log('7777777777', setGroups);
        const {
            actions: { putUser, getOrgName }
        } = this.props;
        // return
        getOrgName({ code: user.account.org_code }).then(items => {
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
                        person_avatar_url: '',
                        organization: {
                            pk: items.pk,
                            code: user.account.org_code,
                            obj_type: 'C_ORG',
                            rel_type: 'member',
                            name: user.account.organization
                        }
                    },
                    tags: user.account.tags,
                    sections: user.account.sections,
                    // groups: [7],
                    groups: setGroups,
                    is_active: true,
                    basic_params: {
                        info: {
                            电话: user.account.person_telephone || '',
                            性别: user.account.gender || '',
                            技术职称: user.account.title || '',
                            phone: user.account.person_telephone || '',
                            sex: user.account.gender || '',
                            duty: ''
                        }
                    },
                    extra_params: {},
                    title: user.account.title || ''
                }
            ).then(rst => {});
        });
    }
    cancelRelation (user) {
        const {
            actions: { changeMemberField },
            member: { role = [], members = [] }
        } = this.props;
        const has = members.some(member => member === user.id);
        let rst = [];
        let groupsa = [];
        for (let i = 0; i < user.groups.length; i++) {
            const element = user.groups[i];
            if (has) {
                rst = members.filter(member => member !== user.id);
                if (element.id === role.id) {
                } else {
                    groupsa.push(element.id);
                }
            } else {
                rst = [...members, user.id];
                groupsa.push(element.id);
            }
            changeMemberField('members', rst);
        }
        console.log('groupsa', groupsa);
        const {
            actions: { putUser, getOrgName }
        } = this.props;
        // return
        getOrgName({ code: user.account.org_code }).then(items => {
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
                        person_avatar_url: '',
                        organization: {
                            pk: items.pk,
                            code: user.account.org_code,
                            obj_type: 'C_ORG',
                            rel_type: 'member',
                            name: user.account.organization
                        }
                    },
                    tags: user.account.tags,
                    sections: user.account.sections,
                    // groups: [7],
                    groups: groupsa,
                    is_active: true,
                    basic_params: {
                        info: {
                            电话: user.account.person_telephone || '',
                            性别: user.account.gender || '',
                            技术职称: user.account.title || '',
                            phone: user.account.person_telephone || '',
                            sex: user.account.gender || '',
                            duty: ''
                        }
                    },
                    extra_params: {},
                    title: user.account.title || ''
                }
            ).then(rst => {});
        });
    }
}

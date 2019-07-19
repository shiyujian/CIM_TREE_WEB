import React, { Component } from 'react';
import { Modal, Table, Checkbox, Spin, Input, Row, Col, Button } from 'antd';
const Search = Input.Search;
export default class Member extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            relationMember: [],
            relationMemberIDList: [],
            allUserData: {},
            pagination: {},
            searchRelationList: [],
            searchRelationStatus: false,
            searchAllUser: [],
            searchAllUserStatus: false,
            searchAllUserPostData: {}
        };
    }
    componentDidMount = async () => {
        const {
            member: { role = {} } = {},
            actions: {
                getMembers,
                getUsersPage
            }
        } = this.props;
        try {
            this.setState({ loading: true });
            let data = await getMembers({ id: role.id });
            let relationMember = (data && data.members) || [];
            let relationMemberIDList = relationMember.map(member => member.id);

            let allUserData = await getUsersPage({ page: 1 });
            let pagination = {
                current: 1,
                total: (allUserData && allUserData.count) || 0,
                pageSize: 10
            };
            this.setState({
                relationMember,
                relationMemberIDList,
                pagination,
                allUserData,
                loading: false
            });
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    // 已关联用户搜索
    searchRelationUser (value) {
        let searchRelationList = [];
        const {
            relationMember = []
        } = this.state;
        let array = [];
        relationMember.map(item => {
            if (item.username) {
                if (value && item.username.indexOf(value) > -1) {
                    searchRelationList.push(item);
                    array.push(item.id);
                }
            }
        });
        relationMember.map(item => {
            if (item.account && item.account.person_name) {
                // 符合搜索条件的名字
                if (value && item.account.person_name.indexOf(value) > -1) {
                    // 之前没有加入数组
                    if (array.indexOf(item.id) === -1) {
                        searchRelationList.push(item);
                    }
                }
            }
        });
        console.log('searchRelationList', searchRelationList);
        if (value) {
            this.setState({
                searchRelationList: searchRelationList,
                searchRelationStatus: true
            });
        } else {
            this.setState({
                searchRelationList: [],
                searchRelationStatus: false
            });
        }
    }
    // 全部用户搜索
    searchAllUer = async (value) => {
        const {
            actions: { getUsers }
        } = this.props;
        const {
            pagination,
            allUserData = {}
        } = this.state;
        pagination.current = 1;
        pagination.pageSize = 10;
        if (value) {
            this.setState({ loading: true });
            let searchAllUserPostData = {
                page: 1,
                keyword: value,
                is_active: true,
                is_black: 0
            };
            let searchAllUser = await getUsers({}, searchAllUserPostData);
            pagination.total = (searchAllUser && searchAllUser.count) || 0;
            this.setState({
                searchAllUserPostData,
                searchAllUser,
                pagination,
                searchAllUserStatus: true,
                loading: false
            });
        } else {
            pagination.total = (allUserData && allUserData.count) || 0;
            this.setState({
                searchAllUserPostData: {},
                searchAllUser: {},
                pagination,
                searchAllUserStatus: false
            });
        }
    }
    // 所有用户翻页
    changePage = async (pagina) => {
        const {
            actions: {
                getUsersPage,
                getUsers
            }
        } = this.props;
        const {
            searchAllUserStatus,
            searchAllUserPostData,
            pagination
        } = this.state;
        let page = pagina.current;
        pagination.current = page;
        pagination.pageSize = 10;
        this.setState({ loading: true });
        if (searchAllUserStatus) {
            searchAllUserPostData.page = page;
            let searchAllUser = await getUsers({}, searchAllUserPostData);
            pagination.total = (searchAllUser && searchAllUser.count) || 0;
            this.setState({
                searchAllUserPostData,
                searchAllUser,
                pagination,
                loading: false
            });
        } else {
            let allUserData = await getUsersPage({ page: pagina.current });
            pagination.total = (allUserData && allUserData.count) || 0;
            this.setState({
                pagination,
                allUserData,
                loading: false
            });
        }
    }
    // 关闭弹窗
    handleModalCancel () {
        const {
            actions: {
                changeMemberField
            }
        } = this.props;
        changeMemberField('visible', false);
    }
    columns = [
        {
            title: '序号',
            render: (text, record, index) => {
                const {
                    pagination
                } = this.state;
                const current = pagination.current;
                const pageSize = pagination.pageSize;
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
                const {
                    relationMemberIDList
                } = this.state;
                const checked = relationMemberIDList.some(member => member === user.id);

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
                const {
                    relationMemberIDList
                } = this.state;
                const checked = relationMemberIDList.some(member => member === user.id);
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

    check = async (user) => {
        const {
            actions: {
                putForestUser,
                getChildOrgTreeByID
            },
            member: { role = [] }
        } = this.props;
        const {
            relationMemberIDList
        } = this.state;
        const has = relationMemberIDList.some(member => member === user.id);
        let rst = [];
        let groupsa = [];
        if (has) {
            rst = relationMemberIDList.filter(member => member !== user.id);
        } else {
            rst = [...relationMemberIDList, user.id];
            groupsa.push(role.id);
        }
        this.setState({
            relationMemberIDList: rst
        });
        let items = await getChildOrgTreeByID({ id: user.ID });
        await putForestUser(
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
                    person_signature_url: '',
                    organization: {
                        pk: items.ID,
                        code: user.account.org_code,
                        obj_type: 'C_ORG',
                        rel_type: 'member',
                        name: user.account.organization
                    }
                },
                tags: user.account.tags,
                sections: user.account.sections,
                groups: groupsa,
                is_active: true,
                id_num: user.account.id_num,
                id_image: [],
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
        );
    }
    cancelRelation = async (user) => {
        const {
            actions: {
                putForestUser,
                getChildOrgTreeByID
            },
            member: { role = [] }
        } = this.props;
        const {
            relationMemberIDList
        } = this.state;
        const has = relationMemberIDList.some(member => member === user.id);
        let rst = [];
        let groupsa = [];
        if (has) {
            rst = relationMemberIDList.filter(member => member !== user.id);
        } else {
            rst = [...relationMemberIDList, user.id];
            groupsa.push(role.id);
        }
        this.setState({
            relationMemberIDList: rst
        });
        let items = await getChildOrgTreeByID({ id: user.ID });
        await putForestUser(
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
                    person_signature_url: '',
                    organization: {
                        pk: items.ID,
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
                id_num: user.account.id_num,
                id_image: [],
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
        );
    }

    render () {
        const {
            loading,
            searchRelationList,
            searchRelationStatus,
            relationMember = [],
            searchAllUserStatus,
            allUserData,
            searchAllUser
        } = this.state;
        const {
            member: { visible, role = {} } = {}
        } = this.props;
        const title = `关联用户 | ${role ? role.name : ''}`;
        let allUserDataSource = [];
        if (searchAllUserStatus) {
            allUserDataSource = (searchAllUser && searchAllUser.results) || [];
        } else {
            allUserDataSource = (allUserData && allUserData.results) || [];
        }
        let relationDataSource = [];
        if (searchRelationStatus) {
            relationDataSource = searchRelationList || [];
        } else {
            relationDataSource = relationMember || [];
        }
        relationDataSource.map((ele, i) => {
            ele.index = i + 1;
            return { ...ele };
        });
        return (
            <Modal
                title={title}
                style={{ top: 0 }}
                visible={visible}
                width='90%'
                footer={null}
                onCancel={this.handleModalCancel.bind(this)}
            >
                <Spin spinning={loading}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={6}>
                            <h2 style={{ marginLeft: '10px' }}>
                                已经关联的用户
                            </h2>
                        </Col>
                        <Col span={6}>
                            <Search
                                placeholder='请输入用户名'
                                style={{
                                    width: '200px',
                                    margin: '0 0 0 5px'
                                }}
                                onSearch={this.searchRelationUser.bind(this)}
                            />
                        </Col>
                    </Row>
                    <Table
                        bordered
                        rowKey='id'
                        size='small'
                        columns={this.columns1}
                        dataSource={relationDataSource}
                    />

                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={6}>
                            <h2 style={{ marginLeft: '10px' }}>所有用户</h2>
                        </Col>
                        <Col span={6}>
                            <Search
                                placeholder='请输入用户名或名称'
                                style={{
                                    width: '200px',
                                    margin: '0 0 0 5px'
                                }}
                                onSearch={this.searchAllUer.bind(this)}
                            />
                        </Col>
                    </Row>
                    <Table
                        bordered
                        rowKey='id'
                        size='small'
                        columns={this.columns}
                        dataSource={allUserDataSource}
                        onChange={this.changePage.bind(this)}
                        pagination={this.state.pagination}
                    />
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleModalCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                            关闭
                        </Button>
                    </Row>
                </Spin>
            </Modal>
        );
    }
}

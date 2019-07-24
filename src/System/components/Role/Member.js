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
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            dataIndex: 'User_Name'
        },
        {
            title: '职务',
            dataIndex: 'Duty'
        },
        {
            title: '手机号码',
            dataIndex: 'Phone'
        },
        {
            title: '关联',
            render: user => {
                const {
                    relationMemberIDList
                } = this.state;
                const checked = relationMemberIDList.some(member => member === user.ID);

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
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            dataIndex: 'User_Name'
        },
        {
            title: '职务',
            dataIndex: 'Duty'
        },
        {
            title: '手机号码',
            dataIndex: 'Phone'
        },
        {
            title: '关联',
            render: user => {
                const {
                    relationMemberIDList = []
                } = this.state;
                const checked = relationMemberIDList.some(member => member === user.ID);
                return (
                    <Checkbox
                        checked={checked}
                        onChange={this.cancelRelation.bind(this, user)}
                    />
                );
            }
        }
    ];
    componentDidMount = async () => {
        const {
            member: { role = {} } = {},
            actions: {
                getUsers
            }
        } = this.props;
        try {
            this.setState({ loading: true });
            let data = await getUsers({}, { role: role.ID });
            let relationMember = (data && data.content) || [];
            let relationMemberIDList = relationMember.map(member => member.ID);
            let postData = {
                page: 1,
                size: 10
            };
            let allUserData = await getUsers({}, postData);
            if (allUserData && allUserData.code && allUserData.code === 200) {
                let pagination = {
                    current: 1,
                    total: (allUserData.pageinfo && allUserData.pageinfo.total) || 0,
                    pageSize: 10
                };
                this.setState({
                    relationMember,
                    relationMemberIDList,
                    pagination,
                    allUserData,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
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
            if (item.User_Name) {
                if (value && item.User_Name.indexOf(value) > -1) {
                    searchRelationList.push(item);
                    array.push(item.ID);
                }
            }
        });
        relationMember.map(item => {
            if (item.Full_Name) {
                // 符合搜索条件的名字
                if (value && item.Full_Name.indexOf(value) > -1) {
                    // 之前没有加入数组
                    if (array.indexOf(item.ID) === -1) {
                        searchRelationList.push(item);
                    }
                }
            }
        });
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
                size: 10,
                keyword: value,
                status: 1,
                isblack: 0
            };
            let searchAllUser = await getUsers({}, searchAllUserPostData);
            if (searchAllUser && searchAllUser.code && searchAllUser.code === 200) {
                pagination.total = (searchAllUser.pageinfo && searchAllUser.pageinfo.total) || 0;
                this.setState({
                    searchAllUserPostData,
                    searchAllUser,
                    pagination,
                    searchAllUserStatus: true,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        } else {
            pagination.total = (allUserData && allUserData.pageinfo && allUserData.pageinfo.total) || 0;
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
            if (searchAllUser && searchAllUser.code && searchAllUser.code === 200) {
                pagination.total = (searchAllUser.pageinfo && searchAllUser.pageinfo.total) || 0;
                this.setState({
                    searchAllUserPostData,
                    searchAllUser,
                    pagination,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        } else {
            let postData = {
                page: pagina.current,
                size: 10
            };
            let allUserData = await getUsers({}, postData);
            if (allUserData && allUserData.code && allUserData.code === 200) {
                pagination.total = (allUserData.pageinfo && allUserData.pageinfo.total) || 0;
                this.setState({
                    pagination,
                    allUserData,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
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
    // user是关联用户里面的其中一行记录

    check = async (user) => {
        const {
            actions: {
                putForestUser
            },
            member: { role = [] }
        } = this.props;
        const {
            relationMemberIDList
        } = this.state;
        const has = relationMemberIDList.some(member => member === user.ID);
        let rst = [];
        if (has) {
            rst = relationMemberIDList.filter(member => member !== user.ID);
        } else {
            rst = [...relationMemberIDList, user.ID];
        }
        this.setState({
            relationMemberIDList: rst
        });
        // 修改人员信息
        let putUserPostData = {
            ID: user.ID, // 用户ID
            Full_Name: user.Full_Name, // 姓名
            User_Name: user.User_Name, // 用户名
            Org: user.Org, // 组织机构
            Phone: user.Phone, // 电话
            Duty: user.Duty, // 职务
            EMail: user.EMail,
            Sex: user.Sex, // 性别
            Status: user.Status, // 状态
            Section: user.Section, // 标段
            Number: user.Number, // 身份证号码
            Card: user.Card, // 身份证正面照片
            CardBack: user.CardBack, // 身份证背面照片
            Face: user.Face,
            Roles: [{ // 角色
                ID: role.ID // 角色ID
            }]
        };
        let userData = await putForestUser({}, putUserPostData);
        if (userData && userData.code && userData.code === 1) {
            Notification.success({
                message: '角色关联成功',
                duration: 1
            });
        } else {
            Notification.error({
                message: '角色关联失败',
                duration: 1
            });
        }
    }
    cancelRelation = async (user) => {
        const {
            actions: {
                putForestUser
            },
            member: { role = [] }
        } = this.props;
        const {
            relationMemberIDList
        } = this.state;
        const has = relationMemberIDList.some(member => member === user.ID);
        let rst = [];
        if (has) {
            rst = relationMemberIDList.filter(member => member !== user.ID);
        } else {
            rst = [...relationMemberIDList, user.ID];
        }
        this.setState({
            relationMemberIDList: rst
        });
        // 修改人员信息
        let putUserPostData = {
            ID: user.ID, // 用户ID
            Full_Name: user.Full_Name, // 姓名
            User_Name: user.User_Name, // 用户名
            Org: user.Org, // 组织机构
            Phone: user.Phone, // 电话
            Duty: user.Duty, // 职务
            EMail: user.EMail,
            Sex: user.Sex, // 性别
            Status: user.Status, // 状态
            Section: user.Section, // 标段
            Number: user.Number, // 身份证号码
            Card: user.Card, // 身份证正面照片
            CardBack: user.CardBack, // 身份证背面照片
            Face: user.Face,
            Roles: [{ // 角色
                ID: role.ID // 角色ID
            }]
        };
        let userData = await putForestUser({}, putUserPostData);
        if (userData && userData.code && userData.code === 1) {
            Notification.success({
                message: '角色关联成功',
                duration: 1
            });
        } else {
            Notification.error({
                message: '角色关联失败',
                duration: 1
            });
        }
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
            allUserDataSource = (searchAllUser && searchAllUser.content) || [];
        } else {
            allUserDataSource = (allUserData && allUserData.content) || [];
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
                        rowKey='ID'
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
                        rowKey='ID'
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

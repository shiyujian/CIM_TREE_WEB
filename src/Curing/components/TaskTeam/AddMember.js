import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification, Row
} from 'antd';
import { getUser } from '_platform/auth';
import '../Curing.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
window.config = window.config || {};

export default class AddMember extends Component {
    constructor (props) {
        super(props);
        this.state = {
            modalVisible: false,
            roles: [],
            dataSource: [],
            RelationMem: [],
            totalUserData: []
        };
        this.user = null;
    }

    async componentDidMount () {
        const {
            actions: {
                getRoles,
                getForestAllUsersData
            }
        } = this.props;
        this.user = getUser();
        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!(this.sections && this.sections instanceof Array && this.sections.length > 0) && (this.user.username !== 'admin')) {
            return;
        }
        let totalUserData = window.localStorage.getItem('LZ_TOTAL_USER_DATA');
        totalUserData = JSON.parse(totalUserData);
        console.log('totalUserData', totalUserData);
        if (totalUserData && totalUserData instanceof Array && totalUserData.length > 0) {

        } else {
            let userData = await getForestAllUsersData();
            totalUserData = userData && userData.content;
        }
        this.setState({
            totalUserData
        });
        // 需要找到是养护角色的人
        let role = await getRoles();
        const curingRoles = role.filter(rst => rst.grouptype === 4);
        let roles = curingRoles.map(item => { return item.id; });
        this.setState({
            roles: roles
        });
        await this._queryMember();
    };
    // 查找人员
    _queryMember = async () => {
        const {
            roles = []
        } = this.state;
        const {
            actions: {
                getUsers
            },
            selectSection
        } = this.props;
        if (roles.length === 0) {
            return;
        }
        let sections = [];
        if (this.user.username === 'admin') {
            // 如果没有点击节点，则获取全部养护人员，为防止人员列表过长，需要禁止
            if (!selectSection) {
                return;
            }
            sections.push(selectSection);
        } else {
            sections = this.sections;
        }
        console.log('sections', sections);
        try {
            let postdata = {};
            postdata = {
                roles: roles,
                sections: sections,
                is_active: true
            };

            let users = await getUsers({}, postdata);
            console.log('users', users);
            this.setState({
                users
            });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidUpdate (prevProps, prevState) {
        const {
            selectSection,
            // isGetMem,
            addMemVisible
        } = this.props;
        if (selectSection !== prevProps.selectSection) {
            this._queryMember();
        }
        if (addMemVisible !== prevProps.addMemVisible && addMemVisible) {
            this._getRelMem();
        }
    }
    render () {
        const {
            addMemVisible
        } = this.props;
        const {
            users,
            RelationMem
        } = this.state;
        console.log('RelationMem', RelationMem);
        return (
            <div>
                <Modal
                    title={'关联用户'}
                    visible={addMemVisible}
                    width='90%'
                    // onOk={this._handleAddMem.bind(this)}
                    onCancel={this._handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <Table
                            bordered
                            rowKey='id'
                            size='small'
                            columns={this.columns}
                            dataSource={users}
                        />
                        <Row style={{marginTop: 10}}>
                            <Button onClick={this._handleCancel.bind(this)} style={{float: 'right'}}type='primary'>关闭</Button>
                        </Row>
                    </div>
                </Modal>
            </div>

        );
    }

    _getRelMem = async () => {
        const {
            curingGroupMans
        } = this.props;
        const {
            totalUserData
        } = this.state;
        let RelationMem = [];
        if (curingGroupMans && curingGroupMans instanceof Array && curingGroupMans.length > 0) {
            curingGroupMans.map((man) => {
                totalUserData.map((userData) => {
                    if (Number(userData.ID) === man.User) {
                        RelationMem.push(Number(userData.PK));
                    }
                });
            });
        }
        this.setState({
            RelationMem: RelationMem
        });
    }

    _handleCancel = async () => {
        const {
            actions: {
                changeAddMemVisible
            }
        } = this.props;
        changeAddMemVisible(false);
        await this.getRelatedMans();
    }

    _check = async (user, e) => {
        const {
            RelationMem = [],
            totalUserData = []
        } = this.state;
        const {
            actions: {
                postCuringGroupMan,
                deleteCuringGroupMan
            },
            selectMemTeam,
            curingGroupMans
        } = this.props;
        let checked = e.target.checked;
        console.log('user', user);
        try {
            let pk = user.id;
            let checkUserId = '';
            totalUserData.map((userData) => {
                if (userData && userData.PK && Number(userData.PK) === pk) {
                    checkUserId = userData && userData.ID;
                }
            });
            console.log('checkUserId', checkUserId);
            if (checked) {
                try {
                    if (checkUserId) {
                        let postAddData = {
                            'GroupID': selectMemTeam.ID,
                            'GroupName': selectMemTeam.GroupName, // 班组名称
                            'User': checkUserId, // 用户ID  非PK
                            'FullName': user.account.person_name || user.username // 用户姓名
                        };
                        let addData = await postCuringGroupMan({}, postAddData);
                        console.log('addData', addData);
                        if (addData && addData.code && addData.code === 1) {
                            await this.getRelatedMans();
                            RelationMem.push(user.id);
                            Notification.success({
                                message: '关联用户成功',
                                duration: 1
                            });
                        }
                    } else {
                        Notification.error({
                            message: '关联用户失败',
                            duration: 2
                        });
                    }
                } catch (e) {
                    console.log('e', e);
                }
            } else {
                let deleteID = '';
                curingGroupMans.map((man) => {
                    if (man.User === checkUserId) {
                        deleteID = man.ID;
                    }
                });
                let postData = {
                    id: deleteID
                };
                let deleteData = await deleteCuringGroupMan(postData);
                if (deleteData && deleteData.code && deleteData.code === 1) {
                    await this.getRelatedMans();
                    RelationMem.map((memberID, index) => {
                        if (memberID === user.id) {
                            RelationMem.splice(index, 1); // 删除该元素
                        }
                    });
                    Notification.success({
                        message: '取消关联用户成功',
                        duration: 1
                    });
                } else {
                    Notification.error({
                        message: '取消关联用户失败',
                        duration: 2
                    });
                }
                console.log('ddddddddddd', deleteData);
            }
        } catch (e) {
            console.log('ssss', e);
        }
        this.setState({
            RelationMem
        });
    }

    getRelatedMans = async () => {
        const {
            actions: {
                getCuringGroupMans
            },
            selectMemTeam
        } = this.props;
        let postGetData = {
            groupid: selectMemTeam.ID
        };
        await getCuringGroupMans(postGetData);
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
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
                const { RelationMem = [] } = this.state;
                const checked = RelationMem.some(memberID => Number(memberID) === user.id);

                return (
                    <Checkbox
                        checked={checked}
                        onChange={this._check.bind(this, user)}
                    />
                );
            }
        }
    ];
}

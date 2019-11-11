import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification, Row
} from 'antd';
import { getUser } from '_platform/auth';
import '../Conservation.less';
import 'moment/locale/zh-cn';

export default class AddMember extends Component {
    constructor (props) {
        super(props);
        this.state = {
            modalVisible: false,
            curingRoleID: [],
            dataSource: [],
            RelationMem: [],
            totalUserData: []
        };
        this.user = null;
        this.section = '';
    }

    async componentDidMount () {
        const {
            actions: {
                getRoles
            }
        } = this.props;
        this.user = getUser();
        this.section = this.user.section;
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!this.section && (this.user.username !== 'admin')) {
            return;
        }
        // 需要找到是养护角色的人
        let roleData = await getRoles();
        let curingRoleID = '';
        roleData.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName.indexOf('养护') !== -1
                && role.RoleName !== '养护文书') {
                curingRoleID = role.ID;
            };
        });
        this.setState({
            curingRoleID
        });
        await this._queryMember();
    };
    // 查找人员
    _queryMember = async () => {
        const {
            curingRoleID = ''
        } = this.state;
        const {
            actions: {
                getUsers
            },
            selectSection
        } = this.props;
        if (!curingRoleID) {
            return;
        }
        let section = '';
        if (this.user.username === 'admin') {
            // 如果没有点击节点，则获取全部养护人员，为防止人员列表过长，需要禁止
            if (!selectSection) {
                return;
            }
            section = selectSection;
        } else {
            section = this.section;
        }
        try {
            let postdata = {};
            postdata = {
                role: curingRoleID,
                section: section,
                status: 1
            };
            console.log('postdata', postdata);
            let userData = await getUsers({}, postdata);
            if (userData && userData.code && userData.code === 200) {
                this.setState({
                    userData: (userData && userData.content) || []
                });
            }
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
            userData
        } = this.state;
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
                            dataSource={userData}
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
        let RelationMem = [];
        if (curingGroupMans && curingGroupMans instanceof Array && curingGroupMans.length > 0) {
            curingGroupMans.map((user) => {
                if (user && user.User) {
                    RelationMem.push(user && user.User);
                }
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
        await this.getRelatedMans();
        changeAddMemVisible(false);
    }

    _check = async (user, e) => {
        const {
            RelationMem = []
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
        try {
            let checkUserId = (user && user.ID) || '';
            if (checked) {
                try {
                    if (checkUserId) {
                        let postAddData = {
                            'GroupID': selectMemTeam.ID,
                            'GroupName': selectMemTeam.GroupName, // 班组名称
                            'User': checkUserId, // 用户ID  非PK
                            'FullName': user.Full_Name || user.User_Name // 用户姓名
                        };
                        let addData = await postCuringGroupMan({}, postAddData);
                        if (addData && addData.code && addData.code === 1) {
                            await this.getRelatedMans();
                            RelationMem.push(user.ID);
                            Notification.success({
                                message: '关联用户成功',
                                duration: 1
                            });
                        } else {
                            Notification.error({
                                message: '关联用户失败',
                                duration: 2
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
                        if (memberID === user.ID) {
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
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            dataIndex: 'User_Name'
        },
        {
            title: '所属部门',
            dataIndex: 'OrgObj',
            render: (text, record, index) => {
                if (record.OrgObj && record.OrgObj.OrgName) {
                    return record.OrgObj.OrgName;
                }
            }
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
                const { RelationMem = [] } = this.state;
                const checked = RelationMem.some(memberID => Number(memberID) === user.ID);

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

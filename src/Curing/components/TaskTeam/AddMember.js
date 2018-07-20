import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification
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
            RelationMem: []
        };
        this.user = null;
    }

    async componentDidMount () {
        const {
            actions: {
                getRoles
            }
        } = this.props;
        this.user = getUser();
        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!(this.sections && this.sections instanceof Array && this.sections.length > 0) && (this.user.username !== 'admin')) {
            return;
        }
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
            isGetMem
        } = this.props;
        if (selectSection !== prevProps.selectSection) {
            this._queryMember();
        }
        if (isGetMem !== prevProps.isGetMem) {
            this._getRelMem();
        }
    }
    render () {
        const {
            addMemVisible
        } = this.props;
        const {
            users
        } = this.state;
        return (
            <div>
                <Modal
                    title={'关联用户'}
                    visible={addMemVisible}
                    width='90%'
                    onOk={this._handleAddMem.bind(this)}
                    onCancel={this._handleCancel.bind(this)}
                >
                    <div>
                        <Table
                            bordered
                            rowKey='id'
                            size='small'
                            columns={this.columns}
                            dataSource={users}
                        />
                    </div>
                </Modal>
            </div>

        );
    }

    _getRelMem = async () => {
        const {
            selectMemDoc
        } = this.props;
        if (selectMemDoc && selectMemDoc.extra_params && selectMemDoc.extra_params.RelationMem) {
            let RelationMem = selectMemDoc.extra_params.RelationMem;
            this.setState({
                RelationMem: RelationMem
            });
        } else {
            this.setState({
                RelationMem: []
            });
        }
    }

    _handleAddMem = async () => {
        const {
            selectMemDoc,
            actions: {
                putDocument,
                changeAddMemVisible,
                isGetMemChange
            }
        } = this.props;
        const {
            RelationMem
        } = this.state;
        console.log('RelationMem', RelationMem);
        try {
            // 修改文档数据
            let changeDocumentData = {
                'extra_params': {
                    'RelationMem': RelationMem
                },
                'basic_params': {
                    'files': [
                        selectMemDoc.basic_params.files[0]
                    ]
                },
                'status': 'A',
                'version': 'A'
            };
            let data = await putDocument({code: selectMemDoc.code}, changeDocumentData);
            console.log('data', data);
            if (data && data.pk) {
                Notification.success({
                    message: '关联用户成功',
                    duration: 3
                });
                await changeAddMemVisible(false);
                await isGetMemChange(moment().unix());
            } else {
                Notification.error({
                    message: '关联用户失败',
                    duration: 3
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    _handleCancel () {
        const {
            actions: {
                changeAddMemVisible
            },
            selectMemDoc
        } = this.props;
        changeAddMemVisible(false);
        if (selectMemDoc && selectMemDoc.extra_params && selectMemDoc.extra_params.RelationMem) {
            let RelationMem = selectMemDoc.extra_params.RelationMem;
            this.setState({
                RelationMem
            });
        } else {
            this.setState({
                RelationMem: []
            });
        }
    }

    _check (user, e) {
        const {
            RelationMem = []
        } = this.state;
        let checked = e.target.checked;
        if (checked) {
            RelationMem.push(user);
        } else {
            RelationMem.map((member, index) => {
                if (member.id === user.id) {
                    RelationMem.splice(index, 1); // 删除该元素
                }
            });
        }
        this.setState({
            RelationMem
        });

        console.log('111111', e);
        console.log('22222222', user);
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
                const checked = RelationMem.some(member => member.id === user.id);

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

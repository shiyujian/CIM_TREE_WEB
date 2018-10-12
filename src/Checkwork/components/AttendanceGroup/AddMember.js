import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification, Row, Form, Col, Select, Input
} from 'antd';
import { getUser } from '_platform/auth';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
window.config = window.config || {};

class AddMember extends Component {
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
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
                // roles: roles,
                // sections: sections,
                is_active: true
            };
            debugger
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

    renderContent () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const {
            platform: { roles = [] }
        } = this.props;
        var systemRoles = [];
        if (user.is_superuser) {
            systemRoles.push({
                name: '苗圃角色',
                value: roles.filter(role => role.grouptype === 0)
            });
            systemRoles.push({
                name: '施工角色',
                value: roles.filter(role => role.grouptype === 1)
            });
            systemRoles.push({
                name: '监理角色',
                value: roles.filter(role => role.grouptype === 2)
            });
            systemRoles.push({
                name: '业主角色',
                value: roles.filter(role => role.grouptype === 3)
            });
            systemRoles.push({
                name: '养护角色',
                value: roles.filter(role => role.grouptype === 4)
            });
            systemRoles.push({
                name: '苗圃基地角色',
                value: roles.filter(role => role.grouptype === 5)
            });
            systemRoles.push({
                name: '供应商角色',
                value: roles.filter(role => role.grouptype === 6)
            });
        } else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype;
                switch (rolea) {
                    case 0:
                        systemRoles.push({
                            name: '苗圃角色',
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        break;
                    case 1:
                        systemRoles.push({
                            name: '苗圃角色',
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        systemRoles.push({
                            name: '施工角色',
                            value: roles.filter(role => role.grouptype === 1)
                        });
                        systemRoles.push({
                            name: '养护角色',
                            value: roles.filter(role => role.grouptype === 4)
                        });
                        break;
                    case 2:
                        systemRoles.push({
                            name: '监理角色',
                            value: roles.filter(role => role.grouptype === 2)
                        });
                        break;
                    case 3:
                        systemRoles.push({
                            name: '业主角色',
                            value: roles.filter(role => role.grouptype === 3)
                        });
                        break;
                    case 4:
                        systemRoles.push({
                            name: '养护角色',
                            value: roles.filter(role => role.grouptype === 4)
                        });
                        break;
                    case 5:
                        systemRoles.push({
                            name: '苗圃基地角色',
                            value: roles.filter(role => role.grouptype === 3)
                        });
                        break;
                    case 6:
                        systemRoles.push({
                            name: '供应商角色',
                            value: roles.filter(role => role.grouptype === 4)
                        });
                        break;
                    default:
                        break;
                }
            }
        }
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name}>
                    {roless.value.map(role => {
                        return (
                            <Option key={role.id} value={String(role.id)}>
                                {role.name}
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        });
        return objs;
    }
    renderTitle () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const {
            platform: { roles = [] }
        } = this.props;
        var systemRoles = [];
        if (user.is_superuser) {
            systemRoles.push({
                name: '苗圃职务',
                children: ['苗圃'],
                value: roles.filter(role => role.grouptype === 0)
            });
            systemRoles.push({
                name: '施工职务',
                children: [
                    '施工领导',
                    '协调调度人',
                    '质量负责人',
                    '安全负责人',
                    '文明负责人',
                    '普通员工',
                    '施工文书',
                    '测量员'
                ],
                value: roles.filter(role => role.grouptype === 1)
            });
            systemRoles.push({
                name: '监理职务',
                children: ['总监', '监理组长', '普通监理', '监理文书'],
                value: roles.filter(role => role.grouptype === 2)
            });
            systemRoles.push({
                name: '业主职务',
                children: ['业主', '业主文书', '业主领导'],
                value: roles.filter(role => role.grouptype === 3)
            });
            systemRoles.push({
                name: '苗圃基地职务',
                children: ['苗圃基地'],
                value: roles.filter(role => role.grouptype === 5)
            });
            systemRoles.push({
                name: '供应商职务',
                children: ['供应商'],
                value: roles.filter(role => role.grouptype === 6)
            });
        } else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype;
                switch (rolea) {
                    case 0:
                        systemRoles.push({
                            name: '苗圃职务',
                            children: ['苗圃'],
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        break;
                    case 1:
                        systemRoles.push({
                            name: '苗圃职务',
                            children: ['苗圃'],
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        systemRoles.push({
                            name: '施工职务',
                            children: [
                                '施工领导',
                                '协调调度人',
                                '质量负责人',
                                '安全负责人',
                                '文明负责人',
                                '普通员工',
                                '施工文书',
                                '测量员'
                            ],
                            value: roles.filter(role => role.grouptype === 1)
                        });
                        break;
                    case 2:
                        systemRoles.push({
                            name: '监理职务',
                            children: [
                                '总监',
                                '监理组长',
                                '普通监理',
                                '监理文书'
                            ],
                            value: roles.filter(role => role.grouptype === 2)
                        });
                        break;
                    case 3:
                        systemRoles.push({
                            name: '业主职务',
                            children: ['业主', '业主文书', '业主领导'],
                            value: roles.filter(role => role.grouptype === 3)
                        });
                        break;
                    case 5:
                        systemRoles.push({
                            name: '苗圃基地职务',
                            children: ['苗圃基地'],
                            value: roles.filter(role => role.grouptype === 5)
                        });
                        break;
                    case 6:
                        systemRoles.push({
                            name: '供应商职务',
                            children: ['供应商'],
                            value: roles.filter(role => role.grouptype === 6)
                        });
                        break;
                    default:
                        break;
                }
            }
        }
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name} >
                    {roless.children.map(role => {
                        return (
                            <Option key={role} value={role}>
                                {role}
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        });
        return objs;
    }

    render () {
        const {
            addMemVisible,
            form: { getFieldDecorator }
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
                        <Form style={{ marginBottom: 24 }}>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='姓名'>
                                                {getFieldDecorator('keyword', {
                            
                                                })(
                                                   <Input placeholder='请输入姓名' />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='角色'>
                                                {getFieldDecorator('role', {
                                                    
                                                })(
                                                    <Select
                                                        placeholder='请选择角色'
                                                        optionFilterProp='children'
                                                        filterOption={(input, option) =>
                                                            option.props.children
                                                                .toLowerCase()
                                                                .indexOf(
                                                                    input.toLowerCase()
                                                                ) >= 0
                                                        }
                                                        mode='multiple'
                                                        style={{ width: '100%' }}
                                                    >
                                                        {this.renderContent()}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='部门'>
                                                {getFieldDecorator('organization', {
                        
                                                })(
                                                    <Select placeholder='请选择部门'>
                                                        
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <Row>
                                       
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='职务'>
                                                {getFieldDecorator('duty', {
                                                    
                                                })(
                                                    <Select
                                                        placeholder='请选择职务'
                                                        style={{ width: '100%' }}
                                                    >
                                                        {this.renderTitle()}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>

                                    </Row>
                                </Col>
                                <Col span={5} offset={1}>
                                    <Row gutter={10}>
                                        <Col span={12}>
                                            <Button
                                                type='Primary'
                                                onClick={this.query.bind(this)}
                                            >
                                                查询
                                            </Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={this.clear.bind(this)}>
                                                清除
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
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
            checkGroupMans
        } = this.props;
        const {
            totalUserData
        } = this.state;
        let RelationMem = [];
        if (checkGroupMans && checkGroupMans instanceof Array && checkGroupMans.length > 0) {
            checkGroupMans.map((man) => {
                // totalUserData.map((userData) => {
                //     if (Number(userData.ID) === man.id) {
                //         RelationMem.push(Number(userData.PK));
                //     }
                // });
                RelationMem.push(Number(man.id));
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
                postCheckGroupMans,
                deleteCheckGroupMans,
                getCheckGroupMans,
            },
            selectMemTeam,
            checkGroupMans,
            checkGroup,
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
            let id = checkGroup;
            let members = await getCheckGroupMans({id:id});
            let membersArr = [];
            let Arr = [];
            if(members.length>0){
                for(let i=0;i<members.length;i++){
                    membersArr.push(members[i].id);
                }
            }

            if (membersArr.length > 0) {
                for (let i = 0; i < membersArr.length; i++) {
                    if (pk === membersArr[i]) {
                        membersArr.splice(i, 1);
                        Arr = [
                            ...membersArr
                        ];
                    } else {
                        Arr = [
                            ...membersArr,
                            pk
                        ];
                    }
                }
            } else {
                Arr = [
                    pk
                ];
            }
            if (checked) {
                try {
                    if (checkUserId) {
                        let postAddData = {
                            members:Arr,
                        };
                        let addData = await postCheckGroupMans({id:id}, postAddData);
                        console.log('addData', addData);
                        if (addData) {
                            await this.getRelatedMans();
                            RelationMem.push(user.id);
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
                let postAddData = {
                    members:Arr,
                };
                let deleteData = await postCheckGroupMans({id:id}, postAddData);
                if (deleteData) {
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
                getCheckGroupMans
            },
            selectMemTeam
        } = this.props;
        let postGetData = {
            id: selectMemTeam.id
        };
        await getCheckGroupMans(postGetData);
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

    query () {
        const {
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            let params = {};
        });
    }
    clear () {
        this.props.form.resetFields();
    }
}
export default Form.create()(AddMember);

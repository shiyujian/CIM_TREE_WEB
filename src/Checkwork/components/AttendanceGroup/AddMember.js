import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification, Row, Form, Col, Select, Input, TreeSelect, Spin
} from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

class AddMember extends Component {
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    static layoutT = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
    };
    constructor (props) {
        super(props);
        this.state = {
            roles: [],
            dataSource: [],
            relationMem: [],
            loading: false,
            page: 1, // 当前页
            total: 0
        };
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
            title: '部门',
            dataIndex: 'account.organization'
        },
        {
            title: '姓名',
            dataIndex: 'account.person_name'
        },
        {
            title: '账号',
            dataIndex: 'username'
        },
        {
            title: '角色',
            dataIndex: 'groups[0].name'
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
                const { relationMem = [] } = this.state;
                const checked = relationMem.some(memberID => Number(memberID) === user.id);

                return (
                    <Checkbox
                        checked={checked}
                        onChange={this._check.bind(this, user)}
                    />
                );
            }
        }
    ];

    componentDidMount = async () => {
        const {
            actions: {
                getCheckGroupMansIDList
            },
            selectMemGroup
        } = this.props;
        try {
            let relationMem = await getCheckGroupMansIDList({id: selectMemGroup});
            this.setState({
                relationMem: relationMem || []
            }, async () => {
                await this.getInitialUserData();
            });
        } catch (e) {
            console.log('e', e);
        }
    };
    // 获取最开始的初始值，用于最开始获取人员数据，或清空搜索条件
    getInitialUserData = async () => {
        const {
            userOrgCode,
            actions: {
                getUsers
            },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            organization: userOrgCode
        });
        let postData = {
            org_code: userOrgCode,
            is_active: true,
            page: 1
        };
        let userData = await getUsers({}, postData);
        let dataSource = (userData && userData.results) || [];
        this.setState({
            total: userData.count || 0,
            page: 1,
            dataSource
        });
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

    render () {
        const {
            form: { getFieldDecorator },
            orgTreeSelectData
        } = this.props;
        const {
            relationMem,
            loading = false,
            page,
            total,
            dataSource
        } = this.state;
        return (
            <div>
                <Modal
                    title={'关联用户'}
                    visible
                    width='90%'
                    onCancel={this._handleCancel.bind(this)}
                    footer={null}
                >
                    <Spin spinning={loading}>
                        <Form style={{ marginBottom: 24 }}>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='姓名'>
                                                {getFieldDecorator('keyword', {
                                                    rules: [
                                                        { required: false, message: '请输入姓名' }
                                                    ]
                                                })(
                                                    <Input
                                                        placeholder='请输入姓名'
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...AddMember.layout} label='角色'>
                                                {getFieldDecorator('role', {
                                                    rules: [
                                                        { required: false, message: '请选择角色' }
                                                    ]
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
                                                    rules: [
                                                        { required: false, message: '请选择部门' }
                                                    ]
                                                })(
                                                    <TreeSelect
                                                        treeDefaultExpandAll
                                                    >
                                                        {orgTreeSelectData}
                                                    </TreeSelect>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...AddMember.layoutT} >
                                        {getFieldDecorator('button', {
                                        })(
                                            <div>
                                                <Button
                                                    type='primary'
                                                    style={{marginRight: 30}}
                                                    onClick={this.query.bind(this, 1)}
                                                >
                                                            查询
                                                </Button>
                                                <Button onClick={this.clear.bind(this)}>
                                                            清除
                                                </Button>
                                            </div>
                                        )}
                                    </FormItem>

                                </Col>
                            </Row>
                            <Row gutter={24} />
                        </Form>
                        <Table
                            bordered
                            rowKey='id'
                            size='small'
                            columns={this.columns}
                            dataSource={dataSource}
                            onChange={this.changePage.bind(this)}
                            pagination={{current: page, total: total}}
                        />
                        <Row style={{marginTop: 10}}>
                            <Button onClick={this._handleCancel.bind(this)} style={{float: 'right'}}type='primary'>关闭</Button>
                        </Row>
                    </Spin>
                </Modal>
            </div>

        );
    }

    _handleCancel = async () => {
        const {
            actions: {
                changeAddMemVisible
            }
        } = this.props;
        changeAddMemVisible(false);
    }

    _check = async (user, e) => {
        const {
            relationMem = []
        } = this.state;
        const {
            actions: {
                postCheckGroupMans,
                checkGroupMemChangeStatus
            },
            memberChangeStatus = 0,
            selectMemGroup
        } = this.props;
        let checked = e.target.checked;
        if (checked) {
            relationMem.push(user.id);
            let postData = {
                members: relationMem
            };
            await postCheckGroupMans({id: selectMemGroup}, postData);
            await checkGroupMemChangeStatus(memberChangeStatus + 1);
        } else {
            relationMem.map((memberID, index) => {
                if (memberID === user.id) {
                    relationMem.splice(index, 1); // 删除该元素
                }
            });
            let postData = {
                members: relationMem
            };
            await postCheckGroupMans({id: selectMemGroup}, postData);
            await checkGroupMemChangeStatus(memberChangeStatus + 1);
        }
        this.setState({
            relationMem
        });
    }

    changePage = (obj) => {
        let current = obj.current;
        this.setState({
            page: current
        }, () => {
            this.query(current);
        });
    }

    query (current = 1) {
        const {
            form: { validateFields },
            actions: {
                getUsers
            }
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                let postData = {
                    org_code: values.organization ? values.organization : '',
                    keyword: values.keyword ? values.keyword : '',
                    roles: values.role ? values.role : '',
                    is_active: true,
                    page: current
                };
                let userData = await getUsers({}, postData);
                let dataSource = (userData && userData.results) || [];
                this.setState({
                    total: userData.count || 0,
                    page: current,
                    dataSource
                });
            }
        });
    }
    clear = async () => {
        this.props.form.resetFields();
        await this.getInitialUserData();
    }
}
export default Form.create()(AddMember);

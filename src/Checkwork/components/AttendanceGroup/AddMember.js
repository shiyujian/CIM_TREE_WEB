import React, { Component } from 'react';
import {
    Button, Modal, Table, Checkbox, Notification, Row, Form, Col, Select, Input, TreeSelect, Spin
} from 'antd';
import 'moment/locale/zh-cn';
import {getUser} from '_platform/auth';
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
            title: '姓名',
            key: '1',
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            key: '2',
            dataIndex: 'User_Name'
        },
        {
            title: '性别',
            key: '3',
            dataIndex: 'Sex',
            render: (text, record) => {
                return record.Sex ? '女' : '男';
            }
        },
        {
            title: '角色',
            width: '15%',
            key: '4',
            render: (text, record) => {
                if (record.Roles && record.Roles instanceof Array && record.Roles.length > 0) {
                    return record.Roles[0].RoleName;
                } else {
                    return '';
                }
            }
        },
        {
            title: '职务',
            key: '5',
            dataIndex: 'Duty'
        },
        {
            title: '手机号码',
            key: '6',
            dataIndex: 'Phone'
        },
        {
            title: '所属部门',
            key: '7',
            dataIndex: 'OrgObj',
            render: (text, record) => {
                if (record.OrgObj && record.OrgObj.OrgName) {
                    return record.OrgObj.OrgName;
                }
            }
        },
        {
            title: '关联',
            render: user => {
                const { relationMem = [] } = this.state;

                let checked = [];
                if (user && user.ID && relationMem && relationMem instanceof Array) {
                    checked = relationMem.some(memberID => Number(memberID) === user.ID);
                }
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
            userOrgID,
            actions: {
                getUsers
            },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            organization: userOrgID
        });
        console.log('userOrgID', userOrgID);
        let postData = {
            org: userOrgID,
            status: 1,
            page: 1,
            size: 10
        };
        let userData = await getUsers({}, postData);
        let dataSource = (userData && userData.content) || [];
        this.setState({
            total: (userData && userData.pageinfo && userData.pageinfo.total) || 0,
            page: 1,
            dataSource
        });
    }

    renderContent () {
        const {
            platform: {
                roles = []
            }
        } = this.props;
        const user = getUser();
        let userRoles = user.roles || '';
        var systemRoles = [];
        let parentRoleType = [];
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0) {
                parentRoleType.push(role);
            }
        });
        console.log('parentRoleType', parentRoleType);
        if (user.username && user.username === 'admin') {
            parentRoleType.map((type) => {
                systemRoles.push({
                    name: type && type.RoleName,
                    value: roles.filter(role => role.ParentID === type.ID)
                });
            });
        } else {
            const rolea = userRoles.ParentID;
            parentRoleType.map((type) => {
                if (rolea === type.ID) {
                    systemRoles.push({
                        name: type && type.RoleName,
                        value: roles.filter(role => role.ParentID === type.ID)
                    });
                }
            });
        }
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name}>
                    {roless.value.map(role => {
                        return (
                            <Option key={role.ID} value={String(role.ID)}>
                                {role.RoleName}
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
                    org: values.organization ? values.organization : '',
                    keyword: values.keyword ? values.keyword : '',
                    roles: values.role ? values.role : '',
                    status: 1,
                    page: current,
                    size: 10
                };
                let userData = await getUsers({}, postData);
                let dataSource = (userData && userData.content) || [];
                this.setState({
                    total: (userData && userData.pageinfo && userData.pageinfo.total) || 0,
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

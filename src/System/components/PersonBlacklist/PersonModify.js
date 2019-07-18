import React, { Component } from 'react';
import {
    Modal,
    Input,
    Form,
    Row,
    Col,
    Select,
    Switch,
    Upload
} from 'antd';
import './PersonModify.less';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;
class PersonModify extends Component {
    // export default class PersonModify extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        const {
            actions: { changeAdditionField },
            tags = [],
            platform: { tree = {} },
            modifyPer
        } = this.props;
        const addition = modifyPer;

        const user = getUser();
        let roles = [];
        if (addition && addition.groups && addition.groups instanceof Array) {
            addition.groups.map(ese => {
                roles.push(ese.name);
            });
        }
        let sectio = [];
        let sectionData = (tree && tree.bigTreeList) || [];
        if (addition && addition.sections && addition.sections instanceof Array) {
            sectionData.map(ies => {
                ies.children.map(ies1 => {
                    addition.sections.map(ie => {
                        if (ies1.No === ie) {
                            sectio.push(ies1.Name);
                        }
                    });
                });
            });
        }

        let defaultNurse = [];
        if (addition && addition.tags && addition.tags instanceof Array) {
            tags.map(rst => {
                addition.tags.map(item => {
                    if (rst.ID === item) {
                        defaultNurse.push(rst.NurseryName + '-' + rst.Factory);
                    }
                });
            });
        }
        if (addition && addition.account) {
            return (
                <Modal
                    onCancel={this.cancel.bind(this)}
                    visible={this.props.Modvisible}
                    width={1280}
                    onOk={this.onok.bind(this)}
                >
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        详情
                    </h1>
                    <Form>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem {...PersonModify.layout} label='用户名:'>
                                    <Input
                                        value={addition.username}
                                        placeholder='请输入用户名'
                                    />
                                </FormItem>
                                <FormItem {...PersonModify.layout} label='姓名:'>
                                    <Input
                                        placeholder='请输入姓名'
                                        value={addition.account.person_name}
                                    />
                                </FormItem>
                                <FormItem {...PersonModify.layout} label='性别:'>
                                    <Input
                                        placeholder='请选择性别'
                                        value={addition.basic_params.info.sex}
                                    />
                                </FormItem>
                                <FormItem
                                    {...PersonModify.layout}
                                    label='身份证号码:'
                                >
                                    <Input
                                        placeholder='请输入身份证号码'
                                        value={addition.id_num}
                                    />
                                </FormItem>
                                {user.username === 'admin' ? (
                                    <FormItem
                                        {...PersonModify.layout}
                                        label='部门编码'
                                    >
                                        <Input
                                            placeholder='部门编码'
                                            value={
                                                addition.account.organization.code
                                            }
                                        />
                                    </FormItem>
                                ) : (
                                    ''
                                )}
                                {addition.id ? (
                                    <FormItem {...PersonModify.layout} label='密码'>
                                        <Input
                                            disabled={!!addition.id}
                                            placeholder='请输入密码'
                                            value={addition.password}
                                        />
                                    </FormItem>
                                ) : (
                                    <FormItem
                                        {...PersonModify.layout}
                                        label='密码:'
                                    >
                                        <Input
                                            disabled={!!addition.id}
                                            placeholder='请输入密码'
                                            value={addition.password}
                                        />
                                    </FormItem>
                                )}

                                <FormItem {...PersonModify.layout} label='标段'>
                                    <Input
                                        placeholder='标段'
                                        value={sectio}
                                        style={{ width: '100%' }}
                                    >
                                        {/* {
                                            units ?
                                                units.map((item) => {
                                                    return <Option key={item.code} value={item.code} >{item.value}</Option>
                                                }) :
                                                ''
                                        } */}
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...PersonModify.layout} label='邮箱'>
                                    <Input
                                        placeholder='请输入邮箱'
                                        value={addition.email}
                                        onChange={changeAdditionField.bind(
                                            this,
                                            'email'
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    {...PersonModify.layout}
                                    label='手机号码:'
                                >
                                    <Input
                                        placeholder='请输入手机号码'
                                        value={addition.basic_params.info.phone}
                                    />
                                </FormItem>
                                <FormItem {...PersonModify.layout} label='职务:'>
                                    <Input
                                        placeholder='请选择职务'
                                        value={addition.title}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                                <FormItem {...PersonModify.layout} label='角色:'>
                                    <Input
                                        placeholder='请选择角色'
                                        value={roles}
                                        mode='multiple'
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                                {user.username === 'admin' ? (
                                    <FormItem
                                        {...PersonModify.layout}
                                        label='部门名称'
                                    >
                                        <Input
                                            placeholder='部门名称'
                                            value={
                                                addition.account.organization.name
                                            }
                                        />
                                    </FormItem>
                                ) : (
                                    ''
                                )}
                                <FormItem {...PersonModify.layout} label='苗圃'>
                                    <Input
                                        placeholder='苗圃'
                                        value={defaultNurse}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                                <Row>
                                    <Col span={8}>
                                        <FormItem
                                            {...PersonModify.layoutT}
                                            label='黑名单'
                                        >
                                            <Switch
                                                checked={
                                                    addition.id
                                                        ? addition.is_black === 1
                                                        : false
                                                }
                                            />
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={5}>
                                        <FormItem {...PersonModify.layoutT} label="关联用户">
                                            <Switch checked={addition.id ? addition.change_all : false} />
                                        </FormItem>
                                    </Col> */}
                                    <Col span={16}>
                                        <FormItem
                                            {...PersonModify.layoutR}
                                            label='原因'
                                        >
                                            <Input value={addition.black_remark} />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            );
        } else {
            return (null);
        }
    }

    onok = async (id) => {
        const {
            actions: { ModifyVisible }
        } = this.props;
        console.log('aaaa');
        await ModifyVisible(false);
    }
    cancel = async () => {
        const {
            actions: { ModifyVisible }
        } = this.props;
        console.log('nnnnn');

        await ModifyVisible(false);
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    static layoutT = {
        labelCol: { span: 18 },
        wrapperCol: { span: 6 }
    };
    static layoutR = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
}

export default Form.create()(PersonModify);

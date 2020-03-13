import React, { Component } from 'react';
import {
    Modal,
    Row,
    Col,
    Form,
    Input,
    Select,
    message
} from 'antd';
import { getUserIsDocument, getUser } from '_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
import { Promise } from 'es6-promise';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const RealName = (addition) => {
    return new Promise((resolve) => {
        fetch(`https://idcert.market.alicloudapi.com/idcard?idCard=${addition.idNum}&name=${addition.FullName}`, {
            headers: {
                'Authorization': 'APPCODE ' + 'c091fa7360bc48ff87a3471f028d5645'
            }
        }).then(rep => {
            return rep.json();
        }).then(rst => {
            if (rst.status === '01') {
                message.success('实名认证通过');
                resolve();
            } else {
                message.warning('实名认证失败，请确认信息是否正确');
            }
        });
    });
};

// export default class Addition extends Component {
class Addition extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            searchValue: '',
            idImgF: true,
            idImgZ: true,
            change_alValue: null
        };
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
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
        if (user.username && user.username === 'admin') {
            parentRoleType.map((type) => {
                systemRoles.push({
                    name: type && type.RoleName,
                    value: roles.filter(role => role.ParentID === type.ID)
                });
            });
        } else {
            let roleName = userRoles.RoleName;
            const rolea = userRoles.ParentID;
            parentRoleType.map((type) => {
                if (rolea === type.ID) {
                    systemRoles.push({
                        name: type && type.RoleName,
                        value: roles.filter(role => role.ParentID === type.ID)
                    });
                }
            });
            if (roleName === '施工文书') {
                parentRoleType.map((type) => {
                    // 获取到苗圃类型下的角色
                    if (type.RoleName === '苗圃') {
                        systemRoles.push({
                            name: type && type.RoleName,
                            value: roles.filter(role => role.ParentID === type.ID)
                        });
                    }
                });
                parentRoleType.map((type) => {
                    if (type.RoleName === '养护') {
                        systemRoles.push({
                            name: type && type.RoleName,
                            value: roles.filter(role => role.ParentID === type.ID)
                        });
                    }
                });
            }
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
    renderTitle () {
        const user = getUser();
        let userRoles = user.roles || '';
        var systemRoles = [];
        if (user.username && user.username === 'admin') {
            systemRoles.push({
                name: '苗圃职务',
                children: ['苗圃', '苗圃文书']
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
                    '测量员',
                    '施工整改人'
                ]
            });
            systemRoles.push({
                name: '监理职务',
                children: ['总监', '监理组长', '普通监理', '监理文书']
            });
            systemRoles.push({
                name: '业主职务',
                children: ['业主', '业主文书', '业主领导']
            });
            systemRoles.push({
                name: '供应商职务',
                children: ['供应商', '供应商文书']
            });
        } else {
            const rolea = userRoles.ParentID;
            switch (rolea) {
                case 0:
                    systemRoles.push({
                        name: '苗圃职务',
                        children: ['苗圃', '苗圃文书']
                    });
                    break;
                case 1:
                    systemRoles.push({
                        name: '苗圃职务',
                        children: ['苗圃']
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
                            '测量员',
                            '施工整改人'
                        ]
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
                        ]
                    });
                    break;
                case 3:
                    systemRoles.push({
                        name: '业主职务',
                        children: ['业主', '业主文书', '业主领导']
                    });
                    break;
                case 5:
                    systemRoles.push({
                        name: '供应商职务',
                        children: ['供应商', '供应商文书']
                    });
                    break;
                default:
                    systemRoles.push({
                        name: '施工职务',
                        children: ['普通员工']
                    });
                    break;
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

    checkPassWord = async (rule, value, callback) => {
        if (value) {
            // 密码正则
            let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
            // let reg = /^[a-zA-Z0-9_]{6,16}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                if (value) {
                    callback();
                } else {
                    callback(` 请输入6到16位（字母，数字，特殊字符组合）密码`);
                }
            } else {
                callback(` 请输入6到16位（字母，数字，特殊字符组合）密码`);
            }
        } else {
            callback();
        }
    }
    checkUserName = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[a-zA-Z0-9]{4,16}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                if (value) {
                    callback();
                } else {
                    callback(`请输入4到16位（字母，数字）用户名`);
                }
            } else {
                callback(`请输入4到16位（字母，数字）用户名`);
            }
        } else {
            callback();
        }
    }
    checkPersonEmail = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            // isNaN(value);
            if (reg.test(value)) {
                callback();
            } else {
                callback(`请输入正确的邮箱`);
            }
        } else {
            callback();
        }
    }
    checkPersonTelephone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[1]([3-9])[0-9]{9}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入正确的手机号`);
                }
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
    }
    // 获取项目的标段
    getUnits () {
        const {
            platform: {
                tree = {}
            },
            sidebar: {
                node = {}
            }
        } = this.props;
        let bigTreeList = tree.bigTreeList;
        let units = [];
        if (node && node.ID && node.Section) {
            let sections = node.Section.split(',');
            if (sections && sections instanceof Array) {
                sections.map((section) => {
                    let name = getSectionNameBySection(section, bigTreeList);
                    units.push({
                        code: section,
                        name: name
                    });
                });
            }
        }
        return units;
    }

    save = async () => {
        const {
            sidebar: { node } = {},
            actions: {
                postForestUser,
                getUsers,
                getTablePage
            }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log('values', values);
            if (!err) {
                if (!/^[\w@\.\+\-_]+$/.test(values.UserName)) {
                    message.warn('请输入英文字符、数字');
                    return;
                }
                if (!/^[a-zA-Z0-9_-]{4,16}$/.test(values.UserName)) {
                    message.warn('请输入4到16位（字母，数字，下划线，减号）');
                    return;
                }
                let orgID = '';
                if (node && node.OrgPK) {
                    orgID = node.OrgPK;
                } else {
                    orgID = node.ID;
                }
                let postUserPostData = {
                    Full_Name: values.FullName, // 姓名
                    User_Name: values.UserName, // 用户名
                    Org: orgID, // 组织机构
                    Phone: values.telephone, // 电话
                    Password: values.PassWord, // 密码
                    Duty: values.titles || '', // 职务
                    // Duty: '业主文书',
                    EMail: values.email || '',
                    Sex: values.sex ? 1 : 0, // 性别
                    Status: 1, // 状态
                    Section: values.section, // 标段
                    Number: values.idNum, // 身份证号码
                    Card: '', // 身份证正面照片
                    CardBack: '', // 身份证背面照片
                    Face: '',
                    Roles: [{
                        ID: Number(values.roles) // 角色ID
                        // ID: 8
                    }]
                };
                // 先进行实名认证再注册用户
                await RealName(values);
                let userData = await postForestUser({}, postUserPostData);
                console.log('userData', userData);
                if (userData && userData.code === 1) {
                    const msgs = JSON.parse(userData.msg);
                    if (msgs && msgs.status && msgs.status === 400 && msgs.error &&
                            msgs.error === 'This id_num is blacklist'
                    ) {
                        message.warning('身份证号已经加入黑名单');
                        return;
                    } else {
                        message.info('新增人员成功');
                    }
                    let paget = '';
                    const totals = this.props.getTablePages.total;
                    if (totals >= 9) {
                        if (totals.toString().length > 1) {
                            const strs1 = totals.toString();
                            const strs2 = strs1.substring(
                                0,
                                strs1.length - 1
                            );
                            paget = strs2 * 1 + 1;
                        } else {
                            paget = 1;
                        }
                    } else {
                        paget = 1;
                    }
                    let getUserPostData = {
                        org: orgID,
                        page: paget,
                        size: 10
                    };
                    let uerList = await getUsers({}, getUserPostData);
                    if (uerList && uerList.content && uerList.pageinfo) {
                        let pagination = {
                            current: paget,
                            total: uerList.pageinfo.total
                        };
                        getTablePage(pagination);
                    }
                    this.props.handleCloseAdditionModal();
                } else {
                    if (userData.code === 2) {
                        message.warn('用户名已存在！');
                    } else if (userData.code === 0) {
                        if (userData.msg === '账户注册的苗圃基地已被拉黑！') {
                            message.warn('账户注册的苗圃基地已被拉黑！');
                        } else {
                            message.warn('新增人员失败');
                        }
                    } else {
                        message.warn('新增人员失败');
                    }
                }
            }
        });
    }

    cancel () {
        this.props.handleCloseAdditionModal();
    }

    render () {
        const {
            form: {
                getFieldDecorator
            },
            sidebar: {
                node = {}
            }
        } = this.props;
        const user = getUser();
        // 用户是否为文书
        let userIsDocument = getUserIsDocument();
        let units = this.getUnits();
        return (
            <div>
                <Modal
                    title={'新增人员'}
                    visible
                    className='large-modal'
                    width='80%'
                    maskClosable={false}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem
                                    {...Addition.layout}
                                    label='用户名:'
                                >
                                    {getFieldDecorator('UserName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入4到16位（字母，数字）用户名',
                                                max: 15
                                            },
                                            {
                                                validator: this.checkUserName
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入用户名（不区分大小写）'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='姓名:'
                                >
                                    {getFieldDecorator('FullName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入姓名'
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入姓名'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='性别:'
                                >
                                    {getFieldDecorator('sex', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择性别'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择性别'
                                            style={{ width: '100%' }}
                                        >
                                            <Option key='女' value={1}>女</Option>
                                            <Option key='男' value={0}>男</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='身份证号码:'
                                >
                                    {getFieldDecorator('idNum', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入身份证号码'
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入身份证号码'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='密码:'
                                >
                                    {getFieldDecorator('PassWord', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入6到16位（字母，数字，特殊字符组合）密码',
                                                max: 15
                                            },
                                            {
                                                validator: this.checkPassWord
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入6到16位（字母，数字，特殊字符组合）密码'
                                        />
                                    )}
                                </FormItem>

                                <FormItem {...Addition.layout} label='标段'>
                                    {getFieldDecorator('section', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择标段'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='标段'
                                            style={{ width: '100%' }}
                                        >
                                            {units
                                                ? units.map(item => {
                                                    return (
                                                        <Option
                                                            key={item.code}
                                                            value={item.code}
                                                        >
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })
                                                : ''}
                                        </Select>
                                    )}

                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...Addition.layout} label='邮箱'>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入邮箱'
                                            },
                                            {
                                                validator: this.checkPersonEmail
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入邮箱'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='手机号码:'
                                >
                                    {getFieldDecorator('telephone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入手机号码'
                                            },
                                            {
                                                validator: this.checkPersonTelephone
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入手机号码'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='职务:'
                                >
                                    {getFieldDecorator('titles', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择职务'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择职务'
                                            style={{ width: '100%' }}
                                        >
                                            {this.renderTitle()}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Addition.layout}
                                    label='角色:'
                                >
                                    {getFieldDecorator('roles', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择角色'
                                            }
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
                                {(userIsDocument) ? (
                                    <FormItem
                                        {...Addition.layout}
                                        label='部门名称'
                                    >
                                        <Input
                                            placeholder='部门名称'
                                            value={(node && node.OrgName) || ''}
                                            readOnly
                                        />
                                    </FormItem>
                                ) : (
                                    ''
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(Addition);

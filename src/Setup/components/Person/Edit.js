import React, { Component } from 'react';
import {
    Modal,
    Row,
    Col,
    Form,
    Input,
    Select,
    message,
    Switch,
    TreeSelect
} from 'antd';
import { getUserIsDocument, getUser } from '_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;

const RealName = (value) => {
    return new Promise((resolve) => {
        fetch(`https://idcert.market.alicloudapi.com/idcard?idCard=${value.idNum}&name=${value.FullName}`, {
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

class Edit extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            searchValue: '',
            newKey: Math.random(),
            idImgF: true,
            idImgZ: true,
            isBlackChecked: null, // 黑名单按键
            blackRemarkValue: null,
            orgSelect: ''
        };
    }
    // 设置登录用户所在的公司的部门项,在编辑用户时，可以切换部门
    static orgloop (data = []) {
        if (data.length === 0) {
            return;
        }
        return data.map((item) => {
            if (item && item.ID && item.children && item.children.length > 0) {
                return (
                    <TreeNode
                        value={item.ID}
                        key={item.ID}
                        title={`${item.OrgName}`}
                    >
                        {
                            Edit.orgloop(item.children)
                        }
                    </TreeNode>
                );
            } else {
                if (item && item.ID) {
                    return (
                        <TreeNode
                            value={item.ID}
                            key={item.ID}
                            title={`${item.OrgName}`}
                        />
                    );
                }
            }
        });
    };
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
        let user = getUser();
        let userRoles = user.roles || '';
        var systemRoles = [];
        if (user.username === 'admin') {
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
    componentDidMount = async () => {
        const {
            form: {
                setFieldsValue
            },
            editUserRecord
        } = this.props;
        try {
            let roles = '';
            if (editUserRecord.Roles && editUserRecord.Roles instanceof Array && editUserRecord.Roles.length > 0) {
                roles = String(editUserRecord.Roles[0].ID);
            }
            await setFieldsValue({
                UserName: editUserRecord.User_Name,
                FullName: editUserRecord.Full_Name,
                sex: editUserRecord.Sex,
                idNum: editUserRecord.Number,
                section: editUserRecord.Section,
                email: editUserRecord.EMail,
                telephone: editUserRecord.Phone,
                titles: editUserRecord.Duty,
                roles: roles
            });
            // 用户是否为文书
            let userIsDocument = getUserIsDocument();
            // let userIsDocument = true;
            if (editUserRecord && editUserRecord.Org) {
                this.setState({
                    orgSelect: (editUserRecord && editUserRecord.Org) || ''
                });
                if (userIsDocument) {
                    await setFieldsValue({
                        orgName: (editUserRecord && editUserRecord.Org) || ''
                    });
                }
            } else {
                message.warning('请重新选择部门');
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    // 获取项目的标段
    getUnits (sections) {
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
    handleOrgName (value) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        if (value) {
            this.setState({
                orgSelect: value
            });
        } else {
            setFieldsValue({
                orgName: undefined
            });
            this.setState({
                orgSelect: ''
            });
        }
    }
    changeblack (checked) {
        this.setState({
            isBlackChecked: checked
        });
    }
    changeBlackRemark (e) {
        this.setState({
            blackRemarkValue: e.target.value
        });
    }
    save = async () => {
        const {
            actions: {
                getUsers,
                putForestUser,
                getTablePage,
                postForestUserBlackList
            },
            editUserRecord
        } = this.props;
        const {
            isBlackChecked,
            blackRemarkValue,
            orgSelect
        } = this.state;
        if (editUserRecord && editUserRecord.ID) {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    // 先进行实名认证再注册用户
                    await RealName(values);
                    // 拉黑处理
                    if (isBlackChecked) {
                        let blackPostData = {
                            id: editUserRecord.ID + '',
                            is_black: 1,
                            black_remark: blackRemarkValue
                        };
                        let blackData = await postForestUserBlackList({}, blackPostData);
                        if (blackData && blackData.code && blackData.code === 1) {
                            message.success('人员拉黑成功');
                        } else {
                            message.error('人员拉黑失败');
                        }
                    }
                    // 修改人员信息
                    let putUserPostData = {
                        ID: editUserRecord.ID, // 用户ID
                        Full_Name: values.FullName, // 姓名
                        User_Name: values.UserName, // 用户名
                        Org: orgSelect, // 组织机构
                        Phone: values.telephone, // 电话
                        Duty: values.titles, // 职务
                        EMail: values.email,
                        Sex: values.sex ? 1 : 0, // 性别
                        Status: 1, // 状态
                        Section: values.section, // 标段
                        Number: values.idNum, // 身份证号码
                        Card: '', // 身份证正面照片
                        CardBack: '', // 身份证背面照片
                        Face: '',
                        Roles: [{ // 角色
                            ID: Number(values.roles) // 角色ID
                        }]
                    };
                    let userData = await putForestUser({}, putUserPostData);
                    if (userData && userData.code && userData.code === 1) {
                        message.info('修改人员成功');
                        // 之前不修改人员的部门   所以不需要重新获取人员列表 但是现在要修改部门   所以要重新获取人员列表
                        let page = this.props.getTablePages.current;
                        let getUserPostData = {
                            org: orgSelect,
                            page: page,
                            size: 10
                        };
                        let userList = await getUsers({}, getUserPostData);
                        if (userList && userList.content && userList.pageinfo) {
                            let pagination = {
                                current: page,
                                total: userList.pageinfo.total
                            };
                            getTablePage(pagination);
                        }
                        await this.props.handleCloseEditModal();
                    } else {
                        message.warn('修改人员失败');
                    }
                }
            });
        }
    }

    cancel () {
        this.props.handleCloseEditModal();
    }
    render () {
        const {
            form: {
                getFieldDecorator
            },
            companyOrgTree = {}
        } = this.props;
        const {
            isBlackChecked,
            blackRemarkValue
        } = this.state;
        const user = getUser();
        console.log('companyOrgTree', companyOrgTree);
        // 用户是否为文书
        let userIsDocument = getUserIsDocument();
        // let userIsDocument = true;
        let units = this.getUnits();
        // 用户是否为管理员
        let userIsAdmin = false;
        if (user.username === 'admin') {
            userIsAdmin = true;
        }
        return (
            <div>
                <Modal
                    title={'编辑人员信息'}
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
                                    {...Edit.layout}
                                    label='用户名:'
                                >
                                    {getFieldDecorator('UserName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入用户名，且不超过15位',
                                                max: 15
                                            }
                                        ]
                                    })(
                                        <Input
                                            readOnly
                                            placeholder='请输入用户名'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Edit.layout}
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
                                            readOnly
                                            placeholder='请输入姓名'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Edit.layout}
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
                                    {...Edit.layout}
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
                                            readOnly
                                        />
                                    )}
                                </FormItem>
                                <FormItem {...Edit.layout} label='标段'>
                                    {getFieldDecorator('section', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择标段'
                                            }
                                        ]
                                    })(
                                        <Select
                                            allowClear
                                            placeholder='请选择标段'
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
                                <FormItem {...Edit.layout} label='邮箱'>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入邮箱'
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入邮箱'
                                        />
                                    )}

                                </FormItem>
                                <FormItem
                                    {...Edit.layout}
                                    label='手机号码:'
                                >
                                    {getFieldDecorator('telephone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入手机号码'
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入手机号码'
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...Edit.layout}
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
                                    {...Edit.layout}
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
                                {
                                    userIsDocument ? (
                                        <FormItem
                                            {...Edit.layout}
                                            label='部门名称'
                                        >
                                            {getFieldDecorator('orgName', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择部门'
                                                    }
                                                ]
                                            })(
                                                <TreeSelect
                                                    showSearch
                                                    treeDefaultExpandAll
                                                    onChange={this.handleOrgName.bind(this)}
                                                >
                                                    {
                                                        Edit.orgloop([companyOrgTree])
                                                    }
                                                </TreeSelect>
                                            )}
                                        </FormItem>
                                    ) : (
                                        ''
                                    )
                                }
                                <Row>
                                    <Col span={8}>
                                        {userIsAdmin ? (
                                            <FormItem
                                                {...Edit.layoutT}
                                                label='黑名单'
                                            >
                                                <Switch
                                                    checked={isBlackChecked}
                                                    onChange={this.changeblack.bind(
                                                        this
                                                    )}
                                                />
                                            </FormItem>
                                        ) : (
                                            ''
                                        )}
                                    </Col>
                                    <Col span={16}>
                                        {userIsAdmin ? (
                                            <FormItem
                                                {...Edit.layoutR}
                                                label='原因'
                                            >
                                                <Input
                                                    value={blackRemarkValue}
                                                    onChange={this.changeBlackRemark.bind(
                                                        this
                                                    )}
                                                />
                                            </FormItem>
                                        ) : (
                                            ''
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(Edit);

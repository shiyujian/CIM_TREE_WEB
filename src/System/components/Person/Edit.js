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
import { getUserIsDocument } from '_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
window.config = window.config || {};
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

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
            change_alValue: null,
            black_remarkValue: null,
            section: ''
        };
    }
    renderContent () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const {
            platform: { roles = [] },
            sidebar: {
                node = {}
            } = {}
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
                        // 对于非苗圃基地的部门，施工方不能选择苗圃角色
                        if (node && node.topParent === '苗圃基地') {
                            systemRoles.push({
                                name: '苗圃角色',
                                value: roles.filter(role => role.grouptype === 0)
                            });
                        }
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
                children: ['苗圃', '苗圃文书'],
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
                    '测量员',
                    '施工整改人'
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
                name: '供应商职务',
                children: ['供应商', '供应商文书'],
                value: roles.filter(role => role.grouptype === 6)
            });
        } else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype;
                switch (rolea) {
                    case 0:
                        systemRoles.push({
                            name: '苗圃职务',
                            children: ['苗圃', '苗圃文书'],
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
                                '测量员',
                                '施工整改人'
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
                            name: '供应商职务',
                            children: ['供应商', '供应商文书'],
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
    componentDidMount () {
        const {
            actions: { getRoles }
        } = this.props;
        getRoles();
    }
    componentDidUpdate (prevProps, prevState) {
        const {
            sidebar,
            editUserVisible,
            isSection,
            actions: { changeAdditionField },
            addition
        } = this.props;
        if (
            editUserVisible &&
            editUserVisible !== prevProps.editUserVisible
        ) {
            let node = sidebar && sidebar.node;
            if (!node) {
                return;
            }
            let code = node.code;
            let name = node.name;
            let pk = node.pk;
            changeAdditionField('org_code', code);
            changeAdditionField('organizationName', name);
            changeAdditionField('organizationPk', pk);
            if (addition && addition.account && addition.account.is_black === 1) {
                this.setState({
                    isBlackChecked: true
                });
                changeAdditionField('is_black', 1);
            } else {
                this.setState({
                    isBlackChecked: false
                });
                changeAdditionField('is_black', addition.account.is_black);
            }
        }
        if (isSection && isSection instanceof Array && isSection.length > 0 && isSection !== prevProps.isSection) {
            this.setState({
                section: isSection[0]
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            addition = {},
            editUserVisible,
            actions: { changeAdditionField },
            orgTreeSelect = [],
            isSection = []
        } = this.props;
        const {
            section
        } = this.state;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        // 用户是否为文书
        let userIsDocument = getUserIsDocument();
        let units = this.getUnits(isSection);
        return (
            <div>
                {editUserVisible && (
                    <Modal
                        title={'编辑人员信息'}
                        visible
                        className='large-modal'
                        width='80%'
                        maskClosable={false}
                        key={this.state.newKey}
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
                                            initialValue: `${
                                                addition.username
                                                    ? addition.username
                                                    : ''
                                            }`,
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
                                            initialValue: `${
                                                addition.person_name
                                                    ? addition.person_name
                                                    : ''
                                            }`,
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
                                        {getFieldDecorator('sexName', {
                                            initialValue: `${
                                                addition.gender
                                                    ? addition.gender
                                                    : ''
                                            }`,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择性别'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择性别'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'gender'
                                                )}
                                                style={{ width: '100%' }}
                                            >
                                                <Option key='女' value='女'>女</Option>
                                                <Option key='男' value='男'>男</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Edit.layout}
                                        label='身份证号码:'
                                    >
                                        {getFieldDecorator('idcard', {
                                            initialValue: `${
                                                addition.id_num
                                                    ? addition.id_num
                                                    : ''
                                            }`,
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
                                    {(user.is_superuser) ? (
                                        <FormItem
                                            {...Edit.layout}
                                            label='部门编码'
                                        >
                                            <Input
                                                placeholder='部门编码'
                                                value={addition.org_code}
                                                readOnly
                                            />
                                        </FormItem>
                                    ) : (
                                        ''
                                    )}
                                    <FormItem
                                        {...Edit.layout}
                                        label='密码'
                                    >
                                        <Input
                                            disabled
                                            placeholder='请输入密码'
                                        />
                                    </FormItem>

                                    <FormItem {...Edit.layout} label='标段'>
                                        <Select
                                            placeholder='标段'
                                            value={
                                                addition.id
                                                    ? addition.sections
                                                    : section
                                            }
                                            onChange={this.changeSection.bind(
                                                this
                                            )}
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
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...Edit.layout} label='邮箱'>
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
                                        {...Edit.layout}
                                        label='手机号码:'
                                    >
                                        {getFieldDecorator('telephone', {
                                            initialValue: `${
                                                addition.person_telephone
                                                    ? addition.person_telephone
                                                    : ''
                                            }`,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入手机号码'
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入手机号码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'person_telephone'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Edit.layout}
                                        label='职务:'
                                    >
                                        {getFieldDecorator('titles', {
                                            initialValue: `${
                                                addition.title
                                                    ? addition.title
                                                    : ''
                                            }`,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择职务'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择职务'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'title'
                                                )}
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
                                        {getFieldDecorator('rolesNmae', {
                                            initialValue: addition.roles,
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
                                                onChange={this.changeRoles.bind(
                                                    this
                                                )}
                                                style={{ width: '100%' }}
                                            >
                                                {this.renderContent()}
                                            </Select>
                                        )}
                                    </FormItem>
                                    {(user.is_superuser || userIsDocument) ? (
                                        addition.id
                                            ? (<FormItem
                                                {...Edit.layout}
                                                label='部门名称'
                                            >
                                                {getFieldDecorator('orgName', {
                                                    initialValue: addition.organizationName,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择部门'
                                                        }
                                                    ]
                                                })(
                                                    <TreeSelect
                                                        showSearch
                                                        treeDefaultExpandAll
                                                        onChange={this.handleOrgName.bind(this)}
                                                    >
                                                        {orgTreeSelect}
                                                    </TreeSelect>
                                                )}

                                            </FormItem>)
                                            : (
                                                <FormItem
                                                    {...Edit.layout}
                                                    label='部门名称'
                                                >
                                                    <Input
                                                        placeholder='部门名称'
                                                        value={addition.organizationName}
                                                        readOnly
                                                    />
                                                </FormItem>
                                            )
                                    ) : (
                                        ''
                                    )}
                                    <Row>
                                        <Col span={8}>
                                            {user.is_superuser ? (
                                                <FormItem
                                                    {...Edit.layoutT}
                                                    label='黑名单'
                                                >
                                                    <Switch
                                                        checked={
                                                            addition.id
                                                                ? addition.is_black ===
                                                                  1
                                                                : false
                                                        }
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
                                            {user.is_superuser ? (
                                                <FormItem
                                                    {...Edit.layoutR}
                                                    label='原因'
                                                >
                                                    <Input
                                                        value={
                                                            addition.black_remark
                                                        }
                                                        onChange={this.changeBlack_remark.bind(
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
                )}
            </div>
        );
    }

    // 获取项目的标段
    getUnits (sections) {
        const {
            platform: { tree = {} }
        } = this.props;
        let bigTreeList = tree.bigTreeList;
        let units = [];
        sections.map((section) => {
            let name = getSectionNameBySection(section, bigTreeList);
            units.push({
                code: section,
                name: name
            });
        });
        return units;
    }

    // 设置部门的code和pk
    handleOrgName (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        value = JSON.parse(value);
        // 设置编辑人员时所选部门code
        changeAdditionField('org_code', value && value.code);
        // 设置编辑人员时所选部门名称
        changeAdditionField('organizationName', value && value.name);
        // 设置编辑人员时所选部门pk
        changeAdditionField('organizationPk', value && value.pk);
    }

    changeRoles (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('roles', [value]);
    }
    changeSection (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        this.setState({
            section: value
        });
        changeAdditionField('sections', [value]);
    }
    changeblack (checked) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        this.setState({
            isBlackChecked: checked
        });
        if (checked) {
            changeAdditionField('is_black', 1);
        } else {
            changeAdditionField('is_black', 0);
        }
    }
    changeBlack_remark (value) {
        const {
            addition = {},
            actions: { changeAdditionField }
        } = this.props;
        if (value !== addition.black_remark) {
            this.setState({ black_remarkValue: value });
            changeAdditionField('black_remark', value);
        }
    }

    save = async () => {
        const {
            addition = {},
            sidebar: { node } = {},
            actions: {
                clearAdditionField,
                getUsers,
                postUploadFilesImg,
                putForestUser,
                getTablePage,
                getSwitch,
                postForestUserBlackList,
                changeEditUserVisible
            }
        } = this.props;
        const {
            isBlackChecked
        } = this.state;
        const roles = addition.roles || [];
        if (addition.id) {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    // 拉黑处理
                    if (isBlackChecked) {
                        let blackPostData = {
                            id: addition.id,
                            is_black: 1,
                            black_remark: addition.black_remark,
                            change_all: true
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
                        id: addition.id,
                        username: addition.username,
                        email: addition.email,
                        account: {
                            person_name: addition.person_name,
                            person_type: 'C_PER',
                            person_avatar_url: '',
                            person_signature_url: '',
                            organization: {
                                pk: addition.organizationPk,
                                code: addition.org_code,
                                obj_type: 'C_ORG',
                                rel_type: 'member',
                                name: addition.organizationName
                            }
                        },
                        tags: addition.tags || [],
                        sections: addition.sections,
                        groups: roles.map(role => +role),
                        is_active: isBlackChecked ? false : addition.is_active,
                        id_num: addition.id_num,
                        id_image: [],
                        basic_params: {
                            info: {
                                电话: addition.person_telephone || '',
                                性别: addition.gender || '',
                                技术职称: addition.title || '',
                                phone: addition.person_telephone || '',
                                sex: addition.gender || '',
                                duty: ''
                            }
                        },
                        extra_params: {},
                        title: addition.title || ''
                    };
                    let userData = await putForestUser({}, putUserPostData);
                    if (userData.code === 1) {
                        message.info('修改人员成功');
                        await getSwitch();
                        await postUploadFilesImg();
                        await clearAdditionField();
                        await changeEditUserVisible(false);
                        // 之前不修改人员的部门   所以不需要重新获取人员列表 但是现在要修改部门   所以要重新获取人员列表
                        const codes = node.code;
                        let userList = await getUsers({}, { org_code: codes, page: 1 });
                        let pagination = {
                            current: 1,
                            total: userList.count
                        };
                        await getTablePage(pagination);
                        this.setState({
                            newKey: Math.random(),
                            isBlackChecked: null,
                            black_remarkValue: null
                        });
                    } else {
                        message.warn('修改人员失败');
                    }
                }
            });
        }
    }

    cancel () {
        const {
            actions: {
                clearAdditionField,
                getSwitch,
                changeEditUserVisible
            }
        } = this.props;
        getSwitch();
        changeEditUserVisible(false);
        this.setState({
            newKey: Math.random(),
            isBlackChecked: null,
            idImgF: true,
            idImgZ: true
        });
        clearAdditionField();
    }

    static collect = (node = {}) => {
        const { code } = node;
        let rst = [];
        rst.push(code);
        return rst;
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
}
export default Form.create()(Edit);

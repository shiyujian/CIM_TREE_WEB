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
import { getUserIsDocument } from '_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
import { Promise } from 'es6-promise';
window.config = window.config || {};
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const RealName = (addition) => {
    return new Promise((resolve) => {
        fetch(`http://idcert.market.alicloudapi.com/idcard?idCard=${addition.id_num}&name=${addition.person_name}`, {
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
            newKey: Math.random(),
            idImgF: true,
            idImgZ: true,
            change_alValue: null,
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
            addition,
            isSection,
            actions: { changeAdditionField }
        } = this.props;
        if (
            addition &&
            addition.visible &&
            (!prevProps.addition || (addition.visible !== prevProps.addition.visible))
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
            actions: { changeAdditionField },
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
                {addition.visible && (
                    <Modal
                        title={'新增人员'}
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
                                        {...Addition.layout}
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
                                                placeholder='请输入用户名'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'username'
                                                )}
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
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'person_name'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='性别:'
                                    >
                                        {getFieldDecorator('sexName', {
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
                                        {...Addition.layout}
                                        label='身份证号码:'
                                    >
                                        {getFieldDecorator('idcard', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入身份证号码'
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入身份证号码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'id_num'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    {(user.is_superuser) ? (
                                        <FormItem
                                            {...Addition.layout}
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
                                        {...Addition.layout}
                                        label='密码:'
                                    >
                                        {getFieldDecorator('PassWord', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入密码，且不超过15位',
                                                    max: 15
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入密码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'password'
                                                )}
                                            />
                                        )}
                                    </FormItem>

                                    <FormItem {...Addition.layout} label='标段'>
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
                                            // mode='multiple'
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
                                    <FormItem {...Addition.layout} label='邮箱'>
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
                                        {...Addition.layout}
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
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'person_telephone'
                                                )}
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
                                        {...Addition.layout}
                                        label='角色:'
                                    >
                                        {getFieldDecorator('rolesNmae', {
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
                                                // mode='multiple'
                                                style={{ width: '100%' }}
                                            >
                                                {this.renderContent()}
                                            </Select>
                                        )}
                                    </FormItem>
                                    {(user.is_superuser || userIsDocument) ? (
                                        <FormItem
                                            {...Addition.layout}
                                            label='部门名称'
                                        >
                                            <Input
                                                placeholder='部门名称'
                                                value={addition.organizationName}
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
    changeChange_all (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        this.setState({ change_alValue: value });
        changeAdditionField('change_all', value);
    }

    save = async () => {
        const {
            addition = {},
            sidebar: { node } = {},
            actions: {
                postForestUser,
                clearAdditionField,
                getUsers,
                postUploadFilesImg,
                getTablePage
            }
        } = this.props;
        const {
            section
        } = this.state;
        const roles = addition.roles || [];
        if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
            message.warn('请输入英文字符、数字');
        } else {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    let postUserPostData = {
                        is_person: true,
                        username: addition.username,
                        email: addition.email || '',
                        password: addition.password,
                        account: {
                            person_code: addition.code,
                            person_name: addition.person_name,
                            person_type: 'C_PER',
                            person_avatar_url: '',
                            person_signature_url: '',
                            organization: {
                                pk: node.pk,
                                code: node.code,
                                obj_type: 'C_ORG',
                                rel_type: 'member',
                                name: node.name
                            }
                        },
                        tags: addition.tags || [],
                        sections: addition.id
                            ? addition.sections
                            : [section],
                        groups: roles.map(role => +role),
                        is_active: true,
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
                    // 先进行实名认证再注册用户
                    let realNameData = await RealName(addition);
                    console.log('realNameData', realNameData);
                    let userData = await postForestUser({}, postUserPostData);
                    if (userData.code === 1) {
                        const msgs = JSON.parse(userData.msg);
                        if (
                            msgs.status === 400 &&
                                    msgs.error === 'This id_num is blacklist'
                        ) {
                            message.warning('身份证号已经加入黑名单');
                            return;
                        } else {
                            message.info('新增人员成功');
                        }
                        await clearAdditionField();
                        await postUploadFilesImg();
                        const codes = Addition.collect(node);
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
                        let uerList = await getUsers({}, { org_code: codes, page: paget });
                        let pagination = {
                            current: paget,
                            total: uerList.count
                        };
                        getTablePage(pagination);
                        this.setState({
                            newKey: Math.random()
                        });
                    } else {
                        if (userData.code === 2) {
                            message.warn('用户名已存在！');
                        } else if (userData.code === 0) {
                            if (userData.msg === '账户注册的苗圃基地已被拉黑！') {
                                message.warn('账户注册的苗圃基地已被拉黑！');
                            } else {
                                message.warn('新增人员失败');
                            }
                        }
                    }
                }
            });
        }
    }

    cancel () {
        const {
            actions: {
                clearAdditionField,
                getSwitch
            }
        } = this.props;
        getSwitch();
        this.setState({
            newKey: Math.random(),
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
export default Form.create()(Addition);

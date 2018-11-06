import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    DatePicker,
    Select
} from 'antd';
import { getUserIsManager, getCompanyDataByOrgCode } from '../../../_platform/auth';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

class CountFilter extends Component {
    static propTypes = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    constructor (props) {
        super(props);
        this.state = {
            groupArray: [],
            start: '',
            end: '',
            statusArray: [],
            permission: false,
            userCompany: ''
        };
        this.companyList = [];
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getOrgTree
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
                await getTreeNodeList();
            }
            this.companyList = [];
            // 是否为业主或管理员
            let permission = getUserIsManager();
            if (permission) {
                if (!(tree && tree.org && tree.org.children && tree.org.children instanceof Array && tree.org.children.length > 0)) {
                    let orgData = await getOrgTree({}, { depth: 4 });
                    console.log('orgData', orgData);
                    await orgData.children.map(async (child) => {
                        if (child.name !== '苗圃基地' && child.name !== '供应商') {
                            await this.getCompanyList(child);
                        }
                    });
                } else {
                    await tree.org.children.map(async (child) => {
                        if (child.name !== '苗圃基地' && child.name !== '供应商') {
                            await this.getCompanyList(child);
                        }
                    });
                }
            }
            this.setState({
                permission
            });
            await this.getUserCompany();
            console.log('this.companyList', this.companyList);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    // 获取用户自己的公司信息
    getUserCompany = async () => {
        const {
            actions: {
                getOrgTreeByCode
            },
            form: { setFieldsValue }
        } = this.props;
        try {
            let user = localStorage.getItem('QH_USER_DATA');
            user = JSON.parse(user);
            // admin没有部门
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                let userOrgCode = user.account.org_code;
                let parentData = await getCompanyDataByOrgCode(userOrgCode, getOrgTreeByCode);
                let companyOrgCode = parentData.code;
                await setFieldsValue({
                    org_code: companyOrgCode
                });
                this.setState({
                    userCompany: companyOrgCode
                });
                // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                await this.getCheckGroupList(companyOrgCode);
                await this.query();
            }
        } catch (e) {
            console.log('getUserCompany', e);
        }
    }
    // 查找所有的公司的List
    getCompanyList = async (data) => {
        if (data && data.extra_params && data.extra_params.companyStatus) {
            if (data.extra_params.companyStatus === '项目') {
                if (data && data.children && data.children.length > 0) {
                    await data.children.map((child) => {
                        return this.getCompanyList(child);
                    });
                }
            } else if (data.extra_params.companyStatus === '公司') {
                await this.companyList.push(data);
            }
        }
    }
    // 公司选择
    handleOrgSelectChange = async (value) => {
        const {
            form: { setFieldsValue }
        } = this.props;
        const {
            permission
        } = this.state;
        await setFieldsValue({
            org_code: value
        });
        // 非业主账户只能查找自己的公司的考勤群体
        if (permission) {
            await this.getCheckGroupList(value);
        }
    }
    // 根据选择的公司进行设置考勤群体
    getCheckGroupList = async (value) => {
        const {
            actions: { getCheckGroup }
        } = this.props;
        let groupArray = [];
        let groupList = await getCheckGroup({}, {org_code: value});
        groupList.map(group => {
            groupArray.push(
                <Option key={group.id} value={group.id}>
                    {group.name}
                </Option>
            );
        });
        this.setState({
            groupArray: groupArray
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

    changeFormDate (value, results) {
        this.setState({
            start: results[0],
            end: results[1]
        });
    }

    onCheckinChange (value) { // 出勤选择下拉框和状态选择下拉框联动
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({
            status: undefined
        });
        let statusArray = [];
        if (value === 'y') { // 出勤时可以选择的状态有正常打卡,迟到,和早退
            let arr = [{label: '正常打卡', value: 4}, {label: '迟到', value: 2}, {label: '早退', value: 3}];
            arr.map(p => {
                statusArray.push(
                    <Option key={p.value} value={p.value}>
                        {p.label}
                    </Option>
                );
            });
        } else if (value === 'n') { // 缺勤时可以选择的状态有打卡一次
            let arr = [{label: '未打卡', value: 1}];
            arr.map(p => {
                statusArray.push(
                    <Option key={p.value} value={p.value}>
                        {p.label}
                    </Option>
                );
            });
        }
        this.setState({
            statusArray: statusArray
        });
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { groupArray, statusArray } = this.state;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='公司'>
                                    {getFieldDecorator('org_code', {

                                    })(
                                        <Select
                                            placeholder='请选择公司'
                                            onChange={this.handleOrgSelectChange.bind(
                                                this
                                            )}
                                        >
                                            {
                                                this.companyList.map((company) => {
                                                    return <Option title={company.name} key={company.code} value={company.code}>
                                                        {company.name}
                                                    </Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='考勤群体'>
                                    {getFieldDecorator('group', {

                                    })(
                                        <Select placeholder='请选择考勤群体'>
                                            {groupArray}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='姓名'>
                                    {getFieldDecorator('name', {

                                    })(
                                        <Input placeholder='请输入姓名' />
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
                                <FormItem {...CountFilter.layout} label='时间'>
                                    {getFieldDecorator('searchDate', {

                                    })(
                                        <RangePicker
                                            onChange={this.changeFormDate.bind(
                                                this
                                            )}
                                            size='default'
                                            format='YYYY-MM-DD'
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='出勤'>
                                    {getFieldDecorator('checkin', {

                                    })(
                                        <Select placeholder='请选择是否出勤' onChange={this.onCheckinChange.bind(
                                            this
                                        )}>
                                            <Option
                                                key={'y'}
                                                value={'y'}
                                            >
                                                出勤
                                            </Option>
                                            <Option
                                                key={'n'}
                                                value={'n'}
                                            >
                                                缺勤
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='状态'>
                                    {getFieldDecorator('status', {

                                    })(
                                        <Select placeholder='请选择状态'>
                                            {statusArray}
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
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='角色'>
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
                                <FormItem {...CountFilter.layout} label='职务'>
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
                </Row>
            </Form>
        );
    }

    query () {
        const {
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            console.log('err', err);
            console.log('values', values);
            let params = {};
            params.org_code = values.org_code ? values.org_code : '';
            params.group = values.group ? values.group : '';
            params.name = values.name ? values.name : '';
            if (values.searchDate) {
                params.start = this.state.start;
                params.end = this.state.end;
            }
            params.checkin = values.checkin ? values.checkin : '';
            if (values.status === 2) { // 迟到默认可查询状态5
                params.status = values.status + ',5';
            } else if (values.status === 3) { // 早退默认可查询状态5
                params.status = values.status + ',5';
            } else {
                params.status = values.status ? values.status : '';
            }
            params.role = values.role ? values.role : '';
            params.duty = values.duty ? values.duty : '';
            this.props.query(1, params);
        });
    }
    clear () {
        const {
            form: { setFieldsValue }
        } = this.props;
        const {
            userCompany
        } = this.state;
        setFieldsValue({
            checkin: undefined,
            duty: undefined,
            group: undefined,
            name: undefined,
            org_code: userCompany || undefined,
            role: undefined,
            searchDate: undefined,
            status: undefined
        });
        // this.props.form.resetFields();
    }
}
export default Form.create()(CountFilter);

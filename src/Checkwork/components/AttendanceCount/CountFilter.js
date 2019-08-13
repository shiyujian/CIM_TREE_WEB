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
import {
    getUser,
    getCompanyDataByOrgCode,
    getUserIsManager
} from '_platform/auth';
import {ORGTYPE} from '_platform/api';
import { handleFilterData } from '../auth';
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
            permission: false,
            userCompany: ''
        };
        this.companyList = [];
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getOrgTreeByOrgType
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
                await getTreeNodeList();
            }
            this.companyList = [];
            // 是否为业主或管理员
            // let permission = true;
            let permission = getUserIsManager();
            if (permission) {
                for (let i = 0; i < ORGTYPE.length; i++) {
                    let type = ORGTYPE[i];
                    let orgData = await getOrgTreeByOrgType({orgtype: type});
                    if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
                        await this.getCompanyList(orgData.content);
                    }
                }
                await this.getUserCompany();
            } else {
                let parentData = await this.getUserCompany();
                if (parentData && parentData.ID) {
                    this.companyList.push(parentData);
                }
            }
            this.props.getCompanyDataList(this.companyList);
            this.setState({
                permission
            });
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    // 获取用户自己的公司信息
    getUserCompany = async () => {
        const {
            actions: {
                getParentOrgTreeByID
            },
            form: { setFieldsValue }
        } = this.props;
        try {
            let user = getUser();
            let parentData = '';
            // admin没有部门
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                let orgID = user.org;
                parentData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                console.log('parentData', parentData);
                if (parentData && parentData.ID) {
                    let companyOrgID = parentData.ID;
                    await setFieldsValue({
                        orgID: companyOrgID
                    });
                    this.setState({
                        userCompany: companyOrgID
                    });
                    // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                    await this.getCheckGroupList(companyOrgID);
                    await this.query();
                }
            } else {
                if (this.companyList && this.companyList instanceof Array && this.companyList.length > 0) {
                    let companyData = this.companyList[0];
                    let companyOrgID = companyData.ID;
                    await setFieldsValue({
                        orgID: companyOrgID
                    });
                    this.setState({
                        userCompany: companyOrgID
                    });
                    // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                    await this.getCheckGroupList(companyOrgID);
                    await this.query();
                }
            }
            return parentData;
        } catch (e) {
            console.log('getUserCompany', e);
        }
    }
    // 查找所有的公司的List
    getCompanyList = async (data) => {
        console.log('data', data);
        if (data && data instanceof Array) {
            this.companyList = this.companyList.concat(data);
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
            orgID: value
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
        let groupList = await getCheckGroup({}, {orgCode: value});
        if (groupList && groupList.content && groupList.content instanceof Array) {
            groupList.content.map(group => {
                groupArray.push(
                    <Option key={group.id} value={group.id}>
                        {group.Name}
                    </Option>
                );
            });
        }
        this.setState({
            groupArray
        });
    }

    renderContent () {
        const {
            platform: { roles = [] }
        } = this.props;
        let systemRoles = [];
        let parentRoleType = [];
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0) {
                parentRoleType.push(role);
            }
        });
        console.log('parentRoleType', parentRoleType);
        parentRoleType.map((type) => {
            systemRoles.push({
                name: type && type.RoleName,
                value: roles.filter(role => role.ParentID === type.ID)
            });
        });

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
        console.log('systemRoles', systemRoles);
        return objs;
    }
    renderTitle () {
        var systemRoles = [];
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
        systemRoles.push({
            name: '监理职务',
            children: ['总监', '监理组长', '普通监理', '监理文书']
        });
        systemRoles.push({
            name: '业主职务',
            children: ['业主', '业主文书', '业主领导']
        });
        systemRoles.push({
            name: '苗圃基地职务',
            children: ['苗圃基地']
        });
        systemRoles.push({
            name: '供应商职务',
            children: ['供应商']
        });

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

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            groupArray
        } = this.state;
        console.log('this.companyList', this.companyList);
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='公司'>
                                    {getFieldDecorator('orgID', {
                                        rules: [{
                                            required: true,
                                            message: '请选择公司'
                                        }]
                                    })(
                                        <Select
                                            allowClear
                                            placeholder='请选择公司'
                                            onChange={this.handleOrgSelectChange.bind(
                                                this
                                            )}
                                        >
                                            {
                                                this.companyList.map((company) => {
                                                    return <Option
                                                        title={company.OrgName}
                                                        key={company.ID}
                                                        value={company.ID}>
                                                        {company.OrgName}
                                                    </Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='考勤群体'>
                                    {getFieldDecorator('groupId', {

                                    })(
                                        <Select placeholder='请选择考勤群体' allowClear>
                                            {groupArray}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
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
                        </Row>
                    </Col>
                    <Col span={5} offset={1}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Button
                                    type='primary'
                                    onClick={this.query.bind(this)}
                                >
                                    查询
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='状态'>
                                    {getFieldDecorator('status', {

                                    })(
                                        <Select placeholder='请选择状态' allowClear>
                                            <Option tile='出勤' value={1} key='出勤'>
                                                出勤
                                            </Option>
                                            <Option tile='迟到' value={2} key='迟到'>
                                                迟到
                                            </Option>
                                            <Option tile='早退' value={3} key='早退'>
                                                早退
                                            </Option>
                                            <Option tile='迟到并早退' value={4} key='迟到并早退'>
                                                迟到并早退
                                            </Option>
                                            <Option tile='请假' value={5} key='请假'>
                                                请假
                                            </Option>
                                            <Option tile='缺勤' value={0} key='缺勤'>
                                                缺勤
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
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
                                            allowClear
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
                                            allowClear
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
                                <Button onClick={this.clear.bind(this)}>
                                    清除
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }

    query () {
        const {
            form: { validateFields },
            actions: {
                changeFilterData
            }
        } = this.props;
        const {
            start,
            end
        } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let params = handleFilterData(values, start, end);
                console.log('params', params);
                changeFilterData(params);
                this.props.query(1, params);
            }
        });
    }
    clear () {
        const {
            form: { setFieldsValue, validateFields },
            actions: {
                changeFilterData
            }
        } = this.props;
        const {
            userCompany,
            start,
            end
        } = this.state;
        setFieldsValue({
            duty: undefined,
            groupId: undefined,
            orgID: userCompany || undefined,
            role: undefined,
            searchDate: undefined,
            status: undefined
        });
        this.setState({
            start: '',
            end: ''
        }, () => {
            this.query();
        });
        // validateFields((err, values) => {
        //     console.log('err', err);
        //     console.log('values', values);
        //     if (!err) {
        //         let params = handleFilterData(values, start, end);
        //         console.log('params', params);
        //         changeFilterData(params);
        //         this.props.query(1, params);
        //     }
        // });
    }
}
export default Form.create()(CountFilter);

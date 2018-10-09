import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API,PROJECT_UNITS } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Popconfirm,
    DatePicker,
    Select
} from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
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
            sectionArray: [],
            projectArray: [],
            groupArray: [],
            start:'',
            end:'',
        };
    }


    componentDidMount () {
        this.getSection();
        this.getCheckGroup();
    }

    async getSection () {
        let user = getUser();
        let projectArray = [];
        let sectionArray = [];
        let sections = user.sections;
        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                PROJECT_UNITS.map(item => {
                    if (code[0] === item.code) {
                        projectArray.push(
                            <Option key={item.value} value={item.value}>
                                {item.value}
                            </Option>
                        );
                        let units = item.units;
                        units.map(unit => {
                            sectionArray.push(
                                <Option key={unit.code} value={unit.code}>
                                    {unit.value}
                                </Option>
                            );
                        });
                    }
                });
            }
        } else {
            PROJECT_UNITS.map(project => {
                projectArray.push(
                    <Option key={project.value} value={project.value}>
                        {project.value}
                    </Option>
                );
            });
        }
        this.setState({
            projectArray: projectArray,
            sectionArray: sectionArray
        });
    }

    async getCheckGroup(){
        const {
            actions: { getCheckGroup }
        } = this.props;
        let groupArray = [];
        let data = await getCheckGroup();
        data.map(p =>{
            groupArray.push(
                <Option key={p.id} value={p.id}>
                    {p.name}
                </Option>
            );
        });
        this.setState({
            groupArray: groupArray,
        });
    }


     // 项目选择函数
    onSelectChange (value) {
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({
            section: undefined
        });
        let sectionArray = [];
        PROJECT_UNITS.map(project => {
            if (project.value === value) {
                let units = project.units;
                units.map(unit => {
                    sectionArray.push(
                        <Option key={unit.code} value={unit.code}>
                            {unit.value}
                        </Option>
                    );
                });
            }
        });
        this.setState({
            sectionArray: sectionArray
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

    changeFormDate (value, results) {
        this.setState({
            start:results[0],
            end:results[1]
        })
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { projectArray, sectionArray, groupArray } = this.state;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='项目'>
                                    {getFieldDecorator('project_code', {
                
                                    })(
                                        <Select
                                            placeholder='请选择项目'
                                            onChange={this.onSelectChange.bind(
                                                this
                                            )}
                                        >
                                            {projectArray}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='标段'>
                                    {getFieldDecorator('section', {
            
                                    })(
                                        <Select placeholder='请选择标段'>
                                            {sectionArray}
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
                                    {getFieldDecorator('chuqin', {
                                
                                    })(
                                        <Select placeholder='请选择是否出勤'>
                                            <Option
                                                key={'是'}
                                                value={'是'}
                                            >
                                                是
                                            </Option>
                                            <Option
                                                key={'否'}
                                                value={'否'}
                                            >
                                                否
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='状态'>
                                    {getFieldDecorator('status', {
        
                                    })(
                                        <Select  placeholder='请选择状态'>
                                            <Option
                                                key={'迟到'}
                                                value={'迟到'}
                                            >
                                                迟到
                                            </Option>
                                            <Option
                                                key={'早退'}
                                                value={'早退'}
                                            >
                                                早退
                                            </Option>
                                            <Option
                                                key={'正常'}
                                                value={'正常'}
                                            >
                                                正常
                                            </Option>
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
                                <FormItem {...CountFilter.layout} label='考勤群体'>
                                    {getFieldDecorator('group', {
                                       
                                    })(
                                        <Select  placeholder='请选择考勤群体'>
                                           {groupArray}
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
            let params = {};
            params['project_code'] = values.project_code;
            params['section'] = values.section;
            params['name'] = values.name;
            if(values.searchDate){
                params['start'] = this.state.start;
                params['end'] = this.state.end;
            }
            params['chuqin'] = values.chuqin;
            params['status'] = values.status;
            params['group'] = values.group;
            params['role'] = values.role;
            params['duty'] = values.duty;
            this.props.query(params);
        });
    }
    clear () {
        this.props.form.resetFields();
    }

}
export default Form.create()(CountFilter);

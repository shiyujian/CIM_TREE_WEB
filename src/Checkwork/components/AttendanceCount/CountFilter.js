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
const Option = Select.Option;
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
            projectArray: []
        };
    }


    componentDidMount () {
        this.getSection();
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

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { projectArray, sectionArray } = this.state;
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
                                            <Option
                                                key={'宣传片'}
                                                value={'宣传片'}
                                            >
                                                宣传片
                                            </Option>
                                            <Option
                                                key={'操作视频'}
                                                value={'操作视频'}
                                            >
                                                操作视频
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='角色'>
                                    {getFieldDecorator('role', {
                                        
                                    })(
                                        <Select  placeholder='请选择角色'>
                                            <Option
                                                key={'宣传片'}
                                                value={'宣传片'}
                                            >
                                                宣传片
                                            </Option>
                                            <Option
                                                key={'操作视频'}
                                                value={'操作视频'}
                                            >
                                                操作视频
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...CountFilter.layout} label='职务'>
                                    {getFieldDecorator('duty', {
                                        
                                    })(
                                        <Select  placeholder='请选择职务'>
                                            <Option
                                                key={'宣传片'}
                                                value={'宣传片'}
                                            >
                                                宣传片
                                            </Option>
                                            <Option
                                                key={'操作视频'}
                                                value={'操作视频'}
                                            >
                                                操作视频
                                            </Option>
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
            debugger
        });
    }
    clear () {
        this.props.form.resetFields();
    }

}
export default Form.create()(CountFilter);

import React, { Component } from 'react';
import moment from 'moment';
import {
    Table,
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    InputNumber,
    Divider,
    Notification
} from 'antd';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;

class WeekDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            startDate: '', // 开始日期
            endDate: '', // 结束日期
            disabled: '' // 禁用
        };
    }
    componentDidMount () {
        const {
            WFState,
            param,
            TableList
        } = this.props;
        let disabled = true;
        if (WFState === 4) {
            // 需要重新填报
            disabled = false;
        }
        this.setState({
            startDate: param.StartDate,
            endDate: param.EndDate,
            disabled
        });
    }
    getSectionName = (currentSection) => {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionName = '';
        let projectName = '';

        if (currentSection) {
            let sectionData = (tree && tree.bigTreeList) || [];
            let code = currentSection.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(project => {
                    if (code[0] === project.No) {
                        projectName = project.Name;
                        project.children.map(section => {
                            // 获取当前标段的名字
                            if (section.No === currentSection) {
                                sectionName = section.Name;
                            }
                        });
                    }
                });
            }
        }
        return sectionName;
    }
    render () {
        const {
            TableList,
            param
        } = this.props;
        const { startDate, endDate, disabled } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let sectionName = this.getSectionName(param.Section);
        return (<div>
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='标段:'
                        >
                            <Input
                                value={sectionName}
                                disabled
                                style={{width: 220}}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12} />
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='开始日期'
                        >
                            <DatePicker
                                allowClear={false}
                                style={{width: 220}}
                                disabled={disabled}
                                disabledDate={this.disabledStartDate.bind(this)}
                                value={moment(startDate, dateFormat)}
                                format={dateFormat}
                                onChange={this.handleStartDate.bind(this)}
                            />

                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='结束日期'
                        >
                            <DatePicker
                                allowClear={false}
                                style={{width: 220}}
                                disabled={disabled}
                                disabledDate={this.disabledEndDate.bind(this)}
                                value={moment(endDate, dateFormat)}
                                format={dateFormat}
                                onChange={this.handleEndDate.bind(this)}
                            />

                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={false}
                            columns={this.columns}
                            bordered
                            dataSource={TableList}
                            rowKey='ID'
                            className='foresttable'
                        />
                    </Col>
                </Row>
            </Form>
        </div>);
    }
    handleStartDate (date, dateString) {
        const { endDate } = this.state;
        this.setState({
            startDate: dateString
        }, () => {
            this.props.setTableDate(dateString, endDate);
        });
    }
    handleEndDate (date, dateString) {
        const { startDate } = this.state;
        this.setState({
            endDate: dateString
        }, () => {
            this.props.setTableDate(startDate, dateString);
        });
    }
    disabledStartDate (currentDate) {
        const { endDate } = this.state;
        if (!currentDate || !endDate) {
            return false;
        }
        let weekDay = moment(endDate).subtract(7, 'days');
        return (currentDate.valueOf() <= weekDay.valueOf()) || ((currentDate.valueOf() > moment(endDate).valueOf()));
    }
    disabledEndDate (currentDate) {
        const { startDate } = this.state;
        if (!currentDate || !startDate) {
            return false;
        }
        let weekDay = moment(startDate).add(7, 'days');
        return (currentDate.valueOf() >= weekDay.valueOf()) || (currentDate.valueOf() < moment(startDate).valueOf());
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '33%',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: '33%'
        },
        {
            title: '计划栽植量',
            dataIndex: 'planTreeNum',
            key: 'planTreeNum',
            width: '34%',
            render: (text, record, index) => {
                const {disabled} = this.state;
                return (<InputNumber
                    disabled={disabled}
                    value={record.planTreeNum || 0}
                    onChange={this.props.handlePlanTreeNumChage.bind(this, index)}
                />);
            }
        }
    ]
}
export default Form.create()(WeekDetail);

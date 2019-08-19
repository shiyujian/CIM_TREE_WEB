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
    Notification
} from 'antd';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
class ActualDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            todayDate: '', // 日期
            disabled: ''
        };
    }
    componentDidMount () {
        const {
            WFState
        } = this.props;
        let disabled = true;
        if (WFState === 4) {
            // 需要重新填报
            disabled = false;
        }
        this.setState({
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
            param,
            TableList
        } = this.props;
        const {
            disabled
        } = this.state;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let sectionName = this.getSectionName(param.Section);
        return (<div>
            <Form>
                <Row gutter={15}>
                    <Col span={12}>
                        <FormItem
                            label='标段:'
                            {...formItemLayout}
                        >
                            <Input
                                value={sectionName}
                                disabled
                                style={{width: 220}} />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label='日期'
                            {...formItemLayout}
                        >
                            <DatePicker
                                allowClear={false}
                                style={{width: 220}}
                                disabled={disabled}
                                value={moment(param.TodayDate, dateFormat)}
                                format={dateFormat}
                                onChange={this.props.handleTodayDate.bind(this)}
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
            title: '类别',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => {
                const obj = {
                    children: text,
                    props: {}
                };
                if (record.typeFirst) {
                    obj.props.rowSpan = record.typeList;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        },
        {
            title: '项目',
            dataIndex: 'project',
            key: 'project'
        },
        {
            title: '单位',
            dataIndex: 'units',
            key: 'units'
        },
        {
            title: '数量',
            dataIndex: 'actualNum',
            key: 'actualNum',
            render: (text, record, index) => {
                const {disabled} = this.state;
                return (
                    <InputNumber
                        disabled={disabled}
                        value={record.actualNum || 0}
                        onChange={this.props.handleActualNumChange.bind(this, index)}
                    />
                );
            }
        }
    ];
}
export default Form.create()(ActualDetail);

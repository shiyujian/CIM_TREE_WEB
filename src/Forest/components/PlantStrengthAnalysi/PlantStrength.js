import React, {Component} from 'react';
import { Card, Row, Col, List, Form, Select, Button } from 'antd';
import moment from 'moment';
const gridStyle = {
    width: '25%',
    textAlign: 'center'
};
const { Option } = Select;
const titleStyle = {
    float: 'left',
    marginRight: 20
};
const CardStyle = {
    background: '#ECECEC',
    padding: '30px'
};
class PlantStrength extends Component {
    constructor (props) {
        super(props);
        this.state = {
            realTimeDataList: [], // 实时种植数据列表
            ActiveUser: 0, // 日最高活跃账号数
            SessionCount: 0, // 今日用户活跃度
            TotalUser: 0
        };
    }
    componentDidMount = async () => {
    }

    render () {
        const {
            realTimeDataList,
            ActiveUser,
            SessionCount
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div>
                    <h2>实时数据：{moment().format('HH:mm:ss')}</h2>
                    <div>
                        <Card title='关键数据' style={{float: 'left', width: 600}}>
                            <Card.Grid style={gridStyle}>Content</Card.Grid>
                            <Card.Grid style={gridStyle}>Content</Card.Grid>
                            <Card.Grid style={gridStyle}>Content</Card.Grid>
                            <Card.Grid style={gridStyle}>Content</Card.Grid>
                        </Card>
                        <List size='small' style={{marginLeft: 620}}
                            header={<div>实时种植数据</div>} dataSource={realTimeDataList} />
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>栽植完成情况统计</h2>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <Form.Item
                                label='标段'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='栽植/待栽植' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='定位/待定位' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>树种统计</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='标段'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='类型'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='树种分布' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='树种排名' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>种植进度分析</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='总种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各标段种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='各小班种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各细班种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>定位进度分析</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select defaultValue='lucy' style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='各小班定位进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各细班定位进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(PlantStrength);

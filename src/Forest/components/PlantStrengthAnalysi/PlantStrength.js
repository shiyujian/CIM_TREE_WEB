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
            leftkeycode: '', // 项目code
            sectionList: [], // 标段列表
            plantAmount: 0, // 累计种植数量
            plantToday: 0, // 今日种植总数
            locationToday: 0, // 今日定位数量
            locationAmount: 0, // 累计定位总数
            realTimeDataList: [] // 实时种植数据列表
        };
    }
    componentDidMount = async () => {
    }
    componentWillReceiveProps = async (nextProps) => {
        const {
            actions: { getTotalSat, getLocationStat, getCount, getLocationStatBySpecfield }
        } = this.props;
        if (nextProps.leftkeycode) {
            console.log('nextProps', nextProps.sectionList);
            console.log('leftkeycode', nextProps.leftkeycode);
            // 获取当前种树信息
            let getTotalSatTreePostdata = {
                statType: 'tree',
                section: nextProps.leftkeycode
            };
            let plantAmount = await getTotalSat({}, getTotalSatTreePostdata);
            let postdata = {
                no: nextProps.leftkeycode,
                section: ''
            };
            let locationStat = await getLocationStat({}, postdata);
            let getCountPostData = {
                stime: moment().format('YYYY/MM/DD 00:00:00'),
                etime: moment().format('YYYY/MM/DD 23:59:59'),
                no: nextProps.leftkeycode
            };
            // 今日种植棵数
            let sectionPlantArr = await getCount({}, getCountPostData);
            let plantToday = 0;
            sectionPlantArr.map(item => {
                plantToday += item.Num;
            });
            let param = {
                stattype: 'smallclass',
                section: 'P191',
                stime: '',
                etime: ''
            };
            let sectionLocationToday = await getLocationStatBySpecfield({}, param);
            let locationToday = 0;
            sectionLocationToday.map(item => {
                locationToday += item.Num;
            });
            console.log('sectionList', nextProps.sectionList);
            this.setState({
                locationToday,
                plantToday,
                locationAmount: locationStat.split(',')[1],
                plantAmount,
                leftkeycode: nextProps.leftkeycode,
                sectionList: nextProps.sectionList
            });
        }
    }

    render () {
        const {
            realTimeDataList, plantAmount, locationAmount, plantToday, locationToday, sectionList
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div>
                    <h2>实时数据：{moment().format('HH:mm:ss')}</h2>
                    <div>
                        <Card title='关键数据' style={{float: 'left', width: 800}}>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计种植数量</h3>
                                <div style={{fontSize: 26}}>{plantAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计定位数量</h3>
                                <div style={{fontSize: 26}}>{locationAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日种植数量</h3>
                                <div style={{fontSize: 26}}>{plantToday}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日定位数量</h3>
                                <div style={{fontSize: 26}}>{locationToday}</div>
                            </Card.Grid>
                        </Card>
                        <List size='small' style={{marginLeft: 820}}
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
                                    <Select style={{ width: 120 }}>
                                        {
                                            sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
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
                                    <Select style={{ width: 120 }} disabled>

                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='类型'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
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
                                    <Select style={{ width: 120 }} disabled>
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
                                    <Select style={{ width: 120 }} disabled>
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

import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Spin, Form, Button, Select } from 'antd';
import moment from 'moment';
import echarts from 'echarts';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const Option = Select.Option;
class PositionProgress extends Component {
    constructor (props) {
        super(props);
        this.state = {
            spinningTotal: false, // 加载中
            spinningSection: false, // 加载中
            spinningSmall: false, // 加载中
            startDate: moment().subtract(10, 'days').format(dateFormat),
            endDate: moment().format(dateFormat),
            leftkeycode: '' // 项目code
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleDate = this.handleDate.bind(this); // 更改时间
    }
    async componentDidMount () {

    }
    componentWillReceiveProps (nextProps) {
        if (this.props.sectionList !== nextProps.sectionList && this.props.leftkeycode !== nextProps.leftkeycode) {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            this.renderTotal();
            this.renderSection();
        }
    }
    render () {
        console.log('sectionList', this.sectionList);
        const { startDate, endDate, spinningTotal, spinningSection, spinningSmall } = this.state;
        return (
            <div>
                <Form layout='inline'>
                    <Form.Item
                        label='种植时间'>
                        <RangePicker showTime={{ format: 'HH:mm:ss' }} format={dateFormat}
                            defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]} onChange={this.handleDate.bind(this)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                    </Form.Item>
                </Form>
                <div style={{ background: '#ECECEC', padding: '30px', height: 1000, marginTop: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title='总种植进度分析' bordered={false} extra={<Button type='primary'>导出</Button>}>
                                <Spin spinning={spinningTotal}>
                                    <div
                                        id='totalPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title='各标段种植进度分析' bordered={false} extra={<Button type='primary'>导出</Button>}>
                                <Spin spinning={spinningSection}>
                                    <div
                                        id='sectionPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各小班种植进度分析</span>
                                    <Select style={{ width: 120 }}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                </div>
                            } bordered={false} extra={<Button type='primary'>导出</Button>}>
                                <Spin spinning={spinningSmall}>
                                    <div
                                        id='smallPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各细班种植进度分析</span>
                                    <Select style={{ width: 120 }}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                    <Select style={{ width: 120 }}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                </div>
                            } bordered={false} extra={<Button type='primary'>导出</Button>}>
                                <Spin spinning={false}>
                                    <div
                                        id='thinPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
    onSearch () {

    }
    handleDate (date, dateString) {
        console.log('dateString', dateString);
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
    }
    renderTotal () {
        const { startDate, endDate } = this.state;
        const { getCount } = this.props.actions;
        let legend = ['总数'];
        this.sectionList.map(item => {
            legend.push(item.Name);
        });
        this.setState({
            spinningTotal: true
        });
        getCount({}, {
            no: this.leftkeycode,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let total = []; // 总数
            let times = [];
            rep.map(item => {
                if (!times.includes(item.Time)) {
                    times.push(item.Time);
                }
            });
            // 总数
            times.map(item => {
                let Sum = 0;
                rep.map(record => {
                    if (item === record.Time) {
                        Sum += record.Num;
                    }
                });
                total.push(Sum);
            });
            let series = []; // 纵坐标数据
            series.push({
                name: '总数',
                type: 'bar',
                data: total
            });
            // 各标段数据
            this.sectionList.map(item => {
                let sectionData = [];
                times.map(record => {
                    let sum = 0;
                    rep.map(row => {
                        if (record === row.Time && row.Section === item.No) {
                            sum += row.Num;
                        }
                    });
                    sectionData.push(sum);
                });
                series.push({
                    name: item.Name,
                    type: 'line',
                    data: sectionData
                });
            });
            // 渲染图表
            let myChart = echarts.init(document.getElementById('totalPlant'));
            let options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: legend
                },
                xAxis: [
                    {
                        type: 'category',
                        data: times
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '种植数',
                        axisLabel: {
                            formatter: '{value} 棵'
                        }
                    }
                ],
                series: series
            };
            myChart.setOption(options);
            this.setState({
                spinningTotal: false
            });
        });
    }
    renderSection () {
        const { startDate, endDate } = this.state;
        const { getCountSection } = this.props.actions;
        let xAxisData = [];
        this.setState({
            spinningSection: false
        });
        getCountSection({}, {
            section: this.leftkeycode,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            console.log('rep', rep);
            let completeArr = [];
            let unCompleteArr = [];
            this.sectionList.map(item => {
                xAxisData.push(item.Name);
                rep.map(record => {
                    if (item.No === record.Section) {
                        completeArr.push(record.Complete);
                        unCompleteArr.push(record.UnComplete);
                    }
                });
            });
            console.log('completeArr', completeArr, unCompleteArr);
            let myChart = echarts.init(document.getElementById('sectionPlant'));
            let options = {
                legend: {
                    data: ['未种植', '已种植']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '种植数',
                        axisLabel: {
                            formatter: '{value} 棵'
                        }
                    }
                ],
                series: [
                    {
                        name: '已种植',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                offset: ['50', '80'],
                                show: true,
                                position: 'inside',
                                formatter: '{c}',
                                textStyle: { color: '#FFFFFF' }
                            }
                        },
                        data: completeArr
                    },
                    {
                        name: '未种植',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                offset: ['50', '80'],
                                show: true,
                                position: 'inside',
                                formatter: '{c}',
                                textStyle: { color: '#FFFFFF' }
                            }
                        },
                        data: unCompleteArr
                    }
                ]
            };
            myChart.setOption(options);
            this.setState({
                spinningSection: false
            });
        });
    }
    renderSmallClass () {

    }
    renderThin () {

    }
}

export default PositionProgress;

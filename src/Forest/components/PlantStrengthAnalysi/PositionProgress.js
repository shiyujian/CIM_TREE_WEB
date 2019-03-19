import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Spin, Form, Button, Select } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import echarts from 'echarts';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const Option = Select.Option;
class PlantProgress extends Component {
    constructor (props) {
        super(props);
        this.state = {
            spinningTotal: false, // 加载中
            spinningSection: false, // 加载中
            spinningSmall: false, // 加载中
            spinningThin: false, // 加载中
            plantSection: '', // 默认标段
            smallClassList: [], // 小班列表
            thinClassList: [], // 细班列表
            smallNo: '', // 小班编号
            _headersTotal: [], // 总种植导出表格行头
            tblDataTotal: [], // 总种植导出表格数据
            _headersSection: [], // 总种植导出表格行头
            tblDataSection: [], // 总种植导出表格数据
            _headersSmall: [], // 总种植导出表格行头
            tblDataSmall: [], // 总种植导出表格数据
            _headersThin: [], // 总种植导出表格行头
            tblDataThin: [], // 总种植导出表格数据
            startDate: moment().subtract(10, 'days').format(dateFormat),
            endDate: moment().format(dateFormat)
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.handleDate = this.handleDate.bind(this); // 更改时间
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleSmallPlant = this.handleSmallPlant.bind(this); // 小班种植选择标段
        this.handleSmallThin = this.handleSmallThin.bind(this); // 细班种植选择小班
        this.handleTotalExport = this.handleTotalExport.bind(this); // 总种植进度导出
        this.handleSectionExport = this.handleSectionExport.bind(this); // 各标段种植进度导出
        this.handleSmallExport = this.handleSmallExport.bind(this); // 各小班种植进度导出
        this.handleThinExport = this.handleThinExport.bind(this); // 各细班种植进度导出
    }
    componentDidMount () {

    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.sectionList.length > 0 && nextProps.leftkeycode && nextProps.tabPane === '3') {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            this.renderSection();
            this.setState({
                plantSection: this.sectionList[0].No,
                smallClassList: this.sectionList[0].children
            }, () => {
                this.renderSmallClass();
                this.renderThinClass();
            });
        }
    }
    render () {
        const { startDate, endDate, spinningTotal, spinningSection, spinningSmall, spinningThin, plantSection, smallClassList, smallNo } = this.state;
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
                <div style={{ background: '#ECECEC', padding: '30px', height: 1500, marginTop: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title='各标段定位进度分析' bordered={false} extra={<Button type='primary' onClick={this.handleSectionExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningSection}>
                                    <div
                                        id='sectionLocation'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各小班定位进度分析</span>
                                    <Select style={{ width: 120 }} value={plantSection} onChange={this.handleSmallPlant.bind(this)}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                </div>
                            } bordered={false} extra={<Button type='primary' onClick={this.handleSmallExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningSmall}>
                                    <div
                                        id='smallLocation'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={24} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各细班定位进度分析</span>
                                    <Select style={{ width: 120 }} value={plantSection} onChange={this.handleSmallPlant.bind(this)}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                    <Select style={{ width: 120 }} value={smallNo} onChange={this.handleSmallThin.bind(this)}>
                                        {
                                            smallClassList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                </div>
                            } bordered={false} extra={<Button type='primary' onClick={this.handleThinExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningThin}>
                                    <div
                                        id='thinLocation'
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
    handleTotalExport () {

    }
    handleSectionExport () {

    }
    handleSmallExport () {
        
    }
    handleThinExport () {

    }
    handleDate (date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
    }
    onSearch () {

    }
    renderSection () {
        const { startDate, endDate } = this.state;
        const { getLocationtotalstat } = this.props.actions;
        // let tblDataSection = [], _headersSection = ['标段', '已种植', '未种植']; // 导出表格数据
        let xAxisData = [];
        this.setState({
            spinningSection: true
        });
        getLocationtotalstat({}, {
            section: this.leftkeycode,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            console.log('rep各标段定位数据', rep);
            console.log('rep各标段定位数据', this.sectionList);
            let yAxisData = [];
            this.sectionList.map(item => {
                let sum = 0;
                rep.map(record => {
                    if (item.No === record.Label) {
                        sum += record.Num;
                    }
                });
                xAxisData.push(item.Name);
                yAxisData.push(sum);
            });
            let myChart = echarts.init(document.getElementById('sectionLocation'));
            let options = {
                legend: {
                    data: ['已定位']
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
                        name: '定位数',
                        axisLabel: {
                            formatter: '{value} 棵'
                        }
                    }
                ],
                series: [
                    {
                        name: '已定位',
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
                        data: yAxisData
                    }
                ]
            };
            myChart.setOption(options);
            this.setState({
                spinningSection: false
            });
        });
    }
    handleSmallPlant (value) {
        let smallClassList = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                smallClassList = item.children;
            }
        });
        this.setState({
            smallClassList,
            plantSection: value
        }, () => {
            this.renderSmallClass();
        });
    }
    renderSmallClass () {
        const { startDate, endDate, plantSection, smallClassList } = this.state;
        let tblDataSmall = [], _headersSmall = ['小班', '已种植', '未种植']; // 导出表格数据
        const { getLocationStatBySpecfield } = this.props.actions;
        this.setState({
            spinningSmall: true
        });
        getLocationStatBySpecfield({}, {
            stattype: 'smallclass',
            section: plantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let yAxisData = [];
            let xAxisData = [];
            console.log('smallClassList', smallClassList);
            smallClassList.map(item => {
                rep.map(record => {
                    let labelArr = item.No.split('-');
                    let label = labelArr[0] + '-' + labelArr[1] + '-' + labelArr[3];
                    if (record.Label === label) {
                        yAxisData.push(record.Num);
                        xAxisData.push(item.Name);
                        tblDataSmall.push({
                            '小班': item.Name,
                            '已种植': record.Num
                        });
                    }
                });
            });
            var myChart = echarts.init(document.getElementById('smallLocation'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { show: true }
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
                        name: '定位数',
                        axisLabel: {
                            formatter: '{value} 棵'
                        }
                    }
                ],
                series: [
                    {
                        name: '已定位',
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
                        data: yAxisData
                    }
                ]
            };
            myChart.setOption(option);
            this.setState({
                tblDataSmall,
                _headersSmall,
                spinningSmall: false
            });
        });
    }
    handleSmallThin (value) {
        const { smallClassList } = this.state;
        let thinClassList = [];
        smallClassList.map(item => {
            if (item.No === value) {
                thinClassList = item.children;
            }
        });
        this.setState({
            thinClassList,
            smallNo: value
        }, () => {
            this.renderThinClass();
        });
    }
    renderThinClass () {
        const { startDate, endDate, plantSection, thinClassList } = this.state;
        let tblDataThin = [], _headersThin = []; // 表格数据
        const { getLocationStatBySpecfield } = this.props.actions;
        this.setState({
            spinningThin: true
        });
        getLocationStatBySpecfield({}, {
            stattype: 'thinclass',
            section: plantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let xAxisData = [], yAxisData = [];
            console.log('thinClassList', thinClassList);
            thinClassList.map(item => {
                rep.map(record => {
                    let labelArr = item.No.split('-');
                    let label = labelArr[0] + '-' + labelArr[1] + '-' + labelArr[3] + '-' + labelArr[4];
                    if (record.Label === label) {
                        xAxisData.push(item.Name);
                        yAxisData.push(record.Num);
                        tblDataThin.push({
                            '小班': item.Name,
                            '已定位': record.Num
                        });
                    }
                });
            });
            let myChart = echarts.init(document.getElementById('thinLocation'));
            let options = {
                legend: {
                    data: ['已定位']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: [
                    {
                        data: xAxisData.length > 0 ? xAxisData : []
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
                        name: '已定位',
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
                        data: yAxisData
                    }
                ]
            };
            myChart.setOption(options);
            this.setState({
                tblDataThin,
                _headersThin,
                spinningThin: false
            });
        });
    }
}

export default PlantProgress;

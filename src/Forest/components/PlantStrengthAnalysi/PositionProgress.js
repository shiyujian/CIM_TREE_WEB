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
            spinningPlantPosition: false, // 加载中
            spinningSection: false, // 加载中
            spinningSmall: false, // 加载中
            spinningThin: false, // 加载中
            smallPlantSection: '', // 小班种植进度默认标段
            thinPlantSection: '', // 细班种植进度默认标段
            smallPlantSmallClassList: [], // 小班种植进度小班列表
            thinPlantSmallClassList: [], // 小班种植进度小班列表
            thinClassList: [], // 细班列表
            smallNo: '', // 小班编号
            _headersTotal: [], // 总种植导出表格行头
            tblDataTotal: [], // 总种植导出表格数据
            _headersSection: [], // 总定位导出表格行头
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
        this.handleSmallPlantSection = this.handleSmallPlantSection.bind(this); // 小班种植选择标段
        this.handleThinPlantSection = this.handleThinPlantSection.bind(this);
        this.handleSmallThin = this.handleSmallThin.bind(this); // 细班种植选择小班
        this.handleSectionExport = this.handleSectionExport.bind(this); // 各标段种植进度导出
        this.handlePlantPositionExport = this.handlePlantPositionExport.bind(this); // 总种植总定位进度对比导出
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
            this.renderPlantPosition();
            this.setState({
                smallPlantSection: this.sectionList[0].No,
                thinPlantSection: this.sectionList[0].No,
                smallPlantSmallClassList: this.sectionList[0].children,
                thinPlantSmallClassList: this.sectionList[0].children,
                smallNo: this.sectionList[0].children[0].No,
                thinClassList: this.sectionList[0].children[0].children
            }, () => {
                this.renderSmallClass();
                this.renderThinClass();
            });
        }
    }
    render () {
        const {
            startDate,
            endDate,
            spinningSection,
            spinningPlantPosition,
            spinningSmall,
            spinningThin,
            smallPlantSection,
            thinPlantSection,
            smallPlantSmallClassList,
            thinPlantSmallClassList,
            smallNo
        } = this.state;
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
                            <Card title='各标段栽植定位比例分析' bordered={false} extra={<Button type='primary' onClick={this.handlePlantPositionExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningPlantPosition}>
                                    <div
                                        id='plantPosition'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={24} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各小班定位进度分析</span>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{ width: 120 }}
                                        value={smallPlantSection}
                                        onChange={this.handleSmallPlantSection.bind(this)}>
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
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{ width: 120 }}
                                        value={thinPlantSection}
                                        onChange={this.handleThinPlantSection.bind(this)}>
                                        {
                                            this.sectionList.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{ width: 120 }}
                                        value={smallNo}
                                        onChange={this.handleSmallThin.bind(this)}>
                                        {
                                            thinPlantSmallClassList.map(item => {
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
    handleExport (tblData, _headers, title) {
        if (!(tblData && tblData instanceof Array && tblData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        let output = Object.assign({}, headers, testttt);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, { '!ref': ref })
            }
        };
        XLSX.writeFile(wb, title);
    }
    handlePlantPositionExport () {
        const { tblDataTotal, _headersTotal } = this.state;
        this.handleExport(tblDataTotal, _headersTotal, '各标段栽植定位对比分析.xlsx');
    }
    handleSectionExport () {
        const { tblDataSection, _headersSection } = this.state;
        this.handleExport(tblDataSection, _headersSection, '各标段定位进度分析.xlsx');
    }
    handleSmallExport () {
        const { tblDataSmall, _headersSmall } = this.state;
        this.handleExport(tblDataSmall, _headersSmall, '各小班定位进度分析.xlsx');
    }
    handleThinExport () {
        const { tblDataThin, _headersThin } = this.state;
        this.handleExport(tblDataThin, _headersThin, '各细班定位进度分析.xlsx');
    }
    handleDate (date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
    }
    onSearch () {
        this.renderSection();
        this.renderPlantPosition();
        this.renderSmallClass();
        this.renderThinClass();
    }
    async renderPlantPosition () {
        const { startDate, endDate } = this.state;
        const { getCountSection, getLocationtotalstat } = this.props.actions;
        let _headersTotal = ['标段', '已栽植', '已定位'], tblDataTotal = []; // 导出表格数据
        await this.setState({
            spinningPlantPosition: true
        });
        let plantData = await getCountSection({}, {
            section: this.leftkeycode,
            stime: startDate,
            etime: endDate
        });
        let locationData = await getLocationtotalstat({}, {
            section: this.leftkeycode,
            stime: startDate,
            etime: endDate
        });
        console.log('栽植定位量对比', plantData, locationData);
        let xAxisData = [], yPlantData = [], yPositionData = [];
        this.sectionList.map(item => {
            xAxisData.push(item.Name);
            let locationSum = 0, plantSum = 0;
            locationData.map(record => {
                if (item.No === record.Label) {
                    locationSum += record.Num;
                }
            });
            plantData.map(record => {
                if (item.No === record.Label) {
                    plantSum += record.Complete;
                }
            });
            yPositionData.push(locationSum);
            yPlantData.push(plantSum);
            tblDataTotal.push({
                '标段': item.Name,
                '已栽植': plantSum,
                '已定位': locationSum
            });
        });
        console.log('栽植定位量对比', xAxisData, yPlantData, yPositionData);
        let myChart = echarts.init(document.getElementById('plantPosition'));
        let options = {
            legend: {
                data: ['已栽植', '已定位']
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
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
                    type: 'line',
                    data: yPositionData
                    // smooth: true,
                    // symbol: 'circle',
                    // symbolSize: 5,
                    // showSymbol: false,
                    // areaStyle: {
                    //     normal: {
                    //         // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //         //     offset: 0,
                    //         //     color: 'rgba(219, 50, 51, 0.3)'
                    //         // }, {
                    //         //     offset: 0.8,
                    //         //     color: 'rgba(219, 50, 51, 0)'
                    //         // }], false),
                    //         shadowColor: 'rgba(0, 0, 0, 0.1)',
                    //         shadowBlur: 10
                    //     }
                    // },
                    // itemStyle: {
                    //     normal: {
                    //         color: 'rgb(137,189,27)',
                    //         borderColor: 'rgba(137,189,2,0.27)',
                    //         borderWidth: 12

                    //     }
                    // }
                },
                {
                    name: '已栽植',
                    type: 'line',
                    data: yPlantData
                    // smooth: true,
                    // symbol: 'circle',
                    // symbolSize: 5,
                    // showSymbol: false,
                    // areaStyle: {
                    //     normal: {
                    //         // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //         //     offset: 0,
                    //         //     color: 'rgba(219, 50, 51, 0.3)'
                    //         // }, {
                    //         //     offset: 0.8,
                    //         //     color: 'rgba(219, 50, 51, 0)'
                    //         // }], false),
                    //         shadowColor: 'rgba(0, 0, 0, 0.1)',
                    //         shadowBlur: 10
                    //     }
                    // },
                    // itemStyle: {
                    //     normal: {
                    //         color: 'rgb(0,136,212)',
                    //         borderColor: 'rgba(0,136,212,0.2)',
                    //         borderWidth: 12

                    //     }
                    // }
                }
            ]
        };
        myChart.setOption(options);
        this.setState({
            _headersTotal,
            tblDataTotal,
            spinningPlantPosition: false
        });
    }
    renderSection () {
        const { startDate, endDate } = this.state;
        const { getLocationtotalstat } = this.props.actions;
        let tblDataSection = [], _headersSection = ['标段', '已定位']; // 导出表格数据
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
                tblDataSection.push({
                    '标段': item.Name,
                    '已定位': sum
                });
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
                tblDataSection,
                _headersSection,
                spinningSection: false
            });
        });
    }
    handleSmallPlantSection (value) {
        let smallPlantSmallClassList = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                smallPlantSmallClassList = item.children;
            }
        });
        this.setState({
            smallPlantSmallClassList,
            smallPlantSection: value
        }, () => {
            this.renderSmallClass();
        });
    }
    handleThinPlantSection (value) {
        let thinPlantSmallClassList = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                thinPlantSmallClassList = item.children;
            }
        });
        this.setState({
            thinPlantSmallClassList,
            smallNo: '',
            thinPlantSection: value
        });
    }
    renderSmallClass () {
        const { startDate, endDate, smallPlantSection, smallPlantSmallClassList } = this.state;
        let tblDataSmall = [], _headersSmall = ['小班', '已定位']; // 导出表格数据
        const { getLocationStatBySpecfield } = this.props.actions;
        this.setState({
            spinningSmall: true
        });
        getLocationStatBySpecfield({}, {
            stattype: 'smallclass',
            section: smallPlantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let yAxisData = [];
            let xAxisData = [];
            console.log('smallPlantSmallClassList', smallPlantSmallClassList);
            smallPlantSmallClassList.map(item => {
                rep.map(record => {
                    let labelArr = item.No.split('-');
                    let label = labelArr[0] + '-' + labelArr[1] + '-' + labelArr[3];
                    if (record.Label === label) {
                        yAxisData.push(record.Num);
                        xAxisData.push(item.Name);
                        tblDataSmall.push({
                            '小班': item.Name,
                            '已定位': record.Num
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
        const { thinPlantSmallClassList } = this.state;
        let thinClassList = [];
        thinPlantSmallClassList.map(item => {
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
        const { startDate, endDate, thinPlantSection, thinClassList } = this.state;
        let tblDataThin = [], _headersThin = ['小班', '已定位']; // 表格数据
        const { getLocationStatBySpecfield } = this.props.actions;
        this.setState({
            spinningThin: true
        });
        getLocationStatBySpecfield({}, {
            stattype: 'thinclass',
            section: thinPlantSection,
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

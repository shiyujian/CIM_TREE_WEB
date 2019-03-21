import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Spin, Form, Button, Select } from 'antd';
import XLSX from 'xlsx';
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
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleDate = this.handleDate.bind(this); // 更改时间
        this.handleSmallPlant = this.handleSmallPlant.bind(this); // 小班种植选择标段
        this.handleSmallThin = this.handleSmallThin.bind(this); // 细班种植选择小班
        this.handleTotalExport = this.handleTotalExport.bind(this); // 总种植进度导出
        this.handleSectionExport = this.handleSectionExport.bind(this); // 各标段种植进度导出
        this.handleSmallExport = this.handleSmallExport.bind(this); // 各小班种植进度导出
        this.handleThinExport = this.handleThinExport.bind(this); // 各细班种植进度导出
    }
    async componentDidMount () {

    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.sectionList.length > 0 && nextProps.leftkeycode && nextProps.tabPane === '2') {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            this.renderTotal();
            this.renderSection();
            this.setState({
                plantSection: this.sectionList[0].No,
                smallClassList: this.sectionList[0].children,
                smallNo: this.sectionList[0].children[0].No,
                thinClassList: this.sectionList[0].children[0].children
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
                            <Card title='总种植进度分析' bordered={false} extra={<Button type='primary' onClick={this.handleTotalExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningTotal}>
                                    <div
                                        id='totalPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title='各标段种植进度分析' bordered={false} extra={<Button type='primary' onClick={this.handleSectionExport.bind(this)}>导出</Button>}>
                                <Spin spinning={spinningSection}>
                                    <div
                                        id='sectionPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={24} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各小班种植进度分析</span>
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
                                        id='smallPlant'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={24} style={{marginTop: 20}}>
                            <Card title={
                                <div>
                                    <span style={{marginRight: 20}}>各细班种植进度分析</span>
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
    handleTotalExport () {
        const { tblDataTotal, _headersTotal } = this.state;
        this.handleExport(tblDataTotal, _headersTotal, '苗木种植强度分析.xlsx');
    }
    handleSectionExport () {
        const { tblDataSection, _headersSection } = this.state;
        this.handleExport(tblDataSection, _headersSection, '各标段种植进度分析.xlsx');
    }
    handleSmallExport () {
        const { tblDataSmall, _headersSmall } = this.state;
        this.handleExport(tblDataSmall, _headersSmall, '各小班种植进度分析.xlsx');
    }
    handleThinExport () {
        const { tblDataThin, _headersThin } = this.state;
        this.handleExport(tblDataThin, _headersThin, '各细班种植进度分析.xlsx');
    }
    onSearch () {
        this.renderTotal();
        this.renderSection();
        this.renderSmallClass();
        this.renderThinClass();
    }
    handleDate (date, dateString) {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
    }
    renderTotal () {
        const { startDate, endDate } = this.state;
        const { getCount } = this.props.actions;
        let legend = ['总数'];
        let _headersTotal = ['时间', '总数'], tblDataTotal = []; // 导出表格数据
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
                tblDataTotal.push({
                    '时间': item,
                    '总数': Sum
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
                times.map((record, ind) => {
                    let sum = 0;
                    rep.map(row => {
                        if (record === row.Time && row.Section === item.No) {
                            sum += row.Num;
                        }
                    });
                    tblDataTotal[ind][item.Name] = sum;
                    sectionData.push(sum);
                });
                _headersTotal.push(item.Name);
                series.push({
                    name: item.Name,
                    type: 'line',
                    data: sectionData
                });
            });
            console.log('渲染种植进度的图表');
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
                spinningTotal: false,
                tblDataTotal,
                _headersTotal
            });
        });
    }
    renderSection () {
        const { startDate, endDate } = this.state;
        const { getCountSection } = this.props.actions;
        let tblDataSection = [], _headersSection = ['标段', '已种植', '未种植']; // 导出表格数据
        let xAxisData = [];
        this.setState({
            spinningSection: true
        });
        getCountSection({}, {
            section: this.leftkeycode,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let completeArr = [], unCompleteArr = [];
            this.sectionList.map(item => {
                xAxisData.push(item.Name);
                rep.map(record => {
                    if (item.No === record.Label) {
                        completeArr.push(record.Complete);
                        unCompleteArr.push(record.UnComplete);
                        tblDataSection.push({
                            '标段': item.Name,
                            '已种植': record.Complete,
                            '未种植': record.UnComplete
                        });
                    }
                });
            });
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
                tblDataSection,
                _headersSection,
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
            smallNo: '',
            plantSection: value
        }, () => {
            this.renderSmallClass();
        });
    }
    renderSmallClass () {
        const { startDate, endDate, plantSection, smallClassList } = this.state;
        let tblDataSmall = [], _headersSmall = ['小班', '已种植', '未种植']; // 导出表格数据
        const { getCountSmall } = this.props.actions;
        this.setState({
            spinningSmall: true
        });
        getCountSmall({}, {
            section: plantSection || this.leftkeycode,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let complete = [], unComplete = [];
            let xAxisData = [];
            smallClassList.map(item => {
                rep.map(record => {
                    let recordNo = '';
                    recordNo = record.Section + '-' + record.No.split('-')[2];
                    if (recordNo === item.No) {
                        complete.push(record.Complete);
                        unComplete.push(record.UnComplete);
                        xAxisData.push(item.Name);
                        tblDataSmall.push({
                            '小班': item.Name,
                            '已种植': record.Complete,
                            '未种植': record.UnComplete
                        });
                    }
                });
            });
            var myChart = echarts.init(document.getElementById('smallPlant'));
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
                        name: '种植数',
                        axisLabel: {
                            formatter: '{value} 棵'
                        }
                    }
                ],
                series: [
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
                        data: unComplete
                    },
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
                        data: complete
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
        const { startDate, endDate, plantSection, smallNo, thinClassList } = this.state;
        let tblDataThin = [], _headersThin = ['小班', '已种植', '未种植']; // 表格数据
        const { getCountThin } = this.props.actions;
        this.setState({
            spinningThin: true
        });
        let smallNoArr = smallNo.split('-');
        let no = smallNoArr[0] + '-' + smallNoArr[1] + '-' + smallNoArr[3];
        getCountThin({}, {
            no: no,
            section: plantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            let xAxisData = [];
            let complete = [], unComplete = [];
            thinClassList.map(item => {
                rep.map(record => {
                    let recordNo = '';
                    let recordArr = record.No.split('-');
                    recordNo = record.Section + '-' + recordArr[2] + '-' + recordArr[3];
                    if (recordNo === item.No) {
                        complete.push(record.Complete);
                        unComplete.push(record.UnComplete);
                        xAxisData.push(item.Name);
                        tblDataThin.push({
                            '小班': item.Name,
                            '已种植': record.Complete,
                            '未种植': record.unComplete
                        });
                    }
                });
            });
            let myChart = echarts.init(document.getElementById('thinPlant'));
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
                        data: unComplete
                    },
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
                        data: complete
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

export default PositionProgress;

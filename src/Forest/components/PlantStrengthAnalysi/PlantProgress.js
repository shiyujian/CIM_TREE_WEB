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
            plantSection: '', // 默认标段
            smallList: [], // 小班列表
            thinList: [], // 细班列表
            thinNo: '', // 细班编号
            startDate: moment().subtract(10, 'days').format(dateFormat),
            endDate: moment().format(dateFormat),
            leftkeycode: '' // 项目code
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleDate = this.handleDate.bind(this); // 更改时间
        this.handleSmallPlant = this.handleSmallPlant.bind(this); // 小班种植选择标段
        this.handleSmallThin = this.handleSmallThin.bind(this); // 细班种植选择小班
        this.handlePlantExport = this.handlePlantExport.bind(this); // 种植进度导出
    }
    async componentDidMount () {

    }
    componentWillReceiveProps (nextProps) {
        if (this.props.sectionList !== nextProps.sectionList && this.props.leftkeycode !== nextProps.leftkeycode) {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            this.renderTotal();
            // this.renderSection();
            this.setState({
                plantSection: this.sectionList[0].No,
                smallList: this.sectionList[0].children,
                thinNo: this.sectionList[0].children[0].No,
                thinList: this.sectionList[0].children[0].children
            }, () => {
                // this.renderSmallClass();
                // this.renderThin();
            });
        }
    }
    render () {
        console.log('sectionList', this.sectionList);
        const { startDate, endDate, spinningTotal, spinningSection, spinningSmall, plantSection, smallList, thinNo } = this.state;
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
                            <Card title='总种植进度分析' bordered={false} extra={<Button type='primary' onClick={this.handlePlantExport.bind(this)}>导出</Button>}>
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
                            } bordered={false} extra={<Button type='primary'>导出</Button>}>
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
                                    <Select style={{ width: 120 }} value={thinNo} onChange={this.handleSmallThin.bind(this)}>
                                        {
                                            smallList.map(item => {
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
    handlePlantExport () {
        const {
            tblData,
            _headers
        } = this.state;
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
        XLSX.writeFile(wb, `苗木种植强度分析.xlsx`);
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
        let _headers = ['时间', '总数'];
        let tblData = [];
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
                tblData.push({
                    '时间': item
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
                _headers.push(item.Name);
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
            console.log('tblData', tblData);
            console.log('_headers', _headers);
            this.setState({
                spinningTotal: false,
                tblData,
                _headers
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
    handleSmallPlant (value) {
        console.log(value, 'value');
        let smallList = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                smallList = item.children;
            }
        });
        this.setState({
            smallList,
            plantSection: value
        }, () => {
            this.renderSmallClass();
        });
    }
    renderSmallClass () {
        const { startDate, endDate, plantSection, smallList } = this.state;
        const { getCountSmall } = this.props.actions;
        console.log('plantSection', plantSection);
        getCountSmall({}, {
            section: plantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            console.log(rep, 'rep小班');
            console.log(smallList, 'rep小班');
            let complete = [];
            let unComplete = [];
            let xAxisData = [];
            smallList.map(item => {
                rep.map(record => {
                    let recordNo = '';
                    recordNo = record.Section + '-' + record.No.split('-')[2];
                    if (recordNo === item.No) {
                        complete.push(record.Complete);
                        unComplete.push(record.UnComplete);
                        xAxisData.push(item.Name);
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
        });
    }
    handleSmallThin (value) {
        const { smallList } = this.state;
        let thinList = [];
        smallList.map(item => {
            if (item.No === value) {
                thinList = item.children;
            }
        });
        this.setState({
            thinList,
            thinNo: value
        }, () => {
            this.renderThin();
        });
    }
    renderThin () {
        const { startDate, endDate, plantSection, thinNo, thinList } = this.state;
        const { getCountThin } = this.props.actions;
        console.log(thinNo, 'thinNo');
        console.log(plantSection, 'plantSection');
        getCountThin({}, {
            no: thinNo,
            section: plantSection,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            console.log(rep, 'rep');
            let complete = [];
            let unComplete = [];
            let xAxisData = [];
            thinList.map(item => {
                rep.map(record => {
                    let recordNo = '';
                    let recordArr = record.No.split('-');
                    recordNo = record.Section + '-' + recordArr[2] + '-' + recordArr[3];
                    if (recordNo === item.No) {
                        complete.push(record.Complete);
                        unComplete.push(record.UnComplete);
                        xAxisData.push(item.Name);
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
        });
    }
}

export default PositionProgress;

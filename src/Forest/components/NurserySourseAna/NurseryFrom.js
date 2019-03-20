import React, {
    Component
} from 'react';
import echarts from 'echarts';
import {
    DatePicker,
    Spin,
    Card,
    Notification
} from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';

class NurseryFrom extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading1: false,
            loading2: false,
            loading3: false,
            date1: moment().format('YYYY-MM-DD'),
            date2: moment().format('YYYY-MM-DD'),
            date3: moment().format('YYYY-MM-DD'),
            queryCountryData: [], // 查找到的数据
            queryProvinceData: [], // 查找到的数据
            queryCityData: [] // 查找到的数据
        };
    }

    async componentDidMount () {
        const {
            leftkeycode
        } = this.props;
        let myChart = echarts.init(document.getElementById('NurseryCountry'));
        let myChart1 = echarts.init(document.getElementById('NurseryProvince'));
        let myChart2 = echarts.init(document.getElementById('NurseryCity'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [],
                type: 'bar'
            }]
        };
        let width = (document.body.clientWidth-300);
        console.log('width', width);
        myChart.setOption(option);
        myChart1.setOption(option);
        myChart2.setOption(option);
        if (leftkeycode) {
            this.query1();
            this.query2();
            this.query3();
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.query1();
            this.query2();
            this.query3();
        }
    }
    render () {
        const {
            date1,
            date2,
            date3
        } = this.state;
        return (<div >
            <Spin spinning={this.state.loading1} >
                <Card title='全国苗源地统计排行榜'
                    extra={
                        <div >
                            <span > 截止日期： </span>
                            <DatePicker onChange={this.onDateChange.bind(this, 1)}
                                style={{
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginLeft: 10}}
                                defaultValue={moment(date1, 'YYYY-MM-DD')}
                            />
                            <a onClick={this.handleCountryDataExport.bind(this)} >
                            导出
                            </a>
                        </div >
                    } >
                    <div id='NurseryCountry'
                        style={{width: '100%', height: '400px'}}
                    />
                </Card >
            </Spin>
            <Spin spinning={this.state.loading2} >
                <Card title='河北省苗源地统计排行榜'
                    extra={
                        <div >
                            <span > 截止日期： </span>
                            <DatePicker onChange={this.onDateChange.bind(this, 2)}
                                style={{verticalAlign: 'middle', marginRight: 10, marginLeft: 10}}
                                defaultValue={moment(date2, 'YYYY-MM-DD')}
                            />
                            <a onClick={this.handlProvinceDataExport.bind(this)} >
                            导出
                            </a>
                        </div >
                    } >
                    <div id='NurseryProvince'
                        style={
                            {
                                width: '100%',
                                height: '400px'
                            }
                        }
                    />
                </Card >
            </Spin>
            <Spin spinning={this.state.loading3} >
                <Card title='保定市苗源地统计排行榜'
                    extra={
                        <div >
                            <span > 截止日期： </span>
                            <DatePicker onChange={this.onDateChange.bind(this, 3)}
                                style={{
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginLeft: 10
                                }}
                                defaultValue={moment(date3, 'YYYY-MM-DD')}
                            />
                            <a onClick={this.handleCityDataExport.bind(this)} >
                            导出
                            </a>
                        </div >
                    } >
                    <div id='NurseryCity'
                        style={{
                            width: '100%',
                            height: '400px'
                        }}
                    />
                </Card >
            </Spin>
        </div >
        );
    }

    async onDateChange (type, value) {
        if (type === 1) {
            this.setState({
                date1: moment(value._d).format('YYYY-MM-DD')
            }, async () => {
                await this.query1();
            });
        } else if (type === 2) {
            this.setState({
                date2: moment(value._d).format('YYYY-MM-DD')
            }, async () => {
                await this.query2();
            });
        } else if (type === 3) {
            this.setState({
                date3: moment(value._d).format('YYYY-MM-DD')
            }, async () => {
                await this.query3();
            });
        }
    }
    async query1 () {
        const {
            actions: {
                getNurseryFromData
            },
            leftkeycode
        } = this.props;
        const {
            date1
        } = this.state;
        this.setState({
            loading1: true
        });
        let queryCountryData = await getNurseryFromData({
            section: leftkeycode,
            etime: date1
        });
        let aountArray = [];
        let addressArray = [];
        if (queryCountryData instanceof Array) {
            queryCountryData.map(item => {
                if (item && item.Label) {
                    aountArray.push(item.Num);
                    addressArray.push(item.Label);
                }
            });
        }
        let myChart3 = echarts.init(document.getElementById('NurseryCountry'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: [{
                data: addressArray
            }],
            grid: {
                bottom: 50
            },
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
            yAxis: [{
                type: 'value',
                name: '种植数',
                axisLabel: {
                    formatter: '{value} 棵'
                }
            }],
            series: [{
                name: '苗木总量',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        offset: ['50', '80'],
                        show: true,
                        position: 'inside',
                        formatter: '{c}',
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    }
                },
                data: aountArray
            }]
        };
        myChart3.setOption(options3);
        this.setState({
            loading1: false,
            queryCountryData
        });
    }
    async query2 () {
        const {
            actions: {
                getNurseryFromData
            },
            leftkeycode
        } = this.props;
        this.setState({
            loading2: true
        });
        const {
            date2
        } = this.state;
        let queryProvinceData = await getNurseryFromData({
            section: leftkeycode,
            regioncode: '13',
            etime: date2
        });
        let aountArray = [];
        let addressArray = [];
        if (queryProvinceData instanceof Array) {
            queryProvinceData.map(item => {
                if (item && item.Label) {
                    aountArray.push(item.Num);
                    addressArray.push(item.Label);
                }
            });
        }
        let myChart3 = echarts.init(document.getElementById('NurseryProvince'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: [{
                data: addressArray
            }],
            grid: {
                bottom: 50
            },
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
            yAxis: [{
                type: 'value',
                name: '种植数',
                axisLabel: {
                    formatter: '{value} 棵'
                }
            }],
            series: [{
                name: '苗木总量',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        offset: ['50', '80'],
                        show: true,
                        position: 'inside',
                        formatter: '{c}',
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    }
                },
                data: aountArray
            }]
        };
        myChart3.setOption(options3);
        this.setState({
            loading2: false,
            queryProvinceData
        });
    }
    async query3 () {
        const {
            actions: {
                getNurseryFromData
            },
            leftkeycode
        } = this.props;
        const {
            date3
        } = this.state;
        this.setState({
            loading3: true
        });
        let queryCityData = await getNurseryFromData({
            section: leftkeycode,
            regioncode: '1306',
            etime: date3
        });
        let aountArray = [];
        let addressArray = [];
        if (queryCityData instanceof Array) {
            queryCityData.map(item => {
                if (item && item.Label) {
                    if (item.Label === '130600') {
                        aountArray.push(item.Num);
                        addressArray.push('保定市');
                    } else {
                        aountArray.push(item.Num);
                        addressArray.push(item.Label);
                    }
                }
            });
        }
        let myChart3 = echarts.init(document.getElementById('NurseryCity'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: [{
                data: addressArray
            }],
            grid: {
                bottom: 50
            },
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
            yAxis: [{
                type: 'value',
                name: '种植数',
                axisLabel: {
                    formatter: '{value} 棵'
                }
            }],
            series: [{
                name: '苗木总量',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        offset: ['50', '80'],
                        show: true,
                        position: 'inside',
                        formatter: '{c}',
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    }
                },
                data: aountArray
            }]
        };
        myChart3.setOption(options3);
        this.setState({
            loading3: false,
            queryCityData
        });
    }

    handleCountryDataExport = () => {
        const {
            queryCountryData
        } = this.state;
        if (!(queryCountryData && queryCountryData instanceof Array && queryCountryData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        queryCountryData.map((item, index) => {
            if (item && item.Label) {
                let obj = {};
                obj['省份'] = item.Label;
                obj['种植数'] = item.Num;
                tblData.push(obj);
            }
        });
        let _headers = ['省份', '种植数'];
        let headers = _headers.map((v, i) => Object.assign({}, {
            v: v,
            position: String.fromCharCode(65 + i) + 1
        }))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, {
            v: v[k],
            position: String.fromCharCode(65 + j) + (i + 2)
        })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let output = Object.assign({}, headers, testttt);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, {
                    '!ref': ref
                })
            }
        };
        XLSX.writeFile(wb, `全国苗源地统计排行榜.xlsx`);
    }
    handlProvinceDataExport = () => {
        const {
            queryProvinceData
        } = this.state;
        if (!(queryProvinceData && queryProvinceData instanceof Array && queryProvinceData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        queryProvinceData.map((item, index) => {
            if (item && item.Label) {
                let obj = {};
                obj['城市'] = item.Label;
                obj['种植数'] = item.Num;
                tblData.push(obj);
            }
        });
        let _headers = ['城市', '种植数'];
        let headers = _headers.map((v, i) => Object.assign({}, {
            v: v,
            position: String.fromCharCode(65 + i) + 1
        }))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, {
            v: v[k],
            position: String.fromCharCode(65 + j) + (i + 2)
        })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let output = Object.assign({}, headers, testttt);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, {
                    '!ref': ref
                })
            }
        };
        XLSX.writeFile(wb, `河北省苗源地统计排行榜.xlsx`);
    }
    handleCityDataExport = () => {
        const {
            queryCityData
        } = this.state;
        if (!(queryCityData && queryCityData instanceof Array && queryCityData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        queryCityData.map((item, index) => {
            if (item && item.Label) {
                let obj = {};
                if (item.Label === '130600') {
                    obj['县区'] = '保定市';
                    obj['种植数'] = item.Num;
                    tblData.push(obj);
                } else {
                    obj['县区'] = item.Label;
                    obj['种植数'] = item.Num;
                    tblData.push(obj);
                }
            }
        });
        let _headers = ['县区', '种植数'];
        let headers = _headers.map((v, i) => Object.assign({}, {
            v: v,
            position: String.fromCharCode(65 + i) + 1
        }))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, {
            v: v[k],
            position: String.fromCharCode(65 + j) + (i + 2)
        })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {
                [next.position]: {
                    v: next.v
                }
            }), {});
        let output = Object.assign({}, headers, testttt);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, {
                    '!ref': ref
                })
            }
        };
        XLSX.writeFile(wb, `保定市苗源地统计排行榜.xlsx`);
    }
}

export default NurseryFrom;

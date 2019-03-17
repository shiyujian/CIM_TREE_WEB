import React, { Component } from 'react';
import echarts from 'echarts';
import { DatePicker, Spin, Card } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
const { RangePicker } = DatePicker;

export default class PlantLeft extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            tblData: [],
            _headers: []
        };
    }

    componentDidMount () {
        var myChart1 = echarts.init(document.getElementById('PlantLeft'));
        let option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '总数',
                    yAxisIndex: 1,
                    stack: '总量',
                    position: 'inside',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '标段',
                    stack: '总量',
                    position: 'inside',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: []
        };
        myChart1.setOption(option1);
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.query();
        }
    }

    render () {
        // todo 苗木种植强度分析
        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='苗木种植强度分析'
                    extra={
                        <div>
                            <a onClick={this.handlePlantDataExport.bind(this)}>
                                导出
                            </a>
                        </div>
                    }
                >
                    <Cards search={this.search()} title='苗木种植强度分析'>
                        <div
                            id='PlantLeft'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>
            </Spin>
        );
    }

    search () {
        return (
            <div>
                <span>种植时间：</span>
                <RangePicker
                    style={{ verticalAlign: 'middle' }}
                    defaultValue={[
                        moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),
                        moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')
                    ]}
                    showTime={{ format: 'HH:mm:ss' }}
                    format={'YYYY/MM/DD HH:mm:ss'}
                    onChange={this.datepick.bind(this)}
                    onOk={this.datepick.bind(this)}
                />
            </div>
        );
    }

    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY/MM/DD HH:mm:ss')
                : '',
            etime: value[1]
                ? moment(value[1]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        }, () => {
            this.query();
        });
    }

    async query () {
        const {
            actions: {
                getCount
            },
            leftkeycode,
            platform: { tree = {} }
        } = this.props;
        const { stime, etime } = this.state;
        try {
            let sectionData = (tree && tree.bigTreeList) || [];
            let param = {};
            param.no = leftkeycode;
            param.stime = stime;
            param.etime = etime;

            this.setState({ loading: true });
            let rst = await getCount({}, param);

            let data = [];
            let gpshtnum = [];
            let times = [];
            let time = [];
            let total = [];
            let legend = ['总数'];
            // 导出的数据设置
            let _headers = ['时间', '总数'];
            let tblData = [];

            if (rst && rst instanceof Array) {
            // 将 Time 单独列为一个数组
                for (let i = 0; i < rst.length; i++) {
                    if (rst[i].Section) {
                        time.push(rst[i].Time);
                    }
                }
                console.log('time3', time);
                // 时间数组去重
                times = [...new Set(time)];

                if (rst && rst instanceof Array) {
                    sectionData.map(project => {
                    // 获取正确的项目
                        if (leftkeycode.indexOf(project.No) > -1) {
                        // 获取项目下的标段
                            let sections = project.children;
                            // 将各个标段的数据设置为0
                            sections.map((section, index) => {
                                // 定义一个二维数组，分为多个标段
                                gpshtnum[index] = new Array();
                                data[index] = new Array();
                                legend.push(section.Name);
                                _headers.push(section.Name);
                                rst.map(item => {
                                    if (item && item.Section) {
                                        if (item.Section === section.No) {
                                            gpshtnum[index].push(item);
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
                console.log('times1', times);
                times.map((time, index) => {
                    let obj = {};
                    obj['时间'] = time;
                    tblData.push(obj);
                    data.map(sectionData => {
                        sectionData[index] = 0;
                    });
                    gpshtnum.map((test, i) => {
                        test.map((arr, a) => {
                            if (moment(arr.Time).format('YYYY/MM/DD') === time) {
                                data[i][index] = data[i][index] + arr.Num + 0;
                            }
                        });
                    });
                });
                console.log('times2', times);
                for (let i = 0; i < times.length; i++) {
                    total[i] = 0;
                    data.map(sectionData => {
                        total[i] = total[i] + sectionData[i];
                    });
                }
            }

            let myChart1 = echarts.init(document.getElementById('PlantLeft'));
            let series = [
                {
                    name: '总数',
                    type: 'bar',
                    data: total,
                    itemStyle: {
                        normal: {
                            color: '#02e5cd',
                            barBorderRadius: [50, 50, 50, 50]
                        }
                    }
                }
            ];
            total.map((num, order) => {
                let obj = tblData[order];
                obj['总数'] = num;
            });
            data.map((sectionData, index) => {
                let sectionName = legend[index + 1];
                sectionData.map((num, order) => {
                    let obj = tblData[order] || {};
                    obj[sectionName] = num;
                });
                series.push({
                    name: legend[index + 1],
                    type: 'line',
                    data: sectionData
                });
            });
            console.log('legend', legend);
            let options1 = {
                legend: {
                    data: legend
                },
                xAxis: [
                    {
                        data: times
                    }
                ],
                series: series
            };
            myChart1.setOption(options1);
            this.setState({
                loading: false,
                tblData,
                _headers
            });
        } catch (e) {
            console.log('PlantLeft', e);
        }
    }

    handlePlantDataExport = async () => {
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
}

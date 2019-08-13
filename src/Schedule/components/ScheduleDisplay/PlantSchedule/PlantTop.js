import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon, Button, Card, DatePicker, Spin } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
const DATE_FORMAT = 'YYYY/MM/DD';
export default class PlantTop extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD'),
            dataList: [],
            dataListReal: [],
            legendList: ['计划栽植量', '实际栽植量', '实际完成比例'],
            loading: false
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode !== prevProps.leftkeycode) {
                this.query(this.state.stime);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        const { stime } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        选择日期：
                        <DatePicker
                            defaultValue={moment(stime, DATE_FORMAT)}
                            onChange={this.handleChangeDate.bind(this)}
                        />
                        <Button type='primary' style={{ marginLeft: 50 }} onClick={this.toExport.bind(this)}>导出<Icon type='download' /></Button>
                        <div
                            id='PlantTop'
                            style={{ width: '100%', height: '340px' }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }
    handleChangeDate = async (value, dateString) => {
        this.setState({
            stime: moment(value._d).format('YYYY-MM-DD')
        }, () => {
            this.query(this.state.stime);
        });
    }
    async query (dateString) {
        const { leftkeycode } = this.props;
        const {
            getTreedayplans,
            getTreetotalstatbyday
        } = this.props.actions;
        try {
            if (!leftkeycode) {
                return;
            }
            this.setState({
                loading: true
            });
            let dataList = [];
            let dataListReal = [];
            // 获取计划栽植量
            let rep = await getTreedayplans({}, {
                section: leftkeycode,
                stime: dateString + ' 00:00:00',
                etime: dateString + ' 23:59:59'
            });

            if (rep && rep.code && rep.code === 200) {
                dataList = rep.content;
            }
            // 获取实际栽植量
            let totalList = await getTreetotalstatbyday({}, {
                section: leftkeycode,
                stime: dateString + ' 00:00:00',
                etime: dateString + ' 23:59:59'
            });
            if (totalList instanceof Array) {
                dataListReal = totalList;
            }
            this.setState({
                dataList: dataList,
                dataListReal: dataListReal,
                loading: false
            }, () => {
                // 更新表格
                this.filterProjectData();
            });
        } catch (e) {
            console.log('query', e);
        }
    }

    // 根据项目筛选数据
    filterProjectData () {
        const {
            dataList = [],
            dataListReal = [],
            legendList = []
        } = this.state;
        const {
            sectionsData
        } = this.props;

        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        if (dataList.length === 0 && dataListReal.length > 0) {
            dataListReal.map(row => {
                sectionsData.map((sectionData) => {
                    if (row.Section === sectionData.No) {
                        xAxisData.push(sectionData.Name);
                    }
                });
                yPlantData.push(0);
                yRealData.push(row.Num);
                yRatioData.push(100);
            });
        } else if (dataList.length > 0 && dataListReal.length === 0) {
            dataList.map(item => {
                sectionsData.map((sectionData) => {
                    if (item.Section === sectionData.No) {
                        xAxisData.push(sectionData.Name);
                        console.log('xAxisData', xAxisData);
                    }
                });
                yPlantData.push(item.Num);
                yRealData.push(0);
                yRatioData.push(0);
            });
        } else if (dataList.length > 0 && dataListReal.length > 0) {
            dataList.map(item => {
                dataListReal.map(row => {
                    if (item.Section === row.Section) {
                        sectionsData.map((sectionData) => {
                            if (item.Section === sectionData.No) {
                                xAxisData.push(sectionData.Name);
                            }
                        });
                        yPlantData.push(item.Num);
                        yRealData.push(row.Num);
                        let ratio = (row.Num / item.Num * 100).toFixed(2);
                        if (isNaN(ratio) || ratio === 'Infinity') {
                            yRatioData.push(0);
                        } else {
                            yRatioData.push(ratio);
                        }
                    }
                });
            });
        }

        let myChart = echarts.init(document.getElementById('PlantTop'));
        let optionLine = {
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
            legend: {
                bottom: 10,
                data: legendList
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '颗',
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
                {
                    type: 'value',
                    name: '百分比',
                    axisLabel: {
                        formatter: '{value}.0%'
                    }
                }
            ],
            series: [
                {
                    name: '计划栽植量',
                    type: 'bar',
                    data: yPlantData
                },
                {
                    name: '实际栽植量',
                    type: 'bar',
                    data: yRealData
                },
                {
                    name: '实际完成比例',
                    type: 'line',
                    yAxisIndex: 1,
                    data: yRatioData
                }
            ]
        };
        myChart.setOption(optionLine);
        this.setState({
            loading: false
        });
    }
    toExport () {
        const {
            dataList = [],
            dataListReal = [],
            legendList = []
        } = this.state;

        let tblData = [];
        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        if (dataList.length === 0 && dataListReal.length > 0) {
            dataListReal.map(row => {
                xAxisData.push(row.Section);
                yPlantData.push(0);
                yRealData.push(row.Num);
                yRatioData.push(100);
            });
        } else if (dataList.length > 0 && dataListReal.length === 0) {
            dataList.map(item => {
                xAxisData.push(item.Section);
                yPlantData.push(item.Num);
                yRealData.push(0);
                yRatioData.push(0);
            });
        } else if (dataList.length > 0 && dataListReal.length > 0) {
            dataList.map(item => {
                dataListReal.map(row => {
                    if (item.Section === row.Section) {
                        xAxisData.push(item.Section);
                        yPlantData.push(item.Num);
                        yRealData.push(row.Num);
                        let ratio = (row.Num / item.Num * 100).toFixed(2);
                        yRatioData.push(ratio);
                    }
                });
            });
        }
        legendList.map(item => {
            let obj = {};
            xAxisData.map((row, col) => {
                if (item === '计划栽植量') {
                    obj[row] = yPlantData[col];
                } else if (item === '实际栽植量') {
                    obj[row] = yRealData[col];
                } else {
                    obj[row] = yRatioData[col];
                }
            });
            tblData.push({
                '标段': item,
                ...obj
            });
        });

        let _headers = ['标段', ...xAxisData];
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
        XLSX.writeFile(wb, '计划完成情况.xlsx');
    }
}

import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import { Icon, Button, Select, Row, Col, Radio, Card, DatePicker, Spin } from 'antd';
import {
    TREETYPENO,
    ECHARTSCOLOR,
    SCHEDULRPROJECT
} from '../../../_platform/api';
import moment from 'moment';
import XLSX from 'xlsx';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY/MM/DD';
const DATE_FORMAT_ = 'YYYY-MM-DD';
export default class Warning extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: '2018/11/22',
            // stime: moment().format('YYYY/MM/DD'),
            departOptions: '',
            treetypeAll: [],
            gpshtnum: [],
            times: [],
            dataList: [],
            dataListReal: [],
            legendList: ['计划栽植量', '实际栽植量', '实际完成比例'],
            loading: false
        };
    }

    async componentDidMount () {
        this.handleDate(moment(), this.state.stime);
    }

    componentDidUpdate (prevProps, prevState) {
        // debugger
        const { stime, etime, treetypeAll, project } = this.state;
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode != prevProps.leftkeycode) {
            }
        } catch (e) {
            console.log(e);
        }
        if (
            stime != prevState.stime ||
            etime != prevState.etime ||
            treetypeAll != prevState.treetypeAll
        ) {
        }
        if (project != prevState.project) {
            this.filterProjectData();
        }
    }

    render () {
        // todo 累计完成工程量

        const { stime } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        选择日期：
                        <DatePicker
                            defaultValue={moment(stime, DATE_FORMAT)}
                            onChange={this.handleDate.bind(this)}
                        />
                        <Button type="primary" style={{marginLeft: 50}} onClick={this.toExport.bind(this)}>导出<Icon type="download" /></Button>
                        <div
                            id='lefttop'
                            style={{ width: '100%', height: '340px' }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }
    toExport() {
        const {
            dataList,
            dataListReal,
            legendList
        } = this.state;

        let tblData = [];
        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        dataList.map(item => {
            dataListReal.map(row => {
                if(item.Section === row.Section) {
                    xAxisData.push(item.Section);
                    yPlantData.push(item.Num);
                    yRealData.push(row.Num);
                    let ratio = row.Num / item.Num * 100;
                    yRatioData.push(ratio);
                }
            })
        });
        console.log('9999',yPlantData[0]);
        legendList.map( (item, index) => {
            let obj = {};
            xAxisData.map((row, col) => {
                if(item === '计划栽植量') {
                    obj[row] = yPlantData[col];
                } else if (item === '实际栽植量') {
                    obj[row] = yRealData[col];
                } else {
                    obj[row] = yRatioData[col];
                }
            })
            tblData.push({
                '标段': item,
                ...obj
            });
        });
        
        console.log('tblData', tblData);
        let _headers = ['标段', ...xAxisData];
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
        console.log('headers', headers);
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
        console.log('testttt', testttt);
        let output = Object.assign({}, headers, testttt);
        console.log('output', output);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        console.log('outputPos', outputPos);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        console.log('ref', ref);
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, { '!ref': ref })
            }
        };
        XLSX.writeFile(wb, 'output.xlsx');
    }
    async handleDate(date, dateString) {
        let { dataList, dataListReal, stime } = this.state;
        const { leftkeycode } = this.props;
        const { getTreedayplans, getTreetotalstatbyday } = this.props.actions;
        // 获取计划栽植量
        let etime = dateString + ' 23:59:59';
        await getTreedayplans({}, {
            section: leftkeycode,
            stime: dateString,
            etime: etime
        }).then(rep => {
            if(rep.code === 200) {
                dataList = rep.content;
                stime = dateString;
            }
        });
        // 获取实际栽植量
        await getTreetotalstatbyday({}, {
            section: leftkeycode,
            stime: dateString,
            etime: etime
        }).then(rep => {
            dataListReal = rep;
        });
        this.setState({
            dataList: dataList,
            dataListReal: dataListReal,
            stime: stime
        }, () => {
            // 更新表格
            this.filterProjectData();
        });
    }

    // 根据项目筛选数据
    filterProjectData () {
        const {
            dataList,
            dataListReal,
            legendList
        } = this.state;

        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        dataList.map(item => {
            dataListReal.map(row => {
                if(item.Section === row.Section) {
                    xAxisData.push(item.Section);
                    yPlantData.push(item.Num);
                    yRealData.push(row.Num);
                    let ratio = row.Num / item.Num * 100;
                    yRatioData.push(ratio);
                }
            })
        });
        console.log(xAxisData, yPlantData, yRealData, yRatioData, '未来栽植量');

        let myChart = echarts.init(document.getElementById('lefttop'));
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
}

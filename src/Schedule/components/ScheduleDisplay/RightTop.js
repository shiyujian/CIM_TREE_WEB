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
            stime: moment().subtract(7, 'days').calendar(),
            etime: moment().format('YYYY/MM/DD'),
            dataList: [],
            dataListReal: [],
            dataListTask: [],
            legendList: ['计划栽植量','实际栽植量','实际完成比例','累计栽植量','累计完成百分比'],
            departOptions: '',
            currentSection: '',
            project: '便道施工',
            section: 'P018-01-01',
            sections: [],
            treetypeAll: [],
            gpshtnum: [],
            times: [],
            datas: [],
            loading: false
        };
    }

    async componentDidMount () {
        this.onSearch();
    }

    componentDidUpdate (prevProps, prevState) {
        const {
            stime,
            etime,
            project,
            currentSection,
            treetypeAll
        } = this.state;
        const { leftkeycode } = this.props;
        if (
            stime != prevState.stime ||
            etime != prevState.etime ||
            treetypeAll != prevState.treetypeAll
        ) {
        }
        if (
            project != prevState.project ||
            currentSection != prevState.currentSection
        ) {
            this.filterProjectData();
        }
    }

    render () {
        // todo 累计完成工程量
        const { stime, etime, section } = this.state;

        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        <div>
                            <label style={{marginLeft: 20}}>施工时间：</label>
                            <RangePicker
                                defaultValue={[moment(stime, DATE_FORMAT), moment(etime, DATE_FORMAT)]}
                                style={{ verticalAlign: 'middle' }}
                                onChange={this.handleDate.bind(this)}
                            />
                        </div>
                        <div style={{marginTop: 10}}>
                            <label style={{marginLeft: 20}}>标段：</label>
                            <Select defaultValue={section} style={{ width: 140 }} onChange={this.handleSection.bind(this)}>
                                <Option value="">全部</Option>
                                <Option value="P018-01-01">一标段</Option>
                                <Option value="P018-01-02">二标段</Option>
                                <Option value="P018-01-03">三标段</Option>
                                <Option value="P018-01-04">四标段</Option>
                                <Option value="P018-01-05">五标段</Option>
                                <Option value="P018-01-06">六标段</Option>
                            </Select>
                            <Button type="primary" style={{marginLeft: 50}} onClick={this.onSearch.bind(this)}>查询</Button>
                            <Button type="primary" style={{marginLeft: 25}} onClick={this.toExport.bind(this)}>导出<Icon type="download" /></Button>
                        </div>
                        <div
                            id='rightop'
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
            dataListTask,
            legendList
        } = this.state;
        
        let tblData = [];
        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        let yCompleteData = [];
        let yGrandData = [];
        dataList.map(item => {
            let PlanDate = moment(item.PlanDate.split(' ')[0], DATE_FORMAT).format(DATE_FORMAT_);
            xAxisData.push(PlanDate);
            yPlantData.push(item.Num);
            dataListReal.map(row => {
                if(item.Section === row.Section && PlanDate === row.Label) {
                    yRealData.push(row.Num);
                    let ratio = row.Num / item.Num * 100;
                    yRatioData.push(ratio);
                    yCompleteData.push(row.Complete);
                }
            })
        });
        dataListTask.map(item => {
            dataListReal.map(row => {
                if(item.Section === row.Section) {
                    let ratio = row.Complete / item.Sum * 100;
                    yGrandData.push(ratio);
                }
            })
        });
        console.log(xAxisData, yPlantData, yRealData, yRatioData, yCompleteData, yGrandData, '计划栽植量');

        legendList.map(item => {
            let obj = {};
            xAxisData.map((row, col) => {
                if(item === '计划栽植量') {
                    obj[row] = yPlantData[col];
                } else if (item === '实际栽植量') {
                    obj[row] = yRealData[col];
                } else if (item === '实际完成比例') {
                    obj[row] = yRatioData[col];
                } else if (item === '累计栽植量') {
                    obj[row] = yCompleteData[col];
                } else if (item === '累计完成百分比') {
                    obj[row] = yGrandData[col];
                }
            })
            tblData.push({
                '日期': item,
                ...obj
            });
        })
        console.log('tblData', tblData);
        let _headers = ['日期', ...xAxisData];
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
    handleSection (value) {
        this.setState({
            section: value
        })
    }
    async onSearch () {
        let { dataList, dataListReal, dataListTask, stime, etime, section } = this.state;
        const { 
            actions: {
                getTreedayplans,
                getTreetotalstatbyday,
                getTreesectionplans
            },
            leftkeycode 
        } = this.props;
        // 计划栽植量
        await getTreedayplans({}, {
            section: section || leftkeycode,
            stime: stime,
            etime: etime
        }).then(rep => {
            if(rep.code === 200) {
                dataList = rep.content;
            }
        });
        // 实际栽植量
        await getTreetotalstatbyday({}, {
            section: section || leftkeycode,
            stime: stime,
            etime: etime
        }).then(rep => {
            dataListReal = rep;
        });
        // 任务量
        await getTreesectionplans({}, {
            section: ''
        }).then(rep => {
            dataListTask = rep;
        })
        this.setState({
            dataList: dataList.reverse(),
            dataListReal,
            dataListTask
        }, () => {
            // 更新表格
            this.filterProjectData();
        });
    }
    handleDate (date, dateString) {
        this.setState({
            stime: dateString[0],
            etime: dateString[1],
        });
    }
    // 根据标段和项目筛选数据
    filterProjectData () {
        const {
            dataList,
            dataListReal,
            dataListTask,
            legendList
        } = this.state;
        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        let yCompleteData = [];
        let yGrandData = [];
        dataList.map(item => {
            let PlanDate = moment(item.PlanDate.split(' ')[0], DATE_FORMAT).format(DATE_FORMAT_);
            xAxisData.push(PlanDate);
            yPlantData.push(item.Num);
            dataListReal.map(row => {
                if(item.Section === row.Section && PlanDate === row.Label) {
                    yRealData.push(row.Num);
                    let ratio = row.Num / item.Num * 100;
                    yRatioData.push(ratio);
                    yCompleteData.push(row.Complete);
                }
            })
        });
        dataListTask.map(item => {
            dataListReal.map(row => {
                if(item.Section === row.Section) {
                    let ratio = row.Complete / item.Sum * 100;
                    yGrandData.push(ratio);
                }
            })
        });
        console.log(xAxisData, yPlantData, yRealData, yRatioData, yCompleteData, yGrandData, '计划栽植量');

        const myChart = echarts.init(document.getElementById('rightop'));
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
                },
                {
                    name: '累计栽植量',
                    type: 'bar',
                    data: yCompleteData
                },
                {
                    name: '累计完成百分比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: yGrandData
                }
            ]
        };
        myChart.setOption(optionLine);
    }
}

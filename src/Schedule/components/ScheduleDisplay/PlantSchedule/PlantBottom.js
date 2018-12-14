import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon, Button, Select, Card, DatePicker, Spin } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import './index.less';
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY/MM/DD';
const DATE_FORMAT_ = 'YYYY-MM-DD';

export default class PlantBottom extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().subtract(7, 'days').calendar(),
            etime: moment().subtract(1, 'days').format('YYYY/MM/DD'),
            dataList: [],
            dataListReal: [],
            dataListTask: [],
            legendList: ['计划栽植量', '实际栽植量', '实际完成比例', '累计栽植量', '累计完成百分比'],
            section: '',
            loading: false
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const {
            stime,
            etime,
            section
        } = this.state;
        const {
            leftkeycode,
            sectionsData = []
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            if (sectionsData && sectionsData instanceof Array && sectionsData.length > 0) {
                this.setState({
                    section: sectionsData[0].No
                });
            }
        }
        if (
            stime !== prevState.stime ||
            etime !== prevState.etime || section !== prevState.section
        ) {
            this.onSearch();
        }
    }

    render () {
        const { stime, etime, section } = this.state;
        const { sectionoption } = this.props;

        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        <div className='ScheduleDisplay-search-layout' style={{ marginLeft: 20 }} >
                            <div className='ScheduleDisplay-mrg-datePicker'>
                                <label className='ScheduleDisplay-search-span'>
                                    施工时间：
                                </label>
                                <RangePicker
                                    defaultValue={[moment(stime, DATE_FORMAT), moment(etime, DATE_FORMAT)]}
                                    style={{ verticalAlign: 'middle' }}
                                    onChange={this.handleDate.bind(this)}
                                    className='ScheduleDisplay-forestcalcw4'
                                />
                            </div>
                            <div className='ScheduleDisplay-mrg10'>
                                <label className='ScheduleDisplay-search-span'>
                                    标段：
                                </label>
                                <Select value={section}
                                    className='ScheduleDisplay-forestcalcw4'
                                    onChange={this.handleSection.bind(this)}>
                                    {sectionoption}
                                </Select>
                            </div>
                            <Button type='primary' style={{ marginLeft: 50 }} onClick={this.onSearch.bind(this)}>查询</Button>
                            <Button type='primary' style={{ marginLeft: 25 }} onClick={this.toExport.bind(this)}>导出<Icon type='download' /></Button>
                        </div>
                        <div
                            id='PlantBottom'
                            style={{ width: '100%', height: '340px' }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }
    handleSection (value) {
        this.setState({
            section: value
        });
    }
    async onSearch () {
        let {
            dataList,
            dataListReal,
            dataListTask,
            stime,
            etime,
            section
        } = this.state;
        const {
            actions: {
                getTreedayplans,
                getTreetotalstatbyday,
                getTreesectionplans
            },
            leftkeycode
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            if (!(leftkeycode || section)) {
                return;
            }
            // 计划栽植量
            await getTreedayplans({}, {
                section: section || leftkeycode,
                stime: stime + ' 00:00:00',
                etime: etime + ' 23:59:59'
            }).then(rep => {
                if (rep && rep.code && rep.code === 200) {
                    dataList = rep.content;
                }
            });
            // 实际栽植量
            await getTreetotalstatbyday({}, {
                section: section || leftkeycode,
                stime: stime + ' 00:00:00',
                etime: etime + ' 23:59:59'
            }).then(rep => {
                dataListReal = rep;
            });
            // 任务量
            await getTreesectionplans({}, {
                section: section || leftkeycode
            }).then(rep => {
                dataListTask = rep;
            });
            // 将获取的数据按照 PlanDate 时间排序
            dataList.sort(function (a, b) {
                let aPlanDate = moment(a.PlanDate).format(DATE_FORMAT_);
                let bPlanDate = moment(b.PlanDate).format(DATE_FORMAT_);

                if (aPlanDate < bPlanDate) {
                    return -1;
                } else if (aPlanDate > bPlanDate) {
                    return 1;
                } else {
                    return 0;
                }
            });
            this.setState({
                dataList: dataList,
                dataListReal,
                dataListTask,
                loading: false
            }, () => {
                // 更新表格
                this.filterProjectData();
            });
        } catch (e) {
            console.log('onSearch', e);
        }
    }
    handleDate (date, dateString) {
        this.setState({
            stime: dateString[0],
            etime: dateString[1]
        });
    }
    // 根据标段和项目筛选数据
    filterProjectData () {
        const {
            dataList = [],
            dataListReal = [],
            dataListTask = [],
            legendList = []
        } = this.state;
        let xAxisData = [];
        let yPlantData = [];
        let yRealData = [];
        let yRatioData = [];
        let yCompleteData = [];
        let yGrandData = [];
        dataList.map(item => {
            let PlanDate = moment(item.PlanDate).format(DATE_FORMAT_);
            xAxisData.push(PlanDate);
            yPlantData.push(item.Num);
            dataListReal.map(row => {
                if (item.Section === row.Section && PlanDate === row.Label) {
                    yRealData.push(row.Num);
                    let ratio = (row.Num / item.Num * 100).toFixed(2);
                    // yRatioData.push(ratio);
                    if (isNaN(ratio) || ratio === 'Infinity') {
                        yRatioData.push(0);
                    } else {
                        yRatioData.push(ratio);
                    }
                    yCompleteData.push(row.Complete);
                }
            });
        });
        xAxisData.map((date) => {
            dataListTask.map(item => {
                dataListReal.map(row => {
                    if (item.Section === row.Section) {
                        if (date === moment(row.Label).format(DATE_FORMAT_)) {
                            let ratio = (row.Complete / item.Sum * 100).toFixed(2);
                            if (isNaN(ratio) || ratio === 'Infinity') {
                                yGrandData.push(0);
                            } else {
                                yGrandData.push(ratio);
                            }
                        }
                    }
                });
            });
        });

        const myChart = echarts.init(document.getElementById('PlantBottom'));
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

    toExport () {
        const {
            dataList = [],
            dataListReal = [],
            dataListTask = [],
            legendList = []
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
                if (item.Section === row.Section && PlanDate === row.Label) {
                    yRealData.push(row.Num);
                    let ratio = (row.Num / item.Num * 100).toFixed(2);
                    if (isNaN(ratio) || ratio === 'Infinity') {
                        yRatioData.push(0);
                    } else {
                        yRatioData.push(ratio);
                    }
                    yCompleteData.push(row.Complete);
                }
            });
        });
        xAxisData.map((date) => {
            dataListTask.map(item => {
                dataListReal.map(row => {
                    if (item.Section === row.Section) {
                        if (date === moment(row.Label).format(DATE_FORMAT_)) {
                            let ratio = (row.Complete / item.Sum * 100).toFixed(2);
                            if (isNaN(ratio) || ratio === 'Infinity') {
                                yGrandData.push(0);
                            } else {
                                yGrandData.push(ratio);
                            }
                        }
                    }
                });
            });
        });
        legendList.map(item => {
            let obj = {};
            xAxisData.map((row, col) => {
                if (item === '计划栽植量') {
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
            });
            tblData.push({
                '日期': item,
                ...obj
            });
        });
        console.log('tblData', tblData);
        let _headers = ['日期', ...xAxisData];
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        console.log('headers', headers);
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
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
        XLSX.writeFile(wb, '本标段计划完成情况.xlsx');
    }
}

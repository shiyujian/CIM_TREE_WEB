import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon, Button, Card, DatePicker, Spin } from 'antd';
import { SCHEDULRPROJECT } from '_platform/api';
import moment from 'moment';
import { encrypt } from '_platform/store/secrect';
import XLSX from 'xlsx';
const DATE_FORMAT = 'YYYY/MM/DD';

export default class ManMachineTop extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().subtract(1, 'days').format('YYYY/MM/DD'),
            dataList: [],
            loading: false
        };
    }

    async componentDidMount () {
        let myChart = echarts.init(document.getElementById('ManMachineTop'));
        let yAxisData = [];
        let seriesData = [];
        let seriesNameList = [];
        SCHEDULRPROJECT.map((project, index) => {
            seriesNameList.push(project.name);
            seriesData.push({
                data: [],
                type: 'bar'
            });
            yAxisData.push({
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                }
            });
        });
        let option = {
            legend: {
                bottom: 5,
                type: 'scroll',
                data: seriesNameList
            },
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: yAxisData,
            series: seriesData
        };
        await myChart.setOption(option);
        await this.query(this.state.stime);
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
                            id='ManMachineTop'
                            style={{ width: '100%', height: '400px' }}
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
        const {
            leftkeycode,
            actions: {
                getProgressData
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let dataList = [];
            let postData = {
                unitproject: leftkeycode,
                stime: dateString + ' 00:00:00',
                etime: dateString + ' 23:59:59'
            };
            // 获取计划栽植量
            let rep = await getProgressData({}, postData);
            if (rep && rep.code && rep.code === 200) {
                rep.content.map(item => {
                    if (item.ProgressType && item.ProgressType === '日实际') {
                        dataList.push(item);
                    }
                });
            }
            this.setState({
                dataList: dataList,
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
    filterProjectData = async () => {
        const {
            dataList = []
        } = this.state;
        const {
            sectionsData
        } = this.props;
        let xAxisData = [];
        let yAxisData = [];
        let seriesData = [];
        let seriesNameList = [];
        let myChart = echarts.init(document.getElementById('ManMachineTop'));
        if (dataList && dataList instanceof Array && dataList.length > 0) {
            sectionsData.map((sectionData) => {
                dataList.map((content, index) => {
                    if (content.UnitProject === sectionData.No) {
                        xAxisData.push(sectionData.Name);
                        let items = content.Items;
                        SCHEDULRPROJECT.map((project) => {
                            items.map((item) => {
                                if (item.Project === project.name) {
                                    if (seriesNameList.indexOf(item.Project) === -1) {
                                        seriesNameList.push(item.Project);
                                        if (project.type !== '其他') {
                                            seriesData.push({
                                                name: item.Project,
                                                type: 'bar',
                                                stack: project.type,
                                                data: [item.Num]
                                            });
                                        } else {
                                            seriesData.push({
                                                name: item.Project,
                                                type: 'line',
                                                yAxisIndex: 1,
                                                data: [item.Num]
                                            });
                                        }
                                        if (index === 0) {
                                            yAxisData.push({
                                                type: 'value',
                                                // name: project.units,
                                                axisLabel: {
                                                    formatter: '{value} '
                                                }
                                            });
                                        }
                                    } else {
                                        seriesData.map((series) => {
                                            if (series.name === item.Project) {
                                                let dataArr = series.data;
                                                dataArr.push(item.Num);
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            });
            let optionLine = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: 'light'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true,
                            iconStyle: {
                                textPosition: 'bottom',
                                shadowOffsetX: 10
                            }
                        }
                    },
                    right: 20
                },
                legend: {
                    bottom: 5,
                    type: 'scroll',
                    data: seriesNameList
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
                yAxis: yAxisData.length > 0 ? yAxisData : [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    }
                ],
                series: seriesData.length > 0 ? seriesData : [
                    {
                        name: '管理人员投入',
                        type: 'bar',
                        data: []
                    }
                ]
            };
            myChart.setOption(optionLine);
        } else {
            SCHEDULRPROJECT.map((project, index) => {
                seriesNameList.push(project.name);
                seriesData.push({
                    data: [],
                    type: 'bar'
                });
                yAxisData.push({
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} '
                    }
                });
            });
            await myChart.clear();
            let option = {
                legend: {
                    bottom: 5,
                    type: 'scroll',
                    data: seriesNameList
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: yAxisData,
                series: seriesData
            };
            await myChart.setOption(option);
            //
        }
        this.setState({
            loading: false
        });
    }
    toExport () {
        const {
            dataList = [],
            stime
        } = this.state;
        const {
            sectionsData
        } = this.props;
        let tblData = [];
        let xAxisData = [];
        sectionsData.map((sectionData) => {
            dataList.map((content, index) => {
                if (content.UnitProject === sectionData.No) {
                    xAxisData.push(sectionData.Name);
                }
            });
        });
        SCHEDULRPROJECT.map((project) => {
            let obj = {};
            obj['标段'] = project.name;
            tblData.push(obj);
        });
        xAxisData.map((data, index) => {
            tblData.map((obj) => {
                dataList.map((content, order) => {
                    SCHEDULRPROJECT.map((project) => {
                        let items = content.Items;
                        items.map((item) => {
                            if (item.Project === project.name) {
                                if (index === order) {
                                    if (obj['标段'] === project.name) {
                                        obj[data] = item.Num;
                                    }
                                }
                            }
                        });
                    });
                });
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
        XLSX.writeFile(wb, `${stime}完成情况.xlsx`);
    }
}

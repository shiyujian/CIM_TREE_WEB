import React, { Component } from 'react';
import echarts from 'echarts';
import { Icon, Button, Select, Card, DatePicker, Spin } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import { SCHEDULRPROJECT } from '_platform/api';
import './index.less';
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY/MM/DD';
const DATE_FORMAT_ = 'YYYY-MM-DD';

export default class ManMachineBottom extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().subtract(7, 'days').calendar(),
            etime: moment().format('YYYY/MM/DD'),
            dataList: [],
            dataListReal: [],
            dataListTask: [],
            legendList: ['计划栽植量', '实际栽植量', '实际完成比例', '累计栽植量', '累计完成百分比'],
            section: '',
            loading: false
        };
    }

    componentDidMount = () => {
        const {
            section
        } = this.state;
        const {
            sectionsData = []
        } = this.props;
        if (!section) {
            console.log('sectionsectionsectionsectionsection', section);
            if (sectionsData && sectionsData instanceof Array && sectionsData.length > 0) {
                this.setState({
                    section: sectionsData[0].No
                });
            }
        } else {
            this.onSearch();
        }
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
        console.log('section', section);
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            console.log('leftkeycodeleftkeycodeleftkeycode', leftkeycode);
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
            console.log('statestatestatestate', section);
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
                                    style={{ display: 'inlineBlock' }}
                                    onChange={this.handleSection.bind(this)}>
                                    {sectionoption}
                                </Select>
                            </div>
                            <Button type='primary' style={{ marginLeft: 50 }} onClick={this.onSearch.bind(this)}>查询</Button>
                            <Button type='primary' style={{ marginLeft: 25 }} onClick={this.toExport.bind(this)}>导出<Icon type='download' /></Button>
                        </div>
                        <div
                            id='ManMachineBottom'
                            style={{ width: '100%', height: '340px' }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }
    handleDate (date, dateString) {
        this.setState({
            stime: dateString[0],
            etime: dateString[1]
        });
    }
    async onSearch () {
        const {
            leftkeycode,
            actions: {
                getProgressData
            }
        } = this.props;
        const {
            stime,
            etime,
            section
        } = this.state;
        try {
            this.setState({
                loading: true
            });
            let dataList = [];
            let postData = {
                unitproject: section || leftkeycode,
                stime: stime + ' 00:00:00',
                etime: etime + ' 23:59:59'
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
    // 根据标段和项目筛选数据
    filterProjectData () {
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
        dataList.map((content, index) => {
            xAxisData.push(moment(content.ProgressTime).format('YYYY-MM-DD'));
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
        });
        console.log('seriesNameList', seriesNameList);
        console.log('xAxisData', xAxisData);
        console.log('yAxisData', yAxisData);
        console.log('seriesData', seriesData);

        const myChart = echarts.init(document.getElementById('ManMachineBottom'));
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
            yAxis: yAxisData,
            series: seriesData
        };
        myChart.setOption(optionLine);
    }

    toExport () {
        const {
            dataList = [],
            stime,
            etime
        } = this.state;
        const {
            sectionsData
        } = this.props;
        let tblData = [];
        let xAxisData = [];
        let sectionName = '';

        dataList.map((content, index) => {
            xAxisData.push(moment(content.ProgressTime).format('YYYY-MM-DD'));
            sectionsData.map((sectionData) => {
                if (content.UnitProject === sectionData.No) {
                    sectionName = sectionData.Name;
                }
            });
        });
        SCHEDULRPROJECT.map((project) => {
            let obj = {};
            obj['日期'] = project.name;
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
                                    if (obj['日期'] === project.name) {
                                        obj[data] = item.Num;
                                    }
                                }
                            }
                        });
                    });
                });
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
        XLSX.writeFile(wb, `${sectionName}${stime}至${etime}完成情况.xlsx`);
    }
    handleSection (value) {
        this.setState({
            section: value
        });
    }
}

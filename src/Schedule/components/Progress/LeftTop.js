import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, Card, DatePicker, Spin } from 'antd';
import {
    ECHARTSCOLOR,
    SCHEDULRPROJECT
} from '../../../_platform/api';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;
export default class LeftTop extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().subtract(10, 'days').format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            departOptions: '',
            data: '',
            unitproject: '',
            project: SCHEDULRPROJECT[0].name,
            gpshtnum: [],
            times: [],
            datas: [],
            legend: [],
            loading: false
        };
    }

    async componentDidMount () {
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
            legend: {
                data: ['总数', '一标', '二标', '三标', '四标', '五标'],
                left: 'right'
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.times,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: []
        };
        myChart.setOption(optionLine);
        // this.getdata();
    }

    componentDidUpdate (prevProps, prevState) {
        const { stime, etime, project } = this.state;
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode !== prevProps.leftkeycode) {
                this.getdata();
            }
        } catch (e) {
            console.log(e);
        }
        if (
            stime !== prevState.stime ||
            etime !== prevState.etime
        ) {
            this.getdata();
        }
        if (project !== prevState.project) {
            this.filterProjectData();
        }
    }

    render () {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        施工时间：
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
                        <div
                            id='lefttop'
                            style={{ width: '100%', height: '400px' }}
                        />
                        <Select
                            style={{ width: '120px' }}
                            defaultValue={SCHEDULRPROJECT[0].name}
                            onSelect={this.onDepartments.bind(this)}
                            onChange={this.onChange.bind(this)}
                        >
                            {SCHEDULRPROJECT.map(rst => {
                                return (
                                    <Option
                                        key={rst.id}
                                        value={rst.name}
                                        title={rst.name}
                                    >
                                        {rst.name}
                                    </Option>
                                );
                            })}
                        </Select>
                        <span>强度分析</span>
                    </Card>
                </Spin>
            </div>
        );
    }
    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        });
    }

    onDepartments (value) {
        this.setState({
            project: value
        });
    }
    onChange (value) {
        this.setState({
            project: value
        });
    }
    getdata () {
        const {
            etime,
            stime
        } = this.state;
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let patams = {
            etime: etime,
            stime: stime
        };
        this.setState({
            loading: true
        });
        const {
            actions: { progressalldata }
        } = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];
        let legend = ['总数'];
        let datas = [];
        progressalldata({}, patams).then(rst => {
            if (rst && rst.content) {
                let content = [];
                rst.content.map(item => {
                    if (item.ProgressType && item.ProgressType === '日实际') {
                        content.push(item);
                    }
                });
                // 将获取的数据按照 ProgressTime 时间排序
                content.sort(function (a, b) {
                    if (a.ProgressTime < b.ProgressTime) {
                        return -1;
                    } else if (a.ProgressTime > b.ProgressTime) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                // 将 ProgressTime 单独列为一个数组
                for (let i = 0; i < content.length; i++) {
                    let a = moment(content[i].ProgressTime).format(
                        'YYYY/MM/DD'
                    );
                    time.push(a);
                }
                // 时间数组去重
                times = [...new Set(time)];

                SCHEDULRPROJECT.map((item, index) => {
                    datas[index] = new Object();
                    datas[index].project = item.name;
                    datas[index].value = new Array();
                });

                if (content && content instanceof Array) {
                    sectionData.map(project => {
                        // 获取正确的项目
                        if (leftkeycode.indexOf(project.No) > -1) {
                            // 获取项目下的标段
                            let sections = project.children;
                            // 将各个标段的数据设置为0
                            sections.map((section, index) => {
                                // 定义一个二维数组，分为多个标段
                                gpshtnum[index] = new Array();
                                datas.map(projectData => {
                                    projectData.value[index] = new Array();
                                });
                                legend.push(section.Name);
                            });

                            content.map(item => {
                                if (item && item.UnitProject) {
                                    sections.map((section, index) => {
                                        if (item.UnitProject === section.No) {
                                            gpshtnum[index].push(item);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                times.map((time, index) => {
                    datas.map(projectData => {
                        projectData.value.map(sectionData => {
                            sectionData[index] = 0;
                        });
                    });
                    gpshtnum.map((data, i) => {
                        data.map((arr, a) => {
                            if (
                                moment(arr.ProgressTime).format(
                                    'YYYY/MM/DD'
                                ) === time
                            ) {
                                let Items = arr.Items;
                                Items.map((item, x) => {
                                    // 默认的种类
                                    if (item) {
                                        SCHEDULRPROJECT.map(
                                            (project, serial) => {
                                                if (
                                                    item.Project ===
                                                    project.name
                                                ) {
                                                    let reg = isNaN(item.Num);
                                                    if (!reg) {
                                                        if (item.Num > 0) {
                                                            datas[serial].value[i][index] =
                                                            datas[serial].value[i][index] + item.Num + 0;
                                                        }
                                                    }
                                                }
                                            }
                                        );
                                    }
                                });
                            }
                        });
                    });
                });
                this.setState(
                    {
                        legend: legend,
                        datas: datas,
                        gpshtnum: gpshtnum,
                        times: times
                    },
                    () => {
                        this.filterProjectData();
                    }
                );
            } else {
                this.setState({
                    loading: false
                });
                this.filterProjectData();
            }
        });
    }
    // 根据项目筛选数据
    filterProjectData () {
        const {
            times,
            datas,
            project,
            legend
        } = this.state;
        let currentData = [];
        datas.map(data => {
            if (data.project === project) {
                currentData = data.value;
            }
        });
        let total = [];

        for (let i = 0; i < times.length; i++) {
            total[i] = 0;
            currentData.map(sectionData => {
                total[i] = total[i] + sectionData[i];
            });
        }

        // 当查不出数据时，使横坐标不为空
        let a = moment()
            .subtract(2, 'days')
            .format('YYYY/MM/DD');
        let b = moment()
            .subtract(1, 'days')
            .format('YYYY/MM/DD');
        let c = moment().format('YYYY/MM/DD');
        let d = moment()
            .add(1, 'days')
            .format('YYYY/MM/DD');
        let e = moment()
            .add(2, 'days')
            .format('YYYY/MM/DD');
        let dates = [];
        dates.push(a);
        dates.push(b);
        dates.push(c);
        dates.push(d);
        dates.push(e);

        let myChart = echarts.init(document.getElementById('lefttop'));
        let series = [
            {
                name: '总数',
                type: 'bar',
                data: total,
                barWidth: '25%',
                itemStyle: {
                    normal: {
                        color: '#02e5cd',
                        barBorderRadius: [50, 50, 50, 50]
                    }
                }
            }
        ];
        currentData.map((sectionData, index) => {
            series.push({
                name: legend[index + 1],
                type: 'line',
                data: sectionData,
                itemStyle: {
                    normal: {
                        color: ECHARTSCOLOR[index]
                    }
                }
            });
        });
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
            legend: {
                data: legend,
                left: 'right'
            },
            xAxis: [
                {
                    type: 'category',
                    data: times.length > 0 ? times : dates,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: series
        };
        myChart.setOption(optionLine);
        this.setState({
            loading: false
        });
    }
}

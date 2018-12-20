import React, { Component } from 'react';
import echarts from 'echarts';
import { DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
const { RangePicker } = DatePicker;

export default class LeftTop extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59')
        };
    }

    componentDidMount () {
        var myChart1 = echarts.init(document.getElementById('leftTop'));
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
                right: '3%',
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
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '标段',
                    stack: '总量',
                    position: 'right',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: []
        };
        myChart1.setOption(option1);
    }

    componentDidUpdate (prevProps, prevState) {
        const { stime, etime } = this.state;
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode !== prevProps.leftkeycode) {
                this.query();
            }
        } catch (e) {
            console.log(e);
        }
        if (stime !== prevState.stime || etime !== prevState.etime) {
            this.query();
        }
    }

    render () {
        // todo 苗木种植强度分析

        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search(1)} title='苗木种植强度分析'>
                    <div
                        id='leftTop'
                        style={{ width: '100%', height: '400px' }}
                    />
                </Cards>
            </Spin>
        );
    }

    search (index) {
        if (index === 1) {
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

    async query () {
        const {
            actions: {
                gettreetypeAll
            },
            leftkeycode,
            platform: { tree = {} }
        } = this.props;
        const { stime, etime } = this.state;
        let sectionData = (tree && tree.bigTreeList) || [];
        let param = {};
        let no = '';
        if (leftkeycode) {
            try {
                no = leftkeycode.split('-')[0];
            } catch (e) {
                console.log(e);
            }
        }
        param.no = no;
        param.stime = stime;
        param.etime = etime;

        this.setState({ loading: true });
        let rst = await gettreetypeAll({}, param);

        let data = [];
        let gpshtnum = [];
        let times = [];
        let time = [];
        let total = [];
        let legend = ['总数'];

        if (rst && rst instanceof Array) {
            // 将 Time 单独列为一个数组
            for (let i = 0; i < rst.length; i++) {
                if (rst[i].Section) {
                    time.push(rst[i].Time);
                }
            }
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
                        });

                        rst.map(item => {
                            if (item && item.Section) {
                                sections.map((section, index) => {
                                    if (item.Section === section.No) {
                                        gpshtnum[index].push(item);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            times.map((time, index) => {
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
            for (let i = 0; i < times.length; i++) {
                total[i] = 0;
                data.map(sectionData => {
                    total[i] = total[i] + sectionData[i];
                });
            }
        }

        let myChart1 = echarts.init(document.getElementById('leftTop'));
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
        data.map((sectionData, index) => {
            series.push({
                name: legend[index + 1],
                type: 'line',
                data: sectionData
            });
        });
        let options1 = {
            legend: {
                data: legend,
                type: 'scroll'
            },
            xAxis: [
                {
                    data: times
                }
            ],
            series: series
        };
        myChart1.setOption(options1);
        this.setState({ loading: false });
    }
}

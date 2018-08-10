import React, {Component} from 'react';
import {Spin} from 'antd';
var echarts = require('echarts');

export default class TaskStatisEcharts extends Component {
    constructor (props) {
        super(props);
        this.state = {
            section: '',
            loading: false,
            types: []
        };
    }

    componentDidUpdate (prevProps, prevState) {
        const {
            echartsChange
        } = this.props;
        if (echartsChange && echartsChange !== prevProps.echartsChange) {
            this.query();
        }
    }

    componentDidMount () {
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
            title: {
                text: '统计分析'
            },
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
                    saveAsImage: {show: true}
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
                    axisPointer: {
                        type: 'shadow'
                    }

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 亩'
                    }
                },
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 亩'
                    }
                }
            ],
            series: [
                {
                    name: '养护面积',
                    type: 'bar',
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
        myChart1.setOption(option1);

        // this.query(1);
    }
    // 苗木进场总数
    async query () {
        const {
            curingTypes,
            taskSearchData = []
        } = this.props;
        const {
            etime,
            stime
        } = this.state;
        this.setState({
            loading: true
        });
        console.log('ssssssssssssssssssssssssss', taskSearchData);
        let postdata = {};
        this.setState({
            loading: true
        });
        let types = [];
        let typesNo = [];
        let data = [];
        try {
            curingTypes.map((type) => {
                if (type.Base_Name) {
                    types.push(type.Base_Name);
                    typesNo.push(type.ID);
                }
            });
        } catch (e) {
            console.log('e', e);
        }
        try {
            typesNo.map((no, index) => {
                if (!data[index]) {
                    data[index] = 0;
                }
                taskSearchData.map((task) => {
                    if (task.CuringType === no) {
                        data[index] += parseInt(task.Area);
                    }
                });
            });
        } catch (e) {

        }
        console.log('data', data);
        postdata.stime = stime;
        postdata.etime = etime;
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
            xAxis: [
                {
                    data: types
                }
            ],
            series: [
                {
                    data: data
                }
            ]
        };
        myChart1.setOption(option1);
        this.setState({
            loading: false,
            types
        });
    }

    render () {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <div id='king' style={{width: '100%', height: '350px'}} />
                </Spin>
            </div>
        );
    }
}

import React, { Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class Top extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    async componentDidMount () {
        var myChart = echarts.init(document.getElementById('topLeft'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['待栽植', '已栽植']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 0, name: '待栽植'},
                        {value: 0, name: '已栽植'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    async componentDidUpdate (prevProps, prevState) {
        const {
            treePlantingQueryTime,
            queryTime
        } = this.props;
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.loading();
        }
        if (treePlantingQueryTime && treePlantingQueryTime !== prevProps.treePlantingQueryTime) {
            this.query();
        }
    }

    loading = () => {
        this.setState({
            loading: true
        });
    }

    query = () => {
        const {
            treePlanting
        } = this.props;
        try {
            if (treePlanting) {
                let data = treePlanting.split(',');
                let unPlantNum = Number(data[0]);
                if (unPlantNum < 0) {
                    unPlantNum = -unPlantNum;
                }
                let plantNum = Number(data[1]);
                if (plantNum < 0) {
                    plantNum = -plantNum;
                }
                let myChart = echarts.init(document.getElementById('topLeft'));
                let option = {
                    series: [
                        {
                            data: [
                                {value: unPlantNum, name: '待栽植'},
                                {value: plantNum, name: '已栽植'}
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
                this.setState({
                    loading: false
                });
            }
        } catch (e) {

        }
    }

    render () {
        return (
            <Spin spinning={this.state.loading}>
                <div
                    id='topLeft'
                    style={{ width: '100%', height: '300px' }}
                />
            </Spin>
        );
    }
}

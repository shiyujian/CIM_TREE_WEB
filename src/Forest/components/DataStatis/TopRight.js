import React, { Component } from 'react';
import echarts from 'echarts';
import { Card, Spin, Row, Col } from 'antd';
import moment from 'moment';

export default class Top extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    async componentDidMount () {
        var myChart = echarts.init(document.getElementById('topRight'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['未定位', '已定位']
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
                        {value: 0, name: '未定位'},
                        {value: 0, name: '已定位'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    async componentDidUpdate (prevProps, prevState) {
        const {
            locationStatQueryTime,
            queryTime
        } = this.props;
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.loading();
        }
        if (locationStatQueryTime && locationStatQueryTime !== prevProps.locationStatQueryTime) {
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
            locationStat
        } = this.props;
        try {
            console.log('wwwwwwwwwwwww');
            if (locationStat) {
                let data = locationStat.split(',');
                let unLocationNum = Number(data[0]);
                let locationNum = Number(data[1]);
                let myChart = echarts.init(document.getElementById('topRight'));
                let option = {
                    series: [
                        {
                            data: [
                                {value: unLocationNum, name: '未定位'},
                                {value: locationNum, name: '已定位'}
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
        console.log('loading', this.state.loading);
        return (
            <Spin spinning={this.state.loading}>
                <div
                    id='topRight'
                    style={{ width: '100%', height: '300px' }}
                />
            </Spin>

        );
    }
}

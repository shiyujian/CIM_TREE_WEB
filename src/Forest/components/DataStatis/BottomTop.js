import React, { Component } from 'react';
import echarts from 'echarts';
import { Card, Spin, Row, Col } from 'antd';
import moment from 'moment';

export default class Bottom extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    async componentDidMount () {
        var myChart4 = echarts.init(document.getElementById('bottomTop'));
        let option4 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
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
                    name: '苗圃数量',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '苗圃数量',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '苗圃数量',
                    type: 'bar',
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [{ type: 'average', name: '平均值' }]
                    }
                }
            ]
        };
        myChart4.setOption(option4);
    }

    async componentDidUpdate (prevProps, prevState) {
        const {
            queryTime
        } = this.props;
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.query();
        }
    }

    query = () => {

    }

    render () {
        // todo 苗木种植强度分析

        return (
            <div
                id='bottomTop'
                style={{ width: '100%', height: '300px' }}
            />
        );
    }
}

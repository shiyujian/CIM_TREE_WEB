import React, { Component } from 'react';
import echarts from 'echarts';
import { Card, Spin, Row, Col } from 'antd';
import {TREETYPENO} from '_platform/api';
import moment from 'moment';

export default class Middle extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    async componentDidMount () {
        var myChart = echarts.init(document.getElementById('middleLeft'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['常绿乔木', '落叶乔木', '亚乔木', '灌木', '地被']
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
                        {value: 0, name: '常绿乔木'},
                        {value: 0, name: '落叶乔木'},
                        {value: 0, name: '亚乔木'},
                        {value: 0, name: '灌木'},
                        {value: 0, name: '地被'}
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
            statByTreetypeQueryTime
        } = this.props;
        if (statByTreetypeQueryTime && statByTreetypeQueryTime !== prevProps.statByTreetypeQueryTime) {
            this.query();
        }
    }

    getTreetypeData = () => {
        let treetypeData = [];
        console.log('TREETYPENO', TREETYPENO);
        for (let i = 0; i < TREETYPENO.length; i++) {
            treetypeData.push(
                {
                    value: 0,
                    name: TREETYPENO[i].name,
                    id: TREETYPENO[i].id
                }
            );
        }
        return treetypeData;
    };

    getTreetypeName = (treetypeData) => {
        let treetypeName = [];
        for (let i = 0; i < treetypeData.length; i++) {
            treetypeName.push(treetypeData[i].name);
        }
        return treetypeName;
    }

    query = () => {
        const {
            statByTreetype
        } = this.props;
        try {
            let treetypeData = this.getTreetypeData();
            console.log('treetypeData', treetypeData);
            let treetypeName = this.getTreetypeName(treetypeData);
            console.log('treetypeName', treetypeName);
            if (statByTreetype && statByTreetype instanceof Array) {
                for (let t = 0; t < statByTreetype.length; t++) {
                    if (statByTreetype[t].TreeTypeNo) {
                        let bigTreeType = statByTreetype[t].TreeTypeNo.substr(0, 1);
                        for (let s = 0; s < treetypeData.length; s++) {
                            if (Number(bigTreeType) === Number(treetypeData[s].id)) {
                                treetypeData[s].value = treetypeData[s].value + statByTreetype[t].Num;
                            }
                        }
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('middleLeft'));
            let option = {
                legend: {
                    data: treetypeName
                },
                series: [
                    {
                        data: treetypeData
                    }
                ]
            };
            myChart.setOption(option);
        } catch (e) {
            console.log('middleLeft', e);
        }
    }

    render () {
        return (
            <div
                id='middleLeft'
                style={{ width: '100%', height: '350px' }}
            />
        );
    }
}

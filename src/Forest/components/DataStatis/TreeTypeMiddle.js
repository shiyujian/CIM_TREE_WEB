import React, { Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class TreeTypeMiddle extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    async componentDidMount () {
        var myChart = echarts.init(document.getElementById('TreeTypeMiddle'));
        let option = {
            title: {
                text: '栽植树种数量排名',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                // data: ['油松', '银杏', '白皮松', '国槐', '侧柏']
                data: []
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    // data: [0, 0, 0, 0, 0]
                    data: []
                }
            ]
        };
        myChart.setOption(option);
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode) {
            this.query();
        }
    }

    async componentDidUpdate (prevProps, prevState) {
        const {
            statByTreetypeQueryTime,
            queryTime,
            treeTypeDisplayTable
        } = this.props;
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.loading();
        }
        if (statByTreetypeQueryTime && statByTreetypeQueryTime !== prevProps.statByTreetypeQueryTime) {
            this.query();
        }
        if (!treeTypeDisplayTable && treeTypeDisplayTable !== prevProps.treeTypeDisplayTable) {
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
            statByTreetype
        } = this.props;
        try {
            let treetypeName = [];
            let treetypeNum = [];
            if (statByTreetype && statByTreetype instanceof Array) {
                // 将获取的数据按照 Num 排序
                statByTreetype.sort(function (a, b) {
                    if (a.Num > b.Num) {
                        return -1;
                    } else if (a.Num < b.Num) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                for (let i = 4; i >= 0; i--) {
                    if (statByTreetype[i]) {
                        treetypeName.push(statByTreetype[i].TreeTypeName);
                        treetypeNum.push(statByTreetype[i].Num);
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('TreeTypeMiddle'));
            let option = {
                yAxis: {
                    data: treetypeName
                },
                series: [
                    {
                        data: treetypeNum
                    }
                ]
            };
            myChart.setOption(option);
            this.setState({
                loading: false
            });
        } catch (e) {
            console.log('TreeTypeMiddle', e);
        }
    }

    render () {
        return (
            <Spin spinning={this.state.loading}>
                <div
                    id='TreeTypeMiddle'
                    style={{ width: '100%', height: '350px' }}
                />
            </Spin>
        );
    }
}

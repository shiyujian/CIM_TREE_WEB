import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
var echarts = require('echarts');
@connect(
    state => {
        const { platform } = state;
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions }, dispatch)
    })
)
export default class Staff extends Component {
    options1 = {};
    options2 = {};
    handleChange (value) {
        // use value to get the chartValue and set
        var myChart = echarts.init(document.getElementById('quality2'));
        if (value === 'P009') {
            myChart.setOption(this.options1);
        } else if (value === 'P010') {
            myChart.setOption(this.options2);
        }
    }
    componentDidMount () {
        const {
            actions: { getTreeNodeList },
            platform: { tree = {} }
        } = this.props;
        if (!tree.bigTreeList) {
            getTreeNodeList();
        }
        var myChart = echarts.init(document.getElementById('quality2'));
        const sectionStatus = 0;
        // let timeType = 'M';
        this.options1 = {
            // color: ['#409ad0', '#f39c12'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: [
                    '土地整理',
                    '放样点穴',
                    '挖穴',
                    '苗木质量',
                    '土球质量',
                    '苗木栽植',
                    '苗木支架',
                    '浇水'
                ],
                icon: 'circle',
                textStyle: { color: '#000', fontSize: 13 }
            },
            xAxis: [
                {
                    type: 'category',
                    data: [
                        '九号一区1标段',
                        '九号一区2标段',
                        '九号一区3标段',
                        '九号一区4标段',
                        '九号一区5标段'
                    ],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        textStyle: { color: '#000', fontSize: 13 }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '质量合格率评分',
                    min: 0,
                    // position:'left',
                    nameLocation: 'middle',
                    nameGap: 35,
                    interval: 25,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: { color: '#000', fontSize: 13 }
                    }
                }
            ],
            series: [
                {
                    name: '土地整理',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [4.5, 4.2, 4, 4.7, 4.5]
                },
                {
                    name: '放样点穴',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [8.9, 8.4, 8.9, 9.2, 9.3]
                },
                {
                    name: '挖穴',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.1, 8.4, 8.9, 9.2, 9.3]
                },
                {
                    name: '苗木质量',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [18.9, 18.6, 18.9, 19.2, 19.1]
                },
                {
                    name: '土球质量',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [19.2, 19.6, 19.6, 19.3, 19.1]
                },
                {
                    name: '苗木栽植',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [14.1, 14, 14.3, 14.2, 14.2]
                },
                {
                    name: '苗木支架',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.5, 9.6, 9.3, 9.4, 9.6]
                },
                {
                    name: '浇水',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.7, 9.8, 9.8, 9.6, 9.5]
                }
            ]
        };
        this.options2 = {
            // color: ['#409ad0', '#f39c12'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: [
                    '土地整理',
                    '放样点穴',
                    '挖穴',
                    '苗木质量',
                    '土球质量',
                    '苗木栽植',
                    '苗木支架',
                    '浇水'
                ],
                icon: 'circle',
                textStyle: { color: '#000', fontSize: 13 }
            },
            xAxis: [
                {
                    type: 'category',
                    data: [
                        '九号一区1标段',
                        '九号一区2标段',
                        '九号一区3标段',
                        '九号一区4标段',
                        '九号一区5标段'
                    ],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        textStyle: { color: '#000', fontSize: 13 }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '质量合格率评分',
                    min: 0,
                    // position:'left',
                    nameLocation: 'middle',
                    nameGap: 35,
                    interval: 25,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: { color: '#000', fontSize: 13 }
                    }
                }
            ],
            series: [
                {
                    name: '土地整理',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [4.5, 4.2, 4, 4.7, 4.5]
                },
                {
                    name: '放样点穴',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [8.9, 8.4, 8.9, 9.2, 9.3]
                },
                {
                    name: '挖穴',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.1, 8.4, 8.9, 9.2, 9.1]
                },
                {
                    name: '苗木质量',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [17.3, 18.6, 18.9, 19.2, 19.1]
                },
                {
                    name: '土球质量',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [19.2, 19.6, 18.6, 19.3, 18.1]
                },
                {
                    name: '苗木栽植',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [14.1, 11, 14.3, 11.2, 14.2]
                },
                {
                    name: '苗木支架',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.5, 9.6, 9.3, 9.4, 9.6]
                },
                {
                    name: '浇水',
                    type: 'bar',
                    stack: '总分',
                    barWidth: '55%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: [9.7, 9.8, 9.8, 9.6, 9.5]
                }
            ]
        };
        myChart.setOption(this.options1);
    }
    static propTypes = {};

    render () {
        // todo 产量具体实现
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        let options = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
            treeList.map(item => {
                options.push(
                    <Option value={item.No} key={item.No}>
                        {item.Name}
                    </Option>
                );
            });
        }
        return (
            <Blade title='质量信息统计'>
                <Select
                    style={{ width: 120 }}
                    onChange={this.handleChange.bind(this)}
                >
                    {options}
                </Select>
                <div id='quality2' style={{ width: '100%', height: '340px' }} />
            </Blade>
        );
    }
}

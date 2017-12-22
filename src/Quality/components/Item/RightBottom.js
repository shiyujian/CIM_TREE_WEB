import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;

export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount() {

        const myChart = echarts.init(document.getElementById('rightbottom'));

        this.optionLine = {
                    title: {
                        text: '',
                        x: 'left',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: '14'
                        }
                    },
                    color: ['#4caf50', '#f44336'],
                    // tooltip: {
                    //     trigger: 'item',
                    //     formatter: '{a} <br/>{b} : {c} ({d}%)'
                    // },
                    legend: {
                        top: 20,
                        left:'right',
                        data:['已检验','待检验']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            restore: {
                                show: true
                            }
                        }
                    },
                    series: [{
                        name: 'Line 1',
                        type: 'pie',
                        clockWise: true,
                        radius: ['50%', '66%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        hoverAnimation: false,
                
                        data: [{
                            value: 91,
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{d} %',
                                    textStyle: {
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        color: '#0580f2',
                                    },
                                    position: "center"
                                }
                            },
                            name: '已检验',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#4786ff' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    color: '#00cefc' // 鼠标悬浮上去完成的圆环的颜色
                                }
                            }
                        }, {
                            value: 9,
                            name: '待检验',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#D5D8DD' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        }]
                    }]
                }
        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                    <h2 style={{textAlign:'left',color:  '#74859f'}}>检验批验评统计</h2>
                    <div id='rightbottom' style={{ width: '100%', height: '340px' }}></div>
                </Card>
            </div>
        );
    }
}
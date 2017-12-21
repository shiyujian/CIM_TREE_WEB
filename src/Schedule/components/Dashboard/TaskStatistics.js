import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card} from 'antd';
import './index.less';
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

        const myChart = echarts.init(document.getElementById('TaskStatistics'));
        const myChart2 = echarts.init(document.getElementById('TaskStatistics2'));
        const myChart3 = echarts.init(document.getElementById('TaskStatistics3'));
        this.option = {
            title: {
                text: '91%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#0580f2',
                    fontSize: '20'
                }
            },
            color: ['#3898FF','#D5D8DD'],
            tooltip: {
                show: false,
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                show: true,
                itemGap: 12,
                left: 'right',
                data: ['按期', '逾期']
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
                radius: ['50%', '56%'],
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
                    value: 80,
                    name: '01',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#3898FF' // 100% 处的颜色
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
                    value: 20,
                    name: 'invisible',
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

        this.option2 = {
            title: {
                text: '95%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#0580f2',
                    fontSize: '20'
                }
            },
            color: ['rgba(176, 212, 251, 1)'],
            tooltip: {
                show: false,
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                show: false,
                itemGap: 12,
                data: ['01', '02']
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
                radius: ['50%', '56%'],
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
                    value: 80,
                    name: '01',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#3898FF' // 100% 处的颜色
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
                    value: 20,
                    name: 'invisible',
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

        this.option3 = {
            title: {
                text: '93%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#0580f2',
                    fontSize: '20'
                }
            },
            color: ['rgba(176, 212, 251, 1)'],
            legend: {
                orient: 'vertical',
                left: 'right',
                y: '8%',
                data:['按期','逾期']
            },
            tooltip: {
                show: false,
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                show: false,
                itemGap: 12,
                data: ['01', '02']
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
                radius: ['50%', '56%'],
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
                    value: 80,
                    name: '01',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#3898FF' // 100% 处的颜色
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
                    value: 20,
                    name: 'invisible',
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
        myChart.setOption(this.option,true);
        myChart2.setOption(this.option2,true);
        myChart3.setOption(this.option3,true);
    }
    
    
    render() { //todo 任务统计
        return (
            <div >
                <Card>
                    <h1 style={{textAlign:'left'}}>任务统计</h1>
                    <Row gutter={5}>
                        <Col span={8}>
                            <div id='TaskStatistics' style={{ width: '100%', height: '340px' }}></div>
                        </Col>
                        <Col span={8}>
                            <div id='TaskStatistics2' style={{ width: '100%', height: '340px' }}></div>
                        </Col>
                        <Col span={8}>
                            <div id='TaskStatistics3' style={{ width: '100%', height: '340px' }}></div>
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={8}>
                            <div style={{textAlign:'center'}}>
                                填报任务
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{textAlign:'center'}}>
                                审核任务
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{textAlign:'center'}}>
                                进度任务
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

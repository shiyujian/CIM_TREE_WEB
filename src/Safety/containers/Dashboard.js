import React, { Component } from 'react';
import { DynamicTitle, Sidebar, Content } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col ,Card} from 'antd';
import { actions as schemeActions } from '../store/scheme';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import echarts from 'echarts';

@connect(
    state => {
        const { platform, safety: { scheme = {} } = {} } = state;
        return { platform, scheme }
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions, ...schemeActions }, dispatch)
    })
)
export default class Dashboard extends Component {

    onSelect = () => {

    }

    componentDidUpdate() {
        const myChart1 = echarts.init(document.getElementById('resultChangePie1'));
        const myChart2 = echarts.init(document.getElementById('resultChangePie2'));
        const myChart3 = echarts.init(document.getElementById('resultChangePie3'));
        const myChart4 = echarts.init(document.getElementById('resultChangePie4'));
        var myColor = ['#FEC268', '#01E4CC', '#3797FE'];
        const option1 = {
            title: {
                text: '安全隐患上报统计',
                textStyle:{
                    color:'#74859f'
                }
            },
            color: ['#FEC268', '#01E4CC', '#3797FE'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['重大安全隐患', '较大安全隐患', '一般安全隐患']
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
                data: ['重大安全隐患', '较大安全隐患', '一般安全隐患']
            },
            series: [
                {
                    // name: '重大安全隐患',
                    type: 'bar',
                    barWidth: 20,
                    data: [20, 30, 40],
                    itemStyle: {
                        normal: {
                            barBorderRadius: 50,
                            // callback,设定每一bar颜色,配置项color顶axis一组bars颜色
                            color: function (params) {
                                var num = myColor.length;
                                return myColor[params.dataIndex % num]
                            }
                        }
                        // normal: {
                        //     show: true,
                        //     barBorderRadius: 50,
                        // }
                    },
                }
            ]
        };

        const option2 = {
            title: {
                text: '质量缺陷上报统计',
                textStyle:{
                    color:'#74859f'
                }
            },
            color: ['#FEC268', '#01E4CC', '#3797FE'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['重大安全隐患', '较大安全隐患', '一般安全隐患']
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
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '一般安全隐患',
                    type: 'bar',
                    barWidth: '25%',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                        }
                    },
                    data: [10, 52, 20, 33, 90, 30, 100, 20, 33, 90, 30, 100]
                },
                {
                    name: '较大安全隐患',
                    type: 'bar',
                    barWidth: '25%',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                        }
                    },
                    barBorderRadius: 50,
                    data: [10, 52, 20, 33, 90, 30, 100, 20, 33, 90, 30, 100]
                },
                {
                    name: '重大安全隐患',
                    type: 'bar',
                    barWidth: '25%',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                        }
                    },
                    barBorderRadius: 50,
                    data: [10, 52, 20, 33, 90, 30, 100, 20, 33, 90, 30, 100]
                }
            ]
        };
        const option3 = {
            title: {
                text: '安全管理检查评分统计',
                textStyle:{
                    color:'#74859f'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right: 'right',
                data: ['60分以下', '61-70分', '71-80分', '81-90分', '91-100分']
            },
            series: [
                {
                    name: '数据来源',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: [
                        { value: 5, name: '60分以下' },
                        { value: 15, name: '61-70分' },
                        { value: 20, name: '71-80分' },
                        { value: 20, name: '81-90分' },
                        { value: 40, name: '91-100分' }
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{d}%'
                            },
                            labelLine: {
                                show: true
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: ['rgb(254,194,104)', 'rgb(0,127,172)', 'rgb(0,182,237)', 'rgb(70,133,254)', 'rgb(1,228,204)']
        };
        const option4 = {
            title: {
                text: '安全策划上传统计',
                textStyle:{
                    color:'#74859f'
                }
            },
            color: ['#3797FE'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                        }
                    },
                    data: [10, 52, 20, 33, 90, 30, 100, 20, 33, 90, 30, 100]
                }
            ]
        };
        myChart1.setOption(option1, true);
        myChart2.setOption(option2, true);
        myChart3.setOption(option3, true);
        myChart4.setOption(option4, true);


    }
    render() {
        return (
            <div style={{ marginLeft: '160px' }}>
                <DynamicTitle title="统计分析" {...this.props} />
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />
                    </div>
                </Sidebar>
                <Content>
                    <Row gutter={20}>
                        <Col span={11}>
                            <Card id='resultChangePie1' style={{ width: '100%', height: '450px' }}></Card>
                        </Col>
                        <Col span={11}>
                            <Card id='resultChangePie2' style={{ width: '100%', height: '450px' }}></Card>
                            <label style={{ display: 'block', textAlign: 'center', fontSize: 14 }}>2017</label>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }} gutter={20}>
                        <Col span={11}>
                            <Card id='resultChangePie3' style={{ width: '100%', height: '450px' }}></Card>
                        </Col>
                        <Col span={11}>
                            <Card id='resultChangePie4' style={{ width: '100%', height: '450px' }}></Card>
                            <label style={{ display: 'block', textAlign: 'center', fontSize: 14 }}>2017</label>
                        </Col>
                    </Row>
                </Content>
            </div>);
    }
}

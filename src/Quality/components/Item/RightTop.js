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

        const myChart = echarts.init(document.getElementById('rightop'));

        this.optionLine = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data:['已检验批个数','优良率'],
                left:'right'
                
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['分部一','分部二','分部三','分部四','分部五','分部六','分部七'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '已检验批（个）',
                    min: 0,
                    max: 500,
                    interval: 100,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
                {
                    type: 'value',
                    name: '优良率（%）',
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name:'已检验批个数',
                    type:'bar',
                    data:[250, 360, 280, 230, 312, 240, 290],
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                },
                {
                    name:'优良率',
                    type:'line',
                    yAxisIndex: 1,
                    data:[82,85,79,83,90,89,95],
                    itemStyle:{
                        normal:{
                            color:'#4786ff'
                        }
                    }
                }
            ]
        };
        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                    <h2 style={{textAlign:'left',color:  '#74859f'}}>检验批验评统计</h2>
                    <div id='rightop' style={{ width: '100%', height: '340px' }}></div>
                </Card>
            </div>
        );
    }
}
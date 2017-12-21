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
        

        const myChart = echarts.init(document.getElementById('EngineeringCompletion'));
        this.optionBar = {
            color: [ '#3898FF','#02E5CD','#1859ec', '#0ee24f'],
            legend: {
                data: ['计划完成', '实际完成'],
                x:'right'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                    // saveAsImage: {
                    //     show: true
                    // }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'计划完成',
                    type:'bar',
                    data:[7000, 7000, 9400, 7500, 5800, 6200, 5300, 7200, 7200, 5900, 6100, 7000]
                },
                {
                    name:'实际完成',
                    type:'bar',
                    data:[7500, 7500, 8400, 5500, 5000, 7900, 5300, 7400, 6800, 7500, 5800, 7500]
                }
            ]
        };

        myChart.setOption(this.optionBar,true);
    }
    
    
    render() { //todo 工程量完成对比
        return (
            <div >
                <Card>
                    <h1 style={{textAlign:'left'}}>工程量完成对比</h1>
                    <div id='EngineeringCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <label style={{display:'block',textAlign:'center',fontSize:14}}>2017</label>
                </Card>
            </div>
        );
    }
}

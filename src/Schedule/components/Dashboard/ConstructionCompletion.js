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

        const myChart = echarts.init(document.getElementById('ConstructionCompletion'));
        this.optionBar = {
            color: [ '#02E5CD','#fcff82','#1859ec', '#0ee24f'],
            legend: {
                data: ['计划完成', '实际完成'],
                x:'left'
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
                    //     // show: true
                    // }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['分部一', '分部二', '分部三', '分部四', '分部五', '分部六'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    min: 0,
                    max: 100,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series : [
                {
                    // name:'计划完成',
                    type:'bar',
                    data:[80, 70, 60, 84, 70, 95],
                    barWidth: 20
                },
                // {
                //     // name:'实际完成',
                //     type:'bar',
                //     data:[12082, 8680, 4015, 5813, 7556, 5493, 12082, 8680]
                // }
            ]
        };
        

        myChart.setOption(this.optionBar,true);
    }
    
    
    render() { //todo 建设计划完成统计
        const{
            unitProjecte
        }=this.state
        return (
            <div >
                <Card>
                    <label style={{textAlign:'left',display:'block',fontSize:14}}>建设计划完成统计</label>
                    <div id='ConstructionCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <label style={{display:'block',textAlign:'center',fontSize:14}}>2017</label>
                </Card>
            </div>
        );
    }

}

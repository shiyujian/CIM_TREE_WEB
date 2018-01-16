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

        const myChart = echarts.init(document.getElementById('AccumulativeCompletion'));

        this.optionLine = {
            color: [ '#546d83'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['Step Start', 'Step Middle', 'Step End']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    // saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                data :['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                splitLine: {show: false}
                // textStyle : {
                //     fontStyle : 'oblique'
                // }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 200,
                interval: 40,
            },
            series: [
                {
                    // name:'Step Start',
                    type:'line',
                    // step: 'start',
                    data:[38, 60, 42, 45, 38, 60, 50, 65, 40, 56, 49, 52],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#8c9dab'
                            }, {
                                offset: 1,
                                color: '#ffe'
                            }])
                        }
                    },
                }
            ]
        };
        

        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                    <h2 style={{textAlign:'left',color:  '#74859f'}}>质量缺陷上报统计</h2>
                    <div id='AccumulativeCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <label style={{display:'block',textAlign:'center',fontSize:14}}>2017</label>
                </Card>
            </div>
        );
    }
}

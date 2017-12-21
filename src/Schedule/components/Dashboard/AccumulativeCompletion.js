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

        const myChart = echarts.init(document.getElementById('AccumulativeCompletion'));

        this.optionLine = {
            color: [ '#0B7FFF'],
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
                type: 'value'
            },
            series: [
                {
                    // name:'Step Start',
                    type:'line',
                    // step: 'start',
                    data:[6100, 7800, 7000, 7900, 7000, 8200, 7800, 8200, 7500, 8200, 7600, 7800]
                }
            ]
        };
        

        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                    <h1 style={{textAlign:'left'}}>累计完成工程量</h1>
                    <div id='AccumulativeCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <label style={{display:'block',textAlign:'center',fontSize:14}}>2017</label>
                </Card>
            </div>
        );
    }
}

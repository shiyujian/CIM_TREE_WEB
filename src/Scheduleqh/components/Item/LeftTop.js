import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2017-11-24 23:59:59'),
            departOptions:"",

        }
    }

    componentDidMount() {

        const myChart = echarts.init(document.getElementById('lefttop'));

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
                data:['总数','一标','二标','三标','四标','五标'],
                left:'right'
                
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '长度（m）',
                    min: 0,
                    max: 180,
                    interval: 20,
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
                    name:'总数',
                    type:'bar',
                    data:[82,85,79,83,90,89,95],
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                },
                {
                    name:'一标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[82,85,79,83,90,89,95],
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    }
                },
                {
                    name:'二标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[42,45,49,43,42,45,49,43],
                    itemStyle:{
                        normal:{
                            color:'orange'
                        }
                    }
                },
                {
                    name:'三标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[72,75,79,63,52,75,79,73],
                    itemStyle:{
                        normal:{
                            color:'yellow'
                        }
                    }
                },
                {
                    name:'四标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[32,25,49,33,52,65,39,53],
                    itemStyle:{
                        normal:{
                            color:'blue'
                        }
                    }
                },
                {
                    name:'五标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[12,25,39,33,42,55,69,63],
                    itemStyle:{
                        normal:{
                            color:'green'
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
            施工时间：
                <RangePicker 
                             style={{verticalAlign:"middle"}} 
                             defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
                             showTime={{ format: 'HH:mm:ss' }}
                             format={'YYYY/MM/DD HH:mm:ss'}
                             onChange={this.datepick.bind(this)}
                             onOk={this.datepickok.bind(this)}
                            >
                            </RangePicker>
                    <div id='lefttop' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          defaultValue="1"
                          onSelect={this.onDepartments.bind(this,'departments') }>
                          <Option value="1">便道施工</Option>
                          <Option value="2">给排水沟开挖</Option>
                          <Option value="3">常绿乔木</Option>
                          <Option value="4">落叶乔木</Option>
                          <Option value="5">亚乔木</Option>
                          <Option value="6">灌木</Option>
                          <Option value="7">草木</Option>
                    </Select>
                    <span>强度分析</span>
                </Card>
            </div>
        );
    }
    datepick(){}
    datepickok(){}
    onDepartments(){}
}
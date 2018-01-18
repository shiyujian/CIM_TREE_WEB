import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;
export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2017-11-24 23:59:59'),
            departOptions:"",
            data:[20,100,100,80,60]

        }
    }

    componentDidMount() {

        const myChart = echarts.init(document.getElementById('AccumulativeCompletion'));

        this.optionLine = {
            // backgroundColor: '#666',
            title: {
                text: '安全隐患数量',
                textStyle: {
                    color: '#fff',
                    // color: '#000',
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right: 'right',
                data: ['一般安全隐患', '较大安全事故', '重大安全事故', '一般安全事故', '重大安全隐患']
                // data: ['-', '-', '-', '-', '-']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '40%',
                    // center: ['50%', '60%'],
                    data: this.state.data,
                    selectedMode: 'single'
                    ,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                // formatter: '{d}%'
                            },
                            labelLine: {
                                show: true
                            },
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff',
                                // color: '#000',
                                fontSize: '12px',
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#fff',
                                // color: '#000',
                                fontSize: '12px',
                            }
                        }
                    },
                }
            ],
            color: ['#0fbc7a', '#fca700', '#772fbf', '#11d0d8', '#0e8ed7']
        };

        

        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                    <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this)}
                     onOk={this.datepickok.bind(this)}
                    >
                    </DatePicker>
                    <div id='AccumulativeCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          value=""
                          onSelect={this.onDepartments.bind(this,'departments') }>
                          {this.state.departOptions}
                    </Select>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          value=""
                          onSelect={this.onDepartments.bind(this,'departments') }>
                          {this.state.departOptions}
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

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
            // legend: {
            //     data:['一标'],
            //     left:'right'
                
            // },
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
                    min: 0,
                    max: 50,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
            ],
            series: [
               
                {
                    name:'一标',
                    type:'line',
                    yAxisIndex: 0,
                    data:[30,40,50,20,10,30,30],
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    }
                },
              
            ]
        };
        myChart.setOption(this.optionLine,true);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                 <RangePicker 
                             style={{verticalAlign:"middle"}} 
                             defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
                             showTime={{ format: 'HH:mm:ss' }}
                             format={'YYYY/MM/DD HH:mm:ss'}
                             onChange={this.datepick.bind(this)}
                             onOk={this.datepickok.bind(this)}
                            >
                            </RangePicker>
                    <div id='rightop' style={{ width: '100%', height: '340px' }}></div>
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
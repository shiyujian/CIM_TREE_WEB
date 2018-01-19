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

        const myChart = echarts.init(document.getElementById('rightbottom'));

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
            //     data:['已检验批个数','优良率'],
            //     left:'right'
                
            // },
            xAxis: [
                {
                    type: 'value',
                    boundaryGap:[0,0.01],
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    boundaryGap:[0,0.01],
                    data:[1,2,3,4,5,6,7,8],
                },
                
            ],
            series: [
                {
                    name:'已检验批个数',
                    type:'bar',
                    data:[250, 360, 280, 230, 312, 240, 290,300],
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
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
                截止日期：
                   <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this)}
                     onOk={this.datepickok.bind(this)}
                    >
                    </DatePicker>
                    <div id='rightbottom' style={{ width: '100%', height: '340px' }}></div>
                    {/*<Select 
                          style={{marginLeft:'150px'}}
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
                    </Select>*/}
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          defaultValue="1"
                          onSelect={this.onDepartments.bind(this,'departments') }>
                          <Option value="1">全部</Option>
                          <Option value="2">一标</Option>
                          <Option value="3">二标</Option>
                          <Option value="4">三标</Option>
                          <Option value="5">四标</Option>
                          <Option value="6">五标</Option>
                    </Select>
                    <span>进度分析</span>
                </Card>
            </div>
        );
    }
    datepick(){}
    datepickok(){}
    onDepartments(){}
}
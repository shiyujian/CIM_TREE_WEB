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
            stime1: moment().format('2017/11/17 00:00:00'),
            etime1: moment().format('YYYY-MM-DD 23:59:59'),
            project:"便道施工",
            departOptions:"",
            data: [
                { value: 50, name: '一般安全隐患', selected: true },
                { value: 10, name: '较大安全事故' },
                { value: 10, name: '重大安全事故' },
                { value: 10, name: '一般安全事故' },
                { value: 20, name: '重大安全隐患' },
            ],


        }
    }

    componentDidMount() {

        const myChart = echarts.init(document.getElementById('AccumulativeCompletion'));

        let optionLine = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                right: 'right',
                // data: ['-', '-', '-', '-', '-']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '40%',
                    data: this.state.data,
                    selectedMode: 'single'
                    ,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
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
                                color: '#000',
                                // color: '#000',
                                fontSize: '12px',
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#000',
                                // color: '#000',
                                fontSize: '12px',
                            }
                        }
                    },
                }
            ],
            color: ['#0fbc7a', '#fca700', '#772fbf', '#11d0d8', '#0e8ed7']
        };
        myChart.setOption(optionLine);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                截止日期：
                    <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime1, 'YYYY/MM/DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this)}
                     onOk={this.datepickok.bind(this)}
                    >
                    </DatePicker>
                    <div id='AccumulativeCompletion' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          defaultValue="1"
                          onSelect={this.onDepartments.bind(this)}>
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
    datepickok(value){
        this.setState({etime1:value?moment(value).format('YYYY/MM/DD HH:mm:s'):'',})
        
        const {actions: {progressstat4pie}} = this.props;
        progressstat4pie({},{project:this.state.project,etime:this.state.etime1}).then(rst=>{
            this.getdata(rst);
        })

    }
    
    onDepartments(value){
        console.log(value);
        const {actions: {progressstat4pie}} = this.props;
        this.setState({
            project:value,
        })
        progressstat4pie({},{project:value,etime:this.state.etime1}).then(rst=>{
            this.getdata(rst);
        })

    }

    getdata(rst){
        console.log(rst);
    }
}

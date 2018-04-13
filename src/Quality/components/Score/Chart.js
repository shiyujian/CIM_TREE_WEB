import React, {Component} from 'react';
import {
    Form, Input, Select, Button, Row, Col,Table,Collapse,DatePicker
} from 'antd';
import moment from 'moment';
var echarts = require('echarts');
const {RangePicker} = DatePicker
const Option = Select.Option;

export default class Chart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sectionList:[],
            stime:moment().format('YYYY-MM-DD 00:00:00'),
            etime:moment().format('YYYY-MM-DD 23:59:59')
        }
    }
    componentDidMount(){
        var myChart = echarts.init(document.getElementById('qualtyScore'));
        this.option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
        myChart.setOption(this.option)
    }

    componentWillReceiveProps(props){
        if(props.sectionList){
            this.setState({sectionList:props.sectionList})
        }
    }
    render() {
        const {part = [], formdocument = []} = this.props;
        return (
            <div>
                <RangePicker
                 style={{verticleAlign:'middle'}}
                 showTime={{ format: 'HH:mm:ss' }}
                 format={'YYYY/MM/DD HH:mm:ss'}
                 defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]} 
                 >

                </RangePicker>
                <div id='qualtyScore' style = {{width:'80%',height:'340px',marginTop:20}}></div>
                <Select style={{width:150,marginTop:20,marginLeft:100}}>
                    {
                        this.state.sectionList
                    }
                </Select>
            </div>
        );
    }
}
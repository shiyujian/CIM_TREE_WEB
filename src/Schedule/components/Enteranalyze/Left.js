import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API, FORESTTYPE,TREETYPENO} from '../../../_platform/api';
import moment from 'moment';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class Left extends Component {

    constructor(props) {
        super(props)
        this.state = {
            section: '',
            // etime: moment().add(1, 'days').format('YYYY/MM/DD'),
            // stime: moment().format('2018/01/01'),
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            loading:false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const{
            etime
        }=this.state
        const {
            leftkeycode
        }=this.props
        if( etime != prevState.etime){
            this.query()
        }
        if(leftkeycode != prevProps.leftkeycode){
            this.query()
        }
    }

    componentDidMount(){
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
            title: {
                text: '苗木进场总数',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {show: true}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisPointer: {
                        type: 'shadow'
                    },
                   
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: [
                {
                    name: '苗木进场总数',
                    type: 'bar',
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
            ]
        };
        myChart1.setOption(option1);
        
        this.query(1)
    }
    //苗木进场总数
    async query(no){
        const{
            leftkeycode,
            actions:{
                gettreetype
            }
        }=this.props
        const{
            etime,
            stime 
        }=this.state
        if (!leftkeycode)
        return 
        let postdata = {}
        this.setState({
            loading:true
        })

        postdata.no = leftkeycode
        postdata.stime = stime
        postdata.etime = etime
        let rst = await gettreetype({},postdata)
        console.log('aaaaaaaaaaaaaarst',rst)
        let units = ['一标段','二标段','三标段','四标段','五标段']
        let data = [];
    
        if(rst && rst instanceof Array){
            data[0] = data[1] = data[2] = data[3] = data[4] = data[5]  = 0
            if(leftkeycode.indexOf('P009')>-1){
                rst.map(item=>{
                    if(item && item.Section){
                        switch(item.Section){
                            case 'P009-01-01' : 
                                data[0] = data[0] + item.Num
                                break;
                            case 'P009-01-02' :
                                data[1] = data[1] + item.Num
                                break;
                            case 'P009-01-03' :
                                data[2] = data[2] + item.Num
                                break;
                            case 'P009-01-04' :
                                data[3] = data[3] + item.Num
                                break;
                            case 'P009-01-05' :
                                data[4] = data[4] + item.Num
                                break;
                        }
                    }                    
                })
            }else if(leftkeycode.indexOf('P010') >-1){
                units = ['一标段','二标段','三标段','四标段','五标段','六标段']
                rst.map(item=>{
                    if(item && item.Section){
                        switch(item.Section){
                            case 'P010-01-01' : 
                                data[0] = data[0] + item.Num
                                break;
                            case 'P010-01-02' :
                                data[1] = data[1] + item.Num
                                break;
                            case 'P010-01-03' :
                                data[2] = data[2] + item.Num
                                break;
                            case 'P010-01-04' :
                                data[3] = data[3] + item.Num
                                break;
                            case 'P010-02-05' :
                                data[4] = data[4] + item.Num
                                break;
                            case 'P010-03-06' :
                                data[5] = data[5] + item.Num
                                break;
                        }
                    }                    
                })
            }
        }
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
            
            xAxis: [
                {
                    data: units
                }
            ],
            series: [
                {
                    data: data
                },
            ]
        };
        myChart1.setOption(option1);
        this.setState({
            loading:false
        })

    }

    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Cards search={this.searchRender()} title='苗木进场总数'>
                        <div id = 'king' style = {{width:'100%',height:'400px'}}>
                        </div>
                    </Cards>
                </Spin>
            </div>
        );
    }

    searchRender() {
        return (<div>
            <span>选择时间：</span>
            <RangePicker 
                style={{verticalAlign:"middle"}} 
                defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]} 
                showTime={{ format: 'HH:mm:ss' }}
                format={'YYYY/MM/DD HH:mm:ss'}
                onChange={this.datepick.bind(this)}
                onOk={this.datepick.bind(this)}
            >
            </RangePicker>
        </div>)
        
    }

    datepick(value){
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):''})
    }
}





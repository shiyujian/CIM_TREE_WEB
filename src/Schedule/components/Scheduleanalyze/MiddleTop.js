import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker,Spin} from 'antd';
import { FORESTTYPE } from '../../../_platform/api';
import {Cards, SumTotal, DateImg} from '../../components';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;

export default class MiddleTop extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            loading:false,
            stime: moment().format('2017/01/01'),
            etime: moment().format('YYYY/MM/DD'),
        }
    }

    componentDidMount(){
        var myChart2 = echarts.init(document.getElementById('middleTop'));
        myChart2.on('click', function (params) {
            that.onsectionchange(params.name)
        });
        let option2 = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            
                    type : 'shadow'        
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
            xAxis : [
                {
                    type : 'category',
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name: '种植数',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series : []
        };
        myChart2.setOption(option2);
        this.query()
    }

    componnetDidUpdate(prevProps, prevState){
        const {
            etime
        } = this.state
        const {
            leftkeycode
        }=this.props
        if(leftkeycode != prevProps.leftkeycode || etime != prevState.etime){
            this.query()
        }
    }

    async query() {
        
        const {
            actions: {
                gettreetypeAll,
                gettreetypeSection,
                gettreetypeSmallClass,
                gettreetypeThinClass
            },
            leftkeycode,
            sectionoption
        } = this.props;
        const {
            etime
        } = this.state
        let param = {}

        param.no = leftkeycode;
        param.etime = etime;
        this.setState({loading:true})

        let rst = await gettreetypeAll({},param)
        
        console.log('MiddleTopMiddleTopMiddleTop',rst)

        let units = ['一标段','二标段','三标段','四标段','五标段']

        let gpshtnum = [];
        let times = [];
        let time = [];
        let total = []
       
        if(rst && rst instanceof Array){
            gpshtnum[0] = gpshtnum[1] = gpshtnum[2] = gpshtnum[3] = gpshtnum[4] = gpshtnum[5] = 0

            if(leftkeycode.indexOf('P009')>-1){
                rst.map(item=>{
                    if(item && item.Section){
                        switch(item.Section){
                            case 'P009-01-01' : 
                            gpshtnum[0] = gpshtnum[0] + item.Num
                                break;
                            case 'P009-01-02' :
                            gpshtnum[1] = gpshtnum[1] + item.Num
                                break;
                            case 'P009-01-03' :
                            gpshtnum[2] = gpshtnum[2] + item.Num
                                break;
                            case 'P009-01-04' :
                            gpshtnum[3] = gpshtnum[3] + item.Num
                                break;
                            case 'P009-01-05' :
                            gpshtnum[4] = gpshtnum[4] + item.Num
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
                                gpshtnum[0] = gpshtnum[0] + item.Num
                                break;
                            case 'P010-01-02' :
                                gpshtnum[1] = gpshtnum[1] + item.Num
                                break;
                            case 'P010-01-03' :
                                gpshtnum[2] = gpshtnum[2] + item.Num
                                break;
                            case 'P010-01-04' :
                                gpshtnum[3] = gpshtnum[3] + item.Num
                                break;
                            case 'P010-02-05' :
                                gpshtnum[4] = gpshtnum[4] + item.Num
                                break;
                            case 'P010-03-06' :
                                gpshtnum[5] = gpshtnum[5] + item.Num
                                break;
                        }
                    }                    
                })
            }
            console.log('gpshtnum',gpshtnum)

        }
       
        let myChart2 = echarts.getInstanceByDom(document.getElementById('middleTop'));
        let options2 = {
            legend: {
                data: ['未种植','已种植']
            },
            xAxis: [
                {
                    data: units
                }
            ],
            series: [
                {
                    name: '未种植',
                    type: 'bar',
                    stack: '总量',
                    label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                    data: gpshtnum
                },
                {
                    name: '已种植',
                    type: 'bar',
                    stack: '总量',
                    label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                    data: gpshtnum
                }
            ]
        };
        myChart2.setOption(options2);
        this.setState({loading:false})
    
    
    }

    
    
    render() { //todo 苗木种植强度分析
        
        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search()} title='各标段种植强度分析'>
                    <div id = 'middleTop' style = {{width:'100%',height:'260px'}}>
                    </div>
                </Cards>
            </Spin>
            
        );
        
      
    }
    search() {
            return (
                <div>
                    <span>截止时间：</span>
                    <DatePicker  
                        style={{textAlign:"center"}} 
                        showTime
                        defaultValue={moment(this.state.etime, 'YYYY/MM/DD')} 
                        format={'YYYY/MM/DD'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepickok.bind(this)}
                    >
                    </DatePicker>
                </div>
            ) 
    }

    datepick(value){
        
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD'):''})
        
    }

    datepickok(){
        const {stime,etime} = this.state;
        let param = {
            stime:this.state.stime,
            etime:this.state.etime1,
        }
    }
    
    
    
}
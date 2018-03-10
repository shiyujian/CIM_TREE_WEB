import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,DatePicker,Spin} from 'antd';
import { FORESTTYPE } from '../../../_platform/api';
import {Cards, SumTotal, DateImg} from '../../components';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;

export default class LeftTop extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            loading:false,
            stime: moment().format('2017/01/01'),
            etime: moment().add(1, 'days').format('YYYY/MM/DD'),
        }
    }

    componentDidMount(){
        var myChart1 = echarts.init(document.getElementById('leftTop'));
        const that = this;
        let option1 = {
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
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '总数',
                    yAxisIndex: 1,
                    stack: '总量',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '标段',
                    stack: '总量',
                    position: 'right',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: []
        };
        myChart1.setOption(option1);
        this.query()
    }

    componentDidUpdate(prevProps, prevState){
        const {
            stime,
            etime
        } = this.state
        const {
            leftkeycode
        }=this.props
        try{
            if(leftkeycode.split('-')[0] != prevProps.leftkeycode.split('-')[0]){
                this.query()
            }
        }catch(e){
            console.log(e)
        }
        if(stime != prevState.stime || etime != prevState.etime){
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
            stime,
            etime
        }=this.state
        let param = {}
        let no = ''
        if(leftkeycode){
            try{
                no = leftkeycode.split('-')[0]
            }catch(e){
                console.log(e)
            }
        }
        param.no = no;
        param.stime = stime;
        param.etime = etime;
        
        this.setState({loading:true})
        let rst = await gettreetypeAll({},param)
        console.log('leftkeycodeleftkeycodeleftkeycode',leftkeycode)
        console.log('LeftTopLeftTopLeftTop',rst)

        let units = ['一标段','二标段','三标段','四标段','五标段']
        let data = [];
        let gpshtnum = [];
        let times = [];
        let time = [];
        let total = []
        data[0] = new Array()
        data[1] = new Array()
        data[2] = new Array()
        data[3] = new Array()
        data[4] = new Array()
        if(leftkeycode.indexOf('P010') >-1){
            data[5] = new Array()
        }
    
        
        let totledata = [],sectionList = [],timeData = [];
        if(rst && rst instanceof Array){
            //将 Time 单独列为一个数组
            for(let i=0;i<rst.length;i++){
                if(rst[i].Section){
                    time.push(rst[i].Time)
                }
            }
            console.log('time',time)
            //时间数组去重
            times = [...new Set(time)]
            console.log('times',times)


            //定义一个二维数组，分为多个标段
            gpshtnum[0] = new Array()
            gpshtnum[1] = new Array()
            gpshtnum[2] = new Array()
            gpshtnum[3] = new Array()
            gpshtnum[4] = new Array()
            

            if(leftkeycode.indexOf('P009')>-1){
                rst.map(item=>{
                    if(item && item.Section){
                        switch(item.Section){
                            case 'P009-01-01' : 
                            gpshtnum[0].push(item)
                                break;
                            case 'P009-01-02' :
                            gpshtnum[1].push(item)
                                break;
                            case 'P009-01-03' :
                            gpshtnum[2].push(item)
                                break;
                            case 'P009-01-04' :
                            gpshtnum[3].push(item)
                                break;
                            case 'P009-01-05' :
                            gpshtnum[4].push(item)
                                break;
                        }
                    }                    
                })
            }else if(leftkeycode.indexOf('P010') >-1){
                gpshtnum[5] = new Array()
                rst.map(item=>{
                    if(item && item.Section){
                        switch(item.Section){
                            case 'P010-01-01' : 
                                gpshtnum[0].push(item)
                                break;
                            case 'P010-01-02' :
                                gpshtnum[1].push(item)
                                break;
                            case 'P010-01-03' :
                                gpshtnum[2].push(item)
                                break;
                            case 'P010-01-04' :
                                gpshtnum[3].push(item)
                                break;
                            case 'P010-02-05' :
                                gpshtnum[4].push(item)
                                break;
                            case 'P010-03-06' :
                                gpshtnum[5].push(item)
                                break;
                        }
                    }                    
                })
            }
            console.log('gpshtnum',gpshtnum)
    
            times.map((time,index)=>{
                data[0][index]=0;
                data[1][index]=0;
                data[2][index]=0;
                data[3][index]=0;
                data[4][index]=0;
                if(leftkeycode.indexOf('P010') >-1){
                    data[5][index]=0;
                }
                
                gpshtnum.map((test,i)=>{
                    test.map((arr,a)=>{
                        if(moment(arr.Time).format('YYYY/MM/DD') === time){
                            data[i][index] = data[i][index]+arr.Num+0
                        }
                    })
                })
                
            })
            for(let i=0;i<times.length;i++){
                if(leftkeycode.indexOf('P010') >-1){
                    total[i]=data[0][i]+data[1][i]+data[2][i]+data[3][i]+data[4][i]+data[5][i]
                }else{
                    total[i]=data[0][i]+data[1][i]+data[2][i]+data[3][i]+data[4][i]
                }
            
            }
            console.log('total',total)
            console.log('data',data)
        }
    
        let myChart1 = echarts.getInstanceByDom(document.getElementById('leftTop'));    
        let legend = ['总数','一标段','二标段','三标段','四标段','五标段'];
        let series= [
            {
                name:'种植总数',
                type:'bar',
                data:total,
                barWidth:'25%',
                itemStyle:{
                    normal:{
                        color:'#02e5cd',
                        barBorderRadius:[50,50,50,50]
                    }
                }
            },
            {
                name:'一标段',
                type:'line',
                data:data[0],
                itemStyle:{
                    normal:{
                        color:'black'
                    }
                }
            },
            {
                name:'二标段',
                type:'line',
                data:data[1],
                itemStyle:{
                    normal:{
                        color:'orange'
                    }
                }
            },
            {
                name:'三标段',
                type:'line',
                data:data[2],
                itemStyle:{
                    normal:{
                        color:'yellow'
                    }
                }
            },
            {
                name:'四标段',
                type:'line',
                data:data[3],
                itemStyle:{
                    normal:{
                        color:'blue'
                    }
                }
            },
            {
                name:'五标段',
                type:'line',
                data:data[4],
                itemStyle:{
                    normal:{
                        color:'green'
                    }
                }
            }
        ]
        if (leftkeycode.indexOf('P010') >-1){
            series.push(
                {
                    name:'六标段',
                    type:'line',
                    data:data[5],
                    itemStyle:{
                        normal:{
                            color:'purple'
                        }
                    }
                }
            )
            legend.push('六标段')
        }

        let options1 = {
            legend: {
                data:legend
            },
            xAxis : [
                {
                    data: times,
                }
            ],
            series: series
        };
        myChart1.setOption(options1);
        this.setState({loading:false})
    }
    
    
    render() { //todo 苗木种植强度分析
        
        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search(1)} title='苗木种植强度分析'>
                    <div id = 'leftTop' style = {{width:'100%',height:'260px'}}>
                    </div>
                </Cards>
            </Spin>
            
        );
    }

    search(index) {
        if(index === 1) {
             return <div>
                    <span>种植时间：</span>
                    <RangePicker 
                     style={{verticalAlign:"middle"}} 
                     defaultValue={[moment(this.state.stime, 'YYYY/MM/DD'),moment(this.state.etime, 'YYYY/MM/DD')]} 
                     showTime={{ format: 'YYYY/MM/DD' }}
                     format={'YYYY/MM/DD'}
                     onChange={this.datepick.bind(this)}
                     onOk={this.datepickok.bind(this)}
                    >
                    </RangePicker>
                </div>
            }
    }

    datepick(value){
        
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD'):''})
        
    }

    datepickok(){
        
    }
    
    
    
}
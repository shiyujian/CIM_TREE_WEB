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

export default class RightTop extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            loading:false,
            stime: moment().format('2017/01/01'),
            etime: moment().add(1, 'days').format('YYYY/MM/DD'),
            section: 'P009-01-01',
            sectionoption:[]
        }
    }

    componentDidMount(){
        var myChart3 = echarts.init(document.getElementById('rightTop'));
        myChart3.on('click', function (params) {
            that.smallclasschange(params.name)
        });
        let option3 = {
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
        myChart3.setOption(option3);
        this.getSectionoption()
        this.query()
    }

    getSectionoption(){
        const {
            leftkeycode
        } = this.props
        let sectionoption=[]
        if(leftkeycode.indexOf('P009')>-1){
        
            sectionoption = [
                <Option key={'P009-01-01'} value={'P009-01-01'}>一标段</Option>,
                <Option key={'P009-01-02'} value={'P009-01-02'}>二标段</Option>,
                <Option key={'P009-01-03'} value={'P009-01-03'}>三标段</Option>,
                <Option key={'P009-01-04'} value={'P009-01-04'}>四标段</Option>,
                <Option key={'P009-01-05'} value={'P009-01-05'}>五标段</Option>
            ];

            this.setState({
                section:'P009-01-01'
            })
        }else if(leftkeycode.indexOf('P010')>-1){
            sectionoption = [
                <Option key={'P010-01-01'} value={'P010-01-01'}>一标段</Option>,
                <Option key={'P010-01-02'} value={'P010-01-02'}>二标段</Option>,
                <Option key={'P010-01-03'} value={'P010-01-03'}>三标段</Option>,
                <Option key={'P010-01-04'} value={'P010-01-04'}>四标段</Option>,
                <Option key={'P010-02-05'} value={'P010-02-05'}>五标段</Option>,
                <Option key={'P010-03-06'} value={'P010-03-06'}>六标段</Option>,
            ];
            this.setState({
                section:'P010-01-01'
            })
        }
        this.setState({
            sectionoption
        })
    }

    componentDidUpdate(prevProps, prevState){
        const {
            etime,
            section
        } = this.state
        const {
            leftkeycode
        }=this.props
        if(leftkeycode != prevProps.leftkeycode ){
            this.getSectionoption()
        }
        if(section != prevState.section){
            this.query()
        }
        if(etime != prevState.etime){
            console.log('RightTopRightTopsection',section)
            console.log('RightTopRightTopetime',etime)
            console.log('RightTopRightTopetime',leftkeycode)
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
            leftkeycode
        } = this.props;
        const {
            etime,
            section
        } = this.state
        let param = {}

        param.section = section;
        param.etime = etime;
        this.setState({loading:true})

        let rst = await gettreetypeSmallClass({},param)
        
        console.log('RightTopRightTopRightTop',rst)

        let units = ['1小班','2小班','3小班','4小班','5小班']

        let complete = [];
        let unComplete = [];
        let label = [];
        let total = []
       
        if(rst && rst instanceof Array){
            rst.map((item)=>{
                complete.push(item.Complete)
                unComplete.push(item.UnComplete)
                label.push(item.Label+'号小班')
            })
        }
        console.log('RightTopcompletecomplete',complete)
        console.log('RightTopunCompleteunComplete',unComplete)
        console.log('RightToplabellabel',label)
    
        let myChart3 = echarts.init(document.getElementById('rightTop'));
        let options3 = {
            legend: {
                data: ['未种植','已种植']
            },
            xAxis: [
                {
                    data: label.length>0?label:units
                }
            ],
            series: [
                {
                    name: '未种植',
                    type: 'bar',
                    stack: '总量',
                    label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                    data: unComplete
                },
                {
                    name: '已种植',
                    type: 'bar',
                    stack: '总量',
                    label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                    data: complete
                }
            ]
        };
        myChart3.setOption(options3);
        this.setState({loading:false})
    }
    
    
    render() { //todo 苗木种植强度分析
        
        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search()} title={this.title()}>
                    <div id = 'rightTop' style = {{width:'100%',height:'260px'}}>
                    </div>
                </Cards>
            </Spin>
            
        );
    }
    title(){
        const {section,sectionoption} = this.state;
        return <div>
                    <Select value={section} onSelect={this.onsectionchange.bind(this)} style={{width: '80px'}}>
                        {sectionoption}
                    </Select>
                    <span>各小班种植进度分析</span>

                </div>
    }
    onsectionchange(value) {
        this.setState({
            section:value
        })
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

    }
    
    
    
}
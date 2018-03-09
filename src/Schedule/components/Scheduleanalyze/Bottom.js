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

export default class Bottom extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            loading:false,
            stime: moment().format('2017/01/01'),
            etime: moment().format('YYYY/MM/DD'),
            section: 'P009-01-01',
            sectionoption:[],
            SmallClassList:[],
            smallClassSelect:'',
            uniqueSmallClass:[]
        }
    }
    async componentDidMount(){
        
        var myChart4 = echarts.init(document.getElementById('bottom'));
        let option4 = {
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
                    name: '种指数',
                    yAxisIndex: 1,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : []
        };
        myChart4.setOption(option4);
        await this.getSectionoption()
        await this.getSmallClass()
        await this.selectSmallClass()
        await this.query()
    }

    async componentDidUpdate(prevProps, prevState){
        const {
            etime,
            section,
            smallClassSelect
        } = this.state
        const {
            leftkeycode
        }=this.props
        //地块修改，则修改标段
        if(leftkeycode != prevProps.leftkeycode ){
            await this.getSectionoption()
            await this.getSmallClass()
            await this.selectSmallClass()
        }
        //标段修改，修改小班
        if(section != prevState.section){
            this.selectSmallClass()
        }
        //小班和时间修改，查询数据
        if(etime != prevState.etime || smallClassSelect != prevState.smallClassSelect){
            console.log('Bottomsection',section)
            console.log('Bottometime',smallClassSelect)
            console.log('Bottomleftkeycode',leftkeycode)
            this.query()
        }
    }
    //设置标段下拉选项
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
    //设置小班选项
    async getSmallClass() {
        const {
            actions:{
                getSmallClassList
            },
            leftkeycode
        }=this.props

        const {
            section
        }=this.state
        let param = {
            no:leftkeycode
        }
        
        let SmallClassList = [];
        let lists = await getSmallClassList(param)
        console.log('BottomBottom',lists)
        if(lists && lists instanceof Array){
            SmallClassList = lists
        }
        this.setState({
            SmallClassList
        })
    }
    async selectSmallClass(){
        const {
            leftkeycode
        }=this.props
        const {
            section,
            SmallClassList
        }=this.state
        let code = '';
        let selectSmallClassList = [];
        if(section){
            try{
                code = section.split('-')[2]
            }catch(e){
                console.log(e)
            }
            
        }
        switch(code){
            case '01':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '1标段')
                break;
            case '02':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '2标段')
                break;
            case '03':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '3标段')
                break;
            case '04':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '4标段')
                break;
            case '05':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '5标段')
                break;
            case '06':
                selectSmallClassList = SmallClassList.filter(list => list.UnitProject === '6标段')
                break;
        }
        console.log('SmallClassList',SmallClassList)
        console.log('selectSmallClassListselectSmallClassList',selectSmallClassList)
        let uniqueSmallClass = [];
        let smallClassSelect = ''
        selectSmallClassList.map((list)=>{
            uniqueSmallClass.push(list.SmallClass)
        })
        console.log('uniqueSmallClass',uniqueSmallClass)
        uniqueSmallClass = [...new Set(uniqueSmallClass)]
        console.log('uniqueSmallClassuniqueSmallClass',uniqueSmallClass)
        if(uniqueSmallClass.length>0){
            smallClassSelect = uniqueSmallClass[0]
        }
        this.setState({
            uniqueSmallClass,
            smallClassSelect
        })
            

    }
    //查询数据
    async query() {
    
        const {
            actions: {
                gettreetypeThinClass
            },
            leftkeycode,
            
        } = this.props;
        const{
            smallClassSelect,
            section,etime
        }= this.state
        this.setState({loading:true})
        let param = {};
        param.no = leftkeycode + "-" +smallClassSelect;
        param.section = section;
        param.etime = etime;
        let rst = await gettreetypeThinClass({},param)

        let complete = [];
        let unComplete = [];
        let label = [];
        let total = []
        let units = ['1细班','2细班','3细班','4细班','5细班']
        if(rst && rst instanceof Array){
            rst.map((item)=>{
                complete.push(item.Complete)
                unComplete.push(item.UnComplete)
                label.push(item.Label+'号细班')
            })
        }

        console.log('Bottomcompletecomplete',complete)
        console.log('BottomunCompleteunComplete',unComplete)
        console.log('Bottomlabellabel',label)
    
        let myChart4 = echarts.getInstanceByDom(document.getElementById('bottom'));
        let options4 = {
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
        myChart4.setOption(options4);
        this.setState({loading:false})
    }
    
    
    render() { //todo 苗木种植强度分析
        
        return (
            <Spin spinning={this.state.loading}>
                <Cards style={{margin: '20px 5px 5px 5px'}} search={this.search()} title={this.title1()}>
                    <div id = 'bottom' style = {{width:'100%',height:'300px'}}>
                    </div>
                </Cards>
            </Spin>
            
        );
    }
    //标题左侧下拉框
    title1(){
        const {section, smallClassSelect,sectionoption} = this.state;
        let smallclassoption = this.smallClassRendre()
        return <div>
                    <Select value={section}  onSelect={this.onsectionchange.bind(this)} style={{width: '80px'}}>
                        {sectionoption}
                    </Select>
                    <Select value={smallClassSelect}  onChange={this.smallclasschange.bind(this)} style={{width: '100px'}}>
                        {smallclassoption}
                    </Select>
                    <span>小班各细班种植进度分析</span>
                </div>
    }
    //将小班数据转化为下拉框
    smallClassRendre(){
        const{
            uniqueSmallClass
        }=this.state
        let smallclassoption = []
        uniqueSmallClass.map((rst)=>{
            smallclassoption.push(
                <Option key={rst} value={rst}>{rst+'号小班'}</Option>
            )
        })
        return smallclassoption
    }
    //选择标段
    onsectionchange(value) {
        console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
        this.setState({
            section:value
        },()=>{
            this.selectSmallClass()
        })
    }
    //选择小班
    smallclasschange(value){
        this.setState({
            smallClassSelect:value
        })
    }
    //选择时间
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
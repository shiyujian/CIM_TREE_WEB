import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
import { PROJECT_UNITS ,TREETYPENO,ECHARTSCOLOR} from '../../../_platform/api';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            departOptions:"",
            data:"",
            gpshtnum:[],
            times:[],
            unitproject:"",
            project:"便道施工",
            treetypeAll:[]
        }
    }

    async componentDidMount() {
        const {actions: {gettreeevery}} = this.props;
        //获取全部树种信息
        let rst = await gettreeevery()
        console.log('gettreeeveryrst',rst)
        if(rst && rst instanceof Array){
            this.setState({
                treetypeAll:rst
            })
        }
       
        let myChart = echarts.init(document.getElementById('lefttop'));
 
        let optionLine = {
             tooltip: {
                 trigger: 'axis',
                 axisPointer: {
                     type: 'cross',
                     crossStyle: {
                         color: '#999'
                     }
                 }
             },
             legend: {
                 data:['总数','一标','二标','三标','四标','五标'],
                 left:'right'
                 
             },
             xAxis: [
                 {
                     type: 'category',
                     data: this.state.times,
                     axisPointer: 
                      {
                         type: 'shadow'
                     }
                 }
             ],
             yAxis: [
                 {
                     type: 'value',
                     name: '长度（m）',
                     axisLabel: {
                         formatter: '{value} '
                     }
                 },
             ],
             series: []
         };
         myChart.setOption(optionLine);
         this.getdata()
     }

    componentDidUpdate(prevProps, prevState){
        const {
            stime,
            etime,
            treetypeAll,
            project
        } = this.state
        const {
            leftkeycode
        }=this.props
        try{
            if(leftkeycode != prevProps.leftkeycode){
                this.getdata()
            }
        }catch(e){
            console.log(e)
        }
        if(stime != prevState.stime || etime != prevState.etime || project != prevState.project || treetypeAll != prevState.treetypeAll){
            this.getdata()
        }
    }
    
    render() { //todo 累计完成工程量
        console.log(this.state.data);
        
        return (
            <div >
            <Card>
            施工时间：
                <RangePicker 
                    style={{verticalAlign:"middle"}} 
                    defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]}  
                    showTime={{ format: 'HH:mm:ss' }}
                    format={'YYYY/MM/DD HH:mm:ss'}
                    onChange={this.datepick.bind(this)}
                    onOk={this.datepick.bind(this)}
                >
                </RangePicker>
                    <div id='lefttop' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                     style={{width:'100px'}}
                     defaultValue="便道施工"
                     onSelect={this.onDepartments.bind(this)}
                     onChange={this.onChange.bind(this)}>
                        <Option key="1" value="便道施工">便道施工</Option>
                        <Option key="2" value="给排水沟槽开挖">给排水沟槽开挖</Option>
                        <Option key="3" value="给排水管道安装">给排水管道安装</Option>
                        <Option key="4" value="给排水回填">给排水回填</Option>
                        <Option key="5" value="绿地平整">绿地平整</Option>
                        <Option key="6" value="种植穴工程">种植穴工程</Option>
                        <Option key="7" value="常绿乔木">常绿乔木</Option>
                        <Option key="8" value="落叶乔木">落叶乔木</Option>
                        <Option key="9" value="亚乔木">亚乔木</Option>
                        <Option key="10" value="灌木">灌木</Option>
                        <Option key="11" value="草木">草木</Option>
                    </Select>
                    <span>强度分析</span>
                </Card>
            </div>
        );
        
      
    }
    datepick(value){
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):''})
    }

    onDepartments(value){
        this.setState({
            project:value,
        })
    }
    onChange(value){
        console.log('LeftTop',value);
        this.setState({
            project:value,
        })
        
    }
    getdata(){
        const{
            etime,
            stime,
            project,
            treetypeAll
        }=this.state
        const{
            leftkeycode
        }=this.props
        let patams = {
            etime:etime,
            stime:stime,
            project:project
        }
        console.log('LeftTopaaaaa',patams)
        const {actions: {progressdata,progressalldata}} = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];
        let legend = ['总数']
        let total = [];
        let datas = [];
        progressalldata({},patams).then(rst=>{
            console.log('LeftTop',rst);
            if(rst && rst.content){

                let content = rst.content.filter((item)=> item.ProgressType && item.ProgressType==='日实际')
                //将获取的数据按照 ProgressTime 时间排序
                content.sort(function(a, b) {
                    if (a.ProgressTime < b.ProgressTime ) {
                        return -1;
                    } else if (a.ProgressTime > b.ProgressTime ) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                console.log('LeftTopcontent',content)
                //将 ProgressTime 单独列为一个数组
                for(let i=0;i<content.length;i++){
                    let a = moment(content[i].ProgressTime).format('YYYY/MM/DD')
                    time.push(a)
                }
                //时间数组去重
                times = [...new Set(time)]
                console.log('LeftToptimes',times)

                if(content && content instanceof Array){
                    PROJECT_UNITS.map((project)=>{
                        //获取正确的项目    
                        if(leftkeycode.indexOf(project.code)>-1){
                            //获取项目下的标段
                            let sections = project.units
                            //将各个标段的数据设置为0
                            sections.map((section,index)=>{
                                //定义一个二维数组，分为多个标段
                                gpshtnum[index] = new Array()
                                datas[index] = new Array()
                                legend.push(section.value)
                            })
        
                            content.map(item=>{
                                if(item && item.UnitProject){
                                    sections.map((section,index)=>{
                                        if(item.UnitProject === section.value){
                                            gpshtnum[index].push(item)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

                console.log('LeftTopgpshtnum',gpshtnum)

                times.map((time,index)=>{
                    datas.map((sectionData)=>{
                        sectionData[index] = 0
                    })
                    console.log('sectionData',datas)
                    gpshtnum.map((data,i)=>{
                        data.map((arr,a)=>{
                            if(moment(arr.ProgressTime).format('YYYY/MM/DD') === time){
                                let Items = arr.Items
                                Items.map((item,x)=>{
                                    //默认的种类
                                    if(x<6){
                                        if(item.Project === project){
                                            datas[a][index] = datas[a][index]+item.Num+0
                                        }else{
                                            datas[a][index] = datas[a][index]+0
                                        }
                                    }else{//添加的数目种类
                                        let treetype = ''
                                        treetypeAll.map((tree)=>{
                                            if(tree.TreeTypeName === rst.name){
                                                //获取树种cdoe的首个数字，找到对应的类型
                                                let code = tree.TreeTypeNo.substr(0, 1)
                                                console.log('code',code)
                                                TREETYPENO.map((forest)=>{
                                                    if(forest.id === code){
                                                        treetype = forest.name
                                                    }
                                                })
                                            }
                                        })
                                        console.log('LeftToptreetype',treetype)

                                        if(treetype === project){
                                            datas[a][index] = datas[a][index]+item.Num+0
                                        }else{
                                            datas[a][index] = datas[a][index]+0
                                        }
                                    }
                                })
                            }
                        })
                    })
                })
                
                for(let i=0;i<times.length;i++){
                    total[i] = 0
                    datas.map((sectionData)=>{
                        total[i] = total[i] + sectionData[i]
                    })
                }
     
                console.log('LeftToptotal',total)
                console.log('LeftTopdatas',datas)
            }
            //当查不出数据时，使横坐标不为空
            let a = moment().subtract(2, 'days').format('YYYY/MM/DD');
            let b = moment().subtract(1, 'days').format('YYYY/MM/DD');
            let c = moment().format('YYYY/MM/DD');
            let d = moment().add(1, 'days').format('YYYY/MM/DD');
            let e = moment().add(2, 'days').format('YYYY/MM/DD');
            let dates = [];
            dates.push(a)
            dates.push(b)
            dates.push(c)
            dates.push(d)
            dates.push(e)
            console.log('LeftTopdates',dates)


            let myChart = echarts.init(document.getElementById('lefttop'));
            let series = [
                {
                    name:'总数',
                    type:'bar',
                    data:total,
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                }
            ]
            datas.map((sectionData,index)=>{
                series.push(
                    {
                        name:legend[index+1],
                        type:'line',
                        data:sectionData,
                        itemStyle:{
                            normal:{
                                color:ECHARTSCOLOR[index]
                            }
                        }
                    },
                )
            })
            let optionLine = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        data:legend,
                        left:'right'
                        
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: times.length>0?times:dates,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '长度（m）',
                            axisLabel: {
                                formatter: '{value} '
                            }
                        },
                    
                    ],
                    series: series
                };
                myChart.setOption(optionLine);
            }
        )
            
            
    }
}
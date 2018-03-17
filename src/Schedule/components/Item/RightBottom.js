import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
import { PROJECT_UNITS ,TREETYPENO,ECHARTSCOLOR} from '../../../_platform/api';
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
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            departOptions:"",
            unitproject:"1标段",
            choose:["灌木","亚乔木","落叶乔木","常绿乔木","种植穴工程","绿地平整","给排水回填","给排水管道安装","给排水沟槽开挖","便道施工"],
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

        this.getSection()
        let myChart = echarts.init(document.getElementById('rightbottom'));

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
                    data:this.state.choose,
                },
                
            ],
            series: [
                {
                    name:'已检验批个数',
                    type:'bar',
                    data:[250, 360, 280, 230, 312, 240, 290,300,266,300],
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
        myChart.setOption(optionLine);
        this.getdata()
    }

    getSection(){
        const{
            leftkeycode
        }=this.props
        let sections = []
        PROJECT_UNITS.map((project)=>{
            if(project.code === leftkeycode){
                let units = project.units
                units.map((unit)=>{
                    sections.push(<Option key={unit.code} value={unit.value}>{unit.value}</Option>)
                })
            }
        })
        this.setState({
            sections
        })
    }

    componentDidUpdate(prevProps, prevState){
        const {
            stime,
            etime,
            unitproject
        } = this.state
        const {
            leftkeycode
        }=this.props
        try{
            if(leftkeycode != prevProps.leftkeycode){
                this.getSection()
                this.getdata()
            }
        }catch(e){
            console.log(e)
        }
        if(stime != prevState.stime || etime != prevState.etime || unitproject != prevState.unitproject){
            this.getdata()
        }
    }

    render() { 
        const{
            sections
        }=this.state
        return (
            <div >
                <Card>
                施工时间：
                    <RangePicker 
                        style={{textAlign:"center"}} 
                        defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]}  
                        showTime={{ format: 'HH:mm:ss' }}
                        format={'YYYY/MM/DD HH:mm:ss'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    >
                    </RangePicker>
                    <div id='rightbottom' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                     placeholder="请选择部门"
                     notFoundContent="暂无数据"
                     defaultValue="一标段"
                     onSelect={this.onDepartments.bind(this) }>
                        {sections}
                    </Select>
                    <span>进度分析</span>
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
            unitproject:value,
        })
    }
    
    getdata(){
        const{
            etime,
            stime,
            unitproject
        }=this.state
        const{
            leftkeycode
        }=this.props
        let params = {
            etime:etime,
            stime:stime,
            unitproject:unitproject
        }
        console.log('RightBottomaaaaaaaaaaaaaaaaaaaaa',params)
        const {actions: {progressdata,progressalldata}} = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];

        progressalldata({},params).then(rst=>{
            console.log('RightBottom',rst);
            let datas = Array(10).fill(0);
            if(rst && rst.content){

                let content = rst.content
                content.map((rst,index)=>{
                    let Items = rst.Items?rst.Items:[]
                    Items.map((item,x)=>{
                        //默认的种类
                        if(x<6){
                            switch(item.Project){
                                case '便道施工' : 
                                datas[9] += item.Num
                                    break;
                                case '给排水沟槽开挖' :
                                datas[8] += item.Num
                                    break;
                                case '给排水管道安装' :
                                datas[7] += item.Num
                                    break;
                                case '给排水回填' :
                                datas[6] += item.Num
                                    break;
                                case '绿地平整' :
                                datas[5] += item.Num
                                    break;
                                case '种植穴工程' :
                                datas[4] += item.Num
                                    break;    
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
                            console.log('RightBottomtreetype',treetype)

                            switch(treetype){
                                case '常绿乔木' : 
                                    datas[3] += item.Num
                                    break;
                                case '落叶乔木' :
                                    datas[2] += item.Num
                                    break;
                                case '亚乔木' :
                                    datas[1] += item.Num
                                    break;
                                case '灌木' :
                                    datas[0] += item.Num
                                    break;   
                            }
                        }
                    })
                })
                
                console.log('RightBottomdatas',datas)

               
            }
        
            let myChart = echarts.init(document.getElementById('rightbottom'));
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
                        data:this.state.choose,
                    },
                    
                ],
                series: [
                    {
                        name:'已检验批个数',
                        type:'bar',
                        data:datas,
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
            myChart.setOption(optionLine);

        })
        
    }
}
import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API,TREETYPENO,PROJECT_UNITS,ECHARTSCOLOR} from '../../../_platform/api';
import moment from 'moment';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class Right extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //树种的list
            selectTreeType:[],
            //所有的树种类型
            treetypeAll:[],
            //树类型option数组
            treetyoption: [],
            //选择树种类型的值
            treeTypeSelect : '全部',
            //选择的树种的值
            treeSelect :'全部',
            section: '',
            stime: moment().subtract(10, 'days').format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            loading: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const{
            stime,
            etime,
            selectTreeType,
            treeSelect
        }=this.state
        const {
            leftkeycode
        }=this.props
        if( stime != prevState.stime || etime != prevState.etime || selectTreeType != prevState.selectTreeType || 
            treeSelect != prevState.treeSelect 
        ){
            this.search()
        }
        if(leftkeycode != prevProps.leftkeycode){
            this.search()
        }
    }

    componentDidMount(){
        let myChart2 = echarts.init(document.getElementById('stock'));
        let options2 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                left:'right'
                
            },
            xAxis: [
                {
                    type: 'category',
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
            series: []
        };
        myChart2.setOption(options2);
        const {actions: {gettreeevery}} = this.props;
        //获取全部树种信息
        gettreeevery().then(rst=>{
            console.log('gettreeeveryrst',rst)
            if(rst && rst instanceof Array){
                this.setState({
                    treetypeAll:rst,
                    selectTreeType:rst
                })
            }
        });

        //树木类型
        let treetyoption = [];
        treetyoption.push(<Option key={'全部'} value={'全部'}>全部</Option>)
        TREETYPENO.map((tree)=>{
            console.log('tree',tree)
            treetyoption.push(<Option key={tree.name} value={tree.id.toString()}>{tree.name}</Option>)
        })
        console.log('treetyoption',treetyoption)
        
        this.setState({
            treetyoption,
        })
        this.search()
    }

    //进场强度分析
    async search(no){
        const{
            leftkeycode,
            actions:{
                gettreetype
            }
        }=this.props
        const{
            stime,
            etime,
            selectTreeType,
            treeTypeSelect,
            treeSelect,
            treetypeAll
        }=this.state
        let postdata = {}
        
        postdata.no = leftkeycode
        postdata.stime = stime
        postdata.etime = etime
        let treetype = []
        if(treeSelect === '全部'){
            selectTreeType.map(rst=>{
                treetype.push(rst.ID)
            })
        }else{
            treetype.push(treeSelect)
            postdata.treetype = treetype
        }

        this.setState({
            loading:true
        })
        
        
        let rst = await gettreetype({},postdata)
        console.log('wwwwwwwwwrst',rst)
        let total = [];
        let data = [];
        let gpshtnum = [];
        let times = [];
        let time = [];
        let legend = ['总数']
        
        
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

            if(rst && rst instanceof Array){
                PROJECT_UNITS.map((project)=>{
                    //获取正确的项目    
                    if(leftkeycode.indexOf(project.code)>-1){
                        //获取项目下的标段
                        let sections = project.units
                        //将各个标段的数据设置为0
                        sections.map((section,index)=>{
                            //定义一个二维数组，分为多个标段
                            gpshtnum[index] = new Array()
                            data[index] = new Array()
                            legend.push(section.value)
                        })
    
                        rst.map(item=>{
                            if(item && item.Section){
                                sections.map((section,index)=>{
                                    if(item.Section === section.code){
                                        gpshtnum[index].push(item)
                                    }
                                })
                            }
                        })
                    }
                })
            }
            
            console.log('gpshtnum',gpshtnum)
            times.map((time,index)=>{
                data.map((sectionData)=>{
                    sectionData[index] = 0
                })
                console.log('sectionData',data)
                gpshtnum.map((test,i)=>{
                    test.map((arr,a)=>{
                        if(moment(arr.Time).format('YYYY/MM/DD') === time){
                            data[i][index] = data[i][index]+arr.Num+0
                        }
                    })
                })
                
            })
            for(let i=0;i<times.length;i++){
                total[i] = 0
                data.map((sectionData)=>{
                    total[i] = total[i] + sectionData[i]
                })
            }
            console.log('total',total)
            console.log('data',data)

        }

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
        data.map((sectionData,index)=>{
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

        
        let myChart2 = echarts.init(document.getElementById('stock'));
        let options2 = {
            
            legend: {
                data:legend,
            },
            xAxis: [
                {
                    data: times,
                }
            ],
            series: series
        };
        myChart2.setOption(options2);
        this.setState({
            loading:false
        })
    }

    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Cards search={this.searchRender()} title={`进场强度分析`}>
                        <div id = 'stock' style = {{width:'100%',height:'400px'}}>
                        </div>
                    </Cards>
                </Spin>
            </div>
        );
    }

    searchRender() {
        const {treetypename,treety,treetyoption = [],treetypeAll = []} = this.state;
        let treetypeoption = this.setTreeType()
        return (
            <Row>
                <Col xl={4} lg={10}>
                    <span>类型：</span>
                    <Select className="forestcalcw2 mxw100" defaultValue={'全部'} style={{width:"85px"}} onChange={this.ontypechange.bind(this)}>
                        {treetyoption}
                    </Select>
                </Col>
                <Col xl={5} lg={10}>
                    <span>树种：</span>
                    <Select   
                        value={this.state.treeSelect}
                        optionFilterProp = 'children'
                        filterOption={(input,option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.ontreetypechange.bind(this)}
                        style={{width:"100px"}} 
                        showSearch 
                        className="forestcalcw2 mxw100" >
                        {treetypeoption}
                    </Select>
                </Col>
                <Col xl={15} lg={24}>
                    <span>起苗时间：</span>
                    <RangePicker 
                        style={{verticalAlign:"middle"}} 
                        defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]} 
                        showTime={{ format: 'HH:mm:ss' }}
                        format={'YYYY/MM/DD HH:mm:ss'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    >
                    </RangePicker>
                </Col>
            </Row>
        )
    
    }

    setTreeType(){
        const{
            selectTreeType = []
        }=this.state
        let treetypeoption = [];
        treetypeoption.push(<Option key={-1} value={'全部'}>全部</Option>)
        selectTreeType.map(rst =>{
            treetypeoption.push(<Option key={rst.ID} title={rst.TreeTypeName} value={rst.ID.toString()}>{rst.TreeTypeName}</Option>)
        })
        return treetypeoption
        
    }

    //选择树种类型
    ontypechange(value) {
        const {
            treetypeAll = [],
        } = this.state
        console.log('value',value)
        if(value === '全部'){
            this.setState({
                selectTreeType:treetypeAll,
                treeTypeSelect:value,
                treeSelect:'全部'
            })
        }else{
            let selectTreeType = [];
            treetypeAll.map((tree)=>{
                //获取树种cdoe的首个数字，找到对应的类型
                let code = tree.TreeTypeNo.substr(0, 1)
                console.log('code',code)
                if(code === value){
                    console.log('treetreetree',tree)
                    selectTreeType.push(tree)
                }
            })
            console.log('selectTreeType',selectTreeType)
            this.setState({
                selectTreeType,
                treeTypeSelect:value,
                treeSelect:'全部'
            },()=>{
                this.search()
            })
        }

    }
    //选择树种
    ontreetypechange(value){
       this.setState({
            treeSelect:value
       })
    }

    datepick(value){
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):''})
    }
}





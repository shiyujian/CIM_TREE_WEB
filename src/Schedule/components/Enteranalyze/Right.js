import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API, FORESTTYPE,TREETYPENO} from '../../../_platform/api';
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
            treetyoption.push(<Option key={tree.name} value={tree.id}>{tree.name}</Option>)
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
        data[0] = new Array()
        data[1] = new Array()
        data[2] = new Array()
        data[3] = new Array()
        data[4] = new Array()
        if(leftkeycode.indexOf('P010') >-1){
            data[5] = new Array()
        }
        
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

        let legend = ['总数','一标段','二标段','三标段','四标段','五标段'];
        let series= [
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
            treetypeoption.push(<Option key={rst.ID} title={rst.TreeTypeName} value={rst.ID}>{rst.TreeTypeName}</Option>)
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





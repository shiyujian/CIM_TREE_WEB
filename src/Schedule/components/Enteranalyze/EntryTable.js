import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API, FORESTTYPE} from '../../../_platform/api';
import moment from 'moment';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class EntryTable extends Component {

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
            //累计进场总数
            amount: '',
            //今日进场总数
            today: '',
            nurserys: '',
            section: '',
            etime: moment().format('YYYY/MM/DD'),
            stime1: moment().format('2017/01/01'),
            etime1: moment().format('YYYY/MM/DD'),
            etime3: moment().unix(),
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            loading5: false,
            leftkeycode: '',
            treety: '',
            treetypename:'',
            treetypetitlename: '全部',
            treetype: '',
            isOpen: [false,false,false],
            biaoduan:[],
            shuzhi:[],
            nowmessage:[],
            nowmessagelist:[],
            treetypelist:[]
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const{
            etime,
            stime1,
            etime1,
            selectTreeType,
            treeSelect
        }=this.state
        const {
            leftkeycode
        }=this.props
        if( stime1 != prevState.stime1 || etime1 != prevState.etime1 || selectTreeType != prevState.selectTreeType || 
            treeSelect != prevState.treeSelect 
        ){
            this.search()
        }
        if( etime != prevState.etime){
            this.query()
        }
        if(leftkeycode != prevProps.leftkeycode){
            this.search()
            this.query()
        }
    }
    async query(no){
        const{
            leftkeycode,
            actions:{
                gettreetype
            }
        }=this.props
        const{
            etime 
        }=this.state
        if (!leftkeycode)
        return 
        let postdata = {}
        

        postdata.no = leftkeycode
        postdata.etime = etime
        let rst = await gettreetype({},postdata)
        console.log('aaaaaaaaaaaaaarst',rst)
        let units = ['一标段','二标段','三标段','四标段','五标段']
        let data = [];
        let amount = 0;
        let today = 0;
        let date = moment().format('YYYY/MM/DD');
        console.log('date',date)
        console.log('date',date === etime)
        if(rst && rst instanceof Array){
            data[0] = data[1] = data[2] = data[3] = data[4] = data[5]  = 0
            if(leftkeycode.indexOf('P009')>-1){
                rst.map(item=>{
                    if(item && item.Section){
                        if(no === 1){
                            amount = amount + item.Num
                            if(date === item.Time){
                                today = today + item.Num
                            }
                        }
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
                        if(no === 1){
                            amount = amount + item.Num
                            if(date === item.Time){
                                today = today + item.Num
                            }
                        }
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
        console.log('today',today)
        console.log('amount',amount)
        console.log('data',data)
        this.setState({
            amount,
            today,
            loading4:false,
            loading3:false
        })
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

    }
    async search(no){
        const{
            leftkeycode,
            actions:{
                gettreetype
            }
        }=this.props
        const{
            stime1,
            etime1,
            selectTreeType,
            treeTypeSelect,
            treeSelect,
            treetypeAll
        }=this.state
        let postdata = {}
        
        postdata.no = leftkeycode
        let treetype = []
        if(treeSelect === '全部'){
            selectTreeType.map(rst=>{
                treetype.push(rst.ID)
            })
        }else{
            treetype.push(treeSelect)
            postdata.treetype = treetype
        }
        
        postdata.stime = stime1
        postdata.etime = etime1
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
            debugger
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
        gettreeevery().then(rst=>{
            console.log('gettreeeveryrst',rst)
            if(rst && rst instanceof Array){
                this.setState({
                    treetypeAll:rst,
                    selectTreeType:rst
                })
            }
        });

        //类型
        let treetyoption = [
            <Option key={Math.random()} value={'全部'}>全部</Option>,
            <Option key={Math.random()*2} value={'常绿乔木'}>常绿乔木</Option>,
            <Option key={Math.random()*6} value={'落叶乔木'}>落叶乔木</Option>,
            <Option key={Math.random()*3} value={'亚乔木'}>亚乔木</Option>,
            <Option key={Math.random()*4} value={'灌木'}>灌木</Option>,
            <Option key={Math.random()*5} value={'草本'}>草本</Option>,
        ];
        this.setState({treetyoption})

        this.query(1)
        this.search()
        

        const {actions: {getfactory,nowmessage}} = this.props;
        //实时种植信息
        nowmessage().then(rst=>{
            console.log(rst.content,"xionsui");
            this.setState({
                nowmessagelist:rst.content,
            })
        })
        this.setState({
            loading5:true,
            loading4:true,
            loading3:true
        })
       
        getfactory().then(rst=>{
            this.setState({loading5:false})
            var factorynum = rst.length;
            this.setState({
                nurserys:factorynum,
            }) 
        })
        
    }



    render() {
        let {amount} = this.state;
        
        return (
            <div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={5}>
                        <Spin spinning={this.state.loading3}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计进场总数' title1='Total number of nursery stock'>
                                <div>{amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading4}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日进场总数' title1='Total number of nursery stock today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(2)} title='供苗商总数' title1='Total number of nursery'>
                                <div>{this.state.nurserys}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                     <div className="nowmessage" style={{border:"1px solid #666"}}>
                    <div>实时种植信息</div>
                    <div>
                    {this.state.nowmessagelist.map((item,index)=>
                            <div key={item.id}>
                              <span>{item.CreateTime}{item.Factory}{item.Inputer}录入{item.TreeTypeObj.TreeTypeName}</span>
                            </div>
                        )}
                    </div>
                    </div>
                    </Col>
                </Row>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={12} >
                        <Spin spinning={this.state.loading1}>
                            <Cards search={this.searchRender(1)} title='苗木进场总数'>
                                <div id = 'king' style = {{width:'100%',height:'400px'}}>
                                </div>
                            </Cards>
                        </Spin>
                    </Col>
                    <Col span={12} >
                        <Spin spinning={this.state.loading2}>
                            <Cards search={this.searchRender(2)} title={`${this.state.treetypetitlename}进场强度分析`}>
                                <div id = 'stock' style = {{width:'100%',height:'400px'}}>
                                </div>
                            </Cards>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );
    }

    searchSum(index) {
        return(
            <div>
                <div style={{cursor:'pointer'}} onClick = {this.handleIsOpen.bind(this,index)}><img style={{height:'36px'}} src={DateImg}/></div>
            </div>
        )
    }

    searchRender(index) {
        
        if(index === 1) {
            return <div>
                <span>截止时间：</span>
                <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime1, 'YYYY/MM/DD')} 
                     format={'YYYY/MM/DD'}
                     onChange={this.datepick.bind(this,index)}
                     onOk={this.datepickok.bind(this,index)}
                    >
                    </DatePicker>
            </div>
        } else {
            const {treetypename,treety,treetyoption = [],treetypeAll = []} = this.state;
            let treetypeoption = this.setTreeType()
            return (
                <Row>
                    <Col xl={4} lg={10}>
                        <span>类型：</span>
                        <Select allowClear className="forestcalcw2 mxw100" defaultValue={'全部'} onChange={this.ontypechange.bind(this)}>
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
                            allowClear showSearch 
                            className="forestcalcw2 mxw100" >
                            {treetypeoption}
                        </Select>
                    </Col>
                    <Col xl={15} lg={24}>
                        <span>起苗时间：</span>
                        <RangePicker 
                         style={{verticalAlign:"middle"}} 
                         defaultValue={[moment(this.state.stime1, 'YYYY/MM/DD'),moment(this.state.etime1, 'YYYY/MM/DD')]} 
                         showTime
                         format={'YYYY/MM/DD'}
                         onChange={this.datepick.bind(this,index)}
                         onOk={this.datepickok.bind(this,index)}
                        >
                        </RangePicker>
                    </Col>
                </Row>
            )
        }
    }

    setTreeType(){
        const{
            selectTreeType = []
        }=this.state
        let treetypeoption = [];
        treetypeoption.push(<Option key={-1} value={'全部'}>全部</Option>)
        selectTreeType.map(rst =>{
            treetypeoption.push(<Option key={rst.ID} value={rst.ID}>{rst.TreeTypeName}</Option>)
        })
        return treetypeoption
        
    }

    //选择树种类型
    ontypechange(value) {
        const {
            treetypeAll = [],
        } = this.state
        if(value === '全部'){
            this.setState({
                selectTreeType:treetypeAll,
                treeTypeSelect:value,
                treeSelect:'全部'
            })
        }else{
            let selectTreeType = [];
            FORESTTYPE.map((rst =>{
                if (rst.name === value){
                    let children = rst.children
                    children.map(item =>{
                        selectTreeType.push( treetypeAll.find((tree)=> tree.TreeTypeName === item.name))
                    })
                }
            }))
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
    //点击图片出现日期选择
    handleIsOpen(index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen : this.state.isOpen
        })
    }

    datepick(index,value){
        if(index == 1) {
            
            this.setState({etime:value?moment(value).format('YYYY/MM/DD'):''});
        }
        if(index == 2){
            this.setState({stime1:value[0]?moment(value[0]).format('YYYY/MM/DD'):''})
            this.setState({etime1:value[1]?moment(value[1]).format('YYYY/MM/DD'):''})
        }
    }
    //总数时间点击
    datepick1(index, value) {
        
        let param = {
            etime:value?moment(value).unix():''
        }
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen:this.state.isOpen
        })
    }
    datepickok(index) {
    
    }
}





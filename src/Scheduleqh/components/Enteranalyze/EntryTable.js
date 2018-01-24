import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API} from '../../../_platform/api';
import moment from 'moment';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class EntryTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            treetypeoption: [],
            treetyoption: [],
            amount: '',
            today: '',
            nurserys: '',
            section: '',
            stime1: moment().format('YYYY/MM/DD'),
            etime1: moment().format('YYYY/MM/DD'),
            stime2: moment().format('2017/11/10'),
            etime2: moment().format('2017/11/30'),
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
        }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
        amount:nextProps.account,
        biaoduan:nextProps.biaoduan,
        shuzhi:nextProps.shuzhi,
      })


        // if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode,
            }, () => {
                this.datepickok(1);
                this.datepickok(2);
                // this.sum(0);
                // this.sum(1);
                // this.sum(2);
            })
        // }   
    }

    componentDidMount(){

        const {actions: {getNurserysCountFast,getfactory,gettreeevery}} = this.props;
        gettreeevery().then(rst=>{
            
        })
        getfactory().then(rst=>{
            var factorynum = rst.length;
            this.setState({
                nurserys:factorynum,
            }) 
        })
        const param = {stime:this.state.stime1,etime:this.state.etime1};
     
         // getNurserysCountFast({},{stime:"2017/11/26",etime:"2017/11/27"})
         getNurserysCountFast({},param)
         .then(rst=>{
            let todaynum = 0;
            
            for(let key=0;key<=rst.length-1; key++){
                
                todaynum = todaynum + rst[key].Num;
                
            }
            
            this.setState({
                 today:todaynum,
            })
         })
        
        var myChart1 = echarts.init(document.getElementById('king'));
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
            series: []
        };
        myChart1.setOption(option1);

        var myChart2 = echarts.init(document.getElementById('stock'));
        let option2 = {
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
                    }
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
            series: []
        };
        myChart2.setOption(option2);
        
    }

    render() {
        let {amount} = this.state;
        
        return (
            <div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={6}>
                        <Spin spinning={this.state.loading3}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计进场总数' title1='Total number of nursery stock'>
                                <div>{amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                        <Spin spinning={this.state.loading4}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日进场总数' title1='Total number of nursery stock today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(2)} title='供苗商总数' title1='Total number of nursery'>
                                <div>{this.state.nurserys}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                </Row>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={12} >
                        <Spin spinning={this.state.loading1}>
                            <Cards search={this.search(1)} title='苗木进场总数'>
                                <div id = 'king' style = {{width:'100%',height:'400px'}}>
                                </div>
                            </Cards>
                        </Spin>
                    </Col>
                    <Col span={12} >
                        <Spin spinning={this.state.loading2}>
                            <Cards search={this.search(2)} title={`${this.state.treetypetitlename}进场强度分析`}>
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
                <DatePicker
                    style={{textAlign:"center",visibility:"hidden"}}
                    defaultValue={moment(new Date(), 'YYYY/MM/DD')}
                    format={'YYYY/MM/DD'}
                    onChange={this.datepick1.bind(this,index)}
                    open={this.state.isOpen[index]}
                >
                </DatePicker>
            </div>
        )
    }

    search(index) {
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
            const {treetyoption = [],treetypeoption = []} = this.props;
            const {treetypename,treety} = this.state;
            
            return (
                <Row>
                    <Col xl={4} lg={10}>
                        <span>类型：</span>
                        <Select allowClear className="forestcalcw2 mxw100" defaultValue='全部' value={treety} onChange={this.ontypechange.bind(this)}>
                            {treetyoption}
                        </Select>
                    </Col>
                    <Col xl={5} lg={10}>
                        <span>树种：</span>
                        <Select style={{width:"100px"}} allowClear showSearch className="forestcalcw2 mxw100" defaultValue='全部' onSelect={() =>this.select()} onChange={this.ontreetypechange.bind(this)}>
                            {treetypeoption}
                        </Select>
                    </Col>
                    <Col xl={15} lg={24}>
                        <span>起苗时间：</span>
                        <RangePicker 
                         style={{verticalAlign:"middle"}} 
                         defaultValue={[moment(this.state.stime2, 'YYYY/MM/DD'),moment(this.state.etime2, 'YYYY/MM/DD')]} 
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
    close(){
        
    }

    
    select(e) {
        console.log(e)
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
            // this.setState({stime1:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            
            this.setState({etime1:value?moment(value).format('YYYY/MM/DD'):''});
        }
        if(index == 2){
            this.setState({stime2:value[0]?moment(value[0]).format('YYYY/MM/DD'):''})
            this.setState({etime2:value[1]?moment(value[1]).format('YYYY/MM/DD'):''})
        }
    }
    //总数时间点击
    datepick1(index, value) {
        
        let param = {
            etime:value?moment(value).unix():''
        }
        // this.sum(index, param);
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen:this.state.isOpen
        })
    }
    datepickok(index) {
       
        if(index == 1) {
            const {stime1,etime1} = this.state;
          
            let param = {
                // stime:stime1?moment(stime1).add(8, 'h').unix():'',
                // etime:etime1?moment(etime1).add(8, 'h').unix():''
                etime:etime1
            }
            this.qury(index,param);
        }
        if(index == 2) {
            const {stime2,etime2,treetype,treety} = this.state;
            let param = {
                // stime:stime2?moment(stime2).add(8, 'h').unix():'',
                // etime:etime2?moment(etime2).add(8, 'h').unix():'',
                // treety,
                treetype:treetype,
                stime:stime2,
                etime:etime2,
            }
            this.qury(index,param);
        }
    }

    ontypechange(value) {
        
        const {typeselect,leftkeycode = ''} = this.props;
        typeselect(value || '',leftkeycode)
        this.setState({treety:value || ''}, () => {
            this.ontreetypechange('')
        })
    }

    ontreetypechange(value,children) {
       
        const {treetypelist} = this.props;
        let treetype = treetypelist.find(rst => rst.ID == value)
        this.setState({treetype:treetype?treetype.ID:'',treetypename:treetype.TreeTypeNo || ''},() => {
            this.datepickok(2)
        })
        // this.setState({
        //     treetype:value,
        // })
        // this.datepickok(2);
        

    }

    // sum(index, param) {
    //     const {actions: {getNurserysProgress}} = this.props;
    //     if(index === 0) {
    //         this.setState({loading3: true})
    //         getNurserysProgress({}, param)
    //         .then(rst => {
    //             this.setState({loading3: false})
    //             if(!rst)
    //                 return
    //             // this.setState({
    //             //     amount: rst.amount
    //             // })
    //         })
    //     }else if(index === 1) {
    //         this.setState({loading4: true})
    //         getNurserysProgress({}, param)
    //         .then(rst => {
    //             this.setState({loading4: false})
    //             if(!rst)
    //                 return
    //             this.setState({
    //                 today: rst.today
    //             })
    //         })
    //     }else if(index === 2) {
    //         this.setState({loading5: true})
    //         getNurserysProgress({}, param)
    //         .then(rst => {
    //             this.setState({loading5: false})
    //             if(!rst)
    //                 return
    //             this.setState({
    //                 nurserys: rst.nurserys
    //             })
    //         })
    //     }
    // }

    qury(index,param) {
        const {actions: {getNurserysCount, getNurserysCountFast}} = this.props;
        if(index === 1) {
            this.setState({loading1:true})
            getNurserysCountFast({},{etime:param.etime})
            .then(rst => {
                
                 let res = groupBy(rst, function(n){
                return n.Section
            });
            let biaoduan = Object.keys(res);
            let trees = [];
            let wsx = [];
            trees = Object.entries(res);
            for(var j = 0 ; j<=trees.length-1; j++){
            var abc = trees[j][1];
            let qaz = 0;
            for(var k = 0 ; k<=abc.length-1; k++){
            qaz = qaz + abc[k].Num;
            }
            wsx.push(qaz);
            }
            let Num1 = 0;
            for(var i = 0; i<=rst.length-1; i++){
            Num1 = Num1 + rst[i].Num;
            }
                this.setState({loading1:false})
                if(!rst)
                    return
                try {
                    let myChart1 = echarts.getInstanceByDom(document.getElementById('king'));
                    let options1 = {
                        legend: {
                            data:['进场总数']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: biaoduan,
                            }
                        ],
                        series: [
                            {
                                name: '进场总数',
                                type: 'bar',
                                data: wsx,
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
                    }
                    myChart1.setOption(options1);
                } catch(e) {
                    console.log(e)
                }
               
            })
        } else if(index === 2) {
            this.setState({loading2:true})
            console.log(param,"haha");
           getNurserysCountFast({},param)
           // getNurserysCountFast()
            .then(rst => {
                
               let res = groupBy(rst, function(n){
                return n.Time
            });
               let biaoduan1 = [];
               let biaoduan2 = [];
               let biaoduan3 = [];
               let biaoduan4 = [];
               let biaoduan5 = [];
               let bytime = Object.values(res);
               
               for(var x = 0 ; x <= bytime.length-1; x++){
                   let number1 = 0;
                   let number2 = 0;
                   let number3 = 0;
                   let number4 = 0;
                   let number5 = 0;
                   for(var y = 0; y <= bytime[x].length-1;y++){
                       if(bytime[x][y].Section === "1标段"){
                             number1 = bytime[x][y].Num
                             biaoduan1[x]= number1;
                       }else if(number1!=0){
                             biaoduan1[x]=number1;
                       }else{
                             biaoduan1[x]=0;
                       }
                        if(bytime[x][y].Section === "2标段"){
                             number2 = bytime[x][y].Num
                             biaoduan2[x]= number2;
                       }else if(number2!=0){
                             biaoduan2[x]=number2;
                       }else{
                             biaoduan2[x]=0;
                       }
                        if(bytime[x][y].Section === "3标段"){
                             number3 = bytime[x][y].Num
                             biaoduan3[x]= number3;
                       }else if(number3!=0){
                             biaoduan3[x]=number3;
                       }else{
                             biaoduan3[x]=0;
                       }
                        if(bytime[x][y].Section === "4标段"){
                             number4 = bytime[x][y].Num
                             biaoduan4[x]= number4;
                       }else if(number4!=0){
                             biaoduan4[x]=number4;
                       }else{
                             biaoduan4[x]=0;
                       }
                        if(bytime[x][y].Section === "5标段"){
                             number5 = bytime[x][y].Num
                             biaoduan5[x]= number5;
                       }else if(number5!=0){
                             biaoduan5[x]=number5;
                       }else{
                             biaoduan5[x]=0;
                       }
                   }
               } 
              
               let lastshuzhu =[];
               lastshuzhu = [biaoduan1,biaoduan2,biaoduan3,biaoduan4,biaoduan5];
               
            let time = Object.keys(res);
            let value = Object.values(res);
            let biaoduan = Object.keys(res);
            let trees = [];
            let wsx = [];
            trees = Object.entries(res);
            for(var j = 0 ; j<=trees.length-1; j++){
            var abc = trees[j][1];
            let qaz = 0;
            for(var k = 0 ; k<=abc.length-1; k++){
            qaz = qaz + abc[k].Num;
            }
            wsx.push(qaz);
            }
            
       
           
                this.setState({loading2:false})
                if(!rst)
                    return
                this.setState({treetypetitlename:this.state.treetypename || '全部'})
                try {
                       let myChart2 = echarts.getInstanceByDom(document.getElementById('stock'));
                    let options2 = {

                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['总数','1标段','2标段','3标段','4标段','5标段']
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                // toolbox: {
                                //     feature: {
                                //         saveAsImage: {}
                                //     }
                                // },
                                xAxis: {
                                    type: 'category',
                                    // boundaryGap: false,
                                    data: time,
                                    axisPointer: {
                                          type: 'shadow'
                                        }
                                },
                                yAxis: [
                                    // type: 'value'
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
                                        name:'总数',
                                        type:'bar',
                                        data:wsx,
                                        barWidth:'25%',
                                        // itemStyle:{
                                        //     normal:{
                                        //         color:'#02e5cd',
                                        //         barBorderRadius:[50,50,50,50]
                                        //     }
                                        // }
                                    },
                                    {
                                        name:'1标段',
                                        type:'line',
                                        yAxisIndex: 1,
                                        data:lastshuzhu[0]
                                    },
                                    {
                                        name:'2标段',
                                        type:'line',
                                        yAxisIndex: 1,
                                        data:lastshuzhu[1]
                                    },
                                    {
                                        name:'3标段',
                                        type:'line',
                                        yAxisIndex: 1,
                                        data:lastshuzhu[2]
                                    },
                                    {
                                        name:'4标段',
                                        type:'line',
                                        yAxisIndex: 1,
                                        data:lastshuzhu[3]
                                    },
                                    {
                                        name:'5标段',
                                        type:'line',
                                        yAxisIndex: 1,
                                        data:lastshuzhu[4]
                                    },
                                ]
                            };

                    myChart2.setOption(options2);

                    // let myChart2 = echarts.getInstanceByDom(document.getElementById('stock'));
                    // let totledata = [],series = [],legend = [`${this.state.treetypetitlename}进场总数`];
                    // for(let key in lastshuzhu) {
                    //     if(key !== '日期') {
                    //         if(totledata.length == 0 )
                    //              totledata = lastshuzhu[key]
                    //         else
                    //             totledata = arraynumadd(lastshuzhue[key],totledata);
                    //         series.push({
                    //             name: key,
                    //             type: 'line',
                    //             yAxisIndex: 1,
                    //             data: lastshuzhu[key]
                    //         });
                    //         legend.push(key)
                    //     }
                    // }
                    // series.unshift({
                    //     name:`${this.state.treetypetitlename}进场总数`,
                    //     type:'bar',
                    //     data:wsx
                    // });
                    // let options2 = {
                    //     legend: {
                    //         data:legend
                    //     },
                    //     xAxis : [
                    //         {
                    //             data: time['日期'],
                    //         }
                    //     ],
                    //     series: series
                    // };
                    // myChart2.setOption(options2);
                } catch(e) {
                    console.log(e)
                }
            })
        }
    }
}

//数组数值相加
function arraynumadd(arr1, arr2) {
    if(arr1 instanceof Array && arr2 instanceof Array) {
        let arr = arr1.map((rst,index) => {
            return arr1[index] + arr2[index]
        })
        return arr
    }
}

//总数
function addNum(arr){
    let total = 0;
    arr.map( item =>{
        total += item;
    })
    return total;
}

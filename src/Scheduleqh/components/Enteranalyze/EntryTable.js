import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API} from '../../../_platform/api';
import moment from 'moment';

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
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2017-11-24 23:59:59'),
            stime2: moment().format('2017-11-17 00:00:00'),
            etime2: moment().format('2017-11-24 23:59:59'),
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
        amount:this.props.account,
        biaoduan:this.props.biaoduan,
        shuzhi:this.props.shuzhi,
      })








        if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode,
            }, () => {
                this.datepickok(1);
                this.datepickok(2);
                this.sum(0);
                this.sum(1);
                this.sum(2);
            })
        }   
    }

    componentDidMount(){
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
        return (
            <div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={6}>
                        <Spin spinning={this.state.loading3}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计进场总数' title1='Total number of nursery stock'>
                                <div>{this.state.amount}</div>
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
                <RangePicker 
                 style={{verticalAlign:"middle"}} 
                 defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
                 showTime={{ format: 'HH:mm:ss' }}
                 format={'YYYY/MM/DD HH:mm:ss'}
                 onChange={this.datepick.bind(this,index)}
                 onOk={this.datepickok.bind(this,index)}
                >
                </RangePicker>
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
                        <Select allowClear showSearch className="forestcalcw2 mxw100" defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
                            {treetypeoption}
                        </Select>
                    </Col>
                    <Col xl={15} lg={24}>
                        <span>起苗时间：</span>
                        <RangePicker 
                         style={{verticalAlign:"middle"}} 
                         defaultValue={[moment(this.state.stime2, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime2, 'YYYY-MM-DD HH:mm:ss')]} 
                         showTime={{ format: 'HH:mm:ss' }}
                         format={'YYYY/MM/DD HH:mm:ss'}
                         onChange={this.datepick.bind(this,index)}
                         onOk={this.datepickok.bind(this,index)}
                        >
                        </RangePicker>
                    </Col>
                </Row>
            )
        }
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
            this.setState({stime1:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime1:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 2){
            this.setState({stime2:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime2:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
    }
    //总数时间点击
    datepick1(index, value) {
        console.log(value)
        let param = {
            etime:value?moment(value).unix():''
        }
        this.sum(index, param);
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen:this.state.isOpen
        })
    }
    datepickok(index) {
        if(index == 1) {
            const {stime1,etime1} = this.state;
            let param = {
                stime:stime1?moment(stime1).add(8, 'h').unix():'',
                etime:etime1?moment(etime1).add(8, 'h').unix():''
            }
            this.qury(index,param);
        }
        if(index == 2) {
            const {stime2,etime2,treetype,treety} = this.state;
            let param = {
                stime:stime2?moment(stime2).add(8, 'h').unix():'',
                etime:etime2?moment(etime2).add(8, 'h').unix():'',
                treety,
                treetype
            }
            this.qury(index,param);
        }
    }

    ontypechange(value) {
        console.log(value,"jjlkjl");
        const {typeselect,leftkeycode = ''} = this.props;
        typeselect(value || '',leftkeycode)
        this.setState({treety:value || ''}, () => {
            this.ontreetypechange('')
        })
    }

    ontreetypechange(value) {
        const {treetypelist} = this.props;
        let treetype = treetypelist.find(rst => rst.name == value)
        this.setState({treetype:treetype?treetype.oid:'',treetypename:value || ''},() => {
            this.datepickok(2)
        })
    }

    sum(index, param) {
        const {actions: {getNurserysProgress}} = this.props;
        if(index === 0) {
            this.setState({loading3: true})
            getNurserysProgress({}, param)
            .then(rst => {
                this.setState({loading3: false})
                if(!rst)
                    return
                this.setState({
                    amount: rst.amount
                })
            })
        }else if(index === 1) {
            this.setState({loading4: true})
            getNurserysProgress({}, param)
            .then(rst => {
                this.setState({loading4: false})
                if(!rst)
                    return
                this.setState({
                    today: rst.today
                })
            })
        }else if(index === 2) {
            this.setState({loading5: true})
            getNurserysProgress({}, param)
            .then(rst => {
                this.setState({loading5: false})
                if(!rst)
                    return
                this.setState({
                    nurserys: rst.nurserys
                })
            })
        }
    }

    qury(index,param) {
        const {actions: {getNurserysCount, getNurserysCountFast}} = this.props;
        if(index === 1) {
            this.setState({loading1:true})
            getNurserysCountFast({},param)
            .then(rst => {
                this.setState({loading1:false})
                console.log('rst',rst)
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
                                data: this.state.biaoduan,
                            }
                        ],
                        series: [
                            {
                                name: '进场总数',
                                type: 'bar',
                                data: this.state.shuzhi,
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
            console.log('222',param);
            getNurserysCount({},param)
            .then(rst => {
                this.setState({loading2:false})
                if(!rst)
                    return
                this.setState({treetypetitlename:this.state.treetypename || '全部'})
                try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('stock'));
                    let totledata = [],series = [],legend = [`${this.state.treetypetitlename}进场总数`];
                    for(let key in rst) {
                        if(key !== '日期') {
                            if(totledata.length == 0 )
                                 totledata = rst[key]
                            else
                                totledata = arraynumadd(rst[key],totledata);
                            series.push({
                                name: key,
                                type: 'line',
                                yAxisIndex: 1,
                                data: rst[key]
                            });
                            legend.push(key)
                        }
                    }
                    series.unshift({
                        name:`${this.state.treetypetitlename}进场总数`,
                        type:'bar',
                        data:totledata
                    });
                    let options2 = {
                        legend: {
                            data:legend
                        },
                        xAxis : [
                            {
                                data: rst['日期'],
                            }
                        ],
                        series: series
                    };
                    myChart2.setOption(options2);
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

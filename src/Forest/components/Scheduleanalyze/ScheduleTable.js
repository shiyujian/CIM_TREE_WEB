import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Spin} from 'antd';
import moment from 'moment';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Cards, SumTotal, DateImg} from '../../components';

var echarts = require('echarts');
const {RangePicker} = DatePicker;
const Option = Select.Option;

export default class ScheduleTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            section: '',
            smallclass: '',
            leftkeycode: '',
            amount: '',
            today: '',
            plan_amount: '',
            pers: '',
            score: '',
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2017-11-24 23:59:59'),
            etime2: moment().format('2017-11-24 23:59:59'),
            etime3: moment().format('2017-11-24 23:59:59'),
            etime4: moment().format('2017-11-24 23:59:59'),
            etime5: moment().format('YYYY-MM-DD HH:mm:ss'),
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            loading5: false,
            loading6: false,
            loading7: false,
            isShow: true,
            isOpen: [false,false,false]
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.section != this.state.section && nextProps.leftkeycode != '') {
            this.setState({
                section: nextProps.section,
            }, () => {
                this.datepickok(3);
            })
        }
        if(nextProps.smallclass != this.state.smallclass && nextProps.leftkeycode != ''){
            this.setState({
                smallclass:nextProps.smallclass
            }, () => {
                this.datepickok(4);
            })
        } 
        if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode:nextProps.leftkeycode
            }, () => {
                this.datepickok(1);
                this.datepickok(2);
                this.sum(0);
                this.sum(1);
                this.sum(2);
            })
        }
    }
	componentDidMount() {
		var myChart1 = echarts.init(document.getElementById('plant'));
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

        var myChart2 = echarts.init(document.getElementById('section1'));
        myChart2.on('click', function (params) {
            that.onsectionchange(params.name)
        });
        let option2 = {
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
                    type : 'value'
                }
            ],
            series : []
        };
        myChart2.setOption(option2);

        var myChart3 = echarts.init(document.getElementById('primaryClass'));
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
                    type : 'value'
                }
            ],
            series : []
        };
        myChart3.setOption(option3);

        var myChart4 = echarts.init(document.getElementById('overall'));
        const sectionStatus = 0;
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
	}

	render() {
		return (
			<div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={6}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计种植总数' title1='Total number of planted trees'>
                                <div>{this.state.amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                        <Spin spinning={this.state.loading6}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日种植总数' title1='Total number of planted trees today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                        <Spin spinning={this.state.loading7}>
                            <SumTotal search={this.searchSum(2)} title='种植完工率' title1='Plant completion rate'>
                                <div onClick ={this.handleclick.bind(this)} style={{cursor:'pointer'}}>
                                    {
                                        this.state.isShow ? <div className="per">{this.state.pers}</div>
                                        :
                                        <div className='score' style={{fontSize: '20px'}}>{this.state.score}</div>
                                    }
                                </div>
                            </SumTotal>
                        </Spin>
                    </Col>
                </Row>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    
    				<Col span={10} >
                        <Spin spinning={this.state.loading1}>
    						<Cards search={this.search(1)} title='苗木种植强度分析'>
    							<div id = 'plant' style = {{width:'100%',height:'260px'}}>
    							</div>
    						</Cards>
                        </Spin>
    				</Col>
    				<Col span={7} >
                        <Spin spinning={this.state.loading2}>
    						<Cards search={this.search(2)} title='各标段种植强度分析'>
    							<div id = 'section1' style = {{width:'100%',height:'260px'}}>
    							</div>
    						</Cards>
                        </Spin>
    				</Col>
    				<Col span={7} >
                        <Spin spinning={this.state.loading3}>
    						<Cards search={this.search(3)} title={this.title()}>
    							<div id = 'primaryClass' style = {{width:'100%',height:'260px'}}>
    							</div>
    						</Cards>
                        </Spin>
    				</Col>
    			</Row>
                <Row gutter={10} style={{margin: '20px 5px 5px 5px'}}>
                    <Col>
                        <Spin spinning={this.state.loading4}>
            				<Cards style={{margin: '20px 5px 5px 5px'}} search={this.search(4)} title={this.title1()}>
            					<div id = 'overall' style = {{width:'100%',height:'300px'}}>
            					</div>
            				</Cards>
                        </Spin>
                    </Col>
                </Row>
			</div>
		);
	}
    //点击切换百分比和分数
    handleclick (){
        this.setState({
            isShow : !this.state.isShow
        })
    }
    //点击图片出现日期选择
    handleIsOpen(index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen : this.state.isOpen
        })
    }

    searchSum(index) {
        return(
            <div>
                <div style={{cursor:'pointer'}} onClick = {this.handleIsOpen.bind(this,index)}><img style={{height: '36px'}} src={DateImg}/></div>
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
                    <span>种植时间：</span>
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
                 return <div>
                    <span>截止时间：</span>
                    <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime2, 'YYYY-MM-DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this,index)}
                     onOk={this.datepickok.bind(this,index)}
                    >
                    </DatePicker>
                </div>
            }
    }
    title(){
        const {sectionoption} = this.props;
        const {section} = this.state;
        return <div>
                    <Select value={section} onSelect={this.onsectionchange.bind(this)} style={{width: '65px'}}>
                        {sectionoption}
                    </Select>
                    <span>各小班种植进度分析</span>
                </div>
    }

    title1(){
        const {sectionoption, smallclassoption} = this.props;
        const {section, smallclass} = this.state;
        return <div>
                    <Select value={section} onSelect={this.onsectionchange.bind(this)} style={{width: '65px'}}>
                        {sectionoption}
                    </Select>
                    <Select value={smallclass} onChange={this.smallclasschange.bind(this)} style={{width: '54px'}}>
                        {smallclassoption}
                    </Select>
                    <span>小班各细班种植进度分析</span>
                </div>
    }
    onsectionchange(value) {
        const {sectionselect} = this.props;
        sectionselect(value)
        this.setState({section:value},() => {
            this.datepickok(3)
        })
    }

    smallclasschange(value){
        this.setState({smallclass:value},() => {
            this.datepickok(4)
        })
    }
    datepick(index,value){
        if(index == 1) {
            this.setState({stime1:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime1:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 2){
            this.setState({etime2:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 3){
            this.setState({etime3:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 4){
            this.setState({etime4:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
    }

    datepick1(index, value) {
        let param = {
            etime:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''
        }
        this.sum(index, param);
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen:this.state.isOpen
        })
    }

    datepickok(index){
        if(index == 1 ) {
            const {stime1,etime1} = this.state;
            let param = {
                stime:stime1?moment(stime1).format('YYYY-MM-DD HH:mm:ss'):'',
                etime:etime1?moment(etime1).format('YYYY-MM-DD HH:mm:ss'):''
            }
            this.qury(index,param);
        }
        if(index == 2 ) {
            const {etime2} = this.state;
            let param = {
                etime:etime2?moment(etime2).add(8, 'h').format('YYYY-MM-DD HH:mm:ss'):''
            }
            this.qury(index,param);
        }
        if(index == 3 ) {
            const {etime3,section} = this.state;
            let param = {
                etime:etime3?moment(etime3).add(8, 'h').format('YYYY-MM-DD HH:mm:ss'):'',
                section
            }
            this.qury(index,param);
        }
        if(index == 4 ) {
            const {etime4,section,smallclass} = this.state;
            let param = {
                etime:etime4?moment(etime4).add(8, 'h').format('YYYY-MM-DD HH:mm:ss'):'',
                section,
                smallclass
            }
            this.qury(index,param);
        }
    }

    sum(index, param) {
        const {actions: {getTreesProgress}} = this.props;
        if(index === 0) {
            this.setState({loading5: true})
            getTreesProgress({}, param)
            .then(rst => {
                this.setState({loading5: false})
                if(!rst)
                    return
                this.setState({
                    amount: rst.amount
                })
            })
        }else if(index === 1) {
            this.setState({loading6: true})
            getTreesProgress({}, param)
            .then(rst => {
                this.setState({loading6: false})
                if(!rst)
                    return
                this.setState({
                    today: rst.today
                })
            })
        } else if(index === 2) {
            this.setState({loading7: true})
            getTreesProgress({}, param)
            .then(rst => {
                this.setState({loading7: false})
                if(!rst)
                    return
                let amount = rst.amount
                let plan_amount = rst.plan_amount
                this.setState({
                    pers: division(amount,plan_amount),
                    score: joint(amount,plan_amount)
                })
            })
        }
    }

    qury(index,param) {
        const {actions: {getCount,getCountSection,getCountSmall,getCountThin},leftkeycode,sectionoption} = this.props;
        param.no = leftkeycode;
        if(index === 1 ){
            this.setState({loading1:true})
            getCount({},param)
            .then(rst => {
                console.log('rst',rst)
                this.setState({loading1:false})
                if(!rst)
                    return
                try {
                    let myChart1 = echarts.getInstanceByDom(document.getElementById('plant'));
                    let totledata = [],series = [],legend = ['种植总数'],sectionList = [],timeData = [];
                    sectionoption.map((item, index) => {
                        sectionList.push(item.key)
                    })
                    console.log('sectionList',sectionList)
                    rst.map((res, index) => {
                        timeData.push(rst[index].Time)
                    })
                    timeData = [...new Set(timeData)]
                    console.log('timeData',timeData)
                    // let treeNum = 0;
                    for(let i = 0; i < timeData.length; i++) {
                        let sum = 0;
                        for(let j = 0; j < rst.length; j++) {
                            if(timeData[i] == rst[j].Time) {
                                sum += rst[j].Num;
                            }
                        }
                        // treeNum += sum;
                        totledata.push(sum);
                        console.log('totledata',totledata)
                    }
                    let sectionObj = {};
                    for(let o = 0; o < sectionList.length; o++) {
                        let sectionTimeData = rst.filter(n => {
                            return n.Section == sectionList[o];
                        });
                        sectionObj[sectionList[o]] = sectionTimeData;
                    }
                    console.log('sectionObj',sectionObj)
                    let totalDataObj = {};
                    for(let section in sectionObj){
                        let cTimeData = sectionObj[section];
                        let serieData = [];
                        for(let k = 0;k < timeData.length;k++){
                            let value = 0;
                            for(let l = 0;l < cTimeData.length;l++){
                                if(timeData[k] == cTimeData[l].Time){
                                    value = cTimeData[l].Num;
                                    if(totalDataObj[timeData[k]]){
                                        totalDataObj[timeData[k]] += value;
                                    }else{
                                        totalDataObj[timeData[k]] = value;
                                    }
                                    break;
                                }
                            }
                            serieData.push(value);
                        }
                        series.push({
                            name: section,
                            type: 'line',
                            yAxisIndex: 1,
                            data: serieData
                        });
                        console.log('serieData',serieData)
                    }
                    series.unshift({
                        name:'种植总数',
                        type:'bar',
                        data:totledata
                    });
                    let options1 = {
                        legend: {
                            data:legend
                        },
                        xAxis : [
                            {
                                data: timeData,
                            }
                        ],
                        series: series
                    };
                    myChart1.setOption(options1);
                } catch(e) {
                    console.log(e)
                }
            }) 
        } else if(index === 2) {
            this.setState({loading2:true})
            getCountSection({},param)
            .then(rst => {
                rst.sort(sorting)
                this.setState({loading2:false})
                if(!rst)
                    return
                try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('section1'));
                    let sections = [], complete = [], UnComplete = [];
                    rst.map(item => {
                        sections.push(item.Label)
                        complete.push(item.Complete)
                        UnComplete.push(item.UnComplete)
                    })
                    let options2 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: sections
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: UnComplete
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
                    myChart2.setOption(options2);
                } catch(e) {
                    console.log(e)
                }
            }) 
        } else if(index === 3) {
            this.setState({loading3:true})
            getCountSmall({},param)
            .then(rst => {
                this.setState({loading3:false})
                if(!rst)
                    return
                try {
                    let myChart3 = echarts.getInstanceByDom(document.getElementById('primaryClass'));
                    let small = [], complete = [], UnComplete = [];
                    rst.map(item => {
                        small.push(item.Label)
                        complete.push(item.Complete)
                        UnComplete.push(item.UnComplete)
                    })
                    let options3 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: small
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: UnComplete
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
                } catch(e) {
                    console.log(e)
                } 
            })
        } else {
            this.setState({loading4:true})
            getCountThin({},param)
            .then(rst => {
                this.setState({loading4:false})
                if(!rst)
                    return
                try {
                    let myChart4 = echarts.getInstanceByDom(document.getElementById('overall'));
                    let thin = [], complete = [], UnComplete = [];
                    rst.map(item => {
                        if(item.No.substring(8,11).indexOf(param.smallclass) !== -1) {
                            thin.push(item.Label)
                            complete.push(item.Complete)
                            UnComplete.push(item.UnComplete)
                        }
                    })
                    let options4 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: thin
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: UnComplete
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

//减法
function arraynumsub(arr1, arr2) {
    if(arr1 instanceof Array && arr2 instanceof Array) {
        let arr = arr1.map((rst,index) => {
            return arr1[index] - arr2[index]
        })
        return arr
    }
}
//总数
function addNum(arr){
    let total = 0;
    arr.map( item => {
        total += item;
    })
    return total;
}
//除
function division(arr1, arr2) {
    if(arr1 !== 0 && arr2 !== 0) {
        let per = 0;
        per = (Math.round(arr1 / arr2 * 10000) / 100.00 + '%');
        return per;
    }
}
//拼接
function joint(arr1, arr2) {
    let join = '';
    join = arr1 + '/' + arr2;
    return join;
}
//点击切换

function dd(path){
    var ele= document.querySelectorAll(path);
    for(let i=0;i<ele.length;i++){
        ele[i].index=i;
        ele[i].onclick=function(){
            if(this.index===0){
                this.style.display="none";
                ele[1].style.display="block";
            }else{
                this.style.display="none";
                ele[0].style.display="block";
            }
        }
    }
}

//按照某个元素排序
function sorting(val1, val2) {
    let ele1 = val1.Label;
    let ele2 = val2.Label;
    if(ele1 < ele2) {
        return -1;
    } else if(ele1 > ele2) {
        return 1;
    } else {
        return 0;
    }
}

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Spin} from 'antd';
import moment from 'moment';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Cards, SumTotal, DateImg} from '../../components';
import {groupBy} from 'lodash';
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
            stime: moment().format('YYYY-MM-DD HH:mm:ss'),
            etime: moment().format('YYYY-MM-DD HH:mm:ss'),
            stime1: moment().format('2017-11-10 00:00:00'),
            etime1: moment().format('2017-11-30 00:00:00'),
            etime2: moment().format('YYYY-MM-DD HH:mm:ss'),
            etime3: moment().format('YYYY-MM-DD HH:mm:ss'),
            etime4: moment().format('YYYY-MM-DD HH:mm:ss'),
            etime5: moment().unix(),
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            loading5: false,
            loading6: false,
            loading7: false,
            isShow: true,
            isOpen: [false,false,false],
            nowmessage:{CreateTime:"",Factory:"",nowmessage:"",nowmessage:"",TreeTypeObj:{TreeTypeNo:""}},
            nowmessagelist:[],
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
                smallclass:nextProps.smallclass,
            }, () => {
                this.datepickok(4);
            })
        } 
        if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode:this.state.leftkeycode,
            }, () => {
                this.datepickok(1);
                this.datepickok(2);
                
            })
        }
    }
	componentDidMount() {
        this.setState({loading5:true});
        this.setState({loading6:true});
        
        const {actions: {gettreetypeAll,nowmessage}} = this.props;
        nowmessage().then(rst=>{
            console.log(rst.content,"xionsui");
            this.setState({
                nowmessagelist:rst.content,
            })
            // console.log(rst.content[0].sxm,rst.content[0].no,rst.content[0].section,rst.content[0].land,rst.content[0].region,rst.content[0].smallclass,rst.content[0].thinclass)
        })
        // sxm:编码 或顺序码  可选
        // no:正式编码 可选
        // section：标段 可选
        // land：地块  可选
        // region：区域  可选
        // smallclass：小班  可选
        // thinclass：细班  可选
        // treetype：树类型  可选
        // status：状态 -1:未确认 0：监理通过 业主未抽查  1：监理不通过  2：监理通过业主抽查未通过  3：监理通过 业主抽查通过
        // stime：验收时间 开始时间
        // etime：验收时间 结束时间
        // page：页码，选填
        // size：每页数量，选填
        const param = {stime:this.state.stime,etime:this.state.etime};
        
        gettreetypeAll().then(rst=>{
            this.setState({loading5:false});
             let Num1 = 0;
            for(var i = 0; i<=rst.length-1; i++){
            Num1 = Num1 + rst[i].Num;
            }
            this.setState({
                 amount:Num1,
            })
        })
         
         gettreetypeAll({},param)
         .then(rst=>{
            this.setState({loading6:false});
            let todaynum = 0;
            
            for(let key=0;key<=rst.length-1; key++){
                
                todaynum = todaynum + rst[key].Num;
                
            }
            
            this.setState({
                 today:todaynum,
            })
         })

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
        let asd = this.state.nowmessage;
        console.log(asd);
        
        console.log(this.state.nowmessagelist,"xiaoxiao")
		return (
			<div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={5}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计种植总数' title1='Total number of planted trees'>
                                <div>{this.state.amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading6}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日种植总数' title1='Total number of planted trees today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
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
                    <Col span={6}>
                    <div className="nowmessage" style={{border:"1px solid #666"}}>
                    <div>实时种植信息</div>
                    <div>
                    {this.state.nowmessagelist.map((item,index)=>
                            <div key={item.id}>
                              <span>{item.CreateTime}{item.Factory}{item.Inputer}录入{item.TreeTypeObj.TreeTypeNo}</span>
                            </div>
                        )}
                    </div>
                    </div>
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
                {/*<DatePicker
                    style={{textAlign:"center",visibility:"hidden"}}
                    defaultValue={moment(new Date(), 'YYYY/MM/DD')}
                    format={'YYYY/MM/DD'}
                    onChange={this.datepick1.bind(this,index)}
                    open={this.state.isOpen[index]}
                >
                </DatePicker>*/}
                
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
                    <Select value={section}  onSelect={this.onsectionchange.bind(this)} style={{width: '65px'}}>
                        {sectionoption}
                    </Select>
                    <Select value={smallclass}  onChange={this.smallclasschange.bind(this)} style={{width: '100px'}}>
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
            etime:value?moment(value).unix():''
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
                stime:this.state.stime1,
                etime:this.state.etime1,
            }
            this.qury(index,param);
        }
        if(index == 2 ) {
            const {etime2} = this.state;
            let param = {
                etime:this.state.etime2,
            }
            this.qury(index,param);
        }
        if(index == 3 ) {
            const {etime3,section} = this.state;
            let param = {
                etime:this.state.etime3,
                section:section,
            }
          
            this.qury(index,param);
        }
        if(index == 4 ) {
            const {etime4,section,smallclass} = this.state;
            let param = {
                etime:this.state.etime4,
                section,
            }
            this.qury(index,param);
        }
    }

   

    qury(index,param) {
        
        const {actions: {gettreetypeAll,gettreetypeSection,gettreetypeSmallClass,gettreetypeThinClass},leftkeycode,sectionoption} = this.props;
        param.no = leftkeycode;
        if(index === 1 ){
            this.setState({loading1:true})
            gettreetypeAll({},param)
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
                    for(let i = 0; i < timeData.length; i++) {
                        let sum = 0;
                        for(let j = 0; j < rst.length; j++) {
                            if(timeData[i] == rst[j].Time) {
                                sum += rst[j].Num;
                            }
                        }
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
            this.setState({loading7:true})
            // getCountSection({},param)
            gettreetypeSection({},param)
            .then(rst => {
               
                let biaoduan = [];
                let yeszhongshu = [];
                let notzhongshu = [];
                let allyeszhongshu = 0;
                let allzhongshu = 0;
                rst.sort(sorting);
                 console.log(rst,"xixixi");
                for(let i = 0; i<=rst.length-1 ; i++){
                    allyeszhongshu = allyeszhongshu + rst[i].Complete;
                    allzhongshu = allzhongshu + rst[i].Num;
                    biaoduan.push(rst[i].Label);
                    yeszhongshu.push(rst[i].Complete);
                    notzhongshu.push(rst[i].Num-rst[i].Complete);
                }
                this.setState({
                    loading7:false,
                     pers: division(allyeszhongshu,allzhongshu),
                     score: joint(allyeszhongshu,allzhongshu),
                     })
                if(!rst)
                    return
                try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('section1'));
                    let options2 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: biaoduan
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: notzhongshu
                            },
                            {
                                name: '已种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: yeszhongshu
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
            gettreetypeSmallClass({},param)
            .then(rst => {
                
                 let biaoduan1 = [];
                let yeszhongshu1 = [];
                let notzhongshu1 = [];
                for(let i = 0; i<=rst.length-1 ; i++){
                    biaoduan1.push(rst[i].Label);
                    yeszhongshu1.push(rst[i].Complete);
                    notzhongshu1.push(rst[i].Num-rst[i].Complete);
                }
                this.setState({loading3:false})
                if(!rst)
                    return
                try {
                    let myChart3 = echarts.getInstanceByDom(document.getElementById('primaryClass'));
                    let options3 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: biaoduan1
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: notzhongshu1
                            },
                            {
                                name: '已种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: yeszhongshu1
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
            
            param.no = param.no + "-" +this.state.smallclass;
            
            gettreetypeThinClass({},param)
            .then(rst => {
               
                 let biaoduan2 = [];
                let yeszhongshu2 = [];
                let notzhongshu2 = [];
                for(let i = 0; i<=rst.length-1 ; i++){
                    biaoduan2.push(rst[i].Label);
                    yeszhongshu2.push(rst[i].Complete);
                    notzhongshu2.push(rst[i].UnComplete);
                }
               
                this.setState({loading4:false})

                if(!rst)
                    return
                try {
                    let myChart4 = echarts.getInstanceByDom(document.getElementById('overall'));
                    let options4 = {
                        legend: {
                            data: ['未种植','已种植']
                        },
                        xAxis: [
                            {
                                data: biaoduan2
                            }
                        ],
                        series: [
                            {
                                name: '未种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: notzhongshu2
                            },
                            {
                                name: '已种植',
                                type: 'bar',
                                stack: '总量',
                                label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
                                data: yeszhongshu2
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


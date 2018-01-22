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
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2017-11-24 23:59:59'),
            etime2: moment().format('2017-11-24 23:59:59'),
            etime3: moment().format('2017-11-24 23:59:59'),
            etime4: moment().format('2017-11-24 23:59:59'),
            etime5: moment().unix(),
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
                // this.sum(0);
                // this.sum(1);
                // this.sum(2);
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
                stime:stime1?moment(stime1).add(8, 'h').unix():'',
                etime:etime1?moment(etime1).add(8, 'h').unix():''
            }
            this.qury(index,param);
        }
        if(index == 2 ) {
            const {etime2} = this.state;
            let param = {
                etime:etime2?moment(etime2).add(8, 'h').unix():''
            }
            this.qury(index,param);
        }
        if(index == 3 ) {
            const {etime3,section} = this.state;
            let param = {
                // etime:etime3?moment(etime3).add(8, 'h').unix():'',
                section
            }
            this.qury(index,param);
        }
        if(index == 4 ) {
            const {etime4,section,smallclass} = this.state;
            let param = {
                // etime:etime4?moment(etime4).add(8, 'h').unix():'',
                section,
                // smallclass
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
        // debugger;
        const {actions: {gettreetype1,gettreetype2,gettreetype3,gettreetype4,getCount,getCountSection,getCountSmall,getCountThin},leftkeycode} = this.props;
        param.no = leftkeycode;
        if(index === 1 ){
            this.setState({loading1:true})
            gettreetype1()
            .then(rst => {
                console.log(rst,"fenbushi");
               let res = groupBy(rst, function(n){
                return n.Time
            });
               let biaoduan1 = [];
               let biaoduan2 = [];
               let biaoduan3 = [];
               let biaoduan4 = [];
               let biaoduan5 = [];
               let bytime = Object.values(res);
               console.log(bytime,"tiantain");
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
               console.log(biaoduan1,"dwad");
               console.log(biaoduan2,"dwad");
               console.log(biaoduan3,"dwad");
               console.log(biaoduan4,"dwad");
               console.log(biaoduan5,"dwad");
               let lastshuzhu =[];
               lastshuzhu = [biaoduan1,biaoduan2,biaoduan3,biaoduan4,biaoduan5];
               console.log(lastshuzhu,"vytdfifdufud");
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
            console.log(wsx,"wsx");
            let Num1 = 0;
            for(var i = 0; i<=rst.length-1; i++){
            Num1 = Num1 + rst[i].Num;
            }
            this.setState({
                 amount:Num1,
            })
            console.log(Num1,"Num1");
            console.log(value,"dajkh")
            console.log(time);
                this.setState({loading1:false})
                if(!rst)
                    return
                try {
                    let myChart1 = echarts.getInstanceByDom(document.getElementById('plant'));
                    let options1 = {

                         title: {
                                    // text: '折线图堆叠'
                                },
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
                                        // stack: '总量',
                                        data:lastshuzhu[0]
                                    },
                                    {
                                        name:'2标段',
                                        type:'line',
                                        // stack: '总量',
                                        data:lastshuzhu[1]
                                    },
                                    {
                                        name:'3标段',
                                        type:'line',
                                        // stack: '总量',
                                        data:lastshuzhu[2]
                                    },
                                    {
                                        name:'4标段',
                                        type:'line',
                                        // stack: '总量',
                                        data:lastshuzhu[3]
                                    },
                                    {
                                        name:'5标段',
                                        type:'line',
                                        // stack: '总量',
                                        data:lastshuzhu[4]
                                    }
                                ]
                            };

                    myChart1.setOption(options1);

                    // let myChart1 = echarts.getInstanceByDom(document.getElementById('plant'));
                    // let totledata = [],series = [],legend = ['种植总数'];
                    // for(let key in lastshuzhu) {
                    //     // if(key !== '日期') {
                    //     //     if(totledata.length == 0 )
                    //     //          totledata = rst[key]
                    //     //     else
                    //     //         totledata = arraynumadd(rst[key],totledata);
                    //         series.push({
                    //             name: key,
                    //             type: 'line',
                    //             yAxisIndex: 1,
                    //             data: lastshuzhu[key]
                    //         });
                    //         legend.push(key)
                    //     // }
                    // }
                    // series.unshift({
                    //     name:'种植总数',
                    //     type:'bar',
                    //     data:wsx
                    // });
                    // let options1 = {
                    //     legend: {
                    //         data:legend
                    //     },
                    //     xAxis : [
                    //         {
                    //             data: time,
                    //         }
                    //     ],
                    //     series: series
                    // };
                    // myChart1.setOption(options1);
                } catch(e) {
                    console.log(e)
                }
            }) 
        } else if(index === 2) {
            this.setState({loading2:true})
            // getCountSection({},param)
            gettreetype2()
            .then(rst => {
                console.log(rst);
                let biaoduan = [];
                let yeszhongshu = [];
                let notzhongshu = [];
                for(let i = 0; i<=rst.length-1 ; i++){
                    biaoduan.push(rst[i].Label);
                    yeszhongshu.push(rst[i].Complete);
                    notzhongshu.push(rst[i].No);
                }
                console.log(biaoduan,yeszhongshu,notzhongshu);
                this.setState({loading2:false})
                if(!rst)
                    return
                try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('section1'));
                    let unplanted = arraynumsub(rst["总数"], rst["已种植数量"]);
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
            gettreetype3({},param)
            .then(rst => {
                console.log(rst);
                 let biaoduan1 = [];
                let yeszhongshu1 = [];
                let notzhongshu1 = [];
                for(let i = 0; i<=rst.length-1 ; i++){
                    biaoduan1.push(rst[i].Label);
                    yeszhongshu1.push(rst[i].Complete);
                    notzhongshu1.push(rst[i].No);
                }
                console.log(biaoduan1,yeszhongshu1,notzhongshu1);
                this.setState({loading3:false})
                if(!rst)
                    return
                try {
                    let myChart3 = echarts.getInstanceByDom(document.getElementById('primaryClass'));
                    let unplanted = arraynumsub(rst["总数"], rst["已种植数量"])
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
            console.log(param,"laodaye");
            gettreetype4({},param)
            .then(rst => {
                console.log(rst);
                 let biaoduan2 = [];
                let yeszhongshu2 = [];
                let notzhongshu2 = [];
                for(let i = 0; i<=rst.length-1 ; i++){
                    biaoduan2.push(rst[i].Label);
                    yeszhongshu2.push(rst[i].Complete);
                    notzhongshu2.push(rst[i].UnComplete);
                }
                console.log(biaoduan2,yeszhongshu2,notzhongshu2);
                this.setState({loading4:false})
                if(!rst)
                    return
                try {
                    let myChart4 = echarts.getInstanceByDom(document.getElementById('overall'));
                    let unplanted = arraynumsub(rst["总数"], rst["已种植数量"]);
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

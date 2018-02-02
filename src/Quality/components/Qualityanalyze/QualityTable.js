import React, {Component} from 'react';
import {Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import {Cards} from '../../components';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;
var echarts = require('echarts');
export default class QualityTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	section: '',
        	leftkeycode: '',
        	stime1: moment().format('2017-11-17 00:00:00'),
			etime1: moment().format('2017-11-24 23:59:59'),
			stime2: moment().format('2017-11-17 00:00:00'),
			etime2: moment().format('2017-11-24 23:59:59'),
			stime3: moment().format('2017-11-17 00:00:00'),
			etime3: moment().format('2017-11-24 23:59:59'),
			stime4: moment().format('2017-11-17 00:00:00'),
			etime4: moment().format('2017-11-24 23:59:59'),
			loading1: false,
			loading2: false,
			loading3: false,
			loading4: false,
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode,
            }, () => {
                this.datepickok(1);
                this.datepickok(2);
                this.datepickok(3);
                this.datepickok(4);
		    })
        }   
    }

    componentDidMount() {
    	//图表一
        var myChart1 = echarts.init(document.getElementById('homeContChart1'));
		let options1 = {
		    tooltip : {
		        trigger: 'axis'
		    },
		    grid: {
		        left: '3%',
		        right: '50px',
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
		myChart1.setOption(options1);
        //图表二
		var myChart2 = echarts.init(document.getElementById('homeContChart2'));
		let options2 = {
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
		myChart2.setOption(options2);

		//图表三
		var myChart3 = echarts.init(document.getElementById('homeContChart3'));
		let options3 = {
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
		    toolbox: {
		        feature: {
		            saveAsImage: {show: true}
		        }
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
		myChart3.setOption(options3);

		//图表四
		var myChart4 = echarts.init(document.getElementById('homeContChart4'));
		let options4 = {
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
		    toolbox: {
		        feature: {
		            saveAsImage: {show: true}
		        }
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
		myChart4.setOption(options4);
    }

	render() {
		const {} = this.state;
		return (
			<div >
				<Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
					<Col span={12} >
						<Spin spinning={this.state.loading1}>
							<Cards search={this.search(1)} title='各标段合格率分析'>
								<div id = 'homeContChart1' style = {{width:'100%',height:'290px',margin:'0 auto'}}>
								</div>
							</Cards>
						</Spin>
					</Col>
					<Col span={12} >
						<Spin spinning={this.state.loading2}>	
							<Cards defaultValue='全部' search={this.search(2)} title={this.title()}>
								<div id = 'homeContChart2' style = {{width:'100%',height:'290px',margin:'0 auto'}}>
								</div>
							</Cards>
						</Spin>
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '20px 5px 5px 5px'}}>
					<Col span={12} >
						<Spin spinning={this.state.loading3}>	
							<Cards search={this.search(3)} title='业主苗木退回分析'>
								<div id = 'homeContChart3' style = {{width:'100%',height:'290px',margin:'0 auto'}}>
								</div>
							</Cards>
						</Spin>
					</Col>
					<Col span={12} >
						<Spin spinning={this.state.loading4}>	
							<Cards search={this.search(4)} title='监理苗木退回分析'>
								<div id = 'homeContChart4' style = {{width:'100%',height:'290px',margin:'0 auto'}}>
								</div>
							</Cards>
						</Spin>
					</Col>
				</Row>
			</div>
		);
	}
	search(index) {
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
	}
	title(){
		const {sectionoption} = this.props;
		const {section} = this.state;
		return <div>
					<Select value={section} onChange={this.onsectionchange.bind(this)} style={{width: '63px'}}>
						{sectionoption}
					</Select>
					<span>苗木退回分析</span>
				</div>
	}
	onsectionchange(value) {
		const {stime2,etime2} = this.state;
		this.setState({section:value},() => {
			this.datepickok(2)
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
        if(index == 3){
        	this.setState({stime3:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime3:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 4){
            this.setState({stime4:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime4:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
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
            const {stime2,etime2,section} = this.state;
            let param = {
                stime:stime2?moment(stime2).format('YYYY-MM-DD HH:mm:ss'):'',
                etime:etime2?moment(etime2).format('YYYY-MM-DD HH:mm:ss'):'',
                section
            }
            this.qury(index,param);
        }
        if(index == 3 ) {
            const {stime3,etime3} = this.state;
            let param = {
                stime:stime3?moment(stime3).format('YYYY-MM-DD HH:mm:ss'):'',
                etime:etime3?moment(etime3).format('YYYY-MM-DD HH:mm:ss'):'',
            }
            this.qury(index,param);
        }
        if(index == 4 ) {
            const {stime4,etime4} = this.state;
            let param = {
                stime:stime4?moment(stime4).format('YYYY-MM-DD HH:mm:ss'):'',
                etime:etime4?moment(etime4).format('YYYY-MM-DD HH:mm:ss'):'',
            }
            this.qury(index,param);
        }
    }
    qury(index,param) {
    	console.log('param',param)
		const {actions: {getquality,getreturn,getreturnowner,getreturnsupervision},leftkeycode} = this.props;
		param.no = 'P009';
    	if(index === 1 ){
    		this.setState({loading1:true})
			getquality({},param)
	        .then(rst => {
	        	console.log('rst',rst)
	        	this.setState({loading1:false})
	        	if(!rst)
	        		return
	        	try {
                    let myChart1 = echarts.getInstanceByDom(document.getElementById('homeContChart1'));
		        	let options1 = {
		        		legend: {
				        	data:['监理验收合格率','业主抽查合格率']
				    	},
				    	xAxis: [
					        {
					        	type: 'category',
					            data: rst['标段名称']
					        }
					    ],
				    	series: [
					        {
					            name: '监理验收合格率',
					            type: 'bar',
					            data: rst['监理验收合格率'],
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
					        {
					            name: '业主抽查合格率',
					            type: 'bar',
					            data: rst['业主抽查合格率'],
					            markPoint: {
					                data: [
					                    {type: 'max', name: '最大值'},
					                    {type: 'min', name: '最小值'}
					                ]
					            },
					            markLine: {
					                data: [
					                    {type : 'average', name: '平均值'}
					                ]
					            }
					        }
					    ]
		        	}
		        	myChart1.setOption(options1);
                } catch(e) {
                    console.log(e)
                }
	        }) 
    	} else if(index === 2) {
    		this.setState({loading2:true})
    		getreturn({},param)
    		.then(rst => {
    			this.setState({loading2:false})
    			if(!rst)
	        		return
	        	try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('homeContChart2'));
		        	let options2 = {
		        		legend: {
					        data: ['业主退回量','监理退回量']
					    },
					    xAxis: [
					        {
					            data: rst['日期']
					        }
					    ],
					    series: [
					        {
					            name: '业主退回量',
					            type: 'bar',
					            stack: '总量',
					            label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
					            data: rst['业主退回数量']
					        },
					        {
					            name: '监理退回量',
					            type: 'bar',
					            stack: '总量',
					            label: { normal: {offset:['50', '80'], show: true, position: 'inside', formatter:'{c}', textStyle:{ color:'#FFFFFF' } }},
					            data: rst['监理退回数量']
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
    		getreturnowner({},param)
    		.then(rst => {
    			this.setState({loading3:false})
    			if(!rst)
	        		return
	        	try {
                    let myChart3 = echarts.getInstanceByDom(document.getElementById('homeContChart3'));
	    			let totledata = [],series = [],legend = ['业主退回总数'];
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
	    				name:'业主退回总数',
			            type:'bar',
			            data:totledata
	    			});
		        	let options3 = {
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
		        	myChart3.setOption(options3);
                } catch(e) {
                    console.log(e)
                }
    		})
    	} else {
    		this.setState({loading4:true})
    		getreturnsupervision({},param)
    		.then(rst => {
    			this.setState({loading4:false})
    			if(!rst)
	        		return
	        	try {
                    let myChart4 = echarts.getInstanceByDom(document.getElementById('homeContChart4'));
		        	let totledata = [],series = [],legend = ['监理退回总数'];
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
	    				name:'监理退回总数',
			            type:'bar',
			            data:totledata
	    			});
		        	let options4 = {
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
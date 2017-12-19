import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Row, Col, Input, Icon} from 'antd';
import {Hotdata} from '../components';
import moment from 'moment';

var echarts = require('echarts');

@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Statistics extends Component {
	componentDidMount () {
		var myChart1 = echarts.init(document.getElementById('homeContChart1'));
		let options1 = {
		    title: {
		        text: '平台访问历史'
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            label: {
		                backgroundColor: '#6a7985'
		            }
		        }
		    },
		    legend: {
		        data:['平台访问次数','数据下载次数','API访问次数']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : ['十月','十一月','十二月']
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'平台访问次数',
		            type:'line',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'top'
		                }
		            },
		            areaStyle: {normal: {}},
		            data:[30, 40, 60]
		        },
		        {
		            name:'数据下载次数',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[15, 27, 36]
		        },
		        {
		            name:'API访问次数',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[30, 26, 40]
		        }
		    ]
		};
		myChart1.setOption(options1);
		var myChart2 = echarts.init(document.getElementById('homeContChart2'));
		let options2 = {
			title: {
		        text: '数据访问类型Top5'
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    legend: {
		        data: ['数据集', 'API']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value'
		    },
		    yAxis: {
		        type: 'category',
		        data: ['建造项目','设计数据','规划数据','地质数据', '国土资源','测绘数据' ]
		    },
		    series: [
		        {
		            name: '数据集',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            data: [43,44,45,54,62,203]
		        },
		        {
		            name: 'API',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'insideRight'
		                }
		            },
		            data: [6,6,7,10,10,13]
		        }
		    ]
		};
		myChart2.setOption(options2);
	}
	render() {
        const {
        } = this.props;

		return (
			<Body>
				<Main>
					<DynamicTitle title="资源统计" {...this.props}/>
					<Content>
						<Row>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-fangwen f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>平台访问次数</div>
										<div>108</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-xiangxia f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>数据下载次数</div>
										<div>12</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-xindiantu f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>API调用次数</div>
										<div>21</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-mulu f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>数据目录总量</div>
										<div>16</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-zongjia f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>API服务总量</div>
										<div>6</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-fangwen f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>BIM调用次数</div>
										<div>206</div>
									</Col>
								</Row>
							</Col>
							<Col span={3} className="contcenter ">
								<Row className="w160 ">
									<Col span={6}>
										<i className="ecidi ecidi-xindiantu f29"></i>
									</Col>
									<Col span={18} className='f15'>
										<div>规章制度浏览次数</div>
										<div>86</div>
									</Col>
								</Row>
							</Col>
						</Row>
						<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
						<Row className='mg5'>
							<Col span={12}>
								<div id = 'homeContChart1' style = {{width:'100%',height:'360px'}}>
								</div>
							</Col>
							<Col span={12}>
								<div id = 'homeContChart2' style = {{width:'100%',height:'360px'}}>
								</div>
							</Col>
						</Row>
						<h1>数据热点</h1>
						<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
						<Hotdata/>
					</Content>
				</Main>
			</Body>
		);
	}
}

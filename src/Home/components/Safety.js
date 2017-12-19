import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {Col,Row} from 'antd';
import {VictoryChart, VictoryPie, VictoryTooltip} from 'victory';
import ReactEcharts from 'react-echarts';

import data from './safetyData.json';


export default class Warning extends Component {

	static propTypes = {};

	getChartsOptions(type){

		let theData;
		let optionName;
		switch (type) {
			case 'GradeWarn':
				optionName = '安全隐患';
				theData = data['gradeWarnData'];
				break;
			case 'Overdue':
			optionName = '安全隐患处理情况';
			
				theData = data['overDueData'];
			
				break;
			case 'Handle':
			optionName = '本月安全隐患处理情况';			
			theData = data['handleData'];
			
				break;
		
			default:
				break;
		}

		let options = {
			title: {
				text: optionName,
				left: 'center',
				top: 20,
				textStyle: {
					color: '#ccc'
				}
			},
		
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
		
			visualMap: {
				show: false,
				inRange: {
					colorLightness: [0.3, 0.8]
				}
			},
			series : [
				{
					name:'',
					type:'pie',
					radius : ['0%','50%'],
					center: ['50%', '50%'],
					data: theData.sort(function (a, b) { return a.value - b.value; }),
					roseType: 'radius',
					label: {
						normal: {
							textStyle: {
								color: 'rgba(0, 0, 0, 0.8)'
							}
						}
					},
					labelLine: {
						normal: {
							lineStyle: {
								color: 'rgba(0, 0, 0, 0.2)'
							},
							smooth: 0.1,
							length: 30,
							length2: 50
						}
					},
					itemStyle: {
						normal: {
							color: '#c23531',
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
		
					// animationType: 'scale',
					// animationEasing: 'elasticOut',
					// animationDelay: function (idx) {
					// 	return Math.random() * 200;
					// }
				}
			]
		};

		return options;

	}

	render() { //todo 工程安全具体实现
		return (
			<Blade title="工程安全">
				{/* <VictoryChart height={200}>
					<VictoryPie height={100} labelComponent={<VictoryTooltip/>} data={[
						{x: "Cats", y: 35, label: "right-side-up"},
						{x: "Dogs", y: 40, label: "right-side-up"},
						{x: "Birds", y: 55, label: "right-side-up"}
					]}/>
				</VictoryChart> */}
			<Row>
			<Col span={8}>
				<ReactEcharts
				option={this.getChartsOptions('GradeWarn')}
				style={{height: '380px'}}
				/>
			</Col>
			<Col span={8}>
				<ReactEcharts
				option={this.getChartsOptions('Overdue')}
				style={{height: '380px'}}
				/>
			</Col>
			<Col span={8}>
				<ReactEcharts
				option={this.getChartsOptions('Handle')}
				style={{height: '380px'}}
				/>
			</Col>
			</Row>
			

			</Blade>
		);
	}
}

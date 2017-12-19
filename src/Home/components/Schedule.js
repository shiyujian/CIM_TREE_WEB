import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {VictoryChart, VictoryLine, VictoryTooltip} from 'victory';
import data from './schedule1.json';
var echarts = require('echarts');

export default class Schedule extends Component {
	componentDidMount(){
		var myChart = echarts.init(document.getElementById('homeChart2'));
		const sectionStatus = 0;
		let timeType = 'M';
		let options = {
			color: ['#1abc9c', '#409ad0', '#f39c12'],
			// grid: {
			// 	x: 60,
			// 	y: 40,
			// 	x2: 10,
			// 	y2: 40,
			// },
			tooltip: {
				trigger: 'axis',
				axisPointer: {
				}
			},
			toolbox: {
				feature: {
				}
			},
			legend: {
				data: ['计划完成', '实际完成'],
				textStyle: {color: '#000', fontSize: 13}
			},
			xAxis: [
				{
					type: 'category',
					data: data[sectionStatus].address,
					axisPointer: {
						type: 'shadow'
					},
					axisLabel: {
						textStyle: {color: '#000', fontSize: 13}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					min: 0,
					// max: 2500,
					interval: 1000,
					axisLabel: {
						formatter: '{value}万',
						textStyle: {color: '#000', fontSize: 13}
					}
				}
			],
			series: [
				{
					name: '计划完成',
					type: 'bar',
					data: data[sectionStatus][`plan${timeType}`],
					itemStyle: {
						normal: {
							barBorderRadius: 5
						},
						emphasis: {
							barBorderRadius: 5
						}
					}
				},
				{
					name: '实际完成',
					type: 'bar',
					data: data[sectionStatus][`actual${timeType}`],
					itemStyle: {
						normal: {
							barBorderRadius: 5
						},
						emphasis: {
							barBorderRadius: 5
						}
					}
				}
			]
		};
		myChart.setOption(options);

	}
	static propTypes = {};

	render() {//todo 产量具体实现
		return (
			<Blade title="月度/季度产值">
				<div id = 'homeChart2' style = {{width:'100%',height:'360px'}}>
				</div>
			</Blade>

		);
	}
}

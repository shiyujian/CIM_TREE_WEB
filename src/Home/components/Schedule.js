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
			color: ['#409ad0', '#f39c12'],
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
				data: ['累计种植量', '种植比例'],
				textStyle: {color: '#000', fontSize: 13}
			},
			xAxis: [
				{
					type: 'category',
					// data: data[sectionStatus].address,
					data:['一标段','二标段','三标段','四标段','五标段'],
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
					name: '累计种植量',
					min: 0,
					position:'left',
					// max: 2500,
					interval: 1000,
					axisLabel: {
						formatter: '{value}',
						textStyle: {color: '#000', fontSize: 13}
					}
				},
				{
					type: 'value',
					name: '种植比例',
					min: 0,
					position:'right',
					// max: 2500,
					interval: 1000,
					axisLabel: {
						formatter: '{value}',
						textStyle: {color: '#000', fontSize: 13}
					}
				},

			],
			series: [
				{
					name: '累计种植量',
					type: 'bar',
					// data: data[sectionStatus][`plan${timeType}`],
					data:[1000,2000,2236,1245,4563],
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
					name: '种植比例',
					type: 'line',
					// data: data[sectionStatus][`actual${timeType}`],
					data:[800,1800,1500,1100,4000],
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
			<Blade title="进度信息统计">
				<div id = 'homeChart2' style = {{width:'100%',height:'360px'}}>
				</div>
			</Blade>

		);
	}
}

import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {VictoryChart, VictoryLine, VictoryTooltip} from 'victory';
import ReactEcharts from 'react-echarts';
import data from './qualityData.json';

export default class Quality extends Component {

	static propTypes = {};

	getChartsOptions(){

		let colors = ['#5793f3', '#d14a61', '#675bba'];
		let options = {
			color: ['#1abc9c', '#f39c12', ],
			textStyle: {color: '#fff', fontSize: 13},			
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			toolbox: {
				feature: {

				}
			},
			legend: {
				data: ['检验批', '合格率']

			},
			xAxis: [
				{
					type: 'category',
					data: data.projectName,
					name: '项目',
					axisLabel: {
                        textStyle: {color: '#000', fontSize: 13}
                    }
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '完成数量',
					min: 0,
					interval: 20,
					position: 'left',
					// axisLine: {
					// 	lineStyle: {
					// 		color: colors[0]
					// 	}
					// },
					axisLabel: {
                        formatter: '{value}',
                        textStyle: {color: '#000', fontSize: 13}
                    }
				},
				{
					type: 'value',
					name: '合格率',
					min: 0,
					max: 100,
					interval: 20,
					position: 'right',
					// axisLine: {
					// 	lineStyle: {
					// 		color: colors[1]
					// 	}
					// },
					axisLabel: {
                        formatter: '{value} %',
                        textStyle: {color: '#000', fontSize: 13}
                    }
				}
			],
			series: [
				{
					name: '检验批',
					type: 'line',
					yAxisIndex: 0,
					data: data.doneAmount
				},
				{
					name: '合格率',
					type: 'line',
					yAxisIndex: 1,
					data: data.okayRate
				},
			]
		};

		return options;

	}

	render() { //todo 工程质量具体实现
		return (
			<Blade title="工程质量">
				{/* <VictoryChart height={200}>
					<VictoryLine labelComponent={<VictoryTooltip/>} samples={25} y={(d) => Math.sin(5 * Math.PI * d.x)}/>
					<VictoryLine samples={100} style={{data: {stroke: "red"}}} y={(d) => Math.cos(5 * Math.PI * d.x)}/>
				</VictoryChart> */}
				<ReactEcharts
				option={this.getChartsOptions()}
				style={{height: '380px', width: '100%'}}
				/>


			</Blade>
		);
	}
}

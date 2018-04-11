import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {VictoryChart, VictoryLine, VictoryTooltip} from 'victory';
import data from './schedule1.json';
import {Select} from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
var echarts = require('echarts');
@connect(
    state => {
        const {platform} = state;
        return {platform};
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions}, dispatch),
    }),
)
export default class Schedule extends Component {
	options1 = {}
	options2 = {}
	handleChange(value){
		// use value to get the chartValue and set
		var myChart = echarts.init(document.getElementById('homeChart2'));
		if(value === 'P009'){
			myChart.setOption(this.options1);
		}else if(value === 'P010'){
			myChart.setOption(this.options2);
		}
	}
	componentDidMount(){
		const {actions: {getTreeNodeList},platform:{tree = {}}} = this.props;
		if(!tree.bigTreeList){
            getTreeNodeList()
        }
		var myChart = echarts.init(document.getElementById('homeChart2'));
		const sectionStatus = 0;
		let timeType = 'M';
		this.options1 = {
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
		this.options2 = {
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
					data:[3000,2000,1236,4245,3563],
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
					data:[1800,800,1500,1100,4000],
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
		myChart.setOption(this.options1);

	}
	static propTypes = {};

	render() {//todo 产量具体实现
		const {platform:{tree={}}} = this.props;
		let treeList = [];
		let options = [];
        if(tree.bigTreeList){
			treeList = tree.bigTreeList;
			treeList.map(item => {
				options.push(<Option value={item.No} key={item.No}>{item.Name}</Option>)
			})
		}
		return (
			<Blade title="进度信息统计">
				<Select style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
					{
						options
					}
				</Select>
				<div id = 'homeChart2' style = {{width:'100%',height:'340px'}}>
				</div>
			</Blade>

		);
	}
}

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions, ID} from '../store/item';
import {actions as actions2} from '../store/cells';
import {actions as platformActions} from '_platform/store/global';
import {message} from 'antd';
import {Main, Content, Sidebar, DynamicTitle} from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import {Filter, Table, Blueprint} from '../components/Item';
import QualityTree from '../components/QualityTree';
import './common.less';
var echarts = require('echarts');
var myChart
var myChart3
var myChart2

@connect(
	state => {
		const {item = {}} = state.quality || {};
		return item;
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
		cellActions: bindActionCreators({...actions2}, dispatch),
	}),
)
export default class Item extends Component {

	static propTypes = {};

	componentDidMount(){
        const {getUnitTree, getWorkPackageDetail} = this.props.cellActions
        myChart = echarts.init(document.getElementById('qualityChart1'));
		myChart3 = echarts.init(document.getElementById('qualityChart3'));
		myChart2 = echarts.init(document.getElementById('qualityChart2'));
        getUnitTree().then(res => {
            try {
                const unitPk = res.children[0].children[0].pk
                getWorkPackageDetail({pk: unitPk}).then(res => {
                    this.initChartData(res)
                })
            } catch (e) {
                console.log('not fount C_WP_UNT!')
            }
        })
	}
	render() {
		const {table: {editing = false} = {}} = this.props;
		return (
			<Main>
				<DynamicTitle title="统计分析" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<QualityTree actions ={this.props.cellActions} nodeClkCallback={this.handleSelectTreeNode}/>
					</div>
				</Sidebar>
				<Content>
					<div style={{ width: '100%', height: '814px' }}>
						<div id = 'qualityChart1' style={{ display: 'inline-block', width: '100%', height: '50%' }}></div>
						<div id = 'qualityChart2' style={{ display: 'inline-block', width: '50%', height: '50%' }}></div>
						<div id = 'qualityChart3' style={{ display: 'inline-block', width: '50%', height: '50%' }}></div>
					</div>
				</Content>
			</Main>
		);
	}

    handleSelectTreeNode = async (selectedKeys) => {
        if (typeof selectedKeys[0] !== 'string') return
        const keyArr = selectedKeys[0].split('--')
        if (keyArr.length !== 3 || keyArr[1] === 'C_PJ') return
        const {getWorkPackageDetail} = this.props.cellActions
        const response = await getWorkPackageDetail({pk: keyArr[0]})
        this.initChartData(response)
    }

    initChartData = (data) => {
        console.log('initChartData: ', data)
		const option = {
			color : ['#1abc9c', '#409ad0', '#f39c12'],
			title : {
                text: '质量验评优良率',
                x:'center'
            },
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},

			legend: {
				data:['数量','比例'],
				left:'left'
			},
			xAxis: [
				{
					type: 'category',
					// data: ['单位工程1','单位工程2','单位工程3','单位工程4','单位工程5', '单位工程6','单位工程7','单位工程8','单位工程9','单位工程10','单位工程11','单位工程12'],
					data: data.children_wp.map(x => x.name),
					axisPointer: {
						type: 'shadow'
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '数量',
					min: 0,
					// max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} 个'
					}
				},
				{
					type: 'value',
					name: '比例',
					min: 0,
					max: 100,
					interval: 5,
					axisLabel: {
						formatter: '{value} %'
					}
				}
			],
			series: [

				{
					width:'40%',
					name:'数量',
					type:'bar',
					// data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
					data: data.children_wp.map(x => {
                        const qc_counts = x.basic_params.qc_counts
                        return qc_counts ? qc_counts.fine : 0
                    }),
				},
				{
					name:'比例',
					type:'line',
					yAxisIndex: 1,
					// data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
					data: data.children_wp.map(x => {
                        const qc_counts = x.extra_params.qualified_rate * 100
                        return qc_counts ? qc_counts : 0
                    }),
				}
			]
		};
		myChart.setOption(option);
		const option2 = {
			color : ['#1abc9c', '#409ad0', '#f39c12'],
			title : {
                text: '质量管理检验批验评情况',
                x:'center'
            },
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['已检验', '未检验']
			},
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{ value: data.qc_counts.checked, name: '已检验' },
						{ value: data.qc_counts.nonchecked, name: '未检验' },
					],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};

		myChart2.setOption(option2);
		const option3 = {
			color : ['#1abc9c', '#409ad0', '#f39c12'],
			title : {
                text: '质量缺陷整改情况',
                x:'center'
            },
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['已整改', '未整改', '整改中']
			},
			series: [
				{
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{ value: data.defect_counts.settled, name: '已整改' },
						{ value: data.defect_counts.total - data.defect_counts.settled - data.defect_counts.executing, name: '未整改' },
						{ value: data.defect_counts.executing, name: '整改中' },
					]
				}
			]
		};

		myChart3.setOption(option3);
    }

    getPercent = (num, total) => {
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
            return "-"
        }
        return total <= 0 ? 0 : (Math.round(num / total * 10000) / 100.00)
    }
}

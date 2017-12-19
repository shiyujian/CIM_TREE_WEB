import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
// import {VictoryChart, VictoryPie, VictoryTooltip} from 'victory';
import echarts from 'echarts';
// var echarts = require('echarts');

export default class Warning extends Component {

	static propTypes = {};

    componentDidMount() {
        const myChart = echarts.init(document.getElementById('resultSubmitPie'));
        const option = {
            title : {
                text: '成果交付申请变更百分比',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['未申请','已申请','已审核','已退回']
            },
            calculable : true,
            series : [
                {
                    name:'半径模式',
                    type:'pie',
                    radius : [20, 110],
                    center : ['50%', '50%'],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                // data:['未申请','已申请','已审核','已退回']
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                },
            ]
        };
        myChart.setOption(option);
    }

	render() { //todo 成果交付申请变更百分比具体实现
		return (
			<Blade title=''>
				<div id='resultSubmitPie' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

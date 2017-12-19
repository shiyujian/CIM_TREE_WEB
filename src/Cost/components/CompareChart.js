import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import ReactEcharts from 'echarts-for-react';

export default class CompareChart extends Component {

	static propTypes = {};


	render() { 
        let {data = []} = this.props;
        handleData(data);
		return (
			<Blade title="">
				<ReactEcharts
                         option={option}
                         style={{width:"100%",height:'360px'}}
                         notMerge={true}
                         lazyUpdate={true}
                        />
			</Blade>
		);
	}
}
//处理表格数据
function handleData(data){
    let estimate = [];
    let contract = [];
    let actual = [];
    let index =[];
    let name =[];
    data.map(item => {
        name.push(item.name);
        estimate.push(item.estimate);
        contract.push(item.contract);
        actual.push(item.actual);
        index.push(item.index);
    })
    option.xAxis[0].data = name;
    option.series[0].data = estimate;
    option.series[1].data = contract;
    option.series[2].data = actual;
    option.series[3].data = index;
}
let option = {
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
                    /*dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},*/
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['概算价格','合同价格','实际费用','指标']
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '价格',
                    axisLabel: {
                        formatter: '{value} 万元'
                    }
                },
                {
                    type: 'value',
                    name: '指标',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name:'概算价格',
                    type:'bar',
                    data:[]
                },
                {
                    name:'合同价格',
                    type:'bar',
                    data:[]
                }, 
                {
                    name:'实际费用',
                    type:'bar',
                    data:[]
                },
                {
                    name:'指标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[]
                }
            ]
        };
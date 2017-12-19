import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import ReactEcharts from 'echarts-for-react';

export default class ScheduleChart extends Component {

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
    let execute = [];
    let donePercent =[];
    let name =[];
    data.map(item => {
        name.push(item.project);
        estimate.push(item.estimate);
        execute.push(item.execute);
        donePercent.push(item.donePercent);
    })
    option.xAxis[0].data = name;
    option.series[0].data = estimate;
    option.series[1].data = execute;
    option.series[2].data = donePercent;
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
                data:['概算价格','概算执行','完成比例']
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
                    name:'指标',
                    type:'line',
                    yAxisIndex: 1,
                    data:[]
                }
            ]
        };
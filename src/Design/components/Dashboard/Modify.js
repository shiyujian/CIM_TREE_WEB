import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};
    
    componentWillReceiveProps(nextProps){
        if(this.props.DrawingReportValue != nextProps.DrawingReportValue){
            const{
                DrawingReportValue
            }=nextProps
            const myChart = echarts.init(document.getElementById('resultCountBar'));
            const option = {
                color: ['#3398DB'],
                title : {
                    text: '设计成果统计',
                    subtext: DrawingReportValue.name,
                    x:'center'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
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
                        // data : ['金岸北街', '金谷南一街', '桂湾大街北段', '枢纽八街', '枢纽十街', '创新九街', '梦海大道通道'],
                        data : DrawingReportValue.units,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        // name: '审查通过设计成果数量',
                        // nameLocation: 'middle',
                        // nameRotate: '90',
                        // nameGap: '45',
                        // nameTextStyle: {'fontSize':20, 'fontWeight': 'bold'}
                    }
                ],
                series : [
                    {
                        name:'审查通过设计成果数量',
                        type:'bar',
                        barWidth: '60%',
                        // data:[10, 12, 15, 10, 20, 13, 16]
                        data:DrawingReportValue.drawingNums
                    }
                ]
            };

            myChart.setOption(option);
        }
    }

	render() { //todo 设计成果变更统计具体实现
		return (
			<Blade title="">
				<div id='resultCountBar' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

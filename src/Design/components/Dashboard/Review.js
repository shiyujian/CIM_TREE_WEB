import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};
    
    componentWillReceiveProps(nextProps){
        if(this.props.ReviewValue != nextProps.ReviewValue){
            const{
                ReviewValue
            }=nextProps
            console.log('componentWillReceiveProps',ReviewValue)
            const myChart = echarts.init(document.getElementById('resultReviewPie'));
            let data = [
                {value:ReviewValue.data.beforehead, name:'提前交付'},
                {value:ReviewValue.data.ontime, name:'按期交付'},
                {value:ReviewValue.data.delayed, name:'逾期交付'}
            ]
            const option = {
                color: ['#0EF0FF', '#4A87FF', '#546D83'],
                title : {
                    text: '成果审查进度统计',
                    subtext: ReviewValue.name,
                    x:'center',
                    left: 'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    // orient: 'vertical',
                    left: 'right',
                    y: '8%',
                    data:['提前交付','按期交付','逾期交付']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: data,
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
            myChart.setOption(option);
        }
    }

	render() { //todo 成果审查进度统计具体实现
		return (
			<Blade title="">
				<div id='resultReviewPie' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};
    
    componentWillReceiveProps(nextProps){
        if(this.props.DeliveryValue != nextProps.DeliveryValue){
            const{
                DeliveryValue
            }=nextProps
            console.log('componentWillReceiveProps',DeliveryValue)
            const myChart = echarts.init(document.getElementById('resultSubmitPie'));
            let data = [
                {value:DeliveryValue.data.beforehead, name:'提前交付'},
                {value:DeliveryValue.data.ontime, name:'按期交付'},
                {value:DeliveryValue.data.delayed, name:'逾期交付'}
            ]
            const option = {
                color: ['#4caf50', '#f44336', '#607d8b'],
                title : {
                    text: '设计成果交付进度统计',
                    subtext: DeliveryValue.name,
                    x:'center',
                    left:'left',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
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



    render() { //todo 设计成果交付进度统计具体实现
		return (
			<Blade title="">
				<div id='resultSubmitPie' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}
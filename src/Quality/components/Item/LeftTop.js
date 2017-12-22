
import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};
    
    ComponentDidMount(){
        const myChart = echarts.init(document.getElementById('lefttop'));
        let option = {
            color:['#4786ff','#02e5cd','#ffc369'],
            title : {
                text: '质量缺陷整改统计',
                textStyle:{
                  color:  '#bcbcc9'
                },
                x:'left'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                top:'30px',
                left: 'right',
                data: ['已整改','整改中','待整改']
            },
            series : [
                {
                    name: '质量缺陷整改统计',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:90, name:'已整改'},
                        {value:20, name:'整改中'},
                        {value:5, name:'待整改'},
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
        
        myChart.setOption(option,true);
    }



    render() { //todo 设计成果交付进度统计具体实现
		return (
			<Blade title="">
				<div id='lefttop' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};

    componentDidMount() {
        const myChart = echarts.init(document.getElementById('resultCountBar1'));
        // var posList = [
        //     'left', 'right', 'top', 'bottom',
        //     'inside',
        //     'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        //     'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        // ];
        
        // let configParameters = {
        //     rotate: {
        //         min: -90,
        //         max: 90
        //     },
        //     align: {
        //         options: {
        //             left: 'left',
        //             center: 'center',
        //             right: 'right'
        //         }
        //     },
        //     verticalAlign: {
        //         options: {
        //             top: 'top',
        //             middle: 'middle',
        //             bottom: 'bottom'
        //         }
        //     },
        //     position: {
        //         options: echarts.util.reduce(posList, function (map, pos) {
        //             map[pos] = pos;
        //             return map;
        //         }, {})
        //     },
        //     distance: {
        //         min: 0,
        //         max: 100
        //     }
        // };
        
        // let config = {
        //     rotate: 90,
        //     align: 'left',
        //     verticalAlign: 'middle',
        //     position: 'insideBottom',
        //     distance: 15,
        //     onChange: function () {
        //         var labelOption = {
        //             normal: {
        //                 rotate: app.config.rotate,
        //                 align: app.config.align,
        //                 verticalAlign: app.config.verticalAlign,
        //                 position: app.config.position,
        //                 distance: app.config.distance
        //             }
        //         };
        //         myChart.setOption({
        //             series: [{
        //                 label: labelOption
        //             }, {
        //                 label: labelOption
        //             }, {
        //                 label: labelOption
        //             }, {
        //                 label: labelOption
        //             }]
        //         });
        //     }
        // };
        // var labelOption = {
        //     normal: {
        //         show: true,
        //         position: config.position,
        //         distance: config.distance,
        //         align: config.align,
        //         verticalAlign: config.verticalAlign,
        //         rotate: config.rotate,
        //         formatter: '{c}  {name|{a}}',
        //         fontSize: 16,
        //         rich: {
        //             name: {
        //                 textBorderColor: '#fff'
        //             }
        //         }
        //     }
        // };
        const option = {
            title : {
                text: '设计成果提交历史统计',
                textStyle:{
                    color:'#74859F'
                },
                x:'left'
            },
            color: ['#3B99FF', '#03E5CE', '#FFC36B'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                left: 'right',
                y: '8%',
                data: ['按期交付', '提前交付', '逾期交付']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: ['一月', '二月', '三月', '四月', '五月','六月', '七月', '八月', '九月', '十月','十一月','十二月']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '按期交付',
                    type: 'bar',
                    barWidth:'23%',
                    itemStyle:{
                        normal:{
                            show:true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    data: [198, 180, 220, 185, 146, 160, 140, 175, 177, 146, 153, 175]
                },
                {
                    name: '提前交付',
                    type: 'bar',
                    barWidth:'23%',
                    itemStyle:{
                        normal:{
                            show:true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    data: [55, 60, 80, 63, 45, 48, 56, 80, 81, 61, 48, 81]
                },
                {
                    name: '逾期交付',
                    type: 'bar',
                    barWidth:'23%',
                    itemStyle:{
                        normal:{
                            show:true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        }
                    },
                    data: [35, 42, 23, 31, 34, 18, 30, 31, 45, 20, 31, 43]
                }
            ]
        }
        myChart.setOption(option);
    }

	render() { //todo 设计成果变更统计具体实现
		return (
			<Blade title="">
				<div id='resultCountBar1' style={{ width: '100%', height: '350px' }}></div>
                <label style={{display:'block',textAlign:'center',fontSize:14}}>2017</label>
			</Blade>
		);
	}
}

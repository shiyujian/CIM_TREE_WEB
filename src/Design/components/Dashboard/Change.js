import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

	static propTypes = {};

    componentDidMount() {
        const myChart = echarts.init(document.getElementById('resultChangePie'));
        const option = {
            "title": {
                "text": '成果交付申请变更百分率',
                x:'center',
            },
            "tooltip": {
                "trigger": 'item',
                "formatter": "{a} : ({d}%)"
            },
            "series": [{
                "name": "成果交付申请变更百分率",
                "center": [
                    "50%",
                    "60%"
                ],
                "radius": [
                    "49%",
                    "50%"
                ],
                "clockWise": false,
                "hoverAnimation": false,
                "type": "pie",
                "data": [{
                    "value": 84,
                    "name": "",
                    "label": {
                        "normal": {
                            "show": true,
                            "formatter": '{d} %',
                            "textStyle": {
                                "fontSize": 25,
                                "fontWeight": "bold"
                            },
                            "position": "center"
                        }
                    },
                    "labelLine": {
                        "show": false
                    },
                    "itemStyle": {
                        "normal": {
                            "color": "#5886f0",
                            "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00a2ff'
                            }, {
                                offset: 1,
                                color: '#70ffac'
                            }]),
                            "borderWidth": 25
                        },
                        "emphasis": {
                            "color": "#5886f0",
                            "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#85b6b2'
                            }, {
                                offset: 1,
                                color: '#6d4f8d'
                            }]),
                            "borderWidth": 25
                        }
                    },
                }, {
                    "name": " ",
                    "value": 16,
                    "itemStyle": {
                        "normal": {
                            "label": {
                                "show": false
                            },
                            "labelLine": {
                                "show": false
                            },
                            "color": 'rgba(0,0,0,0)',
                            "borderColor": 'rgba(0,0,0,0)',
                            "borderWidth": 0
                        },
                        "emphasis": {
                            "color": 'rgba(0,0,0,0)',
                            "borderColor": 'rgba(0,0,0,0)',
                            "borderWidth": 0
                        }
                    }
                }]
            }]
        };
        

        myChart.setOption(option,true);
    }
	render() { //todo 成果交付申请变更百分率
		return (
			<Blade title="">
				<div id='resultChangePie' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

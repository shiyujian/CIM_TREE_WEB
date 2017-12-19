import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';

export default class Warning extends Component {

    static propTypes = {};
    
    componentWillReceiveProps(nextProps) {
        if(this.props.DrawingReportValue != nextProps.DrawingReportValue){
            const{
                DrawingReportValue
            }=nextProps;
            console.log(DrawingReportValue,'DrawingReportValue');
            let {units,drawingNums} = DrawingReportValue;
            let max = 100;
            if(drawingNums.length>1){
                max = drawingNums.reduce((l,r)=>{
                    return l>r?l:r;
                });
                max = max||100;
            }
            let indicatorData = units.map(u=>{
                return {name:u,max:max}
            });
            indicatorData = indicatorData.slice(0,6);
            if(units.length>6){
                indicatorData.push({name:'更多',max:max});
            }
            let valueData = drawingNums.slice(0,6);
            
            const myChart = echarts.init(document.getElementById('resultCountBar1'));
            const option = {
                title : {
                    text: '设计成果统计',
                    subtext: DrawingReportValue.name,
                    x:'center'
                },
                tooltip: {},
                radar: {
                    // shape: 'circle',
                    center: ['50%','60%'],
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                       }
                    },
                    indicator: indicatorData
                },
                series: [{
                    name: '',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data : [
                        {
                            value : valueData,
                            name : ''
                        }
                    ]
                }]
            };
            myChart.setOption(option);
        }
    }

    componentDidMount() {
        // const myChart = echarts.init(document.getElementById('resultCountBar1'));
        // const option = {
        //     title : {
        //         text: '设计成果统计',
        //         subtext: '桂湾片区地下车行联络道工程',
        //         x:'center'
        //     },
        //     tooltip: {},
        //     radar: {
        //         // shape: 'circle',
        //         center: ['50%','60%'],
        //         name: {
        //             textStyle: {
        //                 color: '#fff',
        //                 backgroundColor: '#999',
        //                 borderRadius: 3,
        //                 padding: [3, 5]
        //            }
        //         },
        //         indicator: [
        //            { name: '0', max: 20},
        //            { name: '1', max: 20},
        //            { name: '2', max: 20},
        //            { name: '3', max: 20},
        //            { name: '4', max: 20},
        //            { name: '5', max: 20},
        //            { name: '更多', max: 20}
        //         ]
        //     },
        //     series: [{
        //         name: '',
        //         type: 'radar',
        //         // areaStyle: {normal: {}},
        //         data : [
        //             {
        //                 value : [10, 12, 15, 10, 20, 13, 16],
        //                 name : ''
        //             }
        //         ]
        //     }]
        // };
        // myChart.setOption(option);
    }

	render() { //todo 设计成果变更统计具体实现
		return (
			<Blade title="">
				<div id='resultCountBar1' style={{ width: '100%', height: '340px' }}></div>
			</Blade>
		);
	}
}

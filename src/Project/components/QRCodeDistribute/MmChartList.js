import React, { Component } from 'react';
import {
    Tabs,
    Modal,
    Col,
    Table,
    Button,
    Popconfirm,
    Input,
    Progress,
    Select,
    Form,
    message
} from 'antd';
var echarts = require('echarts');
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;
class ChartList extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    componentWillReceiveProps (nextProps) {
        try {
            let qrcodestat = nextProps.mmqrcodestat;
            let storenum = nextProps.mmstorenum;
            if (qrcodestat.length > 0) {
                let myChart2 = echarts.init(document.getElementById('mmpieChart'));
                let option2 = {
                    title: {
                        text: '本标段造林二维码派发统计图',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 300
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        top: 40,
                        data: ['已派发', '未派发']
                    },
                    series: [
                        {
                            name: '派发数量',
                            type: 'pie',
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: qrcodestat.length > 0 ? qrcodestat[0].Sum : 0, name: '已派发'},
                                {value: storenum, name: '未派发'}
                            ]
                        }
                    ]
                };
                myChart2.setOption(option2);
            }
            // }

            let qrcodestatcount = nextProps.mmqrcodestatcount;
            if (qrcodestatcount.length > 0) {
                let linedata = [];
                let linedatax = [];
                if (qrcodestatcount.length > 0) {
                    for (let i = 0; i < qrcodestatcount.length; i++) {
                        let arr = qrcodestatcount[i].Label.split('-');
                        if(arr[0].length === 4){
                            linedata.push(qrcodestatcount[i].Sum);
                            linedatax.push(qrcodestatcount[i].Label);
                        }
                    }
                }
                if (linedatax.length > 0) {
                    let projectList = this.props.projectList;
                    if (projectList.length > 0) {
                        for (let j = 0; j < linedatax.length; j++) {
                            for (let l = 0; l < projectList.length; l++) {
                                if (projectList[l].No === linedatax[j].split('-')[0]) {
                                    let list = projectList[l].children;
                                    for (let k = 0; k < list.length; k++) {
                                        if (list[k].No === linedatax[j]) {
                                            linedatax[j] = projectList[l].Name + list[k].Name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                let myChart3 = echarts.init(document.getElementById('mmlineChart'));
                let option3 = {
                    title: {
                        text: '各标段申请统计',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 300
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        // data:['1标段', '2标段']
                        data: linedatax
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        // data:[19500,3000],
                        data: linedata,
                        type: 'bar'
                    }]

                };
                myChart3.setOption(option3);
            }
        } catch (e) {
            console.log('componentWillReceiveProps', e);
        }

        // }
    }
    render () {
        return (
            <div style={{margin: 10, height: 310}}>
                <div id='mmlineChart' style={{float: 'left', width: '50%', height: 300, borderRadius: 5, border: '1px solid #ccc', padding: 10}} />
                <div id='mmpieChart' style={{float: 'left', marginLeft: '1%', width: '49%', height: 300, borderRadius: 5, border: '1px solid #ccc', padding: 10}} />
            </div>
        );
    }
};
export default ChartList;

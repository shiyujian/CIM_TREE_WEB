import React, { Component } from 'react';
import echarts from 'echarts';
import { Spin, Card, Notification } from 'antd';
import XLSX from 'xlsx';

export default class ZaiZhi extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            queryData: [],
        };
    }
    async componentDidMount () {
        var myChart = echarts.init(document.getElementById('topLeft'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['待栽植', '已栽植']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 0, name: '待栽植'},
                        {value: 0, name: '已栽植'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode,
            queryTime
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.query();
        }
        if (queryTime && queryTime !== prevProps.queryTime) {
            this.query();
        }
    }

    render () {
        return (
            <Spin spinning={this.state.loading}>
                <Card title='栽植量'
                    extra={
                        <div>
                            <a onClick={this.handlePlantDataExport.bind(this)}>
                                导出
                            </a>
                        </div>
                    }
                >
                    <div
                        id='topLeft'
                        style={{ width: '100%', height: '300px' }}
                    />
                </Card>
            </Spin>
        );
    }

    query = async () => {
        const {
            leftkeycode = '',
            sectionSearch = '',
            thinclassSearch = '',
            smallclassSearch = '',
            actions: {
                getTreePlanting
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let no = '';
            if (thinclassSearch) {
                let arr = thinclassSearch.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
            } else if (smallclassSearch) {
                let arr = smallclassSearch.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3];
            } else if (leftkeycode) {
                no = leftkeycode;
            }
            let postdata = {
                no: no,
                section: sectionSearch
            };
            let queryData = [];
            let treePlanting = await getTreePlanting({}, postdata);
            if (treePlanting) {
                let data = treePlanting.split(',');
                if (data && data instanceof Array && data.length === 2) {
                    queryData = data;
                    let unPlantNum = Number(data[0]);
                    let plantNum = Number(data[1]);
                    let myChart = echarts.init(document.getElementById('topLeft'));
                    let option = {
                        series: [
                            {
                                data: [
                                    {value: unPlantNum, name: '待栽植'},
                                    {value: plantNum, name: '已栽植'}
                                ]
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
                this.setState({
                    loading: false,
                    queryData
                });
            }
        } catch (e) {
            console.log('query', e);
        }
    }

    handlePlantDataExport = async () => {
        const {
            queryData
        } = this.state;
        let tblData = [];
        if (queryData && queryData instanceof Array && queryData.length === 2) {
            let unPlantNum = Number(queryData[0]);
            let plantNum = Number(queryData[1]);
            let obj = {};
            obj['已栽植'] = plantNum;
            obj['未栽植'] = unPlantNum;
            tblData.push(obj);
            let _headers = ['已栽植', '未栽植'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `栽植量.xlsx`);
        } else {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
        }
    }
}

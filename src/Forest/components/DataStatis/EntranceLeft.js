import React, { Component } from 'react';
import { DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
var echarts = require('echarts');
const { RangePicker } = DatePicker;

export default class EntranceLeft extends Component {
    constructor (props) {
        super(props);
        this.state = {
            section: '',
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            loading: false
        };
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
            // queryTime
        } = this.props;
        if (leftkeycode !== prevProps.leftkeycode) {
            this.query();
        }
        // if (queryTime && queryTime !== prevProps.queryTime) {
        //     await this.query();
        // }
    }

    componentDidMount () {
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
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
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                },
                {
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: [
                {
                    name: '苗木进场总数',
                    type: 'bar',
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [{ type: 'average', name: '平均值' }]
                    }
                }
            ]
        };
        myChart1.setOption(option1);
    }
    // 苗木进场总数
    async query () {
        const {
            platform: { tree = {} },
            leftkeycode,
            actions: { gettreeEntrance }
        } = this.props;
        const { etime, stime } = this.state;
        if (!leftkeycode) {
            return;
        }
        let sectionData = (tree && tree.bigTreeList) || [];
        let postdata = {};
        this.setState({
            loading: true
        });

        postdata.no = leftkeycode;
        postdata.stime = stime;
        postdata.etime = etime;
        let rst = await gettreeEntrance({}, postdata);
        let units = [];
        let data = [];

        if (rst && rst instanceof Array) {
            sectionData.map(project => {
                // 获取正确的项目
                if (leftkeycode.indexOf(project.No) > -1) {
                    // 获取项目下的标段
                    let sections = project.children;
                    // 将各个标段的数据设置为0
                    sections.map((section, index) => {
                        data[index] = 0;
                        units.push(section.Name);
                    });

                    rst.map(item => {
                        if (item && item.Section) {
                            sections.map((section, index) => {
                                if (item.Section === section.No) {
                                    data[index] = data[index] + item.Num;
                                }
                            });
                        }
                    });
                }
            });
        }
        let myChart1 = echarts.init(document.getElementById('king'));
        let option1 = {
            xAxis: [
                {
                    data: units
                }
            ],
            series: [
                {
                    data: data
                }
            ]
        };
        myChart1.setOption(option1);
        this.setState({
            loading: false
        });
    }

    render () {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Cards search={this.searchRender()} title='苗木进场总数'>
                        <div
                            id='king'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Spin>
            </div>
        );
    }

    searchRender () {
        return (
            <div>
                <span>选择时间：</span>
                <RangePicker
                    style={{ verticalAlign: 'middle' }}
                    defaultValue={[
                        moment(this.state.stime, 'YYYY/MM/DD 00:00:00'),
                        moment(this.state.etime, 'YYYY/MM/DD 23:59:59')
                    ]}
                    showTime={{ format: 'HH:mm:ss' }}
                    format={'YYYY/MM/DD HH:mm:ss'}
                    onChange={this.datepick.bind(this)}
                    onOk={this.datepick.bind(this)}
                />
            </div>
        );
    }

    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY/MM/DD HH:mm:ss')
                : '',
            etime: value[1]
                ? moment(value[1]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        }, () => {
            this.query();
        });
    }
}
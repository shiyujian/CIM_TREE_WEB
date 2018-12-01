import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import { DatePicker, Spin } from 'antd';
import { Cards, SumTotal, DateImg } from '../../components';
import moment from 'moment';

export default class MiddleTop extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59')
        };
    }

    componentDidMount () {
        var myChart2 = echarts.init(document.getElementById('middleTop'));
        myChart2.on('click', function (params) {
            that.onsectionchange(params.name);
        });
        let option2 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category'
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '种植数',
                    axisLabel: {
                        formatter: '{value} 棵'
                    }
                }
            ],
            series: []
        };
        myChart2.setOption(option2);
        this.query();
    }

    componentDidUpdate (prevProps, prevState) {
        const { etime, stime } = this.state;
        const { leftkeycode } = this.props;
        if (
            leftkeycode != prevProps.leftkeycode ||
            etime != prevState.etime ||
            stime != prevState.stime
        ) {
            this.query();
        }
    }

    async query () {
        const {
            actions: {    
                getCountSection
            },
            leftkeycode,
            platform: { tree = {} }
        } = this.props;
        const { etime, stime } = this.state;
        let sectionData = (tree && tree.bigTreeList) || [];
        let param = {};

        param.no = leftkeycode;
        // param.stime = stime;
        param.etime = etime;
        this.setState({ loading: true });

        let rst = await getCountSection({}, param);

        console.log('MiddleTopMiddleTopMiddleTop', rst);

        let units = ['一标段', '二标段', '三标段', '四标段', '五标段'];

        let complete = [];
        let unComplete = [];
        let label = [];

        if (rst && rst instanceof Array) {
            rst.map(item => {
                complete.push(item.Complete);
                unComplete.push(item.UnComplete);
                sectionData.map(project => {
                    // 获取正确的项目
                    if (leftkeycode.indexOf(project.No) > -1) {
                        // 获取项目下的标段
                        let sections = project.children;
                        sections.map((section, index) => {
                            if (section.No === item.Label) {
                                label.push(section.Name);
                            }
                        });
                    }
                });
            });
        }

        let myChart2 = echarts.init(document.getElementById('middleTop'));
        let options2 = {
            legend: {
                data: ['未种植', '已种植']
            },
            xAxis: [
                {
                    data: label.length > 0 ? label : units
                }
            ],
            series: [
                {
                    name: '未种植',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: unComplete
                },
                {
                    name: '已种植',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    data: complete
                }
            ]
        };
        myChart2.setOption(options2);
        this.setState({ loading: false });
    }

    render () {
        // todo 苗木种植强度分析

        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search()} title='各标段种植进度分析'>
                    <div
                        id='middleTop'
                        style={{ width: '100%', height: '260px' }}
                    />
                </Cards>
            </Spin>
        );
    }
    search () {
        return (
            <div>
                <span>截止时间：</span>
                <DatePicker
                    style={{ verticalAlign: 'middle' }}
                    defaultValue={moment(
                        this.state.etime,
                        'YYYY/MM/DD HH:mm:ss'
                    )}
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
            etime: value ? moment(value).format('YYYY/MM/DD') : ''
        });
    }
}

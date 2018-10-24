import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import { Select, Row, Col, Radio, Card, DatePicker, Spin } from 'antd';
import {
    SCHEDULRPROJECT
} from '../../../_platform/api';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
export default class Warning extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime1: moment().format('2018/01/01'),
            etime1: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            project: '便道施工',
            departOptions: '',
            data: [
                { value: 0, name: '一标段', selected: true },
                { value: 0, name: '二标段' },
                { value: 0, name: '三标段' },
                { value: 0, name: '四标段' },
                { value: 0, name: '五标段' },
                { value: 100, name: '未完成' }
            ],
            loading: false
        };
    }

    componentDidMount () {
        const myChart = echarts.init(
            document.getElementById('AccumulativeCompletion')
        );

        let optionLine = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                right: 'right'
                // data: ['-', '-', '-', '-', '-']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '40%',
                    data: this.state.data,
                    selectedMode: 'single',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: true
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#000',
                                // color: '#000',
                                fontSize: '12px'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#000',
                                // color: '#000',
                                fontSize: '12px'
                            }
                        }
                    }
                }
            ],
            color: [
                '#0fbc7a',
                '#fca700',
                '#772fbf',
                '#11d0d8',
                '#0e8ed7',
                '#ff0033'
            ]
        };
        myChart.setOption(optionLine);
    }

    render () {
        // todo 累计完成工程量
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        截止日期：
                        <DatePicker
                            style={{ textAlign: 'center' }}
                            showTime
                            defaultValue={moment(
                                this.state.etime1,
                                'YYYY/MM/DD'
                            )}
                            format={'YYYY/MM/DD'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepickok.bind(this)}
                        />
                        <div
                            id='AccumulativeCompletion'
                            style={{ width: '100%', height: '340px' }}
                        />
                        <Select
                            placeholder='请选择部门'
                            style={{ width: '120px' }}
                            notFoundContent='暂无数据'
                            defaultValue='便道施工'
                            onSelect={this.onDepartments.bind(this)}
                        >
                            {SCHEDULRPROJECT.map(rst => {
                                return (
                                    <Option
                                        key={rst.id}
                                        value={rst.name}
                                        title={rst.name}
                                    >
                                        {rst.name}
                                    </Option>
                                );
                            })}
                        </Select>
                        <span>强度分析</span>
                    </Card>
                </Spin>
            </div>
        );
    }
    datepick () {}
    datepickok (value) {
        this.setState({
            etime1: value ? moment(value).format('YYYY/MM/DD') : ''
        });

        const {
            actions: { progressstat4pie }
        } = this.props;
        progressstat4pie(
            {},
            { project: this.state.project, etime: this.state.etime1 }
        ).then(rst => {
            this.getdata(rst);
        });
    }

    onDepartments (value) {
        console.log('LeftBottom', value);
        const {
            actions: { progressstat4pie }
        } = this.props;
        this.setState({
            project: value
        });
        progressstat4pie({}, { project: value, etime: this.state.etime1 }).then(
            rst => {
                this.getdata(rst);
            }
        );
    }

    getdata (rst) {
        console.log(rst);
    }
}

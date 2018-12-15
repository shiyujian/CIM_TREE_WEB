import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, Card, DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
const Option = Select.Option;

export default class GroupLeft extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            section: 'P009-01-01',
            sectionoption: []
        };
    }

    componentDidMount () {
        var myChart3 = echarts.init(document.getElementById('GroupLeft'));
        let option3 = {
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
        myChart3.setOption(option3);
        this.getSectionoption();
        // this.query();
    }

    getSectionoption () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let sectionoption = [];

        sectionData.map(project => {
            // 获取正确的项目
            if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                let sections = project.children;
                sections.map((section, index) => {
                    sectionoption.push(
                        <Option key={section.No} value={section.No}>
                            {section.Name}
                        </Option>
                    );
                });
                this.setState({
                    section: sections && sections[0] && sections[0].No
                });
            }
        });
        this.setState({
            sectionoption
        });
    }

    componentDidUpdate (prevProps, prevState) {
        const { etime, section, stime } = this.state;
        const { leftkeycode } = this.props;
        if (leftkeycode != prevProps.leftkeycode) {
            this.getSectionoption();
        }
        if (section != prevState.section) {
            this.query();
        }
        if (etime != prevState.etime || stime != prevState.stime) {
            this.query();
        }
    }

    async query () {
        const {
            actions: {
                getCountSmall
            }
        } = this.props;
        const { stime, etime, section } = this.state;
        let param = {};

        param.section = section;
        // param.stime = stime;
        param.etime = etime;
        this.setState({ loading: true });

        let rst = await getCountSmall({}, param);

        let units = ['1小班', '2小班', '3小班', '4小班', '5小班'];

        let complete = [];
        let unComplete = [];
        let label = [];
        let total = [];

        if (rst && rst instanceof Array) {
            rst.map(item => {
                complete.push(item.Complete);
                unComplete.push(item.UnComplete);
                label.push(item.Label + '号小班');
            });
        }

        let myChart3 = echarts.init(document.getElementById('GroupLeft'));
        let options3 = {
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
        myChart3.setOption(options3);
        this.setState({ loading: false });
    }

    render () {
        // todo 苗木种植强度分析

        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各小班种植进度分析'
                >
                    <Cards search={this.search()} title={this.title()}>
                        <div
                            id='GroupLeft'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>
            </Spin>
        );
    }
    title () {
        const { section, sectionoption } = this.state;
        return (
            <div>
                <Select
                    value={section}
                    onSelect={this.onsectionchange.bind(this)}
                    style={{ width: '80px' }}
                >
                    {sectionoption}
                </Select>
                <span>各小班种植进度分析</span>
            </div>
        );
    }
    onsectionchange (value) {
        this.setState({
            section: value
        });
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

import React, {Component} from 'react';
import { DatePicker, Tabs, Spin, Notification } from 'antd';
import moment from 'moment';
import './index.less';
import echarts from 'echarts';
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

export default class DataOverviewByUser extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            etime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            loading: false,
            dateType: 'week',
            tabKey: 'NewUser'
        };
        this.dateTypeList = [
            {
                type: 'week',
                value: '7天'
            },
            {
                type: 'twoWeeks',
                value: '14天'
            },
            {
                type: 'month',
                value: '30天'
            }
        ];
    }

    componentDidMount = async () => {
        await this.query();
    }

    render () {
        const {
            dateType,
            loading
        } = this.state;
        return (
            <div>
                <div style={{margin: 5}}>
                    <RangePicker
                        style={{ verticalAlign: 'middle' }}
                        value={[
                            moment(this.state.stime, 'YYYY-MM-DD'),
                            moment(this.state.etime, 'YYYY-MM-DD')
                        ]}
                        format={'YYYY-MM-DD'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    />
                    {
                        this.dateTypeList.map((data) => {
                            if (dateType === data.type) {
                                return (<span style={{marginLeft: 15}} key={data.type}>
                                    {data.value}
                                </span>);
                            } else {
                                return (
                                    <a style={{marginLeft: 15}} key={data.type}
                                        onClick={this.handleChangeDateType.bind(this, data.type)}
                                    >
                                        {data.value}
                                    </a>
                                );
                            }
                        })
                    }
                </div>
                <div style={{margin: 5}}>
                    <Tabs tabBarGutter='10' onChange={this.handleTabChangele.bind(this)}>
                        <TabPane tab='新增用户' key='NewUser'>
                            <Spin spinning={loading}>
                                <div
                                    id='echartsNewUser'
                                    style={{ width: '100%', height: '300px' }}
                                />
                            </Spin>
                        </TabPane>
                        <TabPane tab='活跃用户' key='ActiveUser'>
                            <Spin spinning={loading}>
                                <div
                                    id='echartsActiveUser'
                                    style={{ width: '100%', height: '300px' }}
                                />
                            </Spin>
                        </TabPane>
                        <TabPane tab='启动次数' key='SessionCount'>
                            <Spin spinning={loading}>
                                <div
                                    id='echartsSessionCount'
                                    style={{ width: '100%', height: '300px' }}
                                />
                            </Spin>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
    // 切换标签页
    handleTabChangele = async (key) => {
        this.setState({
            tabKey: key
        });
    }
    // 切换时间类型
    handleChangeDateType = (type) => {
        if (type === 'week') {
            this.setState({
                stime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                etime: moment().subtract(1, 'days').format('YYYY-MM-DD')
            });
        } else if (type === 'twoWeeks') {
            this.setState({
                stime: moment().subtract(14, 'days').format('YYYY-MM-DD'),
                etime: moment().subtract(1, 'days').format('YYYY-MM-DD')
            });
        } else if (type === 'month') {
            this.setState({
                stime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                etime: moment().subtract(1, 'days').format('YYYY-MM-DD')
            });
        }
        this.setState({
            dateType: type
        });
    }
    // 选择时间
    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD')
                : '',
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD')
                : ''
        });
    }
    // 根据state判断是否需要搜索
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            stime,
            etime,
            tabKey
        } = this.state;
        if ((stime && stime !== prevState.stime) || (etime && etime !== prevState.etime)) {
            this.query();
        }
        if (tabKey && tabKey !== prevState.tabKey) {
            this.setEcharts();
        }
    }
    // 搜索数据
    query = async () => {
        const {
            stime,
            etime,
            tabKey
        } = this.state;
        const {
            actions: {
                getTencentOffLineUser
            }
        } = this.props;
        try {
            console.log('stime', stime);
            console.log('etime', etime);
            console.log('tabKey', tabKey);
            this.setState({
                loading: true
            });
            let postData = {
                startdate: moment(stime).format('YYYY-MM-DD'),
                enddate: moment(etime).format('YYYY-MM-DD')
            };
            let data = await getTencentOffLineUser({}, postData);
            if (data && data.ret_msg && data.ret_msg === 'success') {
                console.log('data', data);
                let content = data.ret_data;
                console.log('data', data);
                this.setState({
                    content
                }, () => {
                    this.setEcharts();
                });
            } else {
                Notification.error({
                    message: '查询数据失败',
                    duration: 3
                });
                return;
            }
        } catch (e) {
            console.log('query', e);
        }
    }

    setEcharts = () => {
        const {
            content,
            tabKey,
            stime,
            etime
        } = this.state;
        let start = new Date(stime).getTime();
        let end = new Date(etime).getTime();
        let dateList = [];
        for (;start <= end; start += 86400000) {
            let tmp = new Date(start);
            dateList.push(moment(tmp).format('YYYY-MM-DD'));
        }
        console.log('dateList', dateList);
        if (tabKey === 'NewUser') {
            let yGrandData = [];
            for (let i in content) {
                yGrandData.push(content[i].NewUser);
            }
            const myChart = echarts.init(document.getElementById('echartsNewUser'));
            let optionLine = {
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
                xAxis: [
                    {
                        data: dateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '新增用户',
                        type: 'line',
                        data: yGrandData
                    }
                ]
            };
            myChart.setOption(optionLine);
            this.setState({
                loading: false
            });
        } else if (tabKey === 'ActiveUser') {
            let yGrandData = [];
            for (let i in content) {
                yGrandData.push(content[i].ActiveUser);
            }
            const myChart = echarts.init(document.getElementById('echartsActiveUser'));
            let optionLine = {
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
                xAxis: [
                    {
                        data: dateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '活跃用户',
                        type: 'line',
                        data: yGrandData
                    }
                ]
            };
            myChart.setOption(optionLine);
            this.setState({
                loading: false
            });
        } else if (tabKey === 'SessionCount') {
            let yGrandData = [];
            for (let i in content) {
                yGrandData.push(content[i].SessionCount);
            }
            const myChart = echarts.init(document.getElementById('echartsSessionCount'));
            let optionLine = {
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
                xAxis: [
                    {
                        data: dateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '启动次数',
                        type: 'line',
                        data: yGrandData
                    }
                ]
            };
            myChart.setOption(optionLine);
            this.setState({
                loading: false
            });
        }
    }
}

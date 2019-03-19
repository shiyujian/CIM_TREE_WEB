import React, {Component} from 'react';
import { DatePicker, Tabs, Spin, Notification } from 'antd';
import moment from 'moment';
// import './index.less';
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
            tabKey: 'NewUser',
            newUserContent: [],
            activityUserContent: []
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
                        <TabPane tab='新增账号' key='NewUser'>
                            <Spin spinning={loading}>
                                <div
                                    id='echartsNewUser'
                                    style={{ width: '100%', height: '300px' }}
                                />
                            </Spin>
                        </TabPane>
                        <TabPane tab='活跃账号' key='ActiveUser'>
                            <Spin spinning={loading}>
                                <div
                                    id='echartsActiveUser'
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
            this.query();
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
                getNewUserStat,
                getActivityUserStat
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            if (tabKey === 'NewUser') {
                let postData = {
                    stime: moment(stime).format('YYYY-MM-DD'),
                    etime: moment(etime).format('YYYY-MM-DD')
                };

                let newUserContent = await getNewUserStat({}, postData);
                console.log('newUserContent', newUserContent);
                if (newUserContent && newUserContent instanceof Array && newUserContent.length > 0) {
                    this.setState({
                        newUserContent
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
            } else if (tabKey === 'ActiveUser') {
                let postData = {
                    stime: moment(stime).format('YYYY-MM-DD'),
                    etime: moment(etime).format('YYYY-MM-DD')
                };

                let activityUserContent = await getActivityUserStat({}, postData);
                console.log('activityUserContent', activityUserContent);
                if (activityUserContent && activityUserContent instanceof Array && activityUserContent.length > 0) {
                    this.setState({
                        activityUserContent
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
            }
        } catch (e) {
            console.log('query', e);
        }
    }

    setEcharts = () => {
        const {
            newUserContent,
            activityUserContent,
            tabKey,
            stime,
            etime
        } = this.state;
        if (tabKey === 'NewUser') {
            let start = new Date(stime).getTime();
            let end = new Date(etime).getTime();
            let dateList = [];
            for (;start <= end; start += 86400000) {
                let tmp = new Date(start);
                dateList.push(moment(tmp).format('YYYY-MM-DD'));
            }
            let yGrandData = [];
            for (let i = 0; i < newUserContent.length; i++) {
                dateList.map((date) => {
                    if (moment(date).format('YYYY/MM/DD 23:00:00') === moment(newUserContent[i].Day).format('YYYY/MM/DD HH:mm:ss')) {
                        yGrandData.push(newUserContent[i].Num);
                    }
                });
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
            let dateList = [];
            for (let i = 0; i < activityUserContent.length; i++) {
                dateList.push(activityUserContent[i].Day);
                yGrandData.push(activityUserContent[i].Num);
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
        }
    }
}

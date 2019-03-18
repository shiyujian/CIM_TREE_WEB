import React, {Component} from 'react';
import { Card, Row, Col, DatePicker, Spin } from 'antd';
import moment from 'moment';
import echarts from 'echarts';
const gridStyle = {
    width: '25%',
    textAlign: 'center'
};
const basicDataStyle = {
    fontSize: 26,
    fontWeight: 'bold'
};
const dateFormat = 'YYYY-MM-DD';
export default class VehicleAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            enterDate: moment().format(dateFormat), // 进场截至时间
            returnDate: moment().format(dateFormat), // 退苗截至时间
            spinningEnter: false,
            spinningReturn: false,
            totalStage: 0, // 车辆累计出圃数量
            totalEnter: 0, // 车辆累计进场数量
            todayStage: 0, // 车辆今日出圃数量
            todayEnter: 0 // 车辆今日进场数量
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.handleDateEnter = this.handleDateEnter.bind(this); // 更改进场截至时间
        this.handleDateReturn = this.handleDateReturn.bind(this); // 更改进场截至时间
    }
    componentDidMount = async () => {

    }
    componentWillReceiveProps (nextProps) {
        if (this.props.sectionList !== nextProps.sectionList && this.props.leftkeycode !== nextProps.leftkeycode) {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            this.getBasicData();
            this.renderEnter();
            this.renderReturn();
        }
    }
    // 获取关键数据
    getBasicData () {
        const { getCarpackstat } = this.props.actions;
        // 不分项目出圃，进场数量
        getCarpackstat({}, {}).then(rep => {
            let totalEnter = rep.TotalNum - rep.BackNum;
            let todayEnter = rep.TodayTotalNum - rep.TodayBackNum;
            this.setState({
                totalStage: rep.TotalNum, // 车辆累计出圃数量
                totalEnter, // 车辆累计进场数量
                todayStage: rep.TodayTotalNum,
                todayEnter
            });
        });
    }

    render () {
        const { totalStage, totalEnter, todayStage, todayEnter, enterDate, returnDate, spinningEnter, spinningReturn } = this.state;
        return (
            <div>
                <h2>实时数据{moment().format('HH:mm:ss')}</h2>
                <Card title='关键数据'>
                    <Card.Grid style={gridStyle}>
                        <h3>车辆累计出圃数量</h3>
                        <div style={basicDataStyle}>{totalStage}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>车辆累计进场数量</h3>
                        <div style={basicDataStyle}>{totalEnter}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>车辆今日出圃数量</h3>
                        <div style={basicDataStyle}>{todayStage}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>车辆今日进场数量</h3>
                        <div style={basicDataStyle}>{todayEnter}</div>
                    </Card.Grid>
                </Card>
                <h2>进场及退苗统计</h2>
                <div style={{ background: '#ECECEC', padding: '30px', height: 550 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title='各标段进场车辆统计' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment(enterDate, dateFormat)} format={dateFormat} onChange={this.handleDateEnter.bind(this)} /></span>}>
                                <Spin spinning={spinningEnter}>
                                    <div
                                        id='enterStatistics'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title='各标段退苗车辆统计' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment(returnDate, dateFormat)} format={dateFormat} onChange={this.handleDateReturn.bind(this)} /></span>}>
                                <Spin spinning={spinningReturn}>
                                    <div
                                        id='returnStatistics'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
    handleDateEnter (date, dateString) {
        console.log(dateString, 'dateString');
        this.setState({
            enterDate: dateString
        }, () => {
            this.renderEnter();
        });
    }
    handleDateReturn (date, dateString) {
        this.setState({
            returnDate: dateString
        }, () => {
            this.renderReturn();
        });
    }
    renderEnter () {
        const { enterDate } = this.state;
        const { getCarinstat } = this.props.actions;
        let xAxisArr = [];
        let yAxisArr = [];
        this.setState({
            spinningEnter: true
        });
        getCarinstat({}, {
            section: this.leftkeycode,
            stime: '',
            etime: enterDate
        }).then(rep => {
            this.sectionList.map(item => {
                xAxisArr.push(item.Name);
                let sectionSum = 0;
                rep.map(record => {
                    if (item.No === record.Section) {
                        sectionSum += record.Num;
                    }
                });
                yAxisArr.push(sectionSum);
            });
            console.log('yAxisArr', yAxisArr);
            let myChart = echarts.init(document.getElementById('enterStatistics'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisArr
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: yAxisArr,
                    type: 'bar'
                }]
            };
            myChart.setOption(option);
            this.setState({
                spinningEnter: false
            });
        });
    }
    renderReturn () {
        const { getCarbackstat } = this.props.actions;
        const { enterDate } = this.state;
        let xAxisArr = [];
        let yAxisArr = [];
        this.setState({
            spinningReturn: true
        });
        getCarbackstat({}, {
            section: this.leftkeycode,
            stime: '',
            etime: enterDate
        }).then(rep => {
            console.log('getCarbackstat', rep);
            this.sectionList.map(item => {
                xAxisArr.push(item.Name);
                let SectionSum = 0;
                rep.map(record => {
                    if (item.No === record.Section) {
                        SectionSum = record.Num;
                    }
                });
                yAxisArr.push(SectionSum);
            });
            console.log(yAxisArr);
            let myChart = echarts.init(document.getElementById('returnStatistics'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisArr
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: yAxisArr,
                    type: 'bar'
                }]
            };
            myChart.setOption(option);
            this.setState({
                spinningReturn: false
            });
        });
    }
}

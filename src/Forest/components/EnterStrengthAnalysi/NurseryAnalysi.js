import React, {Component} from 'react';
import { Card, Row, Col, DatePicker, Spin } from 'antd';
import moment from 'moment';
import echarts from 'echarts';
const gridStyle = {
    width: '25%',
    textAlign: 'center'
};
const dateFormat = 'YYYY-MM-DD';
export default class NurseryAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            enterDate: moment().format(dateFormat), // 进场截至时间
            returnDate: moment().format(dateFormat), // 退苗截至时间
            spinningEnter: false,
            spinningReturn: false,
            totalStage: 0, // 苗木累计出圃数量
            totalEnter: 0, // 苗圃累计进场数量
            todayStage: 0, // 苗木今日出圃数量
            todayEnter: 0 // 苗木今日进场数量
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
        
    }

    render () {
        const { totalStage, totalEnter, todayStage, todayEnter, enterDate, returnDate, spinningEnter, spinningReturn } = this.state;
        return (
            <div>
                <h2>实时数据{moment().format('HH:mm:ss')}</h2>
                <Card title='关键数据'>
                    <Card.Grid style={gridStyle}>
                        <h3>苗木累计出圃数量</h3>
                        <div>{totalStage}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>苗圃累计进场数量</h3>
                        <div>{totalEnter}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>苗木今日出圃数量</h3>
                        <div>{todayStage}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>苗木今日进场数量</h3>
                        <div>{todayEnter}</div>
                    </Card.Grid>
                </Card>
                <h2>进场及退苗统计</h2>
                <div style={{ background: '#ECECEC', padding: '30px', height: 550 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title='各标段进场苗木统计' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment(enterDate, dateFormat)} format={dateFormat} onChange={this.handleDateEnter.bind(this)} /></span>}>
                                <Spin spinning={spinningEnter}>
                                    <div
                                        id='enterStatistics'
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </Spin>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title='各标段进场退苗统计' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment(returnDate, dateFormat)} format={dateFormat} onChange={this.handleDateReturn.bind(this)} /></span>}>
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
        const { getNurseryinstat } = this.props.actions;
        let xAxisArr = [];
        let yAxisArr = [];
        this.setState({
            spinningEnter: true
        });
        getNurseryinstat({}, {
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
        const { returnDate } = this.state;
        const { getNurserybackstat } = this.props.actions;
        let xAxisArr = [];
        let yAxisArr = [];
        this.setState({
            spinningReturn: true
        });
        getNurserybackstat({}, {
            section: this.leftkeycode,
            stime: '',
            etime: returnDate
        }).then(rep => {
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
            console.log(yAxisArr, 'yAxisArr');
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

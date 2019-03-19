import React, {Component} from 'react';
import { Row, Col, Card, DatePicker, Spin } from 'antd';
import moment from 'moment';
import echarts from 'echarts';
import './NurseryGlobal.less';

export default class NurseryGlobal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            nurseryBaseNum: 0,
            supplierNum: 0,
            nurseryBaseUserNum: 0,
            supplierUserNum: 0,
            nurseryEnterDate: moment().format('YYYY-MM-DD'), // 苗圃进场日期
            supplierEnterDate: moment().format('YYYY-MM-DD'), // 供应商进场日期
            nurseryBackDate: moment().format('YYYY-MM-DD'), // 苗圃退苗日期
            supplierBackDate: moment().format('YYYY-MM-DD'), // 供应商退苗日期
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false

        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getNurseryBaseStat
            },
            leftkeycode
        } = this.props;
        let myChart = echarts.init(document.getElementById('nurseryEnter'));
        let myChart1 = echarts.init(document.getElementById('supplierEnter'));
        let myChart2 = echarts.init(document.getElementById('nurseryBack'));
        let myChart3 = echarts.init(document.getElementById('supplierBack'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: []
                // axisLabel: {
                //     interval: 0,
                //     rotate: 40
                // }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [],
                type: 'bar'
            }]
        };
        myChart.setOption(option);
        myChart1.setOption(option);
        myChart2.setOption(option);
        myChart3.setOption(option);
        let data = await getNurseryBaseStat();
        let nurseryBaseNum = (data && data.NurseryBaseNum) || 0;
        let supplierNum = (data && data.SupplierNum) || 0;
        let nurseryBaseUserNum = (data && data.NurseryBaseUserNum) || 0;
        let supplierUserNum = (data && data.SupplierUserNum) || 0;
        this.setState({
            nurseryBaseNum,
            supplierNum,
            nurseryBaseUserNum,
            supplierUserNum
        });
        if (leftkeycode) {
            this.queryNurseryEnter();
            this.querySupplierEnter();
            this.queryNurseryBackDate();
            this.querySupplierBack();
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.queryNurseryEnter();
            this.querySupplierEnter();
            this.queryNurseryBackDate();
            this.querySupplierBack();
        }
    }

    render () {
        const {
            nurseryBaseNum,
            supplierNum,
            nurseryBaseUserNum,
            supplierUserNum
        } = this.state;
        return (
            <div>
                <div>
                    <h2>实时数据{moment().format('HH:mm:ss')}</h2>
                </div>
                <div className='NurseryGlobal-mod_basic'>
                    <div className='NurseryGlobal-mod-title'>
                        <h3 className='NurseryGlobal-mod-title-h3'>关键指标</h3>
                    </div>
                    <div className='NurseryGlobal-table-content'>
                        <table className='NurseryGlobal-table-layout'>
                            <tr>
                                <td className='NurseryGlobal-table-border'>
                                    <div className='NurseryGlobal-table-pad'>
                                        <div className='NurseryGlobal-table-title'>
                                        苗圃基地账户累计注册数量
                                        </div>
                                        <div className='NurseryGlobal-table-num'>
                                            {nurseryBaseNum}
                                        </div>
                                    </div>
                                </td>
                                <td className='NurseryGlobal-table-border'>
                                    <div className='NurseryGlobal-table-pad'>
                                        <div className='NurseryGlobal-table-title'>
                                        供应商企业账户累计注册数量
                                        </div>
                                        <div className='NurseryGlobal-table-num'>
                                            {supplierNum}
                                        </div>
                                    </div>
                                </td>
                                {/* <td className='NurseryGlobal-table-border'>
                                    <div className='NurseryGlobal-table-pad'>
                                        <div className='NurseryGlobal-table-title'>
                                        苗圃个人账户累计注册数量
                                        </div>
                                        <div className='NurseryGlobal-table-num'>
                                            {nurseryBaseUserNum}
                                        </div>
                                    </div>
                                </td>
                                <td className='NurseryGlobal-table-border'>
                                    <div className='NurseryGlobal-table-pad'>
                                        <div className='NurseryGlobal-table-title'>
                                        供应商个人账户累计注册数量
                                        </div>
                                        <div className='NurseryGlobal-table-num'>
                                            {supplierUserNum}
                                        </div>
                                    </div>
                                </td> */}
                            </tr>
                        </table>
                    </div>
                </div>
                <div style={{marginTop: 15}}>
                    <h2>进场率排行榜</h2>
                </div>
                <div>
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Spin spinning={this.state.loading1} >
                                    <Card title='苗圃进场率（前五名）'
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleNurseryEnterDate.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='nurseryEnter'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Spin>
                            </Col>
                            <Col span={12}>
                                <Spin spinning={this.state.loading2} >
                                    <Card title='供应商进场率（前五名）'
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleSupplierEnterDate.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='supplierEnter'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Spin>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div style={{marginTop: 15}}>
                    <h2>退苗率排行榜</h2>
                </div>
                <div>
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Spin spinning={this.state.loading3} >
                                    <Card title='苗圃退苗率（前五名）'
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleNurseryBackDate.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='nurseryBack'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Spin>
                            </Col>
                            <Col span={12}>
                                <Spin spinning={this.state.loading4} >
                                    <Card title='供应商退苗率（前五名）'
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleSupplierBackDate.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='supplierBack'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Spin>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
    handleNurseryEnterDate (date, dateString) {
        this.setState({
            nurseryEnterDate: dateString
        }, () => {
            this.queryNurseryEnter();
        });
    }
    queryNurseryEnter = async () => {
        const { nurseryEnterDate } = this.state;
        const {
            actions: {
                getNurseryEnterStat
            },
            leftkeycode
        } = this.props;
        try {
            this.setState({
                loading1: true
            });
            let postData = {
                section: leftkeycode,
                stime: '',
                etime: moment(nurseryEnterDate).format('YYYY-MM-DD')
            };
            let dataNurseryEnter = await getNurseryEnterStat({}, postData);
            let xAxisArr = [];
            let yGrandData = [];
            let order = 5;
            if (dataNurseryEnter && dataNurseryEnter instanceof Array && dataNurseryEnter.length > 0) {
                if (dataNurseryEnter.length <= 5) {
                    order = dataNurseryEnter.length;
                }
                for (let i = 0; i < order; i++) {
                    if (dataNurseryEnter[i] && dataNurseryEnter[i].Label && dataNurseryEnter[i].Label !== '0') {
                        xAxisArr.push(dataNurseryEnter[i].Label);
                        yGrandData.push(dataNurseryEnter[i].Num);
                    } else {
                        if (order < dataNurseryEnter.length) {
                            order++;
                        }
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('nurseryEnter'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: xAxisArr
                    // axisLabel: {
                    //     interval: 0,
                    //     rotate: 40
                    // }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: yGrandData,
                    type: 'bar',
                    name: '苗圃进场率'
                }]
            };
            myChart.setOption(option);
            this.setState({
                loading1: false
            });
        } catch (e) {
            console.log('queryNurseryBackDate', e);
        }
    }
    handleSupplierEnterDate (date, dateString) {
        this.setState({
            supplierEnterDate: dateString
        }, () => {
            this.querySupplierEnter();
        });
    }
    querySupplierEnter = async () => {
        const {
            actions: {
                getSupplierEnterStat
            },
            leftkeycode
        } = this.props;
        const {
            supplierEnterDate
        } = this.state;
        try {
            this.setState({
                loading2: true
            });
            let postData = {
                section: leftkeycode,
                stime: '',
                etime: moment(supplierEnterDate).format('YYYY-MM-DD')
            };
            let dataSupplierEnter = await getSupplierEnterStat({}, postData);
            let xAxisArr = [];
            let yGrandData = [];
            let order = 5;
            if (dataSupplierEnter && dataSupplierEnter instanceof Array && dataSupplierEnter.length > 0) {
                if (dataSupplierEnter.length <= 5) {
                    order = dataSupplierEnter.length;
                }
                for (let i = 0; i < order; i++) {
                    if (dataSupplierEnter[i] && dataSupplierEnter[i].Label && dataSupplierEnter[i].Label !== '0') {
                        xAxisArr.push(dataSupplierEnter[i].Label);
                        yGrandData.push(dataSupplierEnter[i].Num);
                    } else {
                        if (order < dataSupplierEnter.length) {
                            order++;
                        }
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('supplierEnter'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
                    data: yGrandData,
                    type: 'bar',
                    name: '供应商进场率'
                }]
            };
            myChart.setOption(option);
            this.setState({
                loading2: false
            });
        } catch (e) {
            console.log('queryNurseryBackDate', e);
        }
    }
    handleNurseryBackDate (date, dateString) {
        this.setState({
            nurseryBackDate: dateString
        }, () => {
            this.queryNurseryBackDate();
        });
    }
    queryNurseryBackDate = async () => {
        const {
            actions: {
                getNurseryBackStat
            },
            leftkeycode
        } = this.props;
        const {
            nurseryBackDate
        } = this.state;
        try {
            this.setState({
                loading3: true
            });
            let postData = {
                section: leftkeycode,
                stime: '',
                etime: moment(nurseryBackDate).format('YYYY-MM-DD')
            };
            let dataNurseryBack = await getNurseryBackStat({}, postData);

            let xAxisArr = [];
            let yGrandData = [];
            let order = 5;
            if (dataNurseryBack && dataNurseryBack instanceof Array && dataNurseryBack.length > 0) {
                if (dataNurseryBack.length <= 5) {
                    order = dataNurseryBack.length;
                }
                for (let i = 0; i < order; i++) {
                    if (dataNurseryBack[i] && dataNurseryBack[i].Label && dataNurseryBack[i].Label !== '0') {
                        xAxisArr.push(dataNurseryBack[i].Label);
                        yGrandData.push(dataNurseryBack[i].Num);
                    } else {
                        if (order < dataNurseryBack.length) {
                            order++;
                        }
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('nurseryBack'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
                    data: yGrandData,
                    type: 'bar',
                    name: '苗圃退苗率'
                }]
            };
            myChart.setOption(option);
            this.setState({
                loading3: false
            });
        } catch (e) {
            console.log('queryNurseryBackDate', e);
        }
    }
    handleSupplierBackDate (date, dateString) {
        this.setState({
            supplierBackDate: dateString
        }, () => {
            this.querySupplierBack();
        });
    }
    querySupplierBack = async () => {
        const {
            actions: {
                getSupplierBackStat
            },
            leftkeycode
        } = this.props;
        const {
            supplierBackDate
        } = this.state;
        try {
            this.setState({
                loading4: true
            });
            let postData = {
                section: leftkeycode,
                stime: '',
                etime: moment(supplierBackDate).format('YYYY-MM-DD')
            };
            let dataSupplierBack = await getSupplierBackStat({}, postData);
            let xAxisArr = [];
            let yGrandData = [];
            let order = 5;
            if (dataSupplierBack && dataSupplierBack instanceof Array && dataSupplierBack.length > 0) {
                if (dataSupplierBack.length <= 5) {
                    order = dataSupplierBack.length;
                }
                for (let i = 0; i < order; i++) {
                    if (dataSupplierBack[i] && dataSupplierBack[i].Label && dataSupplierBack[i].Label !== '0') {
                        xAxisArr.push(dataSupplierBack[i].Label);
                        yGrandData.push(dataSupplierBack[i].Num);
                    } else {
                        if (order < dataSupplierBack.length) {
                            order++;
                        }
                    }
                }
            }
            let myChart = echarts.init(document.getElementById('supplierBack'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
                    data: yGrandData,
                    type: 'bar',
                    name: '供应商退苗率'
                }]
            };
            myChart.setOption(option);
            this.setState({
                loading4: false
            });
        } catch (e) {
            console.log('queryNurseryBackDate', e);
        }
    }
}

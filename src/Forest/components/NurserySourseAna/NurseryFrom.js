import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin, Card, Notification } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
const Option = Select.Option;

class NurseryFrom extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.leftkeycode = '';
        this.state = {
            loading1: false,
            loading2: false,
            loading3: false,
            date1: moment().format('YYYY-MM-DD'),
            date2: moment().format('YYYY-MM-DD'),
            date3: moment().format('YYYY-MM-DD'),
            section: '',
            sectionOption: [],
            sectionsData: [],
            queryData: [], // 查找到的数据
            smallClassList: [] // 根据选择的项目标段获取的小班数据
        };
    }

    async componentDidMount() {
        const { leftkeycode } = this.props;
        if (leftkeycode) {
            await this.query1();
            await this.query2();
            await this.query3();
        }
    }

    async componentWillReceiveProps(prevProps, prevState) {
        if (prevProps.leftkeycode && this.leftkeycode !== prevProps.leftkeycode) {
            this.leftkeycode = prevProps.leftkeycode;
            await this.query1();
            await this.query2();
            await this.query3();
        }
    }
    render() {
        const {
            date1,
            date2,
            date3
        } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading1}>
                    <Card
                        title='全国苗源地统计排行榜'
                        extra={
                            <div>
                                <span>截止日期：</span>
                                <DatePicker onChange={this.onDateChange.bind(this, 1)}
                                    style={{ verticalAlign: 'middle', marginRight: 10, marginLeft: 10 }}
                                    defaultValue={moment(date1, 'YYYY-MM-DD')}
                                />
                                <a onClick={this.handleLocationDataExport.bind(this)}>
                                    导出
                            </a>
                            </div>
                        }
                    >
                        <div
                            id='LocationLeft1'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Card>
                </Spin>
                <Spin spinning={this.state.loading2}>
                    <Card
                        title='河北省苗源地统计排行榜'
                        extra={
                            <div>
                                <span>截止日期：</span>
                                <DatePicker onChange={this.onDateChange.bind(this, 2)}
                                    style={{ verticalAlign: 'middle', marginRight: 10, marginLeft: 10 }}
                                    defaultValue={moment(date2, 'YYYY-MM-DD')}
                                />
                                <a onClick={this.handleLocationDataExport.bind(this)}>
                                    导出
                            </a>
                            </div>
                        }
                    >
                        <div
                            id='LocationLeft2'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Card>
                </Spin>
                <Spin spinning={this.state.loading3}>
                    <Card
                        title='保定市苗源地统计排行榜'
                        extra={
                            <div>
                                <span>截止日期：</span>
                                <DatePicker onChange={this.onDateChange.bind(this, 3)}
                                    style={{ verticalAlign: 'middle', marginRight: 10, marginLeft: 10 }}
                                    defaultValue={moment(date3, 'YYYY-MM-DD')}
                                />
                                <a onClick={this.handleLocationDataExport.bind(this)}>
                                    导出
                            </a>
                            </div>
                        }
                    >
                        <div
                            id='LocationLeft3'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }

    async onDateChange(type, value) {
        if (type === 1) {
            this.setState({ date1: value._i })
            await this.query1();
        } else if (type === 2) {
            this.setState({ date2: value._i })
            await this.query2();
        } else if (type === 3) {
            this.setState({ date3: value._i })
            await this.query3();
        }
    }
    onSectionChange(value) {
        this.setState({
            section: value
        });
    }

    async query1() {
        const {
            actions: {
                getNurseryFromData
            },
        } = this.props;
        const { date1 } = this.state;
        this.setState({ loading1: true });
        let rst = await getNurseryFromData({ section: this.leftkeycode, etime: date1 });
        let aountArray = [];
        let addressArray = []
        if (rst instanceof Array) {
            rst.map(item => {
                aountArray.push(item.Num)
                addressArray.push(item.Label)
            })
        }
        let myChart3 = echarts.init(document.getElementById('LocationLeft1'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            xAxis: [
                {
                    data: addressArray
                }
            ],
            grid: {
                bottom: 50
            },
            dataZoom: [
                {
                    type: 'inside'
                }, {
                    type: 'slider'
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
            series: [
                {
                    name: '苗木总量',
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
                    data: aountArray
                }
            ]
        };
        myChart3.setOption(options3);
        this.setState({ loading1: false });
    }
    async query2() {
        const {
            actions: {
                getNurseryFromData
            },
        } = this.props;
        this.setState({ loading2: true });
        const { date2 } = this.state;
        let rst = await getNurseryFromData({ section: this.leftkeycode, regioncode: '13',etime: date2 });
        let aountArray = [];
        let addressArray = []
        if (rst instanceof Array) {
            rst.map(item => {
                aountArray.push(item.Num)
                addressArray.push(item.Label)
            })
        }
        let myChart3 = echarts.init(document.getElementById('LocationLeft2'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            xAxis: [
                {
                    data: addressArray
                }
            ],
            grid: {
                bottom: 50
            },
            dataZoom: [
                {
                    type: 'inside'
                }, {
                    type: 'slider'
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
            series: [
                {
                    name: '苗木总量',
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
                    data: aountArray
                }
            ]
        };
        myChart3.setOption(options3);
        this.setState({ loading2: false });
    }
    async query3() {
        const {
            actions: {
                getNurseryFromData
            },
        } = this.props;
        const { date3 } = this.state;
        this.setState({ loading3: true });
        let rst = await getNurseryFromData({ section: this.leftkeycode, regioncode: '1306', etime: date3 });
        let aountArray = [];
        let addressArray = []
        if (rst instanceof Array) {
            rst.map(item => {
                aountArray.push(item.Num)
                addressArray.push(item.Label)
            })
        }
        let myChart3 = echarts.init(document.getElementById('LocationLeft3'));
        let options3 = {
            legend: {
                data: ['总量']
            },
            xAxis: [
                {
                    data: addressArray
                }
            ],
            grid: {
                bottom: 50
            },
            dataZoom: [
                {
                    type: 'inside'
                }, {
                    type: 'slider'
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
            series: [
                {
                    name: '苗木总量',
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
                    data: aountArray
                }
            ]
        };
        myChart3.setOption(options3);
        this.setState({ loading3: false });
    }

    handleLocationDataExport = () => {
        const {
            queryData,
            smallClassList
        } = this.state;
        if (!(queryData && queryData instanceof Array && queryData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        smallClassList.map((smallClass) => {
            queryData.map((item, index) => {
                let No = smallClass.No;
                let NoArr = No.split('-');
                if (NoArr.length === 4) {
                    let smallClassNo = NoArr[0] + '-' + NoArr[1] + '-' + NoArr[3];
                    if (item.Label === smallClassNo) {
                        let obj = {};
                        obj['定位数'] = item.Num;
                        obj['小班'] = smallClass.Name;
                        tblData.push(obj);
                    }
                };
            });
        });
        let _headers = ['小班', '定位数'];
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
        XLSX.writeFile(wb, `各小班定位进度.xlsx`);
    }
}

export default NurseryFrom;

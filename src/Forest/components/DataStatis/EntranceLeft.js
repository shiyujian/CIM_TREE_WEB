import React, { Component } from 'react';
import { DatePicker, Spin, Card, Notification } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
import echarts from 'echarts';
const { RangePicker } = DatePicker;

export default class EntranceLeft extends Component {
    constructor (props) {
        super(props);
        this.state = {
            section: '',
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            queryData: [], // 查找到的数据
            loading: false
        };
    }

    componentDidMount () {
        let myChart1 = echarts.init(document.getElementById('EntranceLeft'));
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

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.query();
        }
    }

    render () {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card
                        title='苗木进场总数分析'
                        extra={
                            <div>
                                <a onClick={this.handleEntranceLeftDataExport.bind(this)}>
                                    导出
                                </a>
                            </div>
                        }
                    >
                        <Cards search={this.searchRender()} title='苗木进场总数'>
                            <div
                                id='EntranceLeft'
                                style={{ width: '100%', height: '400px' }}
                            />
                        </Cards>
                    </Card>
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
                        moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),
                        moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')
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

    // 苗木进场总数
    async query () {
        const {
            platform: { tree = {} },
            leftkeycode,
            actions: { getTreeEntrance }
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
        let queryData = [];
        let rst = await getTreeEntrance({}, postdata);
        let units = [];
        let data = [];

        if (rst && rst instanceof Array && rst.length > 0) {
            queryData = rst;
            sectionData.map(project => {
                // 获取正确的项目
                if (leftkeycode.indexOf(project.No) > -1) {
                    // 获取项目下的标段
                    let sections = project.children;
                    // 将各个标段的数据设置为0
                    sections.map((section, index) => {
                        data[index] = 0;
                        units.push(section.Name);
                        rst.map(item => {
                            if (item && item.Section) {
                                if (item.Section === section.No) {
                                    data[index] = data[index] + item.Num;
                                }
                            }
                        });
                    });
                }
            });
        }
        let myChart1 = echarts.init(document.getElementById('EntranceLeft'));
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
            loading: false,
            queryData
        });
    }

    handleEntranceLeftDataExport = async () => {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        const { queryData } = this.state;
        if (!(queryData && queryData instanceof Array && queryData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let sectionData = (tree && tree.bigTreeList) || [];
        let tblData = [];
        sectionData.map(project => {
            // 获取正确的项目
            if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                let sections = project.children;
                // 将各个标段的数据设置为0
                sections.map((section, index) => {
                    let obj = {};
                    obj['标段'] = section.Name;
                    obj['进场数'] = 0;
                    queryData.map(item => {
                        if (item && item.Section) {
                            if (item.Section === section.No) {
                                obj['进场数'] = obj['进场数'] + item.Num;
                            }
                        }
                    });
                    tblData.push(obj);
                });
            }
        });
        let _headers = ['标段', '进场数'];
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
        XLSX.writeFile(wb, `苗木进场总数分析.xlsx`);
    }
}

import React, { Component } from 'react';
import echarts from 'echarts';
import { DatePicker, Spin, Card } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
const { RangePicker } = DatePicker;

export default class PlantTotal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            queryData: []
        };
    }

    componentDidMount () {
        var myChart2 = echarts.init(document.getElementById('PlantRight'));
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
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (
            leftkeycode && leftkeycode !== prevProps.leftkeycode
        ) {
            await this.query();
        }
    }

    render () {
        // todo 各标段种植进度分析
        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各标段种植进度分析'
                    extra={
                        <div>
                            <a onClick={this.handlePlantDataExport.bind(this)}>
                                导出
                            </a>
                        </div>
                    }
                >
                    <Cards search={this.search()} title='各标段种植进度分析'>
                        <div
                            id='PlantRight'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>
            </Spin>
        );
    }
    search () {
        return (
            <div>
                <span>种植时间：</span>
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

    async query () {
        const {
            actions: {
                getCountSection
            },
            leftkeycode,
            platform: { tree = {} }
        } = this.props;
        const { stime, etime } = this.state;
        try {
            let sectionData = (tree && tree.bigTreeList) || [];
            let param = {};
            param.section = leftkeycode;
            param.stime = stime;
            param.etime = etime;
            this.setState({ loading: true });
            let rst = await getCountSection({}, param);

            let units = [];

            let complete = [];
            let unComplete = [];
            let label = [];
            let queryData = [];
            if (rst && rst instanceof Array && rst.length > 0) {
                queryData = rst;
                sectionData.map(project => {
                    rst.map(item => {
                        complete.push(item.Complete);
                        unComplete.push(item.UnComplete);
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

            let myChart2 = echarts.init(document.getElementById('PlantRight'));
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
            this.setState({
                loading: false,
                queryData
            });
        } catch (e) {
            console.log('PlantRight', e);
        }
    }

    handlePlantDataExport = async () => {
        const {
            queryData
        } = this.state;
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
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
            queryData.map(item => {
                // 获取正确的项目
                if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                    let sections = project.children;
                    sections.map((section, index) => {
                        if (section.No === item.Label) {
                            let obj = {};
                            obj['已种植'] = item.Complete;
                            obj['未种植'] = item.UnComplete;
                            obj['标段'] = section.Name;
                            tblData.push(obj);
                        }
                    });
                }
            });
        });
        let _headers = ['标段', '已种植', '未种植'];
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
        XLSX.writeFile(wb, `各标段种植进度分析.xlsx`);
    }
}

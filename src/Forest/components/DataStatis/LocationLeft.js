import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin, Card, Notification } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class LocationLeft extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment()
                .subtract(1, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            section: '',
            sectionOption: [],
            sectionsData: [],
            queryData: [], // 查找到的数据
            smallClassList: [] // 根据选择的项目标段获取的小班数据
        };
    }

    componentDidMount () {
        var myChart3 = echarts.init(document.getElementById('LocationLeft'));
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
    }

    getSectionOption () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.thinClassTree) || [];
        let sectionOption = [];
        sectionData.map(project => {
            // 获取正确的项目
            if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                let sections = project.children;
                sections.map((section, index) => {
                    sectionOption.push(
                        <Option key={section.No} value={section.No}>
                            {section.Name}
                        </Option>
                    );
                });
                this.setState({
                    section: sections && sections[0] && sections[0].No,
                    sectionsData: sections
                });
            }
        });
        this.setState({
            sectionOption
        });
    }

    componentDidUpdate (prevProps, prevState) {
        const { section } = this.state;
        const { leftkeycode } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.getSectionOption();
        }
        if (section && section !== prevState.section) {
            this.query();
        }
    }

    render () {
        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各小班定位进度分析'
                    extra={
                        <div>
                            <a onClick={this.handleLocationDataExport.bind(this)}>
                                导出
                            </a>
                        </div>
                    }
                >
                    <Cards search={this.search()} title={this.title()}>
                        <div
                            id='LocationLeft'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>
            </Spin>
        );
    }
    title () {
        const { section, sectionOption } = this.state;
        return (
            <div>
                <Select
                    value={section}
                    onSelect={this.onSectionChange.bind(this)}
                    style={{ width: '80px' }}
                >
                    {sectionOption}
                </Select>
                <span>各小班定位进度分析</span>
            </div>
        );
    }
    onSectionChange (value) {
        this.setState({
            section: value
        });
    }

    search () {
        return (
            <div>
                <span>定位时间：</span>
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
                getLocationStatBySpecfield
            }
        } = this.props;
        const {
            stime,
            etime,
            section,
            sectionsData
        } = this.state;
        let param = {
            stattype: 'smallclass',
            section: section,
            stime: stime,
            etime: etime
        };
        this.setState({ loading: true });
        let smallClassList = [];
        let queryData = [];
        sectionsData.map((sectionData) => {
            if (section === sectionData.No) {
                smallClassList = sectionData.children;
            }
        });

        let rst = await getLocationStatBySpecfield({}, param);
        let units = [];
        let complete = [];
        let label = [];

        if (rst && rst instanceof Array && rst.length > 0) {
            queryData = rst;
            smallClassList.map((smallClass) => {
                rst.map(item => {
                    let No = smallClass.No;
                    let NoArr = No.split('-');
                    if (NoArr.length === 4) {
                        let smallClassNo = NoArr[0] + '-' + NoArr[1] + '-' + NoArr[3];
                        if (item.Label === smallClassNo) {
                            complete.push(item.Num);
                            label.push(smallClass.Name);
                        }
                    };
                });
            });
        };
        this.setState({
            queryData,
            smallClassList
        });
        let myChart3 = echarts.init(document.getElementById('LocationLeft'));
        let options3 = {
            legend: {
                data: ['已定位']
            },
            xAxis: [
                {
                    data: label.length > 0 ? label : units
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
            series: [
                {
                    name: '已定位',
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

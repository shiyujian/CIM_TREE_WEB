import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import { Select, Row, Col, Radio, Card, DatePicker, Spin } from 'antd';
import {
    TREETYPENO,
    ECHARTSCOLOR,
    SCHEDULRPROJECT
} from '../../../_platform/api';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
export default class Warning extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            departOptions: '',
            currentSection: '',
            treetypeAll: [],
            loading: false,
            datas: [],
            gpshtnum: []
        };
    }

    async componentDidMount () {
        const {
            actions: { gettreeevery }
        } = this.props;
        // 获取全部树种信息
        let rst = await gettreeevery();
        console.log('gettreeeveryrst', rst);
        if (rst && rst instanceof Array) {
            this.setState({
                treetypeAll: rst
            });
        }

        this.getSection();
        let myChart = echarts.init(document.getElementById('rightbottom'));

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
            xAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    boundaryGap: [0, 0.01],
                    data: []
                }
            ],
            series: [
                {
                    name: '已检验批个数',
                    type: 'bar',
                    data: [250, 360, 280, 230, 312, 240, 290, 300, 266, 300],
                    barWidth: '25%',
                    itemStyle: {
                        normal: {
                            color: '#02e5cd',
                            barBorderRadius: [50, 50, 50, 50]
                        }
                    }
                }
            ]
        };
        myChart.setOption(optionLine);
        this.getdata();
    }

    getSection () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let sections = [];
        sectionData.map(project => {
            if (project.No === leftkeycode) {
                let units = project.children;
                units.map(unit => {
                    sections.push(
                        <Option key={unit.No} value={unit.No}>
                            {unit.Name}
                        </Option>
                    );
                });
                this.setState({
                    currentSection: units && units[0] && units[0].No
                });
            }
        });
        this.setState({
            sections
        });
    }

    componentDidUpdate (prevProps, prevState) {
        const { stime, etime, currentSection } = this.state;
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode != prevProps.leftkeycode) {
                this.getSection();
                this.getdata();
            }
        } catch (e) {
            console.log(e);
        }
        if (stime != prevState.stime || etime != prevState.etime) {
            this.getdata();
        }
        if (currentSection != prevState.currentSection) {
            this.filterProjectData();
        }
    }

    render () {
        const { sections } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        施工时间：
                        <RangePicker
                            style={{ textAlign: 'center' }}
                            defaultValue={[
                                moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),
                                moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')
                            ]}
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                        <div
                            id='rightbottom'
                            style={{ width: '100%', height: '340px' }}
                        />
                        <Select
                            placeholder='请选择标段'
                            notFoundContent='暂无数据'
                            value={this.state.currentSection}
                            onSelect={this.selectSection.bind(this)}
                        >
                            {sections}
                        </Select>
                        <span>进度分析</span>
                    </Card>
                </Spin>
            </div>
        );
    }
    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY/MM/DD HH:mm:ss')
                : ''
        });
    }

    selectSection (value) {
        this.setState({
            currentSection: value
        });
    }

    getdata () {
        const { etime, stime, treetypeAll } = this.state;
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let params = {
            etime: etime,
            stime: stime
        };
        this.setState({
            loading: true
        });
        console.log('RightBottomaaaaaaaaaaaaaaaaaaaaa', params);
        const {
            actions: { progressdata, progressalldata }
        } = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];
        let datas = [];
        // let datas = Array(10).fill(0);
        progressalldata({}, params).then(rst => {
            console.log('RightBottom', rst);
            if (rst && rst.content) {
                let content = [];
                rst.content.map(item => {
                    if (item.ProgressType && item.ProgressType === '日实际') {
                        content.push(item);
                    }
                });
                SCHEDULRPROJECT.map((item, index) => {
                    datas[index] = new Object();
                    datas[index].project = item.name;
                    datas[index].value = new Array();
                });

                console.log('RightBottomdatas', datas);

                if (content && content instanceof Array) {
                    sectionData.map(project => {
                        // 获取正确的项目
                        if (leftkeycode.indexOf(project.No) > -1) {
                            // 获取项目下的标段
                            let sections = project.children;
                            // 将各个标段的数据设置为0
                            sections.map((section, index) => {
                                // 定义一个二维数组，分为多个标段
                                gpshtnum[index] = new Array();
                                datas.map(projectData => {
                                    projectData.value[index] = 0;
                                });
                            });

                            content.map(item => {
                                if (item && item.UnitProject) {
                                    sections.map((section, index) => {
                                        if (item.UnitProject === section.No) {
                                            gpshtnum[index].push(item);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                console.log('RightBottomgpshtnum', gpshtnum);

                gpshtnum.map((data, i) => {
                    data.map((arr, a) => {
                        let Items = arr.Items;
                        Items.map((item, x) => {
                            // 默认的种类
                            // console.log('RightBottomitem',item)
                            // console.log('RightBottomx',x)
                            if (x < 6) {
                                SCHEDULRPROJECT.map((project, serial) => {
                                    if (item.Project === project.name) {
                                        let reg = isNaN(item.Num);
                                        console.log('reg', reg);
                                        if (!reg) {
                                            if (item.Num > 0) {
                                                datas[serial].value[i] =
                                                    datas[serial].value[i] +
                                                    item.Num +
                                                    0;
                                            }
                                        }
                                        // datas[serial].value[index] = datas[serial].value[index] + item.Num + 0
                                    }
                                });
                            } else {
                                // 添加的数目种类
                                let treetype = '';
                                treetypeAll.map(tree => {
                                    if (tree.TreeTypeName === item.Project) {
                                        // 获取树种cdoe的首个数字，找到对应的类型
                                        let code = tree.TreeTypeNo.substr(0, 1);
                                        console.log('code', code);
                                        TREETYPENO.map(forest => {
                                            if (forest.id === code) {
                                                treetype = forest.name;
                                            }
                                        });
                                    }
                                });
                                // console.log('RightBottomtreetype',treetype)
                                SCHEDULRPROJECT.map((project, serial) => {
                                    if (treetype === project.name) {
                                        let reg = isNaN(item.Num);
                                        console.log('reg', reg);
                                        if (!reg) {
                                            if (item.Num > 0) {
                                                datas[serial].value[i] =
                                                    datas[serial].value[i] +
                                                    item.Num +
                                                    0;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });
                });
                console.log('RightBottomdatas', datas);
                this.setState(
                    {
                        datas: datas,
                        gpshtnum: gpshtnum
                    },
                    () => {
                        this.filterProjectData();
                    }
                );
            } else {
                this.setState({
                    loading: false
                });
                this.filterProjectData();
            }
        });
    }
    // 根据标段筛选数据
    filterProjectData () {
        const { datas, currentSection } = this.state;
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let choose = [];
        SCHEDULRPROJECT.map(item => {
            choose.push(item.name);
        });

        let currentData = [];
        sectionData.map(item => {
            // 获取正确的项目
            if (leftkeycode.indexOf(item.No) > -1) {
                // 获取项目下的标段
                let sections = item.children;
                // 查找当前标段
                sections.map((section, index) => {
                    if (section.No === currentSection) {
                        datas.map(data => {
                            let value = data.value;
                            currentData.push(value[index]);
                        });
                    }
                });
            }
        });

        let myChart = echarts.init(document.getElementById('rightbottom'));
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
            xAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    boundaryGap: [0, 0.01],
                    data: choose
                }
            ],
            series: [
                {
                    name: '已检验批个数',
                    type: 'bar',
                    data: currentData,
                    barWidth: '25%',
                    label: {
                        normal: {
                            offset: ['50', '80'],
                            show: true,
                            position: 'inside',
                            formatter: '{c}',
                            textStyle: { color: '#FFFFFF' }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#02e5cd',
                            barBorderRadius: [50, 50, 50, 50]
                        }
                    }
                }
            ]
        };
        myChart.setOption(optionLine);
        this.setState({
            loading: false
        });
    }
}

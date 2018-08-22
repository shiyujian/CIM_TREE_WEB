import React, { Component } from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import { Select, Row, Col, Radio, Card, DatePicker, Spin } from 'antd';
import {
    PROJECT_UNITS,
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
            data: '',
            departOptions: '',
            currentSection: '',
            project: '便道施工',
            sections: [],
            treetypeAll: [],
            gpshtnum: [],
            times: [],
            datas: [],
            loading: false
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
        const myChart = echarts.init(document.getElementById('rightop'));

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
                    type: 'category',
                    data: [
                        '2017-11-13',
                        '2017-11-13',
                        '2017-11-13',
                        '2017-11-13',
                        '2017-11-13',
                        '2017-11-13',
                        '2017-11-13'
                    ],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: []
        };
        myChart.setOption(optionLine);
        this.getdata();
    }

    componentDidUpdate (prevProps, prevState) {
        const {
            stime,
            etime,
            project,
            currentSection,
            treetypeAll
        } = this.state;
        const { leftkeycode } = this.props;
        try {
            if (leftkeycode != prevProps.leftkeycode) {
                this.getSection();
                this.getdata();
            }
        } catch (e) {
            console.log(e);
        }
        if (
            stime != prevState.stime ||
            etime != prevState.etime ||
            treetypeAll != prevState.treetypeAll
        ) {
            this.getdata();
        }
        if (
            project != prevState.project ||
            currentSection != prevState.currentSection
        ) {
            this.filterProjectData();
        }
    }

    getSection () {
        const { leftkeycode } = this.props;
        let sections = [];
        PROJECT_UNITS.map(project => {
            if (project.code === leftkeycode) {
                let units = project.units;
                units.map(unit => {
                    sections.push(
                        <Option key={unit.code} value={unit.code}>
                            {unit.value}
                        </Option>
                    );
                });
                this.setState({
                    currentSection: units && units[0] && units[0].code
                });
            }
        });
        this.setState({
            sections
        });
    }

    render () {
        // todo 累计完成工程量
        const { sections } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Card>
                        施工时间：
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
                        <div
                            id='rightop'
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
                        <Select
                            defaultValue='便道施工'
                            style={{ width: '120px' }}
                            onSelect={this.selectProject.bind(this)}
                        >
                            {SCHEDULRPROJECT.map(rst => {
                                return (
                                    <Option
                                        key={rst.id}
                                        value={rst.name}
                                        title={rst.name}
                                    >
                                        {rst.name}
                                    </Option>
                                );
                            })}
                        </Select>
                        <span>强度分析</span>
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
    // 选择项目
    selectProject (value) {
        this.setState({
            project: value
        });
    }
    // 设置标段
    selectSection (value) {
        this.setState({
            currentSection: value
        });
    }
    getdata () {
        const {
            stime,
            etime,
            // project,
            // unitproject,
            treetypeAll
        } = this.state;
        const { leftkeycode } = this.props;
        let params = {
            stime: stime,
            etime: etime
        };
        this.setState({
            loading: true
        });
        console.log('RightTopaaaaaaaaaaaaaaaaaaaaa', params);
        const {
            actions: { progressdata, progressalldata }
        } = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];

        progressalldata({}, params).then(rst => {
            console.log('RightTop', rst);
            let datas = [];
            if (rst && rst.content) {
                let content = [];
                rst.content.map(item => {
                    if (item.ProgressType && item.ProgressType === '日实际') {
                        content.push(item);
                    }
                });
                // 将获取的数据按照 ProgressTime 时间排序
                content.sort(function (a, b) {
                    if (a.ProgressTime < b.ProgressTime) {
                        return -1;
                    } else if (a.ProgressTime > b.ProgressTime) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                console.log('RightTopcontent', content);
                // 将 ProgressTime 单独列为一个数组
                for (let i = 0; i < content.length; i++) {
                    let a = moment(content[i].ProgressTime).format(
                        'YYYY/MM/DD'
                    );
                    time.push(a);
                }
                // 时间数组去重
                times = [...new Set(time)];
                console.log('RightToptimes', times);

                SCHEDULRPROJECT.map((item, index) => {
                    datas[index] = new Object();
                    datas[index].project = item.name;
                    datas[index].value = new Array();
                });

                console.log('RightTopdatas', datas);

                if (content && content instanceof Array) {
                    PROJECT_UNITS.map(project => {
                        // 获取正确的项目
                        if (leftkeycode.indexOf(project.code) > -1) {
                            // 获取项目下的标段
                            let sections = project.units;
                            // 将各个标段的数据设置为0
                            sections.map((section, index) => {
                                // 定义一个二维数组，分为多个标段
                                gpshtnum[index] = new Array();
                                datas.map(projectData => {
                                    projectData.value[index] = new Array();
                                });
                            });

                            content.map(item => {
                                if (item && item.UnitProject) {
                                    sections.map((section, index) => {
                                        if (item.UnitProject === section.code) {
                                            gpshtnum[index].push(item);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                console.log('RightTopdatas', datas);
                console.log('RightTopgpshtnum', gpshtnum);

                times.map((time, index) => {
                    datas.map(projectData => {
                        projectData.value.map(sectionData => {
                            sectionData[index] = 0;
                        });
                    });

                    console.log('sectionData', datas);
                    gpshtnum.map((data, i) => {
                        data.map((arr, a) => {
                            if (
                                moment(arr.ProgressTime).format(
                                    'YYYY/MM/DD'
                                ) === time
                            ) {
                                let Items = arr.Items;
                                Items.map((item, x) => {
                                    // 默认的种类
                                    if (x < 6) {
                                        SCHEDULRPROJECT.map(
                                            (project, serial) => {
                                                if (
                                                    item.Project ===
                                                    project.name
                                                ) {
                                                    let reg = isNaN(item.Num);
                                                    console.log('reg', reg);
                                                    if (!reg) {
                                                        if (item.Num > 0) {
                                                            datas[serial].value[
                                                                i
                                                            ][index] =
                                                                datas[serial]
                                                                    .value[i][
                                                                        index
                                                                    ] +
                                                                item.Num +
                                                                0;
                                                        }
                                                    }
                                                    // datas[serial].value[index] = datas[serial].value[index] + item.Num + 0
                                                }
                                            }
                                        );
                                    } else {
                                        // 添加的数目种类
                                        let treetype = '';
                                        treetypeAll.map(tree => {
                                            if (
                                                tree.TreeTypeName ===
                                                item.Project
                                            ) {
                                                // 获取树种cdoe的首个数字，找到对应的类型
                                                let code = tree.TreeTypeNo.substr(
                                                    0,
                                                    1
                                                );
                                                console.log('code', code);
                                                TREETYPENO.map(forest => {
                                                    if (forest.id === code) {
                                                        treetype = forest.name;
                                                    }
                                                });
                                            }
                                        });
                                        console.log(
                                            'RightToptreetype',
                                            treetype
                                        );
                                        SCHEDULRPROJECT.map(
                                            (project, serial) => {
                                                if (treetype === project.name) {
                                                    let reg = isNaN(item.Num);
                                                    console.log('reg', reg);
                                                    if (!reg) {
                                                        if (item.Num > 0) {
                                                            datas[serial].value[
                                                                i
                                                            ][index] =
                                                                datas[serial]
                                                                    .value[i][
                                                                        index
                                                                    ] +
                                                                item.Num +
                                                                0;
                                                        }
                                                    }
                                                }
                                            }
                                        );
                                    }
                                });
                            }
                        });
                    });
                });
                console.log('RightTopdatas', datas);

                this.setState(
                    {
                        datas: datas,
                        gpshtnum: gpshtnum,
                        times: times
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
    // 根据标段和项目筛选数据
    filterProjectData () {
        const {
            times,
            gpshtnum,
            datas,
            project,
            treetypeAll,
            currentSection
        } = this.state;
        const { leftkeycode } = this.props;

        // 当查不出数据时，使横坐标不为空
        let a = moment()
            .subtract(2, 'days')
            .format('YYYY/MM/DD');
        let b = moment()
            .subtract(1, 'days')
            .format('YYYY/MM/DD');
        let c = moment().format('YYYY/MM/DD');
        let d = moment()
            .add(1, 'days')
            .format('YYYY/MM/DD');
        let e = moment()
            .add(2, 'days')
            .format('YYYY/MM/DD');
        let dates = [];
        dates.push(a);
        dates.push(b);
        dates.push(c);
        dates.push(d);
        dates.push(e);
        console.log('RightTopdates', dates);

        let currentProjectData = [];
        let currentData = [];
        datas.map(data => {
            if (data.project === project) {
                currentProjectData = data.value;
            }
        });

        console.log('currentProjectData', currentProjectData);
        PROJECT_UNITS.map(item => {
            // 获取正确的项目
            if (leftkeycode.indexOf(item.code) > -1) {
                // 获取项目下的标段
                let sections = item.units;
                // 查找当前标段
                sections.map((section, index) => {
                    if (section.code === currentSection) {
                        currentData = currentProjectData[index];
                    }
                });
            }
        });
        console.log('currentData', currentData);

        const myChart = echarts.init(document.getElementById('rightop'));

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
                    type: 'category',
                    data: times.length > 0 ? times : dates,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    // name:'一标',
                    type: 'line',
                    data: currentData,
                    itemStyle: {
                        normal: {
                            color: 'black'
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

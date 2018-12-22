import React, { Component } from 'react';
import { Row, Col, DatePicker, Select, Spin } from 'antd';
import { Cards } from '../../components';
import {
    TREETYPENO
} from '../../../_platform/api';
import moment from 'moment';
var echarts = require('echarts');
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class Right extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 所有的树种类型
            treeTypeAll: [],
            treeTypeOption: [],
            // 树类型option数组
            bigTypeOption: [],
            // 选择的树种的值
            treeTypeSelect: '',
            section: '',
            stime: moment()
                .subtract(10, 'days')
                .format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            loading: false
        };
    }

    componentDidMount () {
        let myChart2 = echarts.init(document.getElementById('Right'));
        let options2 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                left: 'right',
                type: 'scroll'
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
                    name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: []
        };
        myChart2.setOption(options2);
        const {
            actions: { gettreeevery }
        } = this.props;
        // 获取全部树种信息
        gettreeevery().then(rst => {
            if (rst && rst instanceof Array) {
                this.setState({
                    treeTypeAll: rst
                });
            }
        });

        // 树木类型
        let bigTypeOption = [];
        bigTypeOption.push(
            <Option key={'全部'} value={'全部'}>
                全部
            </Option>
        );
        TREETYPENO.map(tree => {
            bigTypeOption.push(
                <Option key={tree.name} value={tree.id.toString()}>
                    {tree.name}
                </Option>
            );
        });

        this.setState({
            bigTypeOption
        });
    }

    componentDidUpdate (prevProps, prevState) {
        const { treeTypeSelect } = this.state;
        const { leftkeycode } = this.props;
        if (treeTypeSelect && treeTypeSelect !== prevState.treeTypeSelect) {
            this.query();
        }
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            this.query();
        }
    }

    render () {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Cards search={this.searchRender()} title={`进场强度分析`}>
                        <div
                            id='Right'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Spin>
            </div>
        );
    }

    searchRender () {
        const {
            bigTypeOption = [],
            treeTypeOption = []
        } = this.state;
        return (
            <Row>
                <Col xl={4} lg={10}>
                    <span>类型：</span>
                    <Select
                        className='forestcalcw2 mxw100'
                        defaultValue={'全部'}
                        style={{ width: '85px' }}
                        onChange={this.onBigTypeChange.bind(this)}
                    >
                        {bigTypeOption}
                    </Select>
                </Col>
                <Col xl={5} lg={10}>
                    <span>树种：</span>
                    <Select
                        value={this.state.treeTypeSelect}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.onTreeTypeChange.bind(this)}
                        style={{ width: '100px' }}
                        showSearch
                        className='forestcalcw2 mxw100'
                    >
                        {treeTypeOption}
                    </Select>
                </Col>
                <Col xl={15} lg={24}>
                    <span>起苗时间：</span>
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
                </Col>
            </Row>
        );
    }

    // 选择树种类型
    onBigTypeChange (value) {
        const { treeTypeAll = [] } = this.state;
        this.setState({
            treeTypeSelect: ''
        });
        let selectTreeType = [];
        treeTypeAll.map(item => {
            if (item.TreeTypeNo) {
                try {
                    let code = item.TreeTypeNo.substr(0, 1);
                    if (code === value) {
                        selectTreeType.push(item);
                    }
                } catch (e) {
                    console.log('e', e);
                }
            }
        });
        this.setTreeTypeOption(selectTreeType);
    }

    // 设置树种选项
    setTreeTypeOption (rst) {
        if (rst instanceof Array) {
            let treeTypeOption = rst.map(item => {
                return (
                    <Option key={item.id} value={item.ID} title={item.TreeTypeName}>
                        {item.TreeTypeName}
                    </Option>
                );
            });
            treeTypeOption.unshift(
                <Option key={'全部'} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({ treeTypeOption });
        }
    }
    // 选择树种
    onTreeTypeChange (value) {
        this.setState({
            treeTypeSelect: value
        });
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

    // 进场强度分析
    async query (no) {
        const {
            leftkeycode,
            platform: { tree = {} },
            actions: { gettreetype }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        const {
            stime,
            etime,
            treeTypeSelect
        } = this.state;
        let postdata = {};

        postdata.no = leftkeycode;
        postdata.stime = stime;
        postdata.etime = etime;
        let treetype = [];
        if (treeTypeSelect) {
            treetype.push(treeTypeSelect);
            postdata.treetype = treetype;
        }

        this.setState({
            loading: true
        });

        let rst = await gettreetype({}, postdata);
        let total = [];
        let data = [];
        let gpshtnum = [];
        let times = [];
        let time = [];
        let legend = ['总数'];

        if (rst && rst instanceof Array) {
            // 将 Time 单独列为一个数组
            for (let i = 0; i < rst.length; i++) {
                if (rst[i].Section) {
                    time.push(rst[i].Time);
                }
            }
            // 时间数组去重
            times = [...new Set(time)];

            if (rst && rst instanceof Array) {
                sectionData.map(project => {
                    // 获取正确的项目
                    if (leftkeycode.indexOf(project.No) > -1) {
                        // 获取项目下的标段
                        let sections = project.children;
                        // 将各个标段的数据设置为0
                        sections.map((section, index) => {
                            // 定义一个二维数组，分为多个标段
                            gpshtnum[index] = new Array();
                            data[index] = new Array();
                            legend.push(section.Name);
                        });

                        rst.map(item => {
                            if (item && item.Section) {
                                sections.map((section, index) => {
                                    if (item.Section === section.No) {
                                        gpshtnum[index].push(item);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            times.map((time, index) => {
                data.map(sectionData => {
                    sectionData[index] = 0;
                });
                gpshtnum.map((test, i) => {
                    test.map((arr, a) => {
                        if (moment(arr.Time).format('YYYY/MM/DD') === time) {
                            data[i][index] = data[i][index] + arr.Num + 0;
                        }
                    });
                });
            });
            for (let i = 0; i < times.length; i++) {
                total[i] = 0;
                data.map(sectionData => {
                    total[i] = total[i] + sectionData[i];
                });
            }
        }

        let series = [
            {
                name: '总数',
                type: 'bar',
                data: total,
                barWidth: '25%',
                itemStyle: {
                    normal: {
                        color: '#02e5cd',
                        barBorderRadius: [50, 50, 50, 50]
                    }
                }
            }
        ];
        data.map((sectionData, index) => {
            series.push({
                name: legend[index + 1],
                type: 'line',
                data: sectionData
            });
        });

        let myChart2 = echarts.init(document.getElementById('Right'));
        let options2 = {
            legend: {
                data: legend,
                type: 'scroll'
            },
            xAxis: [
                {
                    data: times
                }
            ],
            series: series
        };
        myChart2.setOption(options2);
        this.setState({
            loading: false
        });
    }
}

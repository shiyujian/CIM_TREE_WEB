import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, Card, DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class PlantLeftSmallClass extends Component {
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
        var myChart3 = echarts.init(document.getElementById('PlantLeftSmallClass'));
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
        // todo 苗木种植强度分析

        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各小班种植进度分析'
                >
                    <Cards search={this.search()} title={this.title()}>
                        <div
                            id='PlantLeftSmallClass'
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
                <span>各小班种植进度分析</span>
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

    async query () {
        const {
            actions: {
                getCountSmall
            }
        } = this.props;
        const {
            stime,
            etime,
            section,
            sectionsData
        } = this.state;
        if (!section) {
            return;
        }
        let smallClassList = [];
        let queryData = [];
        sectionsData.map((sectionData) => {
            if (section === sectionData.No) {
                smallClassList = sectionData.children;
            }
        });
        let param = {};

        param.section = section;
        param.stime = stime;
        param.etime = etime;
        this.setState({ loading: true });

        let rst = await getCountSmall({}, param);

        let units = [];
        let complete = [];
        let unComplete = [];
        let label = [];

        if (rst && rst instanceof Array) {
            queryData = rst;
            smallClassList.map((smallClass) => {
                rst.map(item => {
                    let No = smallClass.No;
                    let itemNo = item.No;
                    let itemSectionNo = item.Section;
                    let itemNoArr = itemNo.split('-');
                    let itemSmallClassNo = itemSectionNo + '-' + itemNoArr[2];
                    if (itemSmallClassNo === No) {
                        complete.push(item.Complete);
                        unComplete.push(item.UnComplete);
                        label.push(smallClass.Name);
                    }
                });
            });
        }
        this.setState({
            queryData,
            smallClassList
        });

        let myChart3 = echarts.init(document.getElementById('PlantLeftSmallClass'));
        let options3 = {
            legend: {
                data: ['未种植', '已种植']
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
        myChart3.setOption(options3);
        this.setState({ loading: false });
    }
}

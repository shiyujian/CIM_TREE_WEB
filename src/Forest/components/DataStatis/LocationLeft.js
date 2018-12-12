import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
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
            sectionoption: [],
            sectionsData: []
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
        let sectionoption = [];
        sectionData.map(project => {
            // 获取正确的项目
            if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                let sections = project.children;
                console.log('sections', sections);
                sections.map((section, index) => {
                    sectionoption.push(
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
            sectionoption
        });
    }

    componentDidUpdate (prevProps, prevState) {
        const { section } = this.state;
        const { leftkeycode } = this.props;
        if (leftkeycode !== prevProps.leftkeycode) {
            this.getSectionOption();
        }
        if (section !== prevState.section) {
            this.query();
        }
    }

    render () {
        return (
            <Spin spinning={this.state.loading}>
                <Cards search={this.search()} title={this.title()}>
                    <div
                        id='LocationLeft'
                        style={{ width: '100%', height: '400px' }}
                    />
                </Cards>
            </Spin>
        );
    }
    title () {
        const { section, sectionoption } = this.state;
        return (
            <div>
                <Select
                    value={section}
                    onSelect={this.onsectionchange.bind(this)}
                    style={{ width: '80px' }}
                >
                    {sectionoption}
                </Select>
                <span>各小班定位进度分析</span>
            </div>
        );
    }
    onsectionchange (value) {
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
        sectionsData.map((sectionData) => {
            if (section === sectionData.No) {
                smallClassList = sectionData.children;
            }
        });

        let rst = await getLocationStatBySpecfield({}, param);
        let units = [];

        let complete = [];
        let label = [];

        if (rst && rst instanceof Array) {
            rst.map(item => {
                complete.push(item.Num);
                smallClassList.map((smallClass) => {
                    let No = smallClass.No;
                    let NoArr = No.split('-');
                    if (NoArr.length === 4) {
                        let smallClassNo = NoArr[0] + '-' + NoArr[1] + '-' + NoArr[3];
                        if (item.Label === smallClassNo) {
                            label.push(smallClass.Name);
                        }
                    };
                });
            });
        }
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
}

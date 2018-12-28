import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class BottomRight extends Component {
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
            sectionsData: [],
            sectionOption: [],
            smallClassData: [],
            smallClassOption: [],
            smallClassSelect: '',
            queryData: [], // 查找到的数据
            thinClassList: [] // 根据选择的项目标段获取的细班数据
        };
    }
    async componentDidMount () {
        var myChart4 = echarts.init(document.getElementById('BottomRight'));
        let option4 = {
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
        myChart4.setOption(option4);
    }

    async componentDidUpdate (prevProps, prevState) {
        const { section, smallClassSelect } = this.state;
        const { leftkeycode } = this.props;
        // 地块修改，则修改标段
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.getSectionOption();
        }
        // 标段修改，修改小班
        if (section && section !== prevState.section) {
            this.getSmallClassOption();
        }
        // 小班和时间修改，查询数据
        if (
            smallClassSelect && smallClassSelect !== prevState.smallClassSelect
        ) {
            this.query();
        }
    }
    // 设置标段下拉选项
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
                        <Option key={section.No} value={section.No} title={section.Name}>
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
    // 设置小班选项
    async getSmallClassOption () {
        const {
            sectionsData,
            section
        } = this.state;

        let smallClassOption = [];
        sectionsData.map(sectionData => {
            // 获取正确的项目
            if (section.indexOf(sectionData.No) > -1) {
                // 获取项目下的标段
                let smallClassList = sectionData.children;
                smallClassList.map((smallClass, index) => {
                    smallClassOption.push(
                        <Option key={smallClass.No} value={smallClass.No} title={smallClass.Name}>
                            {smallClass.Name}
                        </Option>
                    );
                });
                this.setState({
                    smallClassSelect: smallClassList && smallClassList[0] && smallClassList[0].No,
                    smallClassData: smallClassList
                });
            }
        });
        this.setState({
            smallClassOption
        });
    }

    render () {
        // todo 各细班种植进度分析
        return (
            <Spin spinning={this.state.loading}>
                <Cards
                    style={{ margin: '20px 5px 5px 5px' }}
                    search={this.search()}
                    title={this.title1()}
                >
                    <div
                        id='BottomRight'
                        style={{ width: '100%', height: '400px' }}
                    />
                </Cards>
            </Spin>
        );
    }
    // 标题左侧下拉框
    title1 () {
        const { section, smallClassSelect, sectionOption, smallClassOption } = this.state;
        return (
            <div>
                <Select
                    value={section}
                    onSelect={this.handleSectionChange.bind(this)}
                    style={{ width: '80px' }}
                >
                    {sectionOption}
                </Select>
                <Select
                    value={smallClassSelect}
                    onChange={this.handleSmallClassChange.bind(this)}
                    style={{ width: '100px' }}
                >
                    {smallClassOption}
                </Select>
                <span>小班各细班种植进度分析</span>
            </div>
        );
    }
    // 选择标段
    handleSectionChange (value) {
        this.setState({
            section: value
        });
    }
    // 选择小班
    handleSmallClassChange (value) {
        this.setState({
            smallClassSelect: value
        });
    }
    // 选择时间
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
                <a>导出</a>
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

    // 查询数据
    async query () {
        const {
            actions: { gettreetypeThinClass }
        } = this.props;
        const { smallClassSelect, section, stime, etime, smallClassData } = this.state;
        if (!section) {
            return;
        }
        this.setState({ loading: true });
        let param = {};
        let code = '';

        let codeArr = smallClassSelect.split('-');
        if (!(codeArr && codeArr instanceof Array && codeArr.length === 4)) {
            return;
        }
        code = codeArr[0] + '-' + codeArr[1] + '-' + codeArr[3];

        param.no = code;
        param.section = section;
        param.stime = stime;
        param.etime = etime;
        let rst = await gettreetypeThinClass({}, param);

        let queryData = [];
        let thinClassList = [];
        smallClassData.map((smallClass) => {
            if (smallClassSelect === smallClass.No) {
                thinClassList = smallClass.children;
            }
        });

        let complete = [];
        let unComplete = [];
        let label = [];
        let units = [];
        if (rst && rst instanceof Array) {
            queryData = rst;
            thinClassList.map((thinClass) => {
                rst.map(item => {
                    let No = thinClass.No;
                    let itemNo = item.No;
                    let itemSectionNo = item.Section;
                    let itemNoArr = itemNo.split('-');
                    let itemThinClassNo = itemSectionNo + '-' + itemNoArr[2] + '-' + itemNoArr[3];
                    if (itemThinClassNo === No) {
                        complete.push(item.Complete);
                        unComplete.push(item.UnComplete);
                        label.push(thinClass.Name);
                    }
                });
            });
        }
        this.setState({
            queryData,
            thinClassList
        });

        let myChart4 = echarts.init(document.getElementById('BottomRight'));
        let options4 = {
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
            dataZoom: [{
                type: 'inside'
            }, {
                type: 'slider'
            }],
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
        myChart4.setOption(options4);
        this.setState({ loading: false });
    }
}

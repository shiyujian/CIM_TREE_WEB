import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin, Card } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
const Option = Select.Option;

export default class PlantRightThinClass extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            section: 'P009-01-01',
            sectionoption: [],
            SmallClassList: [],
            smallClassSelect: '',
            uniqueSmallClass: []
        };
    }
    async componentDidMount () {
        var myChart4 = echarts.init(document.getElementById('PlantRightThinClass'));
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
        await this.getSectionoption();
        await this.getSmallClass();
        await this.selectSmallClass();
        // await this.query();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { etime, stime, section, smallClassSelect } = this.state;
        const { leftkeycode } = this.props;
        // 地块修改，则修改标段
        if (leftkeycode !== prevProps.leftkeycode) {
            await this.getSectionoption();
            await this.getSmallClass();
            await this.selectSmallClass();
            // 因为项目更改之后，又可能 smallClassSelect的值并未更改，所以需要执行query()
            this.query();
        }
        // 标段修改，修改小班
        if (section !== prevState.section) {
            this.selectSmallClass();
        }
        // 小班和时间修改，查询数据
        if (
            etime !== prevState.etime ||
            smallClassSelect !== prevState.smallClassSelect ||
            stime !== prevState.stime
        ) {
            this.query();
        }
    }
    // 设置标段下拉选项
    getSectionoption () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let sectionoption = [];
        sectionData.map(project => {
            // 获取正确的项目
            if (leftkeycode.indexOf(project.No) > -1) {
                // 获取项目下的标段
                let sections = project.children;
                sections.map((section, index) => {
                    sectionoption.push(
                        <Option key={section.No} value={section.No}>
                            {section.Name}
                        </Option>
                    );
                });
                this.setState({
                    section: sections && sections[0] && sections[0].No
                });
            }
        });
        this.setState({
            sectionoption
        });
    }
    // 设置小班选项
    async getSmallClass () {
        const {
            actions: { getSmallClassList },
            leftkeycode
        } = this.props;

        const { section } = this.state;
        let param = {
            no: leftkeycode
        };
        this.setState({
            loading: true
        });

        let SmallClassList = [];
        let lists = await getSmallClassList(param);
        if (lists && lists instanceof Array) {
            SmallClassList = lists;
        }
        this.setState({
            SmallClassList,
            loading: false
        });
    }
    async selectSmallClass () {
        const { leftkeycode } = this.props;
        const { section, SmallClassList } = this.state;
        let code = '';
        // 根据标段筛选不同的小班
        let selectSmallClassList = [];
        let test = [];
        if (section) {
            try {
                code = section.split('-')[2];
            } catch (e) {
                console.log(e);
            }
        }

        SmallClassList.map(SmallClass => {
            try {
                if (SmallClass && SmallClass.No) {
                    let sectionArr = SmallClass.No.split('-');
                    let sectionCode =
                        sectionArr[0] +
                        '-' +
                        sectionArr[1] +
                        '-' +
                        SmallClass.UnitProjectNo;
                    if (sectionCode == section) {
                        selectSmallClassList.push(SmallClass);
                    }
                }
            } catch (e) {}
        });

        // 将小班的code获取到，进行去重
        let uniqueSmallClass = [];
        // 进行数组去重的数组
        let array = [];
        let smallClassSelect = '';
        selectSmallClassList.map(list => {
            if (array.indexOf(list.SmallClass) === -1) {
                uniqueSmallClass.push(list);
                array.push(list.SmallClass);
            }
        });

        if (uniqueSmallClass.length > 0) {
            smallClassSelect = uniqueSmallClass[0].SmallClass;
        }
        this.setState({
            uniqueSmallClass,
            smallClassSelect
        });
    }
    // 查询数据
    async query () {
        const {
            actions: { getCountThin },
            leftkeycode
        } = this.props;
        const { smallClassSelect, section, etime, stime } = this.state;
        this.setState({ loading: true });
        let param = {};
        let code = '';
        try {
            code = section.split('-');
            code = code[0] + '-' + code[1];
        } catch (e) {
            console.log(e);
        }

        param.no = code + '-' + smallClassSelect;
        param.section = section;
        // param.stime = stime;
        param.etime = etime;
        let rst = await getCountThin({}, param);

        let complete = [];
        let unComplete = [];
        let label = [];
        let total = [];
        let units = ['1细班', '2细班', '3细班', '4细班', '5细班'];
        if (rst && rst instanceof Array) {
            rst.map(item => {
                complete.push(item.Complete);
                unComplete.push(item.UnComplete);
                label.push(item.Label + '号细班');
            });
        }

        let myChart4 = echarts.init(document.getElementById('PlantRightThinClass'));
        let options4 = {
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
        myChart4.setOption(options4);
        this.setState({ loading: false });
    }

    render () {
        // todo 各细班种植进度分析
        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各细班种植进度分析'
                >
                    <Cards
                        style={{ margin: '20px 5px 5px 5px' }}
                        search={this.search()}
                        title={this.title1()}
                    >
                        <div
                            id='PlantRightThinClass'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>
            </Spin>
        );
    }
    // 标题左侧下拉框
    title1 () {
        const { section, smallClassSelect, sectionoption } = this.state;
        let smallclassoption = this.smallClassRendre();
        return (
            <div>
                <Select
                    value={section}
                    onSelect={this.onsectionchange.bind(this)}
                    style={{ width: '80px' }}
                >
                    {sectionoption}
                </Select>
                <Select
                    value={smallClassSelect}
                    onChange={this.smallclasschange.bind(this)}
                    style={{ width: '100px' }}
                >
                    {smallclassoption}
                </Select>
                <span>小班各细班种植进度分析</span>
            </div>
        );
    }
    // 将小班数据转化为下拉框
    smallClassRendre () {
        const { uniqueSmallClass } = this.state;
        let smallclassoption = [];
        uniqueSmallClass.map(rst => {
            smallclassoption.push(
                <Option key={rst.SmallClass} value={rst.SmallClass}>
                    {rst.SmallClassName}
                </Option>
            );
        });
        return smallclassoption;
    }
    // 选择标段
    onsectionchange (value) {
        this.setState(
            {
                section: value
            },
            () => {
                this.selectSmallClass();
            }
        );
    }
    // 选择小班
    smallclasschange (value) {
        this.setState({
            smallClassSelect: value
        });
    }
    // 选择时间
    search () {
        return (
            <div>
                <span>截止时间：</span>
                <DatePicker
                    style={{ verticalAlign: 'middle' }}
                    defaultValue={moment(
                        this.state.etime,
                        'YYYY/MM/DD HH:mm:ss'
                    )}
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
            etime: value ? moment(value).format('YYYY/MM/DD') : ''
        });
    }
}
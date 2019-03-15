import React, { Component } from 'react';
import echarts from 'echarts';
import { Select, DatePicker, Spin, Card, Notification } from 'antd';
import { Cards } from '../../components';
import moment from 'moment';
import XLSX from 'xlsx';
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class ProgressThinClass extends Component {
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
        var myChart4 = echarts.init(document.getElementById('LocationRight'));
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
        const { section, smallClassSelect } = this.state;
        const { leftkeycode } = this.props;
        await this.getSectionOption();
        await this.getSmallClassOption();
        this.query() 
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
            section,
            sectionsData
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
        return (
            <Spin spinning={this.state.loading}>
                <Card
                    title='各细班定位进度分析'
                    extra={
                        <div>
                            <a onClick={this.handleLocationDataExport.bind(this)}>
                                导出
                            </a>
                        </div>
                    }
                >
                    <Cards
                        style={{ margin: '20px 5px 5px 5px' }}
                        search={this.search()}
                        title={this.title1()}
                    >
                        <div
                            id='LocationRight'
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Cards>
                </Card>

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
                <span>小班各细班定位进度分析</span>
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

    // 查询数据
    async query () {
        const {
            actions: { getLocationStatBySpecfield }
        } = this.props;
        const {
            stime,
            etime,
            section,
            smallClassSelect,
            smallClassData
        } = this.state;
        let param = {
            stattype: 'thinclass',
            section: section,
            stime: stime,
            etime: etime
        };
        this.setState({ loading: true });
        let rst = await getLocationStatBySpecfield({}, param);
        let thinClassList = [];
        let queryData = [];
        smallClassData.map((smallClass) => {
            if (smallClassSelect === smallClass.No) {
                thinClassList = smallClass.children;
            }
        });
        let complete = [];
        let label = [];
        let units = [];
        if (rst && rst instanceof Array && rst.length > 0) {
            queryData = rst;
            thinClassList.map((thinClass) => {
                rst.map(item => {
                    let No = thinClass.No;
                    let NoArr = No.split('-');
                    if (NoArr.length === 5) {
                        let smallClassNo = NoArr[0] + '-' + NoArr[1] + '-' + NoArr[3] + '-' + NoArr[4];
                        if (item.Label === smallClassNo) {
                            complete.push(item.Num);
                            label.push(thinClass.Name);
                        }
                    };
                });
            });
        }
        this.setState({
            queryData,
            thinClassList
        });

        let myChart4 = echarts.init(document.getElementById('LocationRight'));
        let options4 = {
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
        myChart4.setOption(options4);
        this.setState({ loading: false });
    }

    handleLocationDataExport = () => {
        const {
            queryData,
            thinClassList
        } = this.state;
        if (!(queryData && queryData instanceof Array && queryData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        thinClassList.map((thinClass) => {
            queryData.map((item, index) => {
                let No = thinClass.No;
                let NoArr = No.split('-');
                if (NoArr.length === 5) {
                    let smallClassNo = NoArr[0] + '-' + NoArr[1] + '-' + NoArr[3] + '-' + NoArr[4];
                    if (item.Label === smallClassNo) {
                        let obj = {};
                        obj['定位数'] = item.Num;
                        obj['细班'] = thinClass.Name;
                        tblData.push(obj);
                    }
                };
            });
        });
        let _headers = ['细班', '定位数'];
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
        XLSX.writeFile(wb, `各细班定位进度.xlsx`);
    }
}

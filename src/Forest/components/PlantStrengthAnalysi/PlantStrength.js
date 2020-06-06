import React, {Component} from 'react';
import { Card, Row, Col, List, Form, Select, Button, Table, Spin, DatePicker } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import echarts from 'echarts';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const gridStyle = {
    width: '25%',
    height: 120,
    textAlign: 'center'
};
const { Option } = Select;
const titleStyle = {
    float: 'left',
    marginRight: 20
};
const CardStyle = {
    background: '#ECECEC',
    padding: '30px'
};
const basicDataStyle = {
    fontSize: 26,
    fontWeight: 'bold'
};
class PlantStrength extends Component {
    constructor (props) {
        super(props);
        this.state = {
            spinningPlant: false, // 加载中
            spinningTree: false, // 加载中
            plantSection: '', // 标段code
            smallClassNo: '', // 小班code
            thinClassNo: '', // 细班code
            plantSectionTree: '', // 树种标段code
            smallClassNoTree: '', // 树种小班code
            thinClassNoTree: '', // 树种细班code
            smallClassList: [], // 小班列表
            thinClassList: [], // 细班列表
            smallClassListTree: [], // 树种小班列表
            thinClassListTree: [], // 树种细班列表
            treeKind: '', // 树的大类code
            treeTypeNo: '', // 树种code
            treeTypeRanking: [], // 所有栽植树种排名
            newTreeTypeList: [], // 树种列表
            treeTypeDisplayTable: false, // 是否表格展示
            plantAmount: '', // 累计种植数量
            plantToday: '', // 今日种植总数
            locationToday: '', // 今日定位数量
            locationAmount: '', // 累计定位总数
            nowmessagelist: [], // 实时种植数据列表
            startDate: moment().subtract(10, 'days').format('YYYY-MM-DD 00:00:00'),
            endDate: moment().format('YYYY-MM-DD 23:59:59')
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.onQueryTree = this.onQueryTree.bind(this); // 树种完成情况
        this.onSearchPlant = this.onSearchPlant.bind(this); // 查询种植完成情况
        this.handleSection = this.handleSection.bind(this); // 修改标段
        this.handleSmallClass = this.handleSmallClass.bind(this); // 修改标段
        this.handleThinClass = this.handleThinClass.bind(this); // 修改细班
        this.handleSectionTree = this.handleSectionTree.bind(this); // 树种修改标段
        this.handleSmallClassTree = this.handleSmallClassTree.bind(this); // 树种修改标段
        this.handleThinClassTree = this.handleThinClassTree.bind(this); // 树种修改标段
        this.onTypeChange = this.onTypeChange.bind(this); // 树种大类选择
    }
    componentDidMount = async () => {

    }
    componentWillReceiveProps = async (nextProps) => {
        const {
            actions: { getTotalSat, getLocationStat, getCount, getLocationtotalstat }
        } = this.props;
        // 切换项目
        if (nextProps.leftkeycode !== this.props.leftkeycode) {
            this.setState({
                spinningPlant: true, // 加载中
                spinningTree: true, // 加载中
                locationToday: '', // 今日定位数量
                plantToday: '', // 今日栽植数量
                locationAmount: '', // 累计定位数量
                plantAmount: '', // 累计栽植数量
                plantSection: '',
                smallClassNo: '',
                thinClassNo: '',
                plantSectionTree: '',
                smallClassNoTree: '',
                thinClassNoTree: '',
                treeKind: '',
                treeTypeNo: ''
            });
        }
        if (nextProps.sectionList.length > 0 && nextProps.leftkeycode && nextProps.tabPane === '1') {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            // 获取累计种植，定位信息
            let plantAmount = await getTotalSat({}, {
                statType: 'tree',
                section: nextProps.leftkeycode
            });
            let locationStat = await getLocationStat({}, {
                no: nextProps.leftkeycode,
                section: ''
            });
            // 今日种植棵数， 定位数量
            let plantToday = 0, locationToday = 0;
            let sectionPlantArr = await getCount({}, {
                stime: moment().format('YYYY/MM/DD 00:00:00'),
                etime: moment().format('YYYY/MM/DD 23:59:59'),
                no: nextProps.leftkeycode
            });
            let sectionLocationToday = await getLocationtotalstat({}, {
                section: 'P191',
                stime: moment().format('YYYY/MM/DD 00:00:00'),
                etime: moment().format('YYYY/MM/DD 23:59:59')
            });
            sectionPlantArr.map(item => {
                plantToday += item.Num;
            });
            console.log('sectionLocationToday', sectionLocationToday);
            sectionLocationToday.map(item => {
                locationToday += item.Num;
            });
            this.setState({
                locationToday, // 今日定位数量
                plantToday, // 今日栽植数量
                locationAmount: locationStat.split(',')[1], // 累计定位数量
                plantAmount // 累计栽植数量
            });
            this.onSearchPlant();
            this.onQueryTree();
        }
    }
    column = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (record, text, index) => {
                return <span>{index + 1}</span>;
            },
            width: '20%'
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeName',
            width: '40%'
        },
        {
            title: '数量',
            dataIndex: 'Num',
            width: '40%'
        }
    ]
    render () {
        const {
            plantAmount,
            locationAmount,
            plantToday,
            locationToday,
            spinningPlant,
            spinningTree,
            smallClassList,
            thinClassList,
            smallClassListTree,
            thinClassListTree,
            plantSection,
            smallClassNo,
            thinClassNo,
            nowmessagelist,
            newTreeTypeList,
            treeTypeRanking,
            plantSectionTree,
            smallClassNoTree,
            thinClassNoTree,
            treeKind,
            treeTypeNo,
            treeTypeDisplayTable,
            startDate,
            endDate
        } = this.state;
        const { treeKindList, treeTypeList } = this.props;
        return (
            <div>
                <div >
                    <h2>实时数据：{moment().format('HH:mm:ss')}</h2>
                    <div>
                        <Card title='关键数据' style={{float: 'left', width: 800}}>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计种植数量</h3>
                                <div style={basicDataStyle}>{plantAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计定位数量</h3>
                                <div style={basicDataStyle}>{locationAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日种植数量</h3>
                                <div style={basicDataStyle}>{plantToday}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日定位数量</h3>
                                <div style={basicDataStyle}>{locationToday}</div>
                            </Card.Grid>
                        </Card>
                        <List size='small' style={{marginLeft: 820, height: 180}}
                            header={<div>实时种植数据</div>} dataSource={nowmessagelist} />
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>栽植完成情况统计</h2>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <Form.Item
                                label='标段'
                            >
                                <Select
                                    style={{ width: 120 }}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={this.handleSection.bind(this)}
                                    value={plantSection}
                                    allowClear>
                                    {
                                        this.sectionList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 120 }}
                                    onChange={this.handleSmallClass.bind(this)}
                                    value={smallClassNo}>
                                    {
                                        smallClassList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 120 }}
                                    onChange={this.handleThinClass.bind(this)}
                                    value={thinClassNo}>
                                    {
                                        thinClassList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Button type='primary' onClick={this.onSearchPlant.bind(this)}>查询</Button>
                        </Form>
                    </div>
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='栽植/待栽植'>
                                    <Spin spinning={spinningPlant}>
                                        <div
                                            id='plantCake'
                                            style={{ width: '100%', height: '300px' }}
                                        />
                                    </Spin>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title='定位/未定位' extra={<span>仅针对已栽植</span>}>
                                    <Spin spinning={spinningPlant}>
                                        <div
                                            id='localtionCake'
                                            style={{ width: '100%', height: '300px' }}
                                        />
                                    </Spin>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>树种统计</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='标段'
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 120 }}
                                    onChange={this.handleSectionTree.bind(this)}
                                    value={plantSectionTree}
                                    allowClear>
                                    {
                                        this.sectionList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 120 }}
                                    onChange={this.handleSmallClassTree.bind(this)}
                                    value={smallClassNoTree}>
                                    {
                                        smallClassListTree.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 120 }}
                                    onChange={this.handleThinClassTree.bind(this)}
                                    value={thinClassNoTree}>
                                    {
                                        thinClassListTree.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='种植时间'>
                                <RangePicker showTime={{ format: 'HH:mm:ss' }}
                                    format={dateFormat}
                                    defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
                                    onChange={this.handleTreeTypeDate.bind(this)} />
                            </Form.Item>
                            <Form.Item
                                label='类型'
                            >
                                <Select
                                    allowClear
                                    style={{width: 150}}
                                    value={treeKind}
                                    onChange={this.onTypeChange.bind(this)}
                                >
                                    {
                                        treeKindList.map(item => {
                                            return <Option value={item.value} key={item.value}>{item.title}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='树种'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width: 150}}
                                    defaultValue='全部'
                                    value={treeTypeNo}
                                    onChange={this.onTreeTypeChange.bind(this)}
                                >
                                    {
                                        newTreeTypeList.length > 0 ? newTreeTypeList.map(item => {
                                            return <Option value={item.ID} key={item.ID}>{item.TreeTypeName}</Option>;
                                        }) : treeTypeList.map(item => {
                                            return <Option value={item.ID} key={item.ID}>{item.TreeTypeName}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                style={{float: 'right'}}
                            >
                                <Button style={{float: 'right'}} type='primary' onClick={this.onQueryTree.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='树种分布' extra={<Button type='primary' onClick={this.handleDistributionExport.bind(this)}>导出</Button>}>
                                    <Spin spinning={spinningTree}>
                                        <div
                                            id='TreeTypeCake'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Spin>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title='树种排名'
                                    extra={
                                        <div>
                                            <a onClick={this.handleTreeTypeDisplayChange.bind(this)}>
                                                {treeTypeDisplayTable ? '图形展示' : '表格展示'}
                                            </a>
                                            <Button style={{marginLeft: 10}} type='primary'
                                                onClick={this.handleRankingExport.bind(this)}>
                                                导出
                                            </Button>
                                        </div>
                                    }
                                >
                                    {
                                        treeTypeDisplayTable
                                            ? <div
                                                style={{ width: '100%', height: '350px' }}
                                            >
                                                <Table
                                                    dataSource={treeTypeRanking}
                                                    columns={this.column}
                                                    rowKey='index'
                                                    bordered
                                                    pagination={false}
                                                    scroll={{ y: 291 }}
                                                    style={{height: '100%'}}
                                                />
                                            </div>
                                            : <Spin spinning={spinningPlant}>
                                                <div
                                                    id='TreeTypeRanking'
                                                    style={{ width: '100%', height: '350px' }}
                                                />
                                            </Spin>
                                    }
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
    handleTreeTypeDate = (date, dateString) => {
        this.setState({
            startDate: dateString[0],
            endDate: dateString[1]
        });
    }
    onQueryTree () {
        const {
            treeTypeNo,
            thinClassNoTree,
            smallClassNoTree,
            plantSectionTree,
            startDate,
            endDate
        } = this.state;
        const { getStatByTreetype } = this.props.actions;
        this.setState({
            spinningTree: true
        });
        let smallNo = '', thinNo = '';
        if (thinClassNoTree) {
            let arr = thinClassNoTree.split('-');
            thinNo = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
        } else if (smallClassNoTree) {
            let arr = smallClassNoTree.split('-');
            smallNo = arr[0] + '-' + arr[1] + '-' + arr[3];
        }
        getStatByTreetype({}, {
            no: thinNo || smallNo || this.leftkeycode,
            section: plantSectionTree || '',
            treetype: treeTypeNo,
            stime: startDate,
            etime: endDate
        }).then(rep => {
            // 将获取的数据按照 Num 排序
            rep.sort(function (a, b) {
                if (a.Num > b.Num) {
                    return -1;
                } else if (a.Num < b.Num) {
                    return 1;
                } else {
                    return 0;
                }
            });
            this.setState({
                treeTypeRanking: rep
            }, () => {
                this.renderTreeTypeCake();
                this.renderTreeTypeRanking();
            });
        });
    }
    renderTreeTypeRanking () {
        const { treeTypeRanking } = this.state;
        let treetypeName = [], treetypeNum = [];
        treeTypeRanking.map((item, index) => {
            if (index < 4) {
                treetypeName.push(item.TreeTypeName);
                treetypeNum.push(item.Num);
            }
        });
        var myChart = echarts.init(document.getElementById('TreeTypeRanking'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: treetypeName
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: treetypeNum
                }
            ]
        };
        myChart.setOption(option);
        this.setState({
            spinningTree: false
        });
    }
    renderTreeTypeCake () {
        const { treeTypeRanking } = this.state;
        const { treeKindList } = this.props;
        let cakeData = [];
        treeKindList.map(item => {
            if (item.value) {
                let Sum = 0;
                treeTypeRanking.map(record => {
                    if (item.value && item.value === record.TreeTypeNo.slice(0, 1)) {
                        Sum += record.Num;
                    }
                });
                cakeData.push({
                    name: item.title,
                    value: Sum
                });
            }
        });
        var myChart = echarts.init(document.getElementById('TreeTypeCake'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['常绿乔木', '落叶乔木', '亚乔木', '灌木', '地被']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: cakeData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            }]
        };
        myChart.setOption(option);
    }
    handleSmallClassTree (value) {
        const { smallClassListTree } = this.state;
        let thinClassListTree = [];
        smallClassListTree.map(item => {
            if (item.No === value) {
                thinClassListTree = item.children;
            }
        });
        this.setState({
            thinClassListTree,
            smallClassNoTree: value,
            thinClassNoTree: ''
        });
    }
    handleThinClassTree (value) {
        this.setState({
            thinClassNoTree: value
        });
    }
    handleSectionTree (value) {
        let smallClassListTree = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                smallClassListTree = item.children;
            }
        });
        this.setState({
            smallClassListTree,
            plantSectionTree: value,
            smallClassNoTree: '',
            thinClassNoTree: ''
        });
    }
    handleSection (value) {
        let smallClassList = [];
        this.sectionList.map(item => {
            if (item.No === value) {
                smallClassList = item.children;
            }
        });
        this.setState({
            smallClassList,
            plantSection: value,
            smallClassNo: '',
            thinClassNo: ''
        });
    }
    handleSmallClass (value) {
        const { smallClassList } = this.state;
        let thinClassList = [];
        smallClassList.map(item => {
            if (item.No === value) {
                thinClassList = item.children;
            }
        });
        this.setState({
            thinClassList,
            smallClassNo: value,
            thinClassNo: ''
        });
    }
    handleThinClass (value) {
        this.setState({
            thinClassNo: value
        });
    }
    onSearchPlant () {
        const { getTreePlanting, getLocationStat } = this.props.actions;
        const { plantSection, thinClassNo, smallClassNo } = this.state;
        console.log('thinClassNo', thinClassNo);
        this.setState({
            spinningPlant: true
        });
        let smallNo = '', thinNo = '';
        if (smallClassNo) {
            let arr = smallClassNo.split('-');
            smallNo = arr[0] + '-' + arr[1] + '-' + arr[3];
        }
        if (thinClassNo) {
            let arr = thinClassNo.split('-');
            thinNo = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
        }
        console.log('thinNo', thinNo, smallNo);
        getTreePlanting({}, {
            no: thinNo || smallNo || this.leftkeycode,
            section: plantSection || ''
        }).then(rep => {
            let plantArr = rep.split(',');
            this.renderPlantCake(plantArr[1], plantArr[0]);
        });
        getLocationStat({}, {
            no: thinNo || smallNo || this.leftkeycode,
            section: plantSection
        }).then(rep => {
            let localtionArr = rep.split(',');
            this.renderLocaltionCake(localtionArr[1], localtionArr[0]);
        });
    }
    renderLocaltionCake (localtionNum, unLocaltionNum) {
        var myChart = echarts.init(document.getElementById('localtionCake'));
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'left',
                data: ['未定位', '已定位']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: unLocaltionNum, name: '未定位'},
                        {value: localtionNum, name: '已定位'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        this.setState({
            spinningPlant: false
        });
    }
    renderPlantCake (plantNum, unPlantNum) {
        let myChart = echarts.init(document.getElementById('plantCake'));
        let options = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'left',
                data: ['待栽植', '已栽植']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: unPlantNum, name: '待栽植'},
                        {value: plantNum, name: '已栽植'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(options);
    }
    handleTreeTypeDisplayChange = () => {
        const {
            treeTypeDisplayTable
        } = this.state;
        this.setState({
            treeTypeDisplayTable: !treeTypeDisplayTable
        });
    }
    onTypeChange (value) {
        const { treeTypeList } = this.props;
        let newTreeTypeList = [];
        console.log('treeTypeList', treeTypeList);
        if (!value) {
            this.setState({
                treeKind: '',
                treeTypeNo: '',
                newTreeTypeList: []
            });
            return;
        }
        treeTypeList.map(item => {
            if (item.TreeTypeNo) {
                let code = item.TreeTypeNo.substr(0, 1);
                if (code === value) {
                    newTreeTypeList.push(item);
                }
            }
        });
        console.log('newTreeTypeList', newTreeTypeList);
        this.setState({
            treeKind: value,
            newTreeTypeList
        });
    }
    onTreeTypeChange (value) {
        this.setState({
            treeTypeNo: value
        });
    }
    handleRankingExport () {
        const { treeTypeRanking } = this.state;
        let tblData = []; // 表格数据
        treeTypeRanking.map(record => {
            tblData.push({
                '树种': record.TreeTypeName,
                '数量': record.Num
            });
        });
        this.handleExport(tblData, ['树种', '数量'], '树种排名.xlsx');
    }
    handleDistributionExport () {
        const { treeTypeRanking } = this.state;
        const { treeKindList } = this.props;
        let tblData = []; // 表格数据
        treeKindList.map(item => {
            if (item.value) {
                let Sum = 0;
                treeTypeRanking.map(record => {
                    if (item.value && item.value === record.TreeTypeNo.slice(0, 1)) {
                        Sum += record.Num;
                    }
                });
                tblData.push({
                    '树种分类': item.title,
                    '数量': Sum
                });
            }
        });
        this.handleExport(tblData, ['树种分类', '数量'], '树种分布.xlsx');
    }
    handleExport (tblData, _headers, title) {
        if (!(tblData && tblData instanceof Array && tblData.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
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
        XLSX.writeFile(wb, title);
    }
}

export default PlantStrength;

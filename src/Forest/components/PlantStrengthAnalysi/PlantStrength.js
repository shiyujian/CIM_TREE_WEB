import React, {Component} from 'react';
import { Card, Row, Col, List, Form, Select, Button } from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import echarts from 'echarts';

import '../index.less';
const gridStyle = {
    width: '25%',
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
class PlantStrength extends Component {
    constructor (props) {
        super(props);
        this.state = {
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
            treeTypeList: [], // 树种列表
            plantAmount: 0, // 累计种植数量
            plantToday: 0, // 今日种植总数
            locationToday: 0, // 今日定位数量
            locationAmount: 0, // 累计定位总数
            nowmessagelist: [] // 实时种植数据列表
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
    }
    componentDidMount = async () => {

    }
    componentWillReceiveProps = async (nextProps) => {
        const {
            actions: { getTotalSat, getLocationStat, getCount, getLocationStatBySpecfield }
        } = this.props;
        if (this.props.sectionList !== nextProps.sectionList && this.props.leftkeycode !== nextProps.leftkeycode) {
            this.sectionList = nextProps.sectionList;
            this.leftkeycode = nextProps.leftkeycode;
            console.log(this.sectionList, 'this.sectionList');
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
            let sectionLocationToday = await getLocationStatBySpecfield({}, {
                stattype: 'smallclass',
                section: 'P191',
                stime: '',
                etime: ''
            });
            sectionPlantArr.map(item => {
                plantToday += item.Num;
            });
            sectionLocationToday.map(item => {
                locationToday += item.Num;
            });
            this.setState({
                locationToday, // 今日定位数量
                plantToday, // 今日栽植数量
                locationAmount: locationStat.split(',')[0], // 累计定位数量
                plantAmount, // 累计栽植数量
                leftkeycode: nextProps.leftkeycode, // 项目code
                sectionList: nextProps.sectionList // 标段列表
            });
            this.onSearchPlant();
        }
    }

    render () {
        const {
            plantAmount, locationAmount, plantToday, locationToday,
            smallClassList, thinClassList, smallClassListTree, thinClassListTree,
            plantSection, smallClassNo, thinClassNo, nowmessagelist,
            plantSectionTree, smallClassNoTree, thinClassNoTree, treeKind, treeTypeList, treeTypeNo
        } = this.state;
        const { treeCategory } = this.props;
        return (
            <div>
                <div>
                    <h2>实时数据：{moment().format('HH:mm:ss')}</h2>
                    <div>
                        <Card title='关键数据' style={{float: 'left', width: 800}}>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计种植数量</h3>
                                <div style={{fontSize: 26}}>{plantAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木累计定位数量</h3>
                                <div style={{fontSize: 26}}>{locationAmount}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日种植数量</h3>
                                <div style={{fontSize: 26}}>{plantToday}</div>
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>
                                <h3>苗木今日定位数量</h3>
                                <div style={{fontSize: 26}}>{locationToday}</div>
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
                                <Select style={{ width: 120 }} onChange={this.handleSection.bind(this)} value={plantSection}>
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
                                <Select style={{ width: 120 }} onChange={this.handleSmallClass.bind(this)} value={smallClassNo}>
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
                                <Select style={{ width: 120 }} onChange={this.handleThinClass.bind(this)} value={thinClassNo}>
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
                                    <div
                                        id='plantCake'
                                        style={{ width: '100%', height: '300px' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title='定位/未定位'>
                                    <div
                                        id='localtionCake'
                                        style={{ width: '100%', height: '300px' }}
                                    />
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
                                <Select style={{ width: 120 }} onChange={this.handleSectionTree.bind(this)} value={plantSectionTree}>
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
                                <Select style={{ width: 120 }} onChange={this.handleSmallClassTree.bind(this)} value={smallClassNoTree}>
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
                                <Select style={{ width: 120 }} onChange={this.handleThinClassTree.bind(this)} value={thinClassNoTree}>
                                    {
                                        thinClassListTree.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
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
                                        treeCategory.map(item => {
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
                                    style={{width: 150}}
                                    defaultValue='全部'
                                    value={treeTypeNo}
                                    onChange={this.onTreeTypeChange.bind(this)}
                                >
                                    {
                                        treeTypeList.map(item => {
                                            return <Option value={item.value} key={item.value}>{item.title}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary' onClick={this.onQueryTree.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        {/* <Row gutter={16}>
                            <Col span={12}>
                                <Card title='树种分布'><FB {...this.state} {...this.props} /></Card>
                            </Col>
                            <Col span={12}>
                                <Card title='树种排名'
                                    extra={
                                        <div>
                                            <a onClick={this.handleTreeTypeDisplayChange.bind(this)}>
                                                {treeTypeDisplayTable ? '图形展示' : '表格展示'}
                                            </a>
                                            <a style={{marginLeft: 10}}
                                                onClick={this.handleTreeTypeDataExport.bind(this)}>
                                                导出
                                            </a>
                                        </div>
                                    }
                                >
                                    {
                                        treeTypeDisplayTable
                                            ? <PM1 {...this.state} {...this.props} />
                                            : <PM2 {...this.state} {...this.props} />
                                    }
                                </Card>
                            </Col>
                        </Row> */}
                    </div>
                </div>
            </div>
        );
    }
    onQueryTree () {

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
            plantSectionTree: value
        });
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
            smallClassNoTree: value
        });
    }
    handleThinClassTree (value) {
        this.setState({
            thinClassNoTree: value
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
            plantSection: value
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
            smallClassNo: value
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
        getTreePlanting({}, {
            no: thinClassNo || smallClassNo || plantSection || this.leftkeycode,
            section: plantSection
        }).then(rep => {
            let plantArr = rep.split(',');
            this.renderPlantCake(plantArr[1], plantArr[0]);
        });
        getLocationStat({}, {
            no: thinClassNo || smallClassNo || plantSection || this.leftkeycode,
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
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({
            bigTypeSearch: value || '',
            treetypeSearch: '',
            treetypename: ''
        });
    }
    onTreeTypeChange (value) {

    }

    handleTreeTypeDataExport = () => {
    
    }

    handleExport = async () => {

    }
}

export default PlantStrength;
import React, { Component } from 'react';
import { Button, Radio, Modal, Tabs, Table, Form, Input, Select, Tree, Spin, Row, Col } from 'antd';
import echarts from 'echarts';
import {
    Sidebar,
} from '_platform/components/layout';
import './CoverageModal.less';
const TreeNode = Tree.TreeNode;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const Option = Select.Option;
export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
            project: '',
            section: '',
            type: 'tree',
            node: 'treetype',
            projectSectionVisible: false, // 整体情况查看
            dataList: [{
                order: 1,
                project: '2018秋季造林',
                section: '1标段',
                num: '10000'
            }, {
                order: 2,
                project: '2019秋季造林',
                section: '1标段',
                num: '10000'
            }]
        };
        this.editPolygon = ''; // 面积图层
        this.editPolyline = '';
        this.distanceMeasureMarkerList = {};
    }
    componentDidMount () {
        // this.InitProjectECharts();
        this.InitOverallECharts();
        this.InitTreeTypeECharts();
    }
    InitTreeTypeECharts () {
        let myChart = echarts.init(document.getElementById('treeTypeECharts'));
        let option = {
            title: {
                text: '总栽植量',
                subtext: '123,324 棵',
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                            width: 120
                        },
                        unum: {
                            width: 40
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', lilv = '';
                    datas.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            lilv = item.lilv;
                        }
                    });
                    return `{name|${name}} {unum|${lilv}%} ${value}`;
                },
                data: ['19年春季造林', '19年秋季造林', '19年秋季雄县造林', '19年秋季安新县造林', '19年秋季市场化造林']
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: datas
                }
            ]
        };
        myChart.setOption(option);
    }
    InitOverallECharts () {
        let myChart = echarts.init(document.getElementById('overallECharts'));
        let datas = [
            {value: 335, name: '19年春季造林', sum: 10000, lilv: 23},
            {value: 310, name: '19年秋季造林', sum: 10000, lilv: 23},
            {value: 234, name: '19年秋季雄县造林', sum: 10000, lilv: 23},
            {value: 135, name: '19年秋季安新县造林', sum: 10000, lilv: 23},
            {value: 1548, name: '19年秋季市场化造林', sum: 10000, lilv: 23}
        ];
        let option = {
            title: {
                text: '总栽植量',
                subtext: '123,324 棵',
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                            width: 120
                        },
                        unum: {
                            width: 40
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', lilv = '';
                    datas.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            lilv = item.lilv;
                        }
                    });
                    return `{name|${name}} {unum|${lilv}%} ${value}`;
                },
                data: ['19年春季造林', '19年秋季造林', '19年秋季雄县造林', '19年秋季安新县造林', '19年秋季市场化造林']
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: datas
                }
            ]
        };
        myChart.setOption(option);
    }
    InitProjectECharts () {
        let myChart = echarts.init(document.getElementById('projectECharts'));
        let datas = [
            {value: 335, name: '19年春季造林', sum: 10000, lilv: 23},
            {value: 310, name: '19年秋季造林', sum: 10000, lilv: 23},
            {value: 234, name: '19年秋季雄县造林', sum: 10000, lilv: 23},
            {value: 135, name: '19年秋季安新县造林', sum: 10000, lilv: 23},
            {value: 1548, name: '19年秋季市场化造林', sum: 10000, lilv: 23}
        ];
        let option = {
            title: {
                text: '总栽植量',
                subtext: '123,324 棵',
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                            width: 120
                        },
                        unum: {
                            width: 40
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', lilv = '';
                    datas.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            lilv = item.lilv;
                        }
                    });
                    return `{name|${name}} {unum|${lilv}%} ${value}`;
                },
                data: ['19年春季造林', '19年秋季造林', '19年秋季雄县造林', '19年秋季安新县造林', '19年秋季市场化造林']
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: datas
                }
            ]
        };
        myChart.setOption(option);
    }
    handleTypeChange (e) {
        this.setState({
            type: e.target.value
        });
    }
    handleNodeChange (e) {
        let node = e.target.value || '';
        this.setState({
            node
        }, () => {
            if (node === 'project') {
                this.InitProjectECharts();
            }
        });
    }
    onProjectChange () {

    }
    onSectionChange () {
        
    }
    onQuery () {

    }
    onExport () {

    }
    onSelectTree () {

    }
    onSeeProjectSection (type) {
        this.setState({
            projectSectionVisible: true
        }, () => {
            if (type === 'treeType') {
                this.InitTreeTypeECharts();
            } else if (type === 'overall') {
                this.InitOverallECharts();
            }
        });
    }
    render () {
        const {
            projectSectionVisible,
            dataList,
            project,
            section,
            type,
            node
        } = this.state;
        const { treeData } = this.props;
        console.log('树列表', treeData);
        let loading = true;
        if (treeData.length > 0) {
            loading = false;
        }
        return (
            <Modal
                visible
                width='750px'
                title='图层解析'
                footer={null}
                className='coverage_modal'
            >
                <Tabs defaultActiveKey='1' tabBarExtraContent={
                    <Radio.Group value={type} onChange={this.handleTypeChange.bind(this)}>
                        <Radio.Button value='tree'>苗木</Radio.Button>
                        <Radio.Button value='pipeline'>灌溉管网</Radio.Button>
                    </Radio.Group>
                }>
                    <TabPane tab='统计数据' key='1'>
                        {
                            node === 'project' ? <div
                                id='projectECharts'
                                style={{ width: '650px', height: '350px' }}
                            /> : ''
                        }
                        {
                            node === 'section' ? (
                                projectSectionVisible === false ? <div>
                                    <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                        <a href='#' onClick={this.onSeeProjectSection.bind(this, 'overall')}>项目标段查看</a>
                                        <Button type='primary' style={{float: 'right'}}>导出</Button>
                                    </div>
                                    <Table
                                        bordered
                                        columns={this.columns}
                                        rowKey='order'
                                        dataSource={dataList}
                                    />
                                </div> : <div style={{overflow: 'hidden'}}>
                                    <Spin spinning={loading}>
                                        <div className='TreeSidebar'>
                                            <Tree
                                                showLine
                                                onSelect={this.onSelectTree.bind(this)}
                                            >
                                                {
                                                    treeData.map(item => {
                                                        return (
                                                            <TreeNode
                                                                selectable={false}
                                                                title={item.Name}
                                                                key={item.No}
                                                            >
                                                                {item.Name}
                                                            </TreeNode>
                                                        );
                                                    })
                                                }
                                            </Tree>
                                        </div>
                                        <div
                                            id='overallECharts'
                                            style={{ float: 'left', width: '510px', height: '350px' }}
                                        />
                                    </Spin>
                                </div>
                            ) : ''
                        }
                        {
                            node === 'treetype' ? (
                                projectSectionVisible === false ? <div>
                                    <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                        <a href='#' onClick={this.onSeeProjectSection.bind(this, 'treeType')}>项目标段查看</a>
                                        <Button type='primary' style={{float: 'right'}}>导出</Button>
                                    </div>
                                    <Table
                                        bordered
                                        columns={this.columns3}
                                        rowKey='order'
                                        dataSource={dataList}
                                    />
                                </div> : <div>
                                    <Spin spinning={loading}>
                                        <div className='TreeSidebar'>
                                            <Tree
                                                showLine
                                                onSelect={this.onSelectTree.bind(this)}
                                            >
                                                {
                                                    treeData.map(item => {
                                                        return (
                                                            <TreeNode
                                                                selectable={false}
                                                                title={item.Name}
                                                                key={item.No}
                                                            >
                                                                {item.Name}
                                                            </TreeNode>
                                                        );
                                                    })
                                                }
                                            </Tree>
                                        </div>
                                        <div
                                            id='treeTypeECharts'
                                            style={{ float: 'left', width: '510px', height: '350px' }}
                                        />
                                    </Spin>
                                </div>
                            ) : ''
                        }
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Radio.Group value={node} onChange={this.handleNodeChange.bind(this)}>
                                <Radio.Button value='project'>涉及项目</Radio.Button>
                                <Radio.Button value='section'>涉及标段</Radio.Button>
                                <Radio.Button value='treetype'>涉及树种</Radio.Button>
                            </Radio.Group>
                        </div>
                    </TabPane>
                    <TabPane tab='详细信息' key='2'>
                        <Form {...formItemLayout} layout='inline'>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label='项目'
                                    >
                                        <Select
                                            style={{width: 160}}
                                            value={project}
                                            onChange={this.onProjectChange.bind(this)}
                                        >
                                            <Option key={type.ID} value={type.ID} >2019秋季造林</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label='标段'
                                    >
                                        <Select
                                            style={{width: 160}}
                                            value={section}
                                            onChange={this.onSectionChange.bind(this)}
                                        >
                                            <Option key={type.ID} value={type.ID} >一标段</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={2} />
                                <Col span={3}>
                                    <Form.Item
                                    >
                                        <Button onClick={this.onQuery.bind(this)}>查询</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item
                                    >
                                        <Button onClick={this.onExport.bind(this)}>导出</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            bordered
                            columns={this.columns2}
                            rowKey='order'
                            dataSource={dataList}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '项目',
            dataIndex: 'project'
        },
        {
            title: '标段',
            dataIndex: 'section'
        },
        {
            title: '苗木数量',
            dataIndex: 'num'
        }
    ]
    columns2 = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '项目',
            dataIndex: 'project'
        },
        {
            title: '标段',
            dataIndex: 'section'
        }
    ]
    columns3 = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '树种',
            dataIndex: 'treeType'
        },
        {
            title: '苗木数量',
            dataIndex: 'num'
        }
    ]
};

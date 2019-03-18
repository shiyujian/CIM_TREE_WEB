import React, {Component} from 'react';
import { Row, Col, Card, DatePicker } from 'antd';
import moment from 'moment';
// import './index.less';
import echarts from 'echarts';
import { Sidebar } from '_platform/components/layout';
import PkCodeTree from '../PkCodeTree';
import { getAreaTreeData, getDefaultProject } from '_platform/auth';

export default class SectionAlone extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeList: [], // 树列表数据
            sectionObjList: [], // 标段对象列表
            jobSumDate: '', // 施工账号注册总数日期
            jobNumDate: '', // 施工日活跃账号数日期
            superviseSumDate: '', // 监理账号注册总数日期
            superviseNumDate: '', // 监理日活跃账号数日期
            leftkeycode: '' // 选择项目code
        };
        this.handleDate = this.handleDate.bind(this); // 切换截至日期1
        this.handleDateTwo = this.handleDateTwo.bind(this); // 切换截至日期2
        this.handleDateThree = this.handleDateThree.bind(this); // 切换截至日期3
        this.handleDateFour = this.handleDateFour.bind(this); // 切换截至日期4
        this.renderJobRegisterSum = this.renderJobRegisterSum.bind(this); // 渲染施工账号注册总数图表
        this.renderJobDynamicNum = this.renderJobDynamicNum.bind(this); // 渲染日活跃账号数图表
        this.renderSuperviseRegisterSum = this.renderSuperviseRegisterSum.bind(this); // 渲染监理账号注册总数图表
        this.renderSuperviseDynamicNum = this.renderSuperviseDynamicNum.bind(this); // 渲染监理日活跃账号数图表
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                let projectList = data.projectList || [];
                // 区域地块树
                await getThinClassTree(projectList);
            }
            let defaultProject = await getDefaultProject();
            console.log('defaultProject', defaultProject);
            if (defaultProject) {
                this.onSelect([defaultProject]);
            }
            this.renderJobRegisterSum();
            this.renderJobDynamicNum();
            this.renderSuperviseRegisterSum();
            this.renderSuperviseDynamicNum();
        } catch (e) {
            console.log('e', e);
        }
    }
    componentWillReceiveProps (nextProps) {
        const { tree } = nextProps.platform;
        if (tree) {
            console.log('componentWillReceiveProps', nextProps.platform.tree);
            this.setState({
                treeList: tree.bigTreeList
            });
        }
    }

    render () {
        const { leftkeycode, treeList } = this.state;
        return (
            <div>
                <Sidebar width={190}>
                    {
                        treeList.length > 0 ? <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        /> : ''
                    }
                </Sidebar>
                <div style={{marginLeft: '200px'}}>
                    <div>
                        <h2>施工单位</h2>
                        <div style={{ background: '#ECECEC', padding: '30px', height: 550 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title='账号注册总数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} onChange={this.handleDate.bind(this)} /></span>}>
                                        <div
                                            id='jobRegisterSum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} onChange={this.handleDateTwo.bind(this)} /></span>}>
                                        <div
                                            id='jobDynamicNum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div>
                        <h2>监理单位</h2>
                        <div style={{ background: '#ECECEC', padding: '30px', height: 550 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title='账号注册总数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} onChange={this.handleDateThree.bind(this)} /></span>}>
                                        <div
                                            id='superviseRegisterSum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数' bordered={false} extra={<span>截至日期：<DatePicker defaultValue={moment()} onChange={this.handleDateFour.bind(this)} /></span>}>
                                        <div
                                            id='superviseDynamicNum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    onSelect (keys) {
        const { treeList } = this.state;
        console.log('selct', treeList);
        let leftkeycode = keys[0] || '';
        let sectionObjList = [];
        treeList.map(item => {
            if (item.No === leftkeycode) {
                sectionObjList = item.children;
            }
        });
        console.log(leftkeycode, '123');
        this.setState({
            leftkeycode,
            sectionObjList
        });
    }
    // 切换标签页
    handleTabChangele = async (key) => {
        this.setState({
            tabKey: key
        });
    }
    handleDate (date, dateString) {
        this.setState({
            jobSumDate: dateString
        }, () => {
            this.renderJobRegisterSum();
        });
    }
    renderJobRegisterSum () {
        const { sectionObjList, leftkeycode } = this.state;
        console.log('treeList', sectionObjList, leftkeycode);
        let xAxisArr = [];
        sectionObjList.map(item => {
            xAxisArr.push(item.Name);
        });
        let myChart = echarts.init(document.getElementById('jobRegisterSum'));
        let option = {
            xAxis: {
                type: 'category',
                data: xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
    handleDateTwo (date, dateString) {
        this.setState({
            jobNumDate: dateString
        }, () => {
            this.renderJobDynamicNum();
        });
    }
    renderJobDynamicNum () {
        let myChart = echarts.init(document.getElementById('jobDynamicNum'));
        let option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
    handleDateThree (date, dateString) {
        this.setState({
            superviseSumDate: dateString
        }, () => {
            this.renderSuperviseRegisterSum();
        });
    }
    renderSuperviseRegisterSum () {
        let myChart = echarts.init(document.getElementById('superviseRegisterSum'));
        let option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
    handleDateFour (date, dateString) {
        this.setState({
            superviseNumDate: dateString
        }, () => {
            this.renderSuperviseDynamicNum();
        });
    }
    renderSuperviseDynamicNum () {
        let myChart = echarts.init(document.getElementById('superviseDynamicNum'));
        let option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
}

import React, {Component} from 'react';
import { Row, Col, Card, DatePicker } from 'antd';
import moment from 'moment';
import echarts from 'echarts';
import { Sidebar } from '_platform/components/layout';
import PkCodeTree from '../PkCodeTree';
import { getDefaultProject } from '_platform/auth';

export default class SectionAlone extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionObjList: [], // 标段对象列表
            jobSumDate: moment().format('YYYY-MM-DD'), // 施工账号注册总数日期
            jobNumDate: moment().format('YYYY-MM-DD'), // 施工日活跃账号数日期
            superviseSumDate: moment().format('YYYY-MM-DD'), // 监理账号注册总数日期
            superviseNumDate: moment().format('YYYY-MM-DD'), // 监理日活跃账号数日期
            leftkeycode: '' // 选择项目code
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
                await getTreeNodeList();
            }
            let defaultProject = await getDefaultProject();
            console.log('defaultProject', defaultProject);
            if (defaultProject) {
                await this.onSelect([defaultProject]);
            }
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const { leftkeycode } = this.state;
        let treeList = (tree && tree.bigTreeList) || [];
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
                                    <Card title='账号注册总数'
                                        bordered={false}
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleDate.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='jobRegisterSum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数'
                                        bordered={false}
                                        extra={
                                            <span>
                                            截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleDateTwo.bind(this)}
                                                />
                                            </span>}>
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
                                    <Card title='账号注册总数'
                                        bordered={false}
                                        extra={
                                            <span>
                                        截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleDateThree.bind(this)}
                                                />
                                            </span>}>
                                        <div
                                            id='superviseRegisterSum'
                                            style={{ width: '100%', height: '350px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='日活跃账号数'
                                        bordered={false}
                                        extra={
                                            <span>
                                         截至日期：
                                                <DatePicker
                                                    defaultValue={moment()}
                                                    onChange={this.handleDateFour.bind(this)}
                                                />
                                            </span>}>
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
    onSelect = async (keys) => {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = (tree && tree.bigTreeList) || [];
        console.log('treeList', treeList);
        let leftkeycode = keys[0] || '';
        let sectionObjList = [];
        treeList.map(item => {
            if (item.No === leftkeycode) {
                sectionObjList = item.children;
            }
        });
        console.log(leftkeycode, '123');
        await this.setState({
            leftkeycode,
            sectionObjList
        }, async () => {
            await this.renderJobRegisterSum();
            await this.renderJobDynamicNum();
            await this.renderSuperviseRegisterSum();
            await this.renderSuperviseDynamicNum();
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
    renderJobRegisterSum = async () => {
        const { sectionObjList, jobSumDate } = this.state;
        const {
            actions: {
                getSectionUserStat
            }
        } = this.props;
        let postData = {
            unittype: 'construction',
            stime: '',
            etime: moment(jobSumDate).format('YYYY-MM-DD')
        };
        let data = await getSectionUserStat({}, postData);
        console.log('data', data);
        let xAxisArr = [];
        let yGrandData = [];
        sectionObjList.map(item => {
            data.map((sectionData) => {
                if (sectionData && sectionData.Section) {
                    if (sectionData.Section === item.No) {
                        xAxisArr.push(item.Name);
                        yGrandData.push(sectionData.Num);
                    }
                }
            });
        });
        let myChart = echarts.init(document.getElementById('jobRegisterSum'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yGrandData,
                type: 'bar',
                name: '账号注册总数'
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
    renderJobDynamicNum = async () => {
        const {
            actions: {
                getSectionUserStat
            }
        } = this.props;
        const {
            jobNumDate,
            sectionObjList
        } = this.state;
        let postData = {
            unittype: 'construction',
            stime: '',
            etime: moment(jobNumDate).format('YYYY-MM-DD')
        };
        let data = await getSectionUserStat({}, postData);
        console.log('data', data);
        let xAxisArr = [];
        let yGrandData = [];
        sectionObjList.map(item => {
            data.map((sectionData) => {
                if (sectionData && sectionData.Section) {
                    if (sectionData.Section === item.No) {
                        xAxisArr.push(item.Name);
                        yGrandData.push(sectionData.Num);
                    }
                }
            });
        });
        let myChart = echarts.init(document.getElementById('jobDynamicNum'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yGrandData,
                type: 'bar',
                name: '日活跃账户数'
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
    renderSuperviseRegisterSum = async () => {
        const {
            actions: {
                getSectionUserStat
            }
        } = this.props;
        const {
            superviseSumDate,
            sectionObjList
        } = this.state;
        let postData = {
            unittype: 'supervisor',
            stime: '',
            etime: moment(superviseSumDate).format('YYYY-MM-DD')
        };
        let data = await getSectionUserStat({}, postData);
        console.log('data', data);
        let xAxisArr = [];
        let yGrandData = [];
        sectionObjList.map(item => {
            data.map((sectionData) => {
                if (sectionData && sectionData.Section) {
                    if (sectionData.Section === item.No) {
                        xAxisArr.push(item.Name);
                        yGrandData.push(sectionData.Num);
                    }
                }
            });
        });
        let myChart = echarts.init(document.getElementById('superviseRegisterSum'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yGrandData,
                type: 'bar',
                name: '账号注册总数'
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
    renderSuperviseDynamicNum = async () => {
        const {
            actions: {
                getSectionUserStat
            }
        } = this.props;
        const {
            superviseNumDate,
            sectionObjList
        } = this.state;
        let postData = {
            unittype: 'supervisor',
            stime: '',
            etime: moment(superviseNumDate).format('YYYY-MM-DD')
        };
        let data = await getSectionUserStat({}, postData);
        console.log('data', data);
        let xAxisArr = [];
        let yGrandData = [];
        sectionObjList.map(item => {
            data.map((sectionData) => {
                if (sectionData && sectionData.Section) {
                    if (sectionData.Section === item.No) {
                        xAxisArr.push(item.Name);
                        yGrandData.push(sectionData.Num);
                    }
                }
            });
        });
        let myChart = echarts.init(document.getElementById('superviseDynamicNum'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisArr
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yGrandData,
                type: 'bar',
                name: '日活跃账户数'
            }]
        };
        myChart.setOption(option);
    }
}

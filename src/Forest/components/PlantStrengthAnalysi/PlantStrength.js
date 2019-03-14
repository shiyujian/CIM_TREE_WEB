import React, {Component} from 'react';
import { Card, Row, Col, List, Form, Select, Button } from 'antd';
import moment from 'moment';
import ZaiZhi from './ZaiZhi'
import DingWei from './DingWei'
import FB from './ShuZhongFB'
import PM1 from './ShuZhongPM1'
import PM2 from './ShuZhongPM2'
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
            leftkeycode: '', // 项目code
            sectionList: [], // 标段列表
            smallClassList: [], // 小班列表
            thinClassList: [], // 细班列表
            smallClassList1: [], // 小班列表1
            thinClassList1: [], // 细班列表1
            plantAmount: 0, // 累计种植数量
            plantToday: 0, // 今日种植总数
            locationToday: 0, // 今日定位数量
            locationAmount: 0, // 累计定位总数
            realTimeDataList: [], // 实时种植数据列表
            sectionSearch: '',
            smallclassSearch: '',
            thinclassSearch: '',
            bigTypeSearch: '',
            treetypeSearch: '',
            treetypename: '',
            sectionName: '',
            smallclassName: '',
            thinclassName: '',
            sectionSearch1: '',
            smallclassSearch1: '',
            thinclassSearch1: '',
            sectionName1: '',
            smallclassName1: '',
            thinclassName1: '',
            treeTypeDisplayTable: false,
            queryTime: 0,
            statByTreetypeQueryTime: 0
        };
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.query2();
        }
    }
    componentDidMount = async () => {
    }
    componentWillReceiveProps = async (nextProps) => {
        const {
            actions: { getTotalSat, getLocationStat, getCount, getLocationStatBySpecfield }
        } = this.props;
        if (nextProps.leftkeycode) {
            console.log('nextProps', nextProps.sectionList);
            console.log('leftkeycode', nextProps.leftkeycode);
            // 获取当前种树信息
            let getTotalSatTreePostdata = {
                statType: 'tree',
                section: nextProps.leftkeycode
            };
            let plantAmount = await getTotalSat({}, getTotalSatTreePostdata);
            let postdata = {
                no: nextProps.leftkeycode,
                section: ''
            };
            let locationStat = await getLocationStat({}, postdata);
            let getCountPostData = {
                stime: moment().format('YYYY/MM/DD 00:00:00'),
                etime: moment().format('YYYY/MM/DD 23:59:59'),
                no: nextProps.leftkeycode
            };
            // 今日种植棵数
            let sectionPlantArr = await getCount({}, getCountPostData);
            let plantToday = 0;
            sectionPlantArr.map(item => {
                plantToday += item.Num;
            });
            let param = {
                stattype: 'smallclass',
                section: 'P191',
                stime: '',
                etime: ''
            };
            let sectionLocationToday = await getLocationStatBySpecfield({}, param);
            let locationToday = 0;
            sectionLocationToday.map(item => {
                locationToday += item.Num;
            });
            this.setState({
                locationToday,
                plantToday,
                locationAmount: locationStat.split(',')[1],
                plantAmount,
                leftkeycode: nextProps.leftkeycode,
                sectionList: nextProps.sectionList
            });
        }
    }

    render () {
        const {
            realTimeDataList, plantAmount, locationAmount, plantToday, locationToday, sectionList,
            smallClassList, thinClassList,
            smallClassList1, thinClassList1,
            thinclassName,smallclassName,sectionName,
            thinclassName1,smallclassName1,sectionName1,
            treeTypeDisplayTable, treetypename,bigTypeSearch
        } = this.state;
        const {
            typeoption,
            treetypeoption
        } = this.props;
        const { getFieldDecorator } = this.props.form;
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
                            header={<div>实时种植数据</div>} dataSource={realTimeDataList} />
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>栽植完成情况统计</h2>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <Form.Item
                                label='标段'
                            >
                                    <Select style={{ width: 120 }} onChange={this.handleSection.bind(this)} value={sectionName}>
                                    {
                                        sectionList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                    <Select style={{ width: 120 }} onChange={this.handleSmallClass.bind(this)} value={smallclassName}>
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
                                    <Select style={{ width: 120 }} onChange={this.handleThinClass.bind(this)} value={thinclassName}>
                                    {
                                        thinClassList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Button type='primary' onClick={this.query1.bind(this)}>查询</Button>
                        </Form>
                    </div>
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card><ZaiZhi {...this.state} {...this.props} /></Card>
                            </Col>
                            <Col span={12}>
                                <Card><DingWei {...this.state} {...this.props} /></Card>
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
                                    <Select style={{ width: 120 }} onChange={this.handleSection1.bind(this)} value={sectionName1}>
                                    {
                                        sectionList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='小班'
                            >
                                    <Select style={{ width: 120 }} onChange={this.handleSmallClass1.bind(this)} value={smallclassName1}>
                                    {
                                        smallClassList1.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='细班'
                            >
                                    <Select style={{ width: 120 }} onChange={this.handleThinClass1.bind(this)} value={thinclassName1}>
                                    {
                                        thinClassList1.map(item => {
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
                                        defaultValue='全部'
                                        style={{width: 150}}
                                        value={bigTypeSearch}
                                        onChange={this.onTypeChange.bind(this)}
                                    >
                                        {typeoption}
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
                                        value={treetypename}
                                        onChange={this.onTreeTypeChange.bind(this)}
                                    >
                                        {treetypeoption}
                                    </Select>
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary' onClick={this.query2.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
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
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>种植进度分析</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='总种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各标段种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='各小班种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各细班种植进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={titleStyle}>定位进度分析</h2>
                        <Form layout='inline'>
                            <Form.Item
                                label='树种'
                            >
                                {getFieldDecorator('section')(
                                    <Select style={{ width: 120 }} disabled>
                                        <Option value='lucy'>Lucy</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type='primary'>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={CardStyle}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title='各小班定位进度分析' bordered={false}>Card content</Card>
                            </Col>
                            <Col span={12}>
                                <Card title='各细班定位进度分析' bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
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
        this.setState({ bigTypeSearch: value || '', treetypeSearch: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetypeSearch: value, treetypename: value });
    }
    handleTreeTypeDataExport = () => {
        const {
            statByTreetype
        } = this.state;
        let tblData = [];
        if (!(statByTreetype && statByTreetype instanceof Array && statByTreetype.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        statByTreetype.sort(function (a, b) {
            if (a.Num > b.Num) {
                return -1;
            } else if (a.Num < b.Num) {
                return 1;
            } else {
                return 0;
            }
        });
        statByTreetype.map((data, index) => {
            let obj = {};
            obj['树种'] = data.TreeTypeName;
            obj['数量'] = data.Num;
            tblData.push(obj);
        });

        let _headers = ['树种', '数量'];
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
        XLSX.writeFile(wb, `树种排名.xlsx`);
    }

    handleTreeBigTypeDataExport = async () => {
        const {
            statByTreetype
        } = this.state;
        if (!(statByTreetype && statByTreetype instanceof Array && statByTreetype.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        let tblData = [];
        let treetypeData = this.getTreetypeData();
        if (statByTreetype && statByTreetype instanceof Array) {
            for (let t = 0; t < statByTreetype.length; t++) {
                if (statByTreetype[t].TreeTypeNo) {
                    let bigTreeType = statByTreetype[t].TreeTypeNo.substr(0, 1);
                    for (let s = 0; s < treetypeData.length; s++) {
                        if (Number(bigTreeType) === Number(treetypeData[s].id)) {
                            treetypeData[s].value = treetypeData[s].value + statByTreetype[t].Num;
                        }
                    }
                }
            }
        }
        treetypeData.map((data, index) => {
            let obj = {};
            obj['树种'] = data.name;
            obj['数量'] = data.value;
            tblData.push(obj);
        });
        let _headers = ['树种', '数量'];
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
        XLSX.writeFile(wb, `树种分布.xlsx`);
    }
    query1 () {
        this.setState({
            queryTime: moment().unix()
        })
    }
    query2 () {
        const {
            sectionSearch1 = '',
            treetypeSearch = '',
            thinclassSearch1 = '',
            smallclassSearch1 = ''
        } = this.state;
        const {
            actions: {
                getStatByTreetype
            },
            leftkeycode
        } = this.props;
        try {
            if (!leftkeycode) {
                Notification.info({
                    message: '请选择项目',
                    duration: 3
                });
                return;
            }
            let no = '';
            if (thinclassSearch1) {
                let arr = thinclassSearch1.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
            } else if (smallclassSearch1) {
                let arr = smallclassSearch.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3];
            } else if (leftkeycode) {
                no = leftkeycode;
            }

            let postdata = {
                no: no,
                section: sectionSearch1,
                treetype: treetypeSearch
            };
            this.setState({
                queryTime: moment().unix()
            });
            getStatByTreetype({}, postdata).then((statByTreetype) => {
                this.setState({
                    statByTreetype,
                    statByTreetypeQueryTime: moment().unix()
                });
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    handleSection1 (value) {
        let sectionName1 = '';
        const { sectionList } = this.state;
        let smallClassList1 = [];
        sectionList.map(item => {
            if (item.No === value) {
                sectionName1 = item.Name;
                smallClassList1 = item.children;
            }
        });
        this.setState({
            smallClassList1,
            sectionSearch1: value || '',
            smallclassSearch1: '',
            thinclassSearch1: '',
            sectionName1,
            smallclassName1: '',
            thinclassName1: ''
        });
    }
    handleSection (value) {
        let sectionName = '';
        const { sectionList } = this.state;
        let smallClassList = [];
        sectionList.map(item => {
            if (item.No === value) {
                sectionName = item.Name;
                smallClassList = item.children;
            }
        });
        this.setState({
            smallClassList,
            sectionSearch: value || '',
            smallclassSearch: '',
            thinclassSearch: '',
            sectionName,
            smallclassName: '',
            thinclassName: ''
        });
    }
    handleSmallClass1 (value) {
        let smallclassName1 = '';
        const { smallClassList1 } = this.state;
        let thinClassList1 = [];
        smallClassList1.map(item => {
            if (item.No === value) {
                thinClassList1 = item.children;
                smallclassName1 = item.Name;
            }
        });
        this.setState({
            thinClassList1,
            smallclassSearch1: value || '',
            thinclassSearch1: '',
            smallclassName1,
            thinclassName1: ''
        });
    }
    handleThinClass1 (value) {
        const { thinClassList1 } = this.state;
        let thinclassName1 = '';
        thinClassList1.map (item => {
            if (item.No === value) {
                thinclassName1 = item.Name;
            }
        })
        this.setState({
            thinclassSearch1: value || '',
            thinclassName1
        });
    }
    handleSmallClass (value) {
        let smallclassName = '';
        const { smallClassList } = this.state;
        let thinClassList = [];
        smallClassList.map(item => {
            if (item.No === value) {
                thinClassList = item.children;
                smallclassName = item.Name;
            }
        });
        this.setState({
            thinClassList,
            smallclassSearch: value || '',
            thinclassSearch: '',
            smallclassName,
            thinclassName: ''
        });
    }
    handleThinClass (value) {
        const { thinClassList } = this.state;
        let thinclassName = '';
        thinClassList.map (item => {
            if (item.No === value) {
                thinclassName = item.Name;
            }
        })
        this.setState({
            thinclassSearch: value || '',
            thinclassName
        });
    }
}

export default Form.create()(PlantStrength);

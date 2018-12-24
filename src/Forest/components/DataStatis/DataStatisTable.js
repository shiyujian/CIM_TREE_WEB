import React, { Component } from 'react';
import {
    Row,
    Col,
    Select,
    Button,
    Card,
    Notification
} from 'antd';
import XLSX from 'xlsx';
import moment from 'moment';
import {TREETYPENO} from '_platform/api';
import DataTable from './DataTable';
import TopLeft from './TopLeft';
import TopRight from './TopRight';
import TreeTypeLeft from './TreeTypeLeft';
import TreeTypeMiddle from './TreeTypeMiddle';
import TreeTypeRight from './TreeTypeRight';
import EntranceLeft from './EntranceLeft';
import EntranceRight from './EntranceRight';
import PlantLeft from './PlantLeft';
import PlantRight from './PlantRight';
import PlantLeftSmallClass from './PlantLeftSmallClass';
import PlantRightThinClass from './PlantRightThinClass';
import LocationLeft from './LocationLeft';
import LocationRight from './LocationRight';
import '../index.less';

export default class DataStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionSearch: '',
            bigTypeSearch: '',
            treetypeSearch: '',
            smallclassSearch: '',
            thinclassSearch: '',
            treetypename: '',
            treePlanting: '',
            locationStat: '',
            statByTreetype: [],
            statByTreetypeQueryTime: 0,
            queryTime: 0,
            treeTypeDisplayTable: false
        };
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.query();
        }
    }
    render () {
        const {
            treetypeoption,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption
        } = this.props;
        const {
            sectionSearch,
            smallclassSearch,
            thinclassSearch,
            bigTypeSearch,
            treetypename,
            treeTypeDisplayTable
        } = this.state;
        return (
            <div className='forest-DataStatis'>
                <DataTable {...this.state} {...this.props} />
                <Row>
                    <Col span={24}>
                        <Card style={{ marginTop: 10 }}>
                            <Row className='forest-search-layout'>
                                <div className='forest-mrg10'>
                                    <span className='forest-search-span'>标段：</span>
                                    <Select
                                        allowClear
                                        className='forest-forestcalcw4'
                                        defaultValue='全部'
                                        value={sectionSearch}
                                        onChange={this.onSectionChange.bind(this)}
                                    >
                                        {sectionoption}
                                    </Select>
                                </div>
                                <div className='forest-mrg10'>
                                    <span className='forest-search-span'>小班：</span>
                                    <Select
                                        allowClear
                                        className='forest-forestcalcw4'
                                        defaultValue='全部'
                                        value={smallclassSearch}
                                        onChange={this.onSmallClassChange.bind(this)}
                                    >
                                        {smallclassoption}
                                    </Select>
                                </div>
                                <div className='forest-mrg10'>
                                    <span className='forest-search-span'>细班：</span>
                                    <Select
                                        allowClear
                                        className='forest-forestcalcw4'
                                        defaultValue='全部'
                                        value={thinclassSearch}
                                        onChange={this.onThinClassChange.bind(this)}
                                    >
                                        {thinclassoption}
                                    </Select>
                                </div>
                                <div className='forest-mrg10'>
                                    <span className='forest-search-span'>类型：</span>
                                    <Select
                                        allowClear
                                        className='forest-forestcalcw4'
                                        defaultValue='全部'
                                        value={bigTypeSearch}
                                        onChange={this.onTypeChange.bind(this)}
                                    >
                                        {typeoption}
                                    </Select>
                                </div>
                                <div className='forest-mrg10'>
                                    <span className='forest-search-span'>树种：</span>
                                    <Select
                                        allowClear
                                        showSearch
                                        className='forest-forestcalcw4'
                                        defaultValue='全部'
                                        value={treetypename}
                                        onChange={this.onTreeTypeChange.bind(this)}
                                    >
                                        {treetypeoption}
                                    </Select>
                                </div>
                            </Row>
                            <Row style={{ marginTop: 10, marginBottom: 10 }}>
                                <Col span={2} >
                                    <Button
                                        type='primary'
                                        onClick={this.query.bind(this)}
                                    >
                                        查询
                                    </Button>
                                </Col>
                                <Col span={20} />
                                <Col span={2} >
                                    <Button
                                        type='primary'
                                        onClick={this.resetinput.bind(this)}
                                    >
                                        重置
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <TopLeft {...this.state} {...this.props} />
                                </Col>
                                <Col span={12}>
                                    <TopRight {...this.state} {...this.props} />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col span={12}>
                                    <Card title='树种分布'
                                        extra={
                                            <div>
                                                <a onClick={this.handleTreeBigTypeDataExport.bind(this)}>
                                                    导出
                                                </a>
                                            </div>
                                        }
                                    >
                                        <TreeTypeLeft {...this.state} {...this.props} />
                                    </Card>
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
                                                ? <TreeTypeRight {...this.state} {...this.props} />
                                                : <TreeTypeMiddle {...this.state} {...this.props} />
                                        }
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            {/* 苗木进场总数分析 */}
                            <EntranceLeft {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            {/* 各树种进场强度分析 */}
                            <EntranceRight {...this.state} {...this.props} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            {/* 苗木种植强度分析 */}
                            <PlantLeft {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            {/* 各标段种植进度分析 */}
                            <PlantRight {...this.state} {...this.props} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            {/* 各小班定位进度分析 */}
                            <LocationLeft {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            {/* 各细班定位进度分析 */}
                            <LocationRight {...this.state} {...this.props} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={12}>
                            {/* 各小班种植进度分析 */}
                            <PlantLeftSmallClass {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            {/* 各细班种植进度分析 */}
                            <PlantRightThinClass {...this.state} {...this.props} />
                        </Col>
                    </Row>
                </Row>
            </div>
        );
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            sectionSearch: value || '',
            smallclassSearch: '',
            thinclassSearch: ''
        });
    }

    onSmallClassChange (value) {
        const { smallClassSelect } = this.props;
        smallClassSelect(value);
        this.setState({
            smallclassSearch: value || '',
            thinclassSearch: ''
        });
    }

    onThinClassChange (value) {
        const { thinClassSelect } = this.props;
        thinClassSelect(value);
        this.setState({
            thinclassSearch: value || ''
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

    resetinput () {
        this.setState({
            sectionSearch: '',
            thinclassSearch: '',
            smallclassSearch: '',
            treetypeSearch: ''
        }, () => {
            this.query();
        });
    }

    query = () => {
        const {
            sectionSearch = '',
            treetypeSearch = '',
            thinclassSearch = '',
            smallclassSearch = ''
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
            if (thinclassSearch) {
                let arr = thinclassSearch.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
            } else if (smallclassSearch) {
                let arr = smallclassSearch.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3];
            } else if (leftkeycode) {
                no = leftkeycode;
            }

            let postdata = {
                no: no,
                section: sectionSearch,
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

    handleTreeTypeDisplayChange = () => {
        const {
            treeTypeDisplayTable
        } = this.state;
        this.setState({
            treeTypeDisplayTable: !treeTypeDisplayTable
        });
    }

    handleTreeTypeDataExport = () => {
        const {
            statByTreetype
        } = this.state;
        let tblData = [];
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

    getTreetypeData = () => {
        let treetypeData = [];
        for (let i = 0; i < TREETYPENO.length; i++) {
            treetypeData.push(
                {
                    value: 0,
                    name: TREETYPENO[i].name,
                    id: TREETYPENO[i].id
                }
            );
        }
        return treetypeData;
    };
}

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
            section: '',
            bigType: '',
            treetype: '',
            smallclass: '',
            thinclass: '',
            treetypename: '',
            treePlanting: '',
            locationStat: '',
            statByTreetype: [],
            treePlantingQueryTime: 0,
            locationStatQueryTime: 0,
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
            section,
            smallclass,
            thinclass,
            bigType,
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
                                        value={section}
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
                                        value={smallclass}
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
                                        value={thinclass}
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
                                        value={bigType}
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
                                    <Card title='栽植量'>
                                        <TopLeft {...this.state} {...this.props} />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title='定位量'>
                                        <TopRight {...this.state} {...this.props} />
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col span={12}>
                                    <Card title='树种分布'>
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
            section: value || '',
            smallclass: '',
            thinclass: ''
        });
    }

    onSmallClassChange (value) {
        const { smallClassSelect } = this.props;
        smallClassSelect(value);
        this.setState({
            smallclass: value || '',
            thinclass: ''
        });
    }

    onThinClassChange (value) {
        const { thinClassSelect } = this.props;
        thinClassSelect(value);
        this.setState({
            thinclass: value || ''
        });
    }

    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    datepick (value) {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }

    resetinput () {
        this.setState({
            section: '',
            thinclass: '',
            smallclass: '',
            treetype: ''
        }, () => {
            this.query();
        });
    }

    query = () => {
        const {
            section = '',
            treetype = '',
            thinclass = '',
            smallclass = ''
        } = this.state;
        const {
            actions: {
                getTreePlanting,
                getLocationStat,
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
            if (thinclass) {
                let arr = thinclass.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
            } else if (smallclass) {
                let arr = smallclass.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3];
            } else if (leftkeycode) {
                no = leftkeycode;
            }

            let postdata = {
                no: no,
                section,
                treetype
            };
            this.setState({
                queryTime: moment().unix()
            });
            getTreePlanting({}, postdata).then((treePlanting) => {
                this.setState({
                    treePlanting,
                    treePlantingQueryTime: moment().unix()
                });
            });
            getLocationStat({}, postdata).then((locationStat) => {
                this.setState({
                    locationStat,
                    locationStatQueryTime: moment().unix()
                });
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
        console.log('statByTreetype', statByTreetype);
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

        console.log('tblData', tblData);
        let _headers = ['树种', '数量'];
        let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        console.log('headers', headers);
        let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
        console.log('testttt', testttt);
        let output = Object.assign({}, headers, testttt);
        console.log('output', output);
        // 获取所有单元格的位置
        let outputPos = Object.keys(output);
        console.log('outputPos', outputPos);
        // 计算出范围
        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
        console.log('ref', ref);
        // 构建 workbook 对象
        let wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                'mySheet': Object.assign({}, output, { '!ref': ref })
            }
        };
        XLSX.writeFile(wb, `树种排名.xlsx`);
    }
}

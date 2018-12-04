import React, { Component } from 'react';
import {
    Tabs,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Card,
    Notification
} from 'antd';
import moment from 'moment';
import TopLeft from './TopLeft';
import TopRight from './TopRight';
import MiddleLeft from './MiddleLeft';
import MiddleMiddle from './MiddleMiddle';
import MiddleRight from './MiddleRight';
import EntranceLeft from './EntranceLeft';
import EntranceRight from './EntranceRight';
import PlantLeft from './PlantLeft';
import PlantRight from './PlantRight';
import GroupLeft from './GroupLeft';
import GroupRight from './GroupRight';
import DataTable from './DataTable';

import { getUser } from '_platform/auth';
import '../index.less';

export default class DataStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
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
            queryTime: 0
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
            treetypename
        } = this.state;
        return (
            <div>
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
                            <Row>
                                <Card
                                    title='树种分布及排名'
                                    style={{ marginTop: 10 }}
                                >
                                    <Col span={8}>
                                        <MiddleLeft {...this.state} {...this.props} />
                                    </Col>
                                    <Col span={8}>
                                        <MiddleMiddle {...this.state} {...this.props} />
                                    </Col>
                                    <Col span={8}>
                                        <MiddleRight {...this.state} {...this.props} />
                                    </Col>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Row>
                        <Col span={12}>
                            <Card
                                title='苗木进场强度分析'
                                style={{ marginTop: 10 }}
                            >
                                <EntranceLeft {...this.state} {...this.props} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title='各树种进场强度分析'
                                style={{ marginTop: 10 }}
                            >
                                <EntranceRight {...this.state} {...this.props} />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card
                                title='苗木种植强度分析'
                                style={{ marginTop: 10 }}
                            >
                                <PlantLeft {...this.state} {...this.props} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title='各标段种植进度分析'
                                style={{ marginTop: 10 }}
                            >
                                <PlantRight {...this.state} {...this.props} />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card
                                title='各小班种植进度分析'
                                style={{ marginTop: 10 }}
                            >
                                <GroupLeft {...this.state} {...this.props} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title='各细班种植进度分析'
                                style={{ marginTop: 10 }}
                            >
                                <GroupRight {...this.state} {...this.props} />
                            </Card>
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
            stime = '',
            etime = '',
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
}

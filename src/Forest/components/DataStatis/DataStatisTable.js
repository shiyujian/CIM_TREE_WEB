import React, { Component } from 'react';
import {
    Icon,
    Table,
    Spin,
    Tabs,
    Modal,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Input,
    InputNumber,
    Progress,
    message,
    Card
} from 'antd';
import moment from 'moment';
import TopLeft from './TopLeft';
import TopRight from './TopRight';
import MiddleLeft from './MiddleLeft';
import MiddleMiddle from './MiddleMiddle';
import MiddleRight from './MiddleRight';
import BottomTop from './BottomTop';
import BottomBottom from './BottomBottom';
import { getUser } from '_platform/auth';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class DataStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
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
    componentDidMount () {
        let user = getUser();
        this.sections = JSON.parse(user.sections);
        // this.query(1);
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode
            });
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
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onsectionchange.bind(this)}
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
                            onChange={this.onsmallclasschange.bind(this)}
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
                            onChange={this.onthinclasschange.bind(this)}
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
                            onChange={this.ontypechange.bind(this)}
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
                            onChange={this.ontreetypechange.bind(this)}
                        >
                            {treetypeoption}
                        </Select>
                    </div>
                    {/* <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>载植时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw4'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div> */}
                </Row>
                <Row style={{marginTop: 10, marginBottom: 10}}>
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
                    <Row>
                        <Card
                            title='载植量与定位量'
                            style={{marginTop: 10}}
                        >
                            <Col span={12}>
                                <TopLeft {...this.state} {...this.props} />
                            </Col>
                            <Col span={12}>
                                <TopRight {...this.state} {...this.props} />
                            </Col>
                        </Card>
                    </Row>
                    <Row>
                        <Card
                            title='树种分布及排名'
                            style={{marginTop: 10}}
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
                    {/* <Row>
                        <Card
                            title='苗木来源情况'
                            style={{marginTop: 10}}
                        >
                            <Row>
                                <BottomTop {...this.state} {...this.props} />
                            </Row>
                            <Row>
                                <BottomBottom {...this.state} {...this.props} />
                            </Row>
                        </Card>
                    </Row> */}
                </Row>
            </div>
        );
    }

    onsectionchange (value) {
        const { sectionselect } = this.props;
        sectionselect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: ''
        });
    }

    onsmallclasschange (value) {
        const { smallclassselect } = this.props;
        const { leftkeycode } = this.state;
        smallclassselect(value || leftkeycode);
        this.setState({
            smallclass: value || '',
            thinclass: ''
        });
    }

    onthinclasschange (value) {
        const { thinclassselect } = this.props;
        const { smallclass } = this.state;
        thinclassselect(value || smallclass);
        this.setState({
            thinclass: value || ''
        });
    }

    ontypechange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    ontreetypechange (value) {
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
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = () => {
        const {
            section = '',
            bigType = '',
            treetype = '',
            stime = '',
            etime = '',
            thinclass = '',
            smallclass = ''
        } = this.state;
        console.log('smallclass', smallclass);
        console.log('thinclass', thinclass);
        console.log('section', section);

        const {
            actions: {
                getTreePlanting,
                getLocationStat,
                getStatByTreetype
            }
        } = this.props;
        try {
            let no = '';
            if (thinclass) {
                let arr = thinclass.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
            } else if (smallclass) {
                let arr = smallclass.split('-');
                no = arr[0] + '-' + arr[1] + '-' + arr[4];
            }

            let postdata = {
                no: no,
                section,
                treetype
            };
            this.setState({
                queryTime: moment().unix()
            });
            console.log('postdata', postdata);
            getTreePlanting({}, postdata).then((treePlanting) => {
                console.log('treePlanting', treePlanting);
                this.setState({
                    treePlanting,
                    treePlantingQueryTime: moment().unix()
                });
            });
            getLocationStat({}, postdata).then((locationStat) => {
                console.log('locationStat', locationStat);
                this.setState({
                    locationStat,
                    locationStatQueryTime: moment().unix()
                });
            });
            getStatByTreetype({}, postdata).then((statByTreetype) => {
                console.log('statByTreetype', statByTreetype);
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

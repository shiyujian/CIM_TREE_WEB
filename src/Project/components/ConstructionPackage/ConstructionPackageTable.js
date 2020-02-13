import React, { Component } from 'react';
import {
    Icon,
    Table,
    Modal,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Input,
    Progress,
    message
} from 'antd';
import moment from 'moment';
import { FOREST_API } from '_platform/api';
import { getForestImgUrl, getUserIsManager } from '_platform/auth';
import './index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;

export default class LocmeasureTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            lstime: '',
            letime: '',
            sxm: '',
            section: '',
            bigType: '',
            treetype: '',
            smallclass: '',
            thinclass: '',
            treetypename: '',
            status: '',
            SupervisorCheck: '',
            CheckStatus: '',
            // islocation: '',
            rolename: '',
            percent: 0,
            messageTotalNum: '',
            treeTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: '',
            XJFirst: 0,
            XJSecond: '',
            DJFirst: 0,
            DJSecond: '',
            GDFirst: 0,
            GDSecond: '',
            GFFirst: 0,
            GFSecond: '',
            TQHDFirst: 0,
            TQHDSecond: '',
            TQZJFirst: 0,
            TQZJSecond: '',
            selectedRowKeys: [],
            selectedRows: [],
            selectedRowSXM: []
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order'
            },
            {
                title: '小班号',
                dataIndex: 'smallCalss'
            },
            {
                title: '细班号',
                dataIndex: 'thinClass'
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <span>删除</span>;
                }
            }
        ];
    }
    componentDidMount () {
    }
    // 表格的多选设置
    onRowSelectChange = (selectedRowKeys, selectedRows) => {
        let selectedRowSXM = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
            selectedRowSXM.push(selectedRowKeys[i]);
        }

        this.setState({
            selectedRowKeys,
            selectedRows,
            selectedRowSXM
        });
    };

    emitEmpty1 = () => {
        this.setState({ sxm: '' });
    };

    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: ''
        });
    }

    onSmallClassChange (value) {
        const { smallClassSelect } = this.props;
        try {
            smallClassSelect(value);
            let smallclassData = '';
            if (value) {
                let arr = value.split('-');
                smallclassData = arr[3];
            }
            this.setState({
                smallclass: value,
                smallclassData,
                thinclass: '',
                thinclassData: ''
            });
        } catch (e) {
            console.log('onSmallClassChange', e);
        }
    }

    onThinClassChange (value) {
        const { thinClassSelect } = this.props;
        try {
            thinClassSelect(value);
            let thinclassData = '';
            if (value) {
                let arr = value.split('-');
                thinclassData = arr[4];
            }
            this.setState({
                thinclass: value,
                thinclassData
            });
        } catch (e) {
            console.log('onThinClassChange', e);
        }
    }
    handleCancel () {
        this.setState({ imgvisible: false });
    }
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    query = async (page) => {
    }

    treeTable (details) {
        const {
            sectionoption,
            smallclassoption,
            thinclassoption
        } = this.props;
        const {
            section,
            smallclass,
            thinclass
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
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
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
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
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={thinclass}
                            onChange={this.onThinClassChange.bind(this)}
                        >
                            {thinclassoption}
                        </Select>
                    </div>
                </Row>
                <Row style={{marginTop: 10, marginBottom: 10}}>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.handleTableChange.bind(this, {
                                current: 1
                            })}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20} className='forest-quryrstcnt'>
                        <span>{`此次查询共有数据：${this.state.messageTotalNum}条`}</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.resetinput.bind(this)}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                <Row>{header}</Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='ZZBM'
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '无信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }
    render () {
        const { tblData } = this.state;
        const {
            sectionoption,
            smallclassoption,
            thinclassoption
        } = this.props;
        const {
            section,
            smallclass,
            thinclass
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
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
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
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
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={thinclass}
                            onChange={this.onThinClassChange.bind(this)}
                        >
                            {thinclassoption}
                        </Select>
                    </div>
                </Row>
                <Row style={{marginTop: 10, marginBottom: 10}}>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.handleTableChange.bind(this, {
                                current: 1
                            })}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20} className='forest-quryrstcnt'>
                        <span>{`此次查询共有数据：${this.state.messageTotalNum}条`}</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.resetinput.bind(this)}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                <Row>{header}</Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='ZZBM'
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '无信息' }}
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }
}

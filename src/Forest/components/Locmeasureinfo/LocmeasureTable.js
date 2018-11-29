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
import { FOREST_API } from '../../../_platform/api';
import { getUser, getForestImgUrl } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import XLSX from 'xlsx';
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

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
            islocation: '',
            role: 'inputer',
            rolename: '',
            percent: 0,
            totalNum: '',
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
            TQZJSecond: ''
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order'
            },
            {
                title: '顺序码',
                dataIndex: 'ZZBM'
            },
            {
                title: '项目',
                dataIndex: 'Project'
            },
            {
                title: '标段',
                dataIndex: 'sectionName'
            },
            {
                title: '位置',
                dataIndex: 'place'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeObj.TreeTypeName'
            },
            {
                title: '状态',
                dataIndex: 'statusname',
                render: (text, record) => {
                    let superName = '';
                    let ownerName = '';
                    if (
                        record.SupervisorCheck == -1 &&
                        record.CheckStatus == -1
                    ) {
                        return <span>未抽查</span>;
                    } else {
                        if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                            superName = '监理抽查通过';
                        }

                        if (record.CheckStatus == 0) ownerName = '业主抽查退回';
                        else if (record.CheckStatus == 1) {
                            ownerName = '业主抽查通过';
                        } else if (record.CheckStatus == 2) {
                            ownerName = '业主抽查退回后修改';
                        }
                        if (superName && ownerName) {
                            return (
                                <div>
                                    <div>{superName}</div>
                                    <div>{ownerName}</div>
                                </div>
                            );
                        } else if (superName) {
                            return <span>{superName}</span>;
                        } else {
                            return <span>{ownerName}</span>;
                        }
                    }
                }
            },
            {
                title: '定位',
                dataIndex: 'islocation'
            },
            {
                title: '测量人',
                dataIndex: 'Inputer',
                render: (text, record) => {
                    return (
                        <span>
                            {users && users[text]
                                ? users[text].Full_Name +
                                  '(' +
                                  users[text].User_Name +
                                  ')'
                                : ''}
                        </span>
                    );
                }
            },
            {
                title: '测量时间',
                render: (text, record) => {
                    const { createtime1 = '', createtime2 = '' } = record;
                    return (
                        <div>
                            <div>{createtime1}</div>
                            <div>{createtime2}</div>
                        </div>
                    );
                }
            },
            {
                title: '定位时间',
                render: (text, record) => {
                    const { createtime3 = '', createtime4 = '' } = record;
                    return (
                        <div>
                            <div>{createtime3}</div>
                            <div>{createtime4}</div>
                        </div>
                    );
                }
            },
            {
                title: (
                    <div>
                        <div>高度</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.GD != 0) {
                        return (
                            <a
                                disabled={!record.GDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GDFJ
                                )}
                            >
                                {record.GD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: (
                    <div>
                        <div>冠幅</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.GF != 0) {
                        return (
                            <a
                                disabled={!record.GFFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.GFFJ
                                )}
                            >
                                {record.GF}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: (
                    <div>
                        <div>胸径</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.XJ != 0) {
                        return (
                            <a
                                disabled={!record.XJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.XJFJ
                                )}
                            >
                                {record.XJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: (
                    <div>
                        <div>地径</div>
                        <div>(cm)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.DJ != 0) {
                        return (
                            <a
                                disabled={!record.DJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.DJFJ
                                )}
                            >
                                {record.DJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: (
                    <div>
                        <div>土球厚度</div>
                        <div>(cm)</div>
                    </div>
                ),
                dataIndex: 'tqhd',
                render: (text, record) => {
                    if (record.TQHD != 0) {
                        return (
                            <a
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQHD}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            },
            {
                title: (
                    <div>
                        <div>土球直径</div>
                        <div>(cm)</div>
                    </div>
                ),
                dataIndex: 'tqzj',
                render: (text, record) => {
                    if (record.TQZJ != 0) {
                        return (
                            <a
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQZJ}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            }
        ];
    }
    componentDidMount () {
        let user = getUser();
        this.sections = JSON.parse(user.sections);
    }
    render () {
        const { tblData } = this.state;
        return (
            <div>
                {this.treeTable(tblData)}
                <Modal
                    width={522}
                    title='详细信息'
                    style={{ textAlign: 'center' }}
                    visible={this.state.imgvisible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    {this.state.imgArr}
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                            关闭
                        </Button>
                    </Row>
                </Modal>
            </div>
        );
    }
    treeTable (details) {
        const {
            treetypeoption,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            statusoption,
            locationoption
        } = this.props;
        const {
            sxm,
            rolename,
            section,
            smallclass,
            thinclass,
            bigType,
            treetypename,
            status,
            islocation
        } = this.state;
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        const suffix2 = rolename ? (
            <Icon type='close-circle' onClick={this.emitEmpty2} />
        ) : null;
        let header = '';

        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input
                            suffix={suffix1}
                            value={sxm}
                            className='forest-forestcalcw4'
                            onChange={this.sxmChange.bind(this)}
                        />
                    </div>
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
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>状态：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={status}
                            onChange={this.onStatusChange.bind(this)}
                        >
                            {statusoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>定位：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={islocation}
                            onChange={this.onLocationChange.bind(this)}
                        >
                            {locationoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>测量人：</span>
                        <Input
                            suffix={suffix2}
                            value={rolename}
                            placeholder='请输入用户名'
                            className='forest-forestcalcw4'
                            onChange={this.onRoleNameChange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>测量时间：</span>
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
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>定位时间：</span>
                        <RangePicker
                            className='forest-forestcalcw4'
                            style={{ verticalAlign: 'middle' }}
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick1.bind(this)}
                            onOk={this.datepick1.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg-standard2'>
                        <span className='forest-search-span'>胸径：</span>
                        <InputGroup compact className='forest-forestcalcw2' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.XJFirst}
                                    onChange={this.handleXJChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.XJSecond}
                                    onChange={this.handleXJChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
                    </div>
                    <div className='forest-mrg-standard2'>
                        <span className='forest-search-span'>地径：</span>
                        <InputGroup compact className='forest-forestcalcw2' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.DJFirst}
                                    onChange={this.handleDJChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.DJSecond}
                                    onChange={this.handleDJChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
                    </div>
                    <div className='forest-mrg-standard2'>
                        <span className='forest-search-span'>高度：</span>
                        <InputGroup compact className='forest-forestcalcw2' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.GDFirst}
                                    onChange={this.handleGDChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.GDSecond}
                                    onChange={this.handleGDChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
                    </div>
                    <div className='forest-mrg-standard2'>
                        <span className='forest-search-span'>冠幅：</span>
                        <InputGroup compact className='forest-forestcalcw2' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.GFFirst}
                                    onChange={this.handleGFChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.GFSecond}
                                    onChange={this.handleGFChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
                    </div>
                    <div className='forest-mrg-standard4'>
                        <span className='forest-search-span'>土球厚度：</span>
                        <InputGroup compact className='forest-forestcalcw4' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.TQHDFirst}
                                    onChange={this.handleTQHDChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.TQHDSecond}
                                    onChange={this.handleTQHDChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
                    </div>
                    <div className='forest-mrg-standard4'>
                        <span className='forest-search-span'>土球直径：</span>
                        <InputGroup compact className='forest-forestcalcw4' style={{display: 'inlineBlock'}}>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.TQZJFirst}
                                    onChange={this.handleTQZJChangeFirst.bind(this)} />
                            </Col>
                            <span style={{width: 20, textAlign: 'center'}} >~</span>
                            <Col>
                                <Input addonAfter={'cm'} style={{width: 100}}
                                    value={this.state.TQZJSecond}
                                    onChange={this.handleTQZJChangeSecond.bind(this)} />
                            </Col>
                        </InputGroup>
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
                    <Col span={18} className='forest-quryrstcnt'>
                        <span>此次查询共有苗木：{this.state.totalNum}棵</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.exportexcel.bind(this)}
                            style={{display: 'none'}}
                        >
                            导出
                        </Button>
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
                        rowKey='order'
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
                        locale={{ emptyText: '当天无现场测量信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }

    emitEmpty1 = () => {
        this.setState({ sxm: '' });
    };

    emitEmpty2 = () => {
        this.setState({ rolename: '' });
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

    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    onStatusChange (value) {
        this.setState({ status: value || '' });
    }

    onLocationChange (value) {
        this.setState({ islocation: value || '' });
    }

    onRoleNameChange (value) {
        this.setState({ rolename: value.target.value });
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

    datepick1 (value) {
        this.setState({
            lstime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            letime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    // 胸径
    handleXJChangeFirst (e) {
        console.log('handleXJChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                XJFirst: 0
            });
        } else {
            this.setState({
                XJFirst: Number(e.target.value)
            });
        }
    }
    handleXJChangeSecond (e) {
        console.log('handleXJChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                XJSecond: ''
            });
        } else {
            this.setState({
                XJSecond: Number(e.target.value)
            });
        }
    }
    // 地径
    handleDJChangeFirst (e) {
        console.log('handleDJChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                DJFirst: 0
            });
        } else {
            this.setState({
                DJFirst: Number(e.target.value)
            });
        }
    }
    handleDJChangeSecond (e) {
        console.log('handleDJChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                DJSecond: ''
            });
        } else {
            this.setState({
                DJSecond: Number(e.target.value)
            });
        }
    }
    // 高度
    handleGDChangeFirst (e) {
        console.log('handleGDChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                GDFirst: 0
            });
        } else {
            this.setState({
                GDFirst: Number(e.target.value)
            });
        }
    }
    handleGDChangeSecond (e) {
        console.log('handleGDChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                GDSecond: ''
            });
        } else {
            this.setState({
                GDSecond: Number(e.target.value)
            });
        }
    }
    // 冠幅
    handleGFChangeFirst (e) {
        console.log('handleGFChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                GFFirst: 0
            });
        } else {
            this.setState({
                GFFirst: Number(e.target.value)
            });
        }
    }
    handleGFChangeSecond (e) {
        console.log('handleGFChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                GFSecond: ''
            });
        } else {
            this.setState({
                GFSecond: Number(e.target.value)
            });
        }
    }
    // 土球厚度
    handleTQHDChangeFirst (e) {
        console.log('handleTQHDChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                TQHDFirst: 0
            });
        } else {
            this.setState({
                TQHDFirst: Number(e.target.value)
            });
        }
    }
    handleTQHDChangeSecond (e) {
        console.log('handleTQHDChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                TQHDSecond: ''
            });
        } else {
            this.setState({
                TQHDSecond: Number(e.target.value)
            });
        }
    }
    // 土球直径
    handleTQZJChangeFirst (e) {
        console.log('handleTQZJChangeFirst', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                TQZJFirst: 0
            });
        } else {
            this.setState({
                TQZJFirst: Number(e.target.value)
            });
        }
    }
    handleTQZJChangeSecond (e) {
        console.log('handleTQZJChangeSecond', e.target.value);
        if (isNaN(e.target.value)) {
            this.setState({
                TQZJSecond: ''
            });
        } else {
            this.setState({
                TQZJSecond: Number(e.target.value)
            });
        }
    }

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }

    onImgClick (data) {
        let srcs = [];
        try {
            let arr = data.split(',');
            console.log('arr', arr);
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }

        let imgArr = [];
        srcs.map(src => {
            imgArr.push(
                <img style={{ width: '490px' }} src={src} alt='图片' />
            );
        });

        this.setState({
            imgvisible: true,
            imgArr: imgArr
        });
    }

    handleCancel () {
        this.setState({ imgvisible: false });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query (page) {
        const { users } = this.props;
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            islocation = '',
            role = '',
            rolename = '',
            stime = '',
            etime = '',
            lstime = '',
            letime = '',
            status = '',
            size,
            thinclass = '',
            smallclass = '',
            smallclassData = '',
            thinclassData = '',
            XJFirst = 0,
            XJSecond = '',
            DJFirst = 0,
            DJSecond = '',
            GDFirst = 0,
            GDSecond = '',
            GFFirst = 0,
            GFSecond = '',
            TQHDFirst = 0,
            TQHDSecond = '',
            TQZJFirst = 0,
            TQZJSecond = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getqueryTree },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        // 胸径
        let xj = '';
        if (XJFirst >= 0 && XJSecond) {
            if (XJSecond > XJFirst) {
                xj = XJFirst + '-' + XJSecond;
            } else {
                message.error('请按从小到大的范围重新输入胸径');
                return;
            }
        } else if (XJFirst >= 0 && !XJSecond) {
            xj = XJFirst;
        }
        // 地径
        let dj = '';
        if (DJFirst >= 0 && DJSecond) {
            if (DJSecond > DJFirst) {
                dj = DJFirst + '-' + DJSecond;
            } else {
                message.error('请按从小到大的范围重新输入地径');
                return;
            }
        } else if (DJFirst >= 0 && !DJSecond) {
            dj = DJFirst;
        }
        // 高度
        let gd = '';
        if (GDFirst >= 0 && GDSecond) {
            if (GDSecond > GDFirst) {
                gd = GDFirst + '-' + GDSecond;
            } else {
                message.error('请按从小到大的范围重新输入高度');
                return;
            }
        } else if (GDFirst >= 0 && !GDSecond) {
            gd = GDFirst;
        }
        // 冠幅
        let gf = '';
        if (GFFirst >= 0 && GFSecond) {
            if (GFSecond > GFFirst) {
                gf = GFFirst + '-' + GFSecond;
            } else {
                message.error('请按从小到大的范围重新输入冠幅');
                return;
            }
        } else if (GFFirst >= 0 && !GFSecond) {
            gf = GFFirst;
        }
        // 土球厚度
        let tqhd = '';
        if (TQHDFirst >= 0 && TQHDSecond) {
            if (TQHDSecond > TQHDFirst) {
                tqhd = TQHDFirst + '-' + TQHDSecond;
            } else {
                message.error('请按从小到大的范围重新输入土球厚度');
                return;
            }
        } else if (TQHDFirst >= 0 && !TQHDSecond) {
            tqhd = TQHDFirst;
        }
        // 土球直径
        let tqzj = '';
        if (TQZJFirst >= 0 && TQZJSecond) {
            if (TQZJSecond > TQZJFirst) {
                tqzj = TQZJFirst + '-' + TQZJSecond;
            } else {
                message.error('请按从小到大的范围重新输入土球直径');
                return;
            }
        } else if (TQZJFirst >= 0 && !TQZJSecond) {
            tqzj = TQZJFirst;
        }
        let postdata = {
            no: keycode,
            sxm,
            section,
            bigType,
            treetype,
            islocation,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            lstime: lstime && moment(lstime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            letime: letime && moment(letime).format('YYYY-MM-DD HH:mm:ss'),
            status,
            page,
            size: size,
            smallclass: smallclassData,
            thinclass: thinclassData,
            xj: xj,
            dj: dj,
            gd: gd,
            gf: gf,
            tqhd: tqhd,
            tqzj: tqzj
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getqueryTree({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    plan.order = (page - 1) * size + i + 1;
                    plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                    plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                    plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                    console.log('plan.place', plan.place);
                    let statusname = '';

                    plan.SupervisorCheck = plan.SupervisorCheck;
                    plan.CheckStatus = plan.CheckStatus;
                    plan.statusname = statusname;
                    let islocation = plan.LocationTime ? '已定位' : '未定位';
                    plan.islocation = islocation;
                    let createtime1 = plan.CreateTime
                        ? moment(plan.CreateTime).format('YYYY-MM-DD')
                        : '/';
                    let createtime2 = plan.CreateTime
                        ? moment(plan.CreateTime).format('HH:mm:ss')
                        : '/';
                    let createtime3 = plan.LocationTime
                        ? moment(plan.LocationTime).format('YYYY-MM-DD')
                        : '/';
                    let createtime4 = plan.LocationTime
                        ? moment(plan.LocationTime).format('HH:mm:ss')
                        : '/';
                    plan.createtime1 = createtime1;
                    plan.createtime2 = createtime2;
                    plan.createtime3 = createtime3;
                    plan.createtime4 = createtime4;
                });

                // console.log('tblData', tblData);
                // let _headers = ['order', 'sectionName', 'place', 'SupervisorCheck', 'islocation'];
                // let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                //     .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
                // console.log('headers', headers);
                // let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                //     .reduce((prev, next) => prev.concat(next))
                //     .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
                // console.log('testttt', testttt);
                // let output = Object.assign({}, headers, testttt);
                // console.log('output', output);
                // // 获取所有单元格的位置
                // let outputPos = Object.keys(output);
                // console.log('outputPos', outputPos);
                // // 计算出范围
                // let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
                // console.log('ref', ref);
                // // 构建 workbook 对象
                // let wb = {
                //     SheetNames: ['mySheet'],
                //     Sheets: {
                //         'mySheet': Object.assign({}, output, { '!ref': ref })
                //     }
                // };
                // XLSX.writeFile(wb, 'output.xlsx');

                let totalNum = rst.pageinfo.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;

                if (bigType === '5') {
                    this.columns = [
                        {
                            title: '序号',
                            dataIndex: 'order'
                        },
                        {
                            title: '顺序码',
                            dataIndex: 'ZZBM'
                        },
                        {
                            title: '项目',
                            dataIndex: 'Project'
                        },
                        {
                            title: '标段',
                            dataIndex: 'sectionName'
                        },
                        {
                            title: '位置',
                            dataIndex: 'place'
                        },
                        {
                            title: '树种',
                            dataIndex: 'TreeTypeObj.TreeTypeName'
                        },
                        {
                            title: '状态',
                            dataIndex: 'statusname',
                            render: (text, record) => {
                                let superName = '';
                                let ownerName = '';
                                if (
                                    record.SupervisorCheck == -1 &&
                                    record.CheckStatus == -1
                                ) {
                                    return <span>未抽查</span>;
                                } else {
                                    if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                                        superName = '监理抽查通过';
                                    }

                                    if (record.CheckStatus == 0) { ownerName = '业主抽查退回'; } else if (record.CheckStatus == 1) {
                                        ownerName = '业主抽查通过';
                                    } else if (record.CheckStatus == 2) {
                                        ownerName = '业主抽查退回后修改';
                                    }
                                    if (superName && ownerName) {
                                        return (
                                            <div>
                                                <div>{superName}</div>
                                                <div>{ownerName}</div>
                                            </div>
                                        );
                                    } else if (superName) {
                                        return <span>{superName}</span>;
                                    } else {
                                        return <span>{ownerName}</span>;
                                    }
                                }
                            }
                        },
                        {
                            title: '测量人',
                            dataIndex: 'Inputer',
                            render: (text, record) => {
                                return (
                                    <span>
                                        {users && users[text]
                                            ? users[text].Full_Name +
                                              '(' +
                                              users[text].User_Name +
                                              ')'
                                            : ''}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '测量时间',
                            render: (text, record) => {
                                const {
                                    createtime1 = '',
                                    createtime2 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime1}</div>
                                        <div>{createtime2}</div>
                                    </div>
                                );
                            }
                        },
                        {
                            title: '实际栽植量',
                            dataIndex: 'Num'
                        }
                    ];
                } else {
                    this.columns = [
                        {
                            title: '序号',
                            dataIndex: 'order'
                        },
                        {
                            title: '顺序码',
                            dataIndex: 'ZZBM'
                        },
                        {
                            title: '项目',
                            dataIndex: 'Project'
                        },
                        {
                            title: '标段',
                            dataIndex: 'sectionName'
                        },
                        {
                            title: '位置',
                            dataIndex: 'place'
                        },
                        {
                            title: '树种',
                            dataIndex: 'TreeTypeObj.TreeTypeName'
                        },
                        {
                            title: '状态',
                            dataIndex: 'statusname',
                            render: (text, record) => {
                                let superName = '';
                                let ownerName = '';
                                if (
                                    record.SupervisorCheck == -1 &&
                                    record.CheckStatus == -1
                                ) {
                                    return <span>未抽查</span>;
                                } else {
                                    if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                                        superName = '监理抽查通过';
                                    }

                                    if (record.CheckStatus == 0) { ownerName = '业主抽查退回'; } else if (record.CheckStatus == 1) {
                                        ownerName = '业主抽查通过';
                                    } else if (record.CheckStatus == 2) {
                                        ownerName = '业主抽查退回后修改';
                                    }
                                    if (superName && ownerName) {
                                        return (
                                            <div>
                                                <div>{superName}</div>
                                                <div>{ownerName}</div>
                                            </div>
                                        );
                                    } else if (superName) {
                                        return <span>{superName}</span>;
                                    } else {
                                        return <span>{ownerName}</span>;
                                    }
                                }
                            }
                        },
                        {
                            title: '定位',
                            dataIndex: 'islocation'
                        },
                        {
                            title: '测量人',
                            dataIndex: 'Inputer',
                            render: (text, record) => {
                                return (
                                    <span>
                                        {users && users[text]
                                            ? users[text].Full_Name +
                                              '(' +
                                              users[text].User_Name +
                                              ')'
                                            : ''}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '测量时间',
                            render: (text, record) => {
                                const {
                                    createtime1 = '',
                                    createtime2 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime1}</div>
                                        <div>{createtime2}</div>
                                    </div>
                                );
                            }
                        },
                        {
                            title: '定位时间',
                            render: (text, record) => {
                                const {
                                    createtime3 = '',
                                    createtime4 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime3}</div>
                                        <div>{createtime4}</div>
                                    </div>
                                );
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>高度</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            render: (text, record) => {
                                if (record.GD != 0) {
                                    return (
                                        <a
                                            disabled={!record.GDFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.GDFJ
                                            )}
                                        >
                                            {record.GD}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>冠幅</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            render: (text, record) => {
                                if (record.GF != 0) {
                                    return (
                                        <a
                                            disabled={!record.GFFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.GFFJ
                                            )}
                                        >
                                            {record.GF}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>胸径</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            render: (text, record) => {
                                if (record.XJ != 0) {
                                    return (
                                        <a
                                            disabled={!record.XJFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.XJFJ
                                            )}
                                        >
                                            {record.XJ}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>地径</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            render: (text, record) => {
                                if (record.DJ != 0) {
                                    return (
                                        <a
                                            disabled={!record.DJFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.DJFJ
                                            )}
                                        >
                                            {record.DJ}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>土球厚度</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            dataIndex: 'tqhd',
                            render: (text, record) => {
                                if (record.TQHD != 0) {
                                    return (
                                        <a
                                            disabled={!record.TQHDFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.TQHDFJ
                                            )}
                                        >
                                            {record.TQHD}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        },
                        {
                            title: (
                                <div>
                                    <div>土球直径</div>
                                    <div>(cm)</div>
                                </div>
                            ),
                            dataIndex: 'tqzj',
                            render: (text, record) => {
                                if (record.TQZJ != 0) {
                                    return (
                                        <a
                                            disabled={!record.TQHDFJ}
                                            onClick={this.onImgClick.bind(
                                                this,
                                                record.TQHDFJ
                                            )}
                                        >
                                            {record.TQZJ}
                                        </a>
                                    );
                                } else {
                                    return <span>/</span>;
                                }
                            }
                        }
                    ];
                }

                this.setState({
                    tblData,
                    pagination: pagination,
                    totalNum: totalNum
                });
            }
        });
    }

    exportexcel () {
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            locationstatus = '',
            role = '',
            rolename = '',
            stime = '',
            lstime = '',
            etime = '',
            letime = '',
            exportsize,
            thinclass = '',
            smallclass = '',
            status = '',
            smallclassData = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getexportTree },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            treetype,
            status,
            // locationstatus,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            lstime: lstime && moment(lstime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            letime: letime && moment(letime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            smallclass: smallclassData,
            thinclass: thinclassData
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getexportTree({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                window.open(`${FOREST_API}/${rst3}`);
                // this.createLink(this,`${FOREST_API}/${rst3}`)
            }
            this.setState({ loading: false });
        });
    }

    createLink (name, url) {
        let link = document.createElement('a');
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

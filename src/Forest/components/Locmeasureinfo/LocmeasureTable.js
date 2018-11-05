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
import { getUser } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

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
            thinclassData: ''
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
                let src = rst.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                src = `${FOREST_API}/${src}`;
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
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getqueryTree },
            keycode = '',
            platform: { tree = {} },
            treetypes
        } = this.props;
        let thinClassTree = tree.thinClassTree;
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
            thinclass: thinclassData
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
                let totalNum = rst.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;

                if (bigType == '5') {
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
                            title: '实际载植量',
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

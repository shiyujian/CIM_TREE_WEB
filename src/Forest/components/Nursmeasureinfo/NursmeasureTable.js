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
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

export default class NursmeasureTable extends Component {
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
            sxm: '',
            section: '',
            bigType: '',
            treetype: '',
            treetypename: '',
            treeplace: '',
            nurseryname: '',
            factory: '',
            role: 'inputer',
            rolename: '',
            percent: 0,
            supervisorcheck: '',
            checkstatus: '',
            ispack: '',
            imgArr: []
        };
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
            typeoption,
            mmtypeoption,
            keycode = '',
            statusoption,
            users
        } = this.props;
        const {
            sxm,
            rolename,
            factory,
            treeplace,
            nurseryname,
            section,
            bigType,
            treetypename,
            ispack,
            mmtype = ''
        } = this.state;
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        const suffix2 = rolename ? (
            <Icon type='close-circle' onClick={this.emitEmpty2} />
        ) : null;
        const suffix3 = factory ? (
            <Icon type='close-circle' onClick={this.emitEmpty3} />
        ) : null;
        const suffix4 = treeplace ? (
            <Icon type='close-circle' onClick={this.emitEmpty4} />
        ) : null;
        const suffix5 = nurseryname ? (
            <Icon type='close-circle' onClick={this.emitEmpty5} />
        ) : null;
        let columns = [];
        let header = '';
        columns = [
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
                title: '树种',
                dataIndex: 'TreeTypeObj.TreeTypeName'
            }
        ];
        if (keycode.indexOf('P010') !== -1 && mmtype !== '1') {
            columns.push({
                title: '苗龄',
                dataIndex: 'Age',
                render: (text, record) => {
                    if (record.BD.indexOf('P010') !== -1) {
                        if (text === 0) {
                            return <p> / </p>;
                        } else {
                            return <p>{text}</p>;
                        }
                    } else {
                        return <p> / </p>;
                    }
                }
            });
        } else if (keycode === '' && mmtype === '') {
            columns.push({
                title: '苗龄',
                dataIndex: 'Age',
                render: (text, record) => {
                    if (record.BD.indexOf('P010') !== -1) {
                        if (text === 0) {
                            return <p> / </p>;
                        } else {
                            return <p>{text}</p>;
                        }
                    } else {
                        return <p> / </p>;
                    }
                }
            });
        }
        columns.push({
            title: '产地',
            dataIndex: 'TreePlace'
        });
        columns.push({
            title: '供应商',
            dataIndex: 'Factory'
        });
        columns.push({
            title: '苗圃名称',
            dataIndex: 'NurseryName'
        });
        columns.push({
            title: '填报人',
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
        });
        columns.push({
            title: '起苗时间',
            render: (text, record) => {
                const { liftertime1 = '', liftertime2 = '' } = record;
                return (
                    <div>
                        <div>{liftertime1}</div>
                        <div>{liftertime2}</div>
                    </div>
                );
            }
        });
        columns.push({
            title: '状态',
            dataIndex: 'statusname'
        });
        if (mmtype !== '0') {
            columns.push(
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
                                    disabled={!record.TQZJFJ}
                                    onClick={this.onImgClick.bind(
                                        this,
                                        record.TQZJFJ
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
            );
        }
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input
                            // suffix={suffix1}
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
                        <span className='forest-search-span'>产地：</span>
                        <Input
                            suffix={suffix4}
                            value={treeplace}
                            className='forest-forestcalcw4'
                            onChange={this.placechange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>供应商：</span>
                        <Input
                            suffix={suffix3}
                            value={factory}
                            className='forest-forestcalcw4'
                            onChange={this.factorychange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>苗圃：</span>
                        <Input
                            suffix={suffix5}
                            value={nurseryname}
                            className='forest-forestcalcw4'
                            onChange={this.nurschange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>填报人：</span>
                        <Input
                            suffix={suffix2}
                            value={rolename}
                            className='forest-forestcalcw4'
                            onChange={this.onRoleNameChange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>状态：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            onChange={this.onStatusChange.bind(this)}
                            value={ispack}
                        >
                            {statusoption}
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>起苗时间：</span>
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
                    {
                        keycode === ''
                            ? null : keycode.indexOf('P010') === -1
                                ? null
                                : (
                                    <div className='forest-mrg10'>
                                        <span className='forest-search-span'>苗木类型：</span>
                                        <Select
                                            allowClear
                                            className='forest-forestcalcw4'
                                            defaultValue='全部'
                                            value={mmtype}
                                            onChange={this.onmmtypechange.bind(this)}
                                        >
                                            {mmtypeoption}
                                        </Select>
                                    </div>
                                )
                    }
                </Row>
                <Row>
                    <Col span={2}>
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
                        <span>
                            此次查询共有苗木：
                            {this.state.pagination.total}棵
                        </span>
                    </Col>
                    <Col span={2}>
                        <Button
                            type='primary'
                            style={{ display: 'none' }}
                            onClick={this.exportexcel.bind(this)}
                        >
                            导出
                        </Button>
                    </Col>
                    <Col span={2}>
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
                        columns={columns}
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
                        locale={{ emptyText: '当天无苗圃测量信息' }}
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

    emitEmpty3 = () => {
        this.setState({ factory: '' });
    };

    emitEmpty4 = () => {
        this.setState({ treeplace: '' });
    };

    emitEmpty5 = () => {
        this.setState({ nurseryname: '' });
    };

    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || ''
        });
    }

    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }
    onmmtypechange (value) {
        this.setState({ mmtype: value });
        const pagination = { ...this.state.pagination };
        pagination.total = 0;
        pagination.pageSize = 10;
        this.setState({ tblData: [], pagination });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    onStatusChange (value) {
        this.setState({ ispack: value });
    }

    onRoleNameChange (value) {
        this.setState({ rolename: value.target.value });
    }

    factorychange (value) {
        this.setState({ factory: value.target.value });
    }

    placechange (value) {
        this.setState({ treeplace: value.target.value });
    }

    nurschange (value) {
        this.setState({ nurseryname: value.target.value });
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
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            factory = '',
            treeplace = '',
            nurseryname = '',
            role = '',
            rolename = '',
            stime = '',
            etime = '',
            size,
            supervisorcheck = '',
            checkstatus = '',
            ispack = '',
            mmtype = ''
        } = this.state;
        console.log('sxm', sxm);
        if (section === '' && sxm === '') {
            message.info('请选择项目及标段信息或输入顺序码');
            return;
        }
        const {
            actions: { getnurserys },
            keycode = '',
            platform: { tree = {} },
            treetypes
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            // no:keycode,
            sxm,
            bd: section === '' ? keycode : section,
            bigType,
            treetype,
            factory,
            treeplace,
            nurseryname,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size,
            supervisorcheck,
            checkstatus,
            ispack
        };
        if (keycode !== '' && keycode.indexOf('P010') !== -1) {
            // 有苗木类型选项
            postdata.foresttype = mmtype;
        }
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getnurserys({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    plan.statusname =
                        plan.IsPack === 0 ? '未打包' : '已打包';
                    plan.order = (page - 1) * size + i + 1;
                    plan.liftertime1 = plan.CreateTime
                        ? moment(plan.CreateTime).format('YYYY-MM-DD')
                        : '/';
                    plan.liftertime2 = plan.CreateTime
                        ? moment(plan.CreateTime).format('HH:mm:ss')
                        : '/';
                    plan.Project = getProjectNameBySection(plan.BD, thinClassTree);
                    plan.sectionName = getSectionNameBySection(plan.BD, thinClassTree);
                });
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({ tblData, pagination });
            }
        });
    }

    exportexcel () {
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            factory = '',
            treeplace = '',
            nurseryname = '',
            role = '',
            rolename = '',
            stime = '',
            etime = '',
            exportsize,
            ispack = '',
            mmtype
        } = this.state;
        if (section === '') {
            message.info('请选择标段信息');
            return;
        }
        const {
            actions: { getnurserys, getexportNurserys },
            keycode = ''
        } = this.props;
        let postdata = {
            // no:keycode,
            sxm,
            bd: section === '' ? keycode : section,
            bigType,
            treetype,
            factory,
            treeplace,
            nurseryname,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            ispack
        };
        if (keycode !== '' && keycode.indexOf('P010') !== -1) {
            // 有苗木类型选项
            postdata.foresttype = mmtype;
        }
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getexportNurserys({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                this.createLink(this, `${FOREST_API}/${rst3}`);
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

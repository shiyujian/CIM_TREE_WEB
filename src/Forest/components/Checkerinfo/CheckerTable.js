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
import { getSmallThinNameByPlaceData } from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

export default class CheckerTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            treetypename: '',
            size: 10,
            exportsize: 100,
            ostime: moment().format('YYYY-MM-DD 00:00:00'),
            oetime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            smallclass: '',
            thinclass: '',
            status: '',
            treety: '',
            treetype: '',
            CheckStatus: '',
            locationstatus: '',
            role: 'checker',
            rolename: '',
            percent: 0,
            totalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: ''
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
        console.log('details', details);
        const {
            treetypeoption,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            statusoption,
            users
        } = this.props;
        const {
            sxm,
            rolename,
            section,
            bigType,
            smallclass,
            thinclass,
            status,
            treetypename
        } = this.state;
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        const suffix2 = rolename ? (
            <Icon type='close-circle' onClick={this.emitEmpty2} />
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
                title: '抽查人',
                dataIndex: 'Checker',
                render: (text, record) => {
                    if (text === 0) {
                        return <p> / </p>;
                    }
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
                title: '定位',
                dataIndex: 'locationstatus'
            },
            // {
            // 	title:"状态信息",
            // 	dataIndex: 'SupervisorInfo',
            // },
            {
                title: '业主抽查时间',
                render: (text, record) => {
                    const { checktime1 = '', checktime2 = '' } = record;
                    return (
                        <div>
                            <div>{checktime1}</div>
                            <div>{checktime2}</div>
                        </div>
                    );
                }
            }
        ];
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
                        <span className='forest-search-span'>抽查人：</span>
                        <Input
                            suffix={suffix2}
                            value={rolename}
                            className='forest-forestcalcw4'
                            onChange={this.onRoleNameChange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg-datePicker6'>
                        <span className='forest-search-span6'>业主抽查时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(
                                    this.state.ostime,
                                    'YYYY-MM-DD HH:mm:ss'
                                ),
                                moment(this.state.oetime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw6'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div>
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
                            {this.state.totalNum}棵
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
                        locale={{ emptyText: '当天无业主抽查信息' }}
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
        console.log('value', value);
        let CheckStatus = '';
        switch (value) {
            case '1':
                CheckStatus = 0;
                break;
            case '2':
                CheckStatus = -1;
                break;
            case '3':
                CheckStatus = 1;
                break;
            default:
                break;
        }
        this.setState({ CheckStatus, status: value || '' });
    }

    onLocationChange (value) {
        this.setState({ locationstatus: value });
    }

    onRoleNameChange (value) {
        this.setState({ rolename: value.target.value });
    }

    datepick (value) {
        this.setState({
            ostime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            oetime: value[1]
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
            status = '',
            role = '',
            rolename = '',
            ostime = '',
            oetime = '',
            size,
            smallclass,
            thinclass,
            bigType = '',
            treetype = '',
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
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            no: keycode,
            sxm,
            section,
            status,
            ostime: ostime && moment(ostime).format('YYYY-MM-DD HH:mm:ss'),
            oetime: oetime && moment(oetime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getqueryTree({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    // const {attrs = {}} = plan;
                    plan.order = (page - 1) * size + i + 1;
                    plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                    console.log('plan.place', plan.place);
                    plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                    plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                    let statusname = '';
                    plan.SupervisorCheck = plan.SupervisorCheck;
                    plan.CheckStatus = plan.CheckStatus;
                    plan.statusname = statusname;

                    let locationstatus = plan.LocationTime
                        ? '已定位'
                        : '未定位';
                    plan.locationstatus = locationstatus;
                    // 改为验收时间
                    let checktime1 = plan.CheckTime
                        ? moment(plan.CheckTime).format('YYYY-MM-DD')
                        : '/';
                    let checktime2 = plan.CheckTime
                        ? moment(plan.CheckTime).format('HH:mm:ss')
                        : '/';
                    plan.checktime1 = checktime1;
                    plan.checktime2 = checktime2;
                });
                const pagination = { ...this.state.pagination };
                let totalNum = rst.total;
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
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
            // CheckStatus = '',
            role = '',
            rolename = '',
            ostime = '',
            oetime = '',
            exportsize,
            smallclass,
            thinclass,
            bigType = '',
            treetype = '',
            smallclassData = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getexportTree4Checker },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            // CheckStatus,
            ostime: ostime && moment(ostime).format('YYYY-MM-DD HH:mm:ss'),
            oetime: oetime && moment(oetime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype
        };
        if (role) postdata[role] = rolename;

        this.setState({ loading: true, percent: 0 });
        getexportTree4Checker({}, postdata).then(rst3 => {
            console.log('rst3', rst3);
            this.setState({ loading: false });
            if (rst3 === '') {
                message.info('最近日期没有抽查的数据');
            } else {
                this.createLink(this, `${FOREST_API}/${rst3}`);
            }
        });
    }
    createLink (name, url) {
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

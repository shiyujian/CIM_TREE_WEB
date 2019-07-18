import React, { Component } from 'react';
import {
    Icon,
    Table,
    Tabs,
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
import { getUser, getForestImgUrl } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

export default class SupervisorTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            treetypename: '',
            leftkeycode: '',
            sstime: moment().format('YYYY-MM-DD 00:00:00'),
            setime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            smallclass: '',
            thinclass: '',
            status: '',
            SupervisorCheck: '',
            role: '',
            rolename: '',
            percent: 0,
            messageTotalNum: '',
            treeTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: ''
        };
        this.section = '';
    }
    componentDidMount () {
        let user = getUser();
        this.section = user.section;
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
            sectionoption,
            smallclassoption,
            treetypeoption,
            thinclassoption,
            statusoption,
            users,
            typeoption
        } = this.props;
        const {
            sxm,
            rolename,
            section,
            smallclass,
            thinclass,
            status,
            bigType,
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
                    let statusname = '';
                    if (record.Status === 2) {
                        statusname = '不合格';
                    } else if (
                        record.SupervisorCheck === -1 &&
                        record.CheckStatus === -1
                    ) {
                        statusname = '未抽查';
                    } else {
                        if (record.SupervisorCheck === 0 || record.CheckStatus === 0) {
                            statusname = '抽查退回';
                        } else if (record.SupervisorCheck === 1 || record.CheckStatus === 1) {
                            statusname = '抽查通过';
                        }
                    }
                    return <span>{statusname}</span>;
                }
            },
            {
                title: '监理人',
                dataIndex: 'Supervisor',
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
                title: '监理抽查时间',
                render: (text, record) => {
                    const { yssj1 = '', yssj2 = '' } = record;
                    return (
                        <div>
                            <div>{yssj1}</div>
                            <div>{yssj2}</div>
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
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
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
                        <span className='forest-search-span'>监理人：</span>
                        <Input
                            suffix={suffix2}
                            value={rolename}
                            className='forest-forestcalcw4'
                            onChange={this.onRoleNameChange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg-datePicker6'>
                        <span className='forest-search-span6'>监理抽查时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(
                                    this.state.sstime,
                                    'YYYY-MM-DD HH:mm:ss'
                                ),
                                moment(this.state.setime, 'YYYY-MM-DD HH:mm:ss')
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
                        <span>{`此次查询共有数据：${this.state.messageTotalNum}条，  共有苗木：${this.state.treeTotalNum}棵`}</span>
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
                        locale={{ emptyText: '当天无监理验收信息' }}
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
        let SupervisorCheck = '';
        switch (value) {
            case '1':
                SupervisorCheck = -1;
                break;
            case '2':
                SupervisorCheck = 0;
                break;
            case '3':
                SupervisorCheck = 1;
                break;
            default:
                break;
        }
        this.setState({ SupervisorCheck, status: value || '' });
    }

    onRoleNameChange (value) {
        this.setState({ rolename: value.target.value });
    }

    datepick (value) {
        this.setState({
            sstime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            setime: value[1]
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
            SupervisorCheck = '',
            smallclass = '',
            thinclass = '',
            role = '',
            rolename = '',
            sstime = '',
            setime = '',
            status = '',
            size,
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
            platform: { tree = {} },
            treetypes
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let searchStatus = '';
        let searchSamplingStatus = '';
        if (status === '未抽查') {
            searchSamplingStatus = -1;
        } else if (status === '不合格') {
            searchSamplingStatus = 2;
        } else {
            searchStatus = status;
        }
        let postdata = {
            no: keycode,
            sxm,
            section,
            smallclass: smallclassData,
            thinclass: thinclassData,
            status: searchStatus,
            samplingStatus: searchSamplingStatus,
            SupervisorCheck,
            sstime: sstime && moment(sstime).format('YYYY-MM-DD HH:mm:ss'),
            setime: setime && moment(setime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size,
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
                    plan.order = (page - 1) * size + i + 1;

                    plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                    plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                    plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                    let statusname = '';

                    plan.SupervisorCheck = plan.SupervisorCheck;
                    plan.CheckStatus = plan.CheckStatus;
                    plan.statusname = statusname;

                    plan.statusname = statusname;
                    let locationstatus = plan.LocationTime
                        ? '已定位'
                        : '未定位';
                    plan.locationstatus = locationstatus;
                    let yssj1 = plan.SupervisorTime
                        ? moment(plan.SupervisorTime).format('YYYY-MM-DD')
                        : '/';
                    let yssj2 = plan.SupervisorTime
                        ? moment(plan.SupervisorTime).format('HH:mm:ss')
                        : '/';
                    plan.yssj1 = yssj1;
                    plan.yssj2 = yssj2;
                });
                let treeTotalNum = rst.total;
                let messageTotalNum = rst.pageinfo.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({
                    tblData,
                    pagination: pagination,
                    messageTotalNum: messageTotalNum,
                    treeTotalNum
                });
            }
        });
    }

    exportexcel () {
        const {
            sxm = '',
            section = '',
            // SupervisorCheck = '',
            role = '',
            rolename = '',
            sstime = '',
            setime = '',
            exportsize,
            bigType = '',
            treetype = ''
        } = this.state;
        if (this.section) {
            // 不是admin，要做查询判断了
            if (section === '') {
                message.info('请选择标段信息');
                return;
            }
        }
        const {
            actions: { getexportTree4Supervisor },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            // SupervisorCheck,
            sstime: sstime && moment(sstime).format('YYYY-MM-DD HH:mm:ss'),
            setime: setime && moment(setime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            bigType,
            treetype
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getexportTree4Supervisor({}, postdata).then(rst3 => {
            this.setState({ loading: false });
            this.createLink(this, `${FOREST_API}/${rst3}`);
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

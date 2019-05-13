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
    message,
    Divider
} from 'antd';
import moment from 'moment';
import { FOREST_API } from '_platform/api';
import { getUser, getUserIsManager } from '_platform/auth';
import CarPackDetailModal from './CarPackDetailModal'; // 查看车内苗木信息
import HandleNurseryInCar from './HandleNurseryInCar'; // 移动或修改车内苗木
import ChangeCarInfoModal from './ChangeCarInfoModal'; // 修改车辆信息
import MergeCarPackModal from './MergeCarPackModal'; // 合并两车
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

export default class CarPackageTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            leftkeycode: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            licenseplate: '',
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
            status: '',
            currentCarID: '',
            detailVisible: false,
            editCarInfoVisible: false,
            mergeCarPackVisible: false,
            handleNurseryInCarVisible: false
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '车牌号',
            dataIndex: 'LicensePlate'
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
            title: '苗木类型',
            dataIndex: 'IsShrub',
            render: (text, record) => {
                if (text === 0) {
                    return <p>乔灌</p>;
                } else {
                    return <p>地被</p>;
                }
            }
        },
        {
            title: '苗木规格',
            dataIndex: 'Standard',
            render: text => {
                if (text === '') {
                    return <p> / </p>;
                } else {
                    return <p>{text}</p>;
                }
            }
        },
        {
            title: '创建时间',
            render: (text, record) => {
                const { liftertime1 = '', liftertime2 = '' } = record;
                return (
                    <div>
                        <div>{liftertime1}</div>
                        <div>{liftertime2}</div>
                    </div>
                );
            }
        },
        {
            title: '总数',
            dataIndex: 'NurseryNum'
        },
        {
            title: '进场抽检退苗量',
            dataIndex: 'UnQualifiedNum'
        },
        {
            title: '状态',
            dataIndex: 'Status',
            render: (text, record) => {
                if (text === -1) {
                    return <p>打包</p>;
                } else if (text === 0) {
                    return <p>施工提交</p>;
                } else if (text === 1) {
                    return <p>监理合格</p>;
                } else if (text === 2) {
                    return <p>监理退苗</p>;
                } else if (text === 3) {
                    return <p>监理合格施工同意</p>;
                } else if (text === 4) {
                    return <p>监理合格施工不同意</p>;
                } else if (text === 5) {
                    return <p>监理退苗施工同意</p>;
                } else if (text === 6) {
                    return <p>监理退苗施工不同意</p>;
                } else if (text === 7) {
                    return <p>业主合格</p>;
                } else if (text === 8) {
                    return <p>业主退苗</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '抽检人',
            dataIndex: 'ConstructionerName',
            render: (text, record) => {
                if (record.ConstructionerUserName && record.ConstructionerName) {
                    return <p>{record.ConstructionerName + '(' + record.ConstructionerUserName + ')'}</p>;
                } else if (record.ConstructionerName && !record.ConstructionerUserName) {
                    return <p>{record.ConstructionerName}</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '监理人',
            dataIndex: 'SupervisorName',
            render: (text, record) => {
                if (record.SupervisorUserName && record.SupervisorName) {
                    return <p>{record.SupervisorName + '(' + record.SupervisorUserName + ')'}</p>;
                } else if (record.SupervisorName && !record.SupervisorUserName) {
                    return <p>{record.SupervisorName}</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '司机姓名',
            dataIndex: 'Driver',
            render: (text, record) => {
                if (text) {
                    return <p>{text}</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '司机电话',
            dataIndex: 'DriverPhone',
            render: (text, record) => {
                if (text) {
                    return <p>{text}</p>;
                } else {
                    return <p> / </p>;
                }
            }
        },
        {
            title: '操作',
            render: (text, record) => {
                // let permission = getUserIsManager();
                let permission = false;
                if (permission) {
                    return (
                        <div>
                            <a
                                href='javascript:;'
                                onClick={this.handleChangeNurseryInCar.bind(this, record)}
                            >
                                修改苗木
                            </a>
                            <Divider type='vertical' />
                            <a
                                href='javascript:;'
                                onClick={this.handleEditCarInfoClick.bind(this, record)}
                            >
                                编辑车辆
                            </a>
                            <Divider type='vertical' />
                            <a
                                href='javascript:;'
                                onClick={this.handlMergeCarClick.bind(this, record)}
                            >
                                合并车辆
                            </a>
                        </div>);
                } else {
                    return (
                        <a
                            href='javascript:;'
                            onClick={this.handleDetailClick.bind(this, record)}
                        >
                            详情
                        </a>
                    );
                }
            }
        }
    ];
    componentDidMount () {
        let user = getUser();
        this.sections = JSON.parse(user.sections);
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState(
                {
                    leftkeycode: nextProps.leftkeycode
                },
                () => {
                    this.qury(1);
                }
            );
        }
    }
    // 查看车辆包详情
    handleDetailClick = async (record) => {
        if (
            record &&
            record.Status &&
            (record.Status === '5' || record.Status === '8')
        ) {
            message.info('本车苗木均已退回');
            return;
        }
        this.setState({
            detailVisible: true,
            currentCarID: record.ID
        });
    };
    // 关闭详情弹窗
    handleDetailModalCancel = async () => {
        this.setState({
            detailVisible: false,
            currentCarID: ''
        });
    }
    // 修改车辆内的苗木信息
    handleChangeNurseryInCar = async (record) => {
        if (
            record &&
            record.Status &&
            (record.Status === '5' || record.Status === '8')
        ) {
            message.info('本车苗木均已退回');
            return;
        }
        this.setState({
            handleNurseryInCarVisible: true,
            currentCarID: record.ID
        });
    }
    // 关闭修改车辆信息弹窗
    handleChangeNurseryInCarModalCancel = async () => {
        this.setState({
            handleNurseryInCarVisible: false,
            currentCarID: ''
        });
    }
    // 修改车辆信息
    handleEditCarInfoClick = async (record) => {
        if (
            record &&
            record.Status &&
            (record.Status === '5' || record.Status === '8')
        ) {
            message.info('本车苗木均已退回');
            return;
        }
        this.setState({
            editCarInfoVisible: true
        });
    }
    // 关闭修改车辆信息弹窗
    handleEditCarInfoModalCancel = async () => {
        this.setState({
            editCarInfoVisible: false
        });
    }
    // 合并车辆包
    handlMergeCarClick = async (record) => {
        if (
            record &&
            record.Status &&
            (record.Status === '5' || record.Status === '8')
        ) {
            message.info('本车苗木均已退回');
            return;
        }
        this.setState({
            mergeCarPackVisible: true
        });
    }
    // 关闭合并车辆包弹窗
    handleMergeCarPackModalCancel = async () => {
        this.setState({
            mergeCarPackVisible: false
        });
    }

    emitEmpty1 = () => {
        this.setState({ licenseplate: '' });
    };

    licenseplateChange (value) {
        this.setState({ licenseplate: value.target.value });
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || '',
            bigType: '',
            treetype: '',
            treetypename: ''
        });
    }

    onmmtypechange (value) {
        this.setState({ mmtype: value });
    }

    onStatusChange (value) {
        this.setState({ status: value });
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
        this.qury(pagination.current);
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    qury = async (page) => {
        const {
            licenseplate = '',
            section = '',
            stime = '',
            etime = '',
            size,
            status = '',
            mmtype = ''
        } = this.state;
        if (section === '' && licenseplate === '') {
            message.info('请选择项目及标段信息或输入车牌号');
            return;
        }
        const {
            actions: {
                getcarpackage,
                getForestUserDetail
            },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        try {
            let thinClassTree = tree.thinClassTree;
            let postdata = {
                licenseplate: licenseplate,
                section: section === '' ? keycode : section,
                isshrub: mmtype,
                stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
                etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
                page,
                size,
                status
            };

            this.setState({
                loading: true,
                percent: 0
            });

            let rst = await getcarpackage({}, postdata);
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                for (let i = 0; i < tblData.length; i++) {
                    let plan = tblData[i];
                    plan.order = (page - 1) * size + i + 1;
                    plan.liftertime1 = plan.CreateTime
                        ? moment(plan.CreateTime).format('YYYY-MM-DD')
                        : '/';
                    plan.liftertime2 = plan.CreateTime
                        ? moment(plan.CreateTime).format('HH:mm:ss')
                        : '/';
                    plan.Project = await getProjectNameBySection(plan.Section, thinClassTree);
                    plan.sectionName = await getSectionNameBySection(plan.Section, thinClassTree);
                    let userData = await getForestUserDetail({id: plan.Constructioner});
                    plan.ConstructionerName = (userData && userData.Full_Name) || '';
                    plan.ConstructionerUserName = (userData && userData.User_Name) || '';
                    plan.SupervisorName = (plan.SupervisorUser && plan.SupervisorUser.Full_Name) || '';
                    plan.SupervisorUserName = (plan.SupervisorUser && plan.SupervisorUser.User_Name) || '';
                }
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({ tblData, pagination });
            }
        } catch (e) {
            console.log('qury', e);
        }
    }

    exportexcel = async () => {
        const {
            licenseplate = '',
            section = '',
            stime = '',
            etime = '',
            status = '',
            mmtype = ''
        } = this.state;
        if (section === '' && licenseplate === '') {
            message.info('请选择项目及标段信息或输入车牌号');
            return;
        }
        const {
            actions: { getexportcarpackage },
            keycode = ''
        } = this.props;
        let postdata = {
            licenseplate: licenseplate,
            section: section === '' ? keycode : section,
            isshrub: mmtype,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            status
        };

        this.setState({ loading: true, percent: 0 });
        let rst3 = await getexportcarpackage({}, postdata);
        console.log('rst3', rst3);
        if (rst3 === '') {
            message.info('没有符合条件的信息');
        } else {
            this.createLink(this, `${FOREST_API}/${rst3}`);
        }
        this.setState({ loading: false });
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

    treeTable (details) {
        const {
            sectionoption,
            mmtypeoption,
            statusoption
        } = this.props;
        const {
            licenseplate,
            section,
            status,
            mmtype
        } = this.state;
        const suffix1 = licenseplate ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        let header = '';
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>车牌号：</span>
                        <Input
                            suffix={suffix1}
                            value={licenseplate}
                            className='forest-forestcalcw4'
                            onChange={this.licenseplateChange.bind(this)}
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
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>创建时间：</span>
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
                            此次查询共有车辆：
                            {this.state.pagination.total}辆
                        </span>
                    </Col>
                    <Col span={2}>
                        <Button type='primary' onClick={this.exportexcel.bind(this)}>
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
                        locale={{ emptyText: '当天无苗圃测量信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }
    render () {
        const {
            tblData,
            detailVisible,
            editCarInfoVisible,
            mergeCarPackVisible,
            handleNurseryInCarVisible
        } = this.state;
        return (
            <div>
                {this.treeTable(tblData)}
                {
                    detailVisible
                        ? <CarPackDetailModal
                            {...this.props}
                            {...this.state}
                            onDetailModalCancel={this.handleDetailModalCancel.bind(this)}
                        /> : ''
                }
                {
                    handleNurseryInCarVisible
                        ? <HandleNurseryInCar
                            {...this.props}
                            {...this.state}
                            onChangeNurseryInCarModalCancel={this.handleChangeNurseryInCarModalCancel.bind(this)}
                        /> : ''
                }
                {
                    editCarInfoVisible
                        ? <ChangeCarInfoModal
                            {...this.props}
                            {...this.state}
                            onEditCarModalCancel={this.handleEditCarInfoModalCancel.bind(this)}
                        /> : ''
                }
                {
                    mergeCarPackVisible
                        ? <MergeCarPackModal
                            {...this.props}
                            {...this.state}
                            onMergeCarPackModalCancel={this.handleMergeCarPackModalCancel.bind(this)}
                        /> : ''
                }
            </div>
        );
    }
}

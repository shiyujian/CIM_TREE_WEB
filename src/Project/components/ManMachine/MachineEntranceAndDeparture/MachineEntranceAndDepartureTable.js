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
    Notification
} from 'antd';
import moment from 'moment';
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getForestImgUrl
} from '_platform/auth';
import MachineEntranceModal from './MachineEntranceModal';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class MachineEntranceAndDepartureTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            section: '',
            indexNum: '',
            percent: 0,
            deviceName: '',
            picViewVisible: false,
            imgSrcs: [],
            viewDetailRecord: '',
            viewDetailVisible: false
        };
    }
    columns = [
        {
            title: '序列号',
            dataIndex: 'LocationDeviceID',
            key: 'LocationDeviceID',
            render: (text, record) => {
                if (text) {
                    let arrayList = text.split('-');
                    if (arrayList && arrayList instanceof Array && arrayList.length === 3) {
                        return arrayList[2];
                    }
                } else {
                    return '/';
                }
            }
        },
        {
            title: '设备名称',
            dataIndex: 'DeviceName',
            key: 'DeviceName'
        },
        {
            title: '项目',
            dataIndex: 'Project',
            key: 'Project'
        },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName'
        },
        // {
        //     title: '公司',
        //     dataIndex: 'orgName',
        //     key: 'orgName'
        // },
        {
            title: '进场时间',
            dataIndex: 'EnterTime',
            key: 'EnterTime'
        },
        // {
        //     title: '离场时间',
        //     dataIndex: 'LeaveTime',
        //     key: 'LeaveTime'
        // },
        {
            title: '司机姓名',
            dataIndex: 'Contacter',
            key: 'Contacter'
        },
        {
            title: '司机电话',
            dataIndex: 'Phone',
            key: 'Phone'
        },
        {
            title: '设备照片',
            dataIndex: 'Images',
            render: (text, record, index) => {
                if (record && record.Images) {
                    return <a
                        onClick={this.handlePicView.bind(this, record.Images)}>
                            查看
                    </a>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '操作',
            render: (record, index) => {
                return (
                    <div>
                        <a
                            type='primary'
                            onClick={this.handleViewDetail.bind(this, record)}
                        >
                            序列号历史查看
                        </a>
                    </div>
                );
            }
        }
    ]
    componentDidMount () {
    }

    handleDeviceNameChange (e) {
        this.setState({
            deviceName: e.target.value
        });
    }
    onSectionChange (value) {
        this.setState({
            section: value || ''
        });
    }

    handleIndexNumChange (e) {
        this.setState({
            indexNum: e.target.value
        });
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

    handleViewDetail = async (record) => {
        this.setState({
            viewDetailVisible: true,
            viewDetailRecord: record
        });
    }
    handleViewDetailCancel () {
        this.setState({
            viewDetailVisible: false,
            viewDetailRecord: ''
        });
    }
    // 查看图片
    handlePicView = (data) => {
        let imgSrcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                imgSrcs.push(src);
            });
            this.setState({
                imgSrcs,
                picViewVisible: true
            });
        } catch (e) {
            console.log('处理图片', e);
        }
    }
    // 关闭查看图片Modal
    handlePicCancel = () => {
        this.setState({
            imgSrcs: [],
            picViewVisible: false
        });
    }
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = async (page) => {
        const {
            section = '',
            indexNum = '',
            stime = '',
            etime = '',
            size,
            deviceName = ''
        } = this.state;
        if (section === '' && deviceName === '') {
            Notification.warning({
                message: '请选择标段或输入关键词'
            });
            return;
        }
        const {
            platform: { tree = {} },
            companyList,
            actions: {
                getdeviceworksbyday,
                getUserDetail
            }
        } = this.props;

        let thinClassTree = tree.thinClassTree;
        let postdata = {
            deviceName,
            section: section,
            indexNum,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getdeviceworksbyday({}, postdata);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.content;
        let userIDList = [];
        let userDataList = {};
        for (let i = 0; i < tblData.length; i++) {
            let plan = tblData[i];
            plan.order = (page - 1) * 10 + i + 1;
            plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
            plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
            let orgName = '';
            companyList.map((company) => {
                if (company && company.Section && company.Section.indexOf(plan.Section) !== -1) {
                    orgName = company.OrgName;
                }
            });
            plan.orgName = orgName;
            let userData = '';
            if (userIDList.indexOf(Number(plan.Inputer)) === -1) {
                userData = await getUserDetail({id: plan.Inputer});
            } else {
                userData = userDataList[Number(plan.Inputer)];
            }
            if (userData && userData.ID) {
                userIDList.push(userData.ID);
                userDataList[userData.ID] = userData;
            }
            plan.InputerName = (userData && userData.Full_Name) || '';
            plan.InputerUserName = (userData && userData.User_Name) || '';
        }
        const pagination = { ...this.state.pagination };
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = size;
        this.setState({
            tblData,
            pagination: pagination,
            loading: false,
            percent: 100
        });
    }
    treeTable (details) {
        const {
            sectionOption,
            machineTypeOption
        } = this.props;
        const {
            section,
            indexNum,
            deviceName
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>设备名称：</span>
                        <Input
                            value={deviceName}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleDeviceNameChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>标段：</span>
                        <Select
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onSectionChange.bind(this)}
                        >
                            {sectionOption}
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>序列号：</span>
                        <Input
                            value={indexNum}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleIndexNumChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg-datePicker'>
                        <span className='ManMachine-search-span'>进场时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='ManMachine-forestcalcw4'
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
                    <Col span={20} className='ManMachine-quryrstcnt'>
                        <span>
                            此次查询共有数据：
                            {this.state.pagination.total}条
                        </span>
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
                        locale={{ emptyText: '当前无机械进离场信息' }}
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
            imgSrcs = [],
            picViewVisible,
            viewDetailVisible
        } = this.state;
        return (
            <div>
                {this.treeTable(tblData)}
                {
                    picViewVisible
                        ? (<Modal
                            width={522}
                            title='图片详情'
                            style={{ textAlign: 'center' }}
                            visible
                            onOk={this.handlePicCancel.bind(this)}
                            onCancel={this.handlePicCancel.bind(this)}
                            footer={null}
                        >
                            {
                                imgSrcs.map((img) => {
                                    return (
                                        <img style={{ width: '490px' }} src={img} alt='图片' />
                                    );
                                })
                            }
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this.handlePicCancel.bind(this)}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                        关闭
                                </Button>
                            </Row>
                        </Modal>)
                        : ''
                }
                {
                    viewDetailVisible
                        ? <MachineEntranceModal
                            {...this.props}
                            {...this.state}
                            handleViewDetailCancel={this.handleViewDetailCancel.bind(this)}
                        /> : ''
                }
            </div>
        );
    }
}

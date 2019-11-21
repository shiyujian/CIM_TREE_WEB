import React, { Component } from 'react';
import {
    Icon,
    Table,
    Modal,
    Row,
    Col,
    Select,
    Button,
    Input,
    Progress,
    Divider,
    Notification,
    Popconfirm,
    DatePicker
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {trim, getForestImgUrl} from '_platform/auth';
import '../index.less';
import ManEntranceModal from './ManEntranceModal';
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class ManEntranceAndDepartureTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            workGroup: '',
            workType: '',
            status: 1,
            workManName: '',
            workManCreater: '',
            userOptions: [],
            percent: 0,
            recordDetail: '',
            dataSourceSelected: [],
            viewPersonEntrysVisible: false,
            viewPersonEntrysRecord: '',
            imgSrcs: [],
            picViewVisible: false,
            sintime: moment().format('YYYY-MM-DD 00:00:00'),
            eintime: moment().format('YYYY-MM-DD 23:59:59')
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '姓名',
            dataIndex: 'Name'
        },
        {
            title: '性别',
            dataIndex: 'Gender'
        },
        {
            title: '身份证号',
            dataIndex: 'ID_Card'
        },
        {
            title: '工种',
            dataIndex: 'WorkTypeName'
        },
        {
            title: '班组',
            dataIndex: 'workGroupName'
        },
        {
            title: '登记人',
            dataIndex: 'InputerName',
            render: (text, record, index) => {
                if (record.InputerUserName && record.InputerName) {
                    return <sapn>{record.InputerName + '(' + record.InputerUserName + ')'}</sapn>;
                } else if (record.InputerName && !record.InputerUserName) {
                    return <sapn>{record.InputerName}</sapn>;
                } else {
                    return <sapn> / </sapn>;
                }
            }
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime'
        },
        // {
        //     title: '当前状态',
        //     dataIndex: 'InStatus',
        //     render: (text, record, index) => {
        //         if (text === 1) {
        //             return <sapn>在场</sapn>;
        //         } else if (text === 0) {
        //             return <sapn>离场</sapn>;
        //         } else if (text === -1) {
        //             return <sapn>仅登记</sapn>;
        //         } else {
        //             return <sapn>/</sapn>;
        //         }
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
                // if (record.InStatus !== -1) {
                return <div>
                    <a onClick={this.handleViewPersonEntrysOk.bind(this, record)}>查看</a>
                </div>;
                // }
            }
        }

    ];
    componentDidUpdate (prevProps, prevState) {
        const {
            leftKeyCode,
            parentOrgID,
            permission
        } = this.props;
        // if (permission && permission !== prevProps.permission) {
        //     this.onSearch();
        // }
        if (permission && leftKeyCode !== prevProps.leftKeyCode) {
            this.onSearch();
        }
        if (parentOrgID && parentOrgID !== prevProps.parentOrgID) {
            this.query(1);
        }
    }
    // 人员姓名
    handleWorkManNameChange (value) {
        this.setState({
            workManName: trim(value.target.value)
        });
    }
    // 班组
    handleWorkGroupChange (value) {
        this.setState({
            workGroup: value
        });
    }
    // 工种
    handleWorkTypeChange (value) {
        this.setState({
            workType: value
        });
    }
    // 状态
    handleStatusChange (value) {
        this.setState({
            status: value
        });
    }
    // 人员搜索
    handleUserSearch = async (value) => {
        const {
            actions: {
                getUsers
            }
        } = this.props;
        let userList = [];
        let userOptions = [];
        if (value.length >= 2) {
            let postData = {
                fullname: trim(value)
            };
            let userData = await getUsers({}, postData);
            if (userData && userData.content && userData.content instanceof Array) {
                userList = userData.content;
                userList.map((user) => {
                    userOptions.push(
                        <Option
                            key={user.ID}
                            title={`${user.Full_Name}(${user.User_Name})`}
                            value={user.ID}>
                            {`${user.Full_Name}(${user.User_Name})`}
                        </Option>
                    );
                });
            }
            this.setState({
                userOptions
            });
        }
    }
    // 登记人
    onCreaterChange (value) {
        this.setState({
            workManCreater: value
        });
    }
    datepick (value) {
        this.setState({
            sintime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            eintime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    // 换页
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 重置
    resetinput () {
        const { resetinput, leftKeyCode } = this.props;
        resetinput(leftKeyCode);
    }
    // 搜索
    query = async (page) => {
        const {
            workGroup = '',
            workType = '',
            workManName = '',
            workManCreater = '',
            status = '',
            sintime = '',
            eintime = ''
        } = this.state;
        const {
            workTypesList,
            workGroupList,
            permission = false,
            leftKeyCode,
            parentOrgID = '',
            parentOrgData = '',
            selectOrgData = '',
            actions: {
                getWorkMans,
                getUserDetail
            }
        } = this.props;
        console.log('selectOrgData', selectOrgData);
        let orgName = '';
        if (permission) {
            if (!leftKeyCode) {
                Notification.warning({
                    message: '请选择单位'
                });
                return;
            } else {
                orgName = (selectOrgData && selectOrgData.OrgName) || '';
            }
        } else {
            if (!parentOrgID) {
                Notification.warning({
                    message: '当前用户无组织机构，请重新登录'
                });
                return;
            } else {
                orgName = (parentOrgData && parentOrgData.OrgName) || '';
            }
        }
        if (status !== '' && !sintime && !eintime) {
            Notification.warning({
                message: '选择状态后，请选择时间'
            });
            return;
        }
        let postdata = {
            org: permission ? leftKeyCode : parentOrgID,
            team: workGroup || '',
            worktypeid: workType || '',
            name: workManName || '',
            creater: workManCreater || '',
            status: status,
            sintime,
            eintime,
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getWorkMans({}, postdata);
        console.log('rst', rst);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let contentData = rst.content;

        // 获取填报人唯一性数组
        let userIDList = [];
        let userDataList = [];
        for (let i = 0; i < contentData.length; i++) {
            let plan = contentData[i];
            plan.order = (page - 1) * 10 + i + 1;
            // 公司名
            plan.orgName = orgName || '';
            // 工种
            let typeName = '/';
            if (plan && plan.WorkTypeID) {
                workTypesList.map((type) => {
                    if (type.ID === plan.WorkTypeID) {
                        typeName = type.Name;
                    }
                });
            }
            plan.WorkTypeName = typeName;
            // 班组
            let groupName = '';
            if (plan && plan.TeamID) {
                workGroupList.map((group) => {
                    if (group.ID === plan.TeamID) {
                        groupName = group.Name;
                    }
                });
            }
            plan.workGroupName = groupName;
            plan.liftertime1 = plan.CreateTime
                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                : '/';
            plan.liftertime2 = plan.CreateTime
                ? moment(plan.CreateTime).format('HH:mm:ss')
                : '/';
            // 获取上报人
            let userData = '';
            if (userIDList.indexOf(Number(plan.Creater)) === -1) {
                userData = await getUserDetail({id: plan.Creater});
            } else {
                userData = userDataList[Number(plan.Creater)];
            }
            if (userData && userData.ID) {
                userIDList.push(userData.ID);
                userDataList[userData.ID] = userData;
            }
            plan.InputerName = (userData && userData.Full_Name) || '';
            plan.InputerUserName = (userData && userData.User_Name) || '';
        }
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData: contentData,
            pagination,
            percent: 100,
            loading: false
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
    // 查看进离场
    handleViewPersonEntrysOk = (record) => {
        this.setState({
            viewPersonEntrysVisible: true,
            viewPersonEntrysRecord: record
        });
    }
    // 关闭进离场弹窗
    handleViewPersonEntrysCancel = () => {
        this.setState({
            viewPersonEntrysVisible: false,
            viewPersonEntrysRecord: ''
        });
    }
    treeTable (details) {
        const {
            workTypesList,
            workGroupList
        } = this.props;
        const {
            workGroup,
            workType,
            status,
            workManName,
            workManCreater,
            userOptions,
            sintime,
            eintime
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>姓名：</span>
                        <Input
                            value={workManName}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleWorkManNameChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>班组：</span>
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
                            value={workGroup}
                            onChange={this.handleWorkGroupChange.bind(this)}
                        >
                            {
                                workGroupList.map((group) => {
                                    return <Option key={group.ID} value={group.ID} title={group.Name}>
                                        {group.Name}
                                    </Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>工种：</span>
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
                            value={workType}
                            onChange={this.handleWorkTypeChange.bind(this)}
                        >
                            {
                                workTypesList.map((type) => {
                                    return <Option key={type.ID} value={type.ID} title={type.Name}>
                                        {type.Name}
                                    </Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>登记人：</span>
                        <Select
                            allowClear
                            showSearch
                            className='ManMachine-forestcalcw4'
                            placeholder={'请输入姓名搜索'}
                            onSearch={this.handleUserSearch.bind(this)}
                            onChange={this.onCreaterChange.bind(this)}
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            value={workManCreater || undefined}
                        >
                            {userOptions}
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>状态：</span>
                        <Select
                            // allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={status}
                            onChange={this.handleStatusChange.bind(this)}
                        >
                            <Option key={'仅登记'} value={0} title={'仅登记'}>
                                仅登记
                            </Option>
                            <Option key={'在场'} value={1} title={'在场'}>
                                在场
                            </Option>
                            <Option key={'出勤'} value={2} title={'出勤'}>
                                出勤
                            </Option>
                            <Option key={'缺勤'} value={3} title={'缺勤'}>
                                缺勤
                            </Option>
                        </Select>
                    </div>
                    <div className='ManMachine-mrg-datePicker'>
                        <span className='ManMachine-search-span'>进场时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(sintime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(eintime, 'YYYY-MM-DD HH:mm:ss')
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
                    <Col span={20} className='ManMachine-quryrstcnt' />
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
                {header}
            </div>
        );
    }
    render () {
        const {
            tblData = [],
            percent,
            loading,
            viewPersonEntrysVisible,
            imgSrcs,
            picViewVisible
        } = this.state;
        console.log('tblData', tblData);
        return (
            <div>
                {this.treeTable(tblData)}
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
                                    percent={percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: loading
                        }}
                        locale={{ emptyText: '当前无登记人信息' }}
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
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
                    viewPersonEntrysVisible
                        ? <ManEntranceModal
                            {...this.props}
                            {...this.state}
                            handleViewPersonEntrysCancel={this.handleViewPersonEntrysCancel.bind(this)}
                        /> : ''
                }
            </div>
        );
    }
}

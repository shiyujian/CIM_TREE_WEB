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
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getLodop} from '_platform/LodopFuncs';
import {trim} from '_platform/auth';
import '../index.less';
import ManEntranceModal from './ManEntranceModal';
const { Option } = Select;

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
            inStatus: '',
            workManName: '',
            workManCreater: '',
            userOptions: [],
            percent: 0,
            recordDetail: '',
            dataSourceSelected: [],
            selectedRowKeys: [],
            viewPersonEntrysVisible: false,
            viewPersonEntrysRecord: ''
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
            title: '人脸识别SN',
            dataIndex: 'FaceSN',
            render: (text, record, index) => {
                if (text) {
                    return <sapn>{text}</sapn>;
                } else {
                    return <sapn>未关联</sapn>;
                }
            }
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime'
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
            title: '在场状态',
            dataIndex: 'InStatus',
            render: (text, record, index) => {
                if (text === 1) {
                    return <sapn>在场</sapn>;
                } else if (text === 0) {
                    return <sapn>离场</sapn>;
                } else if (text === -1) {
                    return <sapn>仅登记</sapn>;
                } else {
                    return <sapn>/</sapn>;
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
                if (record.InStatus === -1) {
                    return <div>
                        <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>
                        <Divider type='vertical' />
                        <Popconfirm
                            onConfirm={this.handleDeleteWorkMan.bind(this, record)}
                            title='确定要删除人员吗'
                            okText='确定'
                            cancelText='取消' >
                            <a>删除</a>
                        </Popconfirm>
                    </div>;
                } else {
                    return <div>
                        <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>
                        <Divider type='vertical' />
                        <a onClick={this.handleViewPersonEntrysOk.bind(this, record)}>查看</a>
                        <Divider type='vertical' />
                        <Popconfirm
                            onConfirm={this.handleDeleteWorkMan.bind(this, record)}
                            title='确定要删除人员吗'
                            okText='确定'
                            cancelText='取消' >
                            <a>删除</a>
                        </Popconfirm>
                    </div>;
                }
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
        // if (permission && leftKeyCode !== prevProps.leftKeyCode) {
        //     this.onSearch();
        // }
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
    handleInStatusChange (value) {
        this.setState({
            inStatus: value
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
            inStatus = ''
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
                getWorkmans,
                getUserDetail
            }
        } = this.props;
        let orgName = '';
        if (permission) {
            if (!leftKeyCode) {
                Notification.warning({
                    message: '请选择单位'
                });
                return;
            } else {
                orgName = (selectOrgData && selectOrgData.orgName) || '';
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
        let postdata = {
            org: permission ? leftKeyCode : parentOrgID,
            team: workGroup || '',
            worktypeid: workType || '',
            name: workManName || '',
            creater: workManCreater || '',
            instatus: inStatus,
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getWorkmans({}, postdata);
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
            // 二维码
            plan.src = plan.QRCodePath;
        }
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData: contentData,
            pagination,
            selectedRowKeys: [],
            dataSourceSelected: [],
            loading: false,
            percent: 100
        });
    }
    // 表格的多选设置
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            dataSourceSelected: selectedRows
        });
    }
    // 多个打印
    handlePrinting = () => {
        const {
            dataSourceSelected
        } = this.state;
        let printDataSource = dataSourceSelected;
        this.setState({
            printDataSource
        }, () => {
            this.printPageView();
        });
    }
    // 单个打印
    handlePrintSingle = (record) => {
        this.setState({
            printDataSource: [record]
        }, () => {
            this.printPageView();
        });
    }
    // 打印
    printPageView = () => {
        const {
            printDataSource
        } = this.state;
        // 打印
        let LODOP = getLodop();
        LODOP.PRINT_INIT('react使用打印插件CLodop'); // 打印初始化
        LODOP.SET_PRINT_PAGESIZE(1, 800, 300, 'A8');
        printDataSource.map((printData, index) => {
            if (index === 0) {
                LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                    document.getElementById(`print${printData.ID}`).innerHTML);
            } else {
                // 下一页
                LODOP.NewPage();
                LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%',
                    document.getElementById(`print${printData.ID}`).innerHTML);
            }
        });

        LODOP.PREVIEW(); // 最后一个打印(预览)语句
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
    handleDeleteWorkMan = async (record) => {
        const {
            actions: {
                deleteWorkman
            }
        } = this.props;
        let data = await deleteWorkman({id: record.ID});
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            Notification.success({
                message: '删除人员成功',
                duration: 3
            });
            await this.handleTableChange({current: 1});
        } else {
            Notification.error({
                message: '删除人员失败',
                duration: 3
            });
        }
    }
    treeTable (details) {
        const {
            workTypesList,
            workGroupList
        } = this.props;
        const {
            workGroup,
            workType,
            inStatus,
            workManName,
            workManCreater,
            userOptions,
            selectedRowKeys
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
                        <span className='ManMachine-search-span'>状态：</span>
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
                            value={inStatus}
                            onChange={this.handleInStatusChange.bind(this)}
                        >
                            <Option key={'仅登记'} value={-1} title={'仅登记'}>
                                仅登记
                            </Option>
                            <Option key={'在场'} value={1} title={'在场'}>
                                在场
                            </Option>
                            <Option key={'离场'} value={0} title={'离场'}>
                                离场
                            </Option>
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
                        <Button
                            type='primary'
                            disabled={selectedRowKeys.length === 0}
                            onClick={this.handlePrinting.bind(this)}
                        >
                            打印
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
                {header}
            </div>
        );
    }
    render () {
        const {
            tblData = [],
            selectedRowKeys = [],
            percent,
            loading,
            printDataSource = [],
            viewPersonEntrysVisible
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
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
                        rowSelection={rowSelection}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
                {
                    viewPersonEntrysVisible
                        ? <ManEntranceModal
                            {...this.props}
                            {...this.state}
                            handleViewPersonEntrysCancel={this.handleViewPersonEntrysCancel.bind(this)}
                        /> : ''
                }
                {
                    printDataSource.map((printData) => {
                        return (
                            <div
                                key={`print${printData.ID}`}
                                id={`print${printData.ID}`}
                                style={{
                                    display: 'none',
                                    width: '8cm',
                                    height: '3cm',
                                    border: 'black',
                                    fontSize: '12.5'
                                }}>
                                <Row>
                                    <div
                                        style={{
                                            width: '8cm',
                                            // height: '3cm',
                                            display: 'inline-block'
                                        }}>
                                        <div
                                            style={{
                                                // width: '5cm',
                                                width: 'calc(5cm - 5px)',
                                                display: 'inline-block',
                                                marginLeft: '5px',
                                                paddingTop: '7px'
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            display: 'inline-block',
                                                            textAlign: 'right',
                                                            verticalAlign: 'top'
                                                        }}
                                                    >
                                                姓名：
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: 'calc(100% - 50px)',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {printData && printData.Name}
                                                        {/* 王伟王伟王伟 */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                性别：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData && printData.Gender}
                                                    {/* 男 */}
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                工种：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData.WorkTypeName}
                                                    {/* 油漆工 */}
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        display: 'inline-block',
                                                        textAlign: 'right',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
                                                班组：
                                                </div>
                                                <div
                                                    style={{
                                                        width: 'calc(100% - 50px)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {printData.workGroupName}
                                                    {/* 测试班组 */}
                                                </div>
                                            </div>
                                            <div>
                                                {/* <div style={{display: 'inline-block'}}>
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            display: 'inline-block',
                                                            textAlign: 'right',
                                                            verticalAlign: 'top'
                                                        }}
                                                    >
                                                    单位：
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: 'calc(100% - 50px)',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {printData.orgName}
                                                    </div>
                                                </div> */}

                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                // width: '3cm',
                                                width: 'calc(3cm - 15px)',
                                                display: 'inline-block',
                                                textAlign: 'right',
                                                verticalAlign: 'top',
                                                marginRight: '15px',
                                                paddingTop: '7px',
                                                paddingBottom: '2px'
                                                // marginTop: '0.5cm'
                                            }}
                                        >
                                            <div>
                                                <img
                                                    src={printData.src}
                                                    id='myImg1'
                                                    alt='uu'
                                                    style={{
                                                        height: '2cm',
                                                        width: '2cm',
                                                        margin: '0 auto'
                                                    }} />
                                            </div>
                                            {/* <div>
                                                <span style={{float: 'left'}}>
                                                        大美雄安
                                                </span>
                                                <span style={{float: 'right'}}>
                                                    秀美景苑
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{
                                            display: 'inline-block',
                                            paddingLeft: '5px',
                                            paddingRight: '5px'
                                        }}>
                                            <div
                                                style={{
                                                    width: '50px',
                                                    display: 'inline-block',
                                                    textAlign: 'right',
                                                    verticalAlign: 'top'
                                                }}
                                            >
                                        单位：
                                            </div>
                                            <div
                                                style={{
                                                    width: 'calc(100% - 50px)',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {printData.orgName}
                                                {/* 华东勘测设计研究院 */}
                                            </div>
                                        </div>
                                    </div>

                                </Row>
                            </div>
                        );
                    })
                }

            </div>
        );
    }
}

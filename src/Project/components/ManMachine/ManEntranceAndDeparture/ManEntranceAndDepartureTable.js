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
    Notification
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import QRCode from 'qrcode.react';
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
                    return <sapn>进场</sapn>;
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
                    return <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>;
                } else {
                    return <div>
                        <a onClick={this.handlePrintSingle.bind(this, record)}>打印</a>
                        <Divider type='vertical' />
                        <a onClick={this.handleViewPersonEntrysOk.bind(this, record)}>查看</a>
                    </div>;
                }
            }
        }

    ];
    componentDidMount () {
        // this.query();
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
    // 状态
    onStatusChange (value) {
        this.setState({
            inStatus: value
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
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }
    // 搜索
    query = async (page) => {
        const {
            workGroup = '',
            workType = '',
            workManName = '',
            workManCreater = ''
        } = this.state;
        const {
            companyList,
            leftkeycode,
            workTypesList,
            workGroupList,
            actions: {
                getWorkmans,
                getUserDetail
            }
        } = this.props;
        if (!workGroup && !workManName) {
            Notification.warning({
                message: '请选择班组或输入姓名'
            });
            return;
        }

        let postdata = {
            team: workGroup || '',
            worktypeid: workType || '',
            name: workManName || '',
            creater: workManCreater || '',
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
        let tblData = rst.content;
        console.log('companyList', companyList);
        let orgName = '';
        companyList.map((company) => {
            if (leftkeycode === company.ID) {
                orgName = company.OrgName;
            }
        });
        console.log('aaaa', companyList);
        // 获取填报人唯一性数组
        let userIDList = [];
        let userDataList = [];
        for (let i = 0; i < tblData.length; i++) {
            let plan = tblData[i];
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
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData,
            pagination,
            selectedRowKeys: [],
            dataSourceSelected: []
        }, () => {
            for (let t = 0; t < tblData.length; t++) {
                let data = tblData[t];
                var canvas = document.getElementById(`${data.ID}`);
                var strDataURI = canvas.toDataURL('image/png');
                data.src = strDataURI;
            }
            this.setState({
                loading: false,
                percent: 100,
                tblData
            });
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
        console.log('printDataSource', printDataSource);
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
                    tblData.map((data) => {
                        return <QRCode
                            key={data.ID}
                            id={data.ID}
                            style={{display: 'none'}}
                            value={data.ID} />;
                    })
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
                                                paddingLeft: '5px'
                                            }}
                                        >
                                            <div>
                                                <div
                                                    // style={{
                                                    //     width: '2.5cm',
                                                    //     display: 'inline-block',
                                                    //     verticalAlign: 'top'
                                                    // }}
                                                >
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
                                                {/* <div
                                                    style={{
                                                        width: '2.5cm',
                                                        display: 'inline-block',
                                                        verticalAlign: 'top'
                                                    }}
                                                >
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
                                                        {printData.Gender}
                                                    </div>
                                                </div> */}
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
                                                width: 'calc(3cm - 5px)',
                                                display: 'inline-block',
                                                textAlign: 'right',
                                                verticalAlign: 'top',
                                                paddingRight: '5px'
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
                                </Row>
                            </div>
                        );
                    })
                }

            </div>
        );
    }
}

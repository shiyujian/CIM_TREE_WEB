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
import {trim} from '_platform/auth';
import '../index.less';
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
            viewPersonEntrysVisible: false,
            viewPersonEntrysRecord: '',
            faceRecognitionSn: '',
            IDCard: ''
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
            dataIndex: 'FaceSN'
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
    // 人脸识别设备SN
    handleFaceRecognitionSnChange (value) {
        this.setState({
            faceRecognitionSn: trim(value.target.value)
        });
    }
    // 身份证号
    handleIDCardChange (value) {
        this.setState({
            IDCard: trim(value.target.value)
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
            workManCreater = '',
            faceRecognitionSn = '',
            IDCard = ''
        } = this.state;
        const {
            companyList,
            leftkeycode,
            workTypesList,
            workGroupList,
            actions: {
                getFaceWorkmans,
                getUserDetail
            }
        } = this.props;
        console.log('companyList', companyList);
        let orgName = '';
        let section = '';
        companyList.map((company) => {
            if (leftkeycode === company.ID) {
                orgName = company.OrgName;
                section = company.Section;
            }
        });
        console.log('aaaa', companyList);
        // if (!workGroup && !workManName) {
        //     Notification.warning({
        //         message: '请选择班组或输入姓名'
        //     });
        //     return;
        // }
        let postdata = {
            team: workGroup || '',
            worktypeid: workType || '',
            faceRecognitionSn,
            card: IDCard || '',
            name: workManName || '',
            creater: workManCreater || '',
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getFaceWorkmans({}, postdata);
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
            if (plan.Creater) {
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
        }
        const pagination = { ...this.state.pagination };
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData: contentData,
            pagination,
            loading: false,
            percent: 100
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
            faceRecognitionSn,
            IDCard
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
                        <span className='ManMachine-search-span'>人脸识别SN：</span>
                        <Input
                            value={faceRecognitionSn}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleFaceRecognitionSnChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>身份证号：</span>
                        <Input
                            value={IDCard}
                            className='ManMachine-forestcalcw4'
                            onChange={this.handleIDCardChange.bind(this)}
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
            loading
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
                        locale={{ emptyText: '当前无人脸识别人员列表信息' }}
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }
}

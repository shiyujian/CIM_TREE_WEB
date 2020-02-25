import React, {
    Component
} from 'react';
import {
    Table,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Progress,
    message,
    Divider,
    Modal,
    Notification
} from 'antd';
import {
    DOCEXPORT_API
} from '_platform/api';
import moment from 'moment';
import DrawAreaAcceptModal from './DrawAreaAcceptModal';
import AgainCheckModal from './AgainCheckModal';
import DetailsModal from './DetailsModal';
import CheckModal from './CheckModal';

import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getUser
} from '_platform/auth';
import {
    getYsTypeByID,
    getStatusByID
} from './auth';
const {
    RangePicker
} = DatePicker;
const Option = Select.Option;
const { confirm } = Modal;
export default class AgainAcceptTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            curingTreeData: [], // 表格信息
            pagination: {},
            loading: false,
            size: 11,
            exportsize: 100,
            stime1: '',
            etime1: '',
            // stime1: moment().format('YYYY-MM-DD 00:00:00'),
            // etime1: moment().format('YYYY-MM-DD 23:59:59'),
            ystype: '', // 验收类型
            status: '', // 状态
            treetypename: '',
            section: '',
            smallclass: '',
            thinclass: '',
            role: 'inputer',
            percent: 0,
            totalNum: '',
            imgArr: [],
            curingTypes: [],
            curingSXM: '',
            smallclassData: '',
            thinclassData: '',
            sgy: '', // 施工员
            jl: '', // 监理
            yz: '', // 业主
            shigongOptions: [],
            jianliOptions: [],
            itemDetailList: {}, // 数字化验收详情
            treetypeoption: [], // 根据小班动态获取的树种列表
            treeTyepList: [], // 树种列表
            unQualifiedList: [], // 不合格记录列表
            unitMessage: [],
            record: {},
            itemDetail: '',
            againCheckModalVisible: false, // 重新验收
            detailsModalVisible: false, // 查看详情
            checkModalVisible: false, // 审核
            DetailsInfo: '', // 详情信息
            thinClassDesignData: [],
            filterList: []
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order'
            },
            {
                title: '标段',
                dataIndex: 'sectionName'
            },
            {
                title: '细班号',
                dataIndex: 'thinclass'
            },
            {
                title: '涉及细班数',
                dataIndex: 'thinclassNum'
            },
            {
                title: '验收类型',
                dataIndex: 'ystype'
            },
            {
                title: '验收类型数量',
                dataIndex: 'ystypeNum'
            },
            {
                title: '树种',
                dataIndex: 'TreeType'
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '申请人',
                dataIndex: 'ApplierName',
                render: (text, record) => {
                    return (record.ApplierObj && record.ApplierObj.Full_Name) || '';
                }
            },
            {
                title: '监理',
                dataIndex: 'supervisorName',
                render: (text, record) => {
                    return (record.SupervisorObj && record.SupervisorObj.Full_Name) || '';
                }
            },
            {
                title: '业主',
                dataIndex: 'ownerName',
                render: (text, record) => {
                    return (record.OwnerObj && record.OwnerObj.Full_Name) || '';
                }
            },
            {
                title: '申请验收时间',
                render: (text, record) => {
                    const {
                        ApplyTime = ''
                    } = record;
                    return (
                        <div > {ApplyTime} </div>
                    );
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    let arr = [
                        <a onClick={this.onSeeDetails.bind(this, record)} >
                            查看
                        </a>
                    ];
                    let user = getUser();
                    if (record.Status === 0 && user.roles.ID === 11) {
                        // 监理且状态为施工提交
                        arr.push(
                            <Divider type='vertical' />,
                            <a onClick={this.onCheck.bind(this, record)}>审核</a>
                        );
                    } else if (record.Status === 1 && user.roles.ID === 9) {
                        // 业主且监理通过
                        arr.push(
                            <Divider type='vertical' />,
                            <a onClick={this.onCheck.bind(this, record)}>审核</a>
                        );
                    }
                    return (<div>
                        {
                            arr
                        }
                    </div>);
                }
            }
        ];
    }
    // 审核
    onCheck (record) {
        this.setState({
            record,
            checkModalVisible: true
        });
    }
    async handleOkCheck (param) {
        const { postCheckWfreAcceptance } = this.props.actions;
        const { record } = this.state;
        let user = getUser();
        let Node = '';
        if (record.Status === 1) {
            Node = '业主审核';
        } else if (record.Status === 0) {
            Node = '监理审核';
        }
        let pro = {
            FileInfo: '', // 审核意见附件
            Info: param.checkRemark, // 审核意见
            Node: Node, // 节点名称
            RAID: record.ID, // 重新发起流程申请ID
            Status: param.checkStatus, // 0未通过 1通过
            User: user.ID // 审核用户
        };
        let checkInfoRep = await postCheckWfreAcceptance({}, pro);
        if (checkInfoRep && checkInfoRep.code === 1) {
            this.setState({
                checkModalVisible: false
            });
            Notification.success({
                message: '提示',
                description: '审核操作已生效'
            });
            // 刷新列表
            this.query(1);
        }
    }
    handleCancelCheck () {
        this.setState({
            checkModalVisible: false
        });
    }
    // 查看详情
    async onSeeDetails (record) {
        const { getWfreacceptanceByID } = this.props.actions;
        let DetailsInfo = await getWfreacceptanceByID({id: record.ID}, {});
        this.setState({
            DetailsInfo,
            detailsModalVisible: true
        });
    }
    handleCancelDeatail () {
        this.setState({
            detailsModalVisible: false
        });
    }
    // 获取各个标段对应的公司和项目经理
    componentDidMount = async () => {
        const {
            actions: {
                getUnitMessageBySection
            }
        } = this.props;
        let unitMessage = await getUnitMessageBySection();
        // 获取监理和业主
        this.getOwnerInfo();
        this.setState({
            unitMessage
        });
    }
    async getOwnerInfo (section = '') {
        let user = getUser();
        if (section) {
            // 业主的时候
        } else {
            section = user.section;
        }
        const {
            actions: {
                getUsers,
                getRoles
            },
            platform: {
                roles = []
            }
        } = this.props;
        let rolesData = [];
        if (!(roles && roles instanceof Array && roles.length > 0)) {
            rolesData = await getRoles();
        } else {
            rolesData = roles;
        }
        let shigongRole = '';
        let jianliRole = '';
        let yezhuRole = '';
        rolesData.map((role) => {
            if (role && role.ID && !role.ParentID) {
                if (role.RoleName === '施工') {
                    shigongRole = role.ID;
                } else if (role.RoleName === '监理') {
                    jianliRole = role.ID;
                } else if (role.RoleName === '业主') {
                    yezhuRole = role.ID;
                }
            }
        });
        
        // only choose the section, you can search the people
        let shigong = await getUsers({}, {
            status: 1,
            section: section,
            role: shigongRole
        });
        let jianli = await getUsers({}, {
            status: 1,
            section: section,
            role: jianliRole
        });
        let yezhu = await getUsers({}, {
            status: 1,
            section: '',
            role: yezhuRole
        });
        
        let shigongOptions = [];
        let jianliOptions = [];
        let yezhuOptions = [];
        if (shigong && shigong.content && shigong.content instanceof Array) {
            shigong.content.map(item => {
                shigongOptions.push(<Option value={item.ID} key={item.ID} title={item.User_Name}>
                    {item.Full_Name}（{item.User_Name}）
                </Option>);
            });
        }
        console.log('监理账号', jianli.content);
        if (jianli && jianli.content && jianli.content instanceof Array) {
            jianli.content.map(item => {
                jianliOptions.push(<Option value={item.ID} key={item.ID} title={item.User_Name}>
                    {item.Full_Name}（{item.User_Name}）
                </Option>);
            });
        }
        if (yezhu && yezhu.content && yezhu.content instanceof Array) {
            yezhu.content.map(item => {
                yezhuOptions.push(<Option value={item.ID} key={item.ID} title={item.User_Name}>
                    {item.Full_Name}（{item.User_Name}）
                </Option>);
            });
        }
        this.setState({
            shigongOptions,
            jianliOptions,
            yezhuOptions
        });
    }
    // 标段选择
    async onSectionChange (value) {
        const {
            sectionSelect
        } = this.props;
        if (!value) {
            return;
        }
        sectionSelect(value || '');
        this.getOwnerInfo(value);
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: ''
        });
    }
    // 批量重新验收
    onAgainCheck () {
        this.setState({
            againCheckModalVisible: true
        });
    }
    // 重新验收提交
    handleOkAgainCheck = async (param) => {
        confirm({
            title: '提示',
            content: '点击确认并经监理、业主审核通过后，所选原有验收数据将被删除，所选验收状态将被退回，是否继续？',
            onOk: async () => {
                const { postWfreAcceptance } = this.props.actions;
                let user = getUser();
                let Details = [];
                let CheckTypeIDArr = [];
                let CheckTypeArr = [];
                let ThinClassArr = [];
                param.checkItem.map(item => {
                    if (!CheckTypeIDArr.includes(item.CheckType)) {
                        CheckTypeIDArr.push(item.CheckType);
                    }
                    // 所有细班验收项
                    item.ThinClass.map(row => {
                        let rowArr = row.split('-');
                        let newRow = `${rowArr[0]}-${rowArr[2]}-${rowArr[3]}-${rowArr[4]}`;
                        ThinClassArr.push(newRow);
                        Details.push({
                            CheckType: parseInt(item.CheckType),
                            Section: user.section,
                            ThinClass: newRow,
                            TreeType: 0
                        });
                    });
                });
                // 得到验收类型数组
                CheckTypeIDArr.map(item => {
                    CheckTypeArr.push(getYsTypeByID(parseInt(item)));
                });
                let pro = {
                    Applier: user.ID, // 申请人
                    CheckType: CheckTypeArr.toString(), // 验收类型名称，多个逗号隔开
                    CheckTypeNum: CheckTypeArr.length, // 验收类型数量
                    Details, // 重新验收项详情
                    Owner: param.owner, // 业主
                    Reason: param.opinion, // 原因
                    ReasonFile: param.fileUrl, // 原因附件
                    Section: user.section, // 标段
                    Supervisor: param.supervisor, // 监理
                    ThinClass: ThinClassArr.toString(), // 细班，多个逗号隔开
                    ThinClassNum: ThinClassArr.length, // 细班数量
                    TreeType: '' // 树种名称，多个逗号隔开
                };
                let rep = await postWfreAcceptance({}, pro);
                if (rep.code === 1) {
                    Notification.success({
                        message: '提示',
                        description: '您发起的批量重新验收已提交'
                    });
                } else if (rep.code === 2) {
                    Notification.error({
                        message: '提示',
                        description: '同细班，同一验收项已提交验收'
                    });
                } else {
                    Notification.error({
                        message: '提示',
                        description: '提交失败，请联系管理员查找失败原因'
                    });
                }
            },
            onCancel: () => {
                this.setState({
                    againCheckModalVisible: true
                });
            }
        });
        this.setState({
            againCheckModalVisible: false
        });
    }
    handleCancelAgainCheck () {
        this.setState({
            againCheckModalVisible: false
        });
    }
    // 验收类型  状态 施工员 测量员 监理的选择
    ysTypeChange (type, value) { // 清空select会调用此函数
        if (type === 'yslx') {
            this.setState({
                ystype: value || ''
            });
        } else if (type === 'status') {
            this.setState({
                status: value || ''
            });
        } else if (type === 'sgy') {
            this.setState({
                sgy: value || ''
            });
        } else if (type === 'cly') {
            this.setState({
                cly: value || ''
            });
        } else if (type === 'jl') {
            this.setState({
                jl: value || ''
            });
        } else if (type === 'yz') {
            this.setState({
                yz: value || ''
            });
        }
    }
    // 小班选择
    onSmallClassChange (value) {
        const {
            smallClassSelect
        } = this.props;
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
    // 细班选择
    onThinClassChange (value) {
        const {
            actions: {
                getTreetypeByThinclass
            },
            thinClassSelect
        } = this.props;
        const {
            section
        } = this.state;
        let array = value.split('-');
        let array1 = [];
        let treetypeoption = [];
        array.map((item, i) => {
            if (i !== 2) {
                array1.push(item);
            }
        });
        getTreetypeByThinclass({}, {
            section: section,
            thinclass: array1.join('-')
        }).then(rst => {
            if (rst && rst.content && rst.content instanceof Array) {
                rst.content.map(item => {
                    treetypeoption.push(<Option value={
                        item.TreeTypeObj.TreeTypeName
                    } > {
                            item.TreeTypeObj.TreeTypeName
                        } </Option>);
                });
            }
            this.setState({
                treetypeoption,
                treeTyepList: rst.content
            });
        });
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
    // 树种选择
    onTreeTypeChange (value) {
        this.setState({
            treetype: value,
            treetypename: value
        });
    }

    datepick (value) {
        this.setState({
            stime1: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime1: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    resetinput () {
        const {
            resetinput,
            leftkeycode
        } = this.props;
        resetinput(leftkeycode);
    }
    // 翻页
    handleTableChange (pagination) {
        const pager = {
            ...this.state.pagination
        };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 查询
    query = async (page) => {
        let {
            section = '',
            stime1 = '',
            etime1 = '',
            size,
            sgy = '',
            jl = '',
            yz = '',
            thinclass = '',
            smallclassData = '',
            status = '',
            ystype = '',
            treetypename = ''
        } = this.state;
        if (thinclass === '') {
            message.info('请选择项目，标段，小班及细班信息');
            return;
        }

        const {
            actions: {
                getWfreacceptanceList
            },
            platform: {
                tree = {}
            }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let array = thinclass.split('-');
        let array1 = [];
        array.map((item, i) => {
            if (i !== 2) {
                array1.push(item);
            }
        });
        let user = getUser();
        console.log('当前用户', user);
        // 施工文书可以查看本标段，非施工文书只能查看自己
        let applier = '', supervisor = '', owner = '';
        if (user.roles.ID === 10) {
            applier = '';
            supervisor = jl;
            owner = yz;
        } else if (user.roles.ID === 11) {
            applier = sgy;
            supervisor = user.ID;
            owner = yz;
        } else if (user.roles.ID === 9) {
            applier = sgy;
            supervisor = jl;
            owner = user.ID;
        }
        let postdata = {
            section,
            thinClass: array1.join('-'),
            checktype: ystype,
            supervisor: supervisor,
            treetype: treetypename,
            status: status,
            applier: applier, // 申请人
            owner: owner, // 业主
            stime: stime1 && moment(stime1).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime1 && moment(etime1).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };
        this.setState({
            loading: true,
            percent: 0
        });
        try {
            let rst = await getWfreacceptanceList({}, postdata);
            if (!(rst && rst.content)) {
                this.setState({
                    loading: false,
                    percent: 100
                });
                return;
            };
            let curingTreeData = rst && rst.content;
            if (curingTreeData instanceof Array) {
                let result = [];
                curingTreeData.map((curingTree, i) => {
                    curingTree.order = (page - 1) * size + i + 1;
                    curingTree.ystype = curingTree.CheckType;
                    curingTree.ystypeNum = curingTree.CheckTypeNum;
                    curingTree.status = getStatusByID(curingTree.Status);
                    curingTree.sectionName = getSectionNameBySection(curingTree.Section, thinClassTree);
                    curingTree.Project = getProjectNameBySection(curingTree.Section, thinClassTree);
                    curingTree.smallclass = `${smallclassData}号小班`;
                    let thinClass = curingTree.ThinClass.split(',')[0];
                    curingTree.thinclass = `${thinClass.substr(-7, 7)}等`;
                    curingTree.thinclassNum = curingTree.ThinClassNum;
                    result.push(curingTree);
                });
                let totalNum = rst.pageinfo.total;
                const pagination = {
                    ...this.state.pagination
                };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({
                    loading: false,
                    percent: 100,
                    curingTreeData: result,
                    pagination: pagination,
                    totalNum: totalNum
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 搜索栏
    treeTable (details) {
        const {
            sectionoption,
            smallclassoption,
            thinclassoption,
            zttypeoption,
            ystypeoption
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            ystype,
            status,
            treetypename,
            sgy,
            jl,
            yz,
            shigongOptions,
            jianliOptions,
            yezhuOptions,
            treetypeoption
        } = this.state;
        let header = '';
        const user = getUser();
        let queryArr = [];
        let applier = <div className='forest-mrg10' >
            <span className='forest-search-span' > 申请人： </span>
            <Select
                allowClear
                showSearch
                className='forest-forestcalcw4'
                defaultValue='全部'
                value={sgy}
                filterOption={
                    (input, option) => {
                        return option.props.children[0]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    }
                }
                onChange={this.ysTypeChange.bind(this, 'sgy')} >
                {shigongOptions}
            </Select>
        </div>;
        let owner = <div className='forest-mrg10' >
            <span className='forest-search-span' > 业主： </span>
            <Select
                allowClear
                showSearch
                className='forest-forestcalcw4'
                defaultValue=''
                value={yz}
                filterOption={
                    (input, option) => {
                        return option.props.children[0]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    }
                }
                onChange={this.ysTypeChange.bind(this, 'yz')} >
                {yezhuOptions}
            </Select>
        </div>;
        let supervisor = <div className='forest-mrg10' >
            <span className='forest-search-span' > 监理： </span>
            <Select
                allowClear
                showSearch
                className='forest-forestcalcw4'
                defaultValue='全部'
                value={jl}
                filterOption={
                    (input, option) => {
                        return option.props.children[0]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    }
                }
                onChange={this.ysTypeChange.bind(this, 'jl')} >
                {jianliOptions}
            </Select>
        </div>;
        if (user.roles.ID === 9) {
            // 业主身份
            queryArr.push(applier, supervisor);
        } else if (user.roles.ID === 11) {
            // 监理身份
            queryArr.push(applier, owner);
        } else if (user.roles.ID === 10) {
            // 施工身份
            queryArr.push(supervisor, owner);
        }
        console.log('用户身份', user, user.roles.ID);
        header = (<div >
            <Row className='forest-search-layout' >
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 标段： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={section}
                        onChange={
                            this.onSectionChange.bind(this)
                        } >
                        {sectionoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 小班： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={smallclass}
                        onChange={this.onSmallClassChange.bind(this)} >
                        {smallclassoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 细班： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={thinclass}
                        onChange={this.onThinClassChange.bind(this)} >
                        {thinclassoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 验收类型： </span>
                    <Select allowClear
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={ystype}
                        onChange={this.ysTypeChange.bind(this, 'yslx')} >
                        {ystypeoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 树种： </span>
                    <Select allowClear showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={treetypename}
                        onChange={this.onTreeTypeChange.bind(this)} >
                        {treetypeoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 状态： </span>
                    <Select allowClear className='forest-forestcalcw4'
                        defaultValue={0}
                        value={status}
                        onChange={this.ysTypeChange.bind(this, 'status')} >
                        {zttypeoption}
                    </Select>
                </div>
                {
                    queryArr
                }
            </Row>
            <Row className='forest-search-layout' >
                <div className='forest-mrg20' >
                    <span className='forest-search-span6' > 申请验收时间： </span>
                    <RangePicker style={{verticalAlign: 'middle'}}
                        className='forest-forestcalcw6'
                        showTime={{format: 'HH:mm:ss'}}
                        format={'YYYY/MM/DD HH:mm:ss'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    />
                </div>
            </Row>
            <Row style={{marginTop: 10, marginBottom: 10}} >
                <Col span={2} >
                    <Button type='primary'
                        onClick={this.handleTableChange.bind(this, {current: 1})} >
                        查询
                    </Button>
                </Col>
                <Col span={17} className='forest-quryrstcnt' >
                    <span > 此次查询共有数据： {this.state.totalNum}条 </span>
                </Col>
                <Col span={2}>
                    {
                        user.ID === 11 ? '' : <Button type='primary' onClick={this.onAgainCheck.bind(this)} >
                            重新验收
                        </Button>
                    }
                </Col>
                <Col span={1} />
                <Col span={2} >
                    <Button type='primary' onClick={this.resetinput.bind(this)} >
                        重置
                    </Button>
                </Col>
            </Row>
        </div>
        );
        return (<div >
            <Row>
                {header}
            </Row>
            <Row>
                <Table bordered className='foresttable'
                    columns={this.columns}
                    rowKey='order'
                    loading={
                        {
                            tip: (<Progress style={{width: 200}}
                                percent={this.state.percent}
                                status='active'
                                strokeWidth={5}
                            />
                            ),
                            spinning: this.state.loading
                        }
                    }
                    locale={{emptyText: '暂无验收消息'}}
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
            curingTreeData,
            againCheckModalVisible,
            detailsModalVisible,
            checkModalVisible
        } = this.state;
        return (
            <div>
                {
                    this.treeTable(curingTreeData)
                }
                {
                    againCheckModalVisible
                        ? <AgainCheckModal
                            handleOk={this.handleOkAgainCheck.bind(this)}
                            handleCancel={this.handleCancelAgainCheck.bind(this)}
                            {...this.props}
                            {...this.state}
                        /> : ''
                }
                {
                    detailsModalVisible
                        ? <DetailsModal
                            handleCancel={this.handleCancelDeatail.bind(this)}
                            {...this.props}
                            {...this.state}
                        /> : ''
                }
                {
                    checkModalVisible
                        ? <CheckModal
                            handleOk={this.handleOkCheck.bind(this)}
                            handleCancel={this.handleCancelCheck.bind(this)}
                            {...this.props}
                            {...this.state}
                        /> : ''
                }
            </div>
        );
    }
}

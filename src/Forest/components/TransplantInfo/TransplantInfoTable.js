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
import { FOREST_API } from '_platform/api';
import { getForestImgUrl, getUserIsManager } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class TransplantInfoTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            percent: 0,
            loading: false,
            size: 10,
            sxm: '',
            bigType: '',
            treetype: '',
            treetypename: '',
            messageTotalNum: '',
            treeTotalNum: '',
            imgArr: [],
            searchType: 'transplant',
            // 迁移前
            transplantProject: '',
            transplantSectionsData: [],
            transplantSection: '',
            transplantSmallClassData: [],
            transplantSmallClass: '',
            transplantThinClassData: [],
            transplantThinClass: '',
            transplantSTime: moment().format('YYYY-MM-DD 00:00:00'),
            transplantETime: moment().format('YYYY-MM-DD 23:59:59'),
            // 迁移后
            locationSectionsData: [],
            locationProject: '',
            locationSmallClassData: [],
            locationSection: '',
            locationThinClassData: [],
            locationSmallClass: '',
            locationThinClass: '',
            locationSTime: moment().format('YYYY-MM-DD 00:00:00'),
            locationETime: moment().format('YYYY-MM-DD 23:59:59')
        };

        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                render: (value, row, index) => {
                    const {
                        searchType
                    } = this.state;
                    if (searchType === 'both') {
                        const obj = {
                            children: value,
                            props: {}
                        };
                        if (index % 2 === 0) {
                            obj.props.rowSpan = 2;
                        }
                        if (index % 2 !== 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    } else {
                        return value;
                    }
                }
            },
            {
                title: '类型',
                dataIndex: 'dataType'
            },
            {
                key: '1',
                title: '顺序码',
                dataIndex: 'ZZBM',
                render: (value, row, index) => {
                    const {
                        searchType
                    } = this.state;
                    if (searchType === 'both') {
                        const obj = {
                            children: value,
                            props: {}
                        };
                        if (index % 2 === 0) {
                            obj.props.rowSpan = 2;
                        }
                        if (index % 2 !== 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    } else {
                        return value;
                    }
                }
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
                dataIndex: 'TreeTypeObj.TreeTypeName',
                render: (value, row, index) => {
                    const {
                        searchType
                    } = this.state;
                    if (searchType === 'both') {
                        const obj = {
                            children: value,
                            props: {}
                        };
                        if (index % 2 === 0) {
                            obj.props.rowSpan = 2;
                        }
                        if (index % 2 !== 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    } else {
                        return value;
                    }
                }
            },
            {
                title: '监理抽查状态',
                dataIndex: 'SupervisorCheck',
                render: (text, record) => {
                    let statusname = '/';
                    if (record.SupervisorCheck === -1) {
                        statusname = '监理未抽查';
                    } else if (record.SupervisorCheck === 0) {
                        statusname = '监理未通过';
                    } else if (record.SupervisorCheck === 1) {
                        statusname = '监理抽查合格';
                    } else if (record.SupervisorCheck === 2) {
                        statusname = '监理退回后整改';
                    } else if (record.SupervisorCheck === 3) {
                        statusname = '苗木质量合格';
                    }
                    return <span>{statusname}</span>;
                }
            },
            // {
            //     title: '监理人',
            //     dataIndex: 'SupervisorName',
            //     render: (text, record) => {
            //         if (record.SupervisorUserName && record.SupervisorName) {
            //             return <p>{record.SupervisorName + '(' + record.SupervisorUserName + ')'}</p>;
            //         } else if (record.SupervisorName && !record.SupervisorUserName) {
            //             return <p>{record.SupervisorName}</p>;
            //         } else {
            //             return <p> / </p>;
            //         }
            //     }
            // },
            {
                title: '业主抽查状态',
                dataIndex: 'CheckStatus',
                render: (text, record) => {
                    let statusname = '/';
                    if (record.CheckStatus === -1) {
                        statusname = '业主未抽查';
                    } else if (record.CheckStatus === 0) {
                        statusname = '业主未通过';
                    } else if (record.CheckStatus === 1) {
                        statusname = '业主抽查合格';
                    } else if (record.CheckStatus === 2) {
                        statusname = '业主退回后整改';
                    }
                    return <span>{statusname}</span>;
                }
            },
            {
                title: '定位',
                dataIndex: 'islocation'
            },
            {
                title: '测量人',
                dataIndex: 'InputerName',
                render: (text, record) => {
                    if (record.InputerUserName && record.InputerName) {
                        return <p>{record.InputerName + '(' + record.InputerUserName + ')'}</p>;
                    } else if (record.InputerName && !record.InputerUserName) {
                        return <p>{record.InputerName}</p>;
                    } else {
                        return <p> / </p>;
                    }
                }
            },
            {
                title: '测量时间',
                render: (text, record) => {
                    const { createtime1 = '', createtime2 = '' } = record;
                    return (
                        <div>
                            <div>{createtime1}</div>
                            <div>{createtime2}</div>
                        </div>
                    );
                }
            },
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
                                disabled={!record.TQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQHDFJ
                                )}
                            >
                                {record.TQZJ}
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
                        <div>条长</div>
                        <div>(cm)</div>
                    </div>
                ),
                dataIndex: 'TC',
                render: (text, record) => {
                    if (record.TC) {
                        return (
                            <a
                                disabled={!record.TCFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TCFJ
                                )}
                            >
                                {record.TC}
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
                        <div>分枝数量</div>
                        <div>(个)</div>
                    </div>
                ),
                dataIndex: 'FZS',
                render: (text, record) => {
                    if (record.FZS) {
                        return (
                            <a
                                disabled={!record.FZSFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.FZSFJ
                                )}
                            >
                                {record.FZS}
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
                        <div>分支点</div>
                        <div>(个)</div>
                    </div>
                ),
                dataIndex: 'FZSGD',
                render: (text, record) => {
                    if (record.FZSGD) {
                        return (
                            <a
                                disabled={!record.FZSGDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.FZSGDFJ
                                )}
                            >
                                {record.FZSGD}
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
                        <div>地径超过0.5厘米分支数量</div>
                        <div>(个)</div>
                    </div>
                ),
                dataIndex: 'SMALLFZS',
                render: (text, record) => {
                    if (record.SMALLFZS) {
                        return (
                            <a
                                disabled={!record.SMALLFZSFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.SMALLFZSFJ
                                )}
                            >
                                {record.SMALLFZS}
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
                        <div>地径超过1cm分枝数量</div>
                        <div>(个)</div>
                    </div>
                ),
                dataIndex: 'DBFZS',
                render: (text, record) => {
                    if (record.DBFZS) {
                        return (
                            <a
                                disabled={!record.DBFZSFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.DBFZSFJ
                                )}
                            >
                                {record.DBFZS}
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
                        <div>地径超过3厘米分支数量</div>
                        <div>(个)</div>
                    </div>
                ),
                dataIndex: 'BIGFZS',
                render: (text, record) => {
                    if (record.BIGFZS) {
                        return (
                            <a
                                disabled={!record.BIGFZSFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.BIGFZSFJ
                                )}
                            >
                                {record.BIGFZS}
                            </a>
                        );
                    } else {
                        return <span>/</span>;
                    }
                }
            }
        ];
    }
    componentDidMount () {
    }
    // 顺序码
    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }
    // 类型选中
    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({
            bigType: value || '',
            treetype: '',
            treetypename: ''
        });
    }
    // 树种选中
    onTreeTypeChange (value) {
        this.setState({
            treetype: value,
            treetypename: value
        });
    }
    // 迁移前项目选中
    onTransplantProjectChange = (value) => {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        let treeList = tree.thinClassTree;
        let transplantSectionsData = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    transplantSectionsData = treeData.children;
                }
            });
        }
        this.setState({
            transplantSectionsData,
            transplantProject: value,
            transplantSmallClassData: [],
            transplantSection: '',
            transplantThinClassData: [],
            transplantSmallClass: '',
            transplantThinClass: ''
        });
    }
    // 迁移前标段选中
    onTransplantSectionChange = (value) => {
        const {
            transplantSectionsData
        } = this.state;
        let transplantSmallClassData = [];
        if (value) {
            transplantSectionsData.map((section) => {
                if (value === section.No) {
                    transplantSmallClassData = section.children;
                }
            });
        }
        this.setState({
            transplantSmallClassData,
            transplantSection: value,
            transplantThinClassData: [],
            transplantSmallClass: '',
            transplantThinClass: ''
        });
    }
    // 迁移前小班选中
    onTransplantSmallClassChange = (value) => {
        const {
            transplantSmallClassData
        } = this.state;
        let transplantThinClassData = [];
        if (value) {
            transplantSmallClassData.map((section) => {
                if (value === section.No) {
                    transplantThinClassData = section.children;
                }
            });
        }
        this.setState({
            transplantThinClassData,
            transplantSmallClass: value,
            transplantThinClass: ''
        });
    }
    // 迁移前细班选中
    onTransplantThinClassChange = (value) => {
        this.setState({
            transplantThinClass: value
        });
    }
    // 移栽前测量时间
    transplantDatepick (value) {
        this.setState({
            transplantSTime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            transplantETime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    /**
     * 迁移后
     */
    // 迁移后项目选中
    onLocationProjectChange = (value) => {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        let treeList = tree.thinClassTree;
        let locationSectionsData = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    locationSectionsData = treeData.children;
                }
            });
        }
        this.setState({
            locationSectionsData,
            locationProject: value,
            locationSmallClassData: [],
            locationSection: '',
            locationThinClassData: [],
            locationSmallClass: '',
            locationThinClass: ''
        });
    }
    // 迁移后标段选中
    onLocationSectionChange = (value) => {
        const {
            locationSectionsData
        } = this.state;
        let locationSmallClassData = [];
        if (value) {
            locationSectionsData.map((section) => {
                if (value === section.No) {
                    locationSmallClassData = section.children;
                }
            });
        }
        this.setState({
            locationSmallClassData,
            locationSection: value,
            locationThinClassData: [],
            locationSmallClass: '',
            locationThinClass: ''
        });
    }
    // 迁移后小班选中
    onLocationSmallClassChange = (value) => {
        const {
            locationSmallClassData
        } = this.state;
        let locationThinClassData = [];
        if (value) {
            locationSmallClassData.map((section) => {
                if (value === section.No) {
                    locationThinClassData = section.children;
                }
            });
        }
        this.setState({
            locationThinClassData,
            locationSmallClass: value,
            locationThinClass: ''
        });
    }
    // 迁移后细班选中
    onLocationThinClassChange = (value) => {
        this.setState({
            locationThinClass: value
        });
    }
    // 移栽时间
    locationDatepick (value) {
        this.setState({
            locationSTime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            locationETime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    // 数据展示方式
    onSearchTypeChange = (value) => {
        const {
            tblData,
            pagination
        } = this.state;
        this.setState({
            searchType: value
        }, () => {
            if (tblData && tblData instanceof Array && tblData.length > 0) {
                const pager = { ...this.state.pagination };
                pager.current = pagination.current;
                this.setState({
                    pagination: pager
                });
                this.query(1);
            }
        });
    }
    // 图片查看
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
    // 关闭图片查看Modal
    handleCancel () {
        this.setState({ imgvisible: false });
    }
    resetinput () {
        const { resetinput } = this.props;
        resetinput();
    }
    // 根据接口处理小班编号
    handleSmallClassNo = (smallClass) => {
        try {
            let smallClassNo = '';
            let smallClassArr = smallClass.split('-');
            if (smallClassArr && smallClassArr instanceof Array && smallClassArr.length === 4) {
                smallClassNo = smallClassArr[3];
            }
            return smallClassNo;
        } catch (e) {
            console.log('handleSmallClassNo', e);
        }
    }
    // 根据接口处理细班编号
    handleThinClassNo = (thinClass) => {
        try {
            let no = '';
            let thinClassArr = thinClass.split('-');
            if (thinClassArr && thinClassArr instanceof Array && thinClassArr.length === 5) {
                no = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            }
            return no;
        } catch (e) {
            console.log('handleSmallClassNo', e);
        }
    }
    // 表格翻页
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    query = async (page) => {
        const {
            sxm = '',
            transplantProject = '',
            transplantSection = '',
            transplantSmallClass = '',
            transplantThinClass = '',
            locationProject = '',
            locationSection = '',
            locationSmallClass = '',
            locationThinClass = ''
        } = this.state;
        if (transplantThinClass === '' && locationThinClass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
        } else if (sxm) {
            if ((transplantThinClass === '' && (transplantProject || transplantSection || transplantSmallClass)) ||
                (locationThinClass === '' && (locationProject || locationSection || locationSmallClass))
            ) {
                message.info('请选择施工包范围至细班');
            }
            // 如果sxm存在，则用迁移前后细班同时搜索的接口，对数据进行处理
            this.queryBoth(page);
        } else {
            if ((transplantThinClass === '' && (transplantProject || transplantSection || transplantSmallClass)) ||
                (locationThinClass === '' && (locationProject || locationSection || locationSmallClass))
            ) {
                message.info('请选择施工包范围至细班');
            }
            if (transplantThinClass && locationThinClass === '') {
                // 只搜索迁移前的细班
                this.queryTransplant(page);
            } else if (transplantThinClass === '' && locationThinClass) {
                // 只搜索迁移后的细班
                this.queryLocation(page);
            } else if (transplantThinClass && locationThinClass) {
                // 迁移前后的细班同时搜索
                this.queryBoth(page);
            }
        }
    }
    queryTransplant = async (page) => {
        const {
            size = 10,
            sxm = '',
            treetype = '',
            transplantSection = '',
            transplantThinClass = '',
            transplantSTime = '',
            transplantETime = '',
            searchType
        } = this.state;
        if (transplantThinClass === '') {
            message.info('请选择移栽前项目，标段，小班及细班信息');
            return;
        }
        const {
            actions: {
                getTreeMess,
                getTransplantTransMess
            }
        } = this.props;
        let postData = {
            no: this.handleThinClassNo(transplantThinClass),
            sxm,
            treetype,
            section: transplantSection,
            stime: transplantSTime && moment(transplantSTime).format('YYYY-MM-DD HH:mm:ss'),
            etime: transplantETime && moment(transplantETime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };

        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getTransplantTransMess({}, postData);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let content = rst.content;
        let tblData = [];
        if (content instanceof Array) {
            let userIDList = [];
            let userDataList = {};
            let supervisorUserIDList = [];
            let supervisorUserDataList = {};
            for (let i = 0; i < content.length; i++) {
                let plan = content[i];
                plan.order = (page - 1) * size + i + 1;
                plan = await this.handleTransplantDataToTable(plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                if (searchType === 'transplant') {
                    tblData.push(plan);
                } else if (searchType === 'both') {
                    tblData.push(plan);
                    let locationData = await getTreeMess({sxm: plan.ZZBM});
                    if (locationData && locationData.ZZBM) {
                        let locationPlan = await this.handleLocationDataToTable(locationData, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        tblData.push(locationPlan);
                    }
                } else if (searchType === 'location') {
                    let locationData = await getTreeMess({sxm: plan.ZZBM});
                    if (locationData && locationData.ZZBM) {
                        let locationPlan = await this.handleLocationDataToTable(locationData, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        locationPlan.order = (page - 1) * size + i + 1;
                        tblData.push(locationPlan);
                    }
                }
            }

            let messageTotalNum = rst.pageinfo.total;
            let treeTotalNum = rst.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total * 2;
            pagination.pageSize = 20;
            console.log('pagination', pagination);

            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                treeTotalNum,
                loading: false,
                percent: 100
            });
        }
    }
    handleTransplantDataToTable = async (plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList) => {
        const {
            actions: {
                getUserDetail
            },
            platform: { tree = {} }
        } = this.props;
        try {
            let thinClassTree = tree.thinClassTree;
            let no = plan.No;
            let noArr = no.split('-');
            let smallClass = '';
            let thinClass = '';
            if (noArr && noArr instanceof Array && noArr.length >= 4) {
                smallClass = noArr[2];
                thinClass = noArr[3];
            }
            plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
            plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
            plan.place = getSmallThinNameByPlaceData(plan.Section, smallClass, thinClass, thinClassTree);
            plan.dataType = '移栽前信息';
            plan.SupervisorCheck = plan.SupervisorCheck;
            plan.CheckStatus = plan.CheckStatus;
            let islocation = plan.LocationTime ? '已定位' : '未定位';
            plan.islocation = islocation;
            let createtime1 = plan.CreateTime
                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                : '/';
            let createtime2 = plan.CreateTime
                ? moment(plan.CreateTime).format('HH:mm:ss')
                : '/';
            let createtime3 = plan.LocationTime
                ? moment(plan.LocationTime).format('YYYY-MM-DD')
                : '/';
            let createtime4 = plan.LocationTime
                ? moment(plan.LocationTime).format('HH:mm:ss')
                : '/';
            plan.createtime1 = createtime1;
            plan.createtime2 = createtime2;
            plan.createtime3 = createtime3;
            plan.createtime4 = createtime4;
            // 因接口返回数据中不存在监理ID，故注释
            // let supervisorUserData = '';
            // if (supervisorUserIDList.indexOf(Number(plan.Supervisor)) === -1) {
            //     supervisorUserData = await getUserDetail({id: plan.Supervisor});
            // } else {
            //     supervisorUserData = supervisorUserDataList[Number(plan.Supervisor)];
            // }
            // if (supervisorUserData && supervisorUserData.ID) {
            //     supervisorUserIDList.push(supervisorUserData.ID);
            //     supervisorUserDataList[supervisorUserData.ID] = supervisorUserData;
            // }
            // plan.SupervisorName = (supervisorUserData && supervisorUserData.Full_Name) || '';
            // plan.SupervisorUserName = (supervisorUserData && supervisorUserData.User_Name) || '';
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
            return plan;
        } catch (e) {
            console.log('handleTransplantDataToTable', e);
        }
    }
    queryLocation = async (page) => {
        const {
            size = 10,
            sxm = '',
            treetype = '',
            locationSection = '',
            locationThinClass = '',
            locationSTime = '',
            locationETime = '',
            searchType
        } = this.state;
        if (locationThinClass === '') {
            message.info('请选择移栽后项目，标段，小班及细班信息');
            return;
        }
        const {
            actions: {
                getTreesInfo,
                getTransplantTransMess
            }
        } = this.props;
        let postData = {
            istransplant: 1,
            no: this.handleThinClassNo(locationThinClass),
            sxm,
            treetype,
            section: locationSection,
            stime: locationSTime && moment(locationSTime).format('YYYY-MM-DD HH:mm:ss'),
            etime: locationETime && moment(locationETime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };

        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getTreesInfo({}, postData);
        console.log('rst', rst);

        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let content = rst.content;
        let tblData = [];
        if (content instanceof Array) {
            let userIDList = [];
            let userDataList = {};
            let supervisorUserIDList = [];
            let supervisorUserDataList = {};
            for (let i = 0; i < content.length; i++) {
                let plan = content[i];
                plan.order = (page - 1) * size + i + 1;
                plan = await this.handleLocationDataToTable(plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                if (searchType === 'location') {
                    tblData.push(plan);
                } else if (searchType === 'both') {
                    tblData.push(plan);
                    let transplantData = await getTransplantTransMess({}, {sxm: plan.ZZBM});
                    if (transplantData && transplantData.content && transplantData.content.length > 0) {
                        let transplantPlan = await this.handleTransplantDataToTable(transplantData.content[0], userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        tblData.push(transplantPlan);
                    }
                } else if (searchType === 'transplant') {
                    let transplantData = await getTransplantTransMess({}, {sxm: plan.ZZBM});
                    if (transplantData && transplantData.content && transplantData.content.length > 0) {
                        let transplantPlan = await this.handleTransplantDataToTable(transplantData.content[0], userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        transplantPlan.order = (page - 1) * size + i + 1;
                        tblData.push(transplantPlan);
                    }
                }
            }

            let messageTotalNum = rst.pageinfo.total;
            let treeTotalNum = rst.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total * 2;
            pagination.pageSize = 20;

            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                treeTotalNum,
                loading: false,
                percent: 100
            });
        }
    }
    handleLocationDataToTable = async (plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList) => {
        const {
            actions: {
                getUserDetail
            },
            platform: { tree = {} }
        } = this.props;
        try {
            let thinClassTree = tree.thinClassTree;
            plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
            plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
            plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
            plan.dataType = '移栽后信息';
            plan.SupervisorCheck = plan.SupervisorCheck;
            plan.CheckStatus = plan.CheckStatus;
            let islocation = plan.LocationTime ? '已定位' : '未定位';
            plan.islocation = islocation;
            let createtime1 = plan.CreateTime
                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                : '/';
            let createtime2 = plan.CreateTime
                ? moment(plan.CreateTime).format('HH:mm:ss')
                : '/';
            let createtime3 = plan.LocationTime
                ? moment(plan.LocationTime).format('YYYY-MM-DD')
                : '/';
            let createtime4 = plan.LocationTime
                ? moment(plan.LocationTime).format('HH:mm:ss')
                : '/';
            plan.createtime1 = createtime1;
            plan.createtime2 = createtime2;
            plan.createtime3 = createtime3;
            plan.createtime4 = createtime4;
            // 因接口返回数据中不存在监理ID，故注释
            // let supervisorUserData = '';
            // if (supervisorUserIDList.indexOf(Number(plan.Supervisor)) === -1) {
            //     supervisorUserData = await getUserDetail({id: plan.Supervisor});
            // } else {
            //     supervisorUserData = supervisorUserDataList[Number(plan.Supervisor)];
            // }
            // if (supervisorUserData && supervisorUserData.ID) {
            //     supervisorUserIDList.push(supervisorUserData.ID);
            //     supervisorUserDataList[supervisorUserData.ID] = supervisorUserData;
            // }
            // plan.SupervisorName = (supervisorUserData && supervisorUserData.Full_Name) || '';
            // plan.SupervisorUserName = (supervisorUserData && supervisorUserData.User_Name) || '';
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
            return plan;
        } catch (e) {
            console.log('handleLocationDataToTable', e);
        }
    }
    queryBoth = async (page) => {
        const {
            size = 10,
            sxm = '',
            treetype = '',
            transplantSection = '',
            transplantThinClass = '',
            transplantSTime = '',
            transplantETime = '',
            locationSection = '',
            locationThinClass = '',
            locationSTime = '',
            locationETime = '',
            searchType
        } = this.state;
        const {
            actions: {
                getTreeMess,
                getTransplantTransMess
            }
        } = this.props;
        if (transplantThinClass === '' && locationThinClass === '' && sxm === '') {
            message.info('请选择移栽前后项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        console.log('transplantSection', transplantSection);
        let postData = {
            no: this.handleThinClassNo(transplantThinClass),
            sxm,
            treetype,
            section: transplantSection,
            stime: transplantSTime && moment(transplantSTime).format('YYYY-MM-DD HH:mm:ss'),
            etime: transplantETime && moment(transplantETime).format('YYYY-MM-DD HH:mm:ss'),
            newno: this.handleThinClassNo(locationThinClass),
            newsection: locationSection,
            tstime: locationSTime && moment(locationSTime).format('YYYY-MM-DD HH:mm:ss'),
            tetime: locationETime && moment(locationETime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getTransplantTransMess({}, postData);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let content = rst.content;
        let tblData = [];
        if (content instanceof Array) {
            let userIDList = [];
            let userDataList = {};
            let supervisorUserIDList = [];
            let supervisorUserDataList = {};
            for (let i = 0; i < content.length; i++) {
                let plan = content[i];
                if (searchType === 'location') {
                    let locationData = await getTreeMess({sxm: plan.ZZBM});
                    if (locationData && locationData.ZZBM) {
                        let transplantPlan = await this.handleLocationDataToTable(locationData, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        transplantPlan.order = (page - 1) * size + i + 1;
                        tblData.push(transplantPlan);
                    }
                } else if (searchType === 'transplant') {
                    plan.order = (page - 1) * size + i + 1;
                    plan = await this.handleTransplantDataToTable(plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                    tblData.push(plan);
                } else if (searchType === 'both') {
                    plan.order = (page - 1) * size + i + 1;
                    plan = await this.handleTransplantDataToTable(plan, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                    tblData.push(plan);
                    let locationData = await getTreeMess({sxm: plan.ZZBM});
                    if (locationData && locationData.ZZBM) {
                        let transplantPlan = await this.handleLocationDataToTable(locationData, userIDList, userDataList, supervisorUserIDList, supervisorUserDataList);
                        tblData.push(transplantPlan);
                    }
                }
            }

            let messageTotalNum = rst.pageinfo.total;
            let treeTotalNum = rst.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total * 2;
            pagination.pageSize = 20;

            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                treeTotalNum,
                loading: false,
                percent: 100
            });
        }
    }

    treeTable (details) {
        const {
            treetypeoption,
            typeoption,
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            sxm,
            bigType,
            treetypename,
            searchType,
            // 迁移前
            transplantProject,
            transplantSectionsData,
            transplantSection,
            transplantSmallClassData,
            transplantSmallClass,
            transplantThinClassData,
            transplantThinClass,
            transplantSTime,
            transplantETime,
            // 迁移后
            locationSectionsData,
            locationProject,
            locationSmallClassData,
            locationSection,
            locationThinClassData,
            locationSmallClass,
            locationThinClass,
            locationSTime,
            locationETime,
            pagination
        } = this.state;
        let header = '';
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input
                            value={sxm}
                            className='forest-forestcalcw4'
                            onChange={this.sxmChange.bind(this)}
                        />
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
                        <span className='forest-search-span6'>数据展示方式：</span>
                        <Select
                            allowClear
                            showSearch
                            className='forest-forestcalcw6'
                            defaultValue='移栽前信息'
                            value={searchType}
                            onChange={this.onSearchTypeChange.bind(this)}
                        >
                            <Option key={'移栽前信息'} value={'transplant'} title={'移栽前信息'}>
                                {'移栽前信息'}
                            </Option>
                            <Option key={'移栽后信息'} value={'location'} title={'移栽后信息'}>
                                {'移栽后信息'}
                            </Option>
                            <Option key={'同时展示'} value={'both'} title={'同时展示'}>
                                {'同时展示'}
                            </Option>
                        </Select>
                    </div>
                </Row>
                <Row className='forest-search-layout'>
                    <span className='forest-search-transplant-span7'>
                        移栽前条件筛选：
                    </span>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>项目：</span>
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
                            value={transplantProject}
                            onChange={this.onTransplantProjectChange.bind(this)}
                        >
                            {
                                treeList.map((project) => {
                                    return <Option key={project.No} value={project.No} title={project.Name}>
                                        {project.Name}
                                    </Option>;
                                })
                            }
                        </Select>
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
                            value={transplantSection}
                            onChange={this.onTransplantSectionChange.bind(this)}
                        >
                            {
                                transplantSectionsData.map((section) => {
                                    return <Option key={section.No} value={section.No} title={section.Name}>
                                        {section.Name}
                                    </Option>;
                                })
                            }
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
                            value={transplantSmallClass}
                            onChange={this.onTransplantSmallClassChange.bind(this)}
                        >
                            {
                                transplantSmallClassData.map((smallClass) => {
                                    return <Option key={smallClass.No} value={smallClass.No} title={smallClass.Name}>
                                        {smallClass.Name}
                                    </Option>;
                                })
                            }
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
                            value={transplantThinClass}
                            onChange={this.onTransplantThinClassChange.bind(this)}
                        >
                            {
                                transplantThinClassData.map((thinClass) => {
                                    return <Option key={thinClass.No} value={thinClass.No} title={thinClass.Name}>
                                        {thinClass.Name}
                                    </Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-transplant-span7'>移栽前测量时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(transplantSTime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(transplantETime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw7'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.transplantDatepick.bind(this)}
                            onOk={this.transplantDatepick.bind(this)}
                        />
                    </div>
                </Row>
                <Row className='forest-search-layout'>
                    <span className='forest-search-transplant-span7'>
                        移栽后条件筛选：
                    </span>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>项目：</span>
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
                            value={locationProject}
                            onChange={this.onLocationProjectChange.bind(this)}
                        >
                            {
                                treeList.map((project) => {
                                    return <Option key={project.No} value={project.No} title={project.Name}>
                                        {project.Name}
                                    </Option>;
                                })
                            }
                        </Select>
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
                            value={locationSection}
                            onChange={this.onLocationSectionChange.bind(this)}
                        >
                            {
                                locationSectionsData.map((section) => {
                                    return <Option key={section.No} value={section.No} title={section.Name}>
                                        {section.Name}
                                    </Option>;
                                })
                            }
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
                            value={locationSmallClass}
                            onChange={this.onLocationSmallClassChange.bind(this)}
                        >
                            {
                                locationSmallClassData.map((smallClass) => {
                                    return <Option key={smallClass.No} value={smallClass.No} title={smallClass.Name}>
                                        {smallClass.Name}
                                    </Option>;
                                })
                            }
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
                            value={locationThinClass}
                            onChange={this.onLocationThinClassChange.bind(this)}
                        >
                            {
                                locationThinClassData.map((thinClass) => {
                                    return <Option key={thinClass.No} value={thinClass.No} title={thinClass.Name}>
                                        {thinClass.Name}
                                    </Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-transplant-span7'>移栽后测量时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(locationSTime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(locationETime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw7'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.locationDatepick.bind(this)}
                            onOk={this.locationDatepick.bind(this)}
                        />
                    </div>

                </Row>
                <Row style={{marginTop: 10, marginBottom: 10}}>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.handleTableChange.bind(this, {
                                current: 1
                            })}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20} className='forest-quryrstcnt'>
                        {
                            details.length > 0
                                ? <span>
                                    {`此次查询共有数据：${this.state.messageTotalNum}条，  共有苗木：${this.state.treeTotalNum}棵`}
                                </span>
                                : ''
                        }

                    </Col>
                    <Col span={2} >
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
        console.log('pagination', pagination);

        return (
            <div>
                <Row>{header}</Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        // rowKey='ZZBM'
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
                        locale={{ emptyText: '无移植信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={pagination}
                    />
                </Row>
            </div>
        );
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
}

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
const { Option } = Select;

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
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            smallclass: '',
            thinclass: '',
            status: '',
            percent: 0,
            messageTotalNum: '',
            treeTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: '',
            userOptions: [],
            currentColumn: ''
        };
        this.section = '';
    }
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
            title: '监理抽查状态',
            dataIndex: 'SupervisorCheck',
            render: (text, record) => {
                let statusname = '/';
                if (record.SupervisorCheck === -1) {
                    statusname = '监理未抽查';
                } else if (record.SupervisorCheck === 0) {
                    statusname = '大数据不合格';
                } else if (record.SupervisorCheck === 1) {
                    statusname = '监理抽查合格';
                } else if (record.SupervisorCheck === 2) {
                    statusname = '大数据不合格整改后待审核';
                } else if (record.SupervisorCheck === 3) {
                    statusname = '监理抽查合格';
                } else if (record.SupervisorCheck === 4) {
                    statusname = '质量不合格';
                }
                return <span>{statusname}</span>;
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
            title: '业主抽查状态',
            dataIndex: 'CheckStatus',
            render: (text, record) => {
                let statusname = '/';
                if (record.CheckStatus === -1) {
                    statusname = '业主未抽查';
                } else if (record.CheckStatus === 0) {
                    statusname = '业主抽查不合格';
                } else if (record.CheckStatus === 1) {
                    statusname = '业主抽查合格';
                } else if (record.CheckStatus === 2) {
                    statusname = '业主退回后整改';
                }
                return <span>{statusname}</span>;
            }
        },
        {
            title: '抽查时间',
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
    qualityColumns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '顺序码',
            dataIndex: 'SXM'
        },
        {
            title: '补种后二维码',
            dataIndex: 'NSXM'
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
            title: '监理抽查状态',
            dataIndex: 'Status',
            render: (text, record) => {
                let statusname = '/';
                if (record.Status === 0) {
                    statusname = '质量不合格';
                } else if (record.Status === 1) {
                    statusname = '整改后合格';
                } else if (record.Status === 2) {
                    statusname = '质量不合格整改后待审核';
                }
                return <span>{statusname}</span>;
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
    componentDidMount () {
        let user = getUser();
        this.section = user.section;
    }
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
        this.setState({
            bigType: value || '',
            treetype: '',
            treetypename: ''
        });
    }

    onTreeTypeChange (value) {
        this.setState({
            treetype: value,
            treetypename: value
        });
    }

    onStatusChange (value) {
        this.setState({
            status: value || ''
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

    query = async (page) => {
        const {
            sxm = '',
            thinclass = '',
            status = ''
        } = this.state;

        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        /**
         * 全部
            未抽查          samplingstatus  -1  未抽查
            监理抽查合格    samplingstatus  1  抽查合格
            大数据不合格    status:0  大数据不合格
            质量不合格      tree/qualitytrees
                            inputer
                            status   0,2
                            section
            业主抽查合格    checkstatus   0  业主不合格
            业主抽查不合格  checkstatus  1业主合格
         */

        /**
          * 响应返回：
          * SupervisorCheck：监理确认，
          * 0  大数据不合格，退回
            1  通过 （新的接口中已不使用，但是需要对老数据进行兼容）
            2  大数据不合格，修改小班细班并整改，待审核
            3  APP点合格  大数据合格  质量合格
            4  苗木质量不合格
          * CheckStatus: 业主抽查状态：-1:未确认 0：业主通过  1：业主不通过
          */
        switch (status) {
            case '':
                this.queryTreesInfoData(page, '', '');
                break;
            case '未抽查':
                this.queryTreesInfoData(page, -1, '');
                break;
            case '监理抽查合格':
                this.queryTreesInfoData(page, 1);
                break;
            case '大数据不合格':
                this.queryTreesInfoData(page, '', 0);
                break;
            case '大数据不合格整改后待审核':
                this.queryTreesInfoData(page, '', 2);
                break;
            case '质量不合格':
                this.queryQualityInfoData(page);
                break;
            case '业主抽查合格':
                this.queryTreesInfoData(page, '', '', 1);
                break;
            case '业主抽查不合格':
                this.queryTreesInfoData(page, '', '', 0);
                break;
        }
    }

    queryTreesInfoData = async (page = 1, samplingstatus = '', status = '', checkstatus = '') => {
        const {
            sxm = '',
            section = '',
            smallclass = '',
            thinclass = '',
            stime = '',
            etime = '',
            size,
            treetype = ''
        } = this.state;
        const {
            actions: {
                getUserDetail,
                getTreesInfo
            },
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let no = '';
        if (thinclass) {
            let thinClassArr = thinclass.split('-');
            if (thinClassArr && thinClassArr instanceof Array && thinClassArr.length === 5) {
                no = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            }
        } else if (smallclass) {
            let smallclassArr = smallclass.split('-');
            if (smallclassArr && smallclassArr instanceof Array && smallclassArr.length === 4) {
                no = smallclassArr[0] + '-' + smallclassArr[1] + '-' + smallclassArr[3];
            }
        } else if (leftkeycode) {
            no = leftkeycode;
        }
        let postdata = {
            no: no,
            sxm,
            section,
            status,
            samplingstatus,
            checkstatus,
            treetype,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getTreesInfo({}, postdata);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.content;
        if (tblData instanceof Array) {
            let userIDList = [];
            let userDataList = {};
            for (let i = 0; i < tblData.length; i++) {
                let plan = tblData[i];
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
                let userData = '';
                if (userIDList.indexOf(Number(plan.Supervisor)) === -1) {
                    userData = await getUserDetail({id: plan.Supervisor});
                } else {
                    userData = userDataList[Number(plan.Supervisor)];
                }
                if (userData && userData.ID) {
                    userIDList.push(userData.ID);
                    userDataList[userData.ID] = userData;
                }
                plan.SupervisorName = (userData && userData.Full_Name) || '';
                plan.SupervisorUserName = (userData && userData.User_Name) || '';
            }
            let treeTotalNum = rst.total;
            let messageTotalNum = rst.pageinfo.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;
            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                treeTotalNum,
                loading: false,
                percent: 100,
                currentColumn: this.columns
            });
        }
    }

    queryQualityInfoData = async (page) => {
        const {
            section = '',
            smallclass = '',
            thinclass = '',
            stime = '',
            etime = '',
            size,
            treetype = ''
        } = this.state;
        const {
            actions: {
                getUserDetail,
                getMQulityCheckList
            },
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let no = '';
        if (thinclass) {
            let thinClassArr = thinclass.split('-');
            if (thinClassArr && thinClassArr instanceof Array && thinClassArr.length === 5) {
                no = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            }
        } else if (smallclass) {
            let smallclassArr = smallclass.split('-');
            if (smallclassArr && smallclassArr instanceof Array && smallclassArr.length === 4) {
                no = smallclassArr[0] + '-' + smallclassArr[1] + '-' + smallclassArr[3];
            }
        } else if (leftkeycode) {
            no = leftkeycode;
        }
        let postdata = {
            thinClass: no,
            section,
            status: '0,2',
            treetype,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getMQulityCheckList({}, postdata);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.content;
        if (tblData instanceof Array) {
            let userIDList = [];
            let userDataList = {};
            for (let i = 0; i < tblData.length; i++) {
                let plan = tblData[i];
                plan.order = (page - 1) * size + i + 1;
                plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                let thinClassArr = plan.ThinClass.split('-');

                if (thinClassArr && thinClassArr instanceof Array && thinClassArr.length === 4) {
                    plan.place = getSmallThinNameByPlaceData(plan.Section, thinClassArr[2], thinClassArr[3], thinClassTree);
                }
                let statusname = '';

                plan.SupervisorCheck = plan.SupervisorCheck;
                plan.CheckStatus = plan.CheckStatus;
                plan.statusname = statusname;

                plan.statusname = statusname;
                let yssj1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                let yssj2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                plan.yssj1 = yssj1;
                plan.yssj2 = yssj2;
                let userData = '';
                if (userIDList.indexOf(Number(plan.Supervisor)) === -1) {
                    userData = await getUserDetail({id: plan.Supervisor});
                } else {
                    userData = userDataList[Number(plan.Supervisor)];
                }
                if (userData && userData.ID) {
                    userIDList.push(userData.ID);
                    userDataList[userData.ID] = userData;
                }
                plan.SupervisorName = (userData && userData.Full_Name) || '';
                plan.SupervisorUserName = (userData && userData.User_Name) || '';
            }
            let treeTotalNum = rst.total;
            let messageTotalNum = rst.pageinfo.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;
            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                treeTotalNum,
                loading: false,
                percent: 100,
                currentColumn: this.qualityColumns
            });
        }
    }

    exportexcel () {
        const {
            sxm = '',
            thinclass = '',
            status = ''
        } = this.state;

        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        switch (status) {
            case '':
                this.handleExportTreesInfoData('', '');
                break;
            case '未抽查':
                this.handleExportTreesInfoData(-1, '');
                break;
            case '监理抽查合格':
                this.handleExportTreesInfoData(1);
                break;
            case '大数据不合格':
                this.handleExportTreesInfoData('', 0);
                break;
            case '大数据不合格整改后待审核':
                this.handleExportTreesInfoData('', 2);
                break;
            case '质量不合格':
                this.handleExportQualityInfoData();
                break;
            case '业主抽查合格':
                this.handleExportTreesInfoData('', '', 1);
                break;
            case '业主抽查不合格':
                this.handleExportTreesInfoData('', '', 0);
                break;
        }
    }
    handleExportTreesInfoData = async (samplingstatus = '', status = '', checkstatus = '') => {
        const {
            sxm = '',
            section = '',
            stime = '',
            etime = '',
            treetype = '',
            smallclassData,
            thinclassData
        } = this.state;
        const {
            actions: {
                getexportTree
            },
            leftkeycode
        } = this.props;
        let postData = {
            no: leftkeycode,
            sxm,
            section,
            treetype,
            status: status,
            samplingStatus: samplingstatus,
            checkstatus,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            smallclass: smallclassData, // 小班
            thinclass: thinclassData
        };
        this.setState({
            loading: true,
            percent: 0
        });
        getexportTree({}, postData).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                window.open(`${FOREST_API}/${rst3}`);
            }
            this.setState({
                loading: false,
                percent: 100
            });
        });
    }
    handleExportQualityInfoData = async () => {
        const {
            section = '',
            stime = '',
            etime = '',
            treetype = '',
            thinclass,
            smallclass
        } = this.state;
        const {
            actions: {
                getExportQualityTrees
            },
            leftkeycode
        } = this.props;
        let no = '';
        if (thinclass) {
            let thinClassArr = thinclass.split('-');
            if (thinClassArr && thinClassArr instanceof Array && thinClassArr.length === 5) {
                no = thinClassArr[0] + '-' + thinClassArr[1] + '-' + thinClassArr[3] + '-' + thinClassArr[4];
            }
        } else if (smallclass) {
            let smallclassArr = smallclass.split('-');
            if (smallclassArr && smallclassArr instanceof Array && smallclassArr.length === 4) {
                no = smallclassArr[0] + '-' + smallclassArr[1] + '-' + smallclassArr[3];
            }
        } else if (leftkeycode) {
            no = leftkeycode;
        }
        let postData = {
            thinclass: no,
            section,
            treetype,
            status: '0,2',
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss')
        };
        this.setState({
            loading: true,
            percent: 0
        });
        getExportQualityTrees({}, postData).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                window.open(`${FOREST_API}/${rst3}`);
            }
            this.setState({
                loading: false,
                percent: 100
            });
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
    treeTable (details) {
        const {
            sectionoption,
            smallclassoption,
            treetypeoption,
            thinclassoption,
            statusoption,
            typeoption
        } = this.props;
        const {
            sxm,
            section,
            smallclass,
            thinclass,
            status,
            bigType,
            treetypename,
            userOptions = [],
            currentColumn
        } = this.state;
        let header = '';

        header = (
            <div>
                <Row className='forest-search-layout'>
                    {
                        status !== '质量不合格'
                            ? <div className='forest-mrg10'>
                                <span className='forest-search-span'>顺序码：</span>
                                <Input
                                    value={sxm}
                                    className='forest-forestcalcw4'
                                    onChange={this.sxmChange.bind(this)}
                                />
                            </div> : ''
                    }
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
                    <div className='forest-unique-select'>
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
                        <span className='forest-search-span'>
                            {status !== '质量不合格' ? '栽植时间：' : '抽查时间'}
                        </span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(
                                    this.state.stime,
                                    'YYYY-MM-DD HH:mm:ss'
                                ),
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
                        <span>{`此次查询共有数据：${this.state.messageTotalNum}条，  共有苗木：${this.state.treeTotalNum}棵`}</span>
                    </Col>
                    <Col span={2}>
                        <Button
                            type='primary'
                            // style={{ display: 'none' }}
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
                        columns={currentColumn || this.columns}
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

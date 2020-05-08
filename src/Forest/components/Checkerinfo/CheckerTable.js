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
import { getForestImgUrl } from '_platform/auth';
import '../index.less';
import { getSmallThinNameByPlaceData } from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class CheckerTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            treetypename: '',
            size: 10,
            exportsize: 100,
            ostime: moment().format('YYYY-MM-DD 00:00:00'),
            oetime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            smallclass: '',
            thinclass: '',
            status: '',
            treety: '',
            treetype: '',
            CheckStatus: '',
            locationstatus: '',
            rolename: '',
            percent: 0,
            messageTotalNum: '',
            treeTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: '',
            userOptions: []
        };
    }
    componentDidMount () {
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
            treetypeoption,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            statusoption
        } = this.props;
        const {
            sxm,
            rolename,
            section,
            bigType,
            smallclass,
            thinclass,
            status,
            treetypename,
            userOptions = []
        } = this.state;
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
                title: '抽查人',
                dataIndex: 'CheckerName',
                render: (text, record) => {
                    if (record.CheckerUserName && record.CheckerName) {
                        return <p>{record.CheckerName + '(' + record.CheckerUserName + ')'}</p>;
                    } else if (record.CheckerName && !record.CheckerUserName) {
                        return <p>{record.CheckerName}</p>;
                    } else {
                        return <p> / </p>;
                    }
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
                title: '业主抽查时间',
                render: (text, record) => {
                    const { checktime1 = '', checktime2 = '' } = record;
                    return (
                        <div>
                            <div>{checktime1}</div>
                            <div>{checktime2}</div>
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
                        <span className='forest-search-span'>抽查人：</span>
                        <Select
                            allowClear
                            showSearch
                            className='forest-forestcalcw4'
                            placeholder={'请输入姓名搜索'}
                            onSearch={this.handleUserSearch.bind(this)}
                            onChange={this.onRoleNameChange.bind(this)}
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            value={rolename || undefined}
                        >
                            {userOptions}
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker6'>
                        <span className='forest-search-span6'>业主抽查时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(
                                    this.state.ostime,
                                    'YYYY-MM-DD HH:mm:ss'
                                ),
                                moment(this.state.oetime, 'YYYY-MM-DD HH:mm:ss')
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
                        locale={{ emptyText: '当天无业主抽查信息' }}
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
        let CheckStatus = '';
        switch (value) {
            case '1':
                CheckStatus = 0;
                break;
            case '2':
                CheckStatus = -1;
                break;
            case '3':
                CheckStatus = 1;
                break;
            default:
                break;
        }
        this.setState({ CheckStatus, status: value || '' });
    }

    onLocationChange (value) {
        this.setState({ locationstatus: value });
    }

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
                fullname: value
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
    onRoleNameChange (value) {
        console.log('value', value);
        this.setState({
            rolename: value
        });
    }

    datepick (value) {
        this.setState({
            ostime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            oetime: value[1]
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
            section = '',
            status = '',
            rolename = '',
            ostime = '',
            oetime = '',
            size,
            smallclass,
            thinclass,
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
            actions: {
                getqueryTree,
                getUserDetail
            },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            no: keycode,
            sxm,
            section,
            status,
            ostime: ostime && moment(ostime).format('YYYY-MM-DD HH:mm:ss'),
            oetime: oetime && moment(oetime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype,
            checker: rolename
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getqueryTree({}, postdata);
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
                plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                let statusname = '';
                plan.SupervisorCheck = plan.SupervisorCheck;
                plan.CheckStatus = plan.CheckStatus;
                plan.statusname = statusname;

                let locationstatus = plan.LocationTime
                    ? '已定位'
                    : '未定位';
                plan.locationstatus = locationstatus;
                // 改为验收时间
                let checktime1 = plan.CheckTime
                    ? moment(plan.CheckTime).format('YYYY-MM-DD')
                    : '/';
                let checktime2 = plan.CheckTime
                    ? moment(plan.CheckTime).format('HH:mm:ss')
                    : '/';
                plan.checktime1 = checktime1;
                plan.checktime2 = checktime2;
                let userData = '';
                if (userIDList.indexOf(Number(plan.Checker)) === -1) {
                    userData = await getUserDetail({id: plan.Checker});
                } else {
                    userData = userDataList[Number(plan.Checker)];
                }
                if (userData && userData.ID) {
                    userIDList.push(userData.ID);
                    userDataList[userData.ID] = userData;
                }
                plan.CheckerName = (userData && userData.Full_Name) || '';
                plan.CheckerUserName = (userData && userData.User_Name) || '';
            }
            const pagination = { ...this.state.pagination };
            let messageTotalNum = rst.pageinfo.total;
            let treeTotalNum = rst.total;

            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;
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

    exportexcel () {
        const {
            sxm = '',
            section = '',
            // CheckStatus = '',
            rolename = '',
            ostime = '',
            oetime = '',
            exportsize,
            smallclass,
            thinclass,
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
            actions: { getexportTree4Checker },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            // CheckStatus,
            ostime: ostime && moment(ostime).format('YYYY-MM-DD HH:mm:ss'),
            oetime: oetime && moment(oetime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype,
            checker: rolename
        };

        this.setState({ loading: true, percent: 0 });
        getexportTree4Checker({}, postdata).then(rst3 => {
            this.setState({ loading: false });
            if (rst3 === '') {
                message.info('最近日期没有抽查的数据');
            } else {
                this.createLink(this, `${FOREST_API}/${rst3}`);
            }
        });
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
}

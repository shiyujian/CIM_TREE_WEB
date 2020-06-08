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
import { getForestImgUrl } from '_platform/auth';
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import QualityDefectsModal from './QualityDefectsModal';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class QualityDefectsTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewVisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            smallclass: '',
            smallclassData: '',
            thinclass: '',
            thinclassData: '',
            problemType: '',
            flowStatus: '',
            percent: 0,
            recordDetail: ''
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order',
            key: 'order'
        },
        {
            title: '二维码',
            dataIndex: 'SXM',
            key: 'SXM'
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
        {
            title: '位置',
            dataIndex: 'place',
            key: 'place'
        },
        {
            title: '缺陷类型',
            dataIndex: 'ProblemType',
            key: 'ProblemType'
        },
        {
            title: '上报时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
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
            title: '整改状态',
            dataIndex: 'Status',
            key: 'Status',
            render: (text, record) => {
                if (text) {
                    switch (text) {
                        case -1:
                            return '已提交';
                        case 0:
                            return '未通过';
                        case 1:
                            return '整改中';
                        case 2:
                            return '整改完成';
                        case 3:
                            return '确认完成';
                    }
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
                            查看
                        </a>
                    </div>
                );
            }
        }
    ]
    componentDidMount () {
    }

    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }

    onSectionChange (value) {
        this.props.sectionSelect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: ''
        });
    }

    onSmallClassChange = (value) => {
        try {
            this.props.smallClassSelect(value);
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

    onThinClassChange = (value) => {
        try {
            this.props.thinClassSelect(value);
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
        this.setState({
            problemType: value
        });
    }

    onStatusChange (value) {
        this.setState({
            flowStatus: value
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
        const {
            actions: {
                getQualityDefectsDetail
            }
        } = this.props;

        let recordDetail = await getQualityDefectsDetail({id: record.ID});
        // 有图片的数据
        // let recordDetail = await getQualityDefectsDetail({id: 'd8e805aa-85e5-4f45-8701-e501f80a44f5'});
        console.log('recordDetail', recordDetail);
        recordDetail.Project = record.Project;
        recordDetail.sectionName = record.sectionName;
        recordDetail.place = record.place;

        this.setState({
            viewVisible: true,
            recordDetail
        });
    }
    handleCancel () {
        this.setState({
            viewVisible: false
        });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = async (page) => {
        const {
            sxm = '',
            section = '',
            smallclass = '',
            smallclassData = '',
            thinclass = '',
            thinclassData = '',
            problemType = '',
            flowStatus = '',
            stime = '',
            etime = '',
            size
        } = this.state;
        if (thinclass === '') {
            message.info('请选择细班');
            return;
        }
        const {
            actions: {
                getQualityDefectsList,
                getUserDetail
            },
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let no = '';
        console.log('thinclass', thinclass);

        if (thinclass) {
            let handleKey = thinclass.split('-');
            no = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
        } else if (leftkeycode) {
            no = leftkeycode;
        }

        let thinClassTree = tree.thinClassTree;
        let postdata = {
            sxm,
            section: section,
            no,
            problemType,
            status: flowStatus,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getQualityDefectsList({}, postdata);
        console.log('rst', rst);
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
                plan.liftertime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                plan.liftertime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                let SmallClass = '';
                let ThinClass = '';
                if (plan.No) {
                    let handleKey = plan.No.split('-');
                    SmallClass = handleKey[2];
                    ThinClass = handleKey[3];
                }
                plan.SmallClass = SmallClass;
                plan.ThinClass = ThinClass;
                plan.place = getSmallThinNameByPlaceData(plan.Section, SmallClass, ThinClass, thinClassTree);
                // 获取上报人
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
                pagination,
                loading: false,
                percent: 100
            });
        }
    }
    treeTable (details) {
        const {
            sectionOption,
            smallClassOption,
            thinClassOption,
            typeOption,
            flowStatusOption
        } = this.props;
        const {
            sxm,
            section,
            problemType,
            flowStatus,
            smallclass,
            thinclass
        } = this.state;
        let header = '';
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
                            {sectionOption}
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
                            {smallClassOption}
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
                            {thinClassOption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={problemType}
                            onChange={this.onTypeChange.bind(this)}
                        >
                            {typeOption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>状态：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            onChange={this.onStatusChange.bind(this)}
                            value={flowStatus}
                        >
                            {flowStatusOption}
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>上报时间：</span>
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
                    <Col span={20} className='forest-quryrstcnt'>
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
                        locale={{ emptyText: '当前无质量缺陷信息' }}
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
            viewVisible
        } = this.state;
        return (
            <div>
                {this.treeTable(tblData)}
                {
                    viewVisible
                        ? <QualityDefectsModal
                            {...this.state}
                            {...this.props}
                            handleCancel={this.handleCancel.bind(this)}
                        /> : ''
                }
            </div>
        );
    }
}

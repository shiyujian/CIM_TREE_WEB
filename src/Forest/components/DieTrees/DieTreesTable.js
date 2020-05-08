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
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;

export default class DieTreesTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            bigType: '',
            treetype: '',
            smallclass: '',
            thinclass: '',
            treetypename: '',
            SupervisorCheck: '',
            CheckStatus: '',
            percent: 0,
            messageTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: ''
        };
        this.columns = [
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
                title: '死亡时间',
                render: (text, record) => {
                    const { createtime3 = '', createtime4 = '' } = record;
                    return (
                        <div>
                            <div>{createtime3}</div>
                            <div>{createtime4}</div>
                        </div>
                    );
                }
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
                if (arr && arr instanceof Array && arr.length === 4) {
                    smallclassData = arr[0] + '-' + arr[1] + '-' + arr[3];
                    this.setState({
                        smallclass: value,
                        smallclassData
                    });
                } else {
                    this.setState({
                        smallclass: '',
                        smallclassData
                    });
                }
            } else {
                this.setState({
                    smallclass: value,
                    smallclassData
                });
            }
            this.setState({
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
                if (arr && arr instanceof Array && arr.length === 5) {
                    thinclassData = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
                    this.setState({
                        thinclass: value,
                        thinclassData
                    });
                } else {
                    this.setState({
                        thinclass: '',
                        thinclassData
                    });
                }
            } else {
                this.setState({
                    thinclass: value,
                    thinclassData
                });
            }
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

    onLocationChange (value) {
        this.setState({ islocation: value || '' });
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
    exportexcel =async () => {
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            stime = '',
            etime = '',
            size,
            thinclass = '',
            smallclassData = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: {
                getExportDieTree
            },
            platform: { tree = {} }
        } = this.props;
        let postData = {
            sxm,
            // no: keycode,
            section,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss')
        };

        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getExportDieTree({}, postData);

        if (rst === '') {
            message.info('没有符合条件的信息');
        } else {
            window.open(`${FOREST_API}/${rst}`);
        }
        this.setState({ loading: false });
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
            section = '',
            bigType = '',
            treetype = '',
            stime = '',
            etime = '',
            size,
            thinclass = '',
            smallclassData = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: {
                getDieTreesData,
                getUserDetail
            },
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postData = {
            sxm,
            // no: keycode,
            section,
            smallclass: smallclassData,
            thinclass: thinclassData,
            bigType,
            treetype,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };

        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getDieTreesData({}, postData);

        if (!(rst && rst.content && rst.content instanceof Array)) {
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
                let islocation = plan.LocationTime ? '已定位' : '未定位';
                plan.islocation = islocation;
                let createtime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                let createtime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                let createtime3 = plan.DieTime
                    ? moment(plan.DieTime).format('YYYY-MM-DD')
                    : '/';
                let createtime4 = plan.DieTime
                    ? moment(plan.DieTime).format('HH:mm:ss')
                    : '/';
                plan.createtime1 = createtime1;
                plan.createtime2 = createtime2;
                plan.createtime3 = createtime3;
                plan.createtime4 = createtime4;
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

            let messageTotalNum = rst.pageinfo.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;

            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                loading: false,
                percent: 100
            });
        }
    }

    treeTable (details) {
        const {
            treetypeoption,
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            sxm,
            section,
            smallclass,
            thinclass,
            bigType,
            treetypename
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
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>测量时间：</span>
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
                    <Col span={18} className='forest-quryrstcnt'>
                        <span>{`此次查询共有数据：${this.state.messageTotalNum}条`}</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.exportexcel.bind(this)}
                            style={{display: 'block'}}
                        >
                            导出
                        </Button>
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
                        locale={{ emptyText: '当天无死亡苗木信息' }}
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

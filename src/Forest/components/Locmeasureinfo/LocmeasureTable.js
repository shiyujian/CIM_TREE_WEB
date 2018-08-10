import React, { Component } from 'react';
import {
    Icon,
    Table,
    Spin,
    Tabs,
    Modal,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Input,
    InputNumber,
    Progress,
    message
} from 'antd';
import moment from 'moment';
import { FOREST_API, PROJECT_UNITS } from '../../../_platform/api';
import { getUser } from '_platform/auth';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class LocmeasureTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            leftkeycode: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            lstime: '',
            letime: '',
            sxm: '',
            section: '',
            bigType: '',
            treetype: '',
            smallclass: '',
            thinclass: '',
            treetypename: '',
            status: '',
            SupervisorCheck: '',
            CheckStatus: '',
            islocation: '',
            role: 'inputer',
            rolename: '',
            percent: 0,
            totalNum: '',
            imgArr: []
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
                dataIndex: 'Section',
                render: (text, record) => {
                    return <p>{this.getBiao(text)}</p>;
                }
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
                title: '状态',
                dataIndex: 'statusname',
                render: (text, record) => {
                    let superName = '';
                    let ownerName = '';
                    if (
                        record.SupervisorCheck == -1 &&
                        record.CheckStatus == -1
                    ) {
                        return <span>未抽查</span>;
                    } else {
                        if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                            superName = '监理抽查通过';
                        }

                        if (record.CheckStatus == 0) ownerName = '业主抽查退回';
                        else if (record.CheckStatus == 1) {
                            ownerName = '业主抽查通过';
                        } else if (record.CheckStatus == 2) {
                            ownerName = '业主抽查退回后修改';
                        }
                        if (superName && ownerName) {
                            return (
                                <div>
                                    <div>{superName}</div>
                                    <div>{ownerName}</div>
                                </div>
                            );
                        } else if (superName) {
                            return <span>{superName}</span>;
                        } else {
                            return <span>{ownerName}</span>;
                        }
                    }
                }
            },
            {
                title: '定位',
                dataIndex: 'islocation'
            },
            {
                title: '测量人',
                dataIndex: 'Inputer',
                render: (text, record) => {
                    return (
                        <span>
                            {users && users[text]
                                ? users[text].Full_Name +
                                  '(' +
                                  users[text].User_Name +
                                  ')'
                                : ''}
                        </span>
                    );
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
                title: '定位时间',
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
            }
            // ,{
            // 	title:<div><div>是否</div><div>截干</div></div>,
            // 	render: (text,record) => {
            // 		return <div>
            // 					{
            // 						record.JG == 1
            // 						? <span>是</span>
            // 						: <span>否</span>
            // 					}
            // 				</div>
            // 	}
            // },{
            // 	title:<div><div>干皮有无</div><div>损伤</div></div>,
            // 	render: (text,record) => {
            // 		return <div>
            // 					{
            // 						record.GP == 1
            // 						? <span>有</span>
            // 						: <span>无</span>
            // 					}
            // 				</div>
            // 	}
            // },{
            // 	title:<div><div>冠型完整，</div><div>不偏冠</div></div>,
            // 	render: (text,record) => {
            // 		return <div>
            // 					{
            // 						record.GXWZ == 1
            // 						? <span>是</span>
            // 						: <span>否</span>
            // 					}
            // 				</div>
            // 	}
            // },{
            // 	title:<div><div>生长</div><div>健壮</div></div>,
            // 	render: (text,record) => {
            // 		return <div>
            // 					{
            // 						record.SZJZ == 1
            // 						? <span>是</span>
            // 						: <span>否</span>
            // 					}
            // 				</div>
            // 	}
            // },{
            // 	title:<div><div>有无病</div><div>虫害</div></div>,
            // 	render: (text,record) => {
            // 		return <div>
            // 					{
            // 						record.BCH == 1
            // 						? <span>有</span>
            // 						: <span>无</span>
            // 					}
            // 				</div>
            // 	}
            // }
        ];
    }
    getBiao (code) {
        let str = '';
        PROJECT_UNITS.map(item => {
            item.units.map(single => {
                if (single.code === code) {
                    str = single.value;
                }
            });
        });
        return str;
    }
    componentDidMount () {
        let user = getUser();
        this.sections = JSON.parse(user.sections);
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode != this.state.leftkeycode) {
            console.log('nextProps.leftkeycode', nextProps.leftkeycode);
            console.log('this.state.leftkeycode', this.state.leftkeycode);
            this.setState({
                leftkeycode: nextProps.leftkeycode
            });
        }
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
                    {/* <img style={{width:"490px"}} src={this.state.src} alt="图片"/> */}
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
            leftkeycode,
            keycode,
            statusoption,
            locationoption,
            users
        } = this.props;
        const {
            sxm,
            rolename,
            section,
            smallclass,
            thinclass,
            bigType,
            treetypename,
            status,
            islocation
        } = this.state;
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        const suffix2 = rolename ? (
            <Icon type='close-circle' onClick={this.emitEmpty2} />
        ) : null;
        let columns = [];
        let header = '';

        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input
                            suffix={suffix1}
                            value={sxm}
                            className='forest-forestcalcw4'
                            onChange={this.sxmchange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onsectionchange.bind(this)}
                        >
                            {sectionoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>小班：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={smallclass}
                            onChange={this.onsmallclasschange.bind(this)}
                        >
                            {smallclassoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>细班：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={thinclass}
                            onChange={this.onthinclasschange.bind(this)}
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
                            onChange={this.ontypechange.bind(this)}
                        >
                            {typeoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>树种：</span>
                        <Select
                            allowClear
                            showSearch
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={treetypename}
                            onChange={this.ontreetypechange.bind(this)}
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
                            onChange={this.onstatuschange.bind(this)}
                        >
                            {statusoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>定位：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={islocation}
                            onChange={this.onlocationchange.bind(this)}
                        >
                            {locationoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>测量人：</span>
                        <Input
                            suffix={suffix2}
                            value={rolename}
                            className='forest-forestcalcw4'
                            onChange={this.onrolenamechange.bind(this)}
                        />
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
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>定位时间：</span>
                        <RangePicker
                            className='forest-forestcalcw4'
                            style={{ verticalAlign: 'middle' }}
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick1.bind(this)}
                            onOk={this.datepick1.bind(this)}
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
                        <span>此次查询共有苗木：{this.state.totalNum}棵</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.exportexcel.bind(this)}
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
                        locale={{ emptyText: '当天无现场测量信息' }}
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

    emitEmpty2 = () => {
        this.setState({ rolename: '' });
    };

    sxmchange (value) {
        this.setState({ sxm: value.target.value });
    }

    onsectionchange (value) {
        const { sectionselect } = this.props;
        sectionselect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            bigType: '',
            treetype: '',
            treetypename: ''
        });
    }

    onsmallclasschange (value) {
        const { smallclassselect } = this.props;
        const { section, leftkeycode } = this.state;
        smallclassselect(value || leftkeycode, section);
        this.setState({
            smallclass: value || '',
            thinclass: '',
            bigType: '',
            treetype: '',
            treetypename: ''
        });
    }

    onthinclasschange (value) {
        const { thinclassselect } = this.props;
        const { section, smallclass } = this.state;
        thinclassselect(value || smallclass, section);
        this.setState({
            thinclass: value || '',
            bigType: '',
            treetype: '',
            treetypename: ''
        });
    }

    ontypechange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    ontreetypechange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    onstatuschange (value) {
        this.setState({ status: value || '' });
    }

    onlocationchange (value) {
        this.setState({ islocation: value || '' });
    }

    onrolenamechange (value) {
        this.setState({ rolename: value.target.value });
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

    datepick1 (value) {
        this.setState({
            lstime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            letime: value[1]
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
        this.qury(pagination.current);
    }

    onImgClick (data) {
        // src = src.replace(/\/\//g,'/')
        // src =  `${FOREST_API}/${src}`
        // this.setState({src},() => {
        // 	this.setState({imgvisible:true,})
        // })

        let srcs = [];
        try {
            let arr = data.split(',');
            console.log('arr', arr);
            arr.map(rst => {
                let src = rst.replace(/\/\//g, '/');
                src = `${FOREST_API}/${src}`;
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
    getThinClassName (no, section) {
        const { littleBanAll } = this.props;
        let nob = no.substring(0, 15);
        let sectionn = section.substring(8, 10);
        let result = '/';

        if (littleBanAll) {
            littleBanAll.map(item => {
                if (
                    item.No.substring(0, 15) === nob &&
                    item.No.substring(16, 18) === sectionn
                ) {
                    result = item.ThinClassName;
                }
            });
        } else {
            return <p> / </p>;
        }
        return result;
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    qury (page) {
        const { users } = this.props;
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            islocation = '',
            role = '',
            rolename = '',
            stime = '',
            etime = '',
            lstime = '',
            letime = '',
            status = '',
            size,
            thinclass = '',
            smallclass = ''
        } = this.state;
        // if(this.sections.length !== 0){  //不是admin，要做查询判断了
        // 	if(section === ''){
        // 		message.info('请选择标段信息');
        // 		return;
        // 	}
        // }

        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }

        const {
            actions: { getqueryTree },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            bigType,
            treetype,
            islocation,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            lstime: lstime && moment(lstime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            letime: letime && moment(letime).format('YYYY-MM-DD HH:mm:ss'),
            status,
            page,
            size: size,
            thinclass,
            smallclass
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getqueryTree({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    tblData[i].order = (page - 1) * size + i + 1;
                    let place = '';
                    if (plan.Section.indexOf('P010') !== -1) {
                        place = this.getThinClassName(plan.No, plan.Section);
                    } else {
                        place = `${plan.SmallClass}号小班${
                            plan.ThinClass
                        }号细班`;
                    }
                    tblData[i].place = place;
                    let statusname = '';

                    tblData[i].SupervisorCheck = plan.SupervisorCheck;
                    tblData[i].CheckStatus = plan.CheckStatus;
                    tblData[i].statusname = statusname;
                    let islocation = plan.LocationTime ? '已定位' : '未定位';
                    tblData[i].islocation = islocation;
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
                    tblData[i].createtime1 = createtime1;
                    tblData[i].createtime2 = createtime2;
                    tblData[i].createtime3 = createtime3;
                    tblData[i].createtime4 = createtime4;
                    tblData[i].Project = this.getProject(tblData[i].Section);
                });
                let totalNum = rst.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;

                if (bigType == '5') {
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
                            dataIndex: 'Section',
                            render: (text, record) => {
                                return <p>{this.getBiao(text)}</p>;
                            }
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
                            title: '状态',
                            dataIndex: 'statusname',
                            render: (text, record) => {
                                let superName = '';
                                let ownerName = '';
                                if (
                                    record.SupervisorCheck == -1 &&
                                    record.CheckStatus == -1
                                ) {
                                    return <span>未抽查</span>;
                                } else {
                                    if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                                        superName = '监理抽查通过';
                                    }

                                    if (record.CheckStatus == 0) { ownerName = '业主抽查退回'; } else if (record.CheckStatus == 1) {
                                        ownerName = '业主抽查通过';
                                    } else if (record.CheckStatus == 2) {
                                        ownerName = '业主抽查退回后修改';
                                    }
                                    if (superName && ownerName) {
                                        return (
                                            <div>
                                                <div>{superName}</div>
                                                <div>{ownerName}</div>
                                            </div>
                                        );
                                    } else if (superName) {
                                        return <span>{superName}</span>;
                                    } else {
                                        return <span>{ownerName}</span>;
                                    }
                                }
                            }
                        },
                        {
                            title: '测量人',
                            dataIndex: 'Inputer',
                            render: (text, record) => {
                                return (
                                    <span>
                                        {users && users[text]
                                            ? users[text].Full_Name +
                                              '(' +
                                              users[text].User_Name +
                                              ')'
                                            : ''}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '测量时间',
                            render: (text, record) => {
                                const {
                                    createtime1 = '',
                                    createtime2 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime1}</div>
                                        <div>{createtime2}</div>
                                    </div>
                                );
                            }
                        },
                        {
                            title: '实际载植量',
                            dataIndex: 'Num'
                        }
                    ];
                } else {
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
                            dataIndex: 'Section',
                            render: (text, record) => {
                                return <p>{this.getBiao(text)}</p>;
                            }
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
                            title: '状态',
                            dataIndex: 'statusname',
                            render: (text, record) => {
                                let superName = '';
                                let ownerName = '';
                                if (
                                    record.SupervisorCheck == -1 &&
                                    record.CheckStatus == -1
                                ) {
                                    return <span>未抽查</span>;
                                } else {
                                    if (record.SupervisorCheck == 0) { superName = '监理抽查退回'; } else if (record.SupervisorCheck === 1) {
                                        superName = '监理抽查通过';
                                    }

                                    if (record.CheckStatus == 0) { ownerName = '业主抽查退回'; } else if (record.CheckStatus == 1) {
                                        ownerName = '业主抽查通过';
                                    } else if (record.CheckStatus == 2) {
                                        ownerName = '业主抽查退回后修改';
                                    }
                                    if (superName && ownerName) {
                                        return (
                                            <div>
                                                <div>{superName}</div>
                                                <div>{ownerName}</div>
                                            </div>
                                        );
                                    } else if (superName) {
                                        return <span>{superName}</span>;
                                    } else {
                                        return <span>{ownerName}</span>;
                                    }
                                }
                            }
                        },
                        {
                            title: '定位',
                            dataIndex: 'islocation'
                        },
                        {
                            title: '测量人',
                            dataIndex: 'Inputer',
                            render: (text, record) => {
                                return (
                                    <span>
                                        {users && users[text]
                                            ? users[text].Full_Name +
                                              '(' +
                                              users[text].User_Name +
                                              ')'
                                            : ''}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '测量时间',
                            render: (text, record) => {
                                const {
                                    createtime1 = '',
                                    createtime2 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime1}</div>
                                        <div>{createtime2}</div>
                                    </div>
                                );
                            }
                        },
                        {
                            title: '定位时间',
                            render: (text, record) => {
                                const {
                                    createtime3 = '',
                                    createtime4 = ''
                                } = record;
                                return (
                                    <div>
                                        <div>{createtime3}</div>
                                        <div>{createtime4}</div>
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
                        }
                    ];
                }

                this.setState({
                    tblData,
                    pagination: pagination,
                    totalNum: totalNum
                });
            }
        });
    }

    getProject (section) {
        let projectName = '';
        // 获取当前标段所在的项目
        PROJECT_UNITS.map(item => {
            if (section.indexOf(item.code) != -1) {
                projectName = item.value;
            }
        });
        return projectName;
    }

    exportexcel () {
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            locationstatus = '',
            role = '',
            rolename = '',
            stime = '',
            lstime = '',
            etime = '',
            letime = '',
            exportsize,
            thinclass = '',
            smallclass = '',
            status = ''
        } = this.state;
        // if(this.sections.length !== 0){  //不是admin，要做查询判断了
        // 	if( section === ''){
        // 		message.info('请选择标段信息');
        // 		return;
        // 	}
        // }
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getqueryTree, getexportTree },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            treetype,
            status,
            // locationstatus,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            lstime: lstime && moment(lstime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            letime: letime && moment(letime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            thinclass,
            smallclass
        };
        if (role) postdata[role] = rolename;
        this.setState({ loading: true, percent: 0 });
        getexportTree({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                window.open(`${FOREST_API}/${rst3}`);
                // this.createLink(this,`${FOREST_API}/${rst3}`)
            }
            this.setState({ loading: false });
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
}

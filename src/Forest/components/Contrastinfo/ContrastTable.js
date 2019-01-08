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
    message
} from 'antd';
import moment from 'moment';
import { FOREST_API } from '../../../_platform/api';
import { getUser, getForestImgUrl } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';

export default class ContrastTable extends Component {
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
            treetypename: '',
            factory: '',
            isstandard: '',
            percent: 0,
            nursery: '',
            imgArr: []
        };
    }
    componentDidMount () {
        let user = getUser();
        this.sections = JSON.parse(user.sections);
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
    treeTable (details) {
        const {
            treetypeoption,
            sectionoption,
            typeoption,
            standardoption
        } = this.props;
        const {
            sxm,
            factory,
            nursery,
            section,
            bigType,
            treetypename,
            isstandard
        } = this.state;
        // 清除
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
        const suffix2 = factory ? (
            <Icon type='close-circle' onClick={this.emitEmpty2} />
        ) : null;
        const suffix3 = nursery ? (
            <Icon type='close-circle' onClick={this.emitEmpty3} />
        ) : null;
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
            // ,{
            // 	title:"项目",
            // 	dataIndex: 'Project',
            // }
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
                title: '供应商',
                dataIndex: 'Factory'
            },
            {
                title: '苗圃名称',
                dataIndex: 'NurseryName'
            },
            {
                title: '起苗时间',
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
                title: (
                    <div>
                        <div>高度</div>
                        <div>(供应商)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.FGD && record.FGD != 0) {
                        return (
                            <a
                                disabled={!record.FGDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.FGDFJ
                                )}
                            >
                                {record.FGD}
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
                        <div>(供应商)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.FTQHD && record.FTQHD != 0) {
                        return (
                            <a
                                disabled={!record.FTQHDFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.FTQHDFJ
                                )}
                            >
                                {record.FTQHD}
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
                        <div>(供应商)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.FTQZJ && record.FTQZJ != 0) {
                        return (
                            <a
                                disabled={!record.FTQZJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.FTQZJFJ
                                )}
                            >
                                {record.FTQZJ}
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
                        <div>高度</div>
                        <div>(监理)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.GD && record.GD != 0) {
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
                        <div>土球高度</div>
                        <div>(监理)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.TQHD && record.TQHD != 0) {
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
                        <div>(监理)</div>
                    </div>
                ),
                render: (text, record) => {
                    if (record.TQZJ && record.TQZJ != 0) {
                        return (
                            <a
                                disabled={!record.TQZJFJ}
                                onClick={this.onImgClick.bind(
                                    this,
                                    record.TQZJFJ
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
                title: '是否合标',
                render: (text, record) => {
                    return (
                        <div>
                            {record.IsStandard == 1 ? (
                                <span>合标</span>
                            ) : (
                                <span style={{ color: 'red' }}>不合标</span>
                            )}
                        </div>
                    );
                }
            },
            {
                title: '监理人',
                render: (text, record) => {
                    if (text === 0) {
                        return <p> / </p>;
                    }
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
            }
        ];
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>顺序码：</span>
                        <Input
                            suffix={suffix1}
                            value={sxm}
                            className='forest-forestcalcw4'
                            onChange={this.sxmChange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onSectionChange.bind(this)}
                        >
                            {sectionoption}
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
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={treetypename}
                            onChange={this.onTreeTypeChange.bind(this)}
                        >
                            {treetypeoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>供应商：</span>
                        <Input
                            suffix={suffix2}
                            value={factory}
                            className='forest-forestcalcw4'
                            onChange={this.factorychange.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>是否合标：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={isstandard}
                            onChange={this.standardchange.bind(this)}
                        >
                            {standardoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>供应商：</span>
                        <Input
                            suffix={suffix3}
                            value={nursery}
                            className='forest-forestcalcw4'
                            onChange={this.nurserychange.bind(this)}
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
                        <span>
                            此次查询共有苗木：
                            {this.state.pagination.total}棵
                        </span>
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
                        locale={{ emptyText: '当天无信息' }}
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
        this.setState({ factory: '' });
    };

    emitEmpty3 = () => {
        this.setState({ nursery: '' });
    };
    sxmChange (value) {
        this.setState({ sxm: value.target.value });
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || ''
        });
    }

    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    factorychange (value) {
        this.setState({ factory: value.target.value });
    }

    nurserychange (value) {
        this.setState({ nursery: value.target.value });
    }

    standardchange (value) {
        this.setState({ isstandard: value || '' });
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

    query (page) {
        const {
            sxm = '',
            section = '',
            bigType = '',
            treetype = '',
            factory = '',
            nursery = '',
            isstandard = '',
            size
        } = this.state;
        if (section === '' && sxm === '') {
            message.info('请选择项目及标段信息或输入顺序码');
            return;
        }
        const {
            actions: { getfactoryAnalyse },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            no: keycode,
            sxm,
            section,
            bigType,
            treetype,
            factory,
            nurseryname: nursery,
            isstandard,
            page,
            size
        };
        this.setState({ loading: true, percent: 0 });
        getfactoryAnalyse({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    plan.order = (page - 1) * size + i + 1;
                    plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                    plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                    let liftertime1 = plan.LifterTime
                        ? moment(plan.LifterTime).format('YYYY-MM-DD')
                        : '/';
                    let liftertime2 = plan.LifterTime
                        ? moment(plan.LifterTime).format('HH:mm:ss')
                        : '/';
                    plan.liftertime1 = liftertime1;
                    plan.liftertime2 = liftertime2;
                });
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({ tblData, pagination: pagination });
            }
        });
    }

    exportexcel () {
        const {
            sxm = '',
            section = '',
            treetype = '',
            factory = '',
            nurseryname: nursery,
            isstandard = '',
            exportsize
        } = this.state;
        if (section === '' && sxm === '') {
            message.info('请选择项目及标段信息或输入顺序码');
            return;
        }
        const {
            actions: { getexportFactoryAnalyse },
            keycode = ''
        } = this.props;
        let postdata = {
            no: keycode,
            sxm,
            section,
            treetype,
            factory,
            nurseryname: nursery,
            isstandard,
            page: 1,
            size: exportsize
        };
        this.setState({ loading: true, percent: 0 });
        getexportFactoryAnalyse({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                this.createLink(this, `${FOREST_API}/${rst3}`);
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

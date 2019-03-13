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
    message,
    Card
} from 'antd';
import moment from 'moment';
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

export default class DegitalAcceptTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            curingModalvisible: false,
            curingTreeData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime1: moment().format('YYYY-MM-DD 00:00:00'),
            etime1: moment().format('YYYY-MM-DD 23:59:59'),
            stime2: moment().format('YYYY-MM-DD 00:00:00'),
            etime2: moment().format('YYYY-MM-DD 23:59:59'),
            ystype: '', // 验收类型
            zt: '', // 状态
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
            sgy: '',
            cly: '',
            jl: ''
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
                title: '小班',
                dataIndex: 'place'
            },
            {
                title: '细班',
                dataIndex: 'TreeTypeObj.TreeTypeName'
            },
            {
                title: '验收类型',
                dataIndex: 'statusname'
            },
            {
                title: '树种',
                dataIndex: 'islocation'
            },
            {
                title: '状态',
                dataIndex: 'islocation'
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
                title: '操作',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={this.remarkDefault.bind(this, record)}>
                                备注
                            </a>
                        </div>
                    );
                }
            }
        ];
    }
    componentDidMount = async () => {
        try {
            const {
                actions: {
                    getCuringTypes
                }
            } = this.props;
            let curingTypesData = await getCuringTypes();
            let curingTypes = curingTypesData && curingTypesData.content;
            this.setState({
                curingTypes
            });
            let user = getUser();
            this.sections = JSON.parse(user.sections);
        } catch (e) {
            console.log('getCuringTypes', e);
        }
    }
    render () {
        const { curingTreeData, curingTreeModalData, curingSXM } = this.state;
        return (
            <div>
                {this.treeTable(curingTreeData)}
                <Modal
                    width={522}
                    title='详细信息'
                    style={{ textAlign: 'center' }}
                    visible={this.state.curingModalvisible}
                    onOk={this.handleCancel.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px', marginBottom: 10
                            }}
                            size='large'
                            addonBefore='顺序码'
                            value={curingSXM}
                        />
                    </div>
                    {
                        curingTreeModalData && curingTreeModalData.length > 0
                            ? (
                                curingTreeModalData.map((curing, index) => {
                                    return (
                                        <Card title={`任务${index + 1}`} style={{marginBottom: 10}} key={curing.ID}>
                                            <Input
                                                readOnly
                                                style={{
                                                    marginTop: '10px'
                                                }}
                                                size='large'
                                                addonBefore='养护类型'
                                                value={curing.typeName}
                                            />
                                            <Input
                                                readOnly
                                                style={{
                                                    marginTop: '10px'
                                                }}
                                                size='large'
                                                addonBefore='起止时间'
                                                value={`${curing.StartTime} ~ ${curing.EndTime}`}
                                            />
                                            <Input
                                                readOnly
                                                style={{
                                                    marginTop: '10px'
                                                }}
                                                size='large'
                                                addonBefore='养护人员'
                                                value={curing.CuringMans}
                                                title={curing.CuringMans}
                                            />
                                            {curing.Pics && curing.Pics.length > 0
                                                ? curing.Pics.map(
                                                    src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width: '150px',
                                                                        height: '150px',
                                                                        display: 'block',
                                                                        marginTop: '10px'
                                                                    }}
                                                                    src={
                                                                        src
                                                                    }
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                )
                                                : ''}
                                        </Card>
                                    );
                                })
                            ) : ''
                    }
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
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            ystype,
            curingTypeSelect,
            treetypename,
            sgy,
            cly,
            jl
        } = this.state;
        let header = '';

        header = (
            <div>
                <Row className='forest-search-layout'>
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
                        <span className='forest-search-span'>小班：</span>
                        <Select
                            allowClear
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
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={thinclass}
                            onChange={this.onThinClassChange.bind(this)}
                        >
                            {thinclassoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>验收类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={ystype}
                            onChange={this.ysTypeChange.bind(this, 'yslx')}
                        >

                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={curingTypeSelect}
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
                        <span className='forest-search-span'>状态：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={ystype}
                            onChange={this.ysTypeChange.bind(this, 'zt')}
                        >

                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>施工员：</span>
                        <Input
                            value={sgy}
                            className='forest-forestcalcw4'
                            onChange={this.inputChange.bind(this, 'sgy')}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>测量员：</span>
                        <Input
                            value={cly}
                            className='forest-forestcalcw4'
                            onChange={this.inputChange.bind(this, 'cly')}
                        />
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>监理：</span>
                        <Input
                            value={jl}
                            className='forest-forestcalcw4'
                            onChange={this.inputChange.bind(this, 'jl')}
                        />
                    </div>
                </Row>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg20'>
                        <span className='forest-search-span6'>申请验收时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw6'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div>
                    <div className='forest-mrg20'>
                        <span className='forest-search-span6'>验收完成时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime2, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime2, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='forest-forestcalcw6'
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
                        <span>此次查询共有苗木：{this.state.totalNum}棵</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            style={{display: 'none'}}
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
                        locale={{ emptyText: '当天无养护信息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }

    ysTypeChange (type, value) {
        if (type === 'yslx') {
            this.setState({ ystype: value || '' });
        }else if (type === 'zt') {
            this.setState({ zt: value || '' });
        }
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

    inputChange(value,e) {
        debugger
        if (value === 'sgy') {
            this.setState({sgy: e.target.value})
        } else if (value === 'cly') {
            this.setState({cly: e.target.value})
        } else if (value === 'jl') {
            this.setState({jl: e.target.value})
        }
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
        this.setState({ curingTypeSelect: value || '', treetype: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
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

    handleCancel () {
        this.setState({ curingModalvisible: false });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = async (page) => {
        const {
            section = '',
            stime1 = '',
            etime1 = '',
            stime2 = '',
            etime2 = '',
            size,
            thinclass = '',
            curingTypeSelect = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '') {
            message.info('请选择项目，标段，小班及细班信息');
            return;
        }

        const {
            actions: { getCuringTreeInfo, getqueryTree },
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            sxm,
            section,
            stime1: stime1 && moment(stime1).format('YYYY-MM-DD HH:mm:ss'),
            etime1: etime1 && moment(etime1).format('YYYY-MM-DD HH:mm:ss'),
            stime2: stime2 && moment(stime2).format('YYYY-MM-DD HH:mm:ss'),
            etime2: etime2 && moment(etime2).format('YYYY-MM-DD HH:mm:ss'),
            curingtype: curingTypeSelect,
            thinclass: thinclassData,
            page,
            size: size
        };
        this.setState({ loading: true, percent: 0 });
        try {
            let rst = await getCuringTreeInfo({}, postdata);
            if (!rst) {
                this.setState({ loading: false, percent: 100 });
                return;
            };
            let curingTreeData = rst && rst.content;
            if (curingTreeData instanceof Array) {
                for (let i = 0; i < curingTreeData.length; i++) {
                    let curingTree = curingTreeData[i];
                    curingTree.order = (page - 1) * size + i + 1;
                    let data = await getqueryTree({}, {sxm: curingTree.SXM});
                    let treeMess = data && data.content && data.content[0];
                    curingTree.sectionName = getSectionNameBySection(curingTree.Section, thinClassTree);
                    curingTree.Project = getProjectNameBySection(curingTree.Section, thinClassTree);
                    curingTree.place = getSmallThinNameByPlaceData(treeMess.Section, treeMess.SmallClass, treeMess.ThinClass, thinClassTree);
                };
                let totalNum = rst.pageinfo.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({
                    loading: false,
                    percent: 100,
                    curingTreeData,
                    pagination: pagination,
                    totalNum: totalNum
                });
            }
        } catch (e) {

        }
    }
    handleCuringTreeModalOk = async (record) => {
        const {
            actions: {
                getCuringTreeInfo,
                getCuringMessage
            }
        } = this.props;
        const {
            curingTypes
        } = this.state;
        let SXM = record.SXM;
        let rst = await getCuringTreeInfo({}, {sxm: SXM});
        let curingTreeModalData = rst && rst.content;
        for (let i = 0; i < curingTreeModalData.length; i++) {
            let data = curingTreeModalData[i];
            curingTypes.map((type) => {
                if (data.CuringType === type.ID) {
                    data.typeName = type.Base_Name;
                }
            });
            let curingMess = await getCuringMessage({id: data.CuringID});
            data.Pics = curingMess.Pics ? this.handleImg(curingMess.Pics) : '';
            data.StartTime = curingMess.StartTime;
            data.EndTime = curingMess.EndTime;
            data.CuringMans = curingMess.CuringMans + ',' + curingMess.CuringMans + ',' + curingMess.CuringMans + ',' + curingMess.CuringMans + ',' + curingMess.CuringMans;
        }
        this.setState({
            curingTreeModalData,
            curingModalvisible: true,
            curingSXM: SXM
        });
    }

    handleImg = (data) => {
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
        return srcs;
    }
}

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
import { FOREST_API } from '../../../_platform/api';
import { getUser } from '_platform/auth';
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection,
    getSmallThinNameByPlaceData
} from '../auth';
const { RangePicker } = DatePicker;

export default class CuringTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            curingModalvisible: false,
            curingTreeData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
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
            thinclassData: ''
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order'
            },
            {
                title: '顺序码',
                dataIndex: 'SXM'
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
                title: '养护信息',
                render: (text, record) => {
                    return (
                        <a
                            onClick={this.handleCuringTreeModalOk.bind(
                                this, record)}
                        >
                            查看详情
                        </a>
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
        console.log('details', details);
        const {
            sectionoption,
            smallclassoption,
            thinclassoption,
            curingTypesOption
        } = this.props;
        const {
            sxm,
            section,
            smallclass,
            thinclass,
            curingTypeSelect
        } = this.state;
        const suffix1 = sxm ? (
            <Icon type='close-circle' onClick={this.emitEmpty1} />
        ) : null;
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
                        <span className='forest-search-span'>类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={curingTypeSelect}
                            onChange={this.onTypeChange.bind(this)}
                        >
                            {curingTypesOption}
                        </Select>
                    </div>
                    <div className='forest-mrg-datePicker'>
                        <span className='forest-search-span'>养护时间：</span>
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
        this.setState({
            curingTypeSelect: value || ''
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

    handleCancel () {
        this.setState({ curingModalvisible: false });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = async (page) => {
        const {
            sxm = '',
            section = '',
            stime = '',
            etime = '',
            size,
            thinclass = '',
            curingTypeSelect = '',
            thinclassData = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
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
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
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
            console.log('arr', arr);
            arr.map(rst => {
                let src = rst.replace(/\/\//g, '/');
                src = `${FOREST_API}/${src}`;
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    }
}

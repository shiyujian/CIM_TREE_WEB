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
import { getForestImgUrl, getUser } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
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
            thinclassData: '',
            curingMess: ''
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
        } catch (e) {
            console.log('getCuringTypes', e);
        }
    }
    render () {
        const { curingTreeData, curingMess, curingSXM } = this.state;
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
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='项目'
                            value={curingMess.Project}
                        />
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='标段'
                            value={curingMess.sectionName}
                        />
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='位置'
                            value={curingMess.place}
                        />

                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='养护类型'
                            value={curingMess.typeName}
                        />
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='起止时间'
                            value={`${curingMess.StartTime} ~ ${curingMess.EndTime}`}
                        />
                        <Input
                            readOnly
                            style={{
                                marginTop: '10px'
                            }}
                            size='large'
                            addonBefore='养护人员'
                            value={curingMess.CuringMans}
                            title={curingMess.CuringMans}
                        />
                        {curingMess.Pics && curingMess.Pics.length > 0
                            ? curingMess.Pics.map(
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
                    </div>
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
                    {/* <div className='forest-mrg10'>
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
                    </div> */}
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
                thinclassData = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
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
            if (!(rst && rst.content)) {
                this.setState({
                    loading: false,
                    percent: 100
                });
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
                getCuringMessage
            }
        } = this.props;
        const {
            curingTypes
        } = this.state;
        let curingMess = await getCuringMessage({id: record.CuringID});
        if (curingMess && curingMess.ID) {
            curingTypes.map((type) => {
                if (curingMess.CuringType === type.ID) {
                    curingMess.typeName = type.Base_Name;
                }
            });
            curingMess.Project = record.Project;
            curingMess.sectionName = record.sectionName;
            curingMess.place = record.place;
            curingMess.Pics = curingMess.Pics ? this.handleImg(curingMess.Pics) : '';
        } else {
            curingMess = '';
        }

        this.setState({
            curingMess,
            curingModalvisible: true,
            curingSXM: record.SXM
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

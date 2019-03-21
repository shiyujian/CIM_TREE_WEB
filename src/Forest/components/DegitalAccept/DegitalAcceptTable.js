import React, { Component } from 'react';
import {
    Modal,
    Table,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Input,
    Progress,
    message,
    Card,
    Divider
} from 'antd';
import moment from 'moment';
import WordView1 from './WordView1';
import WordView2 from './WordView2';
import WordView3 from './WordView3';
import WordView4 from './WordView4';
import WordView5 from './WordView5';
import WordView6 from './WordView6';
import WordView7 from './WordView7';
import WordView8 from './WordView8';
import WordView9 from './WordView9';
import WordView10 from './WordView10';
import WordView11 from './WordView11';
import Test from './Test';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection,
    getYsTypeByID,
    getStatusByID
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
            sgy: '', // 施工员
            cly: '', // 测量员
            jl: '', // 监理
            shigongOptions: [],
            jianliOptions: [],
            visible: false,
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            visible9: false,
            visible10: false,
            visible11: false,
            itemDetail: {}, // 数字化验收详情
            treetypeoption: [], // 根据小班动态获取的树种列表
            unQualifiedList: [], // 不合格记录列表
            key4: Math.random(),
            key5: Math.random(),
            key6: Math.random(),
            key7: Math.random(),
            key8: Math.random()
        };
        this.sscction = '',
        this.tinclass = '',
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
                dataIndex: 'smallclass'
            },
            {
                title: '细班',
                dataIndex: 'thinclass'
            },
            {
                title: '验收类型',
                dataIndex: 'ystype'
            },
            {
                title: '树种',
                dataIndex: 'treetype',
                render: () => {
                    return <span>暂无字段</span>;
                }
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '申请时间',
                render: (text, record) => {
                    const { ApplyTime = '' } = record;
                    return (
                        <div>
                            <div>{ApplyTime}</div>
                            {/* <div>{createtime2}</div> */}
                        </div>
                    );
                }
            },
            // {
            //     title: '定位时间',
            //     render: (text, record) => {
            //         const { createtime3 = '', createtime4 = '' } = record;
            //         return (
            //             <div>
            //                 <div>{createtime3}</div>
            //                 <div>{createtime4}</div>
            //             </div>
            //         );
            //     }
            // },
            {
                title: '操作',
                render: (text, record) => {
                    if (record.status === '未申请') {
                        return <span>暂无</span>;
                    }
                    return (
                        <div>
                            <a onClick={this.viewWord.bind(this, record)}>
                                查看
                            </a>
                            <Divider type='vertical' />
                            <a onClick={this.exportFile.bind(this, 'single', record)}>导出</a>
                        </div>
                    );
                }
            }
        ];
    }
    componentDidMount = async () => {
    }
    render () {
        const {
            curingTreeData,
            visible,
            visible1,
            visible2,
            visible3,
            visible4,
            visible5,
            visible6,
            visible7,
            visible8,
            visible9,
            visible10,
            visible11,
            itemDetail,
            unQualifiedList,
            key4,
            key5,
            key6,
            key7,
            key8
        } = this.state;
        return (
            <div>
                {this.treeTable(curingTreeData)}
                {
                    visible && <Test
                        visible={this.state.visible}
                        onPressOk ={this.pressOK.bind(this, 1)}
                        {...this.props} />
                }
                {
                    visible1 && <WordView1
                        onPressOk= {this.pressOK.bind(this, 1)}
                        visible ={visible1}
                        sscction ={this.sscction}
                        tinclass= {this.ThinClass}
                        detail= {itemDetail}
                        {...this.props}
                    />
                }
                {
                    visible2 && <WordView2
                        onPressOk= {this.pressOK.bind(this, 2)}
                        visible= {visible2}
                        sscction= {this.sscction}
                        tinclass ={this.ThinClass}
                        detail= {itemDetail}
                        {...this.props}
                    />
                }
                {
                    visible3 && <WordView3
                        onPressOk= {this.pressOK.bind(this, 3)}
                        visible= {visible3}
                        sscction ={this.sscction}
                        tinclass= {this.ThinClass}
                        detail= {itemDetail}
                        {...this.props}
                    />
                }
                {
                    visible4 && <WordView4
                        onPressOk= {this.pressOK.bind(this, 4)}
                        visible= {visible4}
                        keyy={key4}
                        unQualifiedList ={unQualifiedList}
                        detail ={itemDetail}
                    />
                }
                {
                    visible5 && <WordView5
                        onPressOk ={this.pressOK.bind(this, 5)}
                        visible ={visible5}
                        detail ={itemDetail}
                    />
                }
                {
                    visible6 && <WordView6
                        onPressOk= {this.pressOK.bind(this, 6)}
                        visible ={visible6}
                        detail= {itemDetail}
                    />
                }
                {
                    visible7 && <WordView7
                        onPressOk= {this.pressOK.bind(this, 7)}
                        visible= {visible7}
                        detail= {itemDetail}
                    />
                }
                {
                    visible8 && <WordView8
                        onPressOk= {this.pressOK.bind(this, 8)}
                        visible= {visible8}
                        detail ={itemDetail}
                    />
                }
                {
                    visible9 && <WordView9
                        onPressOk= {this.pressOK.bind(this, 9)}
                        visible ={visible9}
                        detail= {itemDetail}
                    />
                }
                {
                    visible10 && <WordView10
                        onPressOk ={this.pressOK.bind(this, 10)}
                        visible ={visible10}
                        detail ={itemDetail}
                    />
                }
                {
                    visible11 && <WordView11
                        onPressOk ={this.pressOK.bind(this, 11)}
                        visible= {visible11}
                        detail ={itemDetail}
                    />
                }
            </div>
        );
    }
    pressOK (which) {
        this.setState({visible: false});
        switch (which) {
            case 1:
                this.setState({ visible1: false });
                break;
            case 2:
                this.setState({ visible2: false });
                break;
            case 3:
                this.setState({ visible3: false });
                break;
            case 4:
                this.setState({ visible4: false });
                break;
            case 5:
                this.setState({ visible5: false });
                break;
            case 6:
                this.setState({ visible6: false });
                break;
            case 7:
                this.setState({ visible7: false });
                break;
            case 8:
                this.setState({ visible8: false });
                break;
            case 9:
                this.setState({ visible9: false });
                break;
            case 10:
                this.setState({ visible10: false });
                break;
            case 11:
                this.setState({ visible11: false });
                break;
            default:
                return '';
        }
    }
    treeTable (details) {
        const {
            sectionoption,
            smallclassoption,
            thinclassoption,
            typeoption,
            zttypeoption,
            ystypeoption
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            ystype,
            zt,
            curingTypeSelect,
            treetypename,
            sgy,
            cly,
            jl,
            shigongOptions,
            jianliOptions,
            treetypeoption
        } = this.state;
        let header = '';

        header = (
            <div>
                <Row className='forest-search-layout'>
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
                        <span className='forest-search-span'>验收类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={ystype}
                            onChange={this.ysTypeChange.bind(this, 'yslx')}
                        >
                            {ystypeoption}
                        </Select>
                    </div>
                    {/* <div className='forest-mrg10'>
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
                    </div> */}
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
                            value={zt}
                            onChange={this.ysTypeChange.bind(this, 'zt')}
                        >
                            {zttypeoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>施工员：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue=''
                            value={sgy}
                            onChange={this.ysTypeChange.bind(this, 'sgy')}
                        >
                            {shigongOptions}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>测量员：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue=''
                            value={cly}
                            onChange={this.ysTypeChange.bind(this, 'cly')}
                        >
                            {shigongOptions}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>监理：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={jl}
                            onChange={this.ysTypeChange.bind(this, 'jl')}
                        >
                            {jianliOptions}
                        </Select>
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
                    {/* <div className='forest-mrg20'>
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
                    </div> */}
                </Row>
                <Row style={{ marginTop: 10, marginBottom: 10 }}>
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
                    <Col span={16} className='forest-quryrstcnt'>
                        <span>此次查询共有苗木：{this.state.totalNum}棵</span>
                    </Col>
                    <Col span={2} >
                        <Button
                            type='primary'
                            onClick={this.exportFile.bind(this, 'mutiple')}
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
                        locale={{ emptyText: '暂无验收消息' }}
                        dataSource={details}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }

    ysTypeChange (type, value) { // 清空select会调用此函数
        if (type === 'yslx') {
            this.setState({ ystype: value || '' });
        } else if (type === 'zt') {
            this.setState({ zt: value || '' });
        } else if (type === 'sgy') {
            this.setState({ sgy: value || '' });
        } else if (type === 'cly') {
            this.setState({ cly: value || '' });
        } else if (type === 'jl') {
            this.setState({ jl: value || '' });
        }
    }

    async onSectionChange (value) {
        const {
            actions: {
                getDigitalAcceptUserList
            }
        } = this.props;
        if (!value) {
            return;
        }
        // only choose the section, you can search the people
        let shigong = await getDigitalAcceptUserList({}, { sections: value, grouptype: 1 });
        let jianli = await getDigitalAcceptUserList({}, { sections: value, grouptype: 2 });
        let shigongOptions = [];
        let jianliOptions = [];
        if (shigong instanceof Array) {
            shigong.map(item => {
                shigongOptions.push(<Option value={item.id}>{item.account.person_name}</Option>);
            });
        }
        if (jianli instanceof Array) {
            jianli.map(item => {
                jianliOptions.push(<Option value={item.id}>{item.account.person_name}</Option>);
            });
        }
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: '',
            shigongOptions,
            jianliOptions
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
        const {
            actions: {
                getTreetypeByThinclass
            },
            thinClassSelect
        } = this.props;
        const { section } = this.state;
        let array = value.split('-');
        let array1 = [];
        let treetypeoption = [];
        array.map((item, i) => {
            if (i !== 2) {
                array1.push(item);
            }
        });
        getTreetypeByThinclass({}, {
            section: section,
            thinclass: array1.join('-')
        }).then(rst => {
            if (rst && rst.content && rst.content instanceof Array) {
                rst.content.map(item => {
                    treetypeoption.push(<Option value={item.TreeType}>{item.TreeTypeObj.TreeTypeName}</Option>);
                });
            }
            this.setState({
                treetypeoption
            });
        });
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

    // onTypeChange(value) {
    //     const { typeselect } = this.props;
    //     typeselect(value || '');
    //     this.setState({ curingTypeSelect: value || '', treetype: '', treetypename: '' });
    // }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    datepick (value) {
        this.setState({
            stime1: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime1: value[1]
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

    exportFile (type, record) {
        this.setState({visible: true});
        if (type === 'single') { // 单个导出

        } else if (type === 'mutiple') {

        }
    }

    async viewWord (record) {
        const {
            actions: {
                getDigitalAcceptDetail,
                getMQulityCheckList, // 苗木质量不合格列表
                getTQulityCheckList, // 土球质量不合格列表
                getZZJQulityCheckList // 苗木 栽植/支架/浇水 不合格列表
            }
        } = this.props;
        const {
            stime1 = '',
            etime1 = '',
            treetypename = '' // 这个等待record返回
        } = this.state;
        let thinclass = record.ThinClass; // 要通过记录查找，因为可能不选这个条件
        let section = record.Section;
        let checktype = record.CheckType;
        const postdata = {
            acceptanceid: record.ID,
            status: record.Status, // 用当前条目的状态去查询
            stime: stime1,
            etime: etime1
        };
        let rst = await getDigitalAcceptDetail({}, postdata);
        if (!rst instanceof Array || rst.length === 0) {
            message.info('移动端详情尚未提交');
            return;
        }
        this.sscction = rst[0].Section,
        this.tinclass = rst[0].ThinClass,
        this.setState({
            itemDetail: rst[0]
        });
        let unQualifiedList = [];
        switch (checktype) {
            case 1:
                this.setState({ visible1: true });
                break;
            case 2:
                this.setState({ visible2: true });
                break;
            case 3:
                this.setState({ visible3: true });
                break;
            case 4:
                let postdata1 = {
                    section: section,
                    thinclass: thinclass,
                    treetype: rst[0].TreeType,
                    status: 0
                };
                let result1 = await getMQulityCheckList({}, postdata1);
                if (result1 && result1.content && result1.content instanceof Array) {
                    unQualifiedList = result1.content;
                }
                this.setState({ visible4: true, unQualifiedList, key4: Math.random() });
                break;
            case 5:
                let postdata2 = {
                    section: section,
                    thinclass: thinclass,
                    treetype: record.TreeType,
                    status: 0
                };
                let result2 = await getTQulityCheckList({}, postdata2);
                this.setState({ visible5: true, key5: Math.random() });
                break;
            case 6: // 栽植
                let postdata3 = {
                    section: section,
                    thinclass: thinclass,
                    treetype: record.TreeType,
                    status: 0,
                    problemtype: '栽植过深或过浅,栽植未踏实,土球未解除包装物'
                };
                let result3 = await getTQulityCheckList({}, postdata3);
                this.setState({ visible6: true, key6: Math.random() });
                break;
            case 7: // 支架
                let postdata4 = {
                    section: section,
                    thinclass: thinclass,
                    status: 0,
                    problemtype: '苗木支撑不牢固,苗木支撑不及时,苗木撑杆为非硬木'
                };
                let result4 = await getTQulityCheckList({}, postdata4);
                this.setState({ visible7: true, key7: Math.random() });
                break;
            case 8: // 浇水
                let postdata5 = {
                    section: section,
                    thinclass: thinclass,
                    status: 0,
                    problemtype: '土堰直径不满足要求,土堰深度不满足要求,首次浇水不及时、未浇透,浇水后未封穴或封穴不密实'
                };
                let result5 = await getTQulityCheckList({}, postdata5);
                this.setState({ visible8: true, key8: Math.random() });
                break;
            case 9:
                let postdata6 = {
                    section: section,
                    thinclass: thinclass,
                    treetype: record.TreeType
                };
                let result6 = await getTQulityCheckList({}, postdata6);
                this.setState({ visible9: true });
                break;
            case 10:
                this.setState({ visible10: true });
                break;
            case 11:
                this.setState({ visible11: true });
                break;
            default:
                return '';
        }
    }

    query = async (page) => {
        const {
            section = '',
            stime1 = '',
            etime1 = '',
            stime2 = '',
            etime2 = '',
            size,
            sgy = '',
            cly = '',
            jl = '',
            thinclass = '',
            curingTypeSelect = '',
            thinclassData = '',
            smallclassData = '',
            zt = '',
            ystype = '',
            treetypename = ''
        } = this.state;
        if (thinclass === '') {
            message.info('请选择项目，标段，小班及细班信息');
            return;
        }

        const {
            actions: { getDigitalAcceptList, getqueryTree },
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let array = thinclass.split('-');
        let array1 = [];
        array.map((item, i) => {
            if (i !== 2) {
                array1.push(item);
            }
        });
        let postdata = {
            section,
            treetype: treetypename,
            stime: stime1 && moment(stime1).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime1 && moment(etime1).format('YYYY-MM-DD HH:mm:ss'),
            // stime2: stime2 && moment(stime2).format('YYYY-MM-DD HH:mm:ss'),
            // etime2: etime2 && moment(etime2).format('YYYY-MM-DD HH:mm:ss'),
            thinclass: array1.join('-'),
            page,
            size: size,
            status: zt,
            checktype: ystype
        };
        this.setState({ loading: true, percent: 0 });
        try {
            let rst = await getDigitalAcceptList({}, postdata);
            if (!rst) {
                this.setState({ loading: false, percent: 100 });
                return;
            };
            let curingTreeData = rst && rst.content;
            if (curingTreeData instanceof Array) {
                let result = [];
                curingTreeData.map((curingTree, i) => {
                    curingTree.order = (page - 1) * size + i + 1;
                    curingTree.ystype = getYsTypeByID(curingTree.CheckType);
                    curingTree.status = getStatusByID(curingTree.Status);
                    curingTree.sectionName = getSectionNameBySection(curingTree.Section, thinClassTree);
                    curingTree.Project = getProjectNameBySection(curingTree.Section, thinClassTree);
                    curingTree.smallclass = `${smallclassData}号小班`;
                    curingTree.thinclass = `${thinclassData}号细班`;
                    result.push(curingTree);
                });
                let totalNum = rst.pageinfo.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                this.setState({
                    loading: false,
                    percent: 100,
                    curingTreeData: result,
                    pagination: pagination,
                    totalNum: totalNum
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

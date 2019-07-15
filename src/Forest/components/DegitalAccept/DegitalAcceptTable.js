import React, {
    Component
} from 'react';
import {
    Table,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Progress,
    message,
    Divider
} from 'antd';
import {
    FOREST_API
} from '_platform/api';
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
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getYsTypeByID,
    getStatusByID
} from './auth';
const {
    RangePicker
} = DatePicker;
const Option = Select.Option;

export default class DegitalAcceptTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            curingTreeData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            stime1: moment().format('YYYY-MM-DD 00:00:00'),
            etime1: moment().format('YYYY-MM-DD 23:59:59'),
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
            itemDetailList: {}, // 数字化验收详情
            treetypeoption: [], // 根据小班动态获取的树种列表
            unQualifiedList: [], // 不合格记录列表
            unitMessage: []
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
                    return <span > 暂无字段 </span>;
                }
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '施工员',
                dataIndex: 'constructerName'
            },
            {
                title: '测量员',
                dataIndex: 'surveyorName'
            },
            {
                title: '监理',
                dataIndex: 'supervisorName'
            },
            {
                title: '申请时间',
                render: (text, record) => {
                    const {
                        ApplyTime = ''
                    } = record;
                    return (
                        <div > {ApplyTime} </div>
                    );
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    if (record.status === '未申请' || record.status === '待验收') {
                        return <span > 暂无 </span>;
                    } else if (record.status === '完成') {
                        return (<div >
                            <a onClick={this.viewWord.bind(this, record)} >
                                查看
                            </a>
                            <Divider type='vertical' />
                            <a onClick={this.exportFile.bind(this, record)}>导出</a>
                        </div>
                        );
                    } else {
                        return (<div >
                            <a onClick={this.viewWord.bind(this, record)} >
                                查看
                            </a>
                        </div>);
                    }
                }
            }
        ];
    }
    // 获取各个标段对应的公司和项目经理
    componentDidMount = async () => {
        const {
            actions: {
                getUnitMessageBySection
            }
        } = this.props;
        let unitMessage = await getUnitMessageBySection();
        console.log('unitMessage', unitMessage);
        this.setState({
            unitMessage
        });
    }
    // 关闭详情弹窗
    pressOK (which) {
        switch (which) {
            case 1:
                this.setState({
                    visible1: false
                });
                break;
            case 2:
                this.setState({
                    visible2: false
                });
                break;
            case 3:
                this.setState({
                    visible3: false
                });
                break;
            case 4:
                this.setState({
                    visible4: false
                });
                break;
            case 5:
                this.setState({
                    visible5: false
                });
                break;
            case 6:
                this.setState({
                    visible6: false
                });
                break;
            case 7:
                this.setState({
                    visible7: false
                });
                break;
            case 8:
                this.setState({
                    visible8: false
                });
                break;
            case 9:
                this.setState({
                    visible9: false
                });
                break;
            case 10:
                this.setState({
                    visible10: false
                });
                break;
            case 11:
                this.setState({
                    visible11: false
                });
                break;
            default:
                return '';
        }
    }
    // 验收类型  状态 施工员 测量员 监理的选择
    ysTypeChange (type, value) { // 清空select会调用此函数
        if (type === 'yslx') {
            this.setState({
                ystype: value || ''
            });
        } else if (type === 'zt') {
            this.setState({
                zt: value || ''
            });
        } else if (type === 'sgy') {
            this.setState({
                sgy: value || ''
            });
        } else if (type === 'cly') {
            this.setState({
                cly: value || ''
            });
        } else if (type === 'jl') {
            this.setState({
                jl: value || ''
            });
        }
    }
    // 标段选择
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
        let shigong = await getDigitalAcceptUserList({}, {
            sections: value,
            grouptype: 1
        });
        let jianli = await getDigitalAcceptUserList({}, {
            sections: value,
            grouptype: 2
        });
        let shigongOptions = [];
        let jianliOptions = [];
        if (shigong instanceof Array) {
            shigong.map(item => {
                shigongOptions.push(<Option value={item.id} key={item.id} title={item.account.person_name}>
                    {item.account.person_name}
                </Option>);
            });
        }
        if (jianli instanceof Array) {
            jianli.map(item => {
                jianliOptions.push(<Option value={item.id} key={item.id} title={item.account.person_name}>
                    {item.account.person_name}
                </Option>);
            });
        }
        const {
            sectionSelect
        } = this.props;
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
    // 小班选择
    onSmallClassChange (value) {
        const {
            smallClassSelect
        } = this.props;
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
    // 细班选择
    onThinClassChange (value) {
        const {
            actions: {
                getTreetypeByThinclass
            },
            thinClassSelect
        } = this.props;
        const {
            section
        } = this.state;
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
                    treetypeoption.push(<Option value={
                        item.TreeType
                    } > {
                            item.TreeTypeObj.TreeTypeName
                        } </Option>);
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
    // 树种选择
    onTreeTypeChange (value) {
        this.setState({
            treetype: value,
            treetypename: value
        });
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
    resetinput () {
        const {
            resetinput,
            leftkeycode
        } = this.props;
        resetinput(leftkeycode);
    }
    // 查看详情
    viewWord = async (record) => {
        const {
            actions: {
                getDigitalAcceptDetail
            }
        } = this.props;
        const {
            stime1 = '',
            etime1 = ''
        } = this.state;
        let checktype = record.CheckType;
        const postdata = {
            acceptanceid: record.ID,
            status: record.Status, // 用当前条目的状态去查询
            stime: stime1,
            etime: etime1
        };
        let rst = await getDigitalAcceptDetail({}, postdata);
        if (!(rst instanceof Array) || rst.length === 0) {
            message.info('移动端详情尚未提交');
            return;
        }
        this.setState({
            itemDetailList: rst
        });
        switch (checktype) {
            case 1:
                this.setState({
                    visible1: true
                });
                break;
            case 2:
                this.setState({
                    visible2: true
                });
                break;
            case 3:
                this.setState({
                    visible3: true
                });
                break;
            case 4:
                this.setState({
                    visible4: true
                });
                break;
            case 5:
                this.setState({
                    visible5: true
                });
                break;
            case 6: // 栽植
                this.setState({
                    visible6: true
                });
                break;
            case 7: // 支架
                this.setState({
                    visible7: true
                });
                break;
            case 8: // 浇水
                this.setState({
                    visible8: true
                });
                break;
            case 9:
                this.setState({
                    visible9: true
                });
                break;
            case 10:
                this.setState({
                    visible10: true
                });
                break;
            case 11:
                this.setState({
                    visible11: true
                });
                break;
            default:
                return '';
        }
    }
    // 翻页
    handleTableChange (pagination) {
        const pager = {
            ...this.state.pagination
        };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 查询
    query = async (page) => {
        const {
            section = '',
            stime1 = '',
            etime1 = '',
            size,
            sgy = '',
            cly = '',
            jl = '',
            thinclass = '',
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
            actions: {
                getDigitalAcceptList
            },
            platform: {
                tree = {}
            }
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
            // section: 'P191-03-04',
            treetype: treetypename,
            stime: stime1 && moment(stime1).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime1 && moment(etime1).format('YYYY-MM-DD HH:mm:ss'),
            thinclass: array1.join('-'),
            // thinclass: 'P191-03-209-001',
            page,
            size: size,
            status: zt,
            checktype: ystype,
            supervisor: jl,
            surveyor: cly,
            constructer: sgy
        };
        this.setState({
            loading: true,
            percent: 0
        });
        try {
            let rst = await getDigitalAcceptList({}, postdata);
            if (!rst) {
                this.setState({
                    loading: false,
                    percent: 100
                });
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
                    curingTree.constructerName = (curingTree.ConstructerObj && curingTree.ConstructerObj.Full_Name) || '';
                    curingTree.surveyorName = (curingTree.SurveyorObj && curingTree.SurveyorObj.Full_Name) || '';
                    curingTree.supervisorName = (curingTree.SupervisorObj && curingTree.SupervisorObj.Full_Name) || '';
                    result.push(curingTree);
                });
                let totalNum = rst.pageinfo.total;
                const pagination = {
                    ...this.state.pagination
                };
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
    // 导出文件
    exportFile = async (record) => {
        const {
            actions: {
                getDigitalAcceptDetail,
                getExportAcceptReport
            }
        } = this.props;
        try {
            const {
                stime1 = '',
                etime1 = ''
            } = this.state;
            const postdata = {
                acceptanceid: record.ID,
                status: record.Status, // 用当前条目的状态去查询
                stime: stime1,
                etime: etime1
            };
            let detailList = await getDigitalAcceptDetail({}, postdata);
            if (detailList && detailList instanceof Array) {
                if (detailList.length > 0) {
                    console.log('detailList', detailList);
                    for (let i = 0; i < detailList.length; i++) {
                        let detail = detailList[i];
                        let downloadUrl = `${FOREST_API}/DocExport.ashx?action=acceptance&acceptancedetailid=${detail.ID}`;
                        await this.createLink(this, downloadUrl);
                    }
                } else {
                    message.info('移动端详情尚未提交,无法导出');
                    return;
                }
            } else {
                message.error('获取数据出错，请重新获取');
                return;
            }
        } catch (e) {
            console.log('single', e);
        }
    }
    createLink = async (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.download = name;
        link.href = url;
        await link.setAttribute('download', this);
        await link.setAttribute('target', '_blank');
        await document.body.appendChild(link);
        await link.click();
        await document.body.removeChild(link);
    };
    // 搜索栏
    treeTable (details) {
        const {
            sectionoption,
            smallclassoption,
            thinclassoption,
            zttypeoption,
            ystypeoption
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            ystype,
            zt,
            treetypename,
            sgy,
            cly,
            jl,
            shigongOptions,
            jianliOptions,
            treetypeoption
        } = this.state;
        let header = '';
        header = (<div >
            <Row className='forest-search-layout' >
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 标段： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={section}
                        onChange={
                            this.onSectionChange.bind(this)
                        } >
                        {sectionoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 小班： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={smallclass}
                        onChange={this.onSmallClassChange.bind(this)} >
                        {smallclassoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 细班： </span>
                    <Select
                        allowClear
                        showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={thinclass}
                        onChange={this.onThinClassChange.bind(this)} >
                        {thinclassoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 验收类型： </span>
                    <Select allowClear
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={ystype}
                        onChange={this.ysTypeChange.bind(this, 'yslx')} >
                        {ystypeoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 树种： </span>
                    <Select allowClear showSearch
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={treetypename}
                        onChange={this.onTreeTypeChange.bind(this)} >
                        {treetypeoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 状态： </span>
                    <Select allowClear className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={zt}
                        onChange={this.ysTypeChange.bind(this, 'zt')} >
                        {zttypeoption}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 施工员： </span>
                    <Select
                        allowClear
                        showSearch
                        className='forest-forestcalcw4'
                        defaultValue=''
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        value={sgy}
                        onChange={this.ysTypeChange.bind(this, 'sgy')} >
                        {shigongOptions}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 测量员： </span>
                    <Select
                        allowClear
                        showSearch
                        className='forest-forestcalcw4'
                        defaultValue=''
                        value={cly}
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.ysTypeChange.bind(this, 'cly')} >
                        {shigongOptions}
                    </Select>
                </div>
                <div className='forest-mrg10' >
                    <span className='forest-search-span' > 监理： </span>
                    <Select
                        allowClear
                        showSearch
                        className='forest-forestcalcw4'
                        defaultValue='全部'
                        value={jl}
                        filterOption={
                            (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.ysTypeChange.bind(this, 'jl')} >
                        {jianliOptions}
                    </Select>
                </div>
            </Row>
            <Row className='forest-search-layout' >
                <div className='forest-mrg20' >
                    <span className='forest-search-span6' > 申请验收时间： </span>
                    <RangePicker style={{verticalAlign: 'middle'}}
                        defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),
                            moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]}
                        className='forest-forestcalcw6'
                        showTime={{format: 'HH:mm:ss'}}
                        format={'YYYY/MM/DD HH:mm:ss'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    />
                </div>
            </Row>
            <Row style={{marginTop: 10, marginBottom: 10}} >
                <Col span={2} >
                    <Button type='primary'
                        onClick={this.handleTableChange.bind(this, {current: 1})} >
                        查询
                    </Button>
                </Col>
                <Col span={18} className='forest-quryrstcnt' >
                    <span > 此次查询共有苗木： {this.state.totalNum}棵 </span>
                </Col>
                <Col span={2} >
                    {/* {
                        <Button
                            type='primary'
                            onClick={this.exportFile.bind(this, 'mutiple')}
                        >
                            导出
                        </Button>
                    } */}
                </Col>
                <Col span={2} >
                    <Button type='primary' onClick={this.resetinput.bind(this)} >
                        重置
                    </Button>
                </Col>
            </Row>
        </div>
        );
        return (<div >
            <Row>
                {header}
            </Row>
            <Row>
                <Table bordered className='foresttable'
                    columns={this.columns}
                    rowKey='order'
                    loading={
                        {
                            tip: (<Progress style={{width: 200}}
                                percent={this.state.percent}
                                status='active'
                                strokeWidth={5}
                            />
                            ),
                            spinning: this.state.loading
                        }
                    }
                    locale={{emptyText: '暂无验收消息'}}
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
            curingTreeData,
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
            visible11
        } = this.state;
        return (
            <div>
                {
                    this.treeTable(curingTreeData)
                }
                {
                    visible1 && <WordView1
                        onPressOk={this.pressOK.bind(this, 1)}
                        visible={visible1}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible2 && <WordView2
                        onPressOk={this.pressOK.bind(this, 2)}
                        visible={visible2}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible3 && <WordView3
                        onPressOk={this.pressOK.bind(this, 3)}
                        visible={visible3}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible4 && <WordView4
                        onPressOk={this.pressOK.bind(this, 4)}
                        visible={visible4}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible5 && <WordView5
                        onPressOk={this.pressOK.bind(this, 5)}
                        visible={visible5}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible6 && <WordView6
                        onPressOk={this.pressOK.bind(this, 6)}
                        visible={visible6}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible7 && <WordView7
                        onPressOk={this.pressOK.bind(this, 7)}
                        visible={visible7}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible8 && <WordView8
                        onPressOk={this.pressOK.bind(this, 8)}
                        visible={visible8}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible9 && <WordView9
                        onPressOk={this.pressOK.bind(this, 9)}
                        visible={visible9}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible10 && <WordView10
                        onPressOk={this.pressOK.bind(this, 10)}
                        visible={visible10}
                        {...this.props}
                        {...this.state}
                    />
                }
                {
                    visible11 && <WordView11
                        onPressOk={this.pressOK.bind(this, 11)}
                        visible={visible11}
                        {...this.props}
                        {...this.state}
                    />
                } </div>
        );
    }
}

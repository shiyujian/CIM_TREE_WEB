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
import { FOREST_API, PROJECT_UNITS } from '../../../_platform/api';
import { getUser } from '_platform/auth';
import '../index.less';
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
            leftkeycode: '',
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
            curingSXM: ''
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
                            value={curingTypeSelect}
                            onChange={this.ontypechange.bind(this)}
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
                            onClick={this.exportexcel.bind(this)}
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

    sxmchange (value) {
        this.setState({ sxm: value.target.value });
    }

    onsectionchange (value) {
        const { sectionselect } = this.props;
        sectionselect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: ''
        });
    }

    onsmallclasschange (value) {
        const { smallclassselect } = this.props;
        const { section, leftkeycode } = this.state;
        smallclassselect(value || leftkeycode, section);
        this.setState({
            smallclass: value || '',
            thinclass: ''
        });
    }

    onthinclasschange (value) {
        const { thinclassselect } = this.props;
        const { section, smallclass } = this.state;
        thinclassselect(value || smallclass, section);
        this.setState({
            thinclass: value || ''
        });
    }

    ontypechange (value) {
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
        this.qury(pagination.current);
    }

    handleCancel () {
        this.setState({ curingModalvisible: false });
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

    qury = async (page) => {
        const {
            sxm = '',
            section = '',
            stime = '',
            etime = '',
            size,
            thinclass = '',
            curingTypeSelect = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }

        const {
            actions: { getCuringTreeInfo, getqueryTree }
        } = this.props;
        let postdata = {
            sxm,
            section,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            curingtype: curingTypeSelect,
            thinclass,
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
                    let place = '';
                    if (treeMess.Section.indexOf('P010') !== -1) {
                        place = this.getThinClassName(treeMess.No, treeMess.Section);
                    } else {
                        place = `${treeMess.SmallClass}号小班${
                            treeMess.ThinClass
                        }号细班`;
                    }
                    curingTree.place = place;
                    curingTree.Project = this.getProject(treeMess.Section);
                };
                let totalNum = rst.pageinfo.total;
                const pagination = { ...this.state.pagination };
                pagination.total = rst.pageinfo.total;
                pagination.pageSize = size;
                console.log('totalNum', totalNum);
                console.log('pagination', pagination);
                console.log('curingTreeData', curingTreeData);

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
            stime = '',
            etime = '',
            exportsize,
            thinclass = '',
            smallclass = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: { getexportTree }
        } = this.props;
        let postdata = {
            sxm,
            section,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page: 1,
            size: exportsize,
            thinclass,
            smallclass
        };
        this.setState({ loading: true, percent: 0 });
        getexportTree({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                window.open(`${FOREST_API}/${rst3}`);
            }
            this.setState({ loading: false });
        });
    }
}

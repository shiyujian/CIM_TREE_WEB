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
import { getForestImgUrl, getUserIsManager } from '_platform/auth';
import '../index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;

export default class VolunteerTreeTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            sxm: '',
            section: '',
            bigType: '',
            treetype: '',
            smallclass: '',
            thinclass: '',
            treetypename: '',
            creater: '',
            cardNo: '',
            percent: 0,
            messageTotalNum: '',
            imgArr: [],
            smallclassData: '',
            thinclassData: '',
            postData: '',
            userOptions: []
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
                title: '证书编号',
                dataIndex: 'No'
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
                title: '树种',
                dataIndex: 'TreeTypeObj.TreeTypeName'
            },
            {
                title: '植树人',
                dataIndex: 'Full_Name'
            },
            {
                title: '录入时间',
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
                title: '植树照片',
                dataIndex: 'Photo',
                render: (text, record) => {
                    if (text) {
                        return <a onClick={this.onImgClick.bind(this, text)}>查看</a>;
                    } else {
                        return '/';
                    }
                }
            }
        ];
    }
    componentDidMount () {
    }

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
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    onTreeTypeChange (value) {
        this.setState({ treetype: value, treetypename: value });
    }

    handleCardNoChange (e) {
        this.setState({
            cardNo: e.target.value
        });
    }

    handleFullNameChange (e) {
        console.log('e', e);
        this.setState({
            creater: e.target.value
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

    handleCancel () {
        this.setState({ imgvisible: false });
    }
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
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
            creater = '',
            stime = '',
            etime = '',
            size,
            thinclass = '',
            cardNo = ''
        } = this.state;
        if (thinclass === '' && sxm === '') {
            message.info('请选择项目，标段，小班及细班信息或输入顺序码');
            return;
        }
        const {
            actions: {
                getVolunteerTrees
            },
            platform: { tree = {} }
        } = this.props;
        let no = '';
        if (thinclass) {
            let arr = thinclass.split('-');
            no = arr[0] + '-' + arr[1] + '-' + arr[3] + '-' + arr[4];
        }
        console.log('no', no);

        let thinClassTree = tree.thinClassTree;
        let postData = {
            no: no,
            sxm,
            section,
            treetype,
            cno: cardNo,
            fullname: creater,
            stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            page,
            size: size
        };

        this.setState({
            loading: true,
            percent: 0
        });
        let rst = await getVolunteerTrees({}, postData);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.content;
        if (tblData instanceof Array) {
            for (let i = 0; i < tblData.length; i++) {
                let plan = tblData[i];
                plan.order = (page - 1) * size + i + 1;
                plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
                plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
                plan.place = getSmallThinNameByPlaceData(plan.Section, plan.SmallClass, plan.ThinClass, thinClassTree);
                let statusname = '';

                plan.statusname = statusname;
                let createtime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                let createtime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                plan.createtime1 = createtime1;
                plan.createtime2 = createtime2;
            }

            let messageTotalNum = rst.pageinfo.total;
            const pagination = { ...this.state.pagination };
            pagination.total = rst.pageinfo.total;
            pagination.pageSize = size;

            this.setState({
                tblData,
                pagination: pagination,
                messageTotalNum: messageTotalNum,
                postData,
                loading: false,
                percent: 100
            });
        }
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
    render () {
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
            tblData,
            sxm,
            creater,
            section,
            smallclass,
            thinclass,
            bigType,
            treetypename,
            userOptions = [],
            cardNo
        } = this.state;
        return (
            <div>
                <Row>
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
                            <div className='forest-mrg10'>
                                <span className='forest-search-span'>证书编号：</span>
                                <Input
                                    value={cardNo}
                                    className='forest-forestcalcw4'
                                    onChange={this.handleCardNoChange.bind(this)}
                                />
                            </div>
                            <div className='forest-mrg10'>
                                <span className='forest-search-span'>植树人姓名：</span>
                                <Input
                                    value={creater}
                                    className='forest-forestcalcw4'
                                    onChange={this.handleFullNameChange.bind(this)}
                                />
                            </div>
                            <div className='forest-mrg-datePicker'>
                                <span className='forest-search-span'>录入时间：</span>
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
                            <Col span={2} />
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
                </Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={this.columns}
                        rowKey='ZZBM'
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
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
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

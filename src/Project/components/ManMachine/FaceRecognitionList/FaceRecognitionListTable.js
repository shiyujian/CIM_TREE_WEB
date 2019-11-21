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
    Notification
} from 'antd';
import moment from 'moment';
import '../index.less';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getForestImgUrl
} from '_platform/auth';
import FaceRecognitionPersonListModal from './FaceRecognitionPersonListModal';
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class FaceRecognitionListTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            loading: false,
            size: 10,
            exportsize: 100,
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            section: '',
            status: '',
            percent: 0,
            keyword: '',
            picViewVisible: false,
            imgSrcs: [],
            viewVisible: false,
            faceDetail: ''
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '项目',
            dataIndex: 'Project',
            key: 'Project'
        },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName'
        },
        {
            title: '设备SN',
            dataIndex: 'SN',
            key: 'SN'
        },
        {
            title: '进出口',
            dataIndex: 'In',
            key: 'In',
            render: (text, record) => {
                switch (text) {
                    case 0:
                        return '出';
                    case 1:
                        return '进';
                }
            }
        },
        {
            title: '状态',
            dataIndex: 'Status',
            key: 'Status',
            render: (text, record) => {
                switch (text) {
                    case 0:
                        return '离线';
                    case 1:
                        return '在线';
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime'
        },
        {
            title: '更新时间',
            dataIndex: 'UpdateTime',
            key: 'UpdateTime'
        },
        // {
        //     title: '照片',
        //     dataIndex: 'Images',
        //     render: (text, record, index) => {
        //         if (record && record.Images) {
        //             return <a
        //                 onClick={this.handlePicView.bind(this, record.Images)}>
        //                     查看
        //             </a>;
        //         } else {
        //             return '/';
        //         }
        //     }
        // },
        // {
        //     title: '登记人',
        //     dataIndex: 'InputerName',
        //     render: (text, record) => {
        //         if (record.InputerUserName && record.InputerName) {
        //             return <p>{record.InputerName + '(' + record.InputerUserName + ')'}</p>;
        //         } else if (record.InputerName && !record.InputerUserName) {
        //             return <p>{record.InputerName}</p>;
        //         } else {
        //             return <p> / </p>;
        //         }
        //     }
        // }
        {
            title: '操作',
            render: (record, index) => {
                return (
                    <div>
                        <a
                            type='primary'
                            onClick={this.handleViewDetail.bind(this, record)}
                        >
                            查看
                        </a>
                    </div>
                );
            }
        }
    ]
    componentDidMount () {
    }

    keywordChange (value) {
        this.setState({
            keyword: value.target.value
        });
    }
    onSectionChange (value) {
        this.setState({
            section: value || ''
        });
    }

    onTypeChange (value) {
        this.setState({
            status: value
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

    handleViewDetail = async (record) => {
        this.setState({
            faceDetail: record,
            viewVisible: true
        });
    }
    handleViewPersonListCancel () {
        this.setState({
            faceDetail: '',
            viewVisible: false
        });
    }

    // 查看图片
    handlePicView = (data) => {
        let imgSrcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                imgSrcs.push(src);
            });
            this.setState({
                imgSrcs,
                picViewVisible: true
            });
        } catch (e) {
            console.log('处理图片', e);
        }
    }
    // 关闭查看图片Modal
    handlePicCancel = () => {
        this.setState({
            imgSrcs: [],
            picViewVisible: false
        });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query = async (page) => {
        const {
            section = '',
            status = '',
            stime = '',
            etime = '',
            size,
            keyword = ''
        } = this.state;
        const {
            platform: { tree = {} },
            leftkeycode,
            actions: {
                getFaceRecognitionList,
                getUserDetail
            }
        } = this.props;
        if (section === '' && keyword === '') {
            Notification.warning({
                message: '请选择标段或输入设备SN'
            });
            return;
        }
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            sn: keyword,
            section: section,
            status
            // stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            // etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
            // page,
            // size
        };
        this.setState({ loading: true, percent: 0 });
        let tblData = await getFaceRecognitionList({}, postdata);
        if (!(tblData && tblData instanceof Array)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let userIDList = [];
        let userDataList = {};
        for (let i = 0; i < tblData.length; i++) {
            let plan = tblData[i];
            plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
            plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
            let userData = '';
            if (plan.Inputer) {
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
        }
        this.setState({
            tblData,
            loading: false,
            percent: 100
        });
    }
    treeTable (details) {
        const {
            sectionOption,
            machineTypeOption
        } = this.props;
        const {
            section,
            status,
            keyword
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>设备SN：</span>
                        <Input
                            value={keyword}
                            className='ManMachine-forestcalcw4'
                            onChange={this.keywordChange.bind(this)}
                        />
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>标段：</span>
                        <Select
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            className='ManMachine-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onSectionChange.bind(this)}
                        >
                            {sectionOption}
                        </Select>
                    </div>
                    <div className='ManMachine-mrg10'>
                        <span className='ManMachine-search-span'>状态：</span>
                        <Select
                            allowClear
                            className='ManMachine-forestcalcw4'
                            value={status}
                            onChange={this.onTypeChange.bind(this)}
                        >
                            <Option key={'离线'} value={0} title={'离线'}>
                                离线
                            </Option>
                            <Option key={'在线'} value={1} title={'在线'}>
                                在线
                            </Option>
                        </Select>
                    </div>
                    {/* <div className='ManMachine-mrg-datePicker'>
                        <span className='ManMachine-search-span'>进离场时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='ManMachine-forestcalcw4'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
                        />
                    </div> */}
                </Row>
                <Row>
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.query.bind(this)}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20} className='ManMachine-quryrstcnt'>
                        <span />
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
                        columns={this.columns}
                        rowKey='ID'
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
                        locale={{ emptyText: '当前无人脸识别列表信息' }}
                        dataSource={details}
                    />
                </Row>
            </div>
        );
    }
    render () {
        const {
            tblData,
            imgSrcs = [],
            picViewVisible,
            viewVisible
        } = this.state;
        return (
            <div>
                {this.treeTable(tblData)}
                {
                    picViewVisible
                        ? (<Modal
                            width={522}
                            title='图片详情'
                            style={{ textAlign: 'center' }}
                            visible
                            onOk={this.handlePicCancel.bind(this)}
                            onCancel={this.handlePicCancel.bind(this)}
                            footer={null}
                        >
                            {
                                imgSrcs.map((img) => {
                                    return (
                                        <img style={{ width: '490px' }} src={img} alt='图片' />
                                    );
                                })
                            }
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this.handlePicCancel.bind(this)}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                        关闭
                                </Button>
                            </Row>
                        </Modal>)
                        : ''
                }
                {
                    viewVisible
                        ? <FaceRecognitionPersonListModal
                            {...this.props}
                            {...this.state}
                            handleViewPersonListCancel={this.handleViewPersonListCancel.bind(this)}
                        />
                        : ''
                }
            </div>
        );
    }
}

import React, { Component } from 'react';
import {
    Icon,
    Table,
    Modal,
    Row,
    Col,
    Select,
    Button,
    DatePicker,
    Progress,
    Divider,
    Notification
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class ManEntranceAndDepartureTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            section: '',
            faceRecognitionSnOption: [],
            faceRecognitionSn: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            percent: 0,
            picViewVisible: false,
            imgSrcs: [],
            recordDetail: '',
            viewPersonEntrysVisible: false,
            viewPersonEntrysRecord: ''
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '姓名',
            dataIndex: 'Name'
        },
        {
            title: '设备SN',
            dataIndex: 'DeviceSN'
        },
        {
            title: '识别时间',
            dataIndex: 'Recog_Time',
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
            title: '识别照片',
            dataIndex: 'Photo',
            render: (text, record, index) => {
                if (record && record.Photo) {
                    return <a
                        onClick={this.handlePicView.bind(this, record.Photo)}>
                            查看
                    </a>;
                } else {
                    return '/';
                }
            }
        }
        // {
        //     title: '登记人',
        //     dataIndex: 'InputerName',
        //     render: (text, record, index) => {
        //         if (record.InputerUserName && record.InputerName) {
        //             return <sapn>{record.InputerName + '(' + record.InputerUserName + ')'}</sapn>;
        //         } else if (record.InputerName && !record.InputerUserName) {
        //             return <sapn>{record.InputerName}</sapn>;
        //         } else {
        //             return <sapn> / </sapn>;
        //         }
        //     }
        // },
        // {
        //     title: '在场状态',
        //     dataIndex: 'InStatus',
        //     render: (text, record, index) => {
        //         if (text === 1) {
        //             return <sapn>在场</sapn>;
        //         } else if (text === 0) {
        //             return <sapn>离场</sapn>;
        //         } else if (text === -1) {
        //             return <sapn>仅登记</sapn>;
        //         } else {
        //             return <sapn>/</sapn>;
        //         }
        //     }
        // }

    ];
    componentDidMount () {
        // this.query();
    }
    // 标段选择同时更新SN
    onSectionChange (value) {
        this.setState({
            section: value || '',
            faceRecognitionSn: '',
            faceRecognitionSnOption: []
        }, async () => {
            this.handleFaceRecognitionSnChange();
        });
    }
    // 获取本标段的人脸识别设备SN
    handleFaceRecognitionSnChange = async () => {
        const {
            actions: {
                getFaceDevices
            }
        } = this.props;
        const {
            section
        } = this.state;
        try {
            let faceRecognitionSnOption = [];
            let faceDeviceList = await getFaceDevices({}, {section: section});
            console.log('faceDeviceList', faceDeviceList);
            if (faceDeviceList && faceDeviceList instanceof Array) {
                faceDeviceList.map((faceDevice) => {
                    faceRecognitionSnOption.push(
                        <Option key={faceDevice.ID} value={faceDevice.SN} title={faceDevice.SN}>
                            {faceDevice.SN}
                        </Option>
                    );
                });
            }
            this.setState({
                faceRecognitionSnOption
            });
        } catch (e) {
            console.log('handleFaceRecognitionSnChange', e);
        }
    }
    onfaceRecognitionSnChange (value) {
        this.setState({
            faceRecognitionSn: value || ''
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
    // 换页
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 重置
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }
    // 搜索
    query = async (page) => {
        const {
            section = '',
            faceRecognitionSn = '',
            stime,
            etime
        } = this.state;
        const {
            leftkeycode,
            actions: {
                getFaceRecords,
                getUserDetail
            }
        } = this.props;
        if (!leftkeycode) {
            Notification.warning({
                message: '请选择项目'
            });
            return;
        }
        if (!(section && faceRecognitionSn)) {
            Notification.warning({
                message: '请选择标段和设备SN'
            });
            return;
        }
        let postdata = {
            sn: faceRecognitionSn,
            stime,
            etime,
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getFaceRecords({}, postdata);
        console.log('rst', rst);
        if (!(rst && rst.content)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let contentData = rst.content;

        // 获取填报人唯一性数组
        let userIDList = [];
        let userDataList = [];
        for (let i = 0; i < contentData.length; i++) {
            let plan = contentData[i];
            plan.order = (page - 1) * 10 + i + 1;
            plan.liftertime1 = plan.Recog_Time
                ? moment(plan.Recog_Time).format('YYYY-MM-DD')
                : '/';
            plan.liftertime2 = plan.Recog_Time
                ? moment(plan.Recog_Time).format('HH:mm:ss')
                : '/';
            // 获取上报人
            if (plan.Creater) {
                let userData = '';
                if (userIDList.indexOf(Number(plan.Creater)) === -1) {
                    userData = await getUserDetail({id: plan.Creater});
                } else {
                    userData = userDataList[Number(plan.Creater)];
                }
                if (userData && userData.ID) {
                    userIDList.push(userData.ID);
                    userDataList[userData.ID] = userData;
                }
                plan.InputerName = (userData && userData.Full_Name) || '';
                plan.InputerUserName = (userData && userData.User_Name) || '';
            }
        }
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData: contentData,
            pagination,
            loading: false,
            percent: 100
        });
    }
    // 查看图片
    handlePicView = (data) => {
        try {
            let imgSrcs = [];
            imgSrcs.push(decodeURIComponent(data));
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
    treeTable (details) {
        const {
            sectionOption
        } = this.props;
        const {
            section,
            faceRecognitionSn,
            faceRecognitionSnOption,
            stime,
            etime
        } = this.state;
        let header = '';
        header = (
            <div>
                <Row className='ManMachine-search-layout'>
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
                        <span className='ManMachine-search-span'>设备Sn：</span>
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
                            value={faceRecognitionSn}
                            onChange={this.onfaceRecognitionSnChange.bind(this)}
                        >
                            {faceRecognitionSnOption}
                        </Select>
                    </div>
                    <div className='ManMachine-mrg-datePicker'>
                        <span className='ManMachine-search-span'>识别时间：</span>
                        <RangePicker
                            style={{ verticalAlign: 'middle' }}
                            defaultValue={[
                                moment(stime, 'YYYY-MM-DD HH:mm:ss'),
                                moment(etime, 'YYYY-MM-DD HH:mm:ss')
                            ]}
                            className='ManMachine-forestcalcw4'
                            showTime={{ format: 'HH:mm:ss' }}
                            format={'YYYY/MM/DD HH:mm:ss'}
                            onChange={this.datepick.bind(this)}
                            onOk={this.datepick.bind(this)}
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
                    <Col span={20} className='ManMachine-quryrstcnt' />
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
                {header}
            </div>
        );
    }
    render () {
        const {
            tblData = [],
            percent,
            loading,
            picViewVisible,
            imgSrcs
        } = this.state;
        console.log('tblData', tblData);
        return (
            <div>
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
                {this.treeTable(tblData)}
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
                                    percent={percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: loading
                        }}
                        locale={{ emptyText: '当前无人脸识别记录' }}
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                </Row>
            </div>
        );
    }
}

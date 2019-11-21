import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button,
    Progress
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    getForestImgUrl
} from '_platform/auth';
import '../index.less';

export default class MachineEntranceModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            percent: 0,
            imgSrcs: [],
            picViewVisible: false
        };
    }
    columns = [
        {
            title: '序列号',
            dataIndex: 'indexNum',
            key: 'indexNum'
        },
        {
            title: '设备类型',
            dataIndex: 'DeviceType',
            key: 'DeviceType'
        },
        {
            title: '设备照片',
            dataIndex: 'Images',
            render: (text, record, index) => {
                if (record && record.Images) {
                    return <a
                        onClick={this.handlePicView.bind(this, record.Images)}>
                            查看
                    </a>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '司机姓名',
            dataIndex: 'Contacter',
            key: 'Contacter'
        },
        {
            title: '司机电话',
            dataIndex: 'Phone',
            key: 'Phone'
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime'
        },
        {
            title: '进场时间',
            dataIndex: 'EnterTime',
            key: 'EnterTime'
        },
        {
            title: '离场时间',
            dataIndex: 'LeaveTime',
            key: 'LeaveTime'
        }
    ]
    componentDidMount () {
        this.query(1);
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
    // 搜索
    query = async (page) => {
        const {
            viewDetailRecord,
            actions: {
                getDeviceWorks
            }
        } = this.props;
        let locationDeviceId = '';
        let locationDeviceIDArr = [];
        if (viewDetailRecord.LocationDeviceID) {
            locationDeviceIDArr = viewDetailRecord.LocationDeviceID.split('-');
            if (locationDeviceIDArr && locationDeviceIDArr instanceof Array && locationDeviceIDArr.length === 3) {
                locationDeviceId = locationDeviceIDArr[1];
            }
        } else {
            return;
        }
        let postdata = {
            locationdeviceid: viewDetailRecord.LocationDeviceID,
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getDeviceWorks({}, postdata);
        console.log('rst', rst);
        if (!(rst && rst.content && rst.content.length > 0)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.content;
        for (let i = 0; i < tblData.length; i++) {
            let plan = tblData[i];
            plan.order = (page - 1) * 10 + i + 1;
            plan.indexNum = locationDeviceIDArr[2];
        }
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        this.setState({
            tblData,
            pagination,
            loading: false,
            percent: 100
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
    handleViewDetailCancel = () => {
        this.props.handleViewDetailCancel();
    }
    render () {
        const {
            tblData = [],
            percent,
            loading,
            picViewVisible,
            imgSrcs
        } = this.state;
        return (
            <div>
                <Modal
                    width={800}
                    title='机械进离场详情'
                    style={{ textAlign: 'center' }}
                    visible
                    onOk={this.handleViewDetailCancel.bind(this)}
                    onCancel={this.handleViewDetailCancel.bind(this)}
                    footer={null}
                >
                    <div>
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
                            locale={{ emptyText: '当前无进离场信息' }}
                            dataSource={tblData}
                            onChange={this.handleTableChange.bind(this)}
                            pagination={this.state.pagination}
                        />

                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.handleViewDetailCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                        关闭
                            </Button>
                        </Row>
                    </div>

                </Modal>
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
                            <div>
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
                            </div>
                        </Modal>)
                        : ''
                }
            </div>
        );
    }
}

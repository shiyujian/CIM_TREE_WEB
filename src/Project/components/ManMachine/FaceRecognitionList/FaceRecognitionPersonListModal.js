import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button,
    Progress,
    Notification,
    Spin
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../index.less';

export default class FaceRecognitionPersonListModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            percent: 0,
            recordDetail: ''
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
            title: '性别',
            dataIndex: 'Gender'
        },
        {
            title: '身份证号',
            dataIndex: 'ID_Card'
        },
        {
            title: '在场状态',
            dataIndex: 'InStatus',
            render: (text, record, index) => {
                if (text === 1) {
                    return <sapn>在场</sapn>;
                } else if (text === 0) {
                    return <sapn>离场</sapn>;
                } else if (text === -1) {
                    return <sapn>仅登记</sapn>;
                } else {
                    return <sapn>/</sapn>;
                }
            }
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '人脸识别机状态',
            dataIndex: 'SendStatus',
            render: (text, record, index) => {
                if (text === 1) {
                    return <sapn>发送成功</sapn>;
                } else {
                    return <sapn>发送失败</sapn>;
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'ID',
            render: (text, record, index) => {
                if (record.SendStatus === 1) {
                    return <sapn>/</sapn>;
                } else {
                    return <a onClick={this.handleReSendMan.bind(this, record)}>重新下发</a>;
                }
            }
        }
    ];
    componentDidMount () {
        this.query(1);
    }
    // 对于下发人脸识别机失败的用户重新下发
    handleReSendMan = async (record) => {
        const {
            actions: {
                postReSendManToFaceDevice
            }
        } = this.props;
        let postData = {
            id: record.ID
        };
        this.setState({
            loading: true
        });
        let data = await postReSendManToFaceDevice(postData);
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            // Notification.success({
            //     message: '成功'
            // });
            this.query(1);
        } else {
            Notification.error({
                message: '重新下发失败'
            });
            this.setState({
                loading: false
            });
        }
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
            faceDetail,
            actions: {
                getFaceworkmans
            }
        } = this.props;
        let postdata = {
            page,
            size: 10
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getFaceworkmans({sn: faceDetail.SN}, postdata);
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
            // 班组
            let groupName = '';
            if (plan.Group && plan.Group.Name) {
                groupName = plan.Group.Name;
            }
            plan.workGroupName = groupName;
            plan.liftertime1 = plan.CreateTime
                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                : '/';
            plan.liftertime2 = plan.CreateTime
                ? moment(plan.CreateTime).format('HH:mm:ss')
                : '/';
        }
        const pagination = { ...this.state.pagination };
        pagination.total = (rst.pageinfo && rst.pageinfo.total) || 0;
        pagination.pageSize = 10;
        pagination.current = page;
        this.setState({
            tblData,
            pagination,
            loading: false,
            percent: 100
        });
    }
    handleViewPersonListCancel = () => {
        this.props.handleViewPersonListCancel();
    }
    render () {
        const {
            tblData = [],
            percent,
            loading
        } = this.state;
        return (
            <Modal
                width={800}
                title='人脸识别人员列表'
                style={{ textAlign: 'center' }}
                visible
                onOk={this.handleViewPersonListCancel.bind(this)}
                onCancel={this.handleViewPersonListCancel.bind(this)}
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
                        locale={{ emptyText: '当前无人员信息' }}
                        dataSource={tblData}
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleViewPersonListCancel.bind(this)}
                            style={{ float: 'right' }}
                            type='primary'
                        >
                                        关闭
                        </Button>
                    </Row>
                </div>

            </Modal>
        );
    }
}

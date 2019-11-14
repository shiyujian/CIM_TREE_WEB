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
import '../index.less';

export default class LocationDeviceDetailModal extends Component {
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
            dataIndex: 'Name',
            render: (text, record, index) => {
                if (record && record.WorkMan && record.WorkMan.Name) {
                    return <span>{record.WorkMan.Name}</span>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '性别',
            dataIndex: 'Gender',
            render: (text, record, index) => {
                if (record && record.WorkMan && record.WorkMan.Gender) {
                    return <span>{record.WorkMan.Gender}</span>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '身份证号',
            dataIndex: 'ID_Card',
            render: (text, record, index) => {
                if (record && record.WorkMan && record.WorkMan.ID_Card) {
                    return <span>{record.WorkMan.ID_Card}</span>;
                } else {
                    return '/';
                }
            }
        },
        {
            title: '工种',
            dataIndex: 'WorkTypeName'
        },
        {
            title: '班组',
            dataIndex: 'workGroupName'
        },
        {
            title: '在场状态',
            dataIndex: 'Status',
            render: (text, record, index) => {
                if (text || text === 0) {
                    if (text === 0) {
                        return <sapn>进场</sapn>;
                    } else if (text === 1) {
                        return <sapn>离场</sapn>;
                    }
                } else {
                    return <sapn> / </sapn>;
                }
            }
        },
        {
            title: '进场时间',
            dataIndex: 'EnterTime'
        },
        {
            title: '离场时间',
            dataIndex: 'LeaveTime'
        }
    ];
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
            companyList,
            leftkeycode,
            workTypesList,
            handleLocationDeviceDetail,
            actions: {
                getLocationDeviceDetail,
                getOrgDetail
            }
        } = this.props;
        let postdata = {
            carNo: handleLocationDeviceDetail.CarNo
        };
        this.setState({ loading: true, percent: 0 });
        let rst = await getLocationDeviceDetail(postdata);
        console.log('rst', rst);
        if (!(rst && rst.Historys && rst.Historys.length > 0)) {
            this.setState({
                loading: false,
                percent: 100
            });
            return;
        }
        let tblData = rst.Historys;
        for (let i = 0; i < tblData.length; i++) {
            let plan = tblData[i];
            plan.order = (page - 1) * 10 + i + 1;
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
        this.setState({
            tblData,
            pagination,
            loading: false,
            percent: 100
        });
    }
    handleLocationDeviceDetailCancel = () => {
        this.props.handleLocationDeviceDetailCancel();
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
                title='人员进离场详情'
                style={{ textAlign: 'center' }}
                visible
                onOk={this.handleLocationDeviceDetailCancel.bind(this)}
                onCancel={this.handleLocationDeviceDetailCancel.bind(this)}
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
                            onClick={this.handleLocationDeviceDetailCancel.bind(this)}
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

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
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import {
    getForestImgUrl
} from '_platform/auth';

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
            recordDetail: '',
            picViewVisible: false,
            imgSrcs: []
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
            title: '人脸识别照片',
            dataIndex: 'ImagePath',
            render: (text, record, index) => {
                if (text) {
                    return <a onClick={this.handlePicView.bind(this, text)}>查看</a>;
                } else {
                    return <sapn>/</sapn>;
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
        const {
            pagination
        } = this.state;
        let postData = {
            id: record.ID
        };
        this.setState({
            loading: true,
            percent: 0
        });
        let data = await postReSendManToFaceDevice(postData);
        console.log('data', data);
        if (data && data.code && data.code === 1) {
            // Notification.success({
            //     message: '成功'
            // });
            this.query(pagination.current || 1);
        } else {
            Notification.error({
                message: '重新下发失败'
            });
            this.setState({
                loading: false,
                percent: 100
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
            section,
            actions: {
                getFaceworkmans
            },
            platform: { tree = {} }
        } = this.props;
        let thinClassTree = tree.thinClassTree;
        let postdata = {
            section,
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
            plan.Project = getProjectNameBySection(plan.Section, thinClassTree);
            plan.sectionName = getSectionNameBySection(plan.Section, thinClassTree);
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
    handleViewPersonListCancel = () => {
        this.props.handleViewPersonListCancel();
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

import React, { Component } from 'react';
import {
    Button, Table, Row, Col, Modal
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getForestImgUrl } from '_platform/auth';

export default class ManMachineGroupTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            picViewVisible: false,
            imgSrcs: [],
            workTypesList: []
        };
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                console.log('record', record);
                return index + 1;
            }
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
            title: '手机号',
            dataIndex: 'Phone'
        },
        {
            title: '身份证号',
            dataIndex: 'ID_Card'
        },
        {
            title: '血型',
            dataIndex: 'BloodType'
        },
        {
            title: '工种',
            dataIndex: 'WorkTypeName'
        },
        {
            title: '登记时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '班组',
            dataIndex: 'workGroupName'
        },
        {
            title: '登记人',
            dataIndex: 'InputerName',
            render: (text, record, index) => {
                if (record.InputerUserName && record.InputerName) {
                    return <p>{record.InputerName + '(' + record.InputerUserName + ')'}</p>;
                } else if (record.InputerName && !record.InputerUserName) {
                    return <p>{record.InputerName}</p>;
                } else {
                    return <p> / </p>;
                }
            }
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
        // {
        //     title: '身份证照片',
        //     dataIndex: 'CardImages',
        //     render: (text, record, index) => {
        //         if (text) {
        //             return <a onClick={this.handlePicView.bind(this, text)}>查看</a>;
        //         } else {
        //             return '/';
        //         }
        //     }
        // },
        {
            title: '人脸照片',
            dataIndex: 'Images',
            render: (text, record, index) => {
                if (text) {
                    return <a onClick={this.handlePicView.bind(this, text)}>查看</a>;
                } else {
                    return '/';
                }
            }
        }

    ];

    componentDidMount = async () => {
        const {
            actions: {
                getWorkTypes
            }
        } = this.props;
        let workTypesList = [];
        let workTypeData = await getWorkTypes();
        console.log('workTypeData', workTypeData);

        if (workTypeData && workTypeData.content) {
            workTypesList = workTypeData.content;
        }
        this.setState({
            workTypesList
        });
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            addMemVisible,
            memberChangeStatus = 0,
            selectMemGroup
        } = this.props;
        if (!addMemVisible && addMemVisible !== prevProps.addMemVisible && memberChangeStatus) {
            this.getWorkGroupMember();
        }
        if (selectMemGroup && selectMemGroup !== prevProps.selectMemGroup) {
            this.getWorkGroupMember();
        }
    }
    // 获取班组人员
    getWorkGroupMember = async () => {
        const {
            actions: {
                getWorkMans,
                getUserDetail
            },
            selectMemGroup,
            parentData,
            workGroupsData
        } = this.props;
        const {
            workTypesList
        } = this.state;
        try {
            let postData = {
                team: selectMemGroup
            };
            let memData = await getWorkMans({}, postData);
            let dataSource = [];
            if (memData && memData.content) {
                dataSource = memData.content;
            }
            let orgName = (parentData && parentData.OrgName) || '/';
            let userIDList = [];
            let userDataList = [];
            for (let i = 0; i < dataSource.length; i++) {
                let plan = dataSource[i];
                // 公司名
                plan.orgName = orgName;
                // 工种
                let typeName = '/';
                if (plan.WorkTypeID) {
                    workTypesList.map((type) => {
                        if (type.ID === plan.WorkTypeID) {
                            typeName = type.Name;
                        }
                    });
                }
                plan.WorkTypeName = typeName;
                // 班组
                let groupName = '';
                if (plan.TeamID) {
                    workGroupsData.map((group) => {
                        if (group.ID === plan.TeamID) {
                            groupName = group.Name;
                        }
                    });
                }
                plan.workGroupName = groupName;
                plan.liftertime1 = plan.CreateTime
                    ? moment(plan.CreateTime).format('YYYY-MM-DD')
                    : '/';
                plan.liftertime2 = plan.CreateTime
                    ? moment(plan.CreateTime).format('HH:mm:ss')
                    : '/';
                // 获取上报人
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
            this.setState({
                dataSource
            });
        } catch (e) {
            console.log('e', e);
        }
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

    render () {
        const {
            selectState
        } = this.props;
        const {
            dataSource,
            picViewVisible,
            imgSrcs
        } = this.state;
        let tableData = [];
        if (selectState) {
            tableData = dataSource;
        }

        return (
            <div>
                <Table
                    style={{width: '100%'}}
                    columns={this.columns}
                    bordered
                    rowKey='id'
                    dataSource={tableData}
                    pagination
                />
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
            </div>

        );
    }
}

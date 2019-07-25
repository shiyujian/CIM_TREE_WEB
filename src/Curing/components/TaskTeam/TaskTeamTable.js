import React, { Component } from 'react';
import {
    Button, Modal, Table
} from 'antd';
import { getUser } from '_platform/auth';
import AddMember from './AddMember';
import '../Curing.less';

export default class TaskTeamTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addMemberVisible: false,
            relateDisabled: true,
            dataSource: []
        };
    }

    async componentDidMount () {
        const user = getUser();
        let section = user.section;
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (section) {
            this.setState({
                relateDisabled: false
            });
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            selectMemTeam,
            addMemVisible
        } = this.props;
        let selectMemTeamID = (selectMemTeam && selectMemTeam.ID) || '';
        let prevMemTeamID = (prevProps.selectMemTeam && prevProps.selectMemTeam.ID) || '';
        if (selectMemTeamID && selectMemTeamID !== prevMemTeamID) {
            await this.getGetTaskTeamData();
        }
        if (!addMemVisible && addMemVisible !== prevProps.addMemVisible) {
            this.getGetTaskTeamData();
        }
    }

    getGetTaskTeamData = async () => {
        const {
            curingGroupMans = [],
            actions: {
                getUserDetail
            }
        } = this.props;
        try {
            // 因养护班组内的人员数据只有FullName  所以需要重新获取人员详情
            if (curingGroupMans && curingGroupMans.length > 0) {
                let requestArr = [];
                curingGroupMans.map((user) => {
                    if (user && user.User) {
                        let postData = {
                            id: user && user.User
                        };
                        requestArr.push(getUserDetail(postData));
                    }
                });
                let dataSource = [];
                if (requestArr && requestArr.length > 0) {
                    dataSource = await Promise.all(requestArr);
                }
                this.setState({
                    dataSource
                });
            } else {
                this.setState({
                    dataSource: []
                });
            }
        } catch (e) {
            console.log('getGetTaskTeamData', e);
        }
    }

    render () {
        const {
            relateDisabled,
            dataSource
        } = this.state;
        const {
            selectState
        } = this.props;
        let disabled = true;
        if (selectState && !relateDisabled) {
            disabled = false;
        }
        return (
            <div>
                <Button style={{marginBottom: 10}} type='primary' disabled={disabled} onClick={this._addMemberModal.bind(this)}>关联用户</Button>
                <Table
                    style={{width: '100%'}}
                    columns={this.columns}
                    bordered
                    // rowKey='id'
                    dataSource={dataSource}
                />
                <AddMember {...this.props} />
            </div>

        );
    }
    _addMemberModal () {
        const {
            actions: {
                changeAddMemVisible
            }
        } = this.props;
        changeAddMemVisible(true);
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '名称',
            dataIndex: 'Full_Name'
        },
        {
            title: '用户名',
            dataIndex: 'User_Name'
        },
        {
            title: '职务',
            dataIndex: 'Duty'
        },
        {
            title: '手机号码',
            dataIndex: 'Phone'
        }
    ];
}

import React, { Component } from 'react';
import {
    Button, Modal, Table
} from 'antd';
import { getUser } from '_platform/auth';
import AddMember from './AddMember';
import '../Curing.less';
window.config = window.config || {};

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
        this.user = getUser();
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (sections && sections instanceof Array && sections.length > 0) {
            this.setState({
                relateDisabled: false
            });
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            selectMemTeam
        } = this.props;
        console.log('selectMemTeam', selectMemTeam);
        let selectMemTeamID = (selectMemTeam && selectMemTeam.ID) || '';
        let prevMemTeamID = (prevProps.selectMemTeam && prevProps.selectMemTeam.ID) || '';
        if (selectMemTeamID && selectMemTeamID !== prevMemTeamID) {
            await this.getGetTaskTeamData();
        }
    }

    getGetTaskTeamData = async () => {
        const {
            curingGroupMans = [],
            actions: {
                getForestUserDetail
            }
        } = this.props;
        try {
            console.log('curingGroupMans', curingGroupMans);
            if (curingGroupMans && curingGroupMans.length > 0) {
                let requestArr = [];
                curingGroupMans.map((user) => {
                    if (user && user.User) {
                        let postData = {
                            id: user && user.User
                        };
                        requestArr.push(getForestUserDetail(postData));
                    }
                });
                let dataSource = [];
                if (requestArr && requestArr.length > 0) {
                    dataSource = await Promise.all(requestArr);
                    console.log('dataSource', dataSource);
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
        console.log('addMemberVisible', this.props);
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

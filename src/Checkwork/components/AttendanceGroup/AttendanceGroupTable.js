import React, { Component } from 'react';
import {
    Button, Modal, Table
} from 'antd';
import { getUser } from '_platform/auth';
import AddMember from './AddMember';
window.config = window.config || {};

export default class AttendanceGroupTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addMemberVisible: false,
            relateDisabled: true,
            totalUserData: []
        };
    }

    async componentDidMount () {
        const {
            actions: {
                getForestAllUsersData
            }
        } = this.props;
        this.user = getUser();
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (sections && sections instanceof Array && sections.length > 0) {
            this.setState({
                relateDisabled: false
            });
        }
        let totalUserData = window.localStorage.getItem('LZ_TOTAL_USER_DATA');
        totalUserData = JSON.parse(totalUserData);
        if (totalUserData && totalUserData instanceof Array && totalUserData.length > 0) {

        } else {
            let userData = await getForestAllUsersData();
            totalUserData = userData && userData.content;
        }
        this.setState({
            totalUserData
        });
    };

    render () {
        const {
            relateDisabled
        } = this.state;
        const {
            selectState
        } = this.props;
        // let disabled = true;
        let disabled = false;
        if (selectState && !relateDisabled) {
            disabled = false;
        }
        let dataSource = this._getRelMemMess();

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
    _getRelMemMess = () => {
        const {
            checkGroupMans = []
        } = this.props;
        const {
            totalUserData = []
        } = this.state;
        let dataSource = [];
        if (checkGroupMans && checkGroupMans instanceof Array && checkGroupMans.length > 0) {
            // checkGroupMans.map((man) => {
            // totalUserData.map((userData) => {
            //     if (Number(userData.ID) === man.id) {
            //         dataSource.push(userData);
            //     }
            // });
            // });
            dataSource = checkGroupMans;
        }
        console.log('dataSource', dataSource);
        return dataSource;
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
            title: '部门',
            dataIndex: 'account.organization'
        },
        {
            title: '姓名',
            dataIndex: 'account.person_name'
        },
        {
            title: '账号',
            dataIndex: 'username'
        },
        {
            title: '角色',
            dataIndex: 'account.title'
        },
        {
            title: '职务',
            dataIndex: ''
        }

    ];
}

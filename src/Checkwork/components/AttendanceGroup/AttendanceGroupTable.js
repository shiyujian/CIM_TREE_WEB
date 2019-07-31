import React, { Component } from 'react';
import {
    Button, Table
} from 'antd';
import AddMember from './AddMember';

export default class AttendanceGroupTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: []
        };
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
            title: '姓名',
            dataIndex: 'Full_Name',
            render: (text, record, index) => {
                if (record && record.User) {
                    return record.User.Full_Name || '';
                } else {
                    return '/';
                }
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (text, record, index) => {
                if (record && record.User) {
                    return record.User.User_Name || '';
                } else {
                    return '/';
                }
            }
        },
        {
            title: '职务',
            dataIndex: 'Duty',
            render: (text, record, index) => {
                if (record && record.User) {
                    return record.User.Duty || '';
                } else {
                    return '/';
                }
            }
        }

    ];

    componentDidMount = async () => {
        const {
            actions: {
                getRoles
            },
            platform: { roles = [] }
        } = this.props;
        if (!(roles && roles.length > 0)) {
            await getRoles();
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            addMemVisible,
            memberChangeStatus = 0,
            selectMemGroup
        } = this.props;
        if (!addMemVisible && addMemVisible !== prevProps.addMemVisible && memberChangeStatus) {
            this.getCheckGroupMember();
        }
        if (selectMemGroup && selectMemGroup !== prevProps.selectMemGroup) {
            this.getCheckGroupMember();
        }
    }

    _addMemberModal = async () => {
        const {
            actions: {
                changeAddMemVisible,
                checkGroupMemChangeStatus
            }
        } = this.props;
        await checkGroupMemChangeStatus();
        await changeAddMemVisible(true);
    }

    getCheckGroupMember = async () => {
        const {
            actions: {
                getCheckGroupMans
            },
            selectMemGroup
        } = this.props;
        try {
            let postData = {
                groupId: selectMemGroup
            };
            let data = await getCheckGroupMans(postData);
            console.log('data', data);
            let dataSource = [];
            if (data && data.content && data.content instanceof Array) {
                dataSource = data.content;
            }
            this.setState({
                dataSource
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        const {
            selectState,
            addMemVisible
        } = this.props;
        const {
            dataSource
        } = this.state;
        let disabled = true;
        let tableData = [];
        if (selectState) {
            disabled = false;
            tableData = dataSource;
        }

        return (
            <div>
                <Button
                    style={{marginBottom: 10}}
                    type='primary'
                    disabled={disabled}
                    onClick={this._addMemberModal.bind(this)}>
                        关联用户
                </Button>
                <Table
                    style={{width: '100%'}}
                    columns={this.columns}
                    bordered
                    rowKey='id'
                    dataSource={tableData}
                    pagination
                />
                {addMemVisible ? <AddMember {...this.props} {...this.state} /> : ''}
            </div>

        );
    }
}

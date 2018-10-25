import React, { Component } from 'react';
import {
    Button, Table
} from 'antd';
import AddMember from './AddMember';
window.config = window.config || {};

export default class AttendanceGroupTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 1, // 当前页
            total: 0,
            dataSource: []
        };
    }

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
            console.log('sssssssssssss');
            this.getCheckGroupMember();
        }
    }

    render () {
        const {
            selectState,
            addMemVisible
        } = this.props;
        const {
            dataSource,
            page = 1,
            total = 0
        } = this.state;
        let disabled = true;
        let tableData = [];
        if (selectState) {
            disabled = false;
            tableData = dataSource;
        }

        return (
            <div>
                <Button style={{marginBottom: 10}} type='primary' disabled={disabled} onClick={this._addMemberModal.bind(this)}>关联用户</Button>
                <Table
                    style={{width: '100%'}}
                    columns={this.columns}
                    bordered
                    rowKey='id'
                    dataSource={tableData}
                    onChange={this.changePage.bind(this)}
                    pagination={{current: page, total: total}}
                />
                {addMemVisible ? <AddMember {...this.props} {...this.state} /> : ''}
            </div>

        );
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

    changePage = (obj) => {
        let current = obj.current;
        this.setState({
            page: current
        }, () => {
            this.getCheckGroupMember(current);
        });
    }

    getCheckGroupMember = async (current = 1) => {
        const {
            actions: {
                getCheckGroupMans
            },
            selectMemGroup
        } = this.props;
        try {
            let postData = {
                id: selectMemGroup
            };
            let data = await getCheckGroupMans(postData, {page: current});
            console.log('data', data);
            let dataSource = (data && data.results) || [];
            this.setState({
                total: data.count || 0,
                page: current,
                dataSource
            });
        } catch (e) {
            console.log('e', e);
        }
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
            dataIndex: 'groups',
            render: (text, record, index) => {
                let name = '/';
                if (text && text instanceof Array) {
                    name = '';
                    text.map((data) => {
                        name = name + data.name;
                    });
                }
                return name;
            }
        },
        {
            title: '职务',
            dataIndex: 'account.title'
        }

    ];
}

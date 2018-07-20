import React, { Component } from 'react';
import {
    Button, Modal, Table
} from 'antd';
import { getUser } from '_platform/auth';
import AddMember from './AddMember';
import { PROJECT_UNITS } from '_platform/api';
import '../Curing.less';
window.config = window.config || {};

export default class TaskTeamTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addMemberVisible: false,
            dataSource: [],
            relateDisabled: true
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

    componentDidUpdate (prevProps, prevState) {
        const {
            isGetMem
        } = this.props;
        if (isGetMem !== prevProps.isGetMem) {
            this._getRelMem();
        }
    }

    _getRelMem = () => {
        const {
            selectMemDoc
        } = this.props;
        if (selectMemDoc && selectMemDoc.extra_params && selectMemDoc.extra_params.RelationMem) {
            let RelationMem = selectMemDoc.extra_params.RelationMem;
            this.setState({
                dataSource: RelationMem
            });
        } else {
            this.setState({
                dataSource: []
            });
        }
    }

    render () {
        const {
            dataSource,
            relateDisabled
        } = this.state;
        const {
            selectState
        } = this.props;
        let disabled = true;
        if (selectState && !relateDisabled) {
            disabled = false;
        }
        console.log('dataSource', dataSource);
        return (
            <div>
                <Button style={{marginBottom: 10}} type='primary' disabled={disabled} onClick={this._addMemberModal.bind(this)}>关联用户</Button>
                <Table
                    style={{width: '100%'}}
                    columns={this.columns}
                    bordered
                    rowKey='id'
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
            dataIndex: 'account.person_name'
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '所属部门',
            dataIndex: 'account.organization'
        },
        {
            title: '职务',
            dataIndex: 'account.title'
        },
        {
            title: '手机号码',
            dataIndex: 'account.person_telephone'
        }
    ];
}

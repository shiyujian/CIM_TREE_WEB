import React, { Component } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    DatePicker,
    Divider,
    Popconfirm,
    Input,
    Notification,
    Pagination,
    Form
} from 'antd';
import ModalAdd from './ModalAdd';
import ModalEdit from './ModalEdit';
import ModalSee from './ModalSee';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
class TableList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 1,
            total: 0,
            name: '', // 会议名称
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            recordID: '',
            showModalSee: false,
            showModalEdit: false,
            showModalAdd: false,
            dataList: [],
            loading: false
        };
        this.onSearch = this.onSearch.bind(this); // 搜索
        this.onAdd = this.onAdd.bind(this); // 创建会议
        this.onEdit = this.onEdit.bind(this); // 修改会议
        this.onSee = this.onSee.bind(this); // 删除会议
        this.handleName = this.handleName.bind(this); // 名称
        this.handleDate = this.handleDate.bind(this); // 时间
        this.handleCancelAdd = this.handleCancelAdd.bind(this); // 取消创建
        this.handleCancelEdit = this.handleCancelEdit.bind(this); // 取消创建
        this.handleCancelSee = this.handleCancelSee.bind(this); // 取消创建
    }
    componentDidUpdate (prevProps, prevState) {
        const {
            leftKeyCode,
            parentOrgID,
            permission
        } = this.props;
        if (permission && permission !== prevProps.permission) {
            this.onSearch();
        }
        if (permission && leftKeyCode !== prevProps.leftKeyCode) {
            this.onSearch();
        }
        if (parentOrgID && parentOrgID !== prevProps.parentOrgID) {
            this.onSearch();
        }
    }
    onSearch () {
        const {
            name,
            startTime,
            endTime,
            page
        } = this.state;
        const {
            actions: {
                getMeetingList
            },
            leftKeyCode = '',
            permission = false,
            parentOrgID = ''
        } = this.props;
        let params = {
            meetingtype: '日常会议',
            projectcode: 'P193',
            belongsystem: '雄安森林大数据平台',
            orgid: permission ? leftKeyCode : parentOrgID,
            name: name,
            creater: '',
            openid: '',
            stime: startTime,
            etime: endTime,
            page: page,
            size: 10
        };
        getMeetingList({}, params).then(rep => {
            if (rep && rep.code === 1) {
                this.setState({
                    dataList: rep.content,
                    total: rep.pageinfo.total
                });
            }
        });
    }
    handleName (e) {
        this.setState({
            name: e.target.value
        });
    }
    handleDate (value, dataString) {
        this.setState({
            startTime: dataString[0],
            endTime: dataString[1]
        });
    }
    onAdd () {
        this.setState({
            showModalAdd: true
        });
    }
    handleCancelAdd () {
        this.setState({
            showModalAdd: false
        });
    }
    handleCancelEdit () {
        this.setState({
            showModalEdit: false
        });
    }
    handleCancelSee () {
        this.setState({
            showModalSee: false
        });
    }
    handlePage (page) {
        this.setState({
            page
        }, () => {
            this.onSearch();
        });
    }
    render () {
        const {
            name,
            dataList
        } = this.state;
        return (
            <div>
                <Form
                    style={{marginBottom: 10}}
                    layout='inline'
                >
                    <Row>
                        <Col span={20}>
                            <Row>
                                <Col span={8}>
                                    <FormItem
                                        label='会议名称'
                                    >
                                        <Input
                                            value={name}
                                            onChange={this.handleName}
                                            style={{width: 200}}
                                            placeholder='请输入会议名称关键字'
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={16}>
                                    <FormItem
                                        label='会议时间'
                                    >
                                        <RangePicker
                                            showTime={{format: 'HH:mm:ss'}}
                                            format={dateFormat}
                                            placeholder={['开始时间', '结束时间']}
                                            onChange={this.handleDate}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4}>
                            <Button type='primary' onClick={this.onSearch}>查询</Button>
                            <Button type='primary' style={{marginLeft: 10}} onClick={this.onAdd}>创建会议</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={this.columns}
                    dataSource={dataList}
                    pagination={false}
                    rowKey='ID'
                    bordered
                />
                <Pagination style={{float: 'right', marginTop: 10}} current={this.state.page} total={this.state.total} onChange={this.handlePage.bind(this)} showQuickJumper />
                {
                    this.state.showModalAdd ? <ModalAdd
                        {...this.props}
                        {...this.state}
                        onSearch={this.onSearch}
                        handleCancel={this.handleCancelAdd}
                        showModal={this.state.showModalAdd}
                    /> : ''
                }
                {
                    this.state.showModalEdit ? <ModalEdit
                        {...this.props}
                        {...this.state}
                        recordID={this.state.recordID}
                        onSearch={this.onSearch}
                        handleCancel={this.handleCancelEdit}
                        showModal={this.state.showModalEdit}
                    /> : ''
                }
                {
                    this.state.showModalSee ? <ModalSee
                        {...this.props}
                        {...this.state}
                        recordID={this.state.recordID}
                        onSearch={this.onSearch}
                        handleCancel={this.handleCancelSee}
                        showModal={this.state.showModalSee}
                    /> : ''
                }
            </div>
        );
    }
    onSee (ID) {
        this.setState({
            recordID: ID,
            showModalSee: true
        });
    }
    onEdit (ID) {
        this.setState({
            recordID: ID,
            showModalEdit: true
        });
    }
    onDelete (ID) {
        const { deleteMeeting } = this.props.actions;
        deleteMeeting({
            ID
        }).then(rep => {
            if (rep && rep.code === 1) {
                Notification.success({
                    message: '删除成功'
                });
                this.onSearch();
            } else {
                Notification.error({
                    message: rep.msg || '操作失败'
                });
            }
        });
    }
    columns = [
        {
            title: '序号',
            width: '5%',
            dataIndex: 'order',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '会议名称',
            dataIndex: 'MeetingName'
        },
        {
            title: '会议类型',
            dataIndex: 'IsOnLine',
            render: (text, record) => {
                if (text) {
                    return '视频会议';
                } else {
                    return '线下会议';
                }
            }
        },
        {
            title: '会议地点',
            dataIndex: 'Location'
        },
        {
            title: '计划开始时间',
            dataIndex: 'StartTime'
        },
        {
            title: '计划结束时间',
            dataIndex: 'EndTime'
        },
        {
            title: '参会人数',
            dataIndex: 'Num'
        },
        {
            title: '操作',
            dataIndex: 'active',
            render: (text, record) => {
                return (<span>
                    <a onClick={this.onSee.bind(this, record.ID)}>查看</a>
                    <Divider type='vertical' />
                    <a onClick={this.onEdit.bind(this, record.ID)}>修改</a>
                    <Divider type='vertical' />
                    <Popconfirm
                        title='确定删除吗?'
                        onConfirm={this.onDelete.bind(this, record.ID)}
                        okText='确定'
                        cancelText='取消'
                    >
                        <a>删除</a>
                    </Popconfirm>
                </span>);
            }
        }
    ];
}
export default Form.create()(TableList);

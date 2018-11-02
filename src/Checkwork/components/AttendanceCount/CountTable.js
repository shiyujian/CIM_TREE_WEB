import React, { Component } from 'react';
import {
    Table,
    Modal,
    Row,
    Button
} from 'antd';
import { FOREST_API } from '../../../_platform/api';
import moment from 'moment';

export default class CountTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            seeVisible: false, // 查看弹框
            record: null // 行数据
        };
    }

    render () {
        const { seeVisible, record } = this.state;
        const {
            allcheckrecord = []
        } = this.props;
        console.log('allcheckrecord', allcheckrecord);
        let dataSource = [];
        allcheckrecord.map((data) => {
            dataSource.push(data.user);
        });
        console.log('dataSource', dataSource);
        let imgs = null;
        if (record) {
            imgs = record.checkin_record.imgs;
        }

        const pagination = { // 设置每页显示的页数
            pageSize: 10
        };

        return (
            <div>
                <div>此次查询人数:</div>
                <Table
                    dataSource={allcheckrecord}
                    columns={this.columns}
                    // pagination={pagination}
                    className='foresttables'
                    bordered
                    rowKey='id'
                />
                <Modal title='查看'
                    visible={seeVisible}
                    onCancel={this.handleCancel.bind(this)}
                    style={{ textAlign: 'center' }}
                    footer={null}
                >
                    <img src={FOREST_API + '/' + imgs} width='100%' height='100%' alt='图片找不到了' />
                </Modal>
            </div>

        );
    }

    columns = [
        {
            title: '部门',
            dataIndex: 'user.account.organization',
            key: 'user.account.organization',
            render: (text, record, index) => {
                let organization = (record && record.user && record.user.account && record.user.account.organization) || '';
                let company = '';
                if (record && record.check_group && record.check_group.length > 0) {
                    company = record.check_group[0].org_name;
                }
                console.log('record', record);
                console.log('text', text);
                return <span>{company}{organization}</span>;
            }
        },
        {
            title: '姓名',
            dataIndex: 'user.account.person_name',
            key: 'user.account.person_name'
        },
        {
            title: '账号',
            dataIndex: 'user.username',
            key: 'user.username'
        },
        {
            title: '角色',
            render: (text, record, index) => {
                console.log('record', record);
                console.log('text', text);

                if (record && record.user && record.user.groups && record.user.groups.length > 0) {
                    return <span>{record.user.groups[0].name}</span>;
                }
            }
        },
        {
            title: '职务',
            dataIndex: 'user.account.title',
            key: 'user.account.title'
        },
        {
            title: '考勤群体',
            render: (text, record, index) => {
                if (record && record.check_group && record.check_group.length > 0) {
                    let name = '';
                    record.check_group.map((group, index) => {
                        if (index > 0) {
                            name = ',' + name + group.name;
                        } else {
                            name = name + group.name;
                        }
                    });
                    return name;
                } else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: '上班时间',
            dataIndex: 'checkin_record.check_time',
            key: 'checkin_record.check_time',
            render: (text, record, index) => {
                if (record && record.checkin_record && record.checkin_record.check_time) {
                    return <div style={{textAlign: 'Center'}}>
                        <div>
                            {moment(text).format('YYYY-MM-DD')}
                        </div>
                        <div>
                            {moment(text).format('hh:mm:ss')}
                        </div>
                    </div>;
                } else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: '下班时间',
            dataIndex: 'checkout_record.check_time',
            key: 'checkout_record.check_time',
            render: (text, record, index) => {
                if (record && record.checkout_record && record.checkout_record.check_time) {
                    return <div style={{textAlign: 'Center'}}>
                        <div>
                            {moment(text).format('YYYY-MM-DD')}
                        </div>
                        <div>
                            {moment(text).format('hh:mm:ss')}
                        </div>
                    </div>;
                } else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                if (text) {
                    if (text === 1) {
                        return <span>缺勤</span>;
                    } else if (text === 2) {
                        return <span>迟到</span>;
                    } else if (text === 3) {
                        return <span>早退</span>;
                    } else if (text === 4) {
                        return <span>正常</span>;
                    } else if (text === 5) {
                        return <span>迟到,早退</span>;
                    }
                } else {
                    return <span>/</span>;
                }
            }
        },
        {
            title: '照片',
            render: (record) => {
                if ((record.checkin_record && record.checkin_record.imgs) || (record.checkout_record && record.checkout_record.imgs)) {
                    return (
                        <div>
                            <a onClick={this.previewFile.bind(this, record)}>
                                查看
                            </a>
                        </div>
                    );
                } else {
                    return <span>/</span>;
                }
            }
        }
    ];

    previewFile (record) {
        this.setState({
            seeVisible: true,
            record: record
        });
    }

    handleCancel () {
        this.setState({
            seeVisible: false
        });
    }
}

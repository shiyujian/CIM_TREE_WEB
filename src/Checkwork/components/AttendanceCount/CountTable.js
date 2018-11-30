import React, { Component } from 'react';
import {
    Table,
    Modal,
    Spin
} from 'antd';
import CountFilter from './CountFilter';
import moment from 'moment';
import './index.less';
// import 'moment/locale/zh-cn';
import { getForestImgUrl } from '_platform/auth';

export default class CountTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            seeVisible: false, // 查看弹框
            pagination: {},
            loading: false,
            imgs: []
        };
    }

    render () {
        const {
            seeVisible,
            allcheckrecord,
            imgs = []
        } = this.state;
        return (
            <div>
                <CountFilter {...this.props} {...this.state} query={this.query.bind(this)} />
                <Spin spinning={this.state.loading} tip='数据加载中，请稍等...'>
                    <div>此次查询人数:  {this.state.totalNum} 人</div>
                    <Table
                        dataSource={allcheckrecord}
                        columns={this.columns}
                        pagination={this.state.pagination}
                        className='foresttables'
                        bordered
                        rowKey='id'
                        onChange={this.handleTableChange.bind(this)}
                    />
                </Spin>
                <Modal title='查看照片'
                    visible={seeVisible}
                    onCancel={this.handleCancel.bind(this)}
                    style={{ textAlign: 'center' }}
                    footer={null}
                >
                    {
                        imgs.map((img) => {
                            return <img src={img} style={{ width: '490px', height: '490px', marginBottom: 10 }} alt='图片找不到了' />;
                        })
                    }
                </Modal>
            </div>
        );
    }

    handleTableChange = async (pagination) => {
        const {
            filterData = {}
        } = this.props;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        await this.query(pagination.current, filterData);
        this.setState({
            pagination: pager
        });
    }

    query = async (current, queryParams) => {
        const {actions: {getCheckRecord}} = this.props;
        console.log('current', current);
        try {
            let postaData = {
                page: current,
                page_size: 10,
                ordering: '-created_on',
                org_code: queryParams.org_code ? queryParams.org_code : '',
                group: queryParams.group ? queryParams.group : '',
                name: queryParams.name ? queryParams.name : '',
                start: queryParams.start ? queryParams.start : '',
                end: queryParams.end ? queryParams.end : '',
                checkin: queryParams.checkin ? queryParams.checkin : '',
                status: queryParams.status ? queryParams.status : '',
                role: queryParams.role ? queryParams.role : '',
                duty: queryParams.duty ? queryParams.duty : ''
            };
            this.setState({
                loading: true
            });
            let data = await getCheckRecord({}, postaData);
            let results = (data && data.results) || [];
            const pagination = { ...this.state.pagination };
            pagination.total = data.count;
            pagination.pageSize = 10;
            pagination.current = current;
            let totalNum = data.count;
            this.setState({
                allcheckrecord: results,
                loading: false,
                pagination,
                totalNum
            });
        } catch (e) {
            console.log('query', e);
        }
    }

    // 上班的照片
    previewCheckinImg (record) {
        let imgs = this.onImgClick((record && record.checkin_record && record.checkin_record.imgs) || []);
        console.log('imgs', imgs);
        this.setState({
            seeVisible: true,
            imgs: imgs
        });
    }
    // 下班的照片
    previewCheckoutImg (record) {
        let imgs = this.onImgClick((record && record.checkout_record && record.checkout_record.imgs) || []);
        console.log('imgs', imgs);
        this.setState({
            seeVisible: true,
            imgs: imgs
        });
    }

    onImgClick = (datas) => {
        let srcs = [];
        try {
            datas.map((data) => {
                let arr = data.split(',');
                arr.map(rst => {
                    let src = getForestImgUrl(rst);
                    srcs.push(src);
                });
            });
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    };

    handleCancel () {
        this.setState({
            seeVisible: false,
            imgs: []
        });
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
                return <div style={{textAlign: 'Center'}}>
                    <div className='column' title={company}>
                        {company}
                    </div>
                    <div className='column' title={organization}>
                        {organization}
                    </div>
                </div>;
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
                            name = name + ',' + group.name;
                        } else {
                            name = name + group.name;
                        }
                    });
                    return <div className='column' title={name}>{name}</div>;
                } else {
                    return <div style={{textAlign: 'Center'}}><span>/</span></div>;
                }
            }
        },
        {
            title: '日期',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (text, record, index) => {
                if (record && record.created_on) {
                    return <div style={{textAlign: 'Center'}}>
                        <div>
                            {moment(text).utc().zone(-0).format('YYYY-MM-DD')}
                        </div>
                    </div>;
                } else {
                    return <div style={{textAlign: 'Center'}}><span>/</span></div>;
                }
            }
        },
        {
            title: '上班时间',
            dataIndex: 'checkin_record.check_time',
            key: 'checkin_record.check_time',
            render: (text, record, index) => {
                if (record && record.checkin_record && record.checkin_record.check_time) {
                    if (record.checkin_record.imgs) {
                        return <div style={{textAlign: 'Center'}}>
                            <div>
                                <a onClick={this.previewCheckinImg.bind(this, record)}>
                                    {moment(text).utc().zone(-0).format('YYYY-MM-DD')}
                                </a>
                            </div>
                            <div>
                                <a onClick={this.previewCheckinImg.bind(this, record)}>
                                    {moment(text).utc().zone(-0).format('HH:mm:ss')}
                                </a>
                            </div>
                        </div>;
                    } else {
                        return <div style={{textAlign: 'Center'}}>
                            <div onClick={this.previewCheckinImg.bind(this, record)}>
                                {moment(text).utc().zone(-0).format('YYYY-MM-DD')}
                            </div>
                            <div onClick={this.previewCheckinImg.bind(this, record)}>
                                {moment(text).utc().zone(-0).format('HH:mm:ss')}
                            </div>
                        </div>;
                    }
                } else {
                    return <div style={{textAlign: 'Center'}}><span>/</span></div>;
                }
            }
        },
        {
            title: '下班时间',
            dataIndex: 'checkout_record.check_time',
            key: 'checkout_record.check_time',
            render: (text, record, index) => {
                if (record && record.checkout_record && record.checkout_record.check_time) {
                    if (record.checkin_record.imgs) {
                        return <div style={{textAlign: 'Center'}}>
                            <div>
                                <a onClick={this.previewCheckoutImg.bind(this, record)}>
                                    {moment(text).utc().zone(-0).format('YYYY-MM-DD')}
                                </a>
                            </div>
                            <div>
                                <a onClick={this.previewCheckoutImg.bind(this, record)}>
                                    {moment(text).utc().zone(-0).format('HH:mm:ss')}
                                </a>
                            </div>
                        </div>;
                    } else {
                        return <div style={{textAlign: 'Center'}}>
                            <div onClick={this.previewCheckoutImg.bind(this, record)}>
                                {moment(text).utc().zone(-0).format('YYYY-MM-DD')}
                            </div>
                            <div onClick={this.previewCheckoutImg.bind(this, record)}>
                                {moment(text).utc().zone(-0).format('HH:mm:ss')}
                            </div>
                        </div>;
                    }
                } else {
                    return <div style={{textAlign: 'Center'}}><span>/</span></div>;
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
        }
    ];
}

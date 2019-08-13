import React, { Component } from 'react';
import {
    Table,
    Modal,
    Spin,
    Notification
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
            imgs: [],
            companyList: []
        };
    }

    columns = [
        // {
        //     title: '公司',
        //     dataIndex: 'OrgCode',
        //     key: 'OrgCode',
        //     render: (text, record, index) => {
        //         const {
        //             companyList = []
        //         } = this.state;
        //         let org = '';
        //         companyList.map((company) => {
        //             if (company.ID === 44) {
        //                 console.log('company', company);
        //             }
        //             if (company.ID === text) {
        //                 org = company;
        //             };
        //         });
        //         if (org && org.OrgName) {
        //             return <div style={{textAlign: 'Center'}}>
        //                 <div className='column' title={org.OrgName}>
        //                     {org.OrgName}
        //                 </div>
        //             </div>;
        //         } else {
        //             return '/';
        //         }
        //     }
        // },
        {
            title: '公司名称',
            dataIndex: 'CompanyName',
            key: 'CompanyName'
        },
        {
            title: '姓名',
            dataIndex: 'Name',
            key: 'Name'
        },
        {
            title: '账号',
            dataIndex: 'Number',
            key: 'Number'
        },
        {
            title: '角色',
            dataIndex: 'Role',
            key: 'Role',
            render: (text, record, index) => {
                const {
                    platform: { roles = [] }
                } = this.props;
                if (text && text.ID && text.RoleName) {
                    return text.RoleName;
                } else {
                    let roleName = '';
                    if (text) {
                        roles.map((role) => {
                            if (role && role.ID && role.ID === Number(text)) {
                                roleName = role.RoleName;
                            }
                        });
                    }

                    return roleName;
                }
            }

        },
        {
            title: '职务',
            dataIndex: 'Post',
            key: 'Post'
        },
        {
            title: '考勤群体',
            dataIndex: 'GroupName',
            key: 'GroupName'
        },
        {
            title: '日期',
            dataIndex: 'Date',
            key: 'Date',
            render: (text, record, index) => {
                if (record && record.Date) {
                    return <div style={{textAlign: 'Center'}}>
                        <div>
                            {moment(text).format('YYYY-MM-DD')}
                        </div>
                    </div>;
                } else {
                    return <div style={{textAlign: 'Center'}}><span>/</span></div>;
                }
            }
        },
        {
            title: '上班时间',
            render: (text, record, index) => {
                if (record.PunchTime) {
                    if (record.OnPath) {
                        return <div style={{textAlign: 'Center'}}>
                            <div>
                                <a onClick={this.previewCheckinImg.bind(this, record)}>
                                    {moment(record.PunchTime).format('YYYY-MM-DD')}
                                </a>
                            </div>
                            <div>
                                <a onClick={this.previewCheckinImg.bind(this, record)}>
                                    {moment(record.PunchTime).format('HH:mm:ss')}
                                </a>
                            </div>
                        </div>;
                    } else {
                        return <div style={{textAlign: 'Center'}}>
                            <div onClick={this.previewCheckinImg.bind(this, record)}>
                                {moment(record.PunchTime).format('YYYY-MM-DD')}
                            </div>
                            <div onClick={this.previewCheckinImg.bind(this, record)}>
                                {moment(record.PunchTime).format('HH:mm:ss')}
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
            render: (text, record, index) => {
                if (record.OffTime) {
                    if (record.OffPath) {
                        return <div style={{textAlign: 'Center'}}>
                            <div>
                                <a onClick={this.previewCheckoutImg.bind(this, record)}>
                                    {moment(record.OffTime).format('YYYY-MM-DD')}
                                </a>
                            </div>
                            <div>
                                <a onClick={this.previewCheckoutImg.bind(this, record)}>
                                    {moment(record.OffTime).format('HH:mm:ss')}
                                </a>
                            </div>
                        </div>;
                    } else {
                        return <div style={{textAlign: 'Center'}}>
                            <div onClick={this.previewCheckoutImg.bind(this, record)}>
                                {moment(record.OffTime).format('YYYY-MM-DD')}
                            </div>
                            <div onClick={this.previewCheckoutImg.bind(this, record)}>
                                {moment(record.OffTime).format('HH:mm:ss')}
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
            dataIndex: 'State',
            key: 'State',
            render: (text) => {
                if (text) {
                    if (text === 0) {
                        return <span>缺勤</span>;
                    } else if (text === 1) {
                        return <span>出勤</span>;
                    } else if (text === 2) {
                        return <span>迟到</span>;
                    } else if (text === 3) {
                        return <span>早退</span>;
                    } else if (text === 4) {
                        return <span>迟到并早退</span>;
                    } else if (text === 5) {
                        return <span>请假</span>;
                    }
                } else {
                    return <span>/</span>;
                }
            }
        }
    ];

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
        const {
            actions: {
                getCheckRecord
            }
        } = this.props;
        console.log('current', current);
        try {
            let postaData = {
                page: current,
                size: 10,
                orgCode: queryParams.orgID ? queryParams.orgID : '',
                groupId: queryParams.groupId ? queryParams.groupId : '',
                name: queryParams.name ? queryParams.name : '',
                sTime: queryParams.sTime ? queryParams.sTime : '',
                eTime: queryParams.eTime ? queryParams.eTime : '',
                state: queryParams.status ? queryParams.status : '',
                role: queryParams.role ? queryParams.role : '',
                post: queryParams.duty ? queryParams.duty : ''
            };
            this.setState({
                loading: true
            });
            let data = await getCheckRecord({}, postaData);
            if (data && data.code && data.code === 1) {
                let results = (data && data.content) || [];
                const pagination = { ...this.state.pagination };
                pagination.total = data.pageinfo && data.pageinfo.total;
                pagination.pageSize = 10;
                pagination.current = current;
                let totalNum = data.pageinfo && data.pageinfo.total;
                this.setState({
                    allcheckrecord: results,
                    loading: false,
                    pagination,
                    totalNum
                });
            } else {
                Notification.error({
                    message: '查询失败'
                });
                const pagination = { ...this.state.pagination };
                pagination.total = 0;
                pagination.pageSize = 10;
                pagination.current = 1;
                this.setState({
                    allcheckrecord: [],
                    loading: false,
                    pagination,
                    totalNum: 0
                });
            }
        } catch (e) {
            console.log('query', e);
        }
    }

    // 上班的照片
    previewCheckinImg (record) {
        let imgs = this.onImgClick((record && record.OnPath) || []);
        this.setState({
            seeVisible: true,
            imgs: imgs
        });
    }
    // 下班的照片
    previewCheckoutImg (record) {
        let imgs = this.onImgClick((record && record.OffPath) || []);
        this.setState({
            seeVisible: true,
            imgs: imgs
        });
    }

    onImgClick = (datas) => {
        let srcs = [];
        try {
            let arr = datas.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                srcs.push(src);
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

    getCompanyDataList = (list) => {
        console.log('list', list);
        if (list && list instanceof Array) {
            this.setState({
                companyList: list
            });
        }
    }

    render () {
        const {
            seeVisible,
            allcheckrecord,
            imgs = []
        } = this.state;
        return (
            <div>
                <Spin spinning={this.state.loading} tip='数据加载中，请稍等...'>
                    <CountFilter
                        {...this.props}
                        {...this.state}
                        getCompanyDataList={this.getCompanyDataList.bind(this)}
                        query={this.query.bind(this)} />
                    <div>此次查询数据:  {this.state.totalNum} 条</div>
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
}

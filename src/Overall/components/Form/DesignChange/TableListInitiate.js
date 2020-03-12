import React, { Component } from 'react';
import {
    Table,
    Form,
    Notification,
    Spin,
    Divider,
    Popconfirm
} from 'antd';
import { getUser } from '_platform/auth';
import {
    WFStatusList
} from '_platform/api';
import Query from './Query';
import Details from './Details';
class TableList extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            flowID: '', // 流程ID
            flowName: '', // 流程Name
            originNodeID: '', // 起点ID
            originNodeName: '', // 起点name
            weekData: [],
            flowDetailModaldata: [],
            dataSourceSelected: [],
            visible: false,
            visibleLook: false,
            projectName: '',
            sectionArray: [], // 标段列表
            filterData: [], // 对流程信息根据项目进行过滤
            currentSection: '',
            currentSectionName: '',
            stime: null,
            etime: null,
            weekPlanDataSource: [], //
            user: '',
            page: 1,
            dataList: [], // 表单数据
            spinning: true,
            DetailsModalVisible: false,
            detailRow: {}
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
            title: '表单号',
            dataIndex: 'WorkNo'
        },
        // {
        //     title: '图号',
        //     dataIndex: 'DrawingNo',
        // },
        {
            title: '标段',
            dataIndex: 'Section',
            render: text => {
                let projectList = this.props.projectList;
                if (text) {
                    if (projectList.length > 0) {
                        for (let i = 0; i < projectList.length; i++) {
                            if (projectList[i].No == text.split('-')[0]) {
                                let list = projectList[i].children;
                                for (let j = 0; j < list.length; j++) {
                                    if (list[j].No == text) {
                                        text = list[j].Name;
                                    }
                                }
                            }
                        }
                    }
                }
                return text;
            }
        },
        {
            title: '变更名称',
            dataIndex: 'Title'
        },
        {
            title: '发起人',
            dataIndex: 'StarterObj',
            render: (text, record, index) => {
                if (text) {
                    if (text.Full_Name) {
                        return `${text.Full_Name || ''}(${text.User_Name || ''})`;
                    } else {
                        return `(${text.User_Name || ''})`;
                    }
                } else {
                    return '/';
                }
            }
        },
        {
            title: '发起时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '流转状态',
            dataIndex: 'WFState',
            render: (text, record, index) => {
                let statusValue = '';
                WFStatusList.find(item => {
                    if (item.value === text) {
                        statusValue = item.label;
                    }
                });
                return statusValue;
            }
        },
        {
            title: '当前执行人',
            dataIndex: 'NextExecutorObjs',
            render: (text, record, index) => {
                if (text && text.length === 1) {
                    if (text[0].Full_Name) {
                        return `${text[0].Full_Name || ''}(${text[0].User_Name || ''})`;
                    } else {
                        return `(${text[0].User_Name || ''})`;
                    }
                } else if (text && text.length === 2) {
                    if (text[0].Full_Name && text[1].Full_Name) {
                        return `${text[0].Full_Name || ''}(${text[0].User_Name || ''})/${text[1].Full_Name || ''}(${text[1].User_Name || ''})`;
                    } else {
                        return `(${text[0].User_Name || ''})/(${text[1].User_Name || ''})`;
                    }
                } else {
                    return '/';
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'active',
            render: (text, record, index) => {
                return (<div>
                    <a
                        style={{marginRight: 10}}
                        onClick={this.onDetails.bind(this, record)}>
                            查看
                    </a>
                    <Divider type='vertical' />
                    <Popconfirm
                        title='确定要删除么'
                        onConfirm={this.onDelete.bind(this, record)}
                        onCancel={this.handleDeleteCancel.bind(this)}
                        okText='Yes'
                        cancelText='No'>

                        <a
                            style={{marginRight: 10}}>
                            删除
                        </a>
                    </Popconfirm>
                </div>);
            }
        }
    ];
    async componentDidMount () {
        this.getFlowList(); // 获取流程
    }

    getFlowList () {
        const { getFlowList } = this.props.actions;
        getFlowList({}, {
            name: '', // 流程名称
            status: 1, // 流程状态
            page: '',
            size: ''
        }).then(rep => {
            if (rep.code === 1) {
                let flowID = '';
                let flowName = '';
                rep.content.map(item => {
                    if (item.Name === '设计变更流程') {
                        flowID = item.ID;
                        flowName = item.Name;
                    }
                });
                this.setState({
                    flowID,
                    flowName
                }, () => {
                    this.getWorkList(); // 获取任务列表
                });
            }
        });
    }
    getWorkList (values = {}) {
        let {
            actions: { getWorkList }
        } = this.props;
        const { flowID, page } = this.state;
        this.setState({
            spinning: true
        });
        let StartTime = '', EndTime = '';
        if (values.stime) {
            StartTime = values.stime;
        }
        if (values.etime) {
            EndTime = values.etime;
        }
        let keys = [], vals = [];
        if (values.section) {
            keys.push('Section');
            vals.push(values.section);
        }
        if (values.drawingno) {
            keys.push('DrawingNo');
            vals.push(values.drawingno);
        }
        // if (values.no) {
        //     keys.push("No");
        //     vals.push(values.no);
        // }
        let keysarr = '', valsarr = '';
        if (keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                if (i === 0) {
                    keysarr = keys[i];
                } else {
                    keysarr = keysarr + '|' + keys[i];
                }
            }
        }
        if (vals.length > 0) {
            for (let j = 0; j < vals.length; j++) {
                if (j === 0) {
                    valsarr = vals[j];
                } else {
                    valsarr = valsarr + '|' + vals[j];
                }
            }
        }
        let param = {
            workid: '', // 任务ID
            title: values.title || '', // 任务名称
            flowid: flowID, // 流程类型或名称
            starter: getUser().ID, // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            wfstate: values.wfstate || '1,2', // 待办 0,1
            workno: values.no || '', // 表单编号
            stime: StartTime, // 开始时间
            etime: EndTime, // 结束时间
            keys: keys || '', // 查询键
            values: vals || '', // 查询值
            page: page, // 页码
            size: 10 // 页数
        };
        getWorkList({}, param).then(rep => {
            if (rep && rep.code === 200 && rep.content) {
                this.setState({
                    dataList: rep.content,
                    spinning: false
                });
            }
        });
    }
    reloadList () { // 刷新表单
        this.getFlowList();
    }

    onDetails (record) {
        this.setState({
            detailRow: record,
            DetailsModalVisible: true
        });
    }

    onCheck (record) {
        this.setState({
            detailRow: record,
            DetailsModalVisible: true
        });
    }
    handleDeleteCancel () {

    }
    onDelete (record) {
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: record.ID
        }, {}).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除任务成功',
                    duration: 3
                });
                this.getWorkList();
            } else {
                Notification.error({
                    message: '删除任务失败',
                    duration: 3
                });
            }
        });
    }

    DetailsReturn () { // 返回表单页面
        this.setState({
            detailRow: {},
            DetailsModalVisible: false
        });
    }

    render () {
        const {
            dataList,
            spinning,
            DetailsModalVisible
        } = this.state;
        return <div>
            <Query
                {...this.props}
                {...this.state}
                reloadList={this.reloadList.bind(this)}
                query={this.getWorkList.bind(this)}
            />
            <Spin spinning={spinning}>
                <Table
                    columns={this.columns}
                    dataSource={dataList}
                    rowKey='ID'
                />
            </Spin>
            {
                DetailsModalVisible
                    ? <Details
                        {...this.props}
                        {...this.state}
                        DetailsReturn={this.DetailsReturn.bind(this)}
                        reloadList={this.reloadList.bind(this)}
                    /> : ''
            }

        </div>;
    }
};
export default Form.create()(TableList);

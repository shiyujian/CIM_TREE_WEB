import React, { Component } from 'react';
import { Table, Card, Row } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './styles.less';
import { getUser } from '_platform/auth';
import 'moment/locale/zh-cn';
import { getWorkList } from '../../Selfcare/store/tasks';
moment.locale('zh-cn');

export default class Datum extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            workList: []
        };
        this.getWorkList = this.getWorkList.bind(this);
    }

    async componentDidMount () {
        this.getWorkList();
    }
    getWorkList () {
        const { getWorkList } = this.props.actions;
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowid: '', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: getUser().ID || '', // 执行人
            wfstate: '0,1,4', // 待办
            stime: '', // 开始时间
            etime: '', // 结束时间
            page: '', // 页码
            size: '' // 页数
        };
        getWorkList({}, params).then(rep => {
            if (rep.code === 200) {
                let workList = []; // 待办列表
                rep.content.map(item => {
                    workList.push(item);
                });
                this.setState({
                    workList
                });
            }
        });
    }

    columns = [
        {
            title: '任务标题',
            dataIndex: 'Title',
            render (text, record, index) {
                return (
                    <a className='hoverStyle'>
                        <Link
                            to={`/selfcare/task/${record.ID}`}
                        >
                            <span>text</span>
                        </Link>
                    </a>
                );
            }
        },

        {
            title: '提交时间',
            dataIndex: 'CreateTime',
            render: (text, record) => {
                return moment(text).format('YYYY-MM-DD');
            }
        }
    ];

    render () {
        const { workList } = this.state;

        return (
            <Row>
                <Card title='待办任务'
                    className='HomeCard'
                    style={{marginRight:'1%'}}
                    extra={
                        <Link to='/selfcare/task'>
                        MORE
                        </Link>
                    }
                >
                    <Table
                    // bordered
                        size='small'
                        showHeader={false}
                        dataSource={workList}
                        columns={this.columns}
                        pagination={{ showQuickJumper: true, pageSize: 5 }}
                        rowKey='ID'
                    />
                </Card>
            </Row>

        );
    }
}

import React, { Component } from 'react';
import { Table, Card } from 'antd';
import Blade from '_platform/components/panels/Blade';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './styles.less';
import { getUser } from '../../_platform/auth';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class Datum extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            container: null,
            workflowData: []
        };
    }

    async componentDidMount () {
        const {
            actions: { getTaskPerson }
        } = this.props;
        let user = getUser();
        let datas = await getTaskPerson({ userid: user.id });
        let workflowData = [];
        if (datas && datas instanceof Array && datas.length > 0) {
            datas.map(data => {
                let workflowactivity = data.workflowactivity;
                let state = data.state;
                workflowData.push({
                    state_id: state.id,
                    task_id: workflowactivity.id,
                    name: workflowactivity.name,
                    pub_time: workflowactivity.real_start_time
                });
            });
        }
        this.setState({
            workflowData: workflowData
        });
    }

    columns = [
        {
            title: '任务标题',
            dataIndex: 'name',
            key: 'name',
            width: 400,
            render (text, record) {
                if (text.length > 30) {
                    text = text.slice(0, 30);
                }
                return <p>{text}</p>;
            }
        },

        {
            title: '提交时间',
            dataIndex: 'pub_time',
            key: 'pub_time',
            width: 200,
            render: (text, record) => {
                return moment(record.pub_time)
                    .utc()
                    .zone(-8)
                    .format('YYYY-MM-DD HH:mm:ss'); // 转换为东八区时间
            }
        },

        {
            title: '操作',
            width: 100,
            render (record) {
                return (
                    <span>
                        <Link
                            to={
                                `/selfcare/task/${record.task_id}?state_id=` +
                                record.state_id
                            }
                        >
                            <span>查看</span>
                        </Link>
                    </span>
                );
            }
        }
    ];

    render () {
        // const { tasks=[] } = this.props;
        const { home: { datum: { usertasks = [] } = {} } = {} } = this.props;
        const { workflowData } = this.state;

        return (
            <Blade title='待办任务' >
                <Link to='/selfcare/task'>
                    <span style={{ float: 'right', marginTop: '-30px' }}>
                        MORE
                    </span>
                </Link>
                <div style={{ marginBottom: '14px', marginTop: '-9px' }}>
                    <hr />
                </div>
                <div className='tableContainer'>
                    <Table
                        bordered
                        dataSource={workflowData}
                        columns={this.columns}
                        pagination={{ showQuickJumper: true, pageSize: 5 }}
                        rowKey='pk'
                    />
                </div>
            </Blade>
        );
    }
}

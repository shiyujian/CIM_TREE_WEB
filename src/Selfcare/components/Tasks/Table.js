import React, { Component } from 'react';
import { Table, Spin } from 'antd';
class TaskTable extends Component {
    columns = [{
        title: '序号',
        dataIndex: 'index',
        render (text, record, index) {
            return index;
        }
    }, {
        title: '任务名称',
        dataIndex: 'Title'
    }, {
        title: '任务状态',
        dataIndex: 'WFState'
    }, {
        title: '当前节点名称',
        dataIndex: 'CurrentNodeName'
    }, {
        title: '发送人',
        dataIndex: 'Sender'
    }, {
        title: '执行人',
        dataIndex: 'Executor'
    }, {
        title: '执行组织机构',
        dataIndex: 'ExecuteOrg'
    }, {
        title: '执行角色',
        dataIndex: 'ExecuteRole'
    }, {
        title: '流程名称',
        dataIndex: 'FlowName'
    }];
    onChange () {

    }
    render () {
        let loading = false;
        const { backlogDataList } = this.props;
        console.log('渲染待办', backlogDataList);
        return (
            <div>
                <Spin tip='加载中' spinning={loading}>
                    <Table columns={this.columns}
                        dataSource={backlogDataList}
                        bordered
                        rowKey='ID'
                        onChange={this.onChange.bind(this)}
                    />
                </Spin>
            </div>
        );
    }
};
export default TaskTable;

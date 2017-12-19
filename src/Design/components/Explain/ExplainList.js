import React, {Component} from 'react';
import {Card,Table} from 'antd';
import testTableData from './testTableData.json';


export default class ExplainList extends Component {


	render() {

		const {
			filteredDesignExpList,
		} = this.props;
		return (
			<Card>
                <label>
                    设计交底列表
                </label>
                <Table columns={tableColumns} dataSource={filteredDesignExpList===undefined?testTableData:filteredDesignExpList}>
                </Table>
			</Card>
		);
	}
}

const tableColumns = [
    {
        title:'序号',
        key:'indexNumber',
        dataIndex:'indexNumber',
    },
    {
        title:'卷册编号',
        key:'volumeNumber',
        dataIndex:'volumeNumber',
    },
    {
        title:'卷册名称',
        key:'volumeName',
        dataIndex:'volumeName',
    },
    {
        title:'成果类型',
        key:'resultType',
        dataIndex:'resultType',
    },
    {
        title:'专业',
        key:'proName',
        dataIndex:'proName',
    },
    {
        title:'设计阶段',
        key:'designStage',
        dataIndex:'designStage',
    },
    {
        title:'版本',
        key:'version',
        dataIndex:'version',
    },
    {
        title:'施工单位',
        key:'workOrg',
        dataIndex:'workOrg',
    },
    {
        title:'设计单位',
        key:'designOrg',
        dataIndex:'designOrg',
    },
    {
        title:'交底人',
        key:'explainer',
        dataIndex:'explainer',
    },
    {
        title:'交底时间',
        key:'explainTime',
        dataIndex:'explainTime',
    },
    {
        title:'状态',
        key:'status',
		// dataIndex:'status',
		render:(record)=>{
			switch (record.status) {
				case 'WaitForUpload':
					return '已经保存，待提交';		
				case 'WaitForEndorse':
					return '已经提交，待审核';
				case 'WaitForEdit':
					return '已经退回，待修改';				
				case 'Done':
					return '已经完成';			
				default:
					break;
			}
		},
    },
    {
		width:'100px',
        title:'操作',
        key:'action',
        render:(record)=>{
			switch (record.status) {
				case 'WaitForUpload':
					return <span><a>提交</a>&nbsp;|&nbsp;<a>详情</a></span>;		
				case 'WaitForEndorse':
					return <span><a>审查</a>&nbsp;|&nbsp;<a>详情</a></span>;
				case 'WaitForEdit':
					return <span><a>提交</a>&nbsp;|&nbsp;<a>详情</a></span>;				
				case 'Done':
					return <span><a>详情</a></span>;							
				default:
					break;
			}
			
		},
    },
];

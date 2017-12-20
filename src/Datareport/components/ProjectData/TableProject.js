import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableProject.css'
const Search = Input.Search;
export default class TableProject extends Component{
	render() {
		return (
			<div>
				<div>
					<Button style={{ marginRight: "20px" }}>模板下载</Button>
					<Button onClick={this.send.bind(this)} className={style.button}>批量创建</Button>
					<Button className={style.button}>申请变更</Button>
					<Button className={style.button}>申请删除</Button>
					<Button className={style.button}>导出表格</Button>
					<Search className={style.button} style={{ width: "200px" }} placeholder="请输入内容" />
				</div>
				<Table
					width="1280px"
					columns={this.columns}
					bordered={true}
					rowSelection={this.rowSelection}
					dataSource={this.dataSource}
				>
				</Table>
			</div>
		)
	}
	send() {
		const { actions: { ModalVisibleProject } } = this.props;
		ModalVisibleProject(true);
	}
    componentDidMount(){

    }
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
		},
	};
	dataSource = []
	columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'Index',
      }, {
        title: '项目/子项目名称',
        dataIndex: 'code',
        key: 'Code',
      }, {
        title: '所属项目',
        dataIndex: 'obj_type_hum',
        key: 'Obj_type_hum',
      },{
        title: '所属区域',
        dataIndex: 'name',
        key: 'Name',
      },{
        title: '项目规模',
        dataIndex: 'range',
        key: 'Range',
      },{
         title: '项目类型',
         dataIndex :'depart',
         key: 'Depart',
      },{
        title: '项目地址',
        dataIndex :'direct',
        key: 'Direct',
      },{
        title: '项目红线坐标',
        dataIndex :'project',
        key: 'Project',
      },{
        title: '项目负责人',
        dataIndex :'remarks',
        key:'Remarks'
      },{
        title: '计划开工日期',
        dataIndex :'time',
        key:'Time'
      },{
        title: '计划竣工日期',
        dataIndex :'time',
        key:'Time'
      },{
          title:'附件',
          key:'oper',
          render:(record) => (
            <span>
                附件
            </span>
          )
      },{
        title:'项目图片',
        key:'pic',
        render:(record) => (
          <span>
            图片
          </span>
        )
    }]
}
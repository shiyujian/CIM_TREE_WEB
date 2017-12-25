import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TablePerson extends Component{
    render(){
        return (
            <div>
                <div>
                    <Button style={{marginRight:"10px"}}>模板下载</Button>
                    <Button className = {style.button} onClick = {this.send.bind(this)}>发送填报</Button>
                    <Button className = {style.button} onClick = {this.modify.bind(this)}>申请变更</Button>
                    <Button className = {style.button} onClick = {this.expurgate.bind(this)}>申请删除</Button>
                    <Button className = {style.button}>导出表格</Button>
                    <Search className = {style.button} style={{width:"200px"}} placeholder="输入搜索条件" />
                </div>
                <Table
                    columns = {this.columns}
                    bordered = {true}
                    rowSelection={this.rowSelection}
                    dataSource = {this.dataSource}
                >
                </Table>
            </div>
        )
    }
    //发送
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}
	//批量删除
	expurgate() {
		const { actions: { ExprugateVisible } } = this.props;
		ExprugateVisible(true);
	}
	//批量变更
	modify() {
		const { actions: { ModifyVisible } } = this.props;
		ModifyVisible(true);
	}
	componentDidMount() {
		
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

    //删除
    delete(){
        
    }

	columns = [{
		title: '人员编码',
		dataIndex: 'code',
		key: 'Code',
	}, {
		title: '姓名',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '所在组织机构单位',
		dataIndex: 'org',
		key: 'Org',
	}, {
		title: '所属部门',
		dataIndex: 'depart',
		key: 'Depart',
	}, {
		title: '职务',
		dataIndex: 'job',
		key: 'Job',
	}, {
		title: '性别',
		dataIndex: 'sex',
		key: 'Sex'
	}, {
		title: '手机号码',
		dataIndex: 'tel',
		key: 'Tel'
	}, {
		title: '邮箱',
		dataIndex: 'email',
		key: 'Email'
	}, {
		title: '二维码',
		dataIndex: 'signature',
		key: 'Signature'
	}, {
		title: '编辑',
		dataIndex: 'edit',
		render:(record) => {
            return  (
                <Popconfirm
                    placement="leftTop"
                    title="确定删除吗？"
                    onConfirm={this.delete.bind(this)}
                    okText="确认"
                    cancelText="取消"
                >
                    <a>删除</a>
                </Popconfirm>
            )
        }
	}]
}
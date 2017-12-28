import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon} from 'antd';
import style from './TableOrg.css'
import DelPer from './PersonExpurgate';
const Search = Input.Search;
export default class TablePerson extends Component{
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			deleData: [],
			modData: [],
			tempData:[],
		}
	}
    render(){
        return (
            <div>
                <div>
                    <Button style={{marginRight:"10px"}}>模板下载</Button>
                    <Button className = {style.button} onClick = {this.send.bind(this)}>发送填报</Button>
                    <Button className = {style.button} onClick = {this.modify.bind(this)}>申请变更</Button>
                    <Button className = {style.button} onClick = {this.expurgate.bind(this)}>申请删除</Button>
                    <Button className = {style.button}>导出表格</Button>
                    <Search className = {style.button} onSearch = {this.searchOrg.bind(this)} style={{width:"200px"}} placeholder="输入搜索条件" />
                </div>
                <Table
                    columns = {this.columns}
                    bordered = {true}
                    rowSelection={this.rowSelection}
                    dataSource = {this.state.tempData}
                    rowKey = "index"
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
		const { actions: { ExprugateVisible, setDeletePer } } = this.props;
		if(this.state.deleData.length){
			setDeletePer(this.state.deleData);
			ExprugateVisible(true);
		}else{
			message.warning("请先选中要删除的数据");
		}
	}
	//批量变更
	modify() {
		const { actions: { ModifyVisible, setModifyPer } } = this.props;
		if(this.state.modData.length) {
			console.log('modData', this.state.modData)
			setModifyPer(this.state.modData)
			ModifyVisible(true);
		} else {
			message.warning("请先选中要变更的数据");
		}
	}
	async componentDidMount() {
		const {actions: {getAllUsers}} = this.props;
		let dataSource = await getAllUsers();
		dataSource.forEach((item, index) => {
			dataSource[index].index = index + 1;
		})
		this.setState({dataSource, tempData: dataSource})
	}

	searchOrg(value){
		let searchData = [];
		let searchPer = this.state.dataSource
		searchPer.map(rst => {
			console.log("rst", rst.account.organization)
			if (rst.account.organization.indexOf(value) != -1) {
				searchData.push(rst);
			}
		})
		searchData.map((item, index)=> {
			item.index = index + 1;
		})
		this.setState({
			tempData:searchData
		})
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			this.setState({
				deleData:selectedRows,
				modData: selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
			this.setState({
				deleData:selectedRows,
				modData: selectedRows
			})
		},
	};

    //删除
    delete(){
        
    }
    
	columns = [{
		title: '序号',
		dataIndex: 'index',
		key: 'Index',
	}, {
		title: '人员编码',
		dataIndex: 'account.person_code',
		key: 'Code',
	}, {
		title: '姓名',
		dataIndex: 'account.person_name',
		key: 'Name',
	}, {
		title: '所在组织机构单位',
		dataIndex: 'account.organization',
		key: 'Org',
	}, {
		title: '所属部门',
		dataIndex: 'account.org_code',
		key: 'Depart',
	}, {
		title: '职务',
		dataIndex: 'account.title',
		key: 'Job',
	}, {
		title: '性别',
		dataIndex: 'account.gender',
		key: 'Sex'
	}, {
		title: '手机号码',
		dataIndex: 'account.person_telephone',
		key: 'Tel'
	}, {
		title: '邮箱',
		dataIndex: 'email',
		key: 'Email'
	}, {
		title: '二维码',
		dataIndex: 'account.person_signature_url',
		key: 'Signature'
	}, {
		title: '编辑',
		dataIndex: 'edit',
	}]
}
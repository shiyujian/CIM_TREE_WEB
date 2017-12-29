import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Spin} from 'antd';
import style from './TableOrg.css'
import DelPer from './PersonExpurgate';
import {DataReportTemplate_PersonInformation, NODE_FILE_EXCHANGE_API} from '_platform/api';

const Search = Input.Search;
export default class TablePerson extends Component{
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			selectData: [],
			tempData:[],
			spinning: false,
		}
	}
    render(){
        return (
            <div>
	            <Spin spinning = {this.state.spinning}>
	                <div>
	                    <Button style={{marginRight:"10px"}} onClick={this.createLink.bind(this,'muban',`${DataReportTemplate_PersonInformation}`)} type="default">模板下载</Button>
	                    <Button className = {style.button} onClick = {this.send.bind(this)}>发送填报</Button>
	                    <Button className = {style.button} onClick = {this.modify.bind(this)}>申请变更</Button>
	                    <Button className = {style.button} onClick = {this.expurgate.bind(this)}>申请删除</Button>
	                    <Button className = {style.button} onClick={this.getExcel.bind(this)}>导出表格</Button>
	                    <Search className = {style.button} onSearch = {this.searchOrg.bind(this)} style={{width:"200px"}} placeholder="输入搜索条件" />
	                </div>
	                <Table
	                    columns = {this.columns}
	                    bordered = {true}
	                    rowSelection={this.rowSelection}
	                    dataSource = {this.state.tempData}
	                    rowKey = "index"
	                    pagination={this.paginationInfo}
	                >
	                </Table>
                </Spin>
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
		if(this.state.selectData.length){
			setDeletePer(this.state.selectData);
			ExprugateVisible(true);
		}else{
			message.warning("请先选中要删除的数据");
		}
	}
	//批量变更
	modify() {
		const { actions: { ModifyVisible, setModifyPer } } = this.props;
		if(this.state.selectData.length) {
			console.log('selectData', this.state.selectData)
			setModifyPer(this.state.selectData)
			ModifyVisible(true);
		} else {
			message.warning("请先选中要变更的数据");
		}
	}

	// 导出excel表格
	getExcel(){
		console.log("dfgfg:",this.state.excelData);
		if(this.state.excelData !== undefined || this.state.excelData.length) {
			let exhead = ['人员编码','姓名','所在组织机构单位','所属部门','职务','性别','手机号码','邮箱'];
			let rows = [exhead];
			let getcoordinate = (param)=>{
				if(typeof param !=='string'){
					return'';
				}
				if((!param||param.length<=0)){
					return ''
				}else{
					return param;
				}
			}
			let excontent =this.state.excelData.map(data=>{
				console.log('data',data)
				return [
					data.account.person_code || '', 
					data.account.person_name || '', 
					data.account.organization || '', 
					data.account.org_code ||'', 
					data.account.title ||'', 
					data.account.gender || '',
					data.account.person_telephone || '',
					data.email ||''
				];
			});
			rows = rows.concat(excontent);
			const {actions:{jsonToExcel}} = this.props;
			console.log(rows)
	        jsonToExcel({},{rows:rows})
	        .then(rst => {
	            console.log(rst);
	            this.createLink('人员信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
	        })
		}else {
			message.warning("请先选中要导出的数据");
		}
	}

	//下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	async componentDidMount() {
		this.setState({spinning:true});
		const {actions: {getAllUsers}} = this.props;
		let dataSource = await getAllUsers();
		dataSource.forEach((item, index) => {
			dataSource[index].index = index + 1;
		})
		this.setState({dataSource, tempData: dataSource, spinning: false })
	}

	searchOrg(value){
		console.log('value',value)
		let searchData = [];
		let searchPer = this.state.dataSource
		searchPer.map(rst => {
			console.log("rst", rst)
			if (rst.account.organization.indexOf(value) != -1 || rst.account.person_name.indexOf(value) != -1) {
				searchData.push(rst);
			}
			// if (typeof(rst.account.org_code) === null && rst.account.org_code.indexOf(value) !== -1) {
			// 	console.log('value1',value)
			// 	searchData.push(rst);
			// }
			// if (typeof(rst.account.person_code) === null && rst.account.person_code.indexOf(value) != -1) {
			// 	searchData.push(rst);
			// }
			// if (typeof(rst.account.person_name) === null && rst.account.person_name.indexOf(value) != -1) {
			// 	searchData.push(rst);
			// }
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
				selectData:selectedRows,
				excelData:selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
			this.setState({
				selectData:selectedRows,
				excelData:selectedRows
			})
		},
	};

    //删除
    delete(){
        
    }

    paginationOnChange(e) {
		// console.log('vip-分页', e);
	}

    paginationInfo = {
		onChange: this.paginationOnChange,
		showSizeChanger: true,
		pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
		showQuickJumper: true,
		// style: { float: "left", marginLeft: 70 },
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
		// dataIndex: 'account.person_signature_url',
		// key: 'Signature',
		render:(record) => {
            return (
                <img style={{width:"60px"}} src = {record.account.relative_avatar_url} />
            )
        }
	}]
}
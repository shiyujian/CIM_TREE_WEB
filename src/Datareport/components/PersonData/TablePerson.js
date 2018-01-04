import React, {Component} from 'react';
import {Table,Button,Popconfirm,Notification,Input,Icon,Spin,Progress} from 'antd';
import style from './TableOrg.css'
import DelPer from './PersonExpurgate';
import {DataReportTemplate_PersonInformation, NODE_FILE_EXCHANGE_API, STATIC_DOWNLOAD_API} from '_platform/api';

const Search = Input.Search;
export default class TablePerson extends Component{
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			selectData: [],
			tempData:[],
			loading: false,
			percent: 0,
		}
	}
    render(){
    	console.log('dataSource',this.state.tempData)
        return (
            <div>
                <div>
                    {/*<Button style={{marginRight:"10px"}} onClick={this.createLink.bind(this,'muban',`${DataReportTemplate_PersonInformation}`)} type="default">模板下载</Button>*/}
                    <Button style={{marginRight:"10px"}} onClick = {this.send.bind(this)}>发送填报</Button>
                    <Button className = {style.button} onClick = {this.modify.bind(this)}>申请变更</Button>
                    <Button className = {style.button} onClick = {this.expurgate.bind(this)}>申请删除</Button>
                    <Button className = {style.button} onClick={this.getExcel.bind(this)}>导出表格</Button>
                    <Search className = {style.button} onSearch = {this.searchOrg.bind(this)} style={{width:"240px"}} placeholder="请输入人员编码或姓名或组织机构单位" />
                </div>
                <Table
                    columns = {this.columns}
                    bordered = {true}
                    rowSelection={this.rowSelection}
                    dataSource = {this.state.tempData}
                    rowKey = "index"
                    pagination={this.paginationInfo}
                    loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
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
		if(this.state.selectData.length){
			setDeletePer(this.state.selectData);
			ExprugateVisible(true);
		}else{
			Notification.warning({
				message: "请先选择数据"
			});
		}
	}
	//批量变更
	modify() {
		const { actions: { ModifyVisible, setModifyPer } } = this.props;
		if(this.state.selectData.length) {
			let dataList = [];
			this.state.selectData.map(item => {
				let newList = {...item}
				newList.account = {...newList.account}
				dataList.push(newList)
			})
			setModifyPer(dataList)
			ModifyVisible(true);
		} else {
			Notification.warning({
				message: "请先选择数据"
			});
		}
	}

	// 导出excel表格
	getExcel(){
		if(this.state.excelData !== undefined) {
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
				return [
					data.account.person_code || '', 
					data.account.person_name || '', 
					data.account.organization || '', 
					data.account.org_code || '', 
					data.account.title || '', 
					data.account.gender || '',
					data.account.person_telephone || '',
					data.email || ''
				];
			});
			rows = rows.concat(excontent);
			const {actions:{jsonToExcel}} = this.props;
	        jsonToExcel({},{rows:rows})
	        .then(rst => {
	            this.createLink('人员信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
	        })
		}else {
			Notification.warning({
				message: "请先选择数据"
			});
			return;
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
		const {actions: {getAllUsers}} = this.props;
		this.setState({loading:true,percent:0});
		let dataSource = await getAllUsers();
		dataSource.forEach((item, index) => {
			dataSource[index].index = index + 1;
		})
		this.setState({dataSource, tempData: dataSource, loading:false, percent:100 })
	}
	// async componentDidMount() {
	// 	const {actions: {getAllUsers}} = this.props;
	// 	getAllUsers().then(rst => {
	// 		this.generateTableData(rst)
	// 	})
	// }
	// generateTableData(data) {
	// 	let dataSour = [];
	// 	let datalength = data.length;
	// 	this.setState({loading: true, percent: 0, index: 0});
	// 	data.map((item, index) => {
	// 		let datas = {
	// 			index: index + 1,
	// 			code: item.account.person_code,
	// 			name: item.account.person_name,
	// 			org: item.account.organization,
	// 			depart: item.account.org_code,
	// 			job: item.account.title,
	// 			sex: item.account.gender,
	// 			tel: item.account.person_telephone,
	// 			email: item.email,
	// 		}
	// 		this.setState({percent:parseFloat((index * 100 / datalength).toFixed(2))})
	// 		dataSour.push(datas)
	// 		console.log('dataSour',dataSour)
	// 	})
	// 	this.setState({
	// 		dataSource:dataSour,
	// 		tempData:dataSour,
	// 		loading:false,
	// 		percent:100
	// 	})
	// }

	searchOrg(value){
		let searchData = [];
		let searchPer = this.state.dataSource
		searchPer.map(rst => {
			if (
					rst.account.organization.indexOf(value) != -1 || 
					rst.account.person_name.indexOf(value) != -1 || 
					rst.account.person_code.indexOf(value) != -1
				) {
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
				selectData:selectedRows,
				excelData:selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
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
            if(record.account.relative_signature_url !== '') {
            	return <img style={{width: 60}} src={record.account.person_signature_url}/>
            }else {
            	return <span>暂无</span>
            }
        }
	}]
}
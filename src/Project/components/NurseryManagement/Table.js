import React, {Component} from 'react';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification, Select,Popconfirm
} from 'antd';
// import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
import Addition from './Addition';
import Edite from './Edite';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;



export default class Tablelevel extends Component {
    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			searchList:[],
			search:false,
			searchValue:''
        }
	}
	
	static layoutT = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };
    static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 20},
    };

	render() {
		const {
			nurseryList = [],
		} = this.props;
		const{
			searchList,
			search
		}= this.state
		let dataSource = [];
		if(search){
			dataSource = searchList
		}else{
			dataSource = nurseryList
		}

		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		let superuser = false
		if(user && user.is_superuser){
			superuser = true
		}
		console.log('user',user);
		console.log('superuser',superuser);
		console.log('nurseryList',nurseryList);
		return (
			<div>
				<div>
					<Row>
						<Col span={6}>
							<h3>苗圃列表</h3>
						</Col>
						<Col span={12}>
							<label style={{minWidth: 60,display: 'inline-block'}}>苗圃名称:</label>
							<div className='search_input'>
								<Select placeholder="请选择苗圃名称" onChange={this.search.bind(this)}
									showSearch style={{ width: '100%' }} allowClear value={this.state.searchValue}
								>
									{
										nurseryList.map((rst)=>{
											return (<Option key={rst.ID} value={rst.NurseryName}>{rst.NurseryName}</Option>)
										})
									}
								</Select>
							</div>
						</Col>
						<Col span={6}>
							<Addition {...this.props} {...this.state}/>
						</Col>
					</Row>
					<Row style={{marginTop:5}}>
						<Col span={24}>
							<Table dataSource={dataSource}
							columns={superuser?this.columns:this.columns1}
							bordered />
							<Edite {...this.props} {...this.state}/>
						</Col>
					</Row>
				</div>
			</div>
			
		);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.nurseryList != this.props.nurseryList){
			this.setState({
				searchValue:''
			})
			this.search()
		}
	}

	search(value){
		console.log('value',value)
		this.setState({
			searchValue:value
		})
		let searchList = []
		const {
			nurseryList = [],
		} = this.props;
		
		if(value){
			console.log('nurseryListnurseryListnurseryList',nurseryList)
			nurseryList.map((item)=>{
				if(item && item.NurseryName){
					if(item.NurseryName.indexOf(value) > -1){
						searchList.push(item)
					}
				}
			})
			this.setState({
				searchList:searchList,
				search:true
			})
		}else{
			this.setState({
				dataSource:[],
				search:false
			})
		}
		
	}
    

    componentDidMount() {
		const {actions:{getNurseryList}} =this.props;
		getNurseryList()
	}

	edite(record){
		const{
			actions:{changeEditVisible}
		}=this.props
		changeEditVisible(true)
	}
	delet(record){
		const{
			actions:{
				deleteNursery,
				getNurseryList
			}
		}=this.props
		const{
			searchValue
		}=this.state
		let me = this;
		let deleteID = {
			ID:record.ID
		}
		deleteNursery(deleteID).then((rst)=>{
			console.log('rst',rst)
			if(rst && rst.code && rst.code===1){
				notification.success({
					message: '苗圃删除成功',
					duration: 3
				}) 
			}else{
				notification.error({
					message:'苗圃删除失败',
					duration:3
				})
			}
			getNurseryList().then((item)=>{
				if(searchValue){
					me.search(searchValue)
				}
			})

		})
	}
	columns=[
		{
			title:'苗圃ID',
			key:'ID',
            dataIndex:'ID',
		},{
			title:'供应商',
			key:'Factory',
			dataIndex:'Factory',
		},{
			title:'苗圃名称',
			key:'NurseryName',
			dataIndex:'NurseryName',
		},{
			title:'行政区划编码',
			key:'RegionCode',
			dataIndex:'RegionCode',
		},{
			title:'行政区划',
			key:'RegionName',
			dataIndex:'RegionName',
		},{
			title:'产地',
			key:'TreePlace',
			dataIndex:'TreePlace',
		},{
			title:'操作',
			key:'operate',
			dataIndex:'operate',
			render: (text, record, index) =>{
				return(
                    <div>
                        <a onClick={this.edite.bind(this,record)}>修改</a>
                        <span className="ant-divider" />
						<Popconfirm title="是否真的要删除该苗圃?"
									onConfirm={this.delet.bind(this,record)} okText="是" cancelText="否">
									<a>删除</a>
						</Popconfirm>
                    </div>
                )
			}
		}
	];

	columns1=[
		{
			title:'苗圃ID',
			key:'ID',
            dataIndex:'ID',
		},{
			title:'供应商',
			key:'Factory',
			dataIndex:'Factory',
		},{
			title:'苗圃名称',
			key:'NurseryName',
			dataIndex:'NurseryName',
		},{
			title:'行政区划编码',
			key:'RegionCode',
			dataIndex:'RegionCode',
		},{
			title:'行政区划',
			key:'RegionName',
			dataIndex:'RegionName',
		},{
			title:'产地',
			key:'TreePlace',
			dataIndex:'TreePlace',
		},{
			title:'操作',
			key:'operate',
			dataIndex:'operate',
			render: (text, record, index) =>{
				return(
                    <div>
                        <a onClick={this.edite.bind(this,record)}>修改</a>
                    </div>
                )
			}
		}
	];
}

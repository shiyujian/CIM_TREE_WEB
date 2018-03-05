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
			record:{}
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
			search
		}= this.state
		let dataSource = [];
		let searchList = this.query()
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
		console.log('dataSource',dataSource);
		return (
			<div>
				<div>
					<Row>
						<Col span={6}>
							<h3>苗圃列表</h3>
						</Col>
						<Col span={12}>
							<label style={{minWidth: 60,display: 'inline-block'}}>苗圃名称:</label>
							<Input id='NurseryData' className='search_input'/>
 							<Button type='primary' onClick={this.search.bind(this)} style={{minWidth: 30,display: 'inline-block',marginRight:20}}>查询</Button>
 							<Button onClick={this.clear.bind(this)} style={{minWidth: 30,display: 'inline-block'}}>清空</Button>
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
			this.search()
		}
	}

	search(){
		this.setState({
			search:true
		})
	}

	query(){

		let	text = document.getElementById("NurseryData");
		console.log('text',text)
		let value = ''
		if(text && text.value){
			value = text.value
		}
		console.log('value',value)
		let searchList = []
		const {
			nurseryList = [],
		} = this.props;
		if(value){
			nurseryList.map((item)=>{
				if(item && item.NurseryName){
					if(item.NurseryName.indexOf(value) > -1){
						searchList.push(item)
					}
				}
			})
			return searchList
		}else{
			return nurseryList
		}
		
	}
	clear(){
		document.getElementById("NurseryData").value = ''
		this.setState({
			search:false
		})
	}

    componentDidMount() {
		const {actions:{getNurseryList}} =this.props;
		getNurseryList()
	}

	edite(record){
		const{
			actions:{changeEditVisible}
		}=this.props
		console.log('editerecord',record)
		this.setState({
			record:record
		},()=>{
			changeEditVisible(true)
		})
		
	}
	delet(record){
		const{
			actions:{
				deleteNursery,
				getNurseryList
			}
		}=this.props
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
				me.search()
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

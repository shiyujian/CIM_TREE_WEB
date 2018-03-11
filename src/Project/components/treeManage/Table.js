import React, {Component} from 'react';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification, Select,Popconfirm
} from 'antd';
// import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
import Addition from './Addition';
import Edite from './Edite';
import './index.less';
import { FOREST_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;


export default class Tablelevel extends Component {
    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			searchList:[],
			search:false,
			record:{},
			imgvisible:false
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
			treeList = [],
		} = this.props;
		const{
			search
		}= this.state
		let dataSource = [];
		let searchList = this.query()
		if(search){
			dataSource = searchList
		}else{
			dataSource = treeList
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
							<h3>树种列表</h3>
						</Col>
						<Col span={12}>
							<label style={{minWidth: 60,display: 'inline-block'}}>树种名称:</label>
							<Input id='TreeData' className='search_input'/>
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

				<Modal
						width={522}
						title='详细信息'
						style={{textAlign:'center'}}
						visible={this.state.imgvisible}
						onOk={this.handleCancel.bind(this)}
						onCancel={this.handleCancel.bind(this)}
					>
					<img style={{width:"490px"}} src={this.state.src} alt="图片"/>
				</Modal>
				</div>
			</div>
			
		);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.treeList != this.props.treeList){
			this.search()
		}
	}

	search(){
		this.setState({
			search:true
		})
	}
	
	query(){

		let	text = document.getElementById("TreeData");
		console.log('text',text)
		let value = ''
		if(text && text.value){
			value = text.value
		}
		console.log('value',value)
		let searchList = []
		const {
			treeList = [],
		} = this.props;
		if(value){
			treeList.map((item)=>{
				if(item && item.TreeTypeName){
					if(item.TreeTypeName.indexOf(value) > -1){
						searchList.push(item)
					}
				}
			})
			return searchList
		}else{
			return treeList
		}
		
	}
	clear(){
		document.getElementById("TreeData").value = ''
		this.setState({
			search:false
		})
	}

    componentDidMount() {
		const {actions:{getTreeList}} =this.props;
		getTreeList()
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
				getTreeList
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
					message: '树种删除成功',
					duration: 3
				}) 
			}else{
				notification.error({
					message:'树种删除失败',
					duration:3
				})
			}
			getTreeList().then((item)=>{
				me.search()
			})

		})
	}
	onImgClick(src) {
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true,})
		})
	}
	handleCancel(){
    	this.setState({imgvisible:false})
    }
	columns=[
		{
			title:'树种ID',
			key:'ID',
            dataIndex:'ID',
            width:'5%'
		},{
			title:'树种学名',
			key:'TreeTypeName',
			dataIndex:'TreeTypeName',
			width:'5%'
		},{
			title:'所属类型',
			key:'TreeTypeGenera',
			dataIndex:'TreeTypeGenera',
			width:'10%'
		},{
			title:'编码',
			key:'TreeTypeNo',
			dataIndex:'TreeTypeNo',
			width:'10%'
		},{
			title:'习性',
			key:'GrowthHabit',
			dataIndex:'GrowthHabit',
			width:'55%'
		},{
			title:'现场图',
			width:'5%',
			render: (text,record) => {
				if(record.Pics != null)
					return 	<div style={{textAlign:'center'}}>
								<a  disabled={!record.Pics} 
									onClick={this.onImgClick.bind(this,record.Pics)}>
								Img
								</a>
							</div>
				else {
					return <span>/</span>
				}
			}
		},{
			title:'操作',
			key:'operate',
			dataIndex:'operate',
			width:'10%',
			render: (text, record, index) =>{
				return(
                    <div>
                        <a onClick={this.edite.bind(this,record)}>修改</a>
                        <span className="ant-divider" />
						<Popconfirm title="是否真的要删除该树种?"
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
			title:'树种ID',
			key:'ID',
            dataIndex:'ID',
		},{
			title:'树种学名',
			key:'TreeTypeName',
			dataIndex:'TreeTypeName',
		},{
			title:'所属类型',
			key:'TreeTypeGenera',
			dataIndex:'TreeTypeGenera',
		},{
			title:'编码',
			key:'TreeTypeNo',
			dataIndex:'TreeTypeNo',
		},{
			title:'习性',
			key:'GrowthHabit',
			dataIndex:'GrowthHabit',
		},{
			title:'现场图',
			render: (text,record) => {
				if(record.Pics != 0)
					return <a disabled={!record.Pics} onClick={this.onImgClick.bind(this,record.Pics)}>img</a>
				else {
					return <span>/</span>
				}
			}
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

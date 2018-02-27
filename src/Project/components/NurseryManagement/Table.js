import React, {Component} from 'react';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification
} from 'antd';
// import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
import Addition from './Addition';
import Edite from './Edite';
import './index.less';
const FormItem = Form.Item;



export default class Tablelevel extends Component {
    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			searchList:[],
			search:false
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
							columns={this.columns}
							bordered />
							<Edite {...this.props} {...this.state}/>
						</Col>
					</Row>
				</div>
			</div>
			
		);
	}

	search(){
		let text = document.getElementById("NurseryData").value;
		console.log('text',text)
		let searchList = []
		const {
			nurseryList = [],
		} = this.props;
		nurseryList.map((item)=>{
			if(item && item.NurseryName){
				if(item.NurseryName.indexOf(text) > -1){
					searchList.push(item)
				}
			}
		})
		this.setState({
			searchList:searchList,
			search:true
		})
	}

	clear(){
		document.getElementById("NurseryData").value = ''
		this.setState({
			dataSource:[],
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
		changeEditVisible(true)
		this.setState({
			record:record
		})
		
	}
	columns=[
		{
			title:'ID',
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
                        {/* <span className="ant-divider" />
                        <a onClick={this.delet.bind(this,record)}>删除</a> */}
                    </div>
                )
			}
		}
	];
}

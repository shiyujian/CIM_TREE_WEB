import React, {Component} from 'react';
import {
	Form, Input,Button, Row, Col, Modal, Upload, Icon, message, Table,notification
} from 'antd';
// import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
import Addition from './Addition';
import Edite from './Edite';
const FormItem = Form.Item;


export default class Tablelevel extends Component {
    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
			dataSource:[]
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
       
		console.log('nurseryList',nurseryList);
		return (
			<Card title="苗圃列表" extra={<Addition {...this.props} {...this.state}/>}>
				<Table dataSource={nurseryList}
				       columns={this.columns}
				       bordered />
				<Edite {...this.props} {...this.state}/>
			</Card>
		);
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
			title:'序号',
			key:'serial',
            dataIndex:'serial',
            render: (text, record, index) => {
				return <span>{index+1}</span>;
			}
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

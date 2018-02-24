import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
import Addition from './Addition';


export default class Tablelevel extends Component {
    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            dataSource:[]
        }
    }

	render() {
        const {nurseryList = []} = this.props;
       
		console.log('nurseryList',nurseryList);
		return (
			<Card title="苗圃列表" extra={<Addition {...this.props} {...this.state}/>}>
				<Table dataSource={nurseryList}
				       columns={this.columns}
				       bordered />
			</Card>
		);
    }
    

    componentDidMount() {
		const {actions:{getNurseryList}} =this.props;
		getNurseryList()
	}

	columns=[
		{
			title:'序号',
            dataIndex:'index',
            render: (text, record, index) => {
				return <span>{index+1}</span>;
			}
		},{
			title:'供应商',
			dataIndex:'Factory',
		},{
			title:'苗圃名称',
			dataIndex:'NurseryName',
		},{
			title:'行政区划编码',
			dataIndex:'RegionCode',
		},{
			title:'行政区划',
			dataIndex:'RegionName',
		},{
			title:'产地',
			dataIndex:'TreePlace',
		}
	];
}

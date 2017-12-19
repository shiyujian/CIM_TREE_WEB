import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';

export default class Tablelevel extends Component {

	render() {
		const {dir = []} = this.props;

		return (
			<Card title="模板名">
				<Table dataSource={dir}
				       columns={this.columns}
				       bordered rowKey="code"/>
			</Card>
		);
	}

	columns=[{
			title:'名字',
			dataIndex:'name',
		},{
			title:'编码',
			dataIndex:'code',
		},{
			title:'操作',
			render:(record) =>{
				return(
					<div>
						<a onClick={this.look.bind(this,record)}>查看关键字</a>
					</div>
				)
			}
		},
	];

	look(record){
		const {actions:{setkeyvisible,savekeyword,setcurrentrecord,setvalue}} = this.props;
		setkeyvisible(true);
		console.log(record);
		savekeyword(record.extra_params.newdocs);
		setcurrentrecord(record)
		setvalue();
	};

}

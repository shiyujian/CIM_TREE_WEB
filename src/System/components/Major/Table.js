import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const Majorcode = window.DeathCode.SYSTEM_MAJOR;
export default class Tablelevel extends Component {

	render() {
		const {newprofessionlist = []} = this.props;

		return (
			<Card title="专业设置" extra={<Button type="primary" ghost onClick={this.levelAdd.bind(this, true)}>添加专业</Button>}>
				<Table dataSource={newprofessionlist}
				       columns={this.columns}
				       bordered rowKey="code"/>
			</Card>
		);
	}

	columns=[
		{
			title:'序号',
			dataIndex:'on',
			width: '10%',
		},{
			title:'专业名称',
			dataIndex:'name',
			width: '30%',
		},{
			title:'专业编码',
			dataIndex:'code',
			width: '30%',
		},{
			title:'操作',
			width: '30%',
			render:(record) =>{
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.eidte.bind(this,record)}>编辑</a>
						<span className="ant-divider" />
						<Popconfirm title="确认删除该文件吗?" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
							<a onClick={this.del.bind(this,record)}>删除</a>
						</Popconfirm>
					</div>
				);
				return nodes;
			}
		},
	];

	levelAdd(){
		const {actions:{levelAdding}} = this.props;
		levelAdding(true);
	}

	eidte(file) {
		const {actions:{leveledite,seteditefile}} = this.props;
		leveledite(true);
		seteditefile(file);
	}

	del(file){
		const{actions:{setedelfile}} =this.props;
		setedelfile(file);
	}

	confirm(){
		const {delfile} = this.props;
		let dexx = delfile.on-1;
		const {actions:{deletedocument,getmajorlist}} = this.props;
		deletedocument({code:Majorcode,dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			getmajorlist({code:Majorcode}).then(rst =>{
				let newprofessionlists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newprofessionlists[index].on = index+1;
				});
				const {actions:{setnewprofessionlist}} = this.props;
				setnewprofessionlist(newprofessionlists);
			})
		});
	}

	cancel(){}

}

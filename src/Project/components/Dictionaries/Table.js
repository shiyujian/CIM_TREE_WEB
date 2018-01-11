import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const Keyword = window.DeathCode.SETUP_KEYWORD;

export default class Tablelevel extends Component {

	render() {
		const {newdictionlist = []} = this.props;
		// console.log(newdictionlist)
		newdictionlist.reverse();
		return (
			<Card title="字典关键字" extra={<Button type="primary" ghost onClick={this.levelAdd.bind(this)}>添加关键字</Button>}>
				<Table dataSource={newdictionlist}
				       columns={this.columns}
				       bordered
				       rowKey="code"/>
			</Card>
		);
	}

	columns=[
		{
			title:'序号',
			dataIndex:'on',
			key:'on'
		},{
			title:'关键字名称',
			dataIndex:'name',
			key:'name'
		},{
			title:'关键字编码',
			dataIndex:'code',
			key:'code'
		},{
			title:'操作',
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
		// message.warning('确认删除该文件吗！');
		const{actions:{setedelfile}} =this.props;
		setedelfile(file);
	}

	confirm(){
		const {delfile} = this.props;
		console.log(delfile)
		let dexx = delfile.on-1;
		const {actions:{deletedocument,getdictionlist}} = this.props;
		deletedocument({code:Keyword,dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			getdictionlist({code:Keyword}).then(rst =>{
				let newdiclists = rst.metalist;
				console.log(newdiclists)
				rst.metalist.map((wx,index) => {
					newdiclists[index].on = index+1;
				});
				const {actions:{setnewdiclist}} = this.props;
				setnewdiclist(newdiclists);
			})
		});
	}

	cancel(){}

}

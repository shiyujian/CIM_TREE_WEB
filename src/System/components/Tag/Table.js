import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
export default class Tablelevel extends Component {

	render() {
		const {newtaglist = []} = this.props;

		return (
			<Card title="工程量清单设置" extra={
				<div>
				    <Button type="primary" ghost onClick={this.levelAdd.bind(this, true)}>添加工程量项</Button>
					<Button type="primary" ghost onClick={this.Add.bind(this,true)}>批量添加</Button>
				</div>	}>
				<Table dataSource={newtaglist}
				       columns={this.columns}
				       bordered rowKey="code"/>
			</Card>
		);
	}

	columns=[
		{
			title:'序号',
			dataIndex:'on',
		},{
			title:'工程量项',
			dataIndex:'name',
		},{
			title:'工程量项编码',
			dataIndex:'code',
		},{
			title:'项目特征',
			dataIndex:'simple',
		},{
			title:'工程单位',
			dataIndex:'unit',
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

	Add(){
		const {actions:{Adding}} = this.props;
		Adding(true);
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
		let dexx = delfile.on-1;
		const {actions:{deletedocument,gettaglist}} = this.props;
		deletedocument({code:'Taglist',dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			gettaglist({code:'Taglist'}).then(rst =>{
				let newtaglists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newtaglists[index].on = index+1;
				});
				const {actions:{setnewtaglist}} = this.props;
				setnewtaglist(newtaglists);
			})
		});
	}

	cancel(){}

}

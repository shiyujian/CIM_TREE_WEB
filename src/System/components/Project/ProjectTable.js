import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const designcode = window.DeathCode.SYSTEM_PROJECT;
export default class Tablelevel extends Component {

	render() {
		const {NewProjectlist = []} = this.props;

		return (
			<Card title="项目阶段设置" extra={<Button type="primary" ghost onClick={this.Add.bind(this, true)}>添加项目阶段</Button>}>
				<Table dataSource={NewProjectlist}
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
			title:'项目阶段名称',
			dataIndex:'name',
			width: '30%',
		},{
			title:'项目阶段编码',
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

	Add(){
		const {actions:{Adding}} = this.props;
		Adding(true);
	}

	eidte(file) {
		const {actions:{edite,seteditefile}} = this.props;
		edite(true);
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
		console.log(dexx);
		const {actions:{deletedocument,getProject}} = this.props;
		deletedocument({code:'Projectphase',dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			getProject({code:'Projectphase'}).then(rst =>{
				let newProjectphase = rst.metalist;
				rst.metalist.map((wx,index) => {
					newProjectphase[index].on = index+1;
				});
				const {actions:{setnewProject}} = this.props;
				setnewProject(newProjectphase);
			});
		});
	}

	cancel(){}

}

import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const designcode = window.DeathCode.SYSTEM_PROJECT;
export default class Tablelevel extends Component {

	render() {
		const {newstagelist = []} = this.props;

		return (
			<Card title="设计阶段设置" extra={<Button type="primary" ghost onClick={this.levelAdd.bind(this, true)}>添加设计阶段</Button>}>
				<Table dataSource={newstagelist}
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
			title:'设计阶段名称',
			dataIndex:'name',
			width: '30%',
		},{
			title:'设计阶段编码',
			dataIndex:'code',
			width: '30%',
		},{
			title:'操作',
			width: '30%',
			render:(record) =>{
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.edite.bind(this,record)}>编辑</a>
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

	edite(file) {
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
		console.log(dexx);
		const {actions:{deletedocument,getstage}} = this.props;
		deletedocument({code:designcode,dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			getstage({code:designcode}).then(rst =>{
				let newstagelists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newstagelists[index].on = index+1;

				});
				const {actions:{setnewstagelist}} = this.props;
				setnewstagelist(newstagelists);
			})
		});
	}

	cancel(){}

}

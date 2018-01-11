import React, {Component} from 'react';
import {Table, message,Popconfirm} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
export default class Tablelevel extends Component {

	render() {
		const {newhiddenlist = []} = this.props;

		return (
			<Card title="安全隐患等级" extra={<Button type="primary" ghost onClick={this.levelAdd.bind(this, true)}>添加安全隐患等级</Button>}>
				<Table dataSource={newhiddenlist}
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
			title:'安全隐患等级名称',
			dataIndex:'name',
		},{
			title:'安全隐患等级编码',
			dataIndex:'code',
		},{
			title:'图标',
			dataIndex:'extra_params.time',
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
		let dexx = delfile.on-1;
		const {actions:{deletedocument,gethiddenlist}} = this.props;
		deletedocument({code:hiddencode,dex:dexx}).then(rst =>{
			message.success('删除文件成功！');
			gethiddenlist({code:hiddencode}).then(rst =>{
				let newhiddenlists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newhiddenlists[index].on = index+1;
				});
				const {actions:{setnewhiddenlist}} = this.props;
				setnewhiddenlist(newhiddenlists);
			})
		});
	}

	cancel(){}

}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Spin,message} from 'antd';
import moment from 'moment';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';

export default class GeneralTable extends Component {

	render() {
		const {extradir= {}} = this.props;
		//console.log(comdir);
		return (
			<Card title="工程字段" extra={<Button type="primary" ghost onClick={this.add.bind(this)}>添加字段</Button>}>
				<Table dataSource={extradir.newdocs}
				       columns={this.columns}
				       bordered rowKey="code"/>
			</Card>
		);
	}

	columns=[
		{
			title:'字段类型',
			dataIndex:'name',
		},{
			title:'操作',
			render:(record) =>{
				return(
					<div>
						<a onClick={this.del.bind(this,record)}>删除</a>
					</div>
				)
			}
		}
	];

	add(){
		const {actions:{setAddvisible}} = this.props
		setAddvisible(true);
	}

	del(delfile){
		const {extradir ={},selectcode ={},parentdir={},actions:{putdir,getparentdir}} = this.props;
		let a = extradir.newdocs.indexOf(delfile);
		extradir.newdocs.splice(a,1);
		let newdocs = extradir.newdocs;
		putdir({code:selectcode},{
			status:"A",
			extra_params:{
				newdocs
			},
			parent:{
				pk:parentdir.pk,
				code:parentdir.code,
				obj_type:"C_DIR"
			}
		}).then(rst =>{
			message.success('删除关键字成功！');
			getparentdir({code: selectcode});
		});
	}

}

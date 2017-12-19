import React, {Component} from 'react';
import {Table, message,Popconfirm,Select} from 'antd';
import Button from "antd/es/button/button";
import Card from '_platform/components/panels/Card';
const Option = Select.Option;
export default class Tablelevel extends Component {

	render() {
		const {savekeys = [],keyword=[],currentrecord={},changevalue=[]} = this.props;

		console.log(111,savekeys);

		return (
			<Card title="关键字名">
				<Select
					labelInValue
					mode="multiple"
					style={{ width: '100%' }}
					placeholder="Please select"
					value={changevalue}
					onChange={this.handleChange.bind(this)}
				>
					{
						keyword.map((pkg,index) => {
							return <Option key={pkg.code}
							               value={pkg.code}>{pkg.name}</Option>;
						})
					}
				</Select>
				<Table pagination={false}
					   dataSource={savekeys}
				       columns={this.columns}
				       bordered
				       rowKey="code"/>
				<Button onClick={this.save.bind(this)}>保存至{currentrecord.name}</Button>
			</Card>
		);
	}

	columns=[{
		title:'名字',
		dataIndex:'name',
		key:'name'
	},{
		title:'编码',
		dataIndex:'code',
		key:'code'
	},{
		title:'操作',
		render:(record) =>{
			return(
				<div>
					<a onClick={this.delet.bind(this,record)}>删除</a>
				</div>
			)
		}
	},];

	save(){
		const {actions:{putFolder,setdir,setkeyvisible},savekeys = [],olddir =[],currentrecord={}} = this.props;
		console.log(savekeys,olddir,currentrecord);
		let a ={
			code:currentrecord.code,
			name:currentrecord.name,
			parent:currentrecord.parent,
			extra_params:{
				newdocs:savekeys
			},
		};
		console.log(6,a);   //替换的obj
		olddir.map((rst,index)=>{
			if(rst.name === currentrecord.name){
				console.log(index);
				olddir.splice(index,1,a);
				console.log(olddir);   //新的模板  绑定了关键字
				putFolder({code:'Folder'},{
					metalist:olddir
				}).then(rst =>{
					message.success('编辑文件成功！');
					setkeyvisible(false)
					let dir =[];
					rst.metalist.map(rst1 => {
						if(rst1.parent === ""){
							dir.push(rst1);
						}
					});
					setdir(dir);
				});
			}
		})
	}

	handleChange(value){
		const {actions:{saveselectvalue,setvalue},oldsavekeys=[]} =this.props;
		let ks =[];
		setvalue(value);
		value.map(rst=>{
			let newrst = {
				name:rst.label,
				code:rst.key
			};
			ks.push(newrst)
		});
		for(var i in value){
			for(var j in oldsavekeys){
				if(value[i].label == oldsavekeys[j].name){
					console.log(1111);
					message.error('不能添加该字段,请重新添加');
					setvalue();
					return
				}
			}
			let newvalue = ks.concat(oldsavekeys);
			saveselectvalue(newvalue);
			console.log(9999,newvalue)
		}
	}

	delet(record){
		const {oldsavekeys=[],savekeys=[],actions:{saveselectvalue,setvalue}} = this.props;
		setvalue();
		console.log(666,savekeys);
		savekeys.map((rst, index) => {
			if (record.name === rst.name) {
				console.log(index);
				savekeys.splice(index, 1);
				console.log(66666,savekeys);
				saveselectvalue([...savekeys]);
			}
		})
	}
}

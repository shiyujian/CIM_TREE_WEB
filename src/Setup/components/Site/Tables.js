import React, {Component} from 'react';
import {Table,Button,message,Popconfirm} from 'antd';
import { getLocationAc } from '../../store/site';
let _tmpList=[]
export default class Tables extends Component {
	static propTypes = {};

	render() {
		const tableList = this.props.tableList||[];
		// console.log("this.props",this.props);
		_tmpList=tableList;
		// console.log("tableList",tableList);
		let arrList= Tables.dataLoop(_tmpList); 
		console.log('arrList',arrList)
		return (
			<Table dataSource={arrList}
				   columns={this.columns}
				   rowKey="pk"
			/>
		);
	}
	//过滤掉工程部位数据
	static dataLoop(data){
			data.map((item)=>{
				const {obj_type, children = []} = item;
				if(children && children.length && (obj_type === 'C_WP_PTR' || obj_type === 'C_WP_PTR_S' || obj_type === "C_LOC_PJ")){
					item.children=children.filter(itm=>itm.obj_type !== 'C_WP_ITM');
					children.filter(itm=>itm.obj_type !== 'C_WP_ITM').map((itm,idx)=>{
						if(itm.children && itm.children.length){
							children[idx].children=itm.children.filter(itm=>itm.obj_type !== 'C_WP_ITM')
						}
					})
				}else{
					Tables.dataLoop(children);
				}
			});
			return data

	}

	columns = [
		{
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '别名',
			dataIndex: 'extra_params.alias',
		}, {
			title: '描述',
			dataIndex: 'extra_params.desc',
		}, {
			title: '专业',
			dataIndex: 'extra_params.major',
		}, {
			title: '用途',
			dataIndex: 'extra_params.purpose',
		}, {
			title: '类型',
			dataIndex: 'obj_type_hum',
		}, {
			title: '版本',
			dataIndex: 'extra_params.version',
		}, {
			title: '操作',
			render: (record) => {
				let nodes=[];
				if (!Array.isArray(record)) {
					let typeArr = record.code.split("_");
					if(record.obj_type_hum === "工程部位"){
						nodes.push(
							<div key={record.code}>
								<Button onClick={this.editLocationAc.bind(this, record)}>编辑</Button>
								<Popconfirm title="确定删除吗?" onConfirm={this.delLocationAc.bind(this, record)} okText="确定" cancelText="取消">
									<Button>删除</Button>
								</Popconfirm>
							</div>
						)
					}
					return nodes;
				}
			}
		}
	];
	//编辑
	editLocationAc(record) {
		const {actions: {toggleModalAc,setCurrentEditDataAc}} = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		});
		setCurrentEditDataAc(record);
	}
	//删除
	delLocationAc(record) {
		const {
			actions: {
				deleteLocationAc,
				getLocationAc,
				setSelectWbsProjectAc
			}
		} = this.props;
		deleteLocationAc({code: record.code})
			.then(() => {
				message.success('删除工程部位成功！');
				setSelectWbsProjectAc(null);
				getLocationAc();
			})
	}
}

import React, {Component} from 'react';
import {Table,Button,Popconfirm,message} from 'antd';
let _tmpList=[]
export default class Tables extends Component {
	static propTypes = {};

	render() {
		const {tableList=[]} = this.props;
		_tmpList=tableList;
		let arrList= Tables.dataLoop(_tmpList);
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
				if(children && children.length && (obj_type === 'C_WP_PTR' || obj_type === 'C_WP_PTR_S')){
					item.children=children.filter(itm=>itm.obj_type !== 'C_WP_LOC');
					children.filter(itm=>itm.obj_type !== 'C_WP_LOC').map((itm,idx)=>{
						if(itm.children && itm.children.length){
							children[idx].children=itm.children.filter(itm=>itm.obj_type !== 'C_WP_LOC')
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
			dataIndex: 'version',
		}, {
			title: '操作',
			render: (record) => {
				let nodes=[];
				if(record.obj_type.indexOf('C_WP_PTR') >= 0 || record.obj_type.indexOf('C_WP_ITM') >= 0){
					nodes.push(
						<div key={record.code}>
							<Button onClick={this.editWorkPackageAc.bind(this, record)}>编辑</Button>
							<Popconfirm title="确定删除吗?" onConfirm={this.delWorkPackageAc.bind(this, record)} okText="确定" cancelText="取消">
								<Button>删除</Button>
							</Popconfirm>
						</div>
					)
				}
				return nodes;
			}
		}
	];
	//编辑
	editWorkPackageAc(record) {
		const {actions: {toggleModalAc,setCurrentEditDataAc}} = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		});
		setCurrentEditDataAc(record);
	}
	//删除
	delWorkPackageAc(record) {
		const {
			actions: {
				deleteWbsProjectAc,
				getWbsProjectAc,
				setSelectWbsProjectAc,
				delLocationAc,
				getLocationOneAc,
				getWorkpackageOneAc
			}
		} = this.props;
		deleteWbsProjectAc({ code: record.code })
			.then(rst => {
				if (rst === "") {
					message.success("删除分部成功！");
					setSelectWbsProjectAc(null);
					getWbsProjectAc();
				} else {
					message.error("请先删除其子节点");
				}
			})
	}
}

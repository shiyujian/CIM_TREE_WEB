import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Majorcode = window.DeathCode.SYSTEM_MAJOR;

export default class Addition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			levelAddVisible = false,
			newdoc={},
			filter=[],
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={levelAddVisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="添加专业名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="添加专业编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		console.log("filter",filter);
		console.log("event.target.value",event.target.value);
		let name = event.target.value;
		const {actions:{changedoc},newprofessionlist=[],docs={}} =this.props;
		let num= [];
		if(newprofessionlist.length ===0){
			docs.name = name;
			docs.code = 'PRO01';
			changedoc({...docs})
		}else {
			for (let i = 0; i < newprofessionlist.length; i++) {
				let name = event.target.value;
				if (name === newprofessionlist[i].name) {
					message.error("不能增加相同的字典名字");
					changedoc();
					break;
				}
				else {
					newprofessionlist.map((rst) => {
						num.push(parseInt(rst.code.substring(3)));
					});
					let max = Math.max.apply(null, num);
					let rightnum = max + 1;
					// 生成专业的编号，拼接
					if(rightnum < 10){
						let newcode = 'PRO'+'0'+rightnum;
						docs.code = newcode;
					}else{
						let newcode = 'PRO' + rightnum;
						docs.code = newcode;
					}
					docs.name = name;
					// 同时改变redux里面的值
					changedoc({...docs});
				}
			}
		}
	}

	cancel() {
		const {
			actions: {levelAdding,changedoc},
		} = this.props;
		levelAdding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,levelAdding,getmajorlist,changedoc},newdoc={}} = this.props;
		console.log("")
		if(newdoc.name === undefined){
			message.error('上传为空，不能上传');
		}else{
			patchdocument({code:Majorcode},{
				metalist:[
					{
						"code":newdoc.code,
						"name":newdoc.name,
					}
				]
			}).then(rst =>{
				message.success('新增文件成功！');
				changedoc();
				levelAdding(false);
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
	}

}

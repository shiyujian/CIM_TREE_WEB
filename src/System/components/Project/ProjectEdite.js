import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class dangerAddition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			editevisible = false,
			filter=[],
			editefile ={},
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={editevisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="项目阶段名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="项目阶段编码">
							<Input value={editefile.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>

		);
	}

	name(filter,event){
		let name = event.target.value;
		const{actions:{changeeditedoc},editefile={}} = this.props;
		let files={
			code:editefile.code,
			name:name,
			on:editefile.on,
		};
		changeeditedoc({...files});
	}

	cancel() {
		const {
			actions: {edite,changeeditedoc},
		} = this.props;
		edite(false);
		changeeditedoc();
	}

	save() {
		const {actions:{putdocument,edite,getProject},NewProjectlist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		NewProjectlist.splice(onn,1,k);
		NewProjectlist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		console.log(3333,list)
		putdocument({code:'Projectphase'},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			edite(false);
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

}

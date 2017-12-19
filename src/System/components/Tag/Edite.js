import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
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
						<FormItem label="工程量项名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="工程量项编码">
							<Input value={editefile.code} disabled={true}/>
						</FormItem>
						<FormItem label="工程量项特征">
							<Input value={editefile.simple} onChange={this.simple.bind(this, filter)} />
						</FormItem>
						<FormItem label="工程单位">
							<Input value={editefile.unit} onChange={this.unit.bind(this, filter)}/>
						</FormItem>
					</Form>
				</Modal>
			</div>

		);
	}

	name(filter,event){
		let name = event.target.value;
		const{actions:{setnames,changeeditedoc},editefile={}} = this.props;
		let files={
			code:editefile.code,
			name:name,
			on:editefile.on,
			unit:editefile.unit,
			simple:editefile.simple
		};
		changeeditedoc({...files});
	}

	simple(filter,event){
		let simple = event.target.value;
		const{actions:{changeeditedoc},editefile={}} = this.props;
		let files={
			code:editefile.code,
			name:editefile.name,
			on:editefile.on,
			unit:editefile.unit,
			simple:simple
		};
		changeeditedoc({...files});
	}

	unit(filter,event){
		let unit = event.target.value;
		const{actions:{changeeditedoc},editefile={}} = this.props;
		let files={
			code:editefile.code,
			name:editefile.name,
			on:editefile.on,
			unit:unit,
			simple:editefile.simple
		};
		changeeditedoc({...files});
	}

	cancel() {
		const {
			actions: {leveledite,changeeditedoc},
		} = this.props;
		leveledite(false);
		changeeditedoc();
	}

	save() {
		const {actions:{putdocument,leveledite,gettaglist},taglist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on,
			unit:editefile.unit,
			simple:editefile.simple
		};
		let list = [];
		taglist.metalist.splice(onn,1,k);
		taglist.metalist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		putdocument({code:'Taglist'},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
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

}

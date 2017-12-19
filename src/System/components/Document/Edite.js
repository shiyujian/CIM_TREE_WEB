import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;

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
				<Modal title="编辑"
				       width={920} visible={editevisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="编码">
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
		const {actions:{putdocument,edite,getdocuemntlist},newdocumentlist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		newdocumentlist.splice(onn,1,k);
		newdocumentlist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		putdocument({code:'Documentlist'},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			edite(false);
			getdocuemntlist({code:'Documentlist'}).then(rst =>{
				let newdocumentlists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newdocumentlists[index].on = index+1;
				});
				const {actions:{setnewdocumentlist}} = this.props;
				setnewdocumentlist(newdocumentlists);
			});
		});

	}

}

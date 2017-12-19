import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Keyword = window.DeathCode.SETUP_KEYWORD;

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
						<FormItem label="字典关键字名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="字典关键字编码">
							<Input value={editefile.code} onChange={this.code.bind(this, filter)}/>
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

	code(filter,event){
		let code = event.target.value;
		const{actions:{changeeditedoc},editefile={}} = this.props;
		let files={
			code:code,
			name:editefile.name,
			on:editefile.on
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
		const {actions:{putdocument,leveledite,getdictionlist},dictionlist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		dictionlist.metalist.splice(onn,1,k);
		dictionlist.metalist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		console.log(list);
		putdocument({code:Keyword},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
			getdictionlist({code:Keyword}).then(rst =>{
				let newdiclists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newdiclists[index].on = index+1;
				});
				const {actions:{setnewdiclist}} = this.props;
				setnewdiclist(newdiclists);
			})
		});

	}

}

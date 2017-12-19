import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acclevelcode = window.DeathCode.SYSTEM_ACCLEVEL;
export default class dangerAddition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			leveleditevisible = false,
			filter=[],
			editefile ={},
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={leveleditevisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="更新安全事故等级名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="更新安全事故code">
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
			actions: {leveledite,changeeditedoc},
		} = this.props;
		leveledite(false);
		changeeditedoc();
	}

	save() {
		const {actions:{putdocument,leveledite,getaccidentlevellist},newaccidentlevellistlist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		newaccidentlevellistlist.splice(onn,1,k);
		newaccidentlevellistlist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		putdocument({code:Acclevelcode},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
			getaccidentlevellist({code:Acclevelcode}).then(rst =>{
				let newaccidentlevellists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newaccidentlevellists[index].on = index+1;
				});
				const {actions:{setnewaccidentlevellist}} = this.props;
				setnewaccidentlevellist(newaccidentlevellists);
			})
		});

	}

}

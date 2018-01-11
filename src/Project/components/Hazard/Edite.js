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
						<FormItem label="安全隐患名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="安全隐患code">
							<Input value={editefile.code} disabled={true}/>
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
		const {actions:{putdocument,leveledite,gethiddenlist},hiddenlist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		hiddenlist.metalist.splice(onn,1,k);
		hiddenlist.metalist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		putdocument({code:hiddencode},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
			gethiddenlist({code:hiddencode}).then(rst =>{
				let newhiddenlists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newhiddenlists[index].on = index+1;
				});
				const {actions:{setnewhiddenlist}} = this.props;
				setnewhiddenlist(newhiddenlists);
			})
		});

	}

}

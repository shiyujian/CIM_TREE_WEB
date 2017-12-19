import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const designcode = window.DeathCode.SYSTEM_PROJECT;
export default class dangerAddition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			designvisible = false,
			filter=[],
			editefile ={},
		} = this.props;

		return (
			<div>
				<Modal title="编辑"
				       width={920} visible={designvisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="编辑设计阶段名称">
							<Input onChange={this.name.bind(this, filter)}
							       value={editefile.name}/>
						</FormItem>
						<FormItem label="设计阶段code">
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
		const {actions:{putdocument,leveledite,getstage},newstagelist=[],editefile={}} = this.props;
		let onn = parseInt(editefile.on-1);
		let k = {
			code:editefile.code,
			name:editefile.name,
			on:editefile.on
		};
		let list = [];
		// 删除原先的，增加现在的
		newstagelist.splice(onn,1,k);
		newstagelist.forEach(rst =>{
			delete rst.on;
			list.push(rst)
		});
		putdocument({code:designcode},{
			metalist:list
		}).then(rst =>{
			message.success('编辑文件成功！');
			leveledite(false);
			getstage({code:designcode}).then(rst =>{
				let newstagelists = rst.metalist;
				rst.metalist.map((wx,index) => {
					newstagelists[index].on = index+1;
				});
				const {actions:{setnewstagelist}} = this.props;
				setnewstagelist(newstagelists);
			})
		});

	}

}

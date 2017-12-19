import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Defect = window.DeathCode.SYSTEM_DEFCT;
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
						<FormItem label="安全隐患名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="安全隐患编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},newdefectslist=[],docs={}} =this.props;
		let num= [];
		if(newdefectslist.length ===0){
			docs.name = name;
			docs.code = 'defects_1';
			changedoc({...docs})
		}else {
			for (let i = 0; i < newdefectslist.length; i++) {
				let name = event.target.value;
				if (name === newdefectslist[i].name) {
					message.error("不能增加相同的名字");
					changedoc();
					break;
				}
				else {
					newdefectslist.map((rst) => {
						num.push(parseInt(rst.code.split('_')[1]));
					});
					let max = Math.max.apply(null, num);
					let rightnum = max + 1;
					let newcode = 'defects' + '_' + rightnum;
					docs.name = name;
					docs.code = newcode;
					changedoc({...docs});
				}
			}
		}
	}

	cancel() {
		const {
			actions: {levelAdding,changedoc},
			docs={}
		} = this.props;
		levelAdding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,levelAdding,getdefectslist,changedoc},newdoc={}} = this.props;
		if(newdoc.name === undefined){
			message.error('上传为空，不能上传');
		}else {
			patchdocument({code: Defect}, {
				metalist: [
					{
						"code": newdoc.code,
						"name": newdoc.name,
					}
				]
			}).then(rst => {
				message.success('新增文件成功！');
				changedoc();
				levelAdding(false);
				getdefectslist({code: Defect}).then(rst => {
					let newdefectslists = rst.metalist;
					rst.metalist.map((wx, index) => {
						newdefectslists[index].on = index + 1;
					});
					const {actions: {setnewdefectslist}} = this.props;
					setnewdefectslist(newdefectslists);
				})
			});
		}
	}

}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const designcode = window.DeathCode.SYSTEM_PROJECT;
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
						<FormItem label="新增设计阶段名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="新增设计阶段编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},newstagelist=[],docs={}} =this.props;
		let num= [];
		if(newstagelist.length ===0){
			let newcode = 'stage_1';
			docs.name = name;
			docs.code = newcode;
			changedoc({...docs});
		}else {
			for (let i = 0; i < newstagelist.length; i++) {
				let name = event.target.value;
				if (name === newstagelist[i].name) {
					message.error("不能增加相同的字典名字");
					changedoc();
					break;
				}
				else {
					newstagelist.map((rst) => {
						num.push(parseInt(rst.code.split('_')[1]));
					});
					let max = Math.max.apply(null, num);
					let rightnum = max + 1;
					let newcode = 'stage' + '_' + rightnum;
					docs.code = newcode;
					docs.name = name;
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
		const {actions:{patchdocument,levelAdding,getstage,changedoc},newdoc={}} = this.props;
		if(newdoc.name === undefined){
			message.error('上传为空，不能上传');
		}else {
			patchdocument({code: designcode}, {
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
				getstage({code: designcode}).then(rst => {
					let newstagelists = rst.metalist;
					rst.metalist.map((wx, index) => {
						newstagelists[index].on = index + 1;
					});
					const {actions: {setnewstagelist}} = this.props;
					setnewstagelist(newstagelists);
				})
			});
		}
	}

}

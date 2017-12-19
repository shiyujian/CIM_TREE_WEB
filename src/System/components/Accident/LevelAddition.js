import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acclevelcode = window.DeathCode.SYSTEM_ACCLEVEL;
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
						<FormItem label="安全事故等级名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="安全事故编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},newaccidentlevellistlist=[],docs={}} =this.props;
		let num= [];
		if(newaccidentlevellistlist.length ===0){
			docs.name = name;
			docs.code = 'accidentleve_1';
			changedoc({...docs})
		}else {
			newaccidentlevellistlist.map((rst) => {
				num.push(parseInt(rst.code.split('_')[1]));
			});
			let max = Math.max.apply(null, num);
			let rightnum = max + 1;
			let newcode = 'accidentleve' + '_' + rightnum;
			docs.name = name;
			docs.code = newcode;
			changedoc({...docs});
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
		const {actions:{patchdocument,levelAdding,getaccidentlevellist,changedoc},newdoc={}} = this.props;
		patchdocument({code:Acclevelcode},{
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Acccode = window.DeathCode.SYSTEM_ACC;
export default class Addition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			AddVisible = false,
			newdoc={},
			filter=[],
		} = this.props;

		return (
			<div>
				<Modal title="新增"
				       width={920} visible={AddVisible}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="项目阶段名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="项目阶段编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		let name = event.target.value;
		const {actions:{changedoc},NewProjectlist=[],docs={}} =this.props;
		let num= [];
		if(NewProjectlist.length === 0 ){
			docs.code = 'Projectphase_1';
			docs.name =  name;
			changedoc({...docs})
		}else {
			for (let i = 0; i < NewProjectlist.length; i++) {
				let name = event.target.value;
				if (name === NewProjectlist[i].name) {
					message.error("不能增加相同的字典名字");
					changedoc();
					break;
				}
				else {
					NewProjectlist.map((rst) => {
						num.push(parseInt(rst.code.split('_')[1]));
					});
					let max = Math.max.apply(null, num);
					let rightnum = max + 1;
					let newcode = 'Projectphase' + '_' + rightnum;
					docs.name = name;
					docs.code = newcode;
					changedoc({...docs});
				}
			}
		}
	}

	cancel() {
		const {
			actions: {Adding,changedoc},
			docs={}
		} = this.props;
		Adding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,Adding,getProject,changedoc},newdoc={}} = this.props;
		patchdocument({code:'Projectphase'},{
			metalist:[
				{
					"code":newdoc.code,
					"name":newdoc.name,
				}
			]
		}).then(rst =>{
			message.success('新增文件成功！');
			changedoc();
			Adding(false);
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

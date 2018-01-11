import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const Keyword = window.DeathCode.SETUP_KEYWORD;
class Addition extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const{
			form: {getFieldDecorator},
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
						<FormItem label="字典名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="字典编码">
						 {getFieldDecorator('code', {
                            rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                            initialValue: ''
                             })(
							<Input value={newdoc.code} onChange={this.code.bind(this,filter)}/>
                          )}
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		const {actions:{changedoc},newdictionlist=[],docs={}} =this.props;
		let num= [];
		let name = event.target.value;
		if(newdictionlist.length ===0){
			docs.name = name;
			docs.code = 'keyword_1';
			changedoc({...docs})
		}else{
			for(let i= 0;i<newdictionlist.length;i++){
				let name = event.target.value;
				if(name === newdictionlist[i].name){
					message.error("不能增加相同的字典名字");
					changedoc();
					break;
			}else{
					newdictionlist.map((rst) => {
						if(typeof (rst.code.split('_')[1]) !== "string"){
							return;
						}else{
							num.push(parseInt(rst.code.split('_')[1]));
						}
					});
					let newnum =[];
					num.map(rst =>{
						if(rst === rst){
							newnum.push(rst);
						}
					});
					console.log(111,newnum);
					let max = Math.max.apply(null, newnum);
					let rightnum = max + 1;
					let newcode = 'keyword' + '_' + rightnum;
					docs.name = name;
					docs.code = newcode;
					changedoc({...docs});
				}
			}
		}
	}

	code(filter,event){
		let code = event.target.value;
		const {actions:{changedoc},docs={},newdoc={}} =this.props;
		newdoc.code = code;
		changedoc({...newdoc});
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
		const {actions:{patchdocument,levelAdding,getdictionlist,changedoc},newdoc={}} = this.props;
		if(newdoc.name === undefined){
			message.error('上传为空，不能上传');
		}else {
			patchdocument({code: Keyword}, {
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
				getdictionlist({code: Keyword}).then(rst => {
					let newdiclists = rst.metalist;
					rst.metalist.map((wx, index) => {
						newdiclists[index].on = index + 1;
					});
					const {actions: {setnewdiclist}} = this.props;
					setnewdiclist(newdiclists);
				})
			});
		}
	}

}
export default Form.create()(Addition)

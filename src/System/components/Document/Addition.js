import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal, Upload,
	Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;

export default class    Addition extends Component {
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
						<FormItem label="文档名称">
							<Input value={newdoc.name} onChange={this.name.bind(this,filter)}/>
						</FormItem>
						<FormItem label="文档编码">
							<Input value={newdoc.code} disabled={true}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}

	name(filter,event){
		const {actions:{changedoc},newdocumentlist=[],docs={}} =this.props;
		let num= [];
		let name = event.target.value;
		if(newdocumentlist.length ===0){
			docs.name = name;
			docs.code = 'Documentlist_1';
			changedoc({...docs})
		}else{
			for (let i= 0;i<newdocumentlist.length;i++){
				let name = event.target.value;
				if(name === newdocumentlist[i].name){
					message.error("不能增加相同的字典名字");
					changedoc();
					break;
			}else{
					newdocumentlist.map((rst) => {
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
					let newcode = 'Documentlist' + '_' + rightnum;
					docs.name = name;
					docs.code = newcode;
					changedoc({...docs});
				}
			}
		}
	}

	// code(filter,event){
	// 	let code = event.target.value;
	// 	const {actions:{changedoc},docs={},newdoc={}} =this.props;
	// 	newdoc.code = code;
	// 	changedoc({...newdoc});
	// }

	cancel() {
		const {
			actions: {Adding,changedoc},
			docs={}
		} = this.props;
		Adding(false);
		changedoc();
	}

	save() {
		const {actions:{patchdocument,Adding,getdocuemntlist,changedoc},newdoc={}} = this.props;
		patchdocument({code:'Documentlist'},{
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

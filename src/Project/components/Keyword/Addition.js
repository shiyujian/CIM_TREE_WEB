import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input,Button, Row, Col, Modal,
	Icon, message, Select
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
export default class Additon extends Component {
	static propTypes={
		addVisible: PropTypes.bool
	};

	render() {
		const {
			filter = [],
			Addable = false,
			selectcode ={},
			parentdir={},
			adddocs={},
			swichvisible={},
			inputvisible = false,
			keyword=[],
			setvalue=[]
		}= this.props;


		return (
			<div>
				<Modal title="新增"
				       width={920} visible={Addable}
				       onOk={this.save.bind(this)}
				       onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="配置目录的编码">
							<Input  disabled value={selectcode}/>
						</FormItem>
						<FormItem label="配置目录的父级编码">
							<Input  disabled value={parentdir.code}/>
						</FormItem>
						<FormItem label="字段名">
							<Select
								labelInValue
								style={{ width: '100%' }}
								placeholder="Please select"
								value={setvalue}
								onChange={this.handleChange.bind(this)}
							>
								{
									keyword.map((pkg,index) => {
										return <Option key={pkg.code}
										               value={pkg.code}>{pkg.name}</Option>;
									})
								}
							</Select>
						</FormItem>
						<Button>提交</Button>
					</Form>
				</Modal>
			</div>

		);
	}

	handleChange(value){
		const {actions:{changeadddocs,setvalue},extradir= {}} = this.props;
		let newvalue =[value];
		for(var i in newvalue){
			for(var j in extradir.newdocs){
				if(newvalue[i].label == extradir.newdocs[j].name){
					message.error('不能添加该字段,请重新添加');
					setvalue();
					return
				}
			}
			let adddocs = {
				name:value.label,
				code:value.key,
			};
			setvalue(newvalue);
			changeadddocs({...adddocs});
		}
	}

	cancel() {
		const {
			actions: {setAddvisible,setvalue},
		} = this.props;
		setAddvisible(false);
		setvalue()
	}

	save() {
		const{actions:{setswichvisible,putdir,setAddvisible,getparentdir,changeadddocs,setvalue,setinputvisble},selectcode ={},parentdir={},adddocs={},extradir ={}} = this.props;
		if(JSON.stringify(extradir) === "{}" || extradir.newdocs.length === 0){
			let newdocs = [adddocs];
			console.log('newdocs',newdocs)
			putdir({code:selectcode},{
				status:"A",
				extra_params:{
					newdocs
				},
				parent:{
					pk:parentdir.pk,
					code:parentdir.code,
					obj_type:"C_DIR"
				}
			}).then(rst =>{
				message.success('新增目录成功！');
				setAddvisible(false);
				getparentdir({code: selectcode});
				changeadddocs({});
				setvalue();
				setinputvisble(false);
				setswichvisible(true)
			});
		}else{
			let oldextradir = extradir.newdocs;
			let newdocs = oldextradir.concat([adddocs]);			
			putdir({code:selectcode},{
				status:"A",
				extra_params:{
					newdocs
				},
				parent:{
					pk:parentdir.pk,
					code:parentdir.code,
					obj_type:"C_DIR"
				}
			}).then(rst =>{
				message.success('新增目录成功！');
				setAddvisible(false);
				getparentdir({code: selectcode});
				changeadddocs({});
				setvalue();
				setinputvisble(false);
				setswichvisible(true)
			});
		}
	}

}

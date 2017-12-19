import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Modal, message,Select
} from 'antd';
const FormItem = Form.Item;
const WXlevel = window.DeathCode.SYSTEM_LEVEL;
const Option = Select.Option;
export default class LevelEdit extends Component {
    static propTypes={
        addVisible: PropTypes.bool
    };

    render() {
        const{
            levelEditVisible = false,
            filter=[],
            levelfile={},
        } = this.props;
		console.log("levelfile",levelfile['风险级别']);
        return (
            <div>
                <Modal title="新增"
                       width={920} visible={levelEditVisible}
                       onOk={this.save.bind(this)}
                       onCancel={this.cancel.bind(this)}>
                    <Form>
                        <FormItem label="安全隐患名称">
                            <Input value={levelfile.name} onChange={this.name.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="安全隐患编码">
                            <Input value={levelfile.code} disabled={true}/>
                        </FormItem>
                        <FormItem label="发生事故可能造成的后果">
                            <Input value={levelfile["C(发生事故可能造成的后果)"]} onChange={this.things.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="总计">
                            <Input value={levelfile["D(总计)"]} onChange={this.tatal.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="人员暴露于危险环境中的频繁程度">
                            <Input  value={levelfile["E(人员暴露于危险环境中的频繁程度)"]} onChange={this.people.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="事故发生的可能性">
                            <Input  value={levelfile["L(事故发生的可能性)"]} onChange={this.posible.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="风险控制措施">
                            <Input value={levelfile["风险控制措施"]} onChange={this.methode.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="风险级别">
							<Select defaultValue={levelfile["风险级别"]} onChange={this.levell.bind(this, filter)}>
								<Option value="一级">一级</Option>
								<Option value="二级">二级</Option>
								<Option value="三级">三级</Option>
								<Option value="四级">四级</Option>
							</Select>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    name(filter,event){
		debugger;
        const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
        let name = event.target.value;
	    leveldocs.name = name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];
	    leveldocs["D(总计)"]  =levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
        setleveldocs(leveldocs);
    }

    things(filter,event){
        const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
        let things = event.target.value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = things;
	    leveldocs["D(总计)"]  =levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
        setleveldocs(leveldocs);
    }

    tatal(filter,event){
	    const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
	    let tatal = event.target.value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];;
	    leveldocs["D(总计)"]  =  tatal;
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
	    setleveldocs(leveldocs);
    }

    people(filter,event){
	    const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
	    let people = event.target.value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];;
	    leveldocs["D(总计)"]  =  levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = people;
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
	    setleveldocs(leveldocs);
    }

    posible(filter,event){
	    const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
	    let posible = event.target.value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];;
	    leveldocs["D(总计)"]  =  levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = posible;
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
	    setleveldocs(leveldocs);
    }

    methode(filter,event){
	    const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
	    let methode = event.target.value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];;
	    leveldocs["D(总计)"]  =  levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = methode;
	    leveldocs["风险级别"] = levelfile["风险级别"];
	    leveldocs.on = levelfile.on;
	    setleveldocs(leveldocs);
    }

    levell(filter,value){
	    const{actions:{setleveldocs},levelfile={},leveldocs={}} = this.props;
	    let levell = value;
	    leveldocs.name = levelfile.name;
	    leveldocs.code = levelfile.code;
	    leveldocs["C(发生事故可能造成的后果)"] = levelfile["C(发生事故可能造成的后果)"];;
	    leveldocs["D(总计)"]  =  levelfile["D(总计)"];
	    leveldocs["E(人员暴露于危险环境中的频繁程度)"] = levelfile["E(人员暴露于危险环境中的频繁程度)"];
	    leveldocs["L(事故发生的可能性)"] = levelfile["L(事故发生的可能性)"];
	    leveldocs["风险控制措施"] = levelfile["风险控制措施"];
	    leveldocs["风险级别"] = levell;
	    leveldocs.on = levelfile.on;
	    setleveldocs(leveldocs);
    }

    cancel() {
        const {
            actions: {levelEditVisible},
        } = this.props;
        levelEditVisible(false);
    }

    save() {
	    const {actions:{putdocument,getwxtype,levelEditVisible},wxtype=[],levelfile={},typecode={}} = this.props;
	    let onn = parseInt(levelfile.on-1);
	    let k = {
		    "code":levelfile.code,
		    "name":levelfile.name,
		    "D(总计)":levelfile["D(总计)"],
		    "风险控制措施":levelfile["风险控制措施"],
		    "L(事故发生的可能性)":levelfile["L(事故发生的可能性)"],
		    "E(人员暴露于危险环境中的频繁程度)":levelfile["E(人员暴露于危险环境中的频繁程度)"],
		    "C(发生事故可能造成的后果)":levelfile["C(发生事故可能造成的后果)"],
		    "风险级别":levelfile["风险级别"]
	    };
	    let list = [];
	    wxtype.metalist.splice(onn,1,k);
	    wxtype.metalist.forEach(rst =>{
		    delete rst.on;
		    list.push(rst)
	    });
	    putdocument({code:WXlevel},{
		    metalist:list
	    }).then(rst =>{
		    message.success('编辑文件成功！');
		    levelEditVisible(false);
		    getwxtype({code:WXlevel}).then(rst =>{
			    let newtypelists = rst.metalist;
			    rst.metalist.map((type,index) => {
				    newtypelists[index].on = index+1;
			    });
			    const {actions:{newtypelist}} = this.props;
			    newtypelist(newtypelists);
		    })
	    });
    }

}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input,Button, Row, Col, Modal, Upload,
    Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export default class dangerAddition extends Component {
    static propTypes={
        addVisible: PropTypes.bool
    };

    render() {
        const{
            levelAddVisible = false,
            newcoded={},
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
                            <Input onChange={this.name.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="安全隐患编码">
                            <Input value={newcoded} disabled={true}/>
                        </FormItem>
                        <FormItem label="发生事故可能造成的后果">
                            <Input onChange={this.things.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="总计">
                            <Input onChange={this.tatal.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="人员暴露于危险环境中的频繁程度">
                            <Input onChange={this.people.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="事故发生的可能性">
                            <Input onChange={this.posible.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="风险控制措施">
                            <Input onChange={this.methode.bind(this,filter)}/>
                        </FormItem>
                        <FormItem label="风险级别">
                            <Input onChange={this.levell.bind(this,filter)}/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    name(filter,event){
        let name = event.target.value;
        const {newtypelist=[],docs={},typecode={}} =this.props;
        if(newtypelist.length == 0){
            let num1 = typecode.split('_')[1];
            let num2 =num1+'01';
            let newcode = typecode.split('_')[0]+'_'+num2;
	        docs.name = name;
	        docs.code =newcode;
	        const {actions:{setnewcode,setdocs}} = this.props;
	        setdocs(docs);
	        setnewcode(newcode);
        }else{
	        let num= [];
	        newtypelist.map((rst) =>{
	            num.push(parseInt(rst.code.split('_')[1]));
	        });
	        let max = Math.max.apply(null, num);
	        let rightnum = max+1;
	        let newcode= 'WX'+'_'+rightnum;
	        docs.name = name;
	        docs.code =newcode;
	        const {actions:{setnewcode,setdocs}} = this.props;
	        setdocs(docs);
	        setnewcode(newcode);
        }
    }

    things(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let things = event.target.value;
        docs.things = things;
        setdocs(docs);
    }

    tatal(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let tatal = event.target.value;
        docs.tatal = tatal;
        setdocs(docs);
    }

    people(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let people = event.target.value;
        docs.people = people;
        setdocs(docs);
    }

    posible(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let posible = event.target.value;
        docs.posible = posible;
        setdocs(docs);
    }

    methode(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let methode = event.target.value;
        docs.methode = methode;
        setdocs(docs);
    }

    levell(filter,event){
        const{docs={},actions:{setdocs}} =this.props
        let levell = event.target.value;
        docs.levell = levell;
        setdocs(docs);
    }

    cancel() {
        const {
            actions: {levelAdding},
        } = this.props;
        levelAdding(false);
    }

    save() {
        const {actions:{patchdocument,levelAdding,getwxtype,postdocument},docs={},typecode={},newtypelist} = this.props;
        if(newtypelist.length == 0){
	        postdocument({},{
	            code:typecode,
		        metalist:[
			        {
				        "code":docs.code,
				        "name":docs.name,
				        "D(总计)":docs.tatal,
				        "风险控制措施":docs.methode,
				        "L(事故发生的可能性)":docs.posible,
				        "E(人员暴露于危险环境中的频繁程度)":docs.people,
				        "C(发生事故可能造成的后果)":docs.things,
				        "风险级别":docs.levell
			        }
		        ]
	        }).then(rst =>{
		        message.success('新增文件成功！');
		        levelAdding(false);
		        getwxtype({code:typecode}).then(rst =>{
			        let newtypelists = rst.metalist;
			        rst.metalist.map((type,index) => {
				        newtypelists[index].on = index+1;
			        });
			        const {actions:{newtypelist}} = this.props;
			        newtypelist(newtypelists);
		        })
	        });
        }else{
	        patchdocument({code:typecode},{
		        metalist:[
			        {
				        "code":docs.code,
				        "name":docs.name,
				        "D(总计)":docs.tatal,
				        "风险控制措施":docs.methode,
				        "L(事故发生的可能性)":docs.posible,
				        "E(人员暴露于危险环境中的频繁程度)":docs.people,
				        "C(发生事故可能造成的后果)":docs.things,
				        "风险级别":docs.levell
			        }
		        ]
	        }).then(rst =>{
		        message.success('新增文件成功！');
		        levelAdding(false);
		        getwxtype({code:typecode}).then(rst =>{
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

}

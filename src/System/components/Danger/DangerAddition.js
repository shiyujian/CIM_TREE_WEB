import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input,Button, Row, Col, Modal, Upload,
    Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
export const WXcode = window.DeathCode.SYSTEM_WX;

export default class dangerAddition extends Component {
    static propTypes={
        addVisible: PropTypes.bool
    };

    render() {
        const{
            additionVisible = false,
            filter=[],
            newcoded={}
        } = this.props;
        return (
            <div>
                <Modal title="新增"
                       width={920} visible={additionVisible}
                       onOk={this.save.bind(this)}
                       onCancel={this.cancel.bind(this)}>
                    <Form>
                        <FormItem label="危险源名称">
                            <Input onChange={this.name.bind(this, filter)}/>
                        </FormItem>
                        <FormItem label="危险源编码">
                            <Input value={newcoded} disabled={true}/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    }

    name(filter,event){
        let name = event.target.value;
        const {newwxlist=[]} =this.props;
        let num= [];
		    newwxlist.map((rst) => {
			    num.push(parseInt(rst.code.split('_')[1]));
		    });
		    let max = Math.max.apply(null, num);
		    let rightnum = max + 1;
		    let newcode = 'WX' + '_' + rightnum;
		    const {actions: {setnewcode, setname}} = this.props;
		    setnewcode(newcode);
		    setname(name);
    }



    cancel() {
        const {
            actions: {toggleAddition},
        } = this.props;
        toggleAddition(false);
    }

    save() {
        const {actions:{patchdocument,toggleAddition,getWxlist},newcoded={},name={}} = this.props;
        patchdocument({code:WXcode},{
            metalist:[
                {
                    code:newcoded,
                    name:name,
                }
            ]
        }).then(rst =>{
            message.success('新增文件成功！');
            toggleAddition(false);
            getWxlist({code:WXcode}).then(rst =>{
                let newwxlists = rst.metalist;
                rst.metalist.map((wx,index) => {
                    newwxlists[index].on = index+1;
                });
                const {actions:{newwxlist}} = this.props;
                newwxlist(newwxlists);
            })
        });
    }

}

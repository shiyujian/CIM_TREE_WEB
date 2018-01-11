import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Button, Row, Col, Modal,
    Icon, message, Switch,
} from 'antd';
import CodePicker from '_platform/components/panels/CodePicker';

const FormItem = Form.Item;
class Additon extends Component {
    static propTypes = {
        addVisible: PropTypes.bool
    };

    render() {
        const {
            form: {getFieldDecorator},
            checkable = {},
            Addable = false,
            filter = [],
            newcoded = {},
            addfile = {},
        } = this.props;
        return (
			<div>
				<Modal title="新增"
					   width={920} visible={Addable}
					   onOk={this.save.bind(this)}
					   onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="新增父级名称">
							<Input value={addfile.name} disabled/>
						</FormItem>
						<FormItem label="新增父级编码">
							<Input value={addfile.code} disabled/>
						</FormItem>
						<FormItem label="新增目录名称">
							<Input onChange={this.name.bind(this, filter)}/>
						</FormItem>
						<FormItem label="新增目录编码">
                            {getFieldDecorator('code', {
                                rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                                initialValue: ''
                            })(
								<Input onChange = {
                                    (e,e2)=>{
                                        console.log(e.target.value,e2);
                                        this.setState({postcode:e.target.value});
                                    }
                                } type="text"  placeholder="请输入新增目录编码" />
                            )}
						</FormItem>
					</Form>
				</Modal>
			</div>
        );
    }

    name(filter, event) {
        let name = event.target.value;
        const {actions: {changeadddocs}, adddocs = {}} = this.props;
        adddocs.name = name;
        changeadddocs(adddocs);
    }

    code(filter, event) {
        let code = event.target.value;
        const {actions: {changeadddocs}, adddocs = {}} = this.props;
        adddocs.code = code;
        changeadddocs(adddocs);
    }
    cancel() {
        const {
            actions: {setAddabel, changeadddocs},
        } = this.props;
        setAddabel(false);
        changeadddocs();
    }
    save() {
        const {
            actions:
                {postdir, setAdddir,setAddabel, getdirtree}
            ,
            adddocs = {}, newshuzu = {}, savecode = {}, judgeParent = {}
        } = this.props;
        postdir({}, {
            name: adddocs.name,
            code: this.state.postcode,
            obj_type: "C_DIR",
            status: "A",
            parent: {
                pk:judgeParent.pk,
                code: judgeParent.code,
                obj_type: "C_DIR"
            }
        }).then(rst => {
            console.log("数据请求成功");
            message.success('新增目录成功！');
            getdirtree({code: savecode}, {depth: 4}).then(({children}) => {
                let newshuzu = children;
                children.map((rst,index) => {
                    newshuzu[index].on = "one";
                    if(newshuzu[index].length !==0 ){
                        rst.children.map((rst1 ,index1)=>{
                            newshuzu[index].children[index1].on = "two";
                            if(newshuzu[index].children[index1].length !==0 ){
                                rst1.children.map((rst2,index2)=>{
                                    newshuzu[index].children[index1].children[index2].on ="three";
                                })
                            }
                        })
                    }
                });
                console.log(222,newshuzu);
                const {actions:{savenewshuzu}} =this.props;
                savenewshuzu(newshuzu)
            });
        });
        setAddabel(false);
    }

}
export default Form.create()(Additon)


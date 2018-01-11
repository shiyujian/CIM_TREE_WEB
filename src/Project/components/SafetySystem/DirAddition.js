import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Modal, message} from 'antd';
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
            adddirvisible = false,
            filter = [],
            newcoded = {},
            addfile = {},
            savepa = {},
            savecode = {},
            adddocs = {},
        } = this.props;

        return (
			<div>
				<Modal title="新增"
					   width={920} visible={adddirvisible}
					   onOk={this.save.bind(this)}
					   onCancel={this.cancel.bind(this)}>
					<Form>
						<FormItem label="新增父级PK">
							<Input value={savepa.pk} disabled/>
						</FormItem>
						<FormItem label="新增父级编码">
							<Input value={savepa.code} disabled/>
						</FormItem>
						<FormItem label="新增目录名称">
							<Input onChange={this.name.bind(this, filter)} value={adddocs.name}/>
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
        changeadddocs({...adddocs});
    }

    code(filter, code) {
        // let code = event.target.value;
        const {actions: {changeadddocs}, adddocs = {}} = this.props;
        adddocs.code = code;
        changeadddocs({...adddocs});
    }


    cancel() {
        const {
            actions: {setAdddir, changeadddocs},
        } = this.props;
        setAdddir(false);
        changeadddocs({})
    }

    save() {
        const {actions: {postdir, setAdddir,
            getdirtree}, adddocs = {},
            savepa = {}, savecode = {}} = this.props;
        console.log(this.props['setAdddir'])
        postdir({}, {
            name: adddocs.name,
            code: this.state.postcode,
            obj_type: "C_DIR",
            status: "A",
            parent: {
                pk:savepa.pk,
                code: savecode,
                obj_type: "C_DIR"
            }
        }).then(rst => {
            message.success('新增目录成功！');
            setAdddir(false);
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
                const {actions:{savenewshuzu}} =this.props;
                savenewshuzu(newshuzu)
            });
        });
    }

}
export default Form.create()(Additon)


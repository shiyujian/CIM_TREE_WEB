import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, message } from 'antd';
const FormItem = Form.Item;
export const Defect = window.DeathCode.SYSTEM_DEFCT;
export default class dangerAddition extends Component {
    static propTypes = {
        addVisible: PropTypes.bool
    };

    render () {
        const {
            editevisible = false,
            filter = [],
            editefile = {}
        } = this.props;

        return (
            <div>
                <Modal
                    title='新增'
                    width={920}
                    visible={editevisible}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <FormItem label='安全隐患名称'>
                            <Input
                                onChange={this.name.bind(this, filter)}
                                value={editefile.name}
                            />
                        </FormItem>
                        <FormItem label='安全隐患code'>
                            <Input value={editefile.code} disabled />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    name (filter, event) {
        let name = event.target.value;
        const {
            actions: { changeeditedoc },
            editefile = {}
        } = this.props;
        let files = {
            code: editefile.code,
            name: name,
            on: editefile.on
        };
        changeeditedoc({ ...files });
    }

    cancel () {
        const {
            actions: { leveledite, changeeditedoc }
        } = this.props;
        leveledite(false);
        changeeditedoc();
    }

    save () {
        const {
            actions: { putdocument, leveledite, getdefectslist },
            defectslist = [],
            editefile = {}
        } = this.props;
        let onn = parseInt(editefile.on - 1);
        let k = {
            code: editefile.code,
            name: editefile.name,
            on: editefile.on
        };
        let list = [];
        defectslist.metalist.splice(onn, 1, k);
        defectslist.metalist.forEach(rst => {
            delete rst.on;
            list.push(rst);
        });
        console.log(list);
        putdocument(
            { code: Defect },
            {
                metalist: list
            }
        ).then(rst => {
            message.success('编辑文件成功！');
            leveledite(false);
            getdefectslist({ code: Defect }).then(rst => {
                let newdefectslists = rst.metalist;
                rst.metalist.map((wx, index) => {
                    newdefectslists[index].on = index + 1;
                });
                const {
                    actions: { setnewdefectslist }
                } = this.props;
                setnewdefectslist(newdefectslists);
            });
        });
    }
}

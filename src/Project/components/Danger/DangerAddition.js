import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    Upload,
    Icon,
    message,
    Table
} from 'antd';
const FormItem = Form.Item;
export const WXcode = window.DeathCode.SYSTEM_WX;

export default class dangerAddition extends Component {
    static propTypes = {
        addVisible: PropTypes.bool
    };

    render () {
        const {
            additionVisible = false,
            filter = [],
            newdoc = {},
            newcoded = {}
        } = this.props;
        return (
            <div>
                <Modal
                    title='新增'
                    width={920}
                    visible={additionVisible}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <FormItem label='危险源名称'>
                            <Input
                                onChange={this.name.bind(this, filter)}
                                value={newdoc.name}
                            />
                        </FormItem>
                        <FormItem label='危险源编码'>
                            <Input value={newdoc.code} disabled />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    name (filter, event) {
        let name = event.target.value;
        const {
            newwxlist = [],
            docs = {},
            actions: { changedoc }
        } = this.props;
        let num = [];
        if (newwxlist.length === 0) {
            docs.name = name;
            docs.code = 'WX_1';
            changedoc({ ...docs });
        } else {
            for (let i = 0; i < newwxlist.length; i++) {
                let name = event.target.value;
                if (name === newwxlist[i].name) {
                    message.error('不能增加相同的字典名字');
                    changedoc();
                    break;
                } else {
                    newwxlist.map(rst => {
                        num.push(parseInt(rst.code.split('_')[1]));
                    });
                    let max = Math.max.apply(null, num);
                    let rightnum = max + 1;
                    let newcode = 'WX' + '_' + rightnum;
                    docs.name = name;
                    docs.code = newcode;
                    changedoc({ ...docs });
                }
            }
        }
    }

    cancel () {
        const {
            actions: { toggleAddition, changedoc }
        } = this.props;
        toggleAddition(false);
        changedoc();
    }

    save () {
        const {
            actions: { patchdocument, toggleAddition, getWxlist, changedoc },
            newdoc = {}
        } = this.props;
        if (newdoc.name === undefined) {
            message.error('上传为空，不能上传');
        } else {
            patchdocument(
                { code: WXcode },
                {
                    metalist: [
                        {
                            code: newdoc.code,
                            name: newdoc.name
                        }
                    ]
                }
            ).then(rst => {
                message.success('新增文件成功！');
                changedoc();
                toggleAddition(false);
                getWxlist({ code: WXcode }).then(rst => {
                    let newwxlists = rst.metalist;
                    rst.metalist.map((wx, index) => {
                        newwxlists[index].on = index + 1;
                    });
                    const {
                        actions: { newwxlist }
                    } = this.props;
                    newwxlist(newwxlists);
                });
            });
        }
    }
}

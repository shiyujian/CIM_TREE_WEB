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
        const { addVisible = false, filter = [], file = {} } = this.props;
        return (
            <div>
                <Modal
                    title='新增'
                    width={920}
                    visible={addVisible}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <FormItem label='危险源名称'>
                            <Input
                                onChange={this.name.bind(this, filter)}
                                value={file.name}
                            />
                        </FormItem>
                        <FormItem label='危险源编码'>
                            <Input value={file.code} disabled />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    name (filter, event) {
        let name = event.target.value;
        const {
            actions: { setnames },
            file = {}
        } = this.props;
        let files = {
            code: file.code,
            name: name,
            on: file.on
        };
        setnames(files);
    }

    cancel () {
        const {
            actions: { addvisible }
        } = this.props;
        addvisible(false);
    }

    save () {
        const {
            actions: { putdocument, addvisible, getWxlist },
            wxlist = [],
            file = {}
        } = this.props;
        let onn = parseInt(file.on - 1);
        let k = {
            code: file.code,
            name: file.name,
            on: file.on
        };
        let list = [];
        wxlist.metalist.splice(onn, 1, k);
        wxlist.metalist.forEach(rst => {
            delete rst.on;
            list.push(rst);
        });
        putdocument(
            { code: WXcode },
            {
                metalist: list
            }
        ).then(rst => {
            message.success('编辑文件成功！');
            addvisible(false);
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

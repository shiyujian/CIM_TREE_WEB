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
    Table,
    Select
} from 'antd';
export const WXlevel = window.DeathCode.SYSTEM_LEVEL;
const FormItem = Form.Item;
const Option = Select.Option;
export default class dangerAddition extends Component {
    static propTypes = {
        addVisible: PropTypes.bool
    };

    render () {
        const {
            levelAddVisible = false,
            newcoded = {},
            filter = [],
            docs = {}
        } = this.props;

        return (
            <div>
                <Modal
                    title='新增'
                    width={920}
                    visible={levelAddVisible}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <FormItem label='安全隐患名称'>
                            <Input
                                value={docs.name}
                                onInput={this.name.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='安全隐患编码'>
                            <Input value={docs.code} disabled />
                        </FormItem>
                        <FormItem label='发生事故可能造成的后果'>
                            <Input
                                value={docs.things}
                                onChange={this.things.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='总计'>
                            <Input
                                value={docs.tatal}
                                onChange={this.tatal.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='人员暴露于危险环境中的频繁程度'>
                            <Input
                                value={docs.people}
                                onChange={this.people.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='事故发生的可能性'>
                            <Input
                                value={docs.posible}
                                onChange={this.posible.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='风险控制措施'>
                            <Input
                                value={docs.methode}
                                onChange={this.methode.bind(this, filter)}
                            />
                        </FormItem>
                        <FormItem label='风险级别'>
                            <Select
                                defaultValue='一级'
                                onChange={this.levell.bind(this, filter)}
                            >
                                <Option value='一级'>一级</Option>
                                <Option value='二级'>二级</Option>
                                <Option value='三级'>三级</Option>
                                <Option value='四级'>四级</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    name (filter, event) {
        console.log(filter);
        let name = event.target.value;
        const {
            newtypelist = [],
            docs = {},
            typecode = {},
            actions: { setnewcode, setdocs }
        } = this.props;
        if (newtypelist.length == 0) {
            let num1 = `level`;
            let num2 = num1 + '_' + '01';
            let newcode = num2;
            docs.name = name;
            docs.code = newcode;
            docs.levell = '一级';
            setdocs({ ...docs });
            setnewcode(newcode);
        } else {
            for (let i = 0; i < newtypelist.length; i++) {
                let name = event.target.value;
                if (name === newtypelist[i].name) {
                    message.error('不能增加相同的字典名字');
                    setdocs();
                    break;
                } else {
                    let num = [];
                    newtypelist.map(rst => {
                        num.push(parseInt(rst.code.split('_')[1]));
                    });
                    let max = Math.max.apply(null, num);
                    let rightnum = max + 1;
                    if (rightnum <= 9) {
                        rightnum = '0' + rightnum;
                    }
                    let newcode = 'level' + '_' + rightnum;
                    docs.name = name;
                    docs.code = newcode;
                    docs.levell = '一级';
                    const {
                        actions: { setnewcode, setdocs }
                    } = this.props;
                    setdocs({ ...docs });
                    setnewcode(newcode);
                }
            }
        }
    }

    things (filter, event) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let things = event.target.value;
        docs.things = things;
        setdocs({ ...docs });
    }

    tatal (filter, event) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let tatal = event.target.value;
        docs.tatal = tatal;
        setdocs({ ...docs });
    }

    people (filter, event) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let people = event.target.value;
        docs.people = people;
        setdocs({ ...docs });
    }

    posible (filter, event) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let posible = event.target.value;
        docs.posible = posible;
        setdocs({ ...docs });
    }

    methode (filter, event) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let methode = event.target.value;
        docs.methode = methode;
        setdocs({ ...docs });
    }

    levell (filter, value) {
        const {
            docs = {},
            actions: { setdocs }
        } = this.props;
        let levell = value;
        docs.levell = levell;
        setdocs({ ...docs });
    }

    cancel () {
        const {
            actions: { levelAdding, setdocs }
        } = this.props;
        levelAdding(false);
        setdocs();
    }

    save () {
        const {
            actions: {
                patchdocument,
                levelAdding,
                getwxtype,
                postdocument,
                setdocs,
                setrst
            },
            docs = {},
            typecode = {},
            newtypelist,
            setrsts
        } = this.props;
        patchdocument(
            { code: WXlevel },
            {
                metalist: [
                    {
                        code: docs.code,
                        name: docs.name,
                        'D(总计)': docs.tatal,
                        风险控制措施: docs.methode,
                        'L(事故发生的可能性)': docs.posible,
                        'E(人员暴露于危险环境中的频繁程度)': docs.people,
                        'C(发生事故可能造成的后果)': docs.things,
                        风险级别: docs.levell
                    }
                ]
            }
        ).then(rst => {
            message.success('新增文件成功！');
            levelAdding(false);
            setdocs();
            getwxtype({ code: WXlevel }).then(rst => {
                let newtypelists = rst.metalist;
                rst.metalist.map((type, index) => {
                    newtypelists[index].on = index + 1;
                });
                const {
                    actions: { newtypelist }
                } = this.props;
                newtypelist(newtypelists);
            });
        });
    }
}

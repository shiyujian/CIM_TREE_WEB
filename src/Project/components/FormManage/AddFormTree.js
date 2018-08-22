import React, { Component } from 'react';
import { Form, Input, Button, message, Row, Col, Select } from 'antd';
import { FORM_WORKFLOW } from '_platform/api';
export const Datumcode = window.DeathCode.OVERALL_FORM;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

class AddFormTree extends Component {
    constructor (props) {
        super(props);
        this.state = { visible: false };
    }

    createNewDir () {
        let {
            actions: { addDir, refreshPanelTo, getworkTree, changeadddocs },
            form: { validateFields },
            adddocs = {},
            datumpk = {},
            currentcode = {},
            currentpk = {},
            depth
        } = this.props;
        this.props.form.validateFields((err, values) => {
            console.log('validateFields', values);
            if (!err) {
                if (adddocs.code === undefined || adddocs.name === undefined) {
                    message.warning('不能进行提交');
                }
                if (JSON.stringify(currentcode) === '{}') {
                    addDir(
                        {},
                        {
                            name: adddocs.name,
                            code: adddocs.code,
                            obj_type: 'C_DIR',
                            status: 'A',
                            parent: {
                                pk: datumpk,
                                code: Datumcode,
                                obj_type: 'C_DIR'
                            }
                        }
                    ).then(rst => {
                        if (rst.code === '') {
                            message.error('新增不成功');
                        } else {
                            message.success('新增目录成功！');
                            refreshPanelTo('NOR');
                            getworkTree({ code: Datumcode });
                            changeadddocs();
                        }
                    });
                } else {
                    if (depth != '2') {
                        addDir(
                            {},
                            {
                                name: adddocs.name,
                                code: adddocs.code,
                                obj_type: 'C_DIR',
                                status: 'A',
                                parent: {
                                    pk: currentpk,
                                    code: currentcode,
                                    obj_type: 'C_DIR'
                                }
                            }
                        ).then(rst => {
                            if (rst.code === '') {
                                message.error('新增不成功');
                            } else {
                                message.success('新增目录成功！');
                                refreshPanelTo('NOR');
                                getworkTree({ code: Datumcode });
                                changeadddocs();
                            }
                        });
                    } else {
                        addDir(
                            {},
                            {
                                name: adddocs.name,
                                code: adddocs.code,
                                obj_type: 'C_DIR',
                                status: 'A',
                                parent: {
                                    pk: currentpk,
                                    code: currentcode,
                                    obj_type: 'C_DIR'
                                },
                                extra_params: {
                                    workflow: values.workflow
                                }
                            }
                        ).then(rst => {
                            if (rst.code === '') {
                                message.error('新增不成功');
                            } else {
                                message.success('新增目录成功！');
                                refreshPanelTo('NOR');
                                getworkTree({ code: Datumcode });
                                changeadddocs();
                            }
                        });
                    }
                }
            }
        });
    }

    name (filter, event) {
        let name = event.target.value;
        const {
            actions: { changeadddocs },
            adddocs = {}
        } = this.props;
        adddocs.name = name;
        changeadddocs({ ...adddocs });
    }

    code (filter, event) {
        let code = event.target.value;
        const {
            actions: { changeadddocs },
            adddocs = {}
        } = this.props;
        adddocs.code = code;
        changeadddocs({ ...adddocs });
    }

    render () {
        let {
            form: { getFieldDecorator },
            filter = {},
            adddocs = {},
            currentcode = {},
            currentpk = {},
            depth
        } = this.props;
        console.log(currentcode);

        let formItemLayout = {
            labelCol: {},
            wrapperCol: { span: 10 }
        };

        return (
            <div style={{ padding: '50px 0' }}>
                <Row>
                    <Col span={12}>
                        <span>
                            {JSON.stringify(currentcode) === '{}'
                                ? '新增平级目录'
                                : '新增子目录'}
                        </span>
                    </Col>
                    {JSON.stringify(currentcode) === '{}' ? null : (
                        <div>
                            <label>父级code</label>
                            <span>{currentcode}</span>
                            <label>父级PK</label>
                            <span>{currentpk}</span>
                        </div>
                    )}
                </Row>
                <Form layout='vertical'>
                    <FormItem {...formItemLayout} label='目录名称'>
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入目录名称' }
                            ]
                        })(
                            <Input
                                placeholder='请输入目录名称'
                                onChange={this.name.bind(this, filter)}
                                value={adddocs.name}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='目录code值'>
                        {getFieldDecorator('code', {
                            rules: [
                                {
                                    required: true,
                                    message:
                                        '必须为英文字母、数字以及 -_~`*!.[]{}()的组合',
                                    pattern: /^[\w\d\_\-]+$/
                                }
                            ]
                        })(
                            <Input
                                placeholder='请输入目录编码'
                                onChange={this.code.bind(this, filter)}
                                value={adddocs.code}
                            />
                        )}
                    </FormItem>
                    {depth != '2' ? (
                        ''
                    ) : (
                        <FormItem {...formItemLayout} label='关联流程'>
                            {getFieldDecorator('workflow', {
                                rules: [
                                    { required: true, message: '请选择流程' }
                                ]
                            })(
                                <Select placeholder='请选择关联流程'>
                                    {FORM_WORKFLOW.map(workflow => {
                                        return (
                                            <Option
                                                key={workflow.value}
                                                value={
                                                    workflow.code +
                                                    '--' +
                                                    workflow.value
                                                }
                                            >
                                                {workflow.value}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    )}
                    <Button onClick={this.createNewDir.bind(this)}>
                        确定创建
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Form.create()(AddFormTree);

import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Select } from 'antd';
export const Datumcode = window.DeathCode.DATUM_GCWD;
const FormItem = Form.Item;
const Option = Select.Option;

class AddDirPanel extends Component {
    constructor (props) {
        super(props);
        this.state = { visible: false };
    }

    createNewDir () {
        let {
            actions: { addDir, getworkTree },
            form: { validateFields },
            datumpk = {},
            currentcode = {},
            currentpk = {},
            user,
            isAdmin,
            extraOrgLeaf,
            extraOrgCode
        } = this.props;
        validateFields((err, values) => {
            console.log('values', values);
            if (!err) {
                console.log('currentcode', currentcode);
                if (!currentcode) {
                    addDir(
                        {},
                        {
                            name: values.dirName,
                            code: `gcyx_${values.dirCode}`,
                            obj_type: 'C_DIR',
                            status: 'A',
                            parent: {
                                pk: datumpk,
                                code: Datumcode,
                                obj_type: 'C_DIR'
                            },
                            extra_params: {
                                orgLeaf: values.dirOrgLeaf,
                                orgCode: values.dirOrgCode
                            }
                        }
                    ).then(rst => {
                        if (rst.code === '') {
                            message.error('新增不成功');
                        } else {
                            message.success('新增目录成功！');
                            this.props.handleDirClear();
                            getworkTree({ code: Datumcode });
                            this.clear();
                        }
                    });
                } else {
                    let orgLeaf = true;
                    let orgCode = extraOrgCode;
                    if (isAdmin && !extraOrgLeaf) {
                        orgLeaf = values.dirOrgLeaf;
                        orgCode = values.dirOrgCode;
                    }
                    addDir(
                        {},
                        {
                            name: values.dirName,
                            code: `gcyx_${values.dirCode}`,
                            obj_type: 'C_DIR',
                            status: 'A',
                            parent: {
                                pk: currentpk,
                                code: currentcode,
                                obj_type: 'C_DIR'
                            },
                            extra_params: {
                                orgLeaf: orgLeaf,
                                orgCode: orgCode
                            }
                        }
                    ).then(rst => {
                        if (rst.code === '') {
                            message.error('新增不成功');
                        } else {
                            message.success('新增目录成功！');
                            this.props.handleDirClear();
                            getworkTree({ code: Datumcode });
                            this.clear();
                        }
                    });
                }
            }
        });
    }

    clear = () => {
        const {
            form: {
                setFieldsValue
            },
            isAdmin,
            extraOrgLeaf
        } = this.props;
        if (isAdmin && !extraOrgLeaf) {
            setFieldsValue({
                dirName: '',
                dirCode: '',
                dirOrgCode: '',
                dirOrgLeaf: ''
            });
        } else {
            setFieldsValue({
                dirName: '',
                dirCode: ''
            });
        }
    }

    render () {
        let {
            form: { getFieldDecorator },
            currentcode = {},
            isAdmin,
            extraOrgLeaf
        } = this.props;
        console.log(currentcode);

        let formItemLayout = {
            labelCol: {},
            wrapperCol: { span: 10 }
        };
        let title = '';
        if (currentcode) {
            title = '新增子目录';
        } else {
            title = '新增平级目录';
        }

        return (
            <Card title={title}>
                <Form layout='vertical'>
                    <FormItem {...formItemLayout} label='目录名称'>
                        {getFieldDecorator('dirName', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入目录名称'
                                }
                            ]
                        })(<Input placeholder='请输入目录名称' />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='目录编码'>
                        {getFieldDecorator('dirCode', {
                            rules: [
                                {
                                    required: true,
                                    message:
                                        '必须为英文字母、数字以及 -_~`*!.[]{}()的组合',
                                    pattern: /^[\w\d\_\-]+$/
                                }
                            ],
                            initialValue: ''
                        })(<Input placeholder='请输入目录编码' />)}
                    </FormItem>
                    {
                        (isAdmin && !extraOrgLeaf)
                            ? (
                                <div>
                                    <FormItem {...formItemLayout} label='组织机构编码'>
                                        {getFieldDecorator('dirOrgCode', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                    '必须为英文字母、数字以及 -_~`*!.[]{}()的组合',
                                                    pattern: /^[\w\d\_\-]+$/
                                                }
                                            ]
                                        })(
                                            <Input placeholder='请输入目录编码' />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label='是否组织机构叶子节点'>
                                        {getFieldDecorator('dirOrgLeaf', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                    '请选择是否组织机构叶子节点'
                                                }
                                            ]
                                        })(
                                            <Select placeholder='请选择是否组织机构叶子节点'>
                                                <Option value key='是' >是</Option>
                                                <Option value={false} key='否' >否</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>

                            ) : ''
                    }
                    <Button onClick={this.createNewDir.bind(this)}>
                        确定创建
                    </Button>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(AddDirPanel);

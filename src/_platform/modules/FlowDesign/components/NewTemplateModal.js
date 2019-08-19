import React from 'react';
import { bool, func, string } from 'prop-types';
import shortid from 'shortid';
import { Form, Modal, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
class NewTemplateModal extends React.Component {
    static propTypes = {
        title: string,
        visible: bool,
        onOk: func,
        onCancel: func
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.visible && nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                this.props.form.setFieldsValue({ code: shortid.generate() });
            }
        }
    }

    render () {
        const {
            title,
            visible,
            onOk,
            onCancel,
            form: {
                getFieldDecorator
            },
            ...props
        } = this.props;

        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 14
            }
        };

        return (

            <Modal
                title={title}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <FormItem {...formItemLayout} label='模板名称'>
                        {
                            getFieldDecorator('name', {
                                rules: [{ required: true, message: '必填', trigger: 'blur' }],
                                initialValue: '新建模板'
                            })(
                                <Input placeholder='请输入模板名称' />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label='模板说明'>
                        {
                            getFieldDecorator('FlowDescribe')(
                                <TextArea rows={4} />
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>

        );
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onOk(values);
            }
        });
    }

    handleCancel = () => {
        this.props.onCancel();
    }
}

export default Form.create()(NewTemplateModal);

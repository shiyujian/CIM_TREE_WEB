import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

export default class Info extends Component {
    constructor (props) {
        super(props);
        this.state = {
            Arrays: []
        };
    }
    static propTypes = {};
    render () {
        const {
            sidebar: { node = {} } = {}
        } = this.props;
        const { extra_params: extra = {} } = node || {};
        const { extra_params } = node || {};
        let companyVisible = false;
        // 新建项目时，默认显示
        if (extra_params && extra_params.companyStatus) {
            companyVisible = true;
        }
        let disabled = true;
        if (node && node.code) {
            disabled = false;
        }
        return (
            <div style={{ marginBottom: 20 }}>
                <div
                    style={{
                        borderBottom: '1px solid #e9e9e9',
                        paddingBottom: 15,
                        marginBottom: 20
                    }}
                >
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            paddingRight: '1em'
                        }}
                    >{`信息管理`}</span>
                    <Button
                        onClick={this.edit.bind(this)}
                        style={{ float: 'right' }}
                        type='primary'
                        ghost
                        disabled={disabled}
                    >
                        编辑
                    </Button>
                </div>
                <FormItem {...Info.layout} label={`名称`}>
                    <Input readOnly value={node.name} />
                </FormItem>
                <FormItem {...Info.layout} label={`编码`}>
                    <Input readOnly value={node.code} />
                </FormItem>
                <FormItem {...Info.layout} label={`标段`}>
                    <Input readOnly value={extra.sections} />
                </FormItem>
                {
                    companyVisible
                        ? <FormItem {...Info.layout} label={`公司类型`}>
                            <Input readOnly value={extra.companyStatus || ''} />
                        </FormItem>
                        : ''
                }
                <FormItem {...Info.layout} label={`简介`}>
                    <Input
                        type='textarea'
                        rows={4}
                        readOnly
                        value={extra.introduction}
                    />
                </FormItem>
            </div>
        );
    }

    edit = async () => {
        const {
            sidebar: { node } = {},
            actions: { changeSidebarField, resetAdditionField, changeEditOrgVisible }
        } = this.props;
        if (typeof node.extra_params.sections === 'string') {
            node.extra_params.sections = node.extra_params.sections
                ? node.extra_params.sections.split(',')
                : [];
            node.extra_params.sections =
                node.extra_params.sections === ''
                    ? []
                    : node.extra_params.sections;
        }

        await changeSidebarField('parent', undefined);
        await resetAdditionField({
            visible: false,
            ...node,
            ...node.extra_params
        });
        await changeEditOrgVisible(true);
    }

    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
}

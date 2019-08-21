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
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    handleEditOrg = async () => {
        const {
            sidebar: { node } = {},
            actions: {
                changeSidebarField,
                resetAdditionField,
                changeEditOrgVisible
            }
        } = this.props;
        await changeSidebarField('parent', undefined);
        await resetAdditionField({
            visible: false,
            ...node
        });
        await changeEditOrgVisible(true);
    }

    handleEditProject = async () => {
        const {
            actions: {
                changeEditProjectVisible
            }
        } = this.props;
        console.log('changeEditProjectVisible');
        await changeEditProjectVisible(true);
    }

    render () {
        const {
            sidebar: { node = {} } = {}
        } = this.props;
        let nodeIsOrg = false;
        let disabled = true;
        let nodeIsProject = false;
        if (node && node.ID) {
            disabled = false;
            if (node && node.OrgCode) {
                nodeIsOrg = true;
                nodeIsProject = false;
            } else if (node && node.Orgs) {
                nodeIsOrg = false;
                nodeIsProject = true;
            }
        }
        let companyVisible = false;
        // 新建项目时，默认显示
        if (node && node.OrgType) {
            companyVisible = true;
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
                    >
                        信息管理
                    </span>
                    {
                        disabled
                            ? <Button
                                style={{ float: 'right' }}
                                type='primary'
                                ghost
                                disabled
                            >
                            编辑
                            </Button>
                            : (
                                nodeIsProject
                                    ? <Button
                                        onClick={this.handleEditProject.bind(this)}
                                        style={{ float: 'right' }}
                                        type='primary'
                                        ghost
                                        disabled={disabled}
                                    >
                                        编辑
                                    </Button>
                                    : <Button
                                        onClick={this.handleEditOrg.bind(this)}
                                        style={{ float: 'right' }}
                                        type='primary'
                                        ghost
                                        disabled={disabled}
                                    >
                                        编辑
                                    </Button>
                            )
                    }
                </div>
                {
                    nodeIsOrg
                        ? <div>
                            <FormItem {...Info.layout} label={`名称`}>
                                <Input readOnly value={node.OrgName} />
                            </FormItem>
                            <FormItem {...Info.layout} label={`编码`}>
                                <Input readOnly value={node.OrgCode} />
                            </FormItem>
                            <FormItem {...Info.layout} label={`标段`}>
                                <Input readOnly value={node.Section} />
                            </FormItem>
                            {
                                companyVisible
                                    ? <FormItem {...Info.layout} label={`公司类型`}>
                                        <Input readOnly value={node.OrgType || ''} />
                                    </FormItem>
                                    : ''
                            }
                        </div>
                        : <div>
                            <FormItem {...Info.layout} label={`项目名称`}>
                                <Input readOnly value={node.ProjectName} />
                            </FormItem>
                            <FormItem {...Info.layout} label={`项目编码`}>
                                <Input readOnly value={node.ProjectNo} />
                            </FormItem>
                            <FormItem {...Info.layout} label={`行政编码`}>
                                <Input readOnly value={node.RegionCode} />
                            </FormItem>
                        </div>
                }

            </div>
        );
    }
}

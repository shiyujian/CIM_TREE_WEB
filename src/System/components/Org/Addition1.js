import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            Arrays: []
        };
    }
    componentDidMount = () => {
        const {
            form: {
                setFieldsValue
            },
            addition
        } = this.props;
        setFieldsValue({
            name: (addition && addition.name) || undefined,
            code: (addition && addition.code) || undefined,
            sections: (addition && addition.extra_params && addition.extra_params.sections) || undefined,
            companyStatus: (addition && addition.extra_params && addition.extra_params.companyStatus) || undefined
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            sidebar: { node = {}, parent } = {},
            addition = {},
            actions: { changeAdditionField }
        } = this.props;
        const { extra_params } = node || {};
        let companyVisible = false;
        // 新建项目时，默认显示
        if (parent && parent.code && parent.code === 'ORG_ROOT') {
            companyVisible = true;
        } else {
            // 未选中任何部门 ，说明新增项目，需要显示
            if (JSON.stringify(node) === '{}') {
                companyVisible = true;
            }
            // 新增信息时   需要显示
            if (extra_params && extra_params.companyStatus && extra_params.companyStatus === '项目') {
                companyVisible = true;
            }
            // 编辑公司信息时，需要显示
            if (!parent && extra_params && extra_params.companyStatus && extra_params.companyStatus === '公司') {
                companyVisible = true;
            }
        }
        const title = Addition.getTitle(node, parent);
        let units = this.getUnits();
        return (
            <Modal
                title={
                    parent
                        ? `新建${title} | ${parent.name}`
                        : `编辑${title} | ${node.name}`
                }
                maskClosable={false}
                visible={addition.visible}
                onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <FormItem {...Addition.layout} label={`${title}名称`}>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入名称'
                            }
                        ]
                    })(
                        <Input
                            placeholder='请输入名称'
                            onChange={this.changeAdditionName.bind(this)}
                        />
                    )}
                </FormItem>
                <FormItem {...Addition.layout} label={`${title}编码`}>
                    {getFieldDecorator('code', {
                        rules: [
                            {
                                required: true,
                                message: '必须为英文字母、数字以及 -_的组合',
                                pattern: /^[\w\d\_\-]+$/
                            }
                        ]
                    })(
                        <Input
                            readOnly={!parent}
                            placeholder='请输入编码'
                            onChange={this.changeAdditionCode.bind(this)}
                        />
                    )}
                </FormItem>
                <FormItem {...Addition.layout} label={`${title}标段`}>
                    {getFieldDecorator('sections', {
                        rules: [
                            {
                                required: false,
                                message: '请选择标段'
                            }
                        ]
                    })(
                        <Select
                            placeholder='标段'
                            onChange={this.changeSection.bind(this)}
                            mode='multiple'
                            style={{ width: '100%' }}
                        >
                            {units
                                ? units.map(item => {
                                    return (
                                        <Option key={item.No} value={item.No}>
                                            {item.Name}
                                        </Option>
                                    );
                                })
                                : ''}
                        </Select>
                    )}

                </FormItem>
                {
                    companyVisible
                        ? (
                            <FormItem {...Addition.layout} label={'公司与否'}>
                                {getFieldDecorator('companyStatus', {
                                    rules: [
                                        {
                                            required: companyVisible,
                                            message: '是否为公司'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='是否为公司'
                                        style={{ width: '100%' }}
                                        onChange={this.changeCompany.bind(this)}
                                    >
                                        <Option key={'是'} value={'公司'}>
                                            是
                                        </Option>
                                        <Option key={'否'} value={'项目'}>
                                            否
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                        ) : ''
                };
                <FormItem {...Addition.layout} label={`${title}简介`}>
                    <Input
                        placeholder='请输入简介'
                        value={(addition && addition.introduction) || undefined}
                        type='textarea'
                        rows={4}
                        onChange={changeAdditionField.bind(
                            this,
                            'introduction'
                        )}
                    />
                </FormItem>
            </Modal>
        );
    }

    // 获取项目的标段
    getUnits = () => {
        try {
            const {
                sidebar: { node = {} } = {},
                listStore = [],
                platform: { tree = {} }
            } = this.props;
            let bigTreeList = tree.bigTreeList || [];
            let projectName = '';
            listStore.map((item, index) => {
                item.map(rst => {
                    if (rst.name === node.name && rst.code === node.code) {
                        projectName = listStore[index]
                            ? listStore[index][0].name
                            : '';
                    }
                });
            });
            let units = [];
            bigTreeList.map((item) => {
                let itemNameArr = item.Name.split('项目');
                let name = itemNameArr[0];
                if (projectName.indexOf(name) !== -1) {
                    units = item.children;
                }
            });
            return units;
        } catch (e) {
            console.log('getUnits', e);
        }
    }

    changeAdditionName = (e) => {
        const {
            actions: { changeAdditionField },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            name: e.target.value
        });
        changeAdditionField('name', e.target.value);
    }

    changeAdditionCode = (e) => {
        const {
            actions: { changeAdditionField },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            code: e.target.value
        });
        changeAdditionField('code', e.target.value);
    }

    changeSection (value) {
        const {
            actions: { changeAdditionField },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            sections: value
        });
        changeAdditionField('sections', value);
    }

    changeCompany = (value) => {
        const {
            actions: { changeAdditionField },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            companyStatus: value
        });
        changeAdditionField('companyStatus', value);
    }

    save = async () => {
        const {
            sidebar: { node = {}, parent } = {},
            addition = {},
            actions: {
                postOrg,
                putOrg,
                getOrgTree,
                changeSidebarField,
                clearAdditionField,
                changeOrgTreeDataStatus,
                addDir
            }
        } = this.props;
        const { extra_params = '' } = node || {};
        let companyVisible = false;
        if (parent && parent.code && parent.code === 'ORG_ROOT') {
            companyVisible = true;
        } else {
            if (JSON.stringify(node) === '{}') {
                companyVisible = true;
            }
            if (extra_params && extra_params.companyStatus && extra_params.companyStatus === '项目') {
                companyVisible = true;
            }
            if (!parent && extra_params && extra_params.companyStatus && extra_params.companyStatus === '公司') {
                companyVisible = true;
            }
        }
        const sections = addition.sections ? addition.sections.join() : [];
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            if (!err) {
                if (parent) {
                    let postData = {
                        name: addition.name,
                        code: addition.code,
                        obj_type: 'C_ORG',
                        status: 'A',
                        extra_params: {
                            introduction: addition.introduction,
                            sections: sections,
                            companyStatus: companyVisible ? values.companyStatus : ''
                        },
                        parent: {
                            pk: parent.pk,
                            code: parent.code,
                            obj_type: 'C_ORG'
                        }
                    };
                    let rst = await postOrg({}, postData);
                    if (rst.pk) {
                        if (companyVisible) {
                            let dirPostData = {
                                name: addition.name,
                                code: `gcwd_${addition.code}`,
                                obj_type: 'C_DIR',
                                status: 'A',
                                parent: {
                                    // pk: datumpk,
                                    code: `gcwd_${parent.code}`,
                                    obj_type: 'C_DIR'
                                },
                                extra_params: {
                                    orgLeaf: values.dirOrgLeaf,
                                    orgCode: addition.code,
                                    orgDel: false
                                }
                            };
                            // let dirData = await addDir({}, dirPostData);
                        }
                        await changeSidebarField('addition', false);
                        await changeSidebarField('parent', null);
                        await clearAdditionField();
                        await getOrgTree({}, { depth: 7 });
                        await changeOrgTreeDataStatus(true);
                    }
                } else {
                    let postData = {
                        obj_type: 'C_ORG',
                        status: 'A',
                        name: addition.name,
                        extra_params: {
                            introduction: addition.introduction,
                            sections: sections,
                            companyStatus: companyVisible ? values.companyStatus : ''
                        }
                    };
                    let rst = await putOrg({ code: addition.code }, postData);
                    if (rst.pk) {
                        await changeSidebarField('addition', false);
                        await changeSidebarField('parent', null);
                        await clearAdditionField();
                        await getOrgTree({}, { depth: 7 });
                        await changeOrgTreeDataStatus(true);
                        await this.forceUpdate();
                    }
                }
            }
        });
    }

    cancel () {
        const {
            actions: { clearAdditionField }
        } = this.props;
        clearAdditionField();
    }

    static getTitle (node, parent) {
        if (parent && parent.code) {
            switch (parent.type) {
                case 'project':
                    return '子项目';
                case 'subProject':
                    return '机构类型';
                case 'org':
                    return '单位';
                case 'company':
                    return '部门';
                default:
                    return '项目';
            }
        }
        switch (node.type) {
            case 'project':
                return '项目';
            case 'subProject':
                return '子项目';
            case 'org':
                return '机构类型';
            case 'company':
                return '单位';
            case 'department':
                return '部门';
            default:
                return '';
        }
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
}
export default Form.create()(Addition);

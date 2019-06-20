import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Notification,
    Spin,
    Button,
    Row
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            companyVisible: false,
            loading: false
        };
    }
    componentDidMount = () => {
        const {
            form: {
                setFieldsValue
            },
            addition,
            sidebar: { node = {}, parent } = {}
        } = this.props;
        setFieldsValue({
            name: (addition && addition.name) || undefined,
            code: (addition && addition.code) || undefined,
            sections: (addition && addition.extra_params && addition.extra_params.sections) || undefined,
            introduction: (addition && addition.extra_params && addition.extra_params.introduction) || undefined
        });
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
            if (extra_params && extra_params.companyStatus && extra_params.companyStatus === '非公司') {
                companyVisible = true;
            }
            // 编辑公司信息时，需要显示
            if (!parent && extra_params && extra_params.companyStatus && extra_params.companyStatus.indexOf('单位') !== -1) {
                companyVisible = true;
            }

            // 只分为项目和公司时
            if (extra_params && extra_params.companyStatus && extra_params.companyStatus === '项目') {
                companyVisible = true;
            }
            if (!parent && extra_params && extra_params.companyStatus && extra_params.companyStatus === '公司') {
                companyVisible = true;
            }
        }
        this.setState({
            companyVisible
        });
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
    changeIntroduction = (value) => {
        const {
            actions: { changeAdditionField },
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            introduction: value
        });
        changeAdditionField('introduction', value);
    }

    save = async () => {
        const {
            addition = {},
            actions: {
                putOrg,
                getOrgTree,
                changeSidebarField,
                clearAdditionField,
                changeOrgTreeDataStatus,
                changeEditOrgVisible
            }
        } = this.props;
        const {
            companyVisible
        } = this.state;
        const sections = addition.sections ? addition.sections.join() : [];
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
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
                console.log('rst', rst);
                if (rst.pk) {
                    await changeSidebarField('parent', null);
                    await clearAdditionField();
                    setTimeout(async () => {
                        await getOrgTree({}, { depth: 7 });
                        await changeOrgTreeDataStatus(true);
                        this.setState({
                            loading: false
                        });
                        await changeEditOrgVisible(false);
                    }, 1000);
                } else {
                    Notification.error({
                        message: '修改组织机构信息失败',
                        duration: 3
                    });
                    this.setState({
                        loading: false
                    });
                }
            }
        });
    }

    cancel = async () => {
        const {
            actions: {
                clearAdditionField,
                changeSidebarField,
                changeEditOrgVisible
            }
        } = this.props;
        await changeSidebarField('parent', null);
        await clearAdditionField();
        await changeEditOrgVisible(false);
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    render () {
        const {
            form: { getFieldDecorator },
            sidebar: { node = {}, parent } = {},
            editOrgVisible,
            addition
        } = this.props;
        const {
            companyVisible,
            loading
        } = this.state;
        let units = this.getUnits();

        return (
            <Modal
                title={`编辑 | ${node.name}`}
                maskClosable={false}
                visible={editOrgVisible}
                footer={null}
                closable={false}
                // onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <Spin spinning={loading}>
                    <div>
                        <FormItem {...Addition.layout} label={`名称`}>
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
                        <FormItem {...Addition.layout} label={`编码`}>
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
                        <FormItem {...Addition.layout} label={`标段`}>
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
                                    <FormItem {...Addition.layout} label={'公司类型'}>
                                        {getFieldDecorator('companyStatus', {
                                            initialValue: `${
                                                (addition && addition.companyStatus)
                                                    ? addition.companyStatus : ''
                                            }`,
                                            rules: [
                                                {
                                                    required: companyVisible,
                                                    message: '请选择公司类型'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择公司类型'
                                                style={{ width: '100%' }}
                                                onChange={this.changeCompany.bind(this)}
                                            >
                                                <Option key={'非公司'} value={'非公司'}>
                                                    非公司
                                                </Option>
                                                <Option key={'业主单位'} value={'业主单位'}>
                                                    业主单位
                                                </Option>
                                                <Option key={'施工单位'} value={'施工单位'}>
                                                    施工单位
                                                </Option>
                                                <Option key={'监理单位'} value={'监理单位'}>
                                                    监理单位
                                                </Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                ) : ''
                        }
                        <FormItem {...Addition.layout} label={`简介`}>
                            <Input
                                placeholder='请输入简介'
                                type='textarea'
                                rows={4}
                                onChange={this.changeIntroduction.bind(this)}
                            />
                        </FormItem>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                key='submit'
                                type='primary'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.save.bind(this)}
                            >
                            确定
                            </Button>
                            <Button
                                key='back'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.cancel.bind(this)}>
                            关闭
                            </Button>
                        </Row>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(Addition);

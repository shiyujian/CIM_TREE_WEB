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
            sidebar: { node = {}, parent } = {}
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
                sidebar: { node = {}, parent } = {},
                listStore = [],
                platform: { tree = {} }
            } = this.props;
            // 新建项目时，默认显示
            if (parent && parent.code && parent.code === 'ORG_ROOT') {
                return [];
            }
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
            sidebar: { parent } = {},
            addition = {},
            actions: {
                postOrg,
                getOrgTree,
                changeSidebarField,
                clearAdditionField,
                changeOrgTreeDataStatus
            }
        } = this.props;
        const {
            companyVisible
        } = this.state;
        const sections = addition.sections ? addition.sections.join() : [];
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            if (!err) {
                if (parent) {
                    this.setState({
                        loading: true
                    });
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
                    console.log('rst', rst);
                    if (rst.pk) {
                        setTimeout(async () => {
                            await getOrgTree({});
                            await changeOrgTreeDataStatus(true);
                            this.setState({
                                loading: false
                            });
                            await clearAdditionField();
                            await changeSidebarField('addition', false);
                            await changeSidebarField('parent', null);
                        }, 1000);
                    } else if (rst === 'Create Data failed: this code has already exits .') {
                        Notification.error({
                            message: '此编码已存在',
                            duration: 3
                        });
                        this.setState({
                            loading: false
                        });
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

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    render () {
        const {
            form: { getFieldDecorator },
            sidebar: { parent } = {},
            addition = {},
            actions: { changeAdditionField }
        } = this.props;
        const {
            companyVisible,
            loading
        } = this.state;
        let units = this.getUnits();

        return (
            <Modal
                title={`新建组织机构 | ${parent.name}`}
                maskClosable={false}
                visible={addition.visible}
                footer={null}
                closable={false}
                // onOk={this.save.bind(this)}
                // onCancel={this.cancel.bind(this)}
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
                                                <Option key={'施工单位'} value={'施工单位'}>
                                                    施工单位
                                                </Option>
                                                <Option key={'监理单位'} value={'监理单位'}>
                                                    监理单位
                                                </Option>
                                                <Option key={'业主单位'} value={'业主单位'}>
                                                    业主单位
                                                </Option>
                                                <Option key={'养护单位'} value={'养护单位'}>
                                                    养护单位
                                                </Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                ) : ''
                        }
                        <FormItem {...Addition.layout} label={`简介`}>
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

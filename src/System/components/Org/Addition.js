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
            loading: false,
            regionCode: '',
            sectionList: []
        };
    }
    componentDidMount = async () => {
        const {
            sidebar: { node = {} } = {}
        } = this.props;
        await this.getUnits();
        let companyVisible = false;
        if (node && node.ID) {
            if (node.OrgCode && node.OrgType) {
                if (node.OrgType === '非公司') {
                    companyVisible = true;
                }
            } else {
                // 新建项目时，默认显示
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
                platform: {
                    tree = {},
                    org = []
                }
            } = this.props;
            let bigTreeList = tree.bigTreeList || [];
            let projectName = '';
            let regionCode = '';
            org.map((projectData) => {
                if (node && node.Orgs) {
                    if (node.ID === projectData.ID) {
                        projectName = projectData.ProjectName;
                        regionCode = projectData.RegionCode;
                    }
                } else if (node && node.OrgCode) {
                    if (node.ProjectID === projectData.ID) {
                        projectName = projectData.ProjectName;
                        regionCode = projectData.RegionCode;
                    }
                }
            });
            let sectionList = [];
            bigTreeList.map((item) => {
                let itemNameArr = item.Name.split('项目');
                let name = itemNameArr[0];
                if (projectName.indexOf(name) !== -1) {
                    sectionList = item.children;
                }
            });
            this.setState({
                sectionList,
                regionCode
            });
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
                postAddOrg,
                getOrgTree,
                changeSidebarField,
                clearAdditionField
            }
        } = this.props;
        const {
            companyVisible,
            regionCode
        } = this.state;
        const sections = addition.sections ? addition.sections.join() : '';
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            if (!err) {
                if (parent) {
                    this.setState({
                        loading: true
                    });
                    let postData = {};
                    if (parent && parent.ID && parent.OrgCode) {
                        postData = {
                            OrgCode: addition.code,
                            OrgName: addition.name,
                            OrgType: companyVisible ? values.companyStatus : '',
                            ParentID: parent.ID,
                            ProjectID: parent.ProjectID,
                            RegionCode: regionCode,
                            Section: sections
                        };
                    } else if (parent && parent.ID && parent.Orgs) {
                        postData = {
                            OrgCode: addition.code,
                            OrgName: addition.name,
                            OrgType: companyVisible ? values.companyStatus : '',
                            ParentID: '',
                            ProjectID: parent.ID,
                            RegionCode: regionCode,
                            Section: sections
                        };
                    }
                    let rst = await postAddOrg({}, postData);
                    console.log('rst', rst);
                    if (rst && rst.code && rst.code === 1) {
                        setTimeout(async () => {
                            await getOrgTree({});
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
                    } else {
                        Notification.error({
                            message: '新增失败',
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
            addition = {}
        } = this.props;
        const {
            companyVisible,
            loading,
            sectionList
        } = this.state;

        let parentName = (parent && parent.OrgName) || (parent && parent.ProjectName) || '';
        return (
            <Modal
                title={`新建组织机构 | ${parentName}`}
                maskClosable={false}
                visible={addition.visible}
                footer={null}
                closable={false}
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
                                    {sectionList
                                        ? sectionList.map(item => {
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
                                                <Option key={'设计单位'} value={'设计单位'}>
                                                    设计单位
                                                </Option>
                                                <Option key={'造价单位'} value={'造价单位'}>
                                                    造价单位
                                                </Option>
                                                <Option key={'养护单位'} value={'养护单位'}>
                                                    养护单位
                                                </Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                ) : ''
                        }
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

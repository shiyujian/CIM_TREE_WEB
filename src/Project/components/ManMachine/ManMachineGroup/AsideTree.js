import React, { Component } from 'react';
import { Tree, Spin, Button, Popconfirm, Modal, Form, Row, Input, Notification } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getUser} from '_platform/auth';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class AsideTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            teamVisible: false, // 添加班组modal
            teamsTree: [],
            dirData: '',
            addDisabled: true, // 是否能够添加班组
            selected: false, // 是否选中节点
            selectKey: '', // 选中节点的key
            parent: ''
        };
    }
    loop (data) {
        if (data) {
            if (data.children && data.children instanceof Array) {
                return (
                    <TreeNode
                        key={data.ID}
                        title={data.Name}
                        disabled
                    >
                        {
                            data.children &&
                            data.children.map(m => {
                                return this.loop(m);
                            })
                        }
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode
                        key={data.ID}
                        title={data.Name}
                    />
                );
            }
        } else {
            return '';
        }
    }
    componentDidMount = async () => {
        let user = getUser();
        console.log('uer', user);
        if (user && user.username !== 'admin') {
            this.setState({
                addDisabled: false
            });
        }
    }
    // 为班组信息添加公司名称
    handleGroupDataWithCompany = () => {
        const {
            workGroupsData = [],
            parentOrgData
        } = this.props;
        let name = (parentOrgData && parentOrgData.OrgName) || '公司名称';
        let groupsTree = [];
        if (workGroupsData && workGroupsData.length > 0) {
            groupsTree.push({
                id: 1,
                Name: name,
                children: workGroupsData
            });
        }
        return groupsTree;
    }
    // 添加班组
    _handleAddGroup = async () => {
        const {
            actions: {
                postWorkGroup,
                getWorkGroup,
                changeAsideTreeLoading
            },
            parentOrgID
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (!parentOrgID) {
                    Notification.error({
                        message: '该用户非公司人员，不能添加班组',
                        duration: 3
                    });
                }
                let postData = {
                    Name: values.groupName || '',
                    Remark: values.groupDesc || '',
                    Leader: values.groupLeader || '',
                    LeaderPhone: values.groupPhone || '',
                    OrgID: parentOrgID
                };
                let workgroup = await postWorkGroup({}, postData);
                if (workgroup && workgroup.code && workgroup.code === 1) {
                    Notification.success({
                        message: '新增班组成功',
                        dutation: 3
                    });
                    this.setState({
                        teamVisible: false
                    });
                    await changeAsideTreeLoading(true);
                    await getWorkGroup({}, {orgid: parentOrgID});
                    await changeAsideTreeLoading(false);
                } else {
                    Notification.error({
                        message: '新增班组失败',
                        dutation: 3
                    });
                }
            }
        });
    }
    // 删除班组
    _handleDelGroup = async () => {
        const {
            actions: {
                deletWorkGroup,
                changeSelectMemGroup,
                changeSelectState,
                changeAsideTreeLoading,
                getWorkGroup
            },
            parentOrgID
        } = this.props;
        const {
            selectKey,
            selected
        } = this.state;
        if (selected && selectKey) {
            try {
                let delData = await deletWorkGroup({id: selectKey});
                if (delData && delData.code && delData.code === 1) {
                    Notification.success({
                        message: '删除班组成功',
                        dutation: 3
                    });
                    changeSelectState(false);
                    changeSelectMemGroup();
                    this.setState({
                        selected: false
                    });
                    await changeAsideTreeLoading(true);
                    await getWorkGroup({}, {orgid: parentOrgID});
                    await changeAsideTreeLoading(false);
                } else {
                    Notification.error({
                        message: '删除班组失败',
                        dutation: 3
                    });
                }
            } catch (e) {
                console.log('_handleDelGroup', e);
            }
        } else {
            Notification.info({
                message: '未选中节点，不能删除班组',
                dutation: 3
            });
        }
    }
    // 点击树节点
    _handleTreeSelect = async (key, info) => {
        const {
            actions: {
                changeSelectState,
                changeSelectMemGroup
            }
        } = this.props;
        console.log('info', info);
        let selected = info && info.selected;
        let selectKey = (key && key[0]) || '';
        try {
            if (selectKey) {
                await changeSelectMemGroup(selectKey);
                await changeSelectState(selected);
                this.setState({
                    selected,
                    selectKey
                });
            }
        } catch (e) {
            console.log('点击节点', e);
        }
    }
    // 关闭Modal
    _handleCancelModal = () => {
        this.setState({
            teamVisible: false
        });
    }
    // 打开Modal
    _handleModalVisible = () => {
        this.setState({
            teamVisible: true
        });
    }
    // 班组名称校验
    checkGroupName = async (rule, value, callback) => {
        if (value) {
            // 匹配中文，英文字母和数字及下划线
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            if (reg.test(value)) {
                if (value.length > 10) {
                    callback(`请输入班组名称(10个字以下),支持中文，英文字母和数字及下划线`);
                } else {
                    callback();
                }
            } else {
                callback(`请输入班组名称(10个字以下),支持中文，英文字母和数字及下划线`);
            }
        } else {
            callback();
        }
    }
    // 领导名称校验
    checkLeaderName = async (rule, value, callback) => {
        if (value) {
            // 匹配中文
            let reg = /^[\u4e00-\u9fa5]/;
            if (reg.test(value)) {
                if (value.length > 10) {
                    callback(`请输入负责人名称(10个字以下),仅支持中文`);
                } else {
                    callback();
                }
            } else {
                callback(`请输入负责人名称(10个字以下),仅支持中文`);
            }
        } else {
            callback();
        }
    }
    checkPersonTelephone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[1]([3-9])[0-9]{9}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入正确的手机号`);
                }
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
    }

    checkDesc = async (rule, value, callback) => {
        if (value) {
            // 匹配中文，英文字母和数字及下划线
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            if (reg.test(value)) {
                if (value.length > 30) {
                    callback(`请输入备注(30个字以下)`);
                } else {
                    callback();
                }
            } else {
                callback(`请输入备注(30个字以下)`);
            }
        } else {
            callback();
        }
    }

    render () {
        const {
            teamVisible,
            addDisabled,
            selected
        } = this.state;
        const {
            form: { getFieldDecorator },
            asideTreeLoading = false,
            parentOrgData,
            workGroupsData = [],
            selectMemGroup
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };

        let groupsTree = this.handleGroupDataWithCompany();
        return (
            <div>
                <Spin spinning={asideTreeLoading}>
                    <div>
                        <Button
                            style={{marginRight: 10}}
                            type='primary'
                            onClick={this._handleModalVisible.bind(this)}
                            disabled={addDisabled}
                        >
                            新增班组
                        </Button>
                        {
                            selected
                                ? <Popconfirm
                                    onConfirm={this._handleDelGroup.bind(this)}
                                    title='确定要删除该班组么'
                                    okText='确定'
                                    cancelText='取消' >
                                    <Button
                                        type='danger'
                                        disabled={!selected}
                                    >
                                    删除班组
                                    </Button>
                                </Popconfirm>
                                : <Button
                                    type='danger'
                                    disabled={!selected}
                                >
                                    删除班组
                                </Button>
                        }

                        <div>
                            <div>
                                <Tree
                                    showLine
                                    defaultExpandAll
                                    selectedKeys={[selectMemGroup]}
                                    onSelect={this._handleTreeSelect.bind(this)}
                                >
                                    {
                                        groupsTree.map((group) => {
                                            return this.loop(group);
                                        })
                                    }
                                </Tree>
                            </div>
                        </div>
                    </div>
                    {
                        teamVisible
                            ? (<Modal
                                title='添加班组'
                                visible={teamVisible}
                                maskClosable={false}
                                onOk={this._handleAddGroup.bind(this)}
                                onCancel={this._handleCancelModal.bind(this)}
                            >
                                <div>
                                    <Row>
                                        <FormItem {...FormItemLayout} label='公司名称'>
                                            {getFieldDecorator('groupcompanyName', {
                                                rules: [
                                                    { required: true, message: '请输入公司名称' }
                                                ],
                                                initialValue: `${parentOrgData && parentOrgData.OrgName}`
                                            })(
                                                <Input
                                                    placeholder='请输入公司名称' readOnly
                                                />
                                            )}
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem {...FormItemLayout} label='班组名称'>
                                            {getFieldDecorator('groupName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入班组名称(10个字以下),支持中文，英文字母和数字及下划线'
                                                    },
                                                    {
                                                        validator: this.checkGroupName
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    placeholder='请输入班组名称(10个字以下),支持中文，英文字母和数字及下划线'
                                                />
                                            )}
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem {...FormItemLayout} label='班组负责人'>
                                            {getFieldDecorator('groupLeader', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入负责人名称(10个字以下),仅支持中文'
                                                    },
                                                    {
                                                        validator: this.checkLeaderName
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    placeholder='请输入负责人名称(10个字以下),仅支持中文'
                                                />
                                            )}
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem {...FormItemLayout} label='负责人电话'>
                                            {getFieldDecorator('groupPhone', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入班组负责人电话'
                                                    },
                                                    {
                                                        validator: this.checkPersonTelephone
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    placeholder='请输入班组负责人电话'
                                                />
                                            )}
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem {...FormItemLayout} label='备注'>
                                            {getFieldDecorator('groupDesc', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入备注(30个字以下)'
                                                    },
                                                    {
                                                        validator: this.checkDesc
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    placeholder='请输入备注(30个字以下)'
                                                />
                                            )}
                                        </FormItem>
                                    </Row>
                                </div>
                            </Modal>) : ''
                    }
                </Spin>
            </div>
        );
    }
}
export default Form.create()(AsideTree);

import React, { Component } from 'react';
import { Tree, Spin, Button, Popconfirm, Modal, Form, Row, Input, Notification } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './AttendanceGroupTable.less';
import {getUser} from '_platform/auth';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
export const CuringDocCode = window.DeathCode.CURING_TEAM;

class AsideTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            teamVisible: false, // 添加群体modal
            teamsTree: [], // 文档列表
            dirData: '', // 目录树
            addDisabled: true, // 是否能够添加群体
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
                        key={data.id}
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
                        key={data.id}
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
        if (user && user.username !== 'admin') {
            this.setState({
                addDisabled: false
            });
        }
    }
    // 为群体信息添加公司名称
    handleGroupDataWithCompany = () => {
        const {
            checkGroupsData = [],
            parentData
        } = this.props;
        let name = (parentData && parentData.OrgName) || '公司名称';
        let groupsTree = [];
        if (checkGroupsData && checkGroupsData.length > 0) {
            groupsTree.push({
                id: 1,
                Name: name,
                children: checkGroupsData
            });
        }
        return groupsTree;
    }
    // 添加群体
    _handleAddGroup = async () => {
        const {
            actions: {
                postCheckGroup,
                getCheckGroup,
                changeAsideTreeLoading
            },
            companyOrgID
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (!companyOrgID) {
                    Notification.error({
                        message: '该用户非公司人员，不能添加群体',
                        duration: 3
                    });
                }
                let user = getUser();
                let groupName = values.groupName;
                let groupDesc = values.groupDesc;
                let section = (user && user.section) || '';
                let postData = {
                    Name: groupName,
                    GroupDesc: groupDesc,
                    Section: section,
                    OrgCode: companyOrgID
                };
                let checkgroup = await postCheckGroup({}, postData);
                if (checkgroup && checkgroup.code && checkgroup.code === 1) {
                    Notification.success({
                        message: '新增群体成功',
                        dutation: 3
                    });
                    this.setState({
                        teamVisible: false
                    });
                    await changeAsideTreeLoading(true);
                    await getCheckGroup({}, {orgCode: companyOrgID});
                    await changeAsideTreeLoading(false);
                } else {
                    Notification.error({
                        message: '新增群体失败',
                        dutation: 3
                    });
                }
            }
        });
    }
    // 删除群体
    _handleDelGroup = async () => {
        const {
            actions: {
                deleteCheckGroup,
                changeSelectMemGroup,
                changeSelectState,
                changeAsideTreeLoading,
                getCheckGroup
            },
            companyOrgID
        } = this.props;
        const {
            selectKey,
            selected
        } = this.state;
        if (selected && selectKey) {
            try {
                let delData = await deleteCheckGroup({id: selectKey});
                if (delData && delData.code && delData.code === 1) {
                    Notification.success({
                        message: '删除群体成功',
                        dutation: 3
                    });
                    changeSelectState(false);
                    changeSelectMemGroup();
                    this.setState({
                        selected: false
                    });
                    await changeAsideTreeLoading(true);
                    await getCheckGroup({}, {orgCode: companyOrgID});
                    await changeAsideTreeLoading(false);
                } else {
                    Notification.error({
                        message: '删除群体失败',
                        dutation: 3
                    });
                }
            } catch (e) {
                console.log('_handleDelGroup', e);
            }
        } else {
            Notification.info({
                message: '未选中节点，不能删除群体',
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
        let selected = info && info.selected;
        let selectKey = (key && key[0]) || '';
        try {
            await changeSelectMemGroup(selectKey);
            await changeSelectState(selected);
            this.setState({
                selected,
                selectKey
            });
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

    render () {
        const {
            teamVisible,
            addDisabled,
            selected
        } = this.state;
        const {
            form: { getFieldDecorator },
            asideTreeLoading = false,
            parentData,
            checkGroupsData = []
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };

        let groupsTree = this.handleGroupDataWithCompany();
        return (
            <div className='checkWork-total-main'>
                <Spin spinning={asideTreeLoading}>
                    <div className='checkWork-test'>
                        <Button
                            className='checkWork-buttonStyle'
                            type='primary'
                            onClick={this._handleModalVisible.bind(this)}
                            disabled={addDisabled}
                        >
                            新增群体
                        </Button>
                        {
                            selected
                                ? <Popconfirm
                                    onConfirm={this._handleDelGroup.bind(this)}
                                    title='确定要删除该群体么'
                                    okText='确定'
                                    cancelText='取消' >
                                    <Button
                                        className='checkWork-buttonStyle'
                                        type='danger'
                                        disabled={!selected}
                                    >
                                删除群体
                                    </Button>
                                </Popconfirm>
                                : <Button
                                    className='checkWork-buttonStyle'
                                    type='danger'
                                    disabled={!selected}
                                >
                                    删除群体
                                </Button>
                        }

                        <div className='checkWork-aside-main'>
                            <div className='checkWork-aside'>
                                {checkGroupsData.length ? (
                                    <Tree
                                        showLine
                                        defaultExpandAll
                                        onSelect={this._handleTreeSelect.bind(this)}
                                    >
                                        {
                                            groupsTree.map((group) => {
                                                return this.loop(group);
                                            })
                                        }
                                    </Tree>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    {
                        teamVisible
                            ? (<Modal
                                title='添加群体'
                                visible={teamVisible}
                                maskClosable={false}
                                onOk={this._handleAddGroup.bind(this)}
                                onCancel={this._handleCancelModal.bind(this)}
                            >
                                <Row>
                                    <FormItem {...FormItemLayout} label='群体名称'>
                                        {getFieldDecorator('groupName', {
                                            rules: [
                                                { required: true, message: '请输入群体名称' }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入群体名称'
                                            />
                                        )}
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem {...FormItemLayout} label='公司名称'>
                                        {getFieldDecorator('groupcompanyName', {
                                            rules: [
                                                { required: true, message: '请输入公司名称' }
                                            ],
                                            initialValue: `${parentData && parentData.OrgName}`
                                        })(
                                            <Input
                                                placeholder='请输入公司名称' readOnly
                                            />
                                        )}
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem {...FormItemLayout} label='群体描述'>
                                        {getFieldDecorator('groupDesc', {
                                            rules: [
                                                { required: true, message: '请输入群体描述' }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入群体描述'
                                            />
                                        )}
                                    </FormItem>
                                </Row>
                            </Modal>) : ''
                    }
                </Spin>
            </div>
        );
    }
}
export default Form.create()(AsideTree);

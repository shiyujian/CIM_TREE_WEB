import React, { Component } from 'react';
import { Tree, Spin, Button, Popconfirm, Modal, Form, Row, Input, Notification } from 'antd';
import { getUser } from '_platform/auth';
import { PROJECT_UNITS } from '_platform/api';
import { getSectionName } from '../auth';
import moment from 'moment';
import 'moment/locale/zh-cn';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
export const CuringDocCode = window.DeathCode.CURING_TEAM;

class AsideTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            teamVisible: false, // 添加班组modal
            teamsTree: [], // 文档列表
            dirData: '', // 目录树
            addDisabled: true, // 是否能够添加班组
            selected: false, // 是否选中节点
            selectKey: '' // 选中节点的key
        };
        this.section = '';
    }

    componentDidMount = async () => {
        this.user = getUser();
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 首先查看是否为管理员，是的话，获取全部信息
        if (this.user.username === 'admin') {
            this._getAdminData();
        } else if (sections && sections instanceof Array && sections.length > 0) {
            // 然后查看有没有关联标段，没有关联的人无法获取列表
            this._getSectionData();
        }
    }
    // 非管理员，获取文档数据
    _getSectionData = async () => {
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 使目录树和标段相关联
        this.section = sections[0];
        await this._getSectionTeams();
        this.setState({
            addDisabled: false
        });
    }
    // 获取文档列表
    async _docList (section) {
        if (this.user.username === 'admin') {
            this._getAdminTeams(section);
        } else {
            this._getSectionTeams();
        }
    }
    // 非管理员获取文档树结构
    _getSectionTeams = async () => {
        const {
            actions: {
                getCuringGroup
            }
        } = this.props;
        let taskTeams = await getCuringGroup({}, {section: this.section});
        console.log('taskTeams', taskTeams);
        let sectionName = await getSectionName(this.section);
        let teamsTree = [
            {
                ID: this.section,
                GroupName: sectionName,
                children: taskTeams
            }
        ];
        this.setState({
            teamsTree
        });
    }
    static loop (data = [], parent) {
        if (data) {
            if (data.children) {
                return (
                    <TreeNode
                        key={data.ID}
                        title={data.GroupName}
                        disabled
                    >
                        {data.children &&
                        data.children.map(m => {
                            return AsideTree.loop(m, data);
                        })}
                    </TreeNode>
                );
            } else if (parent) {
                return (
                    <TreeNode
                        key={`${data.ID}^^${parent.ID}`}
                        title={data.GroupName}
                    >
                        {data.children &&
                        data.children.map(m => {
                            return AsideTree.loop(m);
                        })}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode
                        key={data.ID}
                        title={data.GroupName}
                    >
                        {data.children &&
                        data.children.map(m => {
                            return AsideTree.loop(m);
                        })}
                    </TreeNode>
                );
            }
        }
    }

    render () {
        const {
            teamsTree = [],
            teamVisible,
            addDisabled,
            selected
        } = this.state;
        const {
            form: { getFieldDecorator }
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <div>
                <Button
                    style={{marginRight: 10, marginBottom: 10}}
                    type='primary'
                    onClick={this._handleModalVisible.bind(this)}
                    disabled={addDisabled}
                >
                    新增班组
                </Button>
                <Popconfirm
                    onConfirm={this._handleDelDoc.bind(this)}
                    title='确定要删除该班组么'
                    okText='确定'
                    cancelText='取消' >
                    <Button
                        style={{marginBottom: 10}}
                        type='danger'
                        disabled={!selected}
                    >
                    删除班组
                    </Button>
                </Popconfirm>
                <div>
                    {teamsTree.length ? (
                        <Tree
                            showLine
                            defaultExpandAll
                            onSelect={this._handleTreeSelect.bind(this)}
                        >
                            {teamsTree.map(p => {
                                return AsideTree.loop(p);
                            })}
                        </Tree>
                    ) : (
                        ''
                    )}
                </div>
                {
                    teamVisible
                        ? (<Modal
                            title='添加班组'
                            visible={teamVisible}
                            maskClosable={false}
                            onOk={this._handleAddTeam.bind(this)}
                            onCancel={this._handleCancelModal.bind(this)}
                        >
                            <Row>
                                <FormItem {...FormItemLayout} label='班组名称'>
                                    {getFieldDecorator('teamName', {
                                        rules: [
                                            { required: true, message: '请输入班组名称' }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入班组名称'
                                        />
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem {...FormItemLayout} label='班组描述'>
                                    {getFieldDecorator('teamDesc', {
                                        rules: [
                                            { required: true, message: '请输入班组描述' }
                                        ]
                                    })(
                                        <Input
                                            placeholder='请输入班组描述'
                                        />
                                    )}
                                </FormItem>
                            </Row>
                        </Modal>) : ''
                }
            </div>
        );
    }
    // 初始化时获取admin文档树数据
    _getAdminData = async () => {
        const {
            actions: {
                getCuringGroup,
                changeSelectSection
            }
        } = this.props;
        let teamsTree = [];
        let loopTime = 0;
        PROJECT_UNITS.map(async project => {
            if (project.units) {
                let units = project.units;
                let projectName = project.value;
                units.map(async unit => {
                    let sectionName = projectName + unit.value;
                    let taskTeams = await getCuringGroup({}, {section: unit.code});
                    if (taskTeams && taskTeams.length > 0) {
                        loopTime = loopTime + 1;
                        if (loopTime === 1) {
                            changeSelectSection(unit.code);
                        }
                        teamsTree.push({
                            ID: unit.code,
                            GroupName: sectionName,
                            children: taskTeams
                        });
                        this.setState({
                            teamsTree
                        });
                    }
                });
            }
        });
    }
    // 删除或增加文档后管理员更新树结构
    _getAdminTeams = async (section) => {
        const {
            actions: {
                getCuringGroup
            }
        } = this.props;
        const {
            teamsTree
        } = this.state;
        teamsTree.map(async (data, index) => {
            if (data && data.ID && data.ID === section) {
                let sectionName = data.name;
                let taskTeams = await getCuringGroup({}, {section: section});
                if (taskTeams && taskTeams.length > 0) {
                    data = {
                        key: section,
                        name: sectionName,
                        children: taskTeams
                    };
                    teamsTree[index] = data;
                } else {
                    teamsTree.splice(index, 1);
                }
                this.setState({
                    teamsTree
                });
            }
        });
    }
    // 添加文档
    _handleAddTeam = async () => {
        const {
            actions: {
                postCuringGroup
            }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let teamName = values.teamName;
                let teamDesc = values.teamDesc;
                let postData = {
                    GroupName: teamName,
                    Section: this.section,
                    Remark: teamDesc
                };
                let curinggroup = await postCuringGroup({}, postData);
                console.log('curinggroup', curinggroup);
                if (curinggroup && curinggroup.code && curinggroup.code === 1) {
                    Notification.success({
                        message: '新增班组成功',
                        dutation: 3
                    });
                    this.setState({
                        teamVisible: false
                    });
                    this._docList(this.section);
                } else {
                    Notification.error({
                        message: '新增班组失败',
                        dutation: 3
                    });
                }
            }
        });
    }
    // 删除文档
    _handleDelDoc = async () => {
        const {
            actions: {
                deleteCuringGroup,
                changeSelectMemTeam,
                changeSelectState,
                getCuringGroupMansOk
            }
        } = this.props;
        const {
            selectKey,
            selected
        } = this.state;
        if (selected && selectKey) {
            try {
                let keyArr = selectKey.split('^^');
                if (keyArr && keyArr.length === 2) {
                    let delData = await deleteCuringGroup({ID: keyArr[0]});
                    console.log('delData', delData);
                    if (delData && delData.code && delData.code === 1) {
                        Notification.success({
                            message: '删除班组成功',
                            dutation: 3
                        });
                        changeSelectState(false);
                        changeSelectMemTeam();
                        getCuringGroupMansOk([]);
                        this._docList(keyArr[1]);
                        this.setState({
                            selected: false
                        });
                    } else {
                        Notification.error({
                            message: '删除班组失败',
                            dutation: 3
                        });
                    }
                }
            } catch (e) {

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
                changeSelectSection,
                changeSelectMemTeam,
                changeSelectState,
                getCuringGroupMans
            }
        } = this.props;
        const {
            teamsTree
        } = this.state;
        let selected = info && info.selected;
        let selectKey = key && key[0];
        console.log('selectKey', selectKey);
        console.log('info', info);
        console.log('teamsTree', teamsTree);
        try {
            let keyArr = selectKey.split('^^');
            if (keyArr && keyArr.length === 2) {
                // 将section上传，根据section获取人员列表
                console.log('keyArr', keyArr);
                let section = keyArr[1];
                console.log('section', section);
                await changeSelectSection(section);
                // 将班组信息上传至redux
                teamsTree.map((list) => {
                    if (list.ID === keyArr[1]) {
                        let taskTeams = list.children;
                        taskTeams.map(async (team) => {
                            console.log('team.ID', team.ID);
                            console.log('keyArr[0]', keyArr[0]);
                            if (team.ID === Number(keyArr[0])) {
                                await changeSelectMemTeam(team);
                            }
                        });
                    }
                });
                let postData = {
                    groupid: keyArr[0]
                };
                let data = await getCuringGroupMans(postData);
                console.log('data', data);
            }
        } catch (e) {
            console.log('点击节点', e);
        }
        await changeSelectState(selected);
        this.setState({
            selected,
            selectKey
        });
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
}
export default Form.create()(AsideTree);
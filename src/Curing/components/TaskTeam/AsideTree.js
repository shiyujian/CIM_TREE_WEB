import React, { Component } from 'react';
import { Tree, Spin, Button, Popconfirm, Modal, Form, Row, Input, Notification } from 'antd';
import { getUser } from '_platform/auth';
import { PROJECT_UNITS } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
export const CuringDocCode = window.DeathCode.CURING_TEAM;

class AsideTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            totalDirData: '', // 养护模块总体目录
            loading: false,
            teamVisible: false, // 添加班组modal
            docLists: [], // 文档列表
            dirData: '', // 目录树
            addDisabled: true, // 是否能够添加班组
            selected: false, // 是否选中节点
            selectKey: '' // 选中节点的key
        };
    }

    componentDidMount = async () => {
        await this.getTotalDir();
        this.user = getUser();
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 首先查看是否为管理员，是的话，获取全部信息
        if (this.user.username === 'admin') {
            this.getAdminData();
        } else if (sections && sections instanceof Array && sections.length > 0) {
            // 然后查看有没有关联标段，没有关联的人无法获取列表
            this.getSectionData();
        }
    }
    getTotalDir = async () => {
        const {
            actions: {
                getDocDir,
                postDocDir
            }
        } = this.props;
        // 首先查看养护模块的整理目录
        let totalDirData = await getDocDir({code: CuringDocCode});
        if (!(totalDirData && totalDirData.pk)) {
            let postDirData = {
                'name': CuringDocCode,
                'code': CuringDocCode,
                'obj_type': 'C_DIR',
                'status': 'A',
                'extra_params': {}
            };
            totalDirData = await postDocDir({}, postDirData);
        }
        this.setState({
            totalDirData
        });
    }
    // 非管理员，获取文档数据
    getSectionData = async () => {
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 使目录树和标段相关联
        let section = sections[0];
        let docCode = CuringDocCode + '_' + section;
        // 获取文档目录
        let dirData = await this.getDirData(docCode);
        // 如果存在该目录，获取文档数据
        if (dirData && dirData.code) {
            this.docList(dirData.code);
        }
        this.setState({
            dirData,
            addDisabled: false
        });
    }

    getDirData = async (docCode) => {
        const {
            actions: {
                getDocDir,
                postDocDir
            }
        } = this.props;
        const {
            totalDirData
        } = this.state;
        if (!(totalDirData && totalDirData.pk)) {
            return;
        }
        // 获取目录数据
        let dirTreeData = await getDocDir({code: docCode});
        let dirData = '';
        // 如果存在，将该目录数据存储
        if (dirTreeData && dirTreeData.pk) {
            dirData = dirTreeData;
        } else if (this.user.username !== 'admin') {
            // 如果不存在，且不是admin，则创建目录
            let postDirData = {
                'name': docCode,
                'code': docCode,
                'obj_type': 'C_DIR',
                'status': 'A',
                'extra_params': {},
                'parent': {'pk': totalDirData.pk, 'code': totalDirData.code, 'obj_type': 'C_DIR'}
            };

            dirData = await postDocDir({}, postDirData);
        }
        return dirData;
    }
    // 初始化时获取admin目录数据
    getAdminData = async () => {
        const {
            actions: {
                getDocList
            }
        } = this.props;
        let docLists = [];
        PROJECT_UNITS.map(async project => {
            if (project.units) {
                let units = project.units;
                let projectName = project.value;
                units.map(async unit => {
                    let sectionName = projectName + unit.value;
                    let docCode = CuringDocCode + '_' + unit.code;
                    let list = await getDocList({code: docCode});
                    if (list && list.result && list.result.length > 0) {
                        docLists.push({
                            key: docCode,
                            name: sectionName,
                            children: list && list.result
                        });
                        this.setState({
                            docLists
                        });
                    }
                });
            }
        });
    }
    // 获取文档列表
    async docList (dirCode) {
        if (this.user.username === 'admin') {
            this.getAdminDoc(dirCode);
        } else {
            this.getDocList(dirCode);
        }
    }
    // 管理员获取树结构
    getAdminDoc = async (dirCode) => {
        const {
            actions: {
                getDocList
            }
        } = this.props;
        const {
            docLists
        } = this.state;
        docLists.map(async (data, index) => {
            if (data && data.key && data.key === dirCode) {
                let sectionName = data.name;
                let list = await getDocList({code: dirCode});
                data = {
                    key: dirCode,
                    name: sectionName,
                    children: list && list.result
                };
                docLists[index] = data;
                this.setState({
                    docLists
                });
            }
        });
    }
    // 非管理员获取树结构
    getDocList = async (dirCode) => {
        const {
            actions: {
                getDocList
            }
        } = this.props;
        let list = await getDocList({code: dirCode});
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        // 使目录树和标段相关联
        let section = sections[0];
        let sectionName = await this.getSectionName(section);
        let docLists = [
            {
                key: dirCode,
                name: sectionName,
                children: list && list.result
            }
        ];
        // let docLists = list && list.result;
        this.setState({
            docLists
        });
    }
    // 获取标段名称
    getSectionName = async (section) => {
        let sectionName = '';
        try {
            let arr = section.split('-');
            if (arr && arr.length === 3) {
                PROJECT_UNITS.map(project => {
                    if (project.code === arr[0]) {
                        let units = project.units;
                        sectionName = project.value;
                        units.map(unit => {
                            if (unit.code === section) {
                                sectionName =
                                sectionName + unit.value;
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.log('e', e);
        }
        return sectionName;
    }

    static loop (data = [], parent) {
        if (data) {
            if (data.children) {
                return (
                    <TreeNode
                        key={data.key}
                        title={data.name}
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
                        key={`${data.code}^^${parent.key}`}
                        title={data.name}
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
                        key={data.code}
                        title={data.name}
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
            docLists = [],
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
            <Spin tip='加载中' spinning={this.state.loading}>
                <Button
                    style={{marginRight: 10, marginBottom: 10}}
                    type='primary'
                    onClick={this.handleModalVisible.bind(this)}
                    disabled={addDisabled}
                >
                    新增班组
                </Button>
                <Popconfirm
                    onConfirm={this.handleDelDoc.bind(this)}
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
                    {docLists.length ? (
                        <Tree
                            showLine
                            defaultExpandAll
                            onSelect={this.handleTreeSelect.bind(this)}
                        >
                            {docLists.map(p => {
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
                            onOk={this.handleAddDoc.bind(this)}
                            onCancel={this.handleCancelModal.bind(this)}
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
            </Spin>
        );
    }
    // 添加文档
    handleAddDoc = async () => {
        const {
            actions: {
                postDocument
            }
        } = this.props;
        const {
            dirData
        } = this.state;
        if (!(dirData && dirData.pk)) {
            return;
        }
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let teamName = values.teamName;
                let teamDesc = values.teamDesc;
                // 创建文档数据
                let postDocumentData = {
                    'code': 'curing_' + moment().format('YYYY-MM-DDHH-mm-ss').toString(),
                    'name': teamName,
                    'obj_type': 'C_DOC',
                    'profess_folder': {'code': dirData.code, 'obj_type': 'C_DIR'},
                    'extra_params': {
                        // 'scheduleMaster_Report': scheduleMaster
                    },
                    'basic_params': {
                        'files': [
                            {
                                'a_file': teamName,
                                'name': teamName,
                                'download_url': teamName,
                                'misc': teamDesc,
                                'mime_type': 'application/pdf'
                            }
                        ]
                    },
                    'status': 'A',
                    'version': 'A'
                };
                let creDoc = await postDocument({}, postDocumentData);
                if (creDoc && creDoc.pk) {
                    Notification.success({
                        message: '新增班组成功',
                        dutation: 3
                    });
                    this.setState({
                        teamVisible: false
                    });
                    this.docList(dirData.code);
                } else {
                    Notification.error({
                        message: '新增班组失败',
                        dutation: 3
                    });
                }
            }
        });
    }

    handleCancelModal = () => {
        this.setState({
            teamVisible: false
        });
    }

    handleModalVisible = () => {
        this.setState({
            teamVisible: true
        });
    }
    handleDelDoc = async () => {
        const {
            actions: {
                delDocument
            }
        } = this.props;
        const {
            selectKey,
            selected,
            dirData
        } = this.state;
        if (selected && selectKey) {
            try {
                let keyArr = selectKey.split('^^');
                if (keyArr && keyArr.length === 2) {
                    let delData = await delDocument({code: keyArr[0]});
                    if (!delData) {
                        Notification.success({
                            message: '删除班组成功',
                            dutation: 3
                        });
                        this.docList(keyArr[1]);
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

    handleTreeSelect = (key, info) => {
        let selected = info && info.selected;
        let selectKey = key && key[0];
        this.setState({
            selected,
            selectKey
        });
    }
}
export default Form.create()(AsideTree);

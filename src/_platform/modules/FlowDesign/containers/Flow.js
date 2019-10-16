import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Row,
    Col,
    message,
    notification,
    Popconfirm
} from 'antd';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-fa';

import * as flowActions from '../store/workflow';

import { base } from '../../../api';
import { getUser } from '../../../auth';

import NewTemplateModal from '../components/NewTemplateModal';
import TemplateTree from '../components/TemplateTree';
import CloseEditConfirm from '../components/CloseEditConfirm';

@connect(
    state => ({}),
    dispatch => {
        return {
            flowActions: bindActionCreators(flowActions, dispatch)
        };
    }
)
class Flow extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: {}, // 流程列表对象
            flowId: '', // 流程ID
            flowName: '', // 流程名称
            isNewTemplateModalVisible: false,
            btn_loading: false,
            tabs: [],
            activeKey: '',
            isCloseEditConfirmVisible: false, // 关闭 Tab时弹出
            closeEditContent: '', // Tab Modal content
            deleteTabKey: '', // delete Tabkey
            deletable: true // 该flow是否可以 删除
        };
    }

    componentDidMount () {
        this.getList();
    }

    getWorkflowAPI () {
        console.log('接口IP', base);
        return base;
    }

    getList () {
        console.log(base);
        const { getflowList } = this.props.flowActions;
        getflowList({
            Workflow_API: base
        }).then(rep => {
            if (rep.code === 1) {
                let editableTemplates = [];
                let uneditableTemplates = [];
                rep.content.map(item => {
                    if (item.Status === 1) {
                        uneditableTemplates.push(item);
                    } else {
                        editableTemplates.push(item);
                    }
                });
                this.setState({
                    dataList: {
                        editableTemplates,
                        uneditableTemplates
                    }
                });
            } else {
                message.info('获取流程列表失败');
            }
        });

        // const { getTemplate } = this.props.flowActions;

        // const Workflow_API = this.getWorkflowAPI();

        // // 获取 可编辑的与不可编辑的 template
        // const requestArray = [];

        // requestArray.push(
        //     getTemplate({
        //         Workflow_API: Workflow_API,
        //         status: 0
        //     })
        // );

        // requestArray.push(
        //     getTemplate({
        //         Workflow_API: Workflow_API,
        //         status: 1
        //     })
        // );

        // return Promise.all(requestArray).then(resp => {
        //     this.setState({
        //         list: {
        //             editableTemplates: resp[0],
        //             uneditableTemplates: resp[1]
        //         }
        //     });
        // });
    }

    // 模板选择
    onSelect = ([id]) => {
        console.log('选择流程模板', id);
        if (id) {
            const {
                dataList: { editableTemplates = [], uneditableTemplates = [] }
            } = this.state;

            let currTemplate = editableTemplates.find(item => item.id === id);
            if (!currTemplate) {
                currTemplate = uneditableTemplates.find(item => item.ID === id);
                console.log('选择流程模板', currTemplate);
                this.setState({
                    deletable: true,
                    flowId: id,
                    flowName: currTemplate.Name,
                    selectedKeys: [String(id)]
                });
            } else {
                this.setState({
                    deletable: true,
                    flowId: id,
                    selectedKeys: [String(id)]
                });
            }

            // 是否已经存在
            // const alreadyExist = tabs.findIndex(item => item.id == id);

            // if(alreadyExist !== -1) {
            // 	this.setState({
            // 		flowId:id,
            // 		selectedKeys:
            // 		tabs,
            // 		activeKey: String(alreadyExist)
            // 	});
            // } else {
            // 	tabs.push({
            // 		title: currTemplate.name,
            // 		id: currTemplate.id
            // 	});
            // 	this.setState({
            // 		flowId:id,
            // 		tabs,
            // 		activeKey:String(tabs.length -1)
            // 	});
            // }
        }
    };

    // open createTemplate Modal
    openCreateNewTemplateModal = () => {
        this.setState({
            isNewTemplateModalVisible: true
        });
    };

    // 删除流程模板
    handleDel = () => {
        const { deleteflow } = this.props.flowActions;

        deleteflow({
            ID: this.state.flowId
        }, {}).then(rep => {
            if (rep.code === 1) {
                this.getList();
                this.setState({
                    flowId: ''
                });
                notification.success({
                    message: '删除模板成功'
                });
            } else {
                notification.error({
                    message: rep.msg || '删除模板失败'
                });
            }
        });
    };

    // create new Template flow
    handleCreateTemplateOk = values => {
        console.log('流程模板', values);
        const { postflow } = this.props.flowActions;
        postflow({
            Workflow_API: base
        }, {
            Creater: getUser().ID,
            FlowDescribe: values.FlowDescribe || '',
            Name: values.name || ''
        }).then(rep => {
            console.log(rep);
            if (rep.code === 1) {
                notification.success({
                    message: '新增模板成功'
                });
                this.getList();
                this.handleCancel();
            } else {
                notification.error({
                    message: rep.msg
                });
            }
        });
        // postTemplate(
        //     {
        //         Workflow_API: Workflow_API
        //     },
        //     { status: 0, remark: null, position: null, ...values }
        // ).then(rep => {
        //     this.setState({ isNewTemplateModalVisible: false });

        //     message.success('新增模板成功');

        //     this.getList().then(list => {
        //         this.onSelect([rep.id]);
        //     });
        // });
    };

    // cancel create Template
    handleCancel = () => {
        this.setState({
            isNewTemplateModalVisible: false
        });
    };

    // DynamicTabs
    handleTabsChange = targetKey => {
        const { list } = this.state;
        const selectId = list[targetKey].id;
        this.setState({
            activeKey: String(targetKey),
            flowId: selectId
        });
    };

    // removeTab
    openCloseRemoveTabModal = targetKey => {
        const { tabs } = this.state;

        if (targetKey) {
            const tab = tabs[targetKey];

            this.setState({
                isCloseEditConfirmVisible: true,
                closeEditContent: `${tab.title} 已经更改，是否保存改?`,
                deleteTabKey: targetKey
            });
        }
    };

    // removeTab with Save
    handleCloseTab = () => {
        const { deleteTabKey } = this.state;

        // save

        this.removeTabsByKey(deleteTabKey);

        this.setState({
            isCloseEditConfirmVisible: false
        });
    };

    // force to remove Tab without save
    handleForceCloseTab = () => {
        const { deleteTabKey } = this.state;

        //
        this.removeTabsByKey(deleteTabKey);

        this.setState({
            isCloseEditConfirmVisible: false
        });
    };

    // cancel close Tab
    handleCancelTab = () => {
        this.setState({
            isCloseEditConfirmVisible: false
        });
    };

    removeTabsByKey = key => {
        const { tabs, activeKey } = this.state;
        const currKey = parseInt(key);

        tabs.splice(key, 1);

        let newActiveKey = parseInt(activeKey);
        if (key === activeKey && key == tabs.length) {
            newActiveKey = activeKey - 1;
        } else if (key < activeKey) {
            newActiveKey = activeKey - 1;
        }

        this.setState({
            activeKey: String(newActiveKey),
            tabs,
            deleteTabKey: ''
        });
    };

    //
    handleEdit = () => {
        const { deletable, flowId } = this.state;

        const {
            flowActions: { putTemplate }
        } = this.props;

        const Workflow_API = this.getWorkflowAPI();

        // 是否能 编辑的
        if (deletable) {
            // 可激活
            putTemplate(
                {
                    Workflow_API: Workflow_API,
                    id: flowId
                },
                {
                    status: 1
                }
            ).then(resp => {
                if (resp.status === 0) {
                    message.info('已经激活');
                } else {
                    message.info('激活失败');
                }
                this.getList().then(result => {
                    this.onSelect([flowId]);
                });
            });
        } else {
            // 取消激活
            // putTemplate({
            // 	Workflow_API: Workflow_API,
            // 	id: flowId
            // }, {
            // 	status: 0
            // }).then(resp => {
            // 	message.info("已经取消激活");
            // 	this.getList().then(result => {
            // 		this.onSelect([flowId]);
            // 	});
            // });
        }
    };

    render () {
        const {
            isNewTemplateModalVisible,
            flowId,
            flowName,
            dataList = {},
            tabs,
            activeKey,
            isCloseEditConfirmVisible,
            closeEditContent,
            deletable, // 是否可删除,
            selectedKeys = []
        } = this.state;

        return (
            <div>
                <Row>
                    <Col span={4}>
                        <div style={{ textAlign: 'center', padding: 5 }}>
                            <Button
                                size='small'
                                onClick={this.openCreateNewTemplateModal}
                                title='添加模板'
                                className='btn'
                            >
                                <Icon name='plus' />
                            </Button>
                            {deletable && (
                                <Popconfirm
                                    title='确定删除该模板？'
                                    onConfirm={this.handleDel}
                                    okText='确定'
                                    cancelText='取消'
                                >
                                    <Button
                                        type='danger'
                                        size='small'
                                        disabled={!flowId}
                                        title='删除模板'
                                        className='btn'
                                    >
                                        <Icon name='minus' />
                                    </Button>
                                </Popconfirm>
                            )}
                            {deletable && (
                                <Popconfirm
                                    title={`确定激活该模板?`}
                                    onConfirm={this.handleEdit}
                                    okText='是'
                                    cancelText='否'
                                >
                                    <Button
                                        size='small'
                                        disabled={!flowId}
                                        title='激活模板'
                                        className='btn'
                                    >
                                        <Icon name='flash' />
                                    </Button>
                                </Popconfirm>
                            )}
                        </div>
                        <div style={{ height: 950, overflow: 'scroll' }}>
                            <TemplateTree
                                dataList={dataList}
                                selectedKeys={selectedKeys}
                                onSelect={this.onSelect}
                            />
                        </div>
                    </Col>
                    <Col span={20}>
                        <iframe
                            allowFullScreen
                            style={{
                                height: 1000,
                                width: '100%',
                                flex: 1,
                                overflow: 'hidden'
                            }}
                            src={`/gooflow/index.html?id=${flowId}&name=${flowName}&userID=${getUser().ID}&serverURL=${encodeURIComponent(
                                base
                            )}`}
                            frameBorder='0'
                        />
                    </Col>
                </Row>

                <NewTemplateModal
                    title='新增流程模板'
                    visible={isNewTemplateModalVisible}
                    onOk={this.handleCreateTemplateOk}
                    onCancel={this.handleCancel}
                />

                <CloseEditConfirm
                    title='是否保存更改'
                    visible={isCloseEditConfirmVisible}
                    content={closeEditContent}
                    okText='是'
                    exitText='否'
                    cancelText='取消'
                    onOk={this.handleCloseTab}
                    onExit={this.handleForceCloseTab}
                    onCancel={this.handleCancelTab}
                />
            </div>
        );
    }
}

export default Flow;

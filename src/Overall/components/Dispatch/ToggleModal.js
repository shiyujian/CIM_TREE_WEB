import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Upload,
    Icon,
    Row,
    Col,
    Button,
    message,
    TreeSelect,
    Checkbox,
    Progress
} from 'antd';
import { getUser } from '_platform/auth';
import { UPLOAD_API, SOURCE_API, DISPATCH_MSG_API } from '_platform/api';
import E from 'wangeditor';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './ToggleModal.css';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
let editor;

class ToggleModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            coordinates: [],
            fileList: [],
            imagesList: [],
            content: '', // 富文本的内容
            selectSentUser: '', // 接收单位当前选中的人员
            sentUsers: [], // 接收单位人员列表
            copyUsers: [], // 抄送单位人员列表
            selectCopyUser: '', // 抄送单位当前选中的人员
            isSentMsg: false, // 接收人员是否发短信
            isCopyMsg: false, // 接收人员是否发短信
            progress: 0,
            org_codes: ''
        };
    }

    uploadProps = {
        name: 'a_file',
        multiple: false,
        showUploadList: false,
        action: UPLOAD_API,
        onChange: ({ file, fileList, event }) => {
            const status = file.status;
            if (status === 'done') {
                const {
                    actions: { postUploadFilesAc }
                } = this.props;
                let newFile = {
                    preview_url:
                        '/media' + file.response.a_file.split('/media')[1],
                    download_url:
                        '/media' +
                        file.response.download_url.split('/media')[1],
                    a_file: '/media' + file.response.a_file.split('/media')[1]
                };
                postUploadFilesAc([{ ...file.response, ...newFile }]);
            }
            if (event) {
                let { percent } = event;
                if (percent !== undefined) { this.setState({ progress: parseFloat(percent.toFixed(1)) }); }
            }
        }
    };

    componentDidMount () {
        const elem = this.refs.editorElem;
        editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                content: html
            });
        };
        editor.customConfig.zIndex = 900;
        editor.customConfig.uploadImgTimeout = 15000;
        editor.customConfig.uploadImgServer = UPLOAD_API;
        editor.customConfig.uploadFileName = 'a_file';
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
        editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {},
            success: function (xhr, editor, result) {},
            fail: function (xhr, editor, result) {},
            error: function (xhr, editor) {},
            timeout: function (xhr, editor) {},
            customInsert: function (insertImg, result, editor) {
                let url =
                    SOURCE_API + '/media/' + result.a_file.split('/media/')[1];
                insertImg(url);
            }
        };
        editor.create();
    }

    closeModal () {
        const {
            actions: { toggleModalAc, postUploadFilesAc }
        } = this.props;

        postUploadFilesAc([]);
        toggleModalAc({
            type: null,
            status: null,
            visible: false
        });
    }

    _getOrgText (arr) {
        let tmpArr = [];
        arr.map(itm => {
            if (
                tmpArr.filter(item => item == itm.split('--')[1]).length === 0
            ) {
                tmpArr.push(itm.split('--')[0]);
            }
        });
        return tmpArr;
    }

    render () {
        const {
            form: { getFieldDecorator },
            toggleData: toggleData = {
                type: 'NEWS',
                status: 'ADD',
                visible: false
            },
            fileList = [],
            orgList = []
        } = this.props;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };
        let { progress } = this.state;
        console.log('orgList', orgList);
        return (
            <Modal
                title={
                    toggleData.type === 'NEWS'
                        ? toggleData.status === 'ADD'
                            ? '发文'
                            : '回文'
                        : '发文'
                }
                wrapClassName='edit-box'
                visible={toggleData.visible}
                width='80%'
                maskClosable={false}
                onOk={this._sendDoc.bind(this)}
                onCancel={this.closeModal.bind(this)}
            >
                <div>
                    <Form>
                        <Row>
                            <Col>
                                <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label='文件标题'
                                    >
                                        {getFieldDecorator('title3', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入文件标题'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Input
                                                type='text'
                                                placeholder='文件标题'
                                            />
                                        )}
                                    </FormItem>
                                </Row>
                                <Row>
                                    <Col span={21} offset={2}>
                                        <div ref='editorElem' />
                                    </Col>
                                </Row>
                                <Row
                                    style={{
                                        marginTop: '20px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <Col span={4}>
                                        <div
                                            style={{
                                                textAlign: 'right',
                                                paddingRight: '8px'
                                            }}
                                        >
                                            <i style={{ color: 'red' }}>*</i>
                                            &nbsp;附件上传:
                                        </div>
                                    </Col>
                                    <Col span={18}>
                                        <Row>
                                            <Col span={6}>
                                                <Upload {...this.uploadProps}>
                                                    <Button>
                                                        <Icon type='upload' />
                                                        上传文档
                                                    </Button>
                                                </Upload>
                                                <Progress
                                                    percent={progress}
                                                    strokeWidth={2}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                {fileList.map((file, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {file.name}
                                                        </div>
                                                    );
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4} offset={2}>
                                                接收单位：
                                            </Col>
                                            <Col span={10}>
                                                <TreeSelect
                                                    onChange={this._orgChange.bind(
                                                        this
                                                    )}
                                                    // disabledCheckbox={true}
                                                    dropdownMatchSelectWidth={
                                                        false
                                                    }
                                                    treeCheckable
                                                >
                                                    {ToggleModal.loop(
                                                        orgList,
                                                        this.state.sentUsers
                                                    )}
                                                </TreeSelect>
                                            </Col>
                                            {/* <Col span={4}>
												<Button onClick={this._addSentUser.bind(this)}>添加</Button>
											</Col> */}
                                            <Col
                                                style={{ marginLeft: '10px' }}
                                                span={4}
                                            >
                                                <Checkbox
                                                    style={{ marginTop: '2px' }}
                                                    onChange={this._cpoyMsg.bind(
                                                        this
                                                    )}
                                                >
                                                    短信通知
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                        {/* <Row>
											<Col span={20} offset={2}>
												<Table dataSource={this._getUserFunc(this.state.sentUsers)}
													columns={this.columns}
													size="small"
													bordered
													rowKey="code" />
											</Col>
										</Row> */}
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={4} offset={2}>
                                                抄送单位：
                                            </Col>
                                            <Col span={10}>
                                                <TreeSelect
                                                    onChange={this._orgChangeT.bind(
                                                        this
                                                    )}
                                                    dropdownMatchSelectWidth={
                                                        false
                                                    }
                                                    treeCheckable
                                                >
                                                    {ToggleModal.loopT(
                                                        orgList,
                                                        this.state.copyUsers
                                                    )}
                                                </TreeSelect>
                                            </Col>
                                            {/* <Col span={4}>
												<Button onClick={this._addSentUserT.bind(this)}>添加</Button>
											</Col> */}
                                            <Col
                                                style={{ marginLeft: '10px' }}
                                                span={4}
                                            >
                                                <Checkbox
                                                    style={{ marginTop: '2px' }}
                                                    onChange={this._cpoyMsgT.bind(
                                                        this
                                                    )}
                                                >
                                                    短信通知
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                        {/* <Row>
											<Col span={20} offset={4}>
												<Table dataSource={this._getUserFunc(this.state.copyUsers)}
													columns={this.columnsT}
													bordered
													size="small"
													rowKey="code" />
											</Col>
										</Row> */}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }

    getBottomUnit = data => {
        // 如果选择上级单位工程，返回其最低下所有单位工程
        // let n = ["ORG_01--业主单位","ORG_P00--9号地块"];	//测试数据

        const { orgList } = this.props;
        let ret = data.reduce((pre, cur) => {
            let code = cur.split('--')[0],
                rightUnit = this.getRightUnit(orgList, code),
                result = rightUnit ? this.getAllUnit(rightUnit) : [code];

            return pre.concat(result);
        }, []);

        return [...new Set(ret)];
    };
    getRightUnit = (orgList, code) => {
        // 获得当前code对应的Unit的所有信息
        for (let i = 0; i < orgList.length; i++) {
            if (orgList[i].code == code) {
                return orgList[i];
            }

            if (orgList[i].children.length != 0) {
                let x = this.getRightUnit(orgList[i].children, code);
                if (x) return x;
            }
        }
    };
    getAllUnit = (data, parameter = 'name') => {
        // 获得本单位工程最底层所有单位工程的code
        let child = data.children;

        return child.length == 0
            ? [data[parameter]]
            : child.reduce((pre, cur) => {
                return pre.concat(this.getAllUnit(cur));
            }, []);
    };

    _orgChange (value) {
        // 接受单位选择
        this.setState({
            selectSentUser: value,
            sentUsers: value
        });
    }

    _orgChangeT (value) {
        // 抄送单位选择

        this.setState({
            selectCopyUser: value,
            copyUsers: value
        });
    }

    // 发送文件
    _sendDoc () {
        const {
            actions: {
                postSentDocAc,
                getSentInfoAc,
                getUsers,
                sentMessageAc
            },

            toggleData: toggleData = {
                type: 'NEWS',
                status: 'ADD',
                visible: false,
                editData: null
            },
            form: { validateFields },
            fileList = []
        } = this.props;

        const {
            sentUsers = [],
            copyUsers = [],
            isSentMsg = false,
            isCopyMsg = false
        } = this.state;
        if (sentUsers.length === 0) {
            message.warning('请添加接收单位！');
            return;
        }
        if (fileList.length === 0) {
            message.warning('请上传文件！');
            return;
        }
        const user = getUser();
        let orgCode = user.org;
        let orgListCodes = orgCode.split('_');
        orgListCodes.pop();
        let codeu = orgListCodes.join();
        let ucode = codeu.replace(/,/g, '_');

        validateFields((err, values) => {
            if (!err) {
                if (toggleData.status === 'ADD') {
                    let sendData = {
                        from_whom: user.username === 'admin' ? 'admin' : ucode,
                        from_whom_department: user.username === 'admin' ? 'admin' : ucode,
                        to_whom: this._getOrgText(sentUsers),
                        cc: this._getOrgText(copyUsers),
                        title: values['title3'],
                        body_rich: this.state.content,
                        is_draft: false,
                        sent_email: false,
                        extend_info: {},
                        external_attachments: [
                            {
                                file_id: fileList[0].id,
                                file_name: fileList[0].name,
                                file_partial_url: fileList[0].a_file,
                                file_info: fileList[0],
                                send_time: moment().format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )
                            }
                        ]
                    };
                    postSentDocAc({}, sendData).then(rst => {
                        if (rst._id) {
                            message.success('发送文件成功！');
                            let orgCode = getUser().org;

                            let orgListCodes = orgCode.split('_');
                            orgListCodes.pop();
                            let codeu = orgListCodes.join();
                            let ucode = codeu.replace(/,/g, '_');
                            if (user.username === 'admin') {
                                getSentInfoAc({
                                    user: encodeURIComponent('admin')
                                });
                            } else {
                                getSentInfoAc({
                                    user: encodeURIComponent(ucode)
                                });
                            }

                            // 所有需要发短信的人员手机号码
                            let promises_one = [];
                            let promises_two = [];
                            let promises_all = [];
                            if (isSentMsg) {
                                promises_one = sentUsers.map(org => {
                                    return getUsers({}, {
                                        org_code: org.split('--')[0]
                                    });
                                });
                            }
                            if (isCopyMsg) {
                                promises_two = copyUsers.map(org => {
                                    return getUsers({}, {
                                        org_code: org.split('--')[0]
                                    });
                                });
                            }
                            if (isSentMsg || isCopyMsg) {
                                promises_all = promises_one.concat(
                                    promises_two
                                );
                                Promise.all(promises_all)
                                    .then(rst => {
                                        let orgs_all = [];
                                        let msg_all = [];
                                        rst.map(org => {
                                            orgs_all = orgs_all.concat(org);
                                        });
                                        msg_all = orgs_all.map(person => {
                                            let obj = {
                                                sms_free_sign_name:
                                                DISPATCH_MSG_API
                                                    .NAME,
                                                sms_template_code:
                                                DISPATCH_MSG_API
                                                    .CODE,
                                                phone_number: String(
                                                    person.account
                                                        .person_telephone
                                                ),
                                                sms_param_dict: {
                                                    person_name: String(
                                                        person.account
                                                            .person_name
                                                    ),
                                                    sender_department: getUser()
                                                        .org
                                                }
                                            };
                                            return sentMessageAc({}, obj);
                                        });
                                        Promise.all(msg_all)
                                            .then(() => {
                                                message.success(
                                                    '短信通知成功！'
                                                );
                                                this.closeModal();
                                            })
                                            .catch(() => {
                                                message.error('短信通知失败！');
                                                this.closeModal();
                                            });
                                    })
                                    .catch(() => {
                                        this.closeModal();
                                    });
                            } else {
                                this.closeModal();
                            }
                        }
                    });
                } else if (toggleData.status === 'EDIT') {
                    let sendData = {
                        from_whom: ucode,
                        from_whom_department: ucode,
                        to_whom: this._getOrgText(sentUsers),
                        cc: this._getOrgText(copyUsers),
                        title: values['title3'],
                        body_rich: this.state.content,
                        is_draft: false,
                        sent_email: false,
                        extend_info: {},
                        external_attachments: [
                            {
                                file_id: fileList[0].id,
                                file_name: fileList[0].name,
                                file_partial_url: fileList[0].a_file,
                                file_info: fileList[0],
                                send_time: moment().format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )
                            }
                        ]
                    };
                    postSentDocAc({}, sendData).then(rst => {
                        if (rst._id) {
                            message.success('发送文件成功！');
                            let orgCode = getUser().org;

                            let orgListCodes = orgCode.split('_');
                            orgListCodes.pop();
                            let codeu = orgListCodes.join();
                            let ucode = codeu.replace(/,/g, '_');
                            getSentInfoAc({
                                user: encodeURIComponent(ucode)
                            });
                            // 所有需要发短信的人员手机号码
                            let promises_one = [];
                            let promises_two = [];
                            let promises_all = [];
                            if (isSentMsg) {
                                promises_one = sentUsers.map(org => {
                                    return getUsers({}, {
                                        org_code: org.split('--')[0]
                                    });
                                });
                            }
                            if (isCopyMsg) {
                                promises_two = copyUsers.map(org => {
                                    return getUsers({}, {
                                        org_code: org.split('--')[0]
                                    });
                                });
                            }
                            if (isSentMsg || isCopyMsg) {
                                promises_all = promises_one.concat(
                                    promises_two
                                );
                                Promise.all(promises_all)
                                    .then(rst => {
                                        let orgs_all = [];
                                        let msg_all = [];
                                        rst.map(org => {
                                            orgs_all = orgs_all.concat(org);
                                        });
                                        msg_all = orgs_all.map(person => {
                                            let obj = {
                                                sms_free_sign_name:
                                                DISPATCH_MSG_API
                                                    .NAME,
                                                sms_template_code:
                                                DISPATCH_MSG_API
                                                    .CODE,
                                                phone_number: String(
                                                    person.account
                                                        .person_telephone
                                                ),
                                                sms_param_dict: {
                                                    person_name: String(
                                                        person.account
                                                            .person_name
                                                    ),
                                                    sender_department: getUser()
                                                        .org
                                                }
                                            };
                                            return sentMessageAc({}, obj);
                                        });
                                        Promise.all(msg_all)
                                            .then(() => {
                                                message.success(
                                                    '短信通知成功！'
                                                );
                                                this.closeModal();
                                            })
                                            .catch(() => {
                                                message.error('短信通知失败！');
                                                this.closeModal();
                                            });
                                    })
                                    .catch(() => {
                                        this.closeModal();
                                    });
                            } else {
                                this.closeModal();
                            }
                        }
                    });
                }
            }
        });
    }

    static _checkSentDisable (value, arr) {
        let disabled = false;
        if (arr.filter(itm => itm === value).length > 0) {
            disabled = true;
        }
        return disabled;
    }

    static _checkSentDisableT (value, arr) {
        let disabled = false;
        if (arr.filter(itm => itm === value).length > 0) {
            disabled = true;
        }
        return disabled;
    }

    columns = [
        {
            title: '单位',
            width: '70%',
            dataIndex: 'org'
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <Button
                        type='danger'
                        onClick={this._deleteSent.bind(this, index)}
                    >
                        删除
                    </Button>
                );
            }
        }
    ];
    columnsT = [
        {
            title: '单位',
            width: '70%',
            dataIndex: 'org'
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <Button
                        type='danger'
                        onClick={this._deleteSentT.bind(this, index)}
                    >
                        删除
                    </Button>
                );
            }
        }
    ];

    _deleteSent (index) {
        const { sentUsers } = this.state;
        let newUsers = sentUsers;
        newUsers.splice(index, 1);
        this.setState({
            sentUsers: newUsers
        });
    }

    _deleteSentT (index) {
        const { copyUsers } = this.state;
        let newUsers = copyUsers;
        newUsers.splice(index, 1);
        this.setState({
            copyUsers: newUsers
        });
    }

    _getUserFunc (sentUsers) {
        let arr = [];
        sentUsers.map(itm => {
            let info = itm.split('--');
            let obj = {
                code: info[0],
                org: info[1]
            };
            arr.push(obj);
        });
        return arr;
    }

    _cpoyMsg (e) {
        this.setState({
            isSentMsg: e.target.checked
        });
    }

    _cpoyMsgT (e) {
        this.setState({
            isCopyMsg: e.target.checked
        });
    }

    static loop (data = [], arr = []) {
        return data.map(item => {
            if (item && item.OrgCode) {
                console.log('data', data);
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.OrgName}`}
                            value={`${item.ID}--${item.OrgName}`}
                            title={`${item.OrgName}`}
                            disabled={ToggleModal._checkSentDisable(
                                `${item.ID}--${item.OrgName}`,
                                arr
                            )}
                        >
                            {ToggleModal.loop(item.children)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.OrgName}`}
                            value={`${item.ID}--${item.OrgName}`}
                            title={`${item.OrgName}`}
                            disabled={ToggleModal._checkSentDisable(
                                `${item.ID}--${item.OrgName}`,
                                arr
                            )}
                        />
                    );
                }
            } else {
                if (item && item.Orgs && item.Orgs.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.ProjectName}`}
                            value={`${item.ID}--${item.ProjectName}`}
                            title={`${item.ProjectName}`}
                            disabled
                        >
                            {ToggleModal.loop(item.Orgs)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.ProjectName}`}
                            value={`${item.ID}--${item.ProjectName}`}
                            title={`${item.ProjectName}`}
                            disabled
                        />
                    );
                }
            }
        });
    }

    static loopT (data = [], arr = []) {
        console.log('data', data);
        return data.map(item => {
            if (item && item.OrgCode) {
                console.log('data', data);
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.OrgName}`}
                            value={`${item.ID}--${item.OrgName}`}
                            title={`${item.OrgName}`}
                            disabled={ToggleModal._checkSentDisable(
                                `${item.ID}--${item.OrgName}`,
                                arr
                            )}
                        >
                            {ToggleModal.loopT(item.children)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.OrgName}`}
                            value={`${item.ID}--${item.OrgName}`}
                            title={`${item.OrgName}`}
                            disabled={ToggleModal._checkSentDisableT(
                                `${item.ID}--${item.OrgName}`,
                                arr
                            )}
                        />
                    );
                }
            } else {
                if (item && item.Orgs && item.Orgs.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.ProjectName}`}
                            value={`${item.ID}--${item.ProjectName}`}
                            title={`${item.ProjectName}`}
                            disabled
                        >
                            {ToggleModal.loopT(item.Orgs)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}--${item.ProjectName}`}
                            value={`${item.ID}--${item.ProjectName}`}
                            title={`${item.ProjectName}`}
                            disabled
                        />
                    );
                }
            }
        });
    }
}

export default Form.create()(ToggleModal);

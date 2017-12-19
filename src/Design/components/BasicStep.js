import React, {Component} from 'react';
import {
    Form, Input, Select, Button, DatePicker, Spin,
    Row, Col, Upload, Icon, message, Cascader, notification,
} from 'antd';
import moment from 'moment';
import {FILE_API, WORKFLOW_CODE} from '_platform/api';
import {fileTypes} from '../../fileTypes';
import {getUser} from '_platform/auth';
import {DeleteIpPort} from '../../_components/DeleteIpPort';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const Dragger = Upload.Dragger;

export default class BasicStep extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

    constructor(props) {
        super(props);
        this.state = {
            status: undefined,
            user: null,
            formLoading: false,
            fileList: []
        };
    }

    render() {
        const {
            added = false,
            marjors = [],
            param = {},
            workPackage: {
                unitWorkPackages = [],
                childUnitWorkPackages = [],
                sectionWorkPackages = [],
                childSectionWorkPackages = [],
            } = {},
            actions: {changeParam},
        } = this.props;
        this.uploadProps.fileList = this.state.fileList;
        const user = getUser();
        return (
            <div>
                <Spin tip="提交数据中，请稍等..." spinning={this.state.formLoading}>
                    <Form>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem {...BasicStep.layout} label="文件">
                                    <Dragger {...this.uploadProps}
                                             accept={fileTypes}>
                                        <Icon type="file-pdf"/>
                                        &nbsp;&nbsp;点击上传文件
                                    </Dragger>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="名称">
                                    <Input value={param.name}
                                           onChange={changeParam.bind(this,
                                               'name')}/>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="描述">
                                    <Input type="textarea" value={param.desc}
                                           rows={4}
                                           onChange={changeParam.bind(this,
                                               'desc')}/>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="图号"
                                          validateStatus={this.state.status}
                                          help="图号为唯一">
                                    <Input value={param.code}
                                           onChange={changeParam.bind(this,
                                               'code')}
                                           onBlur={this.validateCode.bind(this)}/>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="版本">
                                    <Input value={param.version}
                                           onChange={changeParam.bind(this,
                                               'version')}/>
                                </FormItem>

                                {
                                    !added &&
                                    <FormItem {...BasicStep.layout} label="原设计文件">
                                        <Input value={param.origin}
                                               onChange={changeParam.bind(this,
                                                   'origin')}/>
                                    </FormItem>

                                }

                                <FormItem {...BasicStep.layout} label="专业">
                                    <Select mode={'multiple'} allowClear={true}
                                            placeholder="可多选..."
                                            value={param.marjor}
                                            onChange={changeParam.bind(this,
                                                'marjor')}>
                                        {marjors.map((marjor, index) => {
                                            return <Option key={index}
                                                           value={marjor.code}>{marjor.name}</Option>;
                                        })}
                                    </Select>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="图纸阶段">
                                    <Select value={param.step}
                                            onChange={changeParam.bind(this,
                                                'step')}>
                                        <Option value="总体设计">总体设计</Option>
                                        <Option value="规划设计">规划设计</Option>
                                        <Option value="施工图设计">施工图设计</Option>
                                        <Option value="竣工图设计">竣工图设计</Option>
                                    </Select>
                                </FormItem>

                                <FormItem {...BasicStep.layout} label="单位工程">
                                    <Select mode={'multiple'} allowClear={true}
                                            value={param.units}
                                            onChange={this.changeUnit.bind(this)}>
                                        {
                                            unitWorkPackages.map(
                                                (workPackage, index) => {
                                                    return <Option key={index}
                                                                   value={workPackage.code}>{workPackage.name}</Option>;
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="子单位工程">
                                    <Select mode={'multiple'} allowClear={true}
                                            value={param.childUnits}
                                            onChange={this.changeChildUnit.bind(
                                                this)}>
                                        {
                                            childUnitWorkPackages.map(
                                                (childrenWorkPackage, index) => {
                                                    return <Option key={index}
                                                                   value={childrenWorkPackage.code}>{childrenWorkPackage.name}</Option>;
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="分部工程">
                                    <Select mode={'multiple'} allowClear={true}
                                            value={param.sections}
                                            onChange={this.changeSection.bind(
                                                this)}>
                                        {
                                            sectionWorkPackages.map(
                                                (childrenWorkPackage, index) => {
                                                    return <Option key={index}
                                                                   value={childrenWorkPackage.code}>{childrenWorkPackage.name}</Option>;
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem {...BasicStep.layout} label="子分部工程">
                                    <Select mode={'multiple'} allowClear={true}
                                            value={param.childSections}
                                            onChange={this.changeChildSection.bind(
                                                this)}>
                                        {
                                            childSectionWorkPackages.map(
                                                (childrenWorkPackage, index) => {
                                                    return <Option key={index}
                                                                   value={childrenWorkPackage.code}>{childrenWorkPackage.name}</Option>;
                                                })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.next.bind(this)}>下一步</Button>
                    </div>
                    <Row>
                        <Col span={4} offset={4}>
                            <span>填报人：</span>
                            <span>{`${user.name} ${user.org}`}</span>
                        </Col>
                        <Col span={6} offset={2}>
                            <span>审核人：</span>
                            <span>
							<Cascader options={this.getUserOptions()}
                                      expandTrigger="hover"
                                      placeholder="请选择审核人"
                                      value={this.state.user}
                                      onChange={this.changeUser.bind(this)}
                                      displayRender={BasicStep.displayRender}/>
						</span>
                        </Col>
                        <Col span={8} style={{textAlign: 'right'}}>
                            <Button onClick={this.submit.bind(this)}>提交</Button>
                        </Col>
                    </Row>
                </Spin>
            </div>
        );
    }

    componentDidMount() {
        const {getUsers, getMarjors} = this.props.actions;
        getUsers();
        getMarjors();
    }

    validateCode(event) {
        const value = event.target.value;
        const {
            actions: {getDocument},
        } = this.props;
        getDocument({doc_id: value}).then(rst => {
            const index = 'object not found'.indexOf(rst);
            if (index < 0) {
                this.setState({
                    status: 'error',
                });
            } else {
                this.setState({
                    status: 'success',
                });
            }
        });
        // changeParam('code', value);
    }

    getUserOptions() {
        const {users = []} = this.props;
        return users.map(u => {
            return {
                label: u.key,
                value: u.key,
                children: u.org.map(o => {
                    const account = o.account || {};
                    return {
                        label: account.person_name,
                        value: o.id,
                    };
                }),
            };
        });
    }

    changeUser(value) {
        this.setState({
            user: value,
        });
    }

    getNextUser() {
        let nextUser = null;
        const {users = []} = this.props;
        const [, id] = this.state.user;
        if (!id) {
            message.error('请先选择审核人');
            return;
        }
        users.forEach(({org}) => {
            const next = org.find(u => +u.id === +id);
            if (next) {
                nextUser = next;
            }
        });
        return {
            id: nextUser.id,
            username: nextUser.username,
        };
    }

    submit() {
        const that = this;
        const {
            actions: {postNotice, createFlow, addActor, commitFlow, startFlow, putFlow, clearParams},
            contrasts, param, currentNode = {}, items = [], basic_params
        } = this.props;
        if (!this.validate()) {
            return;
        }
        this.setState({
            formLoading: true,
        });
        const {name, code, ...arg} = param;
        const nextUser = this.getNextUser();
        const currentUser = getUser();
        postNotice({}, {
            ...basic_params,
            name: name,
            code: code,
            obj_type: 'C_DOC',
            profess_folder: {code: currentNode.code, obj_type: 'C_DIR'},
            extra_params: {...arg, contrasts, items},
        }).then(rst => {
            const {pk} = rst;
            if (pk) {
                createFlow({}, {
                    name: '图纸报审',
                    description: '图纸报审流程',
                    subject: [{'id': rst.pk, 'name': name}],
                    code: WORKFLOW_CODE.DESIGN_BLUEPRINT,
                    creator: currentUser,
                    plan_start_time: moment().format('YYYY-MM-DD'),
                    deadline: null,
                }).then(instance => {
                    const {id, workflow: {states = []} = {}} = instance;
                    const [{id: state_id, actions: [action]}, {id: next_id}] = states;
                    Promise.all([
                        addActor({ppk: id, pk: state_id}, {
                            participants: [currentUser],
                            remark: 'testest',
                        }),
                        addActor({ppk: id, pk: next_id}, {
                            participants: [nextUser],
                            remark: 'testest',
                        }),
                    ]).then(() => {
                        commitFlow({pk: id}, {
                            creator: currentUser,
                        }).then(() => {
                            startFlow({pk: id}, {
                                creator: currentUser,
                            }).then(() => {
                                putFlow({pk: id}, {
                                    'state': state_id,
                                    'executor': currentUser,
                                    'action': action,
                                    'note': '同意',
                                    'attachment': null,
                                });
                                //清除param的数据
                                clearParams();
                                that.setState({
                                    formLoading: false,
                                    user: null,
                                    fileList: [],
                                });
                                notification.success({
                                    message: '流程信息',
                                    description: '图纸报审流程提交成功',
                                });
                            });
                        });
                    });
                });
            } else {
                message.error('文档报错失败');
                this.setState({
                    formLoading: false,
                });
            }

        });
    }

    validate() {
        const {
            param = {}, workPackage: {itemWorkPackages = []} = {},
            actions: {toggleStep, fillItem},
        } = this.props;
        if (!param.name) {
            message.error('请上传文件');
            return false;
        } else if (!param.code) {
            message.error('请填写编码');
            return false;
        }
        return true;
    }

    next() {
        const {
            param = {}, workPackage: {itemWorkPackages = []} = {},
            actions: {toggleStep, fillItem},
        } = this.props;
        const {childSections = []} = param;
        if (!param.name) {
            message.error('请上传文件');
        } else if (!param.code) {
            message.error('请填写编码');
        } else if (!childSections.length) {
            message.error('请选择单元或分部工程');
        } else {
            fillItem(itemWorkPackages);
            toggleStep(1);
        }
    }

    changeUnit(values) {
        const {getChildrenWorkPackages, setChildUnitWorkPackages, changeParam} = this.props.actions;
        changeParam('units', values);
        const promises = values.map(val => {
            return getChildrenWorkPackages({code: val});
        });
        Promise.all(promises).then((packages) => {
            let childrenWorkPackages = [];
            packages.forEach(pk => {
                if (pk.children_wp && pk.children_wp.length) {
                    childrenWorkPackages = childrenWorkPackages.concat(
                        pk.children_wp);
                }
            });
            setChildUnitWorkPackages(childrenWorkPackages);
        });
    }

    changeChildUnit(values) {
        const {getChildrenWorkPackages, setSectionWorkPackages, changeParam} = this.props.actions;
        changeParam('childUnits', values);
        const promises = values.map(val => {
            return getChildrenWorkPackages({code: val});
        });
        Promise.all(promises).then((packages) => {
            let childrenWorkPackages = [];
            packages.forEach(pk => {
                if (pk.children_wp && pk.children_wp.length) {
                    childrenWorkPackages = childrenWorkPackages.concat(
                        pk.children_wp);
                }
            });
            setSectionWorkPackages(childrenWorkPackages);
        });
    }

    changeSection(values) {
        const {getChildrenWorkPackages, setChildSectionWorkPackages, changeParam} = this.props.actions;
        changeParam('sections', values);
        const promises = values.map(val => {
            return getChildrenWorkPackages({code: val});
        });
        Promise.all(promises).then((packages) => {
            let childrenWorkPackages = [];
            packages.forEach(pk => {
                if (pk.children_wp && pk.children_wp.length) {
                    childrenWorkPackages = childrenWorkPackages.concat(
                        pk.children_wp);
                }
            });
            setChildSectionWorkPackages(childrenWorkPackages);
        });
    }

    changeChildSection(values) {
        const {getChildrenWorkPackages, setItemWorkPackages, changeParam} = this.props.actions;
        changeParam('childSections', values);
        const promises = values.map(val => {
            return getChildrenWorkPackages({code: val});
        });
        Promise.all(promises).then((packages) => {
            let childrenWorkPackages = [];
            packages.forEach(pk => {
                const children = pk.children_wp;
                if (children && children.length) {
                    children.forEach(item => {
                        item.section = `${pk.code} ${pk.name}`;
                    });
                    childrenWorkPackages = childrenWorkPackages.concat(
                        children);
                }
            });
            setItemWorkPackages(childrenWorkPackages);
        });
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        headers: {
            authorization: 'authorization-text',
        },
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            // const valid = file.type === 'application/pdf';
            // if (!valid) {
            // 	message.error('只能上传 word、dwg、pdf、excel 文件！');
            // }
            // return valid;
        },
        onChange: (values) => {
            this.setState({
                fileList: [values.file]
            });
            const {changeParam, changeBasicParams} = this.props.actions;
            const {file, fileList: [doc = {}]} = values;
            if (file.status === 'done') {
                this.setState({
                    fileList: [file]
                });
                // const {a_file} = doc.response || {};
                changeParam('name', doc.name);
                changeBasicParams(DeleteIpPort(values.file));
            }
        },
    };

    static displayRender(label) {
        return label[label.length - 1];
    }
};

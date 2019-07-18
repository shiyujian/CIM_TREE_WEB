import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, DatePicker, Select, Input, Notification, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PersonTree from './PersonTree';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TaskCreateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            typeOptionArr: [], // 养护种类
            teamPerson: [], // 林总库中的所有人员
            signUser: '', // 当前登录用户信息
            loading: true
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getCuringTypes,
                getForestAllUsersData
            }
        } = this.props;
        let curingTypes = await getCuringTypes();
        let content = curingTypes && curingTypes.content;
        let typeOptionArr = [];
        if (content && content.length > 0) {
            content.map((type) => {
                typeOptionArr.push(<Option key={type.ID} value={type.ID} >{type.Base_Name}</Option>);
            });
        }
        this.setState({
            typeOptionArr
        });
        let user = getUser();
        let username = (user && user.username) || '';
        if (username) {
            let postData = {
                username
            };
            let forestData = await getForestAllUsersData({}, postData);
            if (forestData && forestData.content && forestData.content.length > 0) {
                let signUser = forestData.content[0];
                this.setState({
                    signUser
                });
            }
        }
    };
    componentDidUpdate (prevProps, prevState) {
        const {
            noLoading
        } = this.props;
        if (noLoading && noLoading !== prevProps.noLoading) {
            this.setState({
                loading: false
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            treeNum = 0,
            regionArea = 0,
            regionSectionName,
            regionThinName
        } = this.props;
        const {
            typeOptionArr,
            loading
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this._handleTaskModalCancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this._handleTaskModalOk.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = loading ? null : arr;
        return (

            <Modal
                title='新建任务'
                // onOk={this._handleTaskModalOk.bind(this)}
                // onCancel={this.props.onCancel}
                visible
                width='700px'
                footer={footer}
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护类型'>
                                {getFieldDecorator('taskType', {
                                    rules: [
                                        { required: true, message: '请选择养护类型' }
                                    ]
                                })(
                                    <Select placeholder={'请选择养护类型'}>
                                        {typeOptionArr}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务时间'>
                                {getFieldDecorator('taskTime', {
                                    rules: [
                                        { required: true, message: '请选择任务时间' }
                                    ]
                                })(
                                    <RangePicker
                                        showTime
                                        format='YYYY-MM-DD HH:mm:ss'
                                        placeholder={['计划开始时间', '计划结束时间']}
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护班组'>
                                {getFieldDecorator('taskTeam', {
                                    rules: [
                                        { required: true, message: '请选择养护班组' }
                                    ]
                                })(
                                    <PersonTree {...this.props} onSelect={this._handleSelectTeam.bind(this)} />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='面积(亩)'>
                                {getFieldDecorator('taskTreeArea', {
                                    initialValue: `${regionArea}`,
                                    rules: [
                                        { required: true, message: '请输入面积' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='标段'>
                                {getFieldDecorator('taskSection', {
                                    initialValue: `${regionSectionName}`,
                                    rules: [
                                        { required: true, message: '请输入标段名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='细班'>
                                {getFieldDecorator('taskThinClass', {
                                    initialValue: `${regionThinName}`,
                                    rules: [
                                        { required: true, message: '请输入细班名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        {/* <Row>
                            <FormItem {...FormItemLayout} label='树木数量(棵)'>
                                {getFieldDecorator('taskTreeNum', {
                                    initialValue: `${treeNum}`,
                                    rules: [
                                        { required: true, message: '请输入树木数量' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row> */}
                        {/* <Row>
                        <FormItem {...FormItemLayout} label='备注'>
                            {getFieldDecorator('taskRemark', {
                                rules: [
                                    { required: false, message: '请输入备注' }
                                ]
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Row> */}
                    </Form>
                </Spin>
            </Modal>

        );
    }

    _handleSelectTeam = async (value) => {
        const {
            form: {
                setFieldsValue
            },
            actions: {
                getCuringGroupMans
            }
        } = this.props;
        if (value) {
            let postGetData = {
                groupid: value
            };
            let teamPerson = await getCuringGroupMans(postGetData);
            console.log('teamPerson', teamPerson);
            setFieldsValue({
                taskTeam: value
            });
            this.setState({
                teamPerson
            });
        } else {
            Notification.error({
                message: '选择班组失败',
                duration: 2
            });
        }
    }

    _handleTaskModalCancel = async () => {
        await this.props.onCancel();
        this.setState({
            loading: true
        });
    }

    // 下发任务
    _handleTaskModalOk = async () => {
        console.log('this.props', this.props);
        const {
            regionThinNo,
            regionSectionNo,
            wkt,
            actions: {
                postCuringTask
            }
        } = this.props;
        const {
            teamPerson,
            signUser
        } = this.state;
        if (!(signUser && signUser.ID)) {
            Notification.error({
                message: '当前登录用户无法下发任务',
                duration: 2
            });
            return;
        }
        if (!(teamPerson && teamPerson instanceof Array && teamPerson.length > 0)) {
            Notification.error({
                message: '当前班组无养护人员，请重新选择班组或为班组添加人员',
                duration: 2
            });
            return;
        }

        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                try {
                    let CuringMans = '';
                    teamPerson.map((person, index) => {
                        if (index === 0) {
                            CuringMans = CuringMans + `${person.User}`;
                        } else {
                            CuringMans = CuringMans + ',' + `${person.User}`;
                        }
                    // CuringMans.push(person.User);
                    });
                    console.log('CuringMans', CuringMans);
                    let postData = {
                        'Area': Number(values.taskTreeArea),
                        'Creater': signUser.ID,
                        'CuringGroup': values.taskTeam,
                        'CuringMans': CuringMans,
                        'CuringMode': 0,
                        'CuringType': values.taskType,
                        // 'Num': Number(values.taskTreeNum),
                        'Num': 0,
                        'PlanEndTime': moment(values.taskTime[1]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanStartTime': moment(values.taskTime[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanWKT': wkt,
                        'Section': regionSectionNo,
                        // 'Section': 'P009-01-04',
                        // 'ThinClass': 'P009-01-007-012'
                        'ThinClass': regionThinNo
                    };
                    let taskData = await postCuringTask({}, postData);
                    console.log('taskData', taskData);
                    if (taskData && taskData.code && taskData.code === 1) {
                        Notification.success({
                            message: '下发任务成功',
                            dutation: 3
                        });
                        await this.props.onOk();
                        this.setState({
                            loading: true
                        });
                    } else {
                        Notification.error({
                            message: '下发任务失败',
                            dutation: 3
                        });
                    }
                } catch (e) {
                    console.log('e', e);
                }
            }
        });
    }
}
export default Form.create()(TaskCreateModal);

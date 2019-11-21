import React, { Component } from 'react';
import {
    Modal,
    Row,
    Col,
    Form,
    Input,
    Select,
    Notification
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class EditPersonModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            searchValue: '',
            newKey: Math.random(),
            idImgF: true,
            idImgZ: true,
            isBlackChecked: null, // 黑名单按键
            blackRemarkValue: null,
            orgSelect: ''
        };
    }
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
    componentDidMount = async () => {
        const {
            form: {
                setFieldsValue
            },
            editPersonRecord,
            workGroupsData
        } = this.props;
        try {
            let groupData = '';
            if (editPersonRecord.TeamID) {
                workGroupsData.map((group) => {
                    if (group.ID === editPersonRecord.TeamID) {
                        groupData = group;
                    }
                });
            }
            console.log('groupData', groupData);
            await setFieldsValue({
                ImagePath: editPersonRecord.ImagePath,
                idNum: editPersonRecord.ID_Card,
                Name: editPersonRecord.Name,
                phone: editPersonRecord.Phone,
                bloodType: editPersonRecord.BloodType,
                gender: editPersonRecord.Gender,
                workGroup: editPersonRecord.TeamID,
                workType: editPersonRecord.WorkTypeID,
                groupLeader: groupData && groupData.Leader,
                groupLeaderPhone: groupData && groupData.LeaderPhone
            });
            this.setState({
                imagePath: editPersonRecord.ImagePath
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    // 身份证号校验
    checkIDCard = async (rule, value, callback) => {
        if (value) {
            // 身份证号正则
            let reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(`请输入正确的身份证号`);
            }
        } else {
            callback();
        }
    }
    // 手机号校验
    checkPhone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
    }
    handleWorkGroupChange (value) {
        const {
            workGroupsData,
            form: {
                setFieldsValue
            }
        } = this.props;
        let groupData = '';
        workGroupsData.map((group) => {
            if (group.ID === value) {
                groupData = group;
            }
        });
        setFieldsValue({
            groupLeader: groupData && groupData.Leader,
            groupLeaderPhone: groupData && groupData.LeaderPhone
        });
    }
    save = async () => {
        const {
            actions: {
                putWorkman
            },
            editPersonRecord
        } = this.props;
        if (editPersonRecord && editPersonRecord.ID) {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    // 修改人员信息
                    let putUserPostData = {
                        'BloodType': values.bloodType || '',
                        'CardImages': editPersonRecord.CardImages,
                        'Certificate': editPersonRecord.Certificate,
                        'Creater': editPersonRecord.Creater,
                        'Gender': values.bloodType || '',
                        'Section': editPersonRecord.Section, // 标段
                        'ID_Card': values.idNum || '', // 身份证号码
                        'Name': values.Name || '', // 姓名
                        'Remark': editPersonRecord.Remark, // 备注
                        'TeamID': values.workGroup || '', // 班组ID
                        'WorkTypeID': values.workType || '', // 工种ID
                        'Phone': values.phone || '',
                        'ID': editPersonRecord.ID
                    };
                    let userData = await putWorkman({}, putUserPostData);
                    if (userData && userData.code && userData.code === 1) {
                        Notification.success({
                            message: '修改人员成功'
                        });
                        await this.props.handleCloseEditModalOK();
                    } else {
                        Notification.error({
                            message: '修改人员失败'
                        });
                    }
                }
            });
        }
    }

    cancel () {
        this.props.handleCloseEditModal();
    }
    render () {
        const {
            form: {
                getFieldDecorator
            },
            workGroupsData = [],
            workTypesList = []
        } = this.props;
        const {
            imagePath
        } = this.state;
        return (
            <div>
                <Modal
                    title={'编辑人员信息'}
                    visible
                    className='large-modal'
                    width='600'
                    maskClosable={false}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row gutter={24}>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='头像:'
                            >
                                {getFieldDecorator('ImagePath', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请在移动端上传头像'
                                        }
                                    ]
                                })(
                                    <a>
                                        <img
                                            // onClick={this.handleImgView.bind(this, imagePath)}
                                            src={imagePath}
                                            alt='请在移动端上传头像'
                                            style={{width: 80, height: 80}}
                                        />
                                    </a>
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='身份证号码:'
                            >
                                {getFieldDecorator('idNum', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入身份证号码'
                                        },
                                        {
                                            validator: this.checkIDCard
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder='请输入身份证号码'
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='姓名:'
                            >
                                {getFieldDecorator('Name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入姓名'
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder='请输入姓名'
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='手机号:'
                            >
                                {getFieldDecorator('phone', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入手机号'
                                        },
                                        {
                                            validator: this.checkPhone
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder='请输入手机号'
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='血型:'
                            >
                                {getFieldDecorator('bloodType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择血型'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='请选择血型'
                                        style={{ width: '100%' }}
                                    >
                                        <Option key={'A型'} value={'A型'} title={'A型'}>
                                            A型
                                        </Option>
                                        <Option key={'B型'} value={'B型'} title={'B型'}>
                                            B型
                                        </Option>
                                        <Option key={'AB型'} value={'AB型'} title={'AB型'}>
                                            AB型
                                        </Option>
                                        <Option key={'O型'} value={'O型'} title={'O型'}>
                                            O型
                                        </Option>
                                        <Option key={'RH型'} value={'RH型'} title={'RH型'}>
                                            RH型
                                        </Option>
                                        <Option key={'未知'} value={'未知'} title={'未知'}>
                                            未知
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='性别:'
                            >
                                {getFieldDecorator('gender', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择性别'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='请选择性别'
                                        style={{ width: '100%' }}
                                    >
                                        <Option key='女' value={1}>女</Option>
                                        <Option key='男' value={0}>男</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='班组:'
                            >
                                {getFieldDecorator('workGroup', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择班组'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='请选择班组'
                                        style={{ width: '100%' }}
                                        onChange={this.handleWorkGroupChange.bind(this)}
                                    >
                                        {
                                            workGroupsData.map((group) => {
                                                return <Option key={group.ID} value={group.ID} title={group.Name}>
                                                    {group.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='班组长:'
                            >
                                {getFieldDecorator('groupLeader', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择班组'
                                        }
                                    ]
                                })(
                                    <Input
                                        readOnly
                                        placeholder='请选择班组'
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='班组长电话:'
                            >
                                {getFieldDecorator('groupLeaderPhone', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择班组'
                                        }
                                    ]
                                })(
                                    <Input
                                        readOnly
                                        placeholder='请选择班组'
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...EditPersonModal.layout}
                                label='工种:'
                            >
                                {getFieldDecorator('workType', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择工种'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='请选择工种'
                                        style={{ width: '100%' }}
                                    >
                                        {
                                            workTypesList.map((type) => {
                                                return <Option key={type.ID} value={type.ID} title={type.Name}>
                                                    {type.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(EditPersonModal);


import React, { Component } from 'react';
import {
    Row,
    Col,
    Icon,
    Input,
    Button,
    Select,
    Modal,
    Form,
    Upload,
    Cascader,
    Notification
} from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { UPLOAD_API } from '_platform/api';
import { getForestImgUrl, getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            fileListBack: [],
            RegionCodeList: [], // 行政区划option
            optionList: [], // 绑定供应商列表
            Suppliers: [], // 绑定的供应商
            LeaderCard: '', // 身份证正面url
            LeaderCardBack: '', // 身份证反面url
            RegionCode: '' // 行政区划
        };
        this.regionCode_name = [];
        this.Contacter = ''; // 联系人
        this.ContacterPhone = ''; // 联系方式
        this.toSave = this.toSave.bind(this); // 新增苗圃
        this.checkPhone = this.checkPhone.bind(this); // 校验手机号
        this.checkCardNo = this.checkCardNo.bind(this); // 校验身份证
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
    }
    componentDidMount = async () => {
        const {
            actions: {
                getRegionCodes
            },
            optionList,
            RegionCodeList
        } = this.props;
        let rep = await getRegionCodes({}, { grade: 3 });
        if (rep && rep instanceof Array && rep.length > 0) {
            this.regionCode_name = rep;
        }
        // 获取本用户的姓名，电话作为联系人，联系方式
        const user = getUser();
        this.Contacter = (user && user.name) || '';
        this.ContacterPhone = (user && user.phone) || '';
        if (optionList) {
            this.setState({
                optionList: optionList,
                RegionCodeList: RegionCodeList
            });
        }
    }
    handleSuppliers (value) {
        this.setState({
            Suppliers: value,
            optionList: this.props.optionList
        });
    }
    searchSuppliers (value) {
        let optionList = [];
        this.props.optionList.map(item => {
            if (item.SupplierName.includes(value)) {
                optionList.push(item);
            }
        });
        this.setState({
            optionList
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    toSave () {
        const {
            actions: { postNursery }
        } = this.props;
        const {
            LeaderCard,
            LeaderCardBack,
            RegionCode,
            Suppliers
        } = this.state;
        this.props.form.validateFields((err, values) => {
            console.log('values', values);
            if (err) {
                return;
            }
            if (!LeaderCard || !LeaderCardBack) {
                Notification.error({
                    message: '请上传身份证正反面',
                    duration: 2
                });
                return;
            }
            let arr = [];
            if (Suppliers.length > 0) {
                Suppliers.map(item => {
                    arr.push({
                        ID: item
                    });
                });
            }

            let RegionName;
            this.regionCode_name.map(item => {
                if (item.ID === RegionCode) {
                    RegionName = item.MergerName;
                }
            });
            let regionName = RegionName.split(',')[1] + RegionName.split(',')[2] + RegionName.split(',')[3];
            let postdata = {
                NurseryName: values.NurseryName,
                TreePlace: values.TreePlace,
                RegionCode: RegionCode,
                Address: values.Address || '',
                Contacter: this.Contacter,
                ContacterPhone: this.ContacterPhone,
                Leader: values.Leader,
                LeaderPhone: values.LeaderPhone,
                LeaderCardNo: values.LeaderCardNo,
                LeaderCard: LeaderCard,
                LeaderCardBack: LeaderCardBack,
                Suppliers: arr
            };
            postNursery({}, postdata).then(rep => {
                if (rep && rep.code === 2) {
                    console.log('rep.msg', rep.msg);
                    if (rep.msg && rep.msg === '该苗圃基地负责人已被拉黑！') {
                        Notification.error({
                            message: '该苗圃基地负责人已被拉黑！'
                        });
                    } else {
                        Notification.error({
                            message: '苗圃基地已存在！'
                        });
                    }
                } else if (rep.code === 1) {
                    Notification.success({
                        message: '新增苗圃成功'
                    });
                    this.props.handleCancel();
                    this.props.onSearch();
                } else {
                    Notification.error({
                        message: '新增失败'
                    });
                }
            });
        });
    }
    checkPhone () {
        const LeaderPhone = this.props.form.getFieldValue('LeaderPhone');
        if (!checkTel(LeaderPhone)) {
            this.props.form.setFieldsValue({LeaderPhone: ''});
            Notification.error({
                message: '手机号输入错误',
                duration: 2
            });
        }
    }
    checkCardNo () {
        const LeaderCardNo = this.props.form.getFieldValue('LeaderCardNo');
        if (!isCardNo(LeaderCardNo)) {
            this.props.form.setFieldsValue({LeaderCardNo: ''});
            Notification.error({
                message: '身份证输入错误',
                duration: 2
            });
        }
    }
    handleRegion (value) {
        let RegionCode = value[value.length - 1];
        this.setState({
            RegionCode
        });
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
    checkPersonName = async (rule, value, callback) => {
        if (value) {
            if (value.length > 15) {
                callback(`请输入15个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    checkPersonAddress = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入30个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    checkPersonTreePlace = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入30个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    checkPersonNurseryName = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入30个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    render () {
        const {
            Suppliers,
            RegionCodeList,
            optionList,
            fileList,
            fileListBack
        } = this.state;
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;
        const uploadIDCard = {
            action: `${UPLOAD_API}?filetype=org`,
            listType: 'picture',
            fileList: fileList,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
                    this.setState({
                        LeaderCard: rep,
                        fileList: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                setFieldsValue({
                    LeaderCard: ''
                });
                this.setState({
                    fileList: [],
                    LeaderCard: ''
                });
            }
        };
        const uploadIDCardBack = {
            action: `${UPLOAD_API}?filetype=org`,
            listType: 'picture',
            fileList: fileListBack,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = getForestImgUrl(rep);
                    this.setState({
                        LeaderCardBack: rep,
                        fileListBack: fileList
                    });
                });
                return false;
            },
            onRemove: () => {
                setFieldsValue({
                    LeaderCardBack: ''
                });
                this.setState({
                    fileListBack: [],
                    LeaderCardBack: ''
                });
            },
            onChange: (e) => {
                console.log('e', e);
            }
        };
        return (
            <div className='add-edit'>
                <Modal
                    title={this.props.visibleTitle}
                    width={920}
                    visible
                    maskClosable={false}
                    onOk={this.toSave}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='苗圃名称'
                                >
                                    {getFieldDecorator('NurseryName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入苗圃名称（30个字以下）'
                                            },
                                            {
                                                validator: this.checkPersonNurseryName
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入苗圃名称（30个字以下）' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='产地'
                                >
                                    {getFieldDecorator('TreePlace', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入产地（30个字以下）'
                                            },
                                            {
                                                validator: this.checkPersonTreePlace
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入产地（30个字以下）' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='行政区划'
                                >
                                    {getFieldDecorator('RegionCode', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '选择您所在的城市'
                                            }
                                        ]
                                    })(
                                        <Cascader placeholder='选择您所在的城市'
                                            options={RegionCodeList}
                                            onChange={this.handleRegion}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='地址'
                                >
                                    {getFieldDecorator('Address', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入地址（30个字以下）'
                                            },
                                            {
                                                validator: this.checkPersonAddress
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入地址（30个字以下）' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人姓名'
                                >
                                    {getFieldDecorator('Leader', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入负责人姓名（15个字以下）'
                                            },
                                            {
                                                validator: this.checkPersonName
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入负责人姓名（15个字以下）' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人手机号'
                                >
                                    {getFieldDecorator('LeaderPhone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入负责人手机号'
                                            },
                                            {
                                                validator: this.checkPersonTelephone
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入负责人手机号' maxLength='11' onBlur={this.checkPhone} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人身份证号'
                                >
                                    {getFieldDecorator('LeaderCardNo', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入负责人身份证号'
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入负责人身份证号' maxLength='18' onBlur={this.checkCardNo} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='绑定的供应商'
                                >
                                    <Select
                                        disabled
                                        mode='multiple'
                                        value={Suppliers}
                                        filterOption={false}
                                        onChange={this.handleSuppliers.bind(this)}
                                        onSearch={this.searchSuppliers.bind(this)}
                                        placeholder='请在绑定管理模块绑定供应商'>
                                        {
                                            optionList.map(item => {
                                                return <Option key={item.ID} value={item.ID}>{item.SupplierName}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人身份证正面'
                                >
                                    {getFieldDecorator('LeaderCard', {
                                        rules: [{
                                            required: true,
                                            message: '请上传负责人身份证正面'
                                        }]
                                    })(
                                        <Upload {...uploadIDCard}>
                                            <Button>
                                                <Icon type='upload' /> upload
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...layoutT}
                                    label='负责人身份证反面'
                                >
                                    {getFieldDecorator('LeaderCardBack', {
                                        rules: [{
                                            required: true,
                                            message: '请上传负责人身份证反面'
                                        }]
                                    })(
                                        <Upload {...uploadIDCardBack}>
                                            <Button>
                                                <Icon type='upload' /> upload
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Addition);

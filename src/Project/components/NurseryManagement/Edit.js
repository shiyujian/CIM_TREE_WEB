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
    Notification,
    Spin
} from 'antd';
import { checkTel, isCardNo, layoutT } from '../common';
import { UPLOAD_API } from '_platform/api';
import { getForestImgUrl, getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            fileList: [],
            fileListBack: [],
            RegionCodeList: [], // 行政区划option
            optionList: [], // 绑定供应商列表
            Suppliers: [], // 绑定的供应商
            record: null,
            isAmend: false, // 是否编辑
            LeaderCard: '', // 身份证正面url
            LeaderCardBack: '', // 身份证反面url
            RegionCode: '' // 行政区划
        };
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
                getNb2ss
            },
            form: {
                setFieldsValue
            },
            optionList,
            RegionCodeList,
            record
        } = this.props;
        this.setState({
            loading: true
        });
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
        // 修改信息回显
        if (record) {
            const {
                LeaderCard = '',
                LeaderCardBack = ''
            } = record;
            // 根据供应商id获取绑定苗圃
            getNb2ss({}, {nurserybaseid: record.ID}).then(rep => {
                console.log('rep', rep);
                let Suppliers = [];
                rep.map(item => {
                    Suppliers.push(item.SupplierID);
                });
                this.setState({
                    Suppliers
                });
            });

            // 设置行政区划
            let provinceCode = '';
            let sityCode = '';
            let RegionCode = record.RegionCode || '';
            if (RegionCode) {
                provinceCode = RegionCode.slice(0, 2) + '0000';
                sityCode = RegionCode.slice(0, 4) + '00';
            }
            let regionCode = '';
            if (provinceCode && sityCode && RegionCode) {
                regionCode = [provinceCode, sityCode, RegionCode];
            }
            console.log('regionCode', regionCode);
            setFieldsValue({
                NurseryName: record.NurseryName || '',
                TreePlace: record.TreePlace || '',
                RegionCode: regionCode,
                Address: record.Address || '',
                Leader: record.Leader || '',
                LeaderPhone: record.LeaderPhone || '',
                LeaderCardNo: record.LeaderCardNo || '',
                LeaderCard: getForestImgUrl(record.LeaderCard),
                LeaderCardBack: getForestImgUrl(record.LeaderCardBack)
            });

            const fileList = {
                uid: '-1',
                status: 'done'
            };
            let leaderCardImg = getForestImgUrl(LeaderCard);
            let leaderCardBackImg = getForestImgUrl(LeaderCardBack);
            this.Contacter = record.Contacter;
            this.ContacterPhone = record.ContacterPhone;
            this.setState({
                loading: false,
                isAmend: true,
                record: record,
                RegionCode: record.RegionCode,
                LeaderCard: record.LeaderCard,
                LeaderCardBack: record.LeaderCardBack,
                fileList: [{...fileList, thumbUrl: `${leaderCardImg}`}],
                fileListBack: [{...fileList, thumbUrl: `${leaderCardBackImg}`}]
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
            actions: { putNursery }
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const {
                LeaderCard,
                LeaderCardBack,
                RegionCode,
                record,
                Suppliers
            } = this.state;
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

            let postdata = {
                ID: record.ID,
                WKT: 'POINT(120 30)',
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
            putNursery({}, postdata).then(rep => {
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
                        message: '编辑苗圃成功'
                    });
                    this.props.handleCancel();
                    this.props.onSearch();
                } else {
                    Notification.error({
                        message: '编辑失败'
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
        console.log('value', value);
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
            fileList,
            fileListBack,
            Suppliers,
            RegionCodeList,
            isAmend,
            optionList,
            loading
        } = this.state;
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;

        const props = {
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
        const propsBack = {
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
                    <Spin spinning={loading}>
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
                                            <Input
                                                placeholder='请输入苗圃名称（30个字以下）'
                                                disabled={isAmend} />
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
                                            rules: [{
                                                required: true,
                                                message: '选择您所在的城市'
                                            }]
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
                                            rules: [{
                                                required: true,
                                                message: '请输入负责人身份证号'
                                            }]
                                        })(
                                            <Input
                                                placeholder='请输入负责人身份证号'
                                                maxLength='18'
                                                onBlur={this.checkCardNo} />
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
                                            <Upload {...props}>
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
                                            <Upload {...propsBack}>
                                                <Button>
                                                    <Icon type='upload' /> upload
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Edit);

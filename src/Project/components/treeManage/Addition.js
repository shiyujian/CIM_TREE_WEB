import React, { Component } from 'react';
import { TREETYPENO, NURSERYPARAM, TREEPARAM } from '_platform/api';
import { getForestImgUrl } from '_platform/auth';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    Upload,
    Icon,
    Radio,
    Select,
    Notification
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Addition extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            addVisible: false,
            treeParam: [],
            nurseryParam: [],
            samplingParam: [],
            loading: false,
            fileList: [],
            picsSrc: ''
        };
    }
    static layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
    };
    add () {
        this.setState({
            addVisible: true
        });
    }
    // 选择苗圃测量项
    handleNurseryParamChange = async (values) => {
        const {
            form: { setFieldsValue }
        } = this.props;
        const {
            treeParam
        } = this.state;
        let samplingParam = values.concat(treeParam.filter((item) => { return !(values.indexOf(item) > -1); }));
        let samplingParamText = '';
        samplingParam.map((param, index) => {
            if (index === 0) {
                samplingParamText = samplingParamText + param;
            } else {
                samplingParamText = samplingParamText + '，' + param;
            }
        });
        this.setState({
            nurseryParam: values,
            samplingParam
        });
        setFieldsValue({
            SamplingParamText: samplingParamText
        });
    }
    // 选择现场测量项
    handleTreeParamChange = (values) => {
        const {
            form: { setFieldsValue }
        } = this.props;
        const {
            nurseryParam
        } = this.state;
        // 如果现场测量项只有面积和密度，则其他两项为空，设置为不必填
        if (values && values instanceof Array && values.length === 2 && ((values[0] === '密度' && values[1] === '面积') || (values[0] === '面积' && values[1] === '密度'))) {
            this.setState({
                treeParam: values,
                samplingParam: [],
                nurseryParam: []
            });
            setFieldsValue({
                SamplingParamText: '',
                NurseryParam: []
            });
        } else {
            let samplingParam = nurseryParam.concat(values.filter((item) => { return !(nurseryParam.indexOf(item) > -1); }));
            let samplingParamText = '';
            samplingParam.map((param, index) => {
                if (index === 0) {
                    samplingParamText = samplingParamText + param;
                } else {
                    samplingParamText = samplingParamText + '，' + param;
                }
            });
            this.setState({
                treeParam: values,
                samplingParam
            });
            setFieldsValue({
                SamplingParamText: samplingParamText
            });
        }
    }

    // 上传文件
    uploadProps = {
        name: 'a_file',
        beforeUpload: file => {
            const {
                actions: { postForsetPic },
                form: { setFieldsValue }
            } = this.props;
            let type = file.name.toString().split('.');
            let len = type.length;
            if (
                type[len - 1] === 'jpg' ||
            type[len - 1] === 'jpeg' ||
            type[len - 1] === 'png' ||
            type[len - 1] === 'JPG' ||
            type[len - 1] === 'JPEG' ||
            type[len - 1] === 'PNG'
            ) {
                const formdata = new FormData();
                formdata.append('a_file', file);
                formdata.append('name', file.name);
                postForsetPic({}, formdata).then(rst => {
                    if (rst) {
                        let src = getForestImgUrl(rst);
                        let fileList = [{
                            uid: '-1',
                            name: file.name,
                            status: 'done',
                            url: src
                        }];
                        this.setState({
                            fileList: fileList,
                            picsSrc: rst,
                            loading: false
                        });
                        return false;
                    } else {
                        this.setState({
                            fileList: [],
                            picsSrc: '',
                            loading: false
                        });
                        setFieldsValue({
                            TreePics: undefined
                        });
                        return false;
                    }
                });
            } else {
                Notification.error({
                    message: '请上传jpg,jpeg,png 文件',
                    duration: 3
                });
                this.setState({
                    loading: false
                });
                return false;
            }
        },
        onChange: ({ file, fileList, event }) => {
            this.setState({
                loading: true
            });
        }
    };

    onRemove = (file) => {
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({
            TreePics: undefined
        });
        this.setState({
            fileList: []
        });
    }

    cancel = async () => {
        const {
            form: { setFieldsValue }
        } = this.props;
        await setFieldsValue({
            TreeName: undefined,
            TreeType: undefined,
            TreeSpecies: undefined,
            TreeMorphologicalCharacter: undefined,
            TreeHabit: undefined,
            NurseryParam: undefined,
            TreeParam: undefined,
            SamplingParamText: undefined,
            IsLocation: undefined,
            TreePics: undefined
        });

        this.setState({
            addVisible: false,
            fileList: [],
            picsSrc: '',
            treeParam: [],
            nurseryParam: [],
            samplingParam: [],
            loading: false
        });
    }

    save = async () => {
        const {
            actions: {
                postTreeType,
                getTreeTypeList,
                handleChangeTreeTypeStatus
            },
            form: { setFieldsValue },
            treeTypeList
        } = this.props;
        const {
            picsSrc = '',
            samplingParam = []
        } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                // 设置最新的树种编号
                let treeType = values.TreeType;
                let treeTypeArr = [];
                treeTypeList.map((item) => {
                    let no = item.TreeTypeNo;
                    let bigType = no.slice(0, 1);
                    if (Number(bigType) === Number(treeType)) {
                        treeTypeArr.push(no);
                    }
                });
                console.log('treeTypeArr', treeTypeArr);
                let bigNumber = 0;
                treeTypeArr.map((number) => {
                    if (Number(number) > bigNumber) {
                        bigNumber = Number(number);
                    }
                });
                console.log('bigNumber', bigNumber);
                let treeTypeNo = bigNumber + 1;
                console.log('treeTypeNo', treeTypeNo);
                let postData = {
                    'TreeTypeNo': treeTypeNo, // 树种编码  如4001
                    'TreeTypeName': values.TreeName,
                    'TreeTypeGenera': values.TreeSpecies, // 科属
                    'MorphologicalCharacter': values.TreeMorphologicalCharacter, // 形态特征
                    'GrowthHabit': values.TreeHabit, // 生长习性
                    'Pics': picsSrc, // 照片
                    'NurseryParam': this.changeArrToString(values.NurseryParam), // 苗圃测量参数
                    'TreeParam': this.changeArrToString(values.TreeParam), // 现场测量参数
                    'SamplingParam': this.changeArrToString(samplingParam), // 进场抽检参数
                    'IsLocation': values.IsLocation, // 是否需要定位
                    'HaveQRCode': values.IsLocation // 是否需要挂二维码
                };
                console.log('postData', postData);
                let rst = await postTreeType({}, postData);
                console.log('rst', rst);
                if (rst && rst.code && rst.code === 1) {
                    await setFieldsValue({
                        TreeName: undefined,
                        TreeType: undefined,
                        TreeSpecies: undefined,
                        TreeMorphologicalCharacter: undefined,
                        TreeHabit: undefined,
                        NurseryParam: undefined,
                        TreeParam: undefined,
                        SamplingParamText: undefined,
                        IsLocation: undefined,
                        TreePics: undefined
                    });
                    this.setState({
                        addVisible: false,
                        fileList: [],
                        picsSrc: '',
                        treeParam: [],
                        nurseryParam: [],
                        samplingParam: [],
                        loading: false
                    });
                    Notification.success({
                        message: '新增树种成功',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '新增树种失败',
                        duration: 3
                    });
                }
                await getTreeTypeList();
                await handleChangeTreeTypeStatus(true);
            }
        });
    }

    changeArrToString = (arrData) => {
        let stringData = '';
        if (arrData && arrData instanceof Array && arrData.length > 0) {
            arrData.map((param, index) => {
                if (index === 0) {
                    stringData = stringData + param;
                } else {
                    stringData = stringData + ',' + param;
                }
            });
        }
        return stringData;
    }
    // 树种校验
    checkTreeName = async (rule, value, callback) => {
        if (value) {
            // 匹配中文，英文字母和数字及下划线
            // let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            // if (reg.test(value)) {
            if (value.length > 10) {
                callback(`请输入10个字以下`);
            } else {
                callback();
            }
            // } else {
            //     callback(`请输入正确的树种名称`);
            // }
        } else {
            callback();
        }
    }
    // 科属校验
    checkTreeSpecies = async (rule, value, callback) => {
        if (value) {
            // 匹配中文，英文字母和数字及下划线
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
            if (reg.test(value)) {
                if (value.length > 10) {
                    callback(`请输入10个字以下`);
                } else {
                    callback();
                }
            } else {
                callback(`请输入正确的科属信息`);
            }
        } else {
            callback();
        }
    }
    // 形态特征校验
    checkTreeMorphologicalCharacter = async (rule, value, callback) => {
        if (value) {
            if (value.length > 200) {
                callback(`请输入200个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    // 习性校验
    checkTreeHabit = async (rule, value, callback) => {
        if (value) {
            if (value.length > 200) {
                callback(`请输入200个字以下`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    render () {
        const { addVisible = false } = this.state;

        const {
            form: { getFieldDecorator, getFieldValue }
        } = this.props;
        let treeParamValue = getFieldValue('TreeParam');
        let paramRequired = true;
        if (treeParamValue && treeParamValue instanceof Array && treeParamValue.length === 2) {
            if ((treeParamValue[0] === '密度' && treeParamValue[1] === '面积') || (treeParamValue[0] === '面积' && treeParamValue[1] === '密度')) {
                paramRequired = false;
            }
        }
        return (
            <div>
                <div style={{ float: 'right', marginBottom: 12 }}>
                    <Button type='primary' onClick={this.add.bind(this)}>
                        新增树种
                    </Button>
                </div>
                <Modal
                    title='新增树种'
                    width={920}
                    visible={addVisible}
                    maskClosable={false}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='树种名称:'
                                        >
                                            {getFieldDecorator('TreeName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入树种名称(10个字以下)'
                                                    },
                                                    {
                                                        validator: this.checkTreeName
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种名称(10个字以下)' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='类别:'
                                        >
                                            {getFieldDecorator('TreeType', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请选择树种类别'
                                                    }
                                                ]
                                            })(
                                                <Select placeholder='请选择树种类别'>
                                                    {
                                                        TREETYPENO.map((type) => {
                                                            return <Option
                                                                value={type.id}
                                                                key={type.name}>
                                                                {type.name}
                                                            </Option>;
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='科属:'
                                        >
                                            {getFieldDecorator('TreeSpecies', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入树种科属(10个字以下)'
                                                    },
                                                    {
                                                        validator: this.checkTreeSpecies
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种科属(10个字以下)' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='形态特征:'
                                        >
                                            {getFieldDecorator('TreeMorphologicalCharacter', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入树种形态特征(200个字以下)'
                                                    },
                                                    {
                                                        validator: this.checkTreeMorphologicalCharacter
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种形态特征(200个字以下)' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='习性:'
                                        >
                                            {getFieldDecorator('TreeHabit', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入树种习性(200个字以下)'
                                                    },
                                                    {
                                                        validator: this.checkTreeHabit
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种习性(200个字以下)' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='苗圃测量项:'
                                        >
                                            {getFieldDecorator('NurseryParam', {
                                                rules: [
                                                    {
                                                        required: paramRequired,
                                                        message: '请选择苗圃测量项'
                                                    }
                                                ]
                                            })(
                                                <Select
                                                    placeholder='请选择苗圃测量项'
                                                    mode='multiple'
                                                    disabled={!paramRequired}
                                                    onChange={this.handleNurseryParamChange.bind(this)}>
                                                    {
                                                        NURSERYPARAM.map((param) => {
                                                            return <Option
                                                                value={param}
                                                                key={param}>
                                                                {param}
                                                            </Option>;
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='现场测量项:'
                                        >
                                            {getFieldDecorator('TreeParam', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择现场测量项'
                                                    }
                                                ]
                                            })(
                                                <Select
                                                    placeholder='请选择现场测量项'
                                                    mode='multiple'
                                                    onChange={this.handleTreeParamChange.bind(this)}>
                                                    {
                                                        TREEPARAM.map((param) => {
                                                            return <Option
                                                                value={param}
                                                                key={param}>
                                                                {param}
                                                            </Option>;
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='抽检测量项:'
                                        >
                                            {getFieldDecorator('SamplingParamText', {
                                                rules: [
                                                    {
                                                        required: paramRequired,
                                                        message: '请选择苗圃测量项和现场测量项'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请选择苗圃测量项和现场测量项' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='是否需要挂牌:'
                                        >
                                            {getFieldDecorator('IsLocation', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择是否需要挂牌'
                                                    }
                                                ]
                                            })(
                                                <RadioGroup>
                                                    <Radio value={1} key={'是'}>是(即需要定位)</Radio>
                                                    <Radio value={0} key={'否'}>否(即不需要定位)</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...Addition.layout}
                                            label='树种图片:'
                                        >
                                            {getFieldDecorator('TreePics', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请上传图片'
                                                    }
                                                ]
                                            })(
                                                <Upload {...this.uploadProps}
                                                    onRemove={this.onRemove.bind(this)}
                                                    fileList={this.state.fileList}>
                                                    <Button>
                                                        <Icon type='upload' />
                                                        上传图片
                                                    </Button>
                                                </Upload>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Addition);

import React, { Component } from 'react';
import { TREETYPENO } from '_platform/api';
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
    Select,
    Radio,
    Notification
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class View extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            picsSrc: '',
            treeParam: [],
            nurseryParam: [],
            samplingParam: [],
            loading: false
        };
    }
    static layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
    };

    componentDidMount = async () => {
        const {
            record,
            form: { setFieldsValue }
        } = this.props;
        console.log('record', record);
        // 树种类别
        let TreeType = '1';
        let treeTypeName = '';
        if (record && record.TreeTypeNo) {
            TreeType = record.TreeTypeNo.slice(0, 1);
            TREETYPENO.map((type) => {
                if (type.id === TreeType) {
                    treeTypeName = type.name;
                }
            });
        }
        // 树种图片
        if (record && record.Pics) {
            let src = getForestImgUrl(record.Pics);
            let nameArr = record.Pics.split('/');
            let name = nameArr[nameArr.length - 1];
            let fileList = [{
                uid: '-1',
                name: name,
                status: 'done',
                url: src
            }];
            this.setState({
                fileList: fileList,
                picsSrc: record.Pics,
                loading: false
            });
            await setFieldsValue({
                TreePics: fileList
            });
        } else {
            await setFieldsValue({
                TreePics: undefined
            });
        }
        // 将苗圃测量信息转为数组，成为Select的每一项
        if (record && record.NurseryParam) {
            let nurseryParam = this.changeStringToArr(record.NurseryParam);
            await setFieldsValue({
                NurseryParam: nurseryParam
            });
            this.setState({
                nurseryParam
            });
        }
        // 将现场测量信息转为数组，成为Select的每一项
        if (record && record.TreeParam) {
            let treeParam = this.changeStringToArr(record.TreeParam);
            await setFieldsValue({
                TreeParam: treeParam
            });
            this.setState({
                treeParam
            });
        }
        // 将抽检测量信息转为数组，成为Select的每一项
        if (record && record.SamplingParam) {
            let samplingParam = this.changeStringToArr(record.SamplingParam);
            let samplingParamText = '';
            samplingParam.map((param, index) => {
                if (index === 0) {
                    samplingParamText = samplingParamText + param;
                } else {
                    samplingParamText = samplingParamText + '，' + param;
                }
            });
            await setFieldsValue({
                SamplingParamText: samplingParamText
            });
            this.setState({
                samplingParam
            });
        }

        await setFieldsValue({
            TreeName: record.TreeTypeName || '',
            TreeType: treeTypeName,
            TreeSpecies: record.TreeTypeGenera || '',
            TreeMorphologicalCharacter: record.MorphologicalCharacter || '',
            TreeHabit: record.GrowthHabit || '',
            IsLocation: record.IsLocation
        });
    }

    changeStringToArr = (stringData) => {
        try {
            let arrData = [];
            if (stringData) {
                arrData = stringData.split(',');
            }
            return arrData;
        } catch (e) {
            console.log('changeStringToArr', e);
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            viewVisible
        } = this.props;
        return (
            <div>
                <Modal
                    title='查看树种信息'
                    width={920}
                    visible={viewVisible}
                    onCancel={this.cancel.bind(this)}
                    footer={null}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='名称:'
                                        >
                                            {getFieldDecorator('TreeName', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入树种名称'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种名称' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='类别:'
                                        >
                                            {getFieldDecorator('TreeType', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message:
                                                            '请选择树种类别'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请选择树种类别' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='科属:'
                                        >
                                            {getFieldDecorator('TreeSpecies', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message:
                                                            '请输入树种科属'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种科属' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='形态特征:'
                                        >
                                            {getFieldDecorator('TreeMorphologicalCharacter', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入树种形态特征'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种形态特征' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='习性:'
                                        >
                                            {getFieldDecorator('TreeHabit', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入树种习性'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入树种习性' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='苗圃测量项:'
                                        >
                                            {getFieldDecorator('NurseryParam', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择苗圃测量项'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请选择苗圃测量项' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='现场测量项:'
                                        >
                                            {getFieldDecorator('TreeParam', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择现场测量项'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请选择现场测量项' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='抽检测量项:'
                                        >
                                            {getFieldDecorator('SamplingParamText', {
                                                rules: [
                                                    {
                                                        required: false,
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
                                            {...View.layout}
                                            label='是否需要挂牌:'
                                        >
                                            {getFieldDecorator('IsLocation', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择抽检测量项'
                                                    }
                                                ]
                                            })(
                                                <RadioGroup disabled >
                                                    <Radio value={1} key={'是'}>是(即需要定位)</Radio>
                                                    <Radio value={0} key={'否'}>否(即不需要定位)</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...View.layout}
                                            label='树种图片:'
                                        >
                                            {getFieldDecorator('TreePics', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请上传图片'
                                                    }
                                                ]
                                            })(
                                                <Upload {...this.uploadProps}
                                                    onRemove={this.onRemove.bind(this)}
                                                    fileList={this.state.fileList}>
                                                    <Button disabled >
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

    // 选择苗圃测量项
    handleNurseryParamChange = (values) => {
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
            actions: { changeViewVisible },
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
            fileList: [],
            picsSrc: '',
            treeParam: [],
            nurseryParam: [],
            samplingParam: [],
            loading: false
        });
        changeViewVisible(false);
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
}

export default Form.create()(View);

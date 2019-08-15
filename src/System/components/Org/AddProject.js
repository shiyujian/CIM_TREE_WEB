import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Notification,
    Spin,
    Button,
    Row,
    Cascader
} from 'antd';

const FormItem = Form.Item;

class AddProject extends Component {
    constructor (props) {
        super(props);
        this.state = {
            regionCodeList: [], // 行政区划option
            loading: false,
            regionCode: '',
            sectionList: []
        };
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    componentDidMount = async () => {
        const {
            actions: {
                getRegionCodes
            }
        } = this.props;
        const regionCodeList = JSON.parse(window.localStorage.getItem('RegionCodeList'));
        if (regionCodeList) {
            this.setState({
                regionCodeList
            });
        } else {
            // 获取行政区划编码
            let rst = await getRegionCodes();
            let regionCodeList = [];
            rst.map(item => {
                if (item.LevelType === '1') {
                    regionCodeList.push({
                        value: item.ID,
                        label: item.Name
                    });
                }
            });
            regionCodeList.map(item => {
                let arrCity = [];
                rst.map(row => {
                    if (row.LevelType === '2' && item.value === row.ParentId) {
                        arrCity.push({
                            value: row.ID,
                            label: row.Name
                        });
                    }
                });
                arrCity.map(row => {
                    let arrCounty = [];
                    rst.map(record => {
                        if (record.LevelType === '3' && row.value === record.ParentId) {
                            arrCounty.push({
                                value: record.ID,
                                label: record.Name
                            });
                        }
                    });
                    row.children = arrCounty;
                });
                item.children = arrCity;
            });
            window.localStorage.setItem('RegionCodeList', JSON.stringify(regionCodeList));
            this.setState({
                regionCodeList
            });
        }
    }

    handleChangeRegion (value) {
        console.log('value', value);
        let regionCode = value[value.length - 1];
        this.setState({
            regionCode
        });
    }

    save = async () => {
        const {
            actions: {
                postAddProject,
                getOrgTree,
                changeAddProjectVisible
            }
        } = this.props;
        const {
            regionCode
        } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                this.setState({
                    loading: true
                });
                let postData = {
                    ProjectName: values.name,
                    ProjectNo: values.code,
                    ParentID: '',
                    ProjectDescribe: values.remark,
                    ProjectType: '',
                    RegionCode: regionCode
                };

                let rst = await postAddProject({}, postData);
                console.log('rst', rst);
                if (rst && rst.code && rst.code === 1) {
                    await getOrgTree({});
                    this.setState({
                        loading: false
                    });
                    await changeAddProjectVisible(false);
                } else if (rst.msg && rst.msg.indexOf('项目名称已存在') !== -1) {
                    Notification.error({
                        message: `${rst.msg}`,
                        duration: 3
                    });
                    this.setState({
                        loading: false
                    });
                } else {
                    Notification.error({
                        message: '新增失败',
                        duration: 3
                    });
                    this.setState({
                        loading: false
                    });
                }
            }
        });
    }

    cancel = async () => {
        const {
            actions: {
                changeAddProjectVisible
            }
        } = this.props;
        await changeAddProjectVisible(false);
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            regionCodeList,
            loading
        } = this.state;

        return (
            <Modal
                title={`新建项目`}
                maskClosable={false}
                visible
                footer={null}
                closable={false}
            >
                <Spin spinning={loading}>
                    <div>
                        <FormItem {...AddProject.layout} label={`项目名称`}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入项目名称'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入项目名称'
                                />
                            )}
                        </FormItem>
                        <FormItem {...AddProject.layout} label={`项目编码`}>
                            {getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须为英文字母、数字以及 -_的组合',
                                        pattern: /^[\w\d\_\-]+$/
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入项目编码'
                                />
                            )}
                        </FormItem>
                        <FormItem {...AddProject.layout} label={`所在地区`}>
                            {getFieldDecorator('RegionCode', {
                                rules: [{
                                    required: true,
                                    message: '选择您所在的城市'
                                }]
                            })(
                                <Cascader placeholder='选择您所在的城市'
                                    options={regionCodeList}
                                    onChange={this.handleChangeRegion.bind(this)}
                                />
                            )}
                        </FormItem>
                        {/* <FormItem {...AddProject.layout} label={`项目类型`}>
                            {getFieldDecorator('projectType', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入项目类型'
                                    }
                                ]
                            })(
                                <Input
                                    readOnly
                                    placeholder='请输入项目类型'
                                />
                            )}
                        </FormItem>
                        <FormItem {...AddProject.layout} label={`项目说明`}>
                            {getFieldDecorator('remark', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入项目说明'
                                    }
                                ]
                            })(
                                <Input
                                    readOnly
                                    placeholder='请输入项目说明'
                                />
                            )}
                        </FormItem> */}

                        <Row style={{ marginTop: 10 }}>
                            <Button
                                key='submit'
                                type='primary'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.save.bind(this)}
                            >
                            确定
                            </Button>
                            <Button
                                key='back'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.cancel.bind(this)}>
                            关闭
                            </Button>
                        </Row>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(AddProject);

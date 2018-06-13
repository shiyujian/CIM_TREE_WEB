import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API, PROJECT_UNITS } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Popconfirm,
    DatePicker,
    Select
} from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Filter extends Component {
    static propTypes = {};

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
            parent: '',
            sectionArray: [],
            projectArray: []
        };
    }

    componentDidMount () {
        this.getSection();
    }

    async getSection () {
        let user = getUser();
        let projectArray = [];
        let sectionArray = [];
        let sections = user.sections;
        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                PROJECT_UNITS.map((item) => {
                    if (code[0] === item.code) {
                        projectArray.push(<Option key={item.value} value={item.value}>{item.value}</Option>);
                        let units = item.units;
                        units.map((unit) => {
                            sectionArray.push(<Option key={unit.code} value={unit.code}>{unit.value}</Option>);
                        });
                    }
                });
            }
        } else {
            PROJECT_UNITS.map((project) => {
                projectArray.push(<Option key={project.value} value={project.value}>{project.value}</Option>);
            });
        }
        this.setState({
            projectArray: projectArray,
            sectionArray: sectionArray
        });
    }
    // 项目选择函数
    onSelectChange (value) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            searcSection: ''
        });
        let sectionArray = [];
        PROJECT_UNITS.map((project) => {
            if (project.value === value) {
                let units = project.units;
                units.map((unit) => {
                    sectionArray.push(<Option key={unit.code} value={unit.code}>{unit.value}</Option>);
                });
            }
        });
        this.setState({
            sectionArray: sectionArray
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            Doc = [],
            selectDoc,
            parent
        } = this.props;
        const {
            projectArray,
            sectionArray
        } = this.state;

        // 判断选中的是哪个节点下的文件夹
        let canSection = false;
        if (selectDoc === '综合管理性文件' || parent === '综合管理性文件') {
            canSection = true;
        }

        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='项目'>
                                    {getFieldDecorator('searchProject', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择项目'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择项目'
                                            onChange={this.onSelectChange.bind(
                                                this
                                            )}
                                        >
                                            {projectArray}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {canSection ? (
                                ''
                            ) : (
                                <Col span={8}>
                                    <FormItem {...Filter.layout} label='标段'>
                                        {getFieldDecorator('searcSection', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择标段'
                                                }
                                            ]
                                        })(
                                            <Select placeholder='请选择标段'>
                                                {sectionArray}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            )}
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='名称'>
                                    {getFieldDecorator('searchName', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入名称'
                                            }
                                        ]
                                    })(<Input placeholder='请输入名称' />)}
                                </FormItem>
                            </Col>
                            {/* </Row>
						<Row> */}
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='编号'>
                                    {getFieldDecorator('searchCode', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入编号'
                                            }
                                        ]
                                    })(<Input placeholder='请输入编号' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='日期'>
                                    {getFieldDecorator('searchDate', {
                                        rules: [
                                            {
                                                type: 'array',
                                                required: false,
                                                message: '请选择日期'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            size='default'
                                            format='YYYY-MM-DD'
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={3} offset={1}>
                        <Row gutter={10}>
                            <FormItem>
                                <Button
                                    type='Primary'
                                    onClick={this.query.bind(this)}
                                >
                                    查询
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>
                                    清除
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        {!this.props.parent ? (
                            <Button style={{ marginRight: 10 }} disabled>
                                新增
                            </Button>
                        ) : (
                            <Button
                                style={{ marginRight: 10 }}
                                type='primary'
                                onClick={this.addVisible.bind(this)}
                            >
                                新增
                            </Button>
                        )}
                        {/* </Col> */}·
                        {/* <Col span ={2}> */}
                        {/* {
							(Doc.length === 0 )?
								<Button style={{marginRight: 10}} disabled>下载</Button>:
								<Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载</Button>
						} */}
                        {/* </Col> */}
                        {/* <Col span ={2}> */}
                        {Doc.length === 0 ? (
                            <Button
                                style={{ marginRight: 10 }}
                                disabled
                                type='danger'
                            >
                                删除
                            </Button>
                        ) : (
                            <Popconfirm
                                title='确定要删除文件吗？'
                                onConfirm={this.confirm.bind(this)}
                                onCancel={this.cancel.bind(this)}
                                okText='Yes'
                                cancelText='No'
                            >
                                <Button
                                    style={{ marginRight: 10 }}
                                    type='danger'
                                    onClick={this.delete.bind(this)}
                                >
                                    删除
                                </Button>
                            </Popconfirm>
                        )}
                    </Col>
                </Row>
            </Form>
        );
    }

    addVisible () {
        const {
            actions: {
                toggleAddition
            },
            currentSection,
            currentSectionName,
            projectName
        } = this.props;

        if (currentSection === '' && currentSectionName === '' && projectName === '') {
            message.error('该用户未关联标段，不能添加文档');
            return;
        }
        toggleAddition(true);
    }

    query () {
        const {
            actions: { searchEnginMessage, searchEnginVisible },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            let search = {};
            console.log('err', err);
            if (values.searchProject) {
                search.searchProject = values.searchProject.split('--')[1];
            }
            if (values.searcSection) {
                search.searcSection = values.searcSection;
            }
            if (values.searchName) {
                search.searchName = values.searchName;
            }
            if (values.searchDate) {
                search.searchDate_begin = moment(values.searchDate[0]._d)
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD');
                search.searchDate_end = moment(values.searchDate[1]._d)
                    .add(1, 'days')
                    .format('YYYY-MM-DD');
            }
            if (values.searchCode) {
                search.searchCode = values.searchCode;
            }
            // search = {
            // 	doc_name: values.searchName
            // };
            // getdocument({ code: currentcode.code }, search);

            let postData = Object.assign({}, search);
            searchEnginMessage(postData);
            searchEnginVisible(true);
        });
    }
    clear () {
        const {
            actions: { searchEnginMessage }
        } = this.props;
        this.props.form.setFieldsValue({
            searchProject: undefined,
            searcSection: undefined,
            searchName: undefined,
            searchDate: undefined,
            searchCode: undefined
        });
        searchEnginMessage({});
    }
    cancel () {}

    delete () {
    }
    confirm () {
        const {
            coded = [],
            selected = [],
            currentcode = {},
            actions: { deletedoc, getdocument }
        } = this.props;
        if (selected === undefined || selected.length === 0) {
            message.warning('请先选择要删除的文件！');
            return;
        }
        selected.map(rst => {
            coded.push(rst.code);
        });
        let promises = coded.map(function (code) {
            return deletedoc({ code: code });
        });
        message.warning('删除文件中...');
        Promise.all(promises)
            .then(() => {
                message.success('删除文件成功！');
                getdocument({ code: currentcode.code }).then(() => {});
            })
            .catch(() => {
                message.error('删除失败！');
                getdocument({ code: currentcode.code }).then(() => {});
            });
    }
    createLink = (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    download () {
        const {
            selected = [],
            file = [],
            files = []
        } = this.props;
        if (selected.length === 0) {
            message.warning('没有选择无法下载');
        }
        selected.map(rst => {
            file.push(rst.basic_params.files);
        });
        file.map(value => {
            value.map(cot => {
                files.push(cot.download_url);
            });
        });
        files.map(down => {
            let download =
                STATIC_DOWNLOAD_API + '/media' + down.split('/media')[1];
            this.createLink(this, download);
        });
    }
}
export default Form.create()(Filter);

import React, { Component, Children } from 'react';
import {
    Button,
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select,
    Table
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const FormItem = Form.Item;
const Option = Select.Option;

class MergeCarPackModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            loading: false,
            dataSource: []
        };
    }
    FormItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    FormItemLayout1 = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
    };
    columns = [
        {
            title: '序号',
            dataIndex: 'order'
        },
        {
            title: '车牌号',
            dataIndex: 'LicensePlate'
        },
        {
            title: '项目',
            dataIndex: 'Project'
        },
        {
            title: '标段',
            dataIndex: 'sectionName'
        },
        {
            title: '苗木类型',
            dataIndex: 'IsShrub',
            render: (text, record) => {
                if (text === 0) {
                    return <p>乔灌</p>;
                } else {
                    return <p>地被</p>;
                }
            }
        },
        {
            title: '苗木规格',
            dataIndex: 'Standard',
            render: text => {
                if (text === '') {
                    return <p> / </p>;
                } else {
                    return <p>{text}</p>;
                }
            }
        },
        {
            title: '创建时间',
            render: (text, record) => {
                const { liftertime1 = '', liftertime2 = '' } = record;
                return (
                    <div>
                        <div>{liftertime1}</div>
                        <div>{liftertime2}</div>
                    </div>
                );
            }
        },
        {
            title: '总数',
            dataIndex: 'NurseryNum'
        },
        {
            title: '操作',
            render: (text, record) => {
                return (
                    <a
                        href='javascript:;'
                    >
                        选择
                    </a>
                );
            }
        }
    ];
    componentDidMount = async () => {

    }
    handleMergeCarPackOk = () => {
        this.props.onMergeCarPackModalCancel();
    }
    handleMergeCarPackCancel = () => {
        this.props.onMergeCarPackModalCancel();
    }
    projectSelect = (value) => {
        const {
            platform: { tree = {} }
        } = this.props;
        console.log('value', value);
        let treeList = tree.bigTreeList;
        let sectionsList = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    sectionsList = treeData.children;
                }
            });
        }
        this.setState({
            sectionsList
        });
    }
    query = async () => {
        const {
            form: {
                validateFields
            },
            actions: {
                getcarpackage,
                getForestUserDetail
            },
            keycode = '',
            platform: { tree = {} }
        } = this.props;
        validateFields(async (err, values) => {
            console.log('values', values);
            console.log('err', err);
            if (!err) {
                try {
                    let thinClassTree = tree.thinClassTree;
                    let postdata = {
                        licenseplate: values.carNumber,
                        section: values.section
                    };

                    this.setState({
                        loading: true
                    });
                    let rst = await getcarpackage({}, postdata);
                    this.setState({
                        loading: false
                    });
                    if (!rst) return;
                    let dataSource = rst.content;
                    if (dataSource instanceof Array) {
                        for (let i = 0; i < dataSource.length; i++) {
                            let plan = dataSource[i];
                            plan.order = i + 1;
                            plan.liftertime1 = plan.CreateTime
                                ? moment(plan.CreateTime).format('YYYY-MM-DD')
                                : '/';
                            plan.liftertime2 = plan.CreateTime
                                ? moment(plan.CreateTime).format('HH:mm:ss')
                                : '/';
                            plan.Project = await getProjectNameBySection(plan.Section, thinClassTree);
                            plan.sectionName = await getSectionNameBySection(plan.Section, thinClassTree);
                            let userData = await getForestUserDetail({id: plan.Constructioner});
                            plan.ConstructionerName = (userData && userData.Full_Name) || '';
                            plan.ConstructionerUserName = (userData && userData.User_Name) || '';
                            plan.SupervisorName = (plan.SupervisorUser && plan.SupervisorUser.Full_Name) || '';
                            plan.SupervisorUserName = (plan.SupervisorUser && plan.SupervisorUser.User_Name) || '';
                        }
                        this.setState({ dataSource });
                    }
                } catch (e) {
                    console.log('qury', e);
                }
            }
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            platform: { tree = {} }
        } = this.props;
        const {
            sectionsList = [],
            dataSource = []
        } = this.state;
        let bigTreeList = tree.bigTreeList || [];
        return (
            <Modal
                width={850}
                title='车辆包合并'
                visible
                maskClosable={false}
                onOk={this.handleMergeCarPackOk.bind(this)}
                onCancel={this.handleMergeCarPackCancel.bind(this)}
            >
                <div>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='车牌号'
                                >
                                    {getFieldDecorator(
                                        'carNumber',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入车牌号'
                                                }
                                            ]
                                        }
                                    )(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='状态'
                                >
                                    {getFieldDecorator(
                                        'status',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择状态'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        <Option key={'未打包'} value={'0'} title={'未打包'}>
                                            未打包
                                        </Option>
                                        <Option key={'已打包'} value={'1'} title={'已打包'}>
                                            已打包
                                        </Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='项目'
                                >
                                    {getFieldDecorator(
                                        'project',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择项目'
                                                }
                                            ]
                                        }
                                    )(<Select onSelect={this.projectSelect.bind(this)}>
                                        {
                                            bigTreeList.map((project) => {
                                                return <Option key={project.No} value={project.No}>
                                                    {project.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='标段'
                                >
                                    {getFieldDecorator(
                                        'section',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择标段'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        {
                                            sectionsList.map((section) => {
                                                return <Option key={section.No} value={section.No}>
                                                    {section.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...MergeCarPackModal.FormItemLayout1} >
                                    {getFieldDecorator('button', {
                                    })(
                                        <div>
                                            <Button
                                                type='primary'
                                                style={{marginLeft: 30}}
                                                onClick={this.query.bind(this, 1)}
                                            >
                                                        查询
                                            </Button>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        bordered
                        columns={this.columns}
                        rowKey='order'
                        loading={{
                            spinning: this.state.loading
                        }}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }
}

export default Form.create()(MergeCarPackModal);

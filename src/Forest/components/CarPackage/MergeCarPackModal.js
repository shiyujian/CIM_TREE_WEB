import React, { Component, Children } from 'react';
import {
    Button,
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select,
    Table,
    DatePicker,
    Notification,
    Radio,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class MergeCarPackModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            loading: false,
            dataSource: [],
            stime: '',
            etime: '',
            pagination: {},
            dataChecked: '',
            selectRecord: ''
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
            render: (text) => {
                if (text === 0) {
                    return <p>乔灌</p>;
                } else {
                    return <p>地被</p>;
                }
            }
        },
        {
            title: '创建时间',
            render: (text, record) => {
                const { liftertime1 = '', liftertime2 = '' } = record;
                return (
                    <div style={{verticalAlign: 'middle'}}>
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
                const {
                    dataChecked
                } = this.state;
                let checked = false;
                if (record.ID === dataChecked) {
                    checked = true;
                }
                return (
                    <Radio
                        onChange={this.handleDataChecked.bind(this, record)}
                        checked={checked} />
                );
            }
        }
    ];
    componentDidMount = async () => {

    }
    handleDataChecked = async (record) => {
        const {
            dataChecked
        } = this.state;
        if (record && record.ID) {
            if (dataChecked === record.ID) {
                this.setState({
                    dataChecked: '',
                    selectRecord: ''
                });
            } else {
                this.setState({
                    dataChecked: record.ID,
                    selectRecord: record
                });
            }
        }
    }
    handleMergeCarPackOk = async () => {
        const {
            dataChecked
        } = this.state;
        const {
            actions: {
                putMergeCarPack
            },
            currentRecord
        } = this.props;
        try {
            if (dataChecked && currentRecord && currentRecord.ID) {
                let postData = {
                    'CorrectPackId': dataChecked,
                    'ErrorPackId': currentRecord.ID
                };
                let data = await putMergeCarPack({}, postData);
                console.log('data', data);
                if (data && data.code === 1) {
                    Notification.success({
                        message: '车辆包合并成功',
                        duration: 3
                    });
                    await this.props.onMergeCarPackModalOk();
                } else {
                    Notification.error({
                        message: '车辆包合并失败',
                        duration: 3
                    });
                }
            } else {
                Notification.error({
                    message: '未选中车辆包，不能进行合并',
                    duration: 3
                });
            }
        } catch (e) {
            console.log('handleMergeCarPackOk', e);
        }
    }
    handleMergeCarPackCancel = () => {
        this.props.onMergeCarPackModalCancel();
    }
    projectSelect = (value) => {
        const {
            platform: { tree = {} },
            form: {
                setFieldsValue
            }
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
        setFieldsValue({
            section: ''
        });
        this.setState({
            sectionsList
        });
    }
    handleDatePick = async (value) => {
        console.log('value', value);
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }
    // 翻页
    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    // 查询
    query = async (page) => {
        const {
            form: {
                validateFields
            },
            actions: {
                getcarpackage
            },
            platform: { tree = {} }
        } = this.props;
        const {
            stime,
            etime
        } = this.state;
        validateFields(async (err, values) => {
            console.log('values', values);
            console.log('err', err);
            if (!err) {
                try {
                    if (!values.section && !values.carNumber) {
                        Notification.info({
                            message: '请选择项目及标段信息或输入车牌号'
                        });
                        return;
                    }
                    let thinClassTree = tree.thinClassTree;
                    let postdata = {
                        licenseplate: values.carNumber || '',
                        section: values.section || '',
                        isshrub: values.isShrub || '',
                        stime: stime && moment(stime).format('YYYY-MM-DD HH:mm:ss'),
                        etime: etime && moment(etime).format('YYYY-MM-DD HH:mm:ss'),
                        page,
                        size: 10
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
                        }
                        const pagination = { ...this.state.pagination };
                        pagination.total = rst.pageinfo.total;
                        pagination.pageSize = 10;
                        this.setState({
                            dataSource,
                            pagination
                        });
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
            platform: { tree = {} },
            currentRecord
        } = this.props;
        const {
            sectionsList = [],
            dataSource = [],
            selectRecord,
            dataChecked
        } = this.state;
        let bigTreeList = tree.bigTreeList || [];
        return (
            <Modal
                width={1000}
                title='车辆包合并'
                visible
                maskClosable={false}
                footer={null}
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
                                                    required: false,
                                                    message: '请输入车牌号'
                                                }
                                            ]
                                        }
                                    )(<Input allowClear />)}
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
                                                    required: false,
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
                                                    required: false,
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
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='状态'
                                >
                                    {getFieldDecorator(
                                        'isShrub',
                                        {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择状态'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        <Option key={'未打包'} value={0} title={'未打包'}>
                                            未打包
                                        </Option>
                                        <Option key={'已打包'} value={1} title={'已打包'}>
                                            已打包
                                        </Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem
                                    {...this.FormItemLayout}
                                    label='创建时间'
                                >
                                    {getFieldDecorator(
                                        'time',
                                        {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择创建时间'
                                                }
                                            ]
                                        }
                                    )(<RangePicker
                                        style={{
                                            verticalAlign: 'middle',
                                            width: '100%'
                                        }}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format={'YYYY/MM/DD HH:mm:ss'}
                                        onChange={this.handleDatePick.bind(this)}
                                    />)}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...MergeCarPackModal.FormItemLayout1} >
                                    {getFieldDecorator('button', {
                                    })(
                                        <div>
                                            <Button
                                                type='primary'
                                                style={{marginLeft: 30}}
                                                onClick={this.handleTableChange.bind(this, {current: 1})}
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
                        onChange={this.handleTableChange.bind(this)}
                        pagination={this.state.pagination}
                    />
                    <Row style={{marginTop: 20}}>
                        <div style={{float: 'right'}}>
                            <Button
                                type='primary'
                                style={{marginLeft: 30}}
                                onClick={this.handleMergeCarPackCancel.bind(this)}
                            >
                            取消
                            </Button>
                            {
                                dataChecked && currentRecord && currentRecord.LicensePlate
                                    ? <Popconfirm
                                        style={{wordWrap: 'break-word'}}
                                        title={
                                            <div>
                                                <p>{`确定将 ${currentRecord.LicensePlate}(${currentRecord.Section}) 中的 ${selectRecord.NurseryNum} 棵`}</p>
                                                <p>{`苗木移动至 ${selectRecord.LicensePlate}(${selectRecord.Section}) 中,`}</p>
                                                <p>{`同时清除 ${currentRecord.LicensePlate} 么`}</p>
                                            </div>
                                        }
                                        onConfirm={this.handleMergeCarPackOk.bind(this)}
                                        okText='确认'
                                        cancelText='取消'
                                    >
                                        <Button
                                            type='primary'
                                            style={{marginLeft: 30}}
                                        >
                                        确定
                                        </Button>
                                    </Popconfirm>
                                    : <Button
                                        disabled
                                        style={{marginLeft: 30}}
                                    >
                                        确定
                                    </Button>
                            }

                        </div>
                    </Row>
                </div>
            </Modal>
        );
    }
}

export default Form.create()(MergeCarPackModal);

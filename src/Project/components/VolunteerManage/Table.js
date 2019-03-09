import React, {Component} from 'react';
import { Form, Input, Button, Table, Select, Pagination, Modal, message, Row, Col, Spin } from 'antd';
import { formItemLayout } from '_platform/auth';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayoutSXM = {
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 24 }
    }
};

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            smallClassData: [], // 所有小班
            thinClassData: [], // 所有细班
            page: 1,
            total: 0,
            name: 1,
            section: '', // 搜索条件-标段
            SXM: '', // 搜索条件-二维码
            valueSXM: '', // 顺序码
            TextAreaSXM: '', // 顺序码序列
            status: '', // 搜索条件-状态
            No: '', // 搜索条件-证书号
            photoUrl: '',
            showModal: false,
            showPhotoModal: false,
            spinning: true // 加载中
        };
        this.onSearch = this.onSearch.bind(this);
        this.onSection = this.onSection.bind(this);
        this.onSXM = this.onSXM.bind(this);
        this.onNo = this.onNo.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSmallClass = this.handleSmallClass.bind(this);
        this.handleThinClass = this.handleThinClass.bind(this);
        this.onSee = this.onSee.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.toAddSXM = this.toAddSXM.bind(this);
        this.columns = [
            {
                title: '标段',
                key: '0',
                dataIndex: 'Section'
            }, {
                title: '小班',
                key: '1',
                dataIndex: 'SmallClass'
            }, {
                title: '细班',
                key: '2',
                dataIndex: 'ThinClass'
            }, {
                title: '二维码',
                key: '3',
                dataIndex: 'SXM'
            }, {
                title: '树种',
                key: '4',
                dataIndex: 'TreeType',
                render: (text, record) => {
                    let str = '';
                    this.props.treetypelist.map(item => {
                        if (item.ID === text) {
                            str = item.TreeTypeName;
                        }
                    });
                    return <span>{str}</span>;
                }
            }, {
                title: '状态',
                key: '5',
                dataIndex: 'Status',
                render: (text, record) => {
                    let str = '已栽植';
                    if (text === 0) {
                        str = '未栽植';
                    }
                    return <span>{str}</span>;
                }
            }, {
                title: '照片',
                key: '6',
                dataIndex: 'Photo',
                render: (text) => {
                    return (<a onClick={this.onSee.bind(this, text)}>查看</a>);
                }
            }, {
                title: '证书编号',
                key: '7',
                dataIndex: 'No'
            }
        ];
    }
    componentDidMount () {
        this.onSearch();
    }
    render () {
        let { sectionsData, treetypelist } = this.props;
        let { dataList, showModal, showPhotoModal, total, page, smallClassData, thinClassData, photoUrl, valueSXM, TextAreaSXM, spinning } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (<div className='Tablelevel'>
            <Form layout='inline'>
                <FormItem
                    label='标段'
                >
                    <Select style={{ width: 150 }} placeholder='请选择标段' onChange={this.onSection.bind(this)} allowClear>
                        {
                            sectionsData.map(item => {
                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                            })
                        }
                    </Select>
                </FormItem>
                <FormItem
                    label='二维码'
                >
                    <Input placeholder='请输入二维编码' onChange={this.onSXM.bind(this)} />
                </FormItem>
                <FormItem
                    label='证书号'
                >
                    <Input placeholder='请输入证书号' onChange={this.onNo.bind(this)} />
                </FormItem>
                <FormItem
                    label='状态'
                >
                    <Select style={{ width: 150 }} onChange={this.handleStatus.bind(this)} allowClear>
                        <Option value={0}>未栽植</Option>
                        <Option value={1}>已栽植</Option>
                    </Select>
                </FormItem>
                <FormItem
                >
                    <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                </FormItem>
                <FormItem
                >
                    <Button type='primary' onClick={this.onAdd.bind(this)}>新增</Button>
                </FormItem>
            </Form>
            <Spin spinning={spinning}>
                <Table columns={this.columns} dataSource={dataList} style={{marginTop: 10}} pagination={false} rowKey='ID' />
            </Spin>
            <Pagination total={total} current={page} pageSize={10} style={{marginTop: 10}} onChange={this.handlePage.bind(this)} />
            <Modal
                title='新增' visible={showModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label='标段'
                            >
                                {getFieldDecorator('Section', {
                                })(
                                    <Select style={{ width: 180 }} placeholder='请选择标段' onChange={this.handleSmallClass}>
                                        {
                                            sectionsData.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label='小班'
                            >
                                {getFieldDecorator('SmallClass', {
                                })(
                                    <Select style={{ width: 180 }} placeholder='请选择小班' onChange={this.handleThinClass}>
                                        {
                                            smallClassData.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label='细班'
                            >
                                {getFieldDecorator('ThinClass', {
                                })(
                                    <Select style={{ width: 180 }} placeholder='请选择细班'>
                                        {
                                            thinClassData.map(item => {
                                                return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label='树种'
                            >
                                {getFieldDecorator('TreeType', {
                                })(
                                    <Select style={{ width: 180 }} placeholder='请选择树木类型'>
                                        {
                                            treetypelist.map(item => {
                                                return <Option value={item.ID} key={item.ID}>{item.TreeTypeName}</Option>;
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label='二维码'
                            >
                                <Input style={{ width: 320 }} placeholder='请填写7位二维码，依次添加' value={valueSXM} onChange={this.handleInputSXM.bind(this)} />
                                <Button style={{position: 'absolute', right: -90, top: -6}} onClick={this.toAddSXM.bind(this)}>添加</Button>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                {...formItemLayoutSXM}
                            >
                                <TextArea rows={4} style={{width: 500}} value={TextAreaSXM} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal title='新增' visible={showPhotoModal}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                style={{textAlign: 'center'}}
            >
                <img width={400} height={200} src={photoUrl} />
            </Modal>
        </div>);
    }
    handleInputSXM (e) {
        this.setState({
            valueSXM: e.target.value
        });
    }
    toAddSXM () {
        let { valueSXM, TextAreaSXM } = this.state;
        if (!TextAreaSXM) {
            this.setState({
                TextAreaSXM: valueSXM,
                valueSXM: ''
            });
        } else {
            this.setState({
                TextAreaSXM: TextAreaSXM + ',' + valueSXM,
                valueSXM: ''
            });
        }
    }
    onSee (photoUrl) {
        this.setState({
            showPhotoModal: true,
            photoUrl
        });
    }
    onSearch (page = 1) {
        const { getVolunteertrees } = this.props.actions;
        let { section, SXM, No, status } = this.state;
        this.setState({
            spinning: true
        });
        getVolunteertrees({}, {
            creater: '',
            sxm: SXM,
            openid: '',
            status,
            no: No,
            section,
            stime: '',
            etime: '',
            page,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                console.log(rep.content, 'dataList');
                this.setState({
                    dataList: rep.content,
                    page: rep.pageinfo.page,
                    total: rep.pageinfo.total,
                    spinning: false
                });
            }
        });
    }
    onSection (value) {
        this.setState({
            section: value || ''
        });
    }
    onSXM (e) {
        this.setState({
            SXM: e.target.value
        });
    }
    onNo (e) {
        this.setState({
            No: e.target.value
        });
    }
    handleStatus (value) {
        this.setState({
            status: value === undefined ? '' : value
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    handleOk () {
        const { postInitvolunteertree } = this.props.actions;
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            let pro = [];
            let arrSXM = this.state.TextAreaSXM.split(',');
            arrSXM.map(item => {
                pro.push({
                    SXM: item,
                    TreeType: values.TreeType,
                    Section: values.Section,
                    SmallClass: values.SmallClass,
                    ThinClass: values.ThinClass,
                    Creater: 12
                });
            });
            postInitvolunteertree({}, pro).then(rep => {
                if (rep.code === 1) {
                    message.success('新增成功');
                    this.props.form.resetFields();
                    this.handleCancel();
                    this.onSearch();
                }
            });
        });
    }
    handleCancel () {
        this.setState({
            showModal: false,
            showPhotoModal: false
        });
    }
    handleSmallClass (value) {
        let smallClassData = [];
        const { sectionsData } = this.props;
        sectionsData.map(item => {
            if (item.No === value) {
                smallClassData = item.children;
            }
        });
        this.setState({
            smallClassData
        });
    }
    handleThinClass (value) {
        let thinClassData = [];
        const { smallClassData } = this.state;
        smallClassData.map(item => {
            if (item.No === value) {
                thinClassData = item.children;
            }
        });
        this.setState({
            thinClassData
        });
    }
    handlePage (page) {
        this.onSearch(page);
    }
}

export default Form.create()(Tablelevel);

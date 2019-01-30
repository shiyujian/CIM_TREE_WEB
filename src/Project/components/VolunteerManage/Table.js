import React, {Component} from 'react';
import { Form, Input, Button, Table, Select, Pagination, Modal } from 'antd';
import { formItemLayout } from '_platform/auth';
import { message } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            page: 1,
            total: 0,
            name: 1,
            section: '',
            SXM: '',
            No: '',
            showModal: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.onSection = this.onSection.bind(this);
        this.onSXM = this.onSXM.bind(this);
        this.onNo = this.onNo.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.columns = [
            {
                title: '标段',
                key: '1',
                dataIndex: 'Section'
            }, {
                title: '小班',
                key: '2',
                dataIndex: 'SmallClass'
            }, {
                title: '细班',
                key: '3',
                dataIndex: 'ThinClass'
            }, {
                title: '树种',
                key: '4',
                dataIndex: 'TreeType'
            }, {
                title: '状态',
                key: '5',
                dataIndex: 'Status'
            }, {
                title: '照片',
                key: '6',
                dataIndex: 'Photo'
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
        let { dataList, showModal, total, page } = this.state;
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.actions);
        return (<div className='Tablelevel'>
            <Form layout='inline'>
                <FormItem
                    label='标段'
                >
                    <Input placeholder='请输入标段编号' onChange={this.onSection.bind(this)} />
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
                    <Select style={{ width: 120 }} onChange={this.handleStatus.bind(this)}>
                        <Option value={0}>未栽植</Option>
                        <Option value={1}>已栽植</Option>
                    </Select>
                </FormItem>
                <FormItem
                >
                    <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                </FormItem>
                <FormItem
                >
                    <Button type='primary' onClick={this.onAdd.bind(this)}>新增</Button>
                </FormItem>
            </Form>
            <Table columns={this.columns} dataSource={dataList} style={{marginTop: 10}} pagination={false} rowKey='ID' />
            <Pagination total={total} current={page} pageSize={10} style={{marginTop: 10}} />
            <Modal
                title='' visible={showModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label='标段'
                    >
                        {getFieldDecorator('Section', {
                        })(
                            <Input placeholder='请选择标段' />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='小班'
                    >
                        {getFieldDecorator('SmallClass', {
                        })(
                            <Input placeholder='请选择标段' />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='细班'
                    >
                        {getFieldDecorator('ThinClass', {
                        })(
                            <Input placeholder='请选择细班' />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='二维码'
                    >
                        {getFieldDecorator('SXM', {
                        })(
                            <Input placeholder='请填写二维码' />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='树木类型'
                    >
                        {getFieldDecorator('TreeType', {
                        })(
                            <Input placeholder='请选择树木类型' />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>);
    }
    onSearch () {
        const { getVolunteertrees } = this.props.actions;
        let { section, SXM, No } = this.state;
        getVolunteertrees({}, {
            creater: '',
            sxm: SXM,
            openid: '',
            status: '',
            no: No,
            section: section,
            stime: '',
            etime: '',
            page: 1,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    dataList: rep.content,
                    page: rep.pageinfo.page,
                    total: rep.pageinfo.total
                });
            }
        });
    }
    onSection (e) {
        console.log(e.target.value);
        this.setState({
            section: e.target.value
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
            status: value
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
            let pro = [{
                SXM: values.SXM,
                TreeType: values.TreeType,
                Section: values.Section,
                SmallClass: values.SmallClass,
                ThinClass: values.ThinClass,
                Creater: 12
            }];
            postInitvolunteertree({}, pro).then(rep => {
                if (rep.code === 1) {
                    message.success('新增成功');
                }
            });
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
}

export default Form.create()(Tablelevel);

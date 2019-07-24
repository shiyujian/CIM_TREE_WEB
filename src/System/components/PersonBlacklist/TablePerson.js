import React, { Component } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Popconfirm,
    Input,
    Progress,
    Select,
    Form,
    message
} from 'antd';
import './TableOrg.css';
const { Option } = Select;
const FormItem = Form.Item;
class TablePerson extends Component {
    // export default class TablePerson extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            selectData: [],
            tempData: [],
            tempDatas: [],
            fristTempData: [],

            loading: false,
            percent: 0,
            pagination: {},
            fristPagination: {},
            pages: '',
            serialNumber: {},
            btn: false,
            value: '',
            isUpdate: false,
            projectTree: {}
        };
    }
    async componentDidMount () {
        this.setState({ loading: true });
        const {
            actions: { getUsers }
        } = this.props;
        let rst = await getUsers({}, { isblack: 1 });
        let persons = [];
        let dataPerson = [];
        if (rst && rst.code && rst.code === 200) {
            persons = (rst && rst.content) || [];
            let pagination = {
                current: 1,
                total: rst.pageinfo.total
            };
            this.setState({
                pagination: pagination
            });
            dataPerson = persons.map((item, index) => {
                item.index = index + 1;
                return item;
            });
        }
        this.setState({
            dataSource: dataPerson,
            tempData: dataPerson,
            loading: false
        });
    }
    getProjectName = (section) => {
        const {
            platform: { tree = {} }
        } = this.props;
        try {
            let data = (tree && tree.bigTreeList) || [];
            let sectionArr = section.split('-');
            let projectName = '';
            if (sectionArr && sectionArr instanceof Array && sectionArr.length > 0) {
                let prjectNo = sectionArr[0];
                data.map((item) => {
                    if (item && item.No === prjectNo) {
                        projectName = item.Name;
                    }
                });
            }
            return projectName;
        } catch (e) {
            console.log('getProjectName', e);
        }
    }
    sectiontitle (section) {
        const {
            platform: { tree = {} }
        } = this.props;
        let data = (tree && tree.bigTreeList) || [];
        let sectione = '';
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            for (let j = 0; j < item.children.length; j++) {
                const element = item.children[j];
                if (section === element.No) {
                    sectione = element.Name;
                }
            }
        }
        return sectione;
    }
    querys () {
        const {
            tempData
        } = this.state;
        let searchList = [];
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            tempData.map(item => {
                let isName = false;
                let isTitle = false;
                let iscc = false;
                if (!values.names) {
                    isName = true;
                } else {
                    if (item.Full_Name) {
                        if (
                            values.names &&
                            item.Full_Name.indexOf(values.names) > -1
                        ) {
                            isName = true;
                        }
                    }
                }
                if (!values.is_num) {
                    iscc = true;
                } else {
                    if (item.Number) {
                        if (
                            values.is_num &&
                            item.Number.indexOf(values.is_num) > -1
                        ) {
                            iscc = true;
                        }
                    }
                }
                if (!values.usernamet) {
                    isTitle = true;
                } else {
                    if (
                        values.usernamet &&
                        item.User_Name.indexOf(values.usernamet) > -1
                    ) {
                        isTitle = true;
                    }
                }
                if (isName && isTitle && iscc) {
                    searchList.push(item);
                }
            });
            this.setState({
                tempDatas: searchList,
                isUpdate: true
            });
        });
    }
    clears () {
        this.props.form.setFieldsValue({
            usernamet: undefined,
            is_num: undefined,
            names: undefined
        });
        this.setState({
            isUpdate: false
        });
    }
    getUniqueIdNum = (dataSourceb) => {
        let numArr = [];
        let IdNumList = [];
        dataSourceb.map((rst, index) => {
            if (IdNumList.indexOf(rst.Number) === -1) {
                numArr.push({
                    Number: rst.Number,
                    Full_Name: rst.Full_Name,
                    black_remark: rst.black_remark || ''
                });
                IdNumList.push(rst.Number);
            }
        });
        return numArr;
    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            tempData,
            tempDatas,
            isUpdate
        } = this.state;
        let usersArr = [];

        let dataSourceb;
        if (isUpdate) {
            dataSourceb = tempDatas;
        } else {
            dataSourceb = tempData;
        }
        let numArr = this.getUniqueIdNum(dataSourceb);
        numArr.map((rst, index) => {
            usersArr.push({
                children: [],
                Number: rst.Number,
                Full_Name: rst.Full_Name,
                black_remark: rst.black_remark,
                key: (rst.Number).toString()
            });
        });
        usersArr.map((ess, i) => {
            tempData.map((item, j) => {
                if (ess.Number === item.Number) {
                    item.key = item.ID;
                    ess.children.push(item);
                }
            });
        });
        console.log('usersArr', usersArr);
        const columns = [
            {
                title: '序号',
                width: '5%',
                render: (text, record, index) => {
                    if (record.id) {
                        const current = this.state.serialNumber.current;
                        const pageSize = this.state.serialNumber.pageSize;
                        if (current !== undefined && pageSize !== undefined) {
                            return index + 1 + (current - 1) * pageSize;
                        } else {
                            return index + 1;
                        }
                    }
                }
            },
            {
                title: '姓名',
                width: '5%',
                dataIndex: 'Full_Name'
            },
            {
                title: '身份证号',
                dataIndex: 'Number',
                width: '10%',
                key: 'Number'
            },
            // {
            //     title: '原因',
            //     width: '10%',
            //     dataIndex: 'black_remark',
            //     key: 'black_remark'
            // },
            {
                title: '用户名',
                dataIndex: 'User_Name',
                width: '10%',
                key: 'User_Name'
            },
            {
                title: '性别',
                width: '5%',
                dataIndex: 'Sex',
                render: (text, record) => {
                    return record.Sex ? '女' : '男';
                }
            },
            {
                title: '手机号码',
                dataIndex: 'Phone',
                width: '10%',
                key: 'Phone'
            },
            {
                title: '项目',
                width: '8%',
                render: (text, record, index) => {
                    if (record.Section) {
                        return this.getProjectName(record.Section);
                    }
                }
            },

            {
                title: '标段',
                dataIndex: 'Section',
                width: '8%',
                key: 'Section',
                render: (text, record, index) => {
                    if (record.Section) {
                        return this.sectiontitle(record.Section);
                    }
                }
            },
            {
                title: '角色',
                width: '8%',
                render: record => {
                    if (record.Roles && record.Roles instanceof Array && record.Roles.length > 0) {
                        if (record.Roles[0].RoleName) {
                            return record.Roles[0].RoleName;
                        }
                    }
                }
            },
            {
                title: '职务',
                dataIndex: 'Duty',
                width: '8%',
                key: 'Duty'
            },
            {
                title: '移除黑名单',
                key: 'Edit',
                render: record => {
                    if (record.ID) {
                        return (
                            '/'
                        );
                    } else {
                        return (
                            <span>
                                <Popconfirm
                                    title='是否真的要移除黑名单?'
                                    onConfirm={this.confirm.bind(this, record)}
                                    okText='Yes'
                                    cancelText='No'
                                >
                                    <a type='primary'>移除</a>
                                </Popconfirm>
                            </span>
                        );
                    }
                }
            }
        ];
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='姓名'>
                                    {getFieldDecorator('names', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入姓名'
                                            }
                                        ]
                                    })(<Input placeholder='请输入姓名' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='身份证号'>
                                    {getFieldDecorator('is_num', {})(
                                        <Input placeholder='请输入身份证号' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='用户名'>
                                    {getFieldDecorator('usernamet', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入用户名'
                                            }
                                        ]
                                    })(<Input placeholder='请输入用户名' />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row />
                    </Col>
                    <Col span={2} offset={1}>
                        <Button icon='search' onClick={this.querys.bind(this)}>
                            查找
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button icon='reload' onClick={this.clears.bind(this)}>
                            清空
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    bordered
                    dataSource={usersArr}
                    loading={{
                        tip: (
                            <Progress
                                style={{ width: 200 }}
                                percent={this.state.percent}
                                status='active'
                                strokeWidth={5}
                            />
                        ),
                        spinning: this.state.loading
                    }}
                />
            </div>
        );
    }
    confirm = async (record) => {
        const {
            actions: { postForestUserBlackList }
        } = this.props;
        try {
            console.log('record', record);
            this.setState({ loading: true });
            let blackPostData = {
                id: record.children[0].id,
                is_black: 0,
                black_remark: '',
                change_all: true
            };
            let rst = await postForestUserBlackList({}, blackPostData);
            console.log('rst111111111111', rst);
            let tempDatas = [];
            this.state.tempData.map(item => {
                if (rst && rst.code && rst.code === 1) {
                    message.success('移除成功');
                    if (item.Number !== record.Number) {
                        tempDatas.push(item);
                    }
                } else {
                    message.warn('移除失败');
                    tempDatas = this.state.tempData;
                }
            });
            this.setState({
                tempData: tempDatas,
                loading: false
            });
            this.querys();
        } catch (e) {
            console.log('confirm', e);
        }
    }
}
export default Form.create()(TablePerson);

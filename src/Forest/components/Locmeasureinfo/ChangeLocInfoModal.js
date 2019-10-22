import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Modal,
    Select,
    Radio,
    Popconfirm,
    Spin,
    message,
    Notification
} from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ChangeLocInfoModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            smallClassList: [],
            thinClassList: [],
            changeLocInfoModalLoading: false,
            allTableDataSource: [],
            allTableDataSXMList: [],
            // 设置选中的标段，小班，细班值
            sectionSelected: '',
            smallClassSelected: '',
            thinClassSelected: ''
        };
    }
    componentDidMount = async () => {
        const {
            form: {
                setFieldsValue
            },
            platform: {
                tree = {}
            },
            example,
            changeLocInfoAllStatus
        } = this.props;
        try {
            if (changeLocInfoAllStatus) {
                await this.getQueryTreeData();
            }
            if (example) {
                let project = '';
                let section = (example && example.Section) || '';
                let smallClass = (example && example.SmallClass) || '';
                let thinClass = (example && example.ThinClass) || '';
                // 因api中的标段 小班 细班只存在一个code，不是完整的code 所以需要进行存储
                let sectionSelected = (example && example.Section) || '';
                let smallClassSelected = (example && example.SmallClass) || '';
                let thinClassSelected = (example && example.ThinClass) || '';
                if (section) {
                    if (smallClass) {
                        smallClass = section + '-' + smallClass;
                    }
                    if (smallClass && thinClass) {
                        thinClass = smallClass + '-' + thinClass;
                    }
                    let sectionList = section.split('-');
                    if (sectionList && sectionList instanceof Array && sectionList.length > 0) {
                        project = sectionList[0];
                        let treeList = tree.thinClassTree;
                        let sectionsList = [];
                        let smallClassList = [];
                        let thinClassList = [];
                        if (project) {
                            treeList.map((treeData) => {
                                if (project === treeData.No) {
                                    sectionsList = treeData.children;
                                }
                            });
                        }
                        if (sectionsList && sectionsList instanceof Array && sectionsList.length > 0) {
                            sectionsList.map((treeData) => {
                                if (section === treeData.No) {
                                    smallClassList = treeData.children;
                                }
                            });
                        }
                        if (smallClassList && smallClassList instanceof Array && smallClassList.length > 0) {
                            smallClassList.map((treeData) => {
                                if (smallClass === treeData.No) {
                                    thinClassList = treeData.children;
                                }
                            });
                        }
                        this.setState({
                            sectionsList,
                            smallClassList,
                            thinClassList
                        });
                    }
                }
                this.setState({
                    sectionSelected,
                    smallClassSelected,
                    thinClassSelected
                });
                setFieldsValue({
                    project: project,
                    section: section,
                    smallClass: smallClass,
                    thinClass: thinClass,
                    // treeType: (example && example.TreeType) || '',
                    treeType: '',
                    GD: '',
                    GF: '',
                    XJ: '',
                    DJ: '',
                    TQZJ: '',
                    TQHD: ''
                });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    getQueryTreeData = async () => {
        const {
            actions: {
                getqueryTree
            },
            postData
        } = this.props;
        try {
            this.setState({
                changeLocInfoModalLoading: true
            });
            let getAllPostData = Object.assign({}, postData);
            getAllPostData.page = 1;
            getAllPostData.size = 500;
            let data = await getqueryTree({}, getAllPostData);
            console.log('data', data);
            if (data && data.content && data.content.length > 0) {
                let content = data.content;
                let allTableDataSXMList = [];
                for (let i = 0; i < content.length; i++) {
                    allTableDataSXMList.push(content[i].ZZBM);
                }
                this.setState({
                    changeLocInfoModalLoading: false,
                    allTableDataSource: content,
                    allTableDataSXMList
                });
            } else {
                this.setState({
                    changeLocInfoModalLoading: false,
                    allTableDataSource: [],
                    allTableDataSXMList: []
                });
                message.error('获取全部数据失败，请重新查找数据');
                this.props.onCancel();
            }
        } catch (e) {
            console.log('getQueryTreeData', e);
        }
    }
    handleChangeLocInfoOk = () => {
        const {
            form: {
                validateFields
            },
            actions: {
                putChangeLocInfo
            },
            selectedRowSXM,
            changeLocInfoAllStatus,
            example
        } = this.props;
        const {
            sectionSelected,
            smallClassSelected,
            thinClassSelected,
            allTableDataSXMList
        } = this.state;
        try {
            let sxmList = [];
            if (changeLocInfoAllStatus) {
                sxmList = allTableDataSXMList;
            } else {
                sxmList = selectedRowSXM;
            }
            console.log('sectionSelected', sectionSelected);
            console.log('smallClassSelected', smallClassSelected);
            console.log('thinClassSelected', thinClassSelected);
            console.log('sxmList', sxmList);
            validateFields(async (err, values) => {
                console.log('values', values);
                if (!err) {
                    let postData = {
                        'XJ': values.XJ,
                        'GD': values.GD,
                        'GF': values.GF,
                        'DJ': values.DJ,
                        'TQZJ': values.TQZJ,
                        'TQHD': values.TQHD,
                        'TreeType': values.treeType,
                        'Section': sectionSelected,
                        'SmallClass': smallClassSelected,
                        'ThinClass': thinClassSelected,
                        'Supervisor': example.Supervisor,
                        'ZZBM': sxmList
                    };
                    console.log('postData', postData);
                    let data = await putChangeLocInfo({}, postData);
                    console.log('data', data);
                    if (data && data.code === 1) {
                        Notification.success({
                            message: '修改现场测量信息成功',
                            duration: 3
                        });
                        await this.props.onChangeLocInfoOk();
                    } else {
                        if (data.msg === '修改前后树种的现场测量参数不一致，不允许进行树种修改！') {
                            Notification.error({
                                message: '修改前后树种的现场测量参数不一致，不允许进行树种修改！',
                                duration: 3
                            });
                        } else {
                            Notification.error({
                                message: '修改现场测量信息失败',
                                duration: 3
                            });
                        }
                    }
                }
            });
        } catch (e) {
            console.log('handleChangeLocInfoOk', e);
        }
    }
    handleChangeInfoCancel = () => {
        this.props.onChangeLocInfoCancel();
    }
    // 选择项目
    projectSelect = (value) => {
        const {
            platform: { tree = {} },
            form: {
                setFieldsValue
            }
        } = this.props;
        console.log('value', value);
        let treeList = tree.thinClassTree;
        let sectionsList = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    sectionsList = treeData.children;
                }
            });
        }
        setFieldsValue({
            section: '',
            smallClass: '',
            thinClass: ''
        });
        this.setState({
            sectionsList
        });
    }
    // 选择标段
    sectionSelect = (value) => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        const {
            sectionsList
        } = this.state;
        try {
            let smallClassList = [];
            if (value) {
                let data = value.split('-');
                if (data && data instanceof Array && data.length === 3) {
                    sectionsList.map((section) => {
                        if (value === section.No) {
                            smallClassList = section.children;
                        }
                    });
                    this.setState({
                        sectionSelected: value
                    });
                } else {
                    setFieldsValue({
                        section: ''
                    });
                }
            }
            setFieldsValue({
                smallClass: '',
                thinClass: ''
            });
            this.setState({
                smallClassList
            });
        } catch (e) {
            console.log('sectionSelect', e);
        }
    }
    // 选择小班
    smallClassSelect = (value) => {
        const {
            smallClassList
        } = this.state;
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        try {
            let thinClassList = [];
            if (value) {
                let data = value.split('-');
                if (data && data instanceof Array && data.length === 4) {
                    smallClassList.map((smallClass) => {
                        if (value === smallClass.No) {
                            thinClassList = smallClass.children;
                        }
                    });
                    this.setState({
                        smallClassSelected: data[3]
                    });
                } else {
                    setFieldsValue({
                        smallClass: ''
                    });
                }
            }
            setFieldsValue({
                thinClass: ''
            });
            this.setState({
                thinClassList
            });
        } catch (e) {
            console.log('smallClassSelect', e);
        }
    }
    thinClassSelect = async (value) => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        try {
            if (value) {
                let data = value.split('-');
                if (data && data instanceof Array && data.length === 5) {
                    this.setState({
                        thinClassSelected: data[4]
                    });
                } else {
                    setFieldsValue({
                        thinClass: ''
                    });
                }
            }
        } catch (e) {
            console.log('thinClassSelect', e);
        }
    }
    render () {
        const {
            form: { getFieldDecorator },
            platform: { tree = {} },
            treetypes,
            selectedRowSXM,
            changeLocInfoAllStatus
        } = this.props;
        const {
            sectionsList = [],
            smallClassList = [],
            thinClassList = [],
            changeLocInfoModalLoading = false,
            allTableDataSXMList = []
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let thinClassTree = tree.thinClassTree;
        let sxmList = [];
        if (changeLocInfoAllStatus) {
            sxmList = allTableDataSXMList;
        } else {
            sxmList = selectedRowSXM;
        }
        return (
            <Modal
                width={1100}
                title='修改信息'
                visible
                maskClosable={false}
                footer={null}
                onCancel={this.handleChangeInfoCancel.bind(this)}
            >
                <div>
                    <Spin spinning={changeLocInfoModalLoading}>
                        <Form>
                            <Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
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
                                                    thinClassTree.map((project) => {
                                                        return <Option key={project.No} value={project.No}>
                                                            {project.Name}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
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
                                            )(<Select onSelect={this.sectionSelect.bind(this)}>
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
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='小班'
                                        >
                                            {getFieldDecorator(
                                                'smallClass',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择小班'
                                                        }
                                                    ]
                                                }
                                            )(<Select onSelect={this.smallClassSelect.bind(this)}>
                                                {
                                                    smallClassList.map((smallClass) => {
                                                        return <Option key={smallClass.No} value={smallClass.No}>
                                                            {smallClass.Name}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='细班'
                                        >
                                            {getFieldDecorator(
                                                'thinClass',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择细班'
                                                        }
                                                    ]
                                                }
                                            )(<Select onSelect={this.thinClassSelect.bind(this)}>
                                                {
                                                    thinClassList.map((thinClass) => {
                                                        return <Option key={thinClass.No} value={thinClass.No}>
                                                            {thinClass.Name}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='树种'
                                        >
                                            {getFieldDecorator(
                                                'treeType',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择树种'
                                                        }
                                                    ]
                                                }
                                            )(<Select allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }>
                                                {
                                                    treetypes.map((type) => {
                                                        return <Option key={type.ID} value={type.ID}>
                                                            {type.TreeTypeName}
                                                        </Option>;
                                                    })
                                                }
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='高度'
                                        >
                                            {getFieldDecorator(
                                                'GD',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择高度'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='冠幅'
                                        >
                                            {getFieldDecorator(
                                                'GF',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择冠幅'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='胸径'
                                        >
                                            {getFieldDecorator(
                                                'XJ',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择胸径'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='地径'
                                        >
                                            {getFieldDecorator(
                                                'DJ',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择地径'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='土球直径'
                                        >
                                            {getFieldDecorator(
                                                'TQZJ',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择土球直径'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='土球厚度'
                                        >
                                            {getFieldDecorator(
                                                'TQHD',
                                                {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '请选择土球厚度'
                                                        }
                                                    ]
                                                }
                                            )(<RadioGroup>
                                                <Radio value={'/100'}>/100</Radio>
                                                <Radio value={'/10'}>/10</Radio>
                                                <Radio value={''}>1</Radio>
                                                <Radio value={'*10'}>x10</Radio>
                                                <Radio value={'*100'}>x100</Radio>
                                            </RadioGroup>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Row>
                        </Form>
                        <Row style={{marginTop: 20}}>
                            <div style={{float: 'right'}}>
                                <Button
                                    type='primary'
                                    style={{marginLeft: 30}}
                                    onClick={this.handleChangeInfoCancel.bind(this)}
                                >
                            取消
                                </Button>
                                {
                                    sxmList && sxmList instanceof Array && sxmList.length > 0
                                        ? <Popconfirm
                                            title={`此次修改共有 ${sxmList.length} 条信息产生变化，确定修改么`}
                                            onConfirm={this.handleChangeLocInfoOk.bind(this)}
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
                    </Spin>
                </div>

            </Modal>
        );
    }
}

export default Form.create()(ChangeLocInfoModal);

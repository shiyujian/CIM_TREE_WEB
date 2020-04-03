import React, { Component } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
    Input,
    Select,
    Form,
    Popconfirm,
    InputNumber,
    Notification,
    Divider,
    DatePicker,
    Modal
} from 'antd';
import MmChartList from './MmChartList';
import {getFieldValue} from '_platform/store/util';
import {getProjectNameBySection, getSectionNameBySection} from '_platform/gisAuth';
import {
    getUser
} from '_platform/auth';
import moment from 'moment';
import './distribute.less';
import mmewm from './img/mmewm.jpg';
import down from './img/down.png';
import close from './img/close.png';
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class TableList extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
            dataListFacility: [], // 设施列表
            isMmApply: false, // 苗木二维码申请
            isYlApply: false, // 园林二维码申请
            DistributeVisible: false,   //派发单弹出框
            distributeRow:{
                proj: '',   //项目
                section: '',//标段
                num: '',    //生产数量
                no: '',     //派发号段
                unit: '',   //申请单位
                user: '',   //申请人
                time: '',   //申请时间
                url: '',    //标牌照片
                isgarden: '', //苗木还是园林设施
            }, //派发单相关数据
        };
        this._mmqueryParams = {};
    }
    componentDidMount () {

    }
    onYlApply () {
        this.setState({
            isYlApply: true
        });
    }
    onYlBack () {
        this.setState({
            isYlApply: false
        });
    }
    onMmQuery () {
        if (this.props.mmquery) {
            this.props.mmquery(this._mmqueryParams);
        }
    }
    onMmClean () {
        this.props.form.resetFields();
        this.props.mmquery();
        this._mmqueryParams = {};
    }
    changeFormField (key, event) {
        let value = getFieldValue(event);

        if (key === 'mmstatus') {
            this._mmqueryParams['mmstatus'] = value;
        }
        if (key === 'mmtime') {
            this._mmqueryParams['mmstime'] = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            this._mmqueryParams['mmetime'] = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (key === 'mmProjct') {
            this._mmqueryParams['mmProjct'] = value;
        }
    }
    onMmApply () {
        this.setState({
            isMmApply: true
        });
    }
    onMmBack () {
        this.setState({
            isMmApply: false
        });
    }
    handleMmSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    actions: {postQrcode}
                } = this.props;
                let data = {
                    GardenType: 0, // 附属设施类型，如果是苗木则为0
                    PlanNum: values.PlanNum,
                    Remark: values.Remark,
                    IsGarden: 0, // 是否园林设施  1是 0否
                    Applier: this.props.userid, // 申请人
                    ConstructUnit: this.props.org, // 申请单位
                    Section: this.props.section, // 标段
                    BelongSystem: '雄安森林大数据平台'
                };
                postQrcode({}, data).then((res) => {
                    if (res.code === 1) {
                        Notification.success({
                            message: '苗木二维码申请成功'
                        });
                        this.onMmBack();
                        this.props.reloadList();
                    } else {
                        Notification.error({
                            message: res.msg
                        });
                    }
                });
            }
        });
    };
    render () {
        const {
            platform: { tree = {} },
            form: {
                getFieldDecorator
            },
            section
        } = this.props;
        let bigTreeList = (tree && tree.bigTreeList) || [];
        let qrcodelist = this.props.qrcodelist; // 获取列表数据
        let mmqrcodelist = this.props.mmqrcodelist; // 获取苗木数据
        if (qrcodelist) {
            qrcodelist.sort((a, b) => { // 表格数据按时间降序排列
                return Date.parse(b.ApplyTime) - Date.parse(a.ApplyTime);
            });
        }
        if (mmqrcodelist) {
            mmqrcodelist.sort((a, b) => { // 表格数据按时间降序排列
                return Date.parse(b.ApplyTime) - Date.parse(a.ApplyTime);
            });
        }
        let dk = this.props.section;
        let sections = this.props.section;
        let projectList = this.props.projectList;
        if (projectList.length > 0 && dk) {
            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].No === dk.split('-')[0]) {
                    dk = projectList[i].Name;
                    let list = projectList[i].children;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].No === sections) {
                            sections = list[j].Name;
                        }
                    }
                }
            }
        }
        return <div>
            <MmChartList
                projectList={this.props.projectList}
                mmqrcodestat={this.props.mmqrcodestat}
                mmqrcodestatcount={this.props.mmqrcodestatcount}
                mmstorenum={this.props.mmstorenum}
            />
            {!this.state.isMmApply
                ? <div>
                    <div style={{marginTop: 10, height: 32}}>
                        <div style={{float: 'left', marginLeft: 20}}>苗木二维码派发列表</div>
                        {this.props.isApply
                            ? <Button
                                type='primary'
                                style={{
                                    float: 'right',
                                    marginRight: 20,
                                    marginTop: -10,
                                    cursor: 'pointer'
                                }}
                                onClick={this.onMmApply.bind(this)}>
                                申请
                            </Button>
                            : ''
                        }
                    </div>
                    <Form>
                        <Row>
                            {
                                !section
                                    ? <Col span={6}>
                                        <FormItem {...TableList.layout} label='项目'>
                                            {
                                                getFieldDecorator('mmProject', {
                                                })(
                                                    <Select
                                                        placeholder='请选择项目'
                                                        onChange={this.changeFormField.bind(this,
                                                            'mmProjct')}
                                                    >
                                                        {
                                                            bigTreeList.map((project) => {
                                                                return <Option value={project.No} key={project.No} title={project.Name}>
                                                                    {project.Name}
                                                                </Option>;
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                        </FormItem>
                                    </Col> : ''
                            }
                            <Col span={6}>
                                <FormItem {...TableList.layout} label='状态'>
                                    {
                                        getFieldDecorator('mmstatus', {
                                        })(
                                            <Select
                                                placeholder='请选择审核状态'
                                                onChange={this.changeFormField.bind(this,
                                                    'mmstatus')}
                                            >
                                                <Option value='-1'>待审核</Option>
                                                <Option value='0'>未通过</Option>
                                                <Option value='1'>通过</Option>
                                            </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...TableList.layout} label='申请时间'>
                                    {
                                        getFieldDecorator('mmtime', {
                                        })(
                                            <RangePicker showTime onChange={this.changeFormField.bind(this,
                                                'mmtime')} />
                                        )}
                                </FormItem>
                            </Col>
                            <Button type='primary' style={{float: 'right', marginRight: 20, cursor: 'pointer'}} onClick={this.onMmQuery.bind(this)}>查询</Button>
                            <Button type='primary' style={{float: 'right', marginRight: 10, cursor: 'pointer'}} onClick={this.onMmClean.bind(this)}>清除</Button>
                        </Row>
                    </Form>
                    <Table
                        columns={this.columnsNursery}
                        dataSource={mmqrcodelist}
                        rowKey='ID'
                    />
                </div>
                : <div>
                    <div style={{marginTop: 10, height: 32}}>
                        <div style={{float: 'left', marginLeft: 20}}>苗木二维码申请</div>
                        {this.props.isApply
                            ? <Button type='primary' style={{float: 'right', marginRight: 20, marginTop: -10}} disabled>申请</Button>
                            : ''
                        }
                    </div>
                    <Form onSubmit={this.handleMmSubmit}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='地块'>
                                    <Input disabled value={dk} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='标段'>
                                    <Input disabled value={sections} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='计划栽植量'>
                                    {
                                        getFieldDecorator('PlanNum', {
                                            rules: [{ required: true, message: '请填写计划栽植量!' }]
                                        })(
                                            <InputNumber
                                                min={1}
                                                max={1000000}
                                                onChange={this.changeFormField.bind(this, 'PlanNum')} />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...TableList.layout} label='备注'>
                                    {
                                        getFieldDecorator('Remark', {
                                        })(
                                            <TextArea
                                                onChange={this.changeFormField.bind(this, 'Remark')}
                                                rows={4}
                                                style={{
                                                    width: 'calc(100% * 4 - 50px)',
                                                    maxWidth: 'calc(100% * 4 - 50px)'
                                                }} />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <FormItem>
                                    <Button type='primary' style={{marginRight: 20, cursor: 'pointer'}} onClick={this.onMmBack.bind(this)}>返回</Button>
                                    <Button type='primary' htmlType='submit' style={{cursor: 'pointer'}}>提交</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            }
            <Modal
                    title=""
                    width='720px'
                    visible={this.state.DistributeVisible}
                    footer={null}
                    wrapClassName={'distribute'}
                    closable = {false}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <div>
                        <h1 style={{ textAlign: 'center' }}>派发单</h1>
                        <a title="下载派发单" onClick={this.onDowm.bind(this)} style={{position:'absolute',top:'30px',right:'20px'}}><img src={down}></img></a>
                        {/*<a title="关闭" onClick={this.handleCancel.bind(this)} style={{position:'absolute',top:'470px',left:'270px'}}><img src={close}></img></a>*/}
                        <Form style={{marginTop: '60px'}}>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='项目名称' {...TableList.layout}>
                                        {this.state.distributeRow.proj}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='申请单位' {...TableList.layout}>
                                        {this.state.distributeRow.unit}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='标&nbsp;&nbsp;&nbsp;&nbsp;段&nbsp;&nbsp;&nbsp;' {...TableList.layout}>
                                        {this.state.distributeRow.section}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='申&nbsp;请&nbsp;人&nbsp;' {...TableList.layout}>
                                        {this.state.distributeRow.user}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='生产数量' {...TableList.layout}>
                                        {this.state.distributeRow.num}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='申请时间' {...TableList.layout}>
                                        {this.state.distributeRow.time}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='派发号段' {...TableList.layout}>
                                        {this.state.distributeRow.no}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='标牌照片' {...TableList.layout}>
                                        <img src={this.state.distributeRow.url} style={{width: '161px', height: '117px', textAlign: 'center'}} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
        </div>;
    }
    columnsNursery = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '地块',
            dataIndex: 'Section',
            key: 'dk',
            render: text => {
                const {
                    platform: { tree = {} }
                } = this.props;
                let thinClassTree = [];
                if (tree && tree.thinClassTree) {
                    thinClassTree = tree.thinClassTree;
                    let projectName = getProjectNameBySection(text, thinClassTree);
                    if (projectName) {
                        return projectName;
                    } else {
                        return text;
                    }
                } else {
                    let projectList = this.props.projectList;
                    if (text) {
                        if (projectList.length > 0) {
                            for (let i = 0; i < projectList.length; i++) {
                                if (projectList[i].No === text.split('-')[0]) {
                                    text = projectList[i].Name;
                                }
                            }
                        }
                    }
                    return text;
                }
            }
        },
        {
            title: '标段',
            dataIndex: 'Section',
            key: 'bd',
            render: text => {
                const {
                    platform: { tree = {} }
                } = this.props;
                let thinClassTree = [];
                if (tree && tree.thinClassTree) {
                    thinClassTree = tree.thinClassTree;
                    let sectionName = getSectionNameBySection(text, thinClassTree);
                    if (sectionName) {
                        return sectionName;
                    } else {
                        return text;
                    }
                } else {
                    let projectList = this.props.projectList;
                    if (text) {
                        if (projectList.length > 0) {
                            for (let i = 0; i < projectList.length; i++) {
                                if (projectList[i].No === text.split('-')[0]) {
                                    let list = projectList[i].children;
                                    for (let j = 0; j < list.length; j++) {
                                        if (list[j].No === text) {
                                            text = list[j].Name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return text;
                }
            }
        },
        {
            title: '计划栽植量',
            dataIndex: 'PlanNum'
        },
        {
            title: '标段库存量',
            dataIndex: 'StockNum'
        },
        {
            title: '实际派发总量',
            dataIndex: 'DistributeNum'
        },
        {
            title: '申请人',
            dataIndex: 'ApplierObj.Full_Name'
        },
        {
            title: '申请时间',
            dataIndex: 'ApplyTime'
        },
        {
            title: '审核状态',
            dataIndex: 'Status',
            render: text => {
                if (text || text === 0) {
                    if (text === -1) {
                        text = '待审核';
                    } else if (text === 0) {
                        text = '未通过';
                    } else if (text === 1) {
                        text = '通过';
                    }
                }
                return text;
            }
        },
        {
            title: '操作',
            dataIndex: 'active',
            render: (text, record, index) => {
                let userInfo = getUser();
                let arr = [<a onClick={this.onMmDetails.bind(this, record)}>详情</a>];
                if (record.Status === 1) {
                    arr.push(
                        <Divider type='vertical' />,
                        <a
                            onClick={this.onDistribute.bind(this, record.ID)}
                        >
                            派发单
                        </a>
                    );
                }
                if (record.Status === -1 && ((this.props.isExamine) || this.props.isadmin)) {
                    arr.push(
                        <Divider type='vertical' />,
                        <a
                            onClick={this.onMmCheck.bind(this, record)}
                        >
                            审核
                        </a>
                    );
                }
                if (userInfo.username === 'admin') {
                    arr.push(
                        <Divider type='vertical' />,
                        <Popconfirm
                            title='请确认是否删除？'
                            onConfirm={this.handleDelete.bind(this, record.ID)}
                            okText='是'
                            cancelText='否'
                        >
                            <a>
                                删除
                            </a>
                        </Popconfirm>
                    );
                }
                return (<div>
                    {arr}
                </div>);
            }
        }
    ];
    handleDelete (ID) {
        const {
            actions: { deleteQrcode }
        } = this.props;
        deleteQrcode({
            ID: ID
        }).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除成功'
                });
                this.props.mmquery();
            } else {
                Notification.error({
                    message: '删除失败，请联系管理员解决'
                });
            }
        });
    }
    onMmDetails (record) {
        this.props.onVisibleView('mmxq', record.ID);
    }
    onMmCheck (record) {
        this.props.onExamine('mm', record.ID);
    }
    activeKeyChange (key) {
        this.props.changeTabs(key);
        this.onMmClean();
    }
    onDistribute (ID) {   //派发单弹出框
        const {actions: {getQrcodeDetail}} = this.props;
        getQrcodeDetail({ID: ID})
            .then((data) => {
                let projectList = this.props.projectList;
                let distributeRow = this.state.distributeRow;
                if (data.Section) {
                    if (projectList.length > 0) {
                        for (let i = 0; i < projectList.length; i++) {
                            if (projectList[i].No === data.Section.split('-')[0]) {
                                distributeRow.proj = projectList[i].Name;
                                let list = projectList[i].children;
                                for (let j = 0; j < list.length; j++) {
                                    if (list[j].No === data.Section) {
                                        distributeRow.section = list[j].Name;
                                    }
                                }
                            }
                        }
                    }
                } 
                distributeRow.num = data.PlanNum;
                distributeRow.no = data.Distributes ? data.Distributes[0].StartNo + ' - ' + data.Distributes[0].EndNo : '';
                distributeRow.unit = data.ConstructUnit;
                distributeRow.user = data.ApplierObj ? data.ApplierObj.Full_Name : '';
                distributeRow.time = data.ApplyTime;
                distributeRow.isgarden = data.IsGarden;  //用来区分园林设施和苗木照片缩放大小
                distributeRow.url = mmewm;
                
                this.setState({
                    DistributeVisible:true,
                    distributeRow: distributeRow
                })
            });
    }
    handleCancel(){
        this.setState({
            DistributeVisible:false,
            distributeRow: {}
        })
    }
    onDowm(){  //下载派发单

    }
};
export default Form.create()(TableList);


import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table, Input, Modal, Upload, Icon, InputNumber, message } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';
import './PurchaseDetails.less';
import { getForestImgUrl } from '_platform/auth';

const Dragger = Upload.Dragger;
class PurchaseDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            purchaseInfo: null,
            ProjectName: '', // 项目名称
            Section: '', // 标段
            StartTime: '', // 开始时间
            EndTime: '', // 截止时间
            UseNurseryAddress: '', // 用苗地址
            Specs: [], // 采购品种
            projectList: [], // 项目标段列表
            Contacter: '',
            Phone: '',
            organizationName: '', // 组织机构名称
            showModal: false, // 上传弹框
            showSeeModal: false, // 查看弹框
            PurchaseSpecID: '', // 规格id
            fileList: [], // 文件列表
            OfferFiles: '' // 文件url
        };
        this.purchaseid = ''; // 采购单ID
        this.org_code = ''; // 组织机构code
        this.grouptype = ''; // 本用户组类型
        this.toReturn = this.toReturn.bind(this); // 返回
        this.toOffer = this.toOffer.bind(this); // 我要报价
        this.handleOk = this.handleOk.bind(this); // 完成上传
        this.handleCancel = this.handleCancel.bind(this); // 取消上传
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOrgTree_new, getOfferInventoryById } = this.props.actions;
        this.purchaseid = this.props.purchaseDetailsKey;
        // 获得登陆用户的 苗圃基地/供应商的code
        const userData = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (userData && userData.account && userData.groups.length > 0) {
            userData.groups.map(item => {
                if (item.grouptype === 0 || item.grouptype === 6) {
                    this.grouptype = item.grouptype;
                }
            });
            this.org_code = userData.account.org_code;
        }
        // 根据ID采购单详情
        getPurchaseById({id: this.purchaseid}).then((rep) => {
            rep.Specs.map(item => {
                CULTIVATIONMODE.map(row => {
                    if (item.CultivationMode === row.id) {
                        item.name = row.name;
                    }
                });
                item.childrenList = [];
            });
            // 根据采购单ID获取报价清单
            getOfferInventoryById({}, {
                supplier: this.grouptype === 6 ? this.org_code : '',
                nurserybase: this.grouptype === 0 ? this.org_code : '',
                purchaseid: this.purchaseid
            }).then(rst => {
                rst.map(item => {
                    item.DetailOfferSpecs.map(row => {
                        rep.Specs.map(record => {
                            if (row.ID === record.ID) {
                                record.childrenList.push({
                                    isSave: true,
                                    key: 0,
                                    ID: row.ID,
                                    SOID: row.SOID,
                                    OfferFiles: row.OfferFiles,
                                    OfferNum: row.OfferNum,
                                    Source: row.Source,
                                    SpecDescribe: row.SpecDescribe,
                                    Price: row.Price
                                });
                            }
                        });
                    });
                });
                console.log(rep.Specs, '规格数据');
                this.setState({
                    Specs: rep.Specs
                });
            });
            this.setState({
                purchaseInfo: rep,
                ProjectName: rep.ProjectName,
                Section: rep.Section,
                StartTime: rep.StartTime.split(' ')[0],
                EndTime: rep.EndTime.split(' ')[0],
                UseNurseryAddress: rep.UseNurseryAddress,
                Contacter: rep.Contacter,
                Phone: rep.Phone,
                OfferNun: rep.OfferNun,
                CreaterOrg: rep.CreaterOrg,
                TreeTypes: rep.TreeTypes
            });
            // 获取发布单位名称
            getOrgTree_new({code: rep.CreaterOrg}).then(rep => {
                this.setState({
                    organizationName: rep.name
                });
            });
        });
        // 获得所有项目
        getWpunittree().then(rep => {
            this.setState({
                projectList: rep
            });
        });
    }
    columns = [
        {
            title: '到货单价',
            key: '1',
            dataIndex: 'Price',
            render: (text, record, index) => record.isSave ? <span>{text}</span> : <Input style={{width: 100}} onChange={this.toEditOff.bind(this, record, 'Price')} />
        }, {
            title: '数量',
            key: '2',
            dataIndex: 'OfferNum',
            render: (text, record, index) => record.isSave ? <span>{text}</span> : <InputNumber min={1} max={record.Max} style={{width: 100}} onChange={this.toEditOffValue.bind(this, record, 'OfferNum')} />
        }, {
            title: '苗源地',
            key: '3',
            dataIndex: 'Source',
            render: (text, record, index) => record.isSave ? <span>{text}</span> : <Input style={{width: 100}} onChange={this.toEditOff.bind(this, record, 'Source')} />
        }, {
            title: '备注',
            key: '4',
            dataIndex: 'SpecDescribe',
            render: (text, record, index) => record.isSave ? <span>{text}</span> : <Input style={{width: 200}} onChange={this.toEditOff.bind(this, record, 'SpecDescribe')} />
        }, {
            title: '附件(pdf,jpg,png)',
            key: '5',
            dataIndex: 'OfferFiles',
            render: (text, record) => {
                return record.isSave ? <a onClick={this.toSeeFile.bind(this, record)}>查看</a> : <a onClick={this.onUpload.bind(this, record)}>添加附件</a>;
            }
        }, {
            title: '操作',
            key: '6',
            dataIndex: 'action',
            render: (text, record, index) => record.isSave ? '' : <a onClick={this.toSave.bind(this, record)}>保 存</a>
        }
    ];
    render () {
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, Specs, TreeTypes, Contacter, Phone, organizationName, showModal, showSeeModal, OfferFiles } = this.state;
        let projectName = '', section = '';
        projectList.map(item => {
            if (item.No === ProjectName) {
                projectName = item.Name;
            }
            if (item.No === Section) {
                section = item.Name;
            }
        });
        const self = this;
        const props = {
            name: 'file',
            action: '',
            fileList: self.state.fileList,
            beforeUpload (file, fileList) {
                self.setState({
                    fileList
                });
                return false;
            }
        };
        return (
            <div className='purchaseDetails' style={{padding: '0 20px'}}>
                <Button type='primary' style={{marginBottom: 5}} onClick={this.toReturn}>返 回</Button>
                <Card>
                    <Row>
                        <Col span={16}>
                            <h2>{projectName} {section} 采购单</h2>
                            <p className='text-p'>报价起止时间：{StartTime}&nbsp;至&nbsp;{EndTime}</p>
                            <p className='text-p'>用苗地址：{UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：{TreeTypes}</p>
                        </Col>
                        <Col span={8}>
                            <p className='text-p'>发布单位：{organizationName}</p>
                            <p className='text-p'>联系人：{Contacter}</p>
                            <p className='text-p'>联系电话：{Phone}</p>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <h3>报价单</h3>
                    {
                        Specs.map((item, index) => {
                            return (
                                <Card key={index}>
                                    <header>
                                        <span style={{display: 'inline-block', width: 70}}>{item.TreeTypeName}</span>
                                        <span style={{display: 'inline-block', width: 450, marginLeft: 20}}>胸径{item.DBH}cm 地经{item.GroundDiameter}cm 自然高{item.Height}cm 冠幅{item.CrownWidth}cm 培育方式：{item.name} {item.Num}棵</span>
                                        {
                                            this.grouptype === '' ? '' : <Button type='primary' style={{marginLeft: 20}} onClick={this.toOffer.bind(this, item.ID)}>我要报价</Button>
                                        }
                                        <span style={{marginLeft: 20}}>已有{item.Offers}人报价</span>
                                    </header>
                                    {
                                        item.childrenList.length > 0 ? <Table columns={this.columns} dataSource={item.childrenList} rowKey='key' pagination={false} /> : ''
                                    }
                                </Card>
                            );
                        })
                    }
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        {
                            this.grouptype === '' ? '' : <Button type='primary' onClick={this.toSubmit.bind(this)}>提&nbsp;交</Button>
                        }
                    </div>
                </Card>
                <Modal
                    title='上 传'
                    visible={showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Dragger {...props}>
                        <p className='ant-upload-drag-icon'>
                            <Icon type='inbox' />
                        </p>
                        <p className='ant-upload-text'>请将您所想上传的文件或图片拖曳至该区域</p>
                    </Dragger>
                </Modal>
                <Modal
                    title='查 看'
                    visible={showSeeModal}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                >
                    <img width='100%' src={OfferFiles} alt='图片没找到' />
                </Modal>
            </div>
        );
    }
    toSeeFile (record, e) {
        let OfferFiles = record && record.OfferFiles && getForestImgUrl(record.OfferFiles);
        e.preventDefault();
        console.log(record, '行数据');
        this.setState({
            showSeeModal: true,
            OfferFiles: OfferFiles
        });
    }
    onUpload (record, e) {
        e.preventDefault();
        this.setState({
            fileList: [],
            showModal: true,
            PurchaseSpecID: record.PurchaseSpecID
        });
    }
    handleOk () {
        const { fileList, PurchaseSpecID, Specs } = this.state;
        const { postUploadImage } = this.props.actions;
        const formdata = new FormData();
        formdata.append('a_file', fileList[0]);
        postUploadImage({}, formdata).then(rep => {
            Specs.map(item => {
                item.childrenList.map(row => {
                    if (row.PurchaseSpecID === PurchaseSpecID) {
                        row.OfferFiles = rep;
                    }
                });
            });
            this.setState({
                Specs,
                showModal: false
            });
        });
    }
    handleCancel () {
        this.setState({
            showModal: false,
            showSeeModal: false
        });
    }
    toEditOff (record, str, e) {
        const { Specs } = this.state;
        Specs.map(item => {
            if (item.ID === record.PurchaseSpecID) {
                item.childrenList[0][str] = e.target.value;
            }
        });
        this.setState({
            Specs
        });
    }
    toEditOffValue (record, str, value) {
        const { Specs } = this.state;
        Specs.map(item => {
            if (item.ID === record.PurchaseSpecID) {
                item.childrenList[0][str] = value;
            }
        });
        this.setState({
            Specs
        });
    }
    toOffer (id) {
        const { Specs } = this.state;
        Specs.map(item => {
            if (item.ID === id) {
                if (item.childrenList.length === 0) {
                    item.childrenList = [{
                        key: 0,
                        isSave: false,
                        PurchaseSpecID: id,
                        Price: '',
                        SpecDescribe: '',
                        Num: '',
                        Max: item.Num,
                        OfferFiles: '',
                        Source: ''
                    }];
                } else {
                    item.childrenList = [{
                        ...item.childrenList[0],
                        key: 0,
                        isSave: false,
                        PurchaseSpecID: id,
                        Max: item.Num
                    }];
                }
            }
        });
        this.setState({
            Specs
        });
    }
    toSave (record, e) {
        e.preventDefault();
        let { Specs } = this.state;
        Specs.map(item => {
            if (item.ID === record.PurchaseSpecID) {
                item.childrenList[0].isSave = true;
            }
        });
        this.setState({
            Specs
        });
    }
    toReturn () {
        this.props.actions.changePurchaseDetailsVisible(false);
    }
    toSubmit () {
        const { Specs } = this.state;
        const { postOffer } = this.props.actions;
        let OfferSpecs = [];
        Specs.map(item => {
            item.childrenList.map(row => {
                OfferSpecs.push({
                    PurchaseSpecID: row.PurchaseSpecID,
                    Price: row.Price,
                    SpecDescribe: row.SpecDescribe,
                    Num: row.OfferNum,
                    OfferFiles: row.OfferFiles,
                    Source: row.Source
                });
            });
        });
        console.log(this.grouptype, this.org_code, '提交code');
        postOffer({}, {
            PurchaseID: this.purchaseid,
            OfferDescribe: '',
            NurseryBaseID: this.grouptype === 0 ? this.org_code : '',
            SupplierID: this.grouptype === 6 ? this.org_code : '',
            OfferSpecs
        }).then(rep => {
            if (rep.code === 1) {
                message.success('报价成功了');
                this.props.actions.changePurchaseDetailsVisible(false);
            } else {
                message.error('报价失败,' + rep.msg);
            }
        });
    }
}

export default Form.create()(PurchaseDetails);

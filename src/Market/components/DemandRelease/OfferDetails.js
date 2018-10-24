
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table, InputNumber, Tag, Modal } from 'antd';
import { CULTIVATIONMODE, FOREST_API } from '_platform/api';

class OfferDetails extends Component {
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
            showModal: false,
            PurchaseSpecID: '', // 规格id
            fileList: [], // 文件列表
            TreeTypes: '', // 采购品种
            Status: '' // 状态
        };
        this.purchaseid = ''; // 采购单ID
        this.org_code = ''; // 组织机构code
        this.grouptype = ''; // 本用户组类型
        this.toReturn = this.toReturn.bind(this); // 返回
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOrgTree_new, getOffersListById } = this.props.actions;
        this.purchaseid = this.props.addDemandKey;
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
                TreeTypes: rep.TreeTypes,
                Status: rep.Status
            });
            // 根据采购单ID获取报价清单
            getOffersListById({}, {
                purchaseid: this.purchaseid
            }).then(rst => {
                rst.map(item => {
                    getOrgTree_new({code: item.SupplierID || item.NurseryBaseID}).then(response => {
                        return response.name;
                    }).then((name) => {
                        console.log(rep, '采购单信息');
                        console.log(item, '报价清单');
                        item.DetailOfferSpecs.map(row => {
                            rep.Specs.map(record => {
                                if (record.ID === row.ID) {
                                    record.childrenList.push({
                                        name: name,
                                        Price: row.Price,
                                        OfferNum: row.OfferNum,
                                        Source: row.Source,
                                        SpecDescribe: row.SpecDescribe,
                                        OfferFiles: row.OfferFiles
                                    });
                                }
                            });
                        });
                        this.setState({
                            Specs: rep.Specs
                        });
                    });
                });
            });
            // 获取发布单位
            getOrgTree_new({code: rep.CreaterOrg}).then(rst => {
                this.setState({
                    organizationName: rst.name
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
    render () {
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, TreeTypes, Contacter, Phone, Specs, organizationName, Status, showModal, OfferFiles } = this.state;
        let projectName = '', section = '';
        projectList.map(item => {
            if (item.No === ProjectName) {
                projectName = item.Name;
            }
            if (item.No === Section) {
                section = item.Name;
            }
        });
        const columns = [{
            title: '报价单位',
            key: '1',
            dataIndex: 'name'
        }, {
            title: '到货单价',
            width: 100,
            key: '2',
            dataIndex: 'Price'
        }, {
            title: '数量',
            width: 100,
            key: '3',
            dataIndex: 'OfferNum',
            render: (text, record) => {
                if (this.state.Status === 2) {
                    return <InputNumber
                        min={1} max={text} defaultValue={text}
                        onChange={this.handleWinNum.bind(this, record)}>{text}</InputNumber>;
                } else {
                    return text;
                }
            }
        }, {
            title: '苗源地',
            width: 100,
            key: '4',
            dataIndex: 'Source'
        }, {
            title: '备注',
            width: 200,
            key: '5',
            dataIndex: 'SpecDescribe'
        }, {
            title: '附件',
            key: '6',
            dataIndex: 'OfferFiles',
            render: (text, record) => {
                return <a onClick={this.toSeeFile.bind(this, text)}>查看</a>;
            }
        }];
        let columnsAction = columns.concat({
            title: '选标',
            key: '7',
            dataIndex: 'OfferFiles',
            render: (text, record) => {
                return <Button onClick={this.toPurchaseSelect.bind(this)}>提 交</Button>;
            }
        });
        let columnsStatus = columns.concat({
            title: '状态',
            key: '8',
            dataIndex: 'OfferFiles'
        });
        return (
            <div className='offerDetails' style={{padding: '0 20px'}}>
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
                    {
                        Specs.map((item, index) => {
                            return (
                                <Card key={index}>
                                    <header>
                                        <Tag color='#108ee9' style={{cursor: 'auto'}}>{index}</Tag>
                                        <span style={{display: 'inline-block', width: 70}}>{item.TreeTypeName}</span>
                                        <span style={{display: 'inline-block', width: 450, marginLeft: 20}}>胸径{item.DBH}cm 地经{item.GroundDiameter}cm 自然高{item.Height}cm 冠幅{item.CrownWidth}cm 培育方式：{item.name} {item.Num}棵</span>
                                        {
                                            this.grouptype === '' ? '' : <Button type='primary' style={{marginLeft: 20}} onClick={this.toOffer.bind(this, item.ID)}>我要报价</Button>
                                        }
                                        <span style={{marginLeft: 20}}>已有{item.Offers}人报价</span>
                                    </header>
                                    {
                                        item.childrenList.length > 0 ? <Table columns={
                                            Status === 1 ? columns : (Status === 2 ? columnsAction : columnsStatus)
                                        } dataSource={item.childrenList} rowKey='name' pagination={false} /> : ''
                                    }
                                </Card>
                            );
                        })
                    }
                </Card>
                <Modal
                    title='查 看'
                    visible={showModal}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                >
                    <img width='100%' src={FOREST_API + '/' + OfferFiles} alt='文件没找到' />
                </Modal>
            </div>
        );
    }
    toReturn () {
        this.props.actions.changeSeeOfferVisible(false);
    }
    handleWinNum (record, value) {
        const { Specs } = this.state;
        console.log(record, Specs);
    }
    toSeeFile (OfferFiles, e) {
        e.preventDefault();
        this.setState({
            showModal: true,
            OfferFiles
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
    toPurchaseSelect () {
        const { postPurchaseSelect } = this.props.actions;
        postPurchaseSelect().then(rep => {

        });
    }
}

export default Form.create()(OfferDetails);

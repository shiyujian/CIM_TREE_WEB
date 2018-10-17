
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table, Input } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';
import './PurchaseDetails.less';

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
            dataList: [],
            Contacter: '',
            Phone: '',
            organizationName: '' // 组织机构名称
        };
        this.purchaseid = ''; // 采购单ID
        this.toOffer = this.toOffer.bind(this); // 我要报价
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOfferInventoryById, getOrgTree_new } = this.props.actions;
        this.purchaseid = this.props.purchaseDetailsKey;
        // 根据ID采购单详情
        getPurchaseById({id: this.purchaseid}).then((rep) => {
            let arr = [];
            rep.Specs.map(item => {
                CULTIVATIONMODE.map(row => {
                    if (item.CultivationMode === row.id) {
                        item.name = row.name;
                    }
                });
                arr.push(item.TreeTypeName);
            });
            // CULTIVATIONMODE
            this.setState({
                purchaseInfo: rep,
                ProjectName: rep.ProjectName,
                Section: rep.Section,
                StartTime: rep.StartTime,
                EndTime: rep.EndTime,
                UseNurseryAddress: rep.UseNurseryAddress,
                Contacter: rep.Contacter,
                Phone: rep.Phone,
                OfferNun: rep.OfferNun,
                CreaterOrg: rep.CreaterOrg,
                Specs: rep.Specs,
                SpecsType: arr
            });
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
        // 根据id获取采购报价清单
        getOfferInventoryById({}, {purchaseid: this.purchaseid}).then(rep => {
            this.setState({
                dataList: [{
                    Price: rep.Price,
                    Describe: rep.Describe
                }]
            });
        });
    }
    columns = [
        {
            title: '到货总价',
            key: '1',
            dataIndex: 'Price',
            render: text => <Input style={{width: 150}} />
        }, {
            title: '报价说明',
            key: '2',
            dataIndex: 'Describe',
            render: text => <Input style={{width: 200}} />
        }, {
            title: '操作',
            key: '3',
            dataIndex: 'action',
            render: (text, record) => <a onClick={this.toRelease.bind(this, record)}>报 价</a>
        }
    ];
    render () {
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, Specs, SpecsType, Contacter, Phone, organizationName, dataList } = this.state;
        let projectName = '', section = '';
        projectList.map(item => {
            if (item.No === ProjectName) {
                projectName = item.Name;
            }
            if (item.No === Section) {
                section = item.Name;
            }
        });
        return (
            <div className='purchaseDetails' style={{padding: '0 20px'}}>
                <Button type='primary' style={{marginBottom: 5}} onClick={this.toReturn.bind(this)}>返 回</Button>
                <Card>
                    <Row>
                        <Col span={16}>
                            <h2>{projectName} {section} 采购单</h2>
                            <p className='text-p'>报价起止时间：{StartTime} 至 {EndTime}</p>
                            <p className='text-p'>用苗地址：{UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：{SpecsType}</p>
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
                                        <span>柏树</span>
                                        <span style={{marginLeft: 20}}>胸径{item.DBH}cm 地经{item.GroundDiameter}cm 自然高{item.Height}cm 冠幅{item.CrownWidth}cm 培育方式：{item.name} {item.Num}棵</span>
                                        <Button type='primary' style={{marginLeft: 20}} onClick={this.toOffer}>我要报价</Button>
                                        <span style={{marginLeft: 20}}>已有5人报价</span>
                                    </header>
                                    <Table columns={this.columns} dataSource={dataList} />
                                </Card>
                            );
                        })
                    }
                </Card>
            </div>
        );
    }
    toOffer () {
        const { dataList } = this.state;
        dataList.push({

        });
        this.setState({
            dataList
        });
    }
    toRelease (record, e) {
        e.preventDefault();
    }
    toReturn () {
        this.props.actions.changePurchaseDetailsVisible(false);
    }
}

export default Form.create()(PurchaseDetails);

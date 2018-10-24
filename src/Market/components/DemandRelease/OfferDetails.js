
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table, InputNumber, Tag } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';

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
                console.log(rst, '报价清单');
                rst.map(item => {
                    getOrgTree_new({code: item.SupplierID || item.NurseryBaseID}).then(response => {
                        item.name = response.name;
                    });
                });
                rep.Specs.map(item => {
                    rst.map(row => {
                        row.DetailOfferSpecs.map(record => {
                            if (item.ID === record.ID) {
                                item.childrenList.push({
                                    Status: rep.Status,
                                    org_code: row.SupplierID || row.PurchaseID,
                                    Price: record.Price,
                                    OfferNum: record.OfferNum,
                                    Source: record.Source,
                                    SpecDescribe: record.SpecDescribe,
                                    OfferFiles: record.OfferFiles
                                });
                            }
                        });
                    });
                });
                rep.Specs.map(item => {
                    item.childrenList.map(row => {
                        getOrgTree_new({code: row.org_code}).then(response => {
                            row.name = response.name;
                        });
                    });
                });
                console.log(rep.Specs, '1');
                this.setState({
                    Specs: rep.Specs
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
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, TreeTypes, Contacter, Phone, Specs, organizationName, Status } = this.state;
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
                console.log(record.Status, '---');
                if (record.Status === 2) {
                    return <InputNumber min={1} max={text} onChange={this.handleWinNum.bind(this, record)}>{text}</InputNumber>;
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
            dataIndex: 'OfferFiles'
        }];
        let columnsAction = columns.concat({
            title: '选标',
            key: '7',
            dataIndex: 'OfferFiles',
            render: (text, record) => {
                return <Button>保存</Button>;
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
                                        } dataSource={item.childrenList} rowKey='org_code' pagination={false} /> : ''
                                    }
                                </Card>
                            );
                        })
                    }
                </Card>
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
}

export default Form.create()(OfferDetails);

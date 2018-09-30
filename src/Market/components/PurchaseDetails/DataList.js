
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Table, Input } from 'antd';
import { searchToObj } from '../common';
import { CULTIVATIONMODE } from '_platform/api';
import './DataList.less';

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1,
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
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOfferInventoryById, getOrgTree_new } = this.props.actions;
        this.purchaseid = searchToObj(this.props.location.search).id;
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

        });
    }
    columns = [
        {
            title: '到货总价',
            key: '1',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '报价说明',
            key: '4',
            dataIndex: '可供数量',
            render: text => <Input />
        }, {
            title: '操作',
            key: '6',
            dataIndex: 'action',
            render: (text, record) => <Button>提交</Button>
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
            <div className='data-list' style={{padding: '0 20px'}}>
                <Link to='/market/seedlingpurchase'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
                <Card>
                    <Row>
                        <Col span={16}>
                            <h2>{projectName} {section} 采购单</h2>
                            <p>报价起止时间：{StartTime} 至 {EndTime}</p>
                            <p>用苗地址：{UseNurseryAddress}</p>
                            <p>采购品种：{SpecsType}</p>
                        </Col>
                        <Col span={8}>
                            <p>发布单位：{organizationName}</p>
                            <p>联系人：{Contacter}</p>
                            <p>联系电话：{Phone}</p>
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
                                        <span style={{marginLeft: 20}}>胸径{item.DBH};地经{item.GroundDiameter};自然高{item.Height};冠幅{item.CrownWidth};培育方式：{item.name};{item.Num}棵</span>
                                        <Button type='primary' style={{marginLeft: 20}}>我要报价</Button>
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
}

export default Form.create()(DataList);
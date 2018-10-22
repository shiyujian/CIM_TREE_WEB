import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';

class OfferDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            dataList: [], // 表格数据
            ProjectName: '', // 项目名称
            Section: '', // 标段
            projectList: [], // 项目标段列表
            treetypename: ''
        };
        this.purchaseid = ''; // 采购单ID
        this.toReturn = this.toReturn.bind(this); // 返回
        this.columns = [{
            title: '树种',
            key: '1',
            dataIndex: 'TreeTypeName'
        }, {
            title: '规格',
            key: '2',
            dataIndex: 'ID'
        }, {
            title: '到货单价',
            key: '3',
            dataIndex: 'Price'
        }, {
            title: '数量',
            key: '4',
            dataIndex: 'Num'
        }, {
            title: '苗源地',
            key: '5',
            dataIndex: 'Source'
        }, {
            title: '备注',
            key: '6',
            dataIndex: 'SpecDescribe'
        }, {
            title: '附件',
            key: '7',
            dataIndex: 'OfferFiles'
        }, {
            title: '状态',
            key: '8',
            dataIndex: 'WinNum',
            render: (text) => {
                let str = '';
                switch (text) {
                    case 0:
                        str = '落选';
                        break;
                    default:
                        str = '选标中';
                }
                return str;
            }
        }];
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOffersById } = this.props.actions;
        this.purchaseid = this.props.offerDetailsKey;
        // 根据ID采购单详情
        getPurchaseById({id: this.purchaseid}).then((rep) => {
            let SpecsType = [];
            rep.Specs.map(item => {
                CULTIVATIONMODE.map(row => {
                    if (item.CultivationMode === row.id) {
                        item.name = row.name;
                    }
                });
                SpecsType.push(item.TreeTypeName);
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
                SpecsType
            });
        });
        // 根据id获取报价单信息
        getOffersById({}, {
            id: this.purchaseid
        }).then(rep => {
            console.log(rep);
            let dataList = [];
            rep.map(item => {
                item.DetailOfferSpecs.map(row => {
                    dataList.push({
                        TreeTypeName: row.TreeTypeName,
                        ID: row.ID,
                        Price: row.Price,
                        Num: row.Num,
                        Source: row.Source,
                        SpecDescribe: row.SpecDescribe,
                        OfferFiles: row.OfferFiles,
                        WinNum: row.WinNum
                    });
                });
            });
            console.log(dataList, '表格数据');
            this.setState({
                dataList
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
            <div className='offer-details'>
                <Button type='primary' style={{marginBottom: 5}} onClick={this.toReturn.bind(this)}>返 回</Button>
                <Card>
                    <Row>
                        <Col span={16}>
                            <h2>{projectName} {section} 采购单</h2>
                            <p className='text-p'>报价起止时间：{StartTime} 至 {EndTime}</p>
                            <p className='text-p'>起苗地：{UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：{SpecsType}</p>
                        </Col>
                        <Col span={8}>
                            <p className='text-p'>供应商：{organizationName}</p>
                            <p className='text-p'>联系人：{Contacter}</p>
                            <p className='text-p'>联系电话：{Phone}</p>
                            <p className='text-p'>发布单位地址：{organizationName}</p>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Table columns={this.columns} dataSource={dataList} rowKey='ID' />
                </Card>
            </div>
        );
    }
    toReturn () {
        this.props.actions.changeOfferDetailsVisible(false);
    }
}

export default Form.create()(OfferDetails);

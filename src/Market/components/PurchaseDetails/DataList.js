
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'antd';
import { searchToObj } from '../common';
import Menu from './Menu';
import TableLi from './TableLi';
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
            projectList: [] // 项目标段列表
        };
        this.purchaseid = ''; // 采购单ID
    }
    componentDidMount () {
        const { getPurchaseById, getWpunittree, getOfferInventoryById } = this.props.actions;
        this.purchaseid = searchToObj(this.props.location.search).id;
        // 根据ID采购单详情
        getPurchaseById({id: this.purchaseid}).then((rep) => {
            let arr = [];
            rep.Specs.map(item => {
                arr.push(item.TreeTypeName);
            });
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
                Specs: arr
            });
        });
        // 获得所有项目
        getWpunittree().then(rep => {
            this.setState({
                projectList: rep
            });
        });
        getOfferInventoryById({}, {
            purchaseid: this.purchaseid
        }).then(rep => {

        });
    }
    render () {
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, Specs } = this.state;
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
                        <Col span={12}>
                            <h2>{projectName}-{section}采购单</h2>
                            <p>报价起止时间:{StartTime} - {EndTime}</p>
                            <p>用苗地址:{UseNurseryAddress}</p>
                            <p>采购品种:{Specs}</p>
                        </Col>
                        <Col span={12}>
                            <p>供应商:</p>
                            <p>联系人:</p>
                            <p>联系电话:</p>
                            <p>发布单位地址:</p>
                        </Col>
                    </Row>
                </Card>
                <div className='content-list'>
                    <h3>报价单</h3>
                    <TableLi />
                </div>
            </div>
        );
    }
}

export default Form.create()(DataList);

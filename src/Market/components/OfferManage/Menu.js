
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Tag } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 规格列表
            StartTime: '', // 报价开始时间
            EndTime: '', // 报价结束时间
            organizationName: '' // 发布单位名称
        };
        this.renderButton = this.renderButton.bind(this); // 显示按钮
        this.toSeeDetails = this.toSeeDetails.bind(this); // 查看详情
        this.returnTag = this.returnTag.bind(this); // 返回标签
    }
    componentDidMount () {
        // 报价起止时间
        if (this.props.record) {
            let StartTime = this.props.record['StartTime'].split(' ')[0];
            let EndTime = this.props.record['EndTime'].split(' ')[0];
            this.setState({
                StartTime,
                EndTime
            });
            // 获取发布单位
            const { getOrgTree_new } = this.props.actions;
            console.log(this.props.record.CreaterOrg, '1');
            getOrgTree_new({code: this.props.record.CreaterOrg}).then(rep => {
                this.setState({
                    organizationName: rep.name
                });
            });
        }
        // 项目名称和标段
        if (this.props.projectList && this.props.record) {
            this.props.projectList.map(item => {
                if (item.No === this.props.record.ProjectName) {
                    this.setState({
                        ProjectName: item.Name
                    });
                } else if (item.No === this.props.record.Section) {
                    this.setState({
                        Section: item.Name
                    });
                }
            });
        }
        // 根据采购单id获取采购单规格
        const { getOffersById } = this.props.actions;
        getOffersById({}, {
            purchaseid: this.props.record.ID
        }).then(rep => {
        });
    }
    render () {
        const { dataList, StartTime, EndTime, ProjectName, Section, organizationName } = this.state;
        const { record } = this.props;
        let CreateTime = record.CreateTime ? record.CreateTime.split(' ')[0] : '';
        return (
            <div className='menu'>
                <Card title={'发布时间：' + CreateTime}>
                    <Row>
                        <Col span={8}>
                            <h3>
                                {ProjectName}{Section}采购单
                                {
                                    this.returnTag()
                                }
                            </h3>
                            <p className='text-p'>报价起止时间：{StartTime}至{EndTime}</p>
                            <p className='text-p'>发布单位：{organizationName}</p>
                            <p className='text-p'>用苗地址：{record.UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：{record.TreeTypes}</p>
                        </Col>
                        <Col span={12}>
                            {
                                dataList.map((item, index) => {
                                    return (
                                        <div key={index} style={{display: 'flex', padding: '5px 0', width: '90%', borderBottom: '1px solid #ccc'}}>
                                            <div>
                                                <Tag color='blue-inverse' style={{cursor: 'auto'}}>{index}</Tag>
                                            </div>
                                            <div style={{width: 50}}>
                                                <span>{item.name}</span>
                                            </div>
                                            <div style={{marginLeft: 10}}>
                                                {
                                                    item.children.map((row, number) => {
                                                        let CultivationMode = '';
                                                        CULTIVATIONMODE.map(record => {
                                                            if (row.CultivationMode === record.id) {
                                                                CultivationMode = record.name;
                                                            }
                                                        });
                                                        return <p key={number} style={{marginBottom: '0.2em', fontSize: 10}}>胸径{row.DBH}cm 地径{row.GroundDiameter}cm 自然高{row.Height}cm 冠幅{row.CrownWidth}cm 培育方式：{CultivationMode} ￥{row.Price}（{row.Num}株)</p>;
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </Col>
                        <Col span={4} style={{paddingTop: 30}}>
                            {
                                this.renderButton()
                            }
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    returnTag () {
        let color = '';
        let strStatus = '';
        switch (this.props.record.Status) {
            case 0:
                color = '#f50';
                strStatus = '未上架';
                break;
            case 1:
                color = '#87d068';
                strStatus = '报价中';
                break;
            case 2:
                color = '#2db7f5';
                strStatus = '选标中';
                break;
            case 3:
                color = '#108ee9';
                strStatus = '已结束';
                break;
        }
        return <Tag style={{marginLeft: 10}} color={color}>
            {strStatus}
        </Tag>;
    }
    toSeeDetails () {
        const { changeOfferDetailsVisible, changeOfferDetailsKey } = this.props.actions;
        changeOfferDetailsVisible(true);
        console.log(this.props.record.ID);
        changeOfferDetailsKey(this.props.record.ID);
    }
    renderButton () {
        let arr = [];
        let seeButton = <Button style={{marginRight: 15, marginBottom: 10}} key='seeButton' type='primary' onClick={this.toSeeDetails}>查看详情</Button>;
        switch (this.props.record.Status) {
            case 1:
                arr.push(seeButton);
                break;
            case 3:
                arr.push(seeButton);
                break;
        }
        return arr;
    }
}

export default Form.create()(Menu);

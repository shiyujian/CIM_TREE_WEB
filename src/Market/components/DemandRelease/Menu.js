
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { FOREST_API } from '_platform/api';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
        this.toEditInfo = this.toEditInfo.bind(this); // 提交查询
        this.toSoldOut = this.toSoldOut.bind(this); // 需求详情
    }
    render () {
        const { record, projectList } = this.props;
        console.log(record);
        console.log(projectList);
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={8}>
                            <h3>{record.ProjectName}-{record.Section}<span>({record.SKU})</span></h3>
                            <p>用苗地：{record.UseNurseryAddress}</p>
                            <p>报价时间：{record.StartTime}-{record.EndTime}</p>
                            <p>商品备注：{record.TreeDescribe}</p>
                        </Col>
                        <Col span={8}>
                            <p>采购品种：采购品种：采购品种：</p>
                        </Col>
                        <Col span={8} style={{paddingTop: 30}}>
                            <Link to={`/market/adddemand?key=${record.ID}`}>
                                <Button onClick={this.toEditInfo}>查看报价</Button>
                            </Link>
                            <Button type='primary' onClick={this.toSoldOut} style={{width: 82, marginLeft: 15}}>下架</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    toEditInfo () {

    }
    toSoldOut () {
        console.log(this);
        window.location.href = '/market/purchasedetails';
    }
}

export default Form.create()(Menu);


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
        const { record } = this.props;
        console.log(record);
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={5}>
                            <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='180px' height='120px' />
                        </Col>
                        <Col span={7}>
                            <h3>{record.TreeTypeName}<span>({record.SKU})</span></h3>
                            <p>类型：</p>
                            <p>价格：￥{record.MinPrice}-{record.MaxPrice}</p>
                            <p>商品备注：{record.TreeDescribe}</p>
                        </Col>
                        <Col span={6}>
                            <p>采购品种：采购品种：采购品种：</p>
                        </Col>
                        <Col span={6} style={{paddingTop: 30}}>
                            <Link to={`/market/addseedling?id=${record.ID}`}>
                                <Button type='primary' onClick={this.toEditInfo}>修改信息</Button>
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


import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Card, Row, Col } from 'antd';

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
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='menu'>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={6}>
                            <img src='' alt='图片找不到了' width='180px' height='120px' />
                        </Col>
                        <Col span={6}>
                            <h3>沙地柏<span></span></h3>
                            <p>类型：</p>
                            <p>用苗地：</p>
                            <p>采购品种：</p>
                        </Col>
                        <Col span={6}>
                            <p>采购品种：采购品种：采购品种：</p>
                        </Col>
                        <Col span={6}>
                            <Button type='primary' onClick={this.toEditInfo}>修改信息</Button>
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


import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { FOREST_API } from '_platform/api';
import { Form, Input, Button, Tabs, Card, Col, Row } from 'antd';

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
        const { record } = this.props;
        return (
            <div className='menu'>
                <Link to='/market/supplydetails'>
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                        <div>
                            <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='100%' height='150' />
                        </div>
                        <div style={{padding: '0 10px'}}>
                            <h3>
                                松柏（2200株）
                                <span style={{float: 'right', fontSize: 12, color: '#888'}}>一个月前发布</span>
                            </h3>
                            <p>主杆径：2-3厘米</p>
                            <p>北京一亩良田公司</p>
                            <p>
                                <span style={{color: '#ff5b05', fontSize: 20, fontWeight: 'bold'}}>100-200</span>
                                <span style={{float: 'right'}}>山东菏泽</span>
                            </p>
                        </div>
                    </Card>
                </Link>
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

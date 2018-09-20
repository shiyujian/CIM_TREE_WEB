
import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { Form, Input, Button, Tabs } from 'antd';

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
            <div className='seedling-supply-menu'>
                <Link to='/market/supplydetails' key='1'>
                    <div style={{width: 230, height: 150}}>
                        <img src='' alt='图片找不到了' width='230' height='150' />
                        <h3>松柏（2200株）<span>一个月前发布</span></h3>
                        <p>主杆径：2-3厘米</p>
                        <p>北京一亩良田公司</p>
                        <p className='last-price'>100-200<span>山东菏泽</span></p>
                    </div>
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

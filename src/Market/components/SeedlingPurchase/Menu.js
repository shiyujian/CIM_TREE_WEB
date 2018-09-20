
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Tabs } from 'antd';
import './Menu.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
        this.handlePane = this.handlePane.bind(this); // 切换标签页
        this.handleSubmit = this.handleSubmit.bind(this); // 提交查询
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='menu'>
                <header>发布时间:</header>
                <div className='content'>
                    <h3>采购单</h3>
                    <p className='title'>发布单位:<span>报价起止时间:</span></p>
                    <p>用苗地:</p>
                    <p>采购品种:</p>
                    <p>联系方式:</p>
                </div>
                <div className='fixed'>
                    <p>已有5人报价</p>
                    <Link to='/market/purchasedetails'>
                        <Button type='primary'>需求详情</Button>
                    </Link>
                </div>
            </div>
        );
    }
    handlePane () {

    }
    handleSubmit () {

    }
}

export default Form.create()(Menu);


import React, {Component} from 'react';
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
            <div className='menu'>
                <header>发布时间:</header>
                <div className='content'>
                    <img src='' alt='图片找不到了' width='180' height='120' style={{float: 'left', margin: 23}} />
                    <div style={{float: 'left', margin: 23}}>
                        <h3>沙地柏<span></span></h3>
                        <ul>
                            <li>类型：</li>
                            <li>用苗地：</li>
                            <li>采购品种：</li>
                        </ul>
                    </div>
                </div>
                <div className='fixed'>
                    <Button type='primary' onClick={this.toEditInfo}>修改信息</Button>
                    <Button type='primary' onClick={this.toSoldOut} style={{width: 82, marginLeft: 15}}>下架</Button>
                </div>
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


import React, {Component} from 'react';
import { Form, Button } from 'antd';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
    }
    render () {
        return (
            <div className='details-menu'>
                <ul className='menu-ul-two'>
                    <li>供应商:</li>
                    <li>联系人:</li>
                    <li>联系电话:</li>
                    <li>发布单位地址:</li>
                </ul>
                <h2>采购单</h2>
                <ul className='menu-ul-one'>
                    <li>报价起止时间:</li>
                    <li>起苗地:</li>
                    <li>采购品种:</li>
                </ul>
            </div>
        );
    }
}

export default Form.create()(Menu);

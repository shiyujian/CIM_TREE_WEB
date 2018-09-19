
import React, {Component} from 'react';
import { Form, Button } from 'antd';
import Menu from './Menu';
import TableLi from './TableLi';
import './DataList.less';

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
        this.toBack = this.toBack.bind(this); // 返回
    }
    render () {
        return (
            <div className='data-list' style={{margin: '0 40px'}}>
                <Button type='primary' onClick={this.toBack}>返 回</Button>
                <Menu />
                <div className='content-list'>
                    <h3>报价单</h3>
                    <TableLi />
                </div>
            </div>
        );
    }
    toBack () {
        window.location.href = 'http://localhost:8888/market/seedlingpurchase';
    }
}

export default Form.create()(DataList);

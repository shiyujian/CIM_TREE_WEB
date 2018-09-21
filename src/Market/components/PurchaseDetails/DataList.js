
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'antd';
import { searchToObj } from '../common';
import Menu from './Menu';
import TableLi from './TableLi';
import './DataList.less';

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
    }
    componentDidMount () {
        const { getPurchaseById } = this.props.actions;
        const { id } = searchToObj(this.props.location.search);
        console.log(id);
        getPurchaseById({
            id: parseInt(id)
        }).then((rep) => {
            
        });
    }
    render () {
        return (
            <div className='data-list' style={{padding: '0 20px'}}>
                <Link to='/market/seedlingpurchase'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
                <Menu />
                <div className='content-list'>
                    <h3>报价单</h3>
                    <TableLi />
                </div>
            </div>
        );
    }
}

export default Form.create()(DataList);

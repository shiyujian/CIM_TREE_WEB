
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='seedling-supply' style={{padding: '20px 40px'}}>
                <Link to='/market/seedlingsupply'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
            </div>
        );
    }
}

export default Form.create()(DataList);

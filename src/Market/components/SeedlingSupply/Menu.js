
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
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { record } = this.props;
        console.log(record.NurseryBase);
        let TreeTypeName = '';
        let TreePlace = '';
        let NurseryName = '';
        let UpdateTime = '';
        if (record && record.NurseryBase) {
            TreeTypeName = record.TreeTypeName;
            NurseryName = record.NurseryBase.NurseryName;
            TreePlace = record.NurseryBase.TreePlace;
            UpdateTime = record.UpdateTime;
        }
        return (
            <div className='menu'>
                <Link to={`/market/supplydetails?id=${record['ID']}`}>
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                        <div>
                            <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='100%' height='150' />
                        </div>
                        <div style={{padding: '0 10px'}}>
                            <h3>
                                {TreeTypeName}（{record.SKU}）
                                <span style={{float: 'right', fontSize: 12, color: '#888'}}>{UpdateTime}</span>
                            </h3>
                            <p>主杆径：2-3厘米</p>
                            <p>{NurseryName}</p>
                            <p>
                                <span style={{color: '#ff5b05', fontSize: 20, fontWeight: 'bold'}}>{record.MinPrice}-{record.MaxPrice}</span>
                                <span style={{float: 'right'}}>{TreePlace}</span>
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>
        );
    }
    toEditInfo () {

    }
}

export default Form.create()(Menu);


import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Tabs, Card, Row, Col } from 'antd';

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
        const { record, projectList } = this.props;
        const { getFieldDecorator } = this.props.form;
        let ProjectName = '', Section = '';
        projectList.map(item => {
            if (item.No === record.ProjectName) {
                ProjectName = item.Name;
            }
            if (item.No === record.Section) {
                Section = item.Name;
            }
        });
        return (
            <div className='menu'>
                <Card title='发布时间:'>
                    <Row>
                        <Col span={18}>
                            <h3>{ProjectName}-{Section}采购单</h3>
                            <p className='title'>发布单位:<span>报价起止时间:</span></p>
                            <p>用苗地:{record.UseNurseryAddress}</p>
                            <p>采购品种:</p>
                            <p>发布时间:{record.StartTime}-{record.EndTime}</p>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                            <p style={{marginTop: 22}}>已有5人报价</p>
                            <Link to={`/market/purchasedetails?id=${record.ID}`}>
                                <Button type='primary'>需求详情</Button>
                            </Link>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    handlePane () {

    }
    handleSubmit () {

    }
}

export default Form.create()(Menu);

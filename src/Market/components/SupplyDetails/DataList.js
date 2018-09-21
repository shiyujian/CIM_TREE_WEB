
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Select, Tabs, InputNumber, Row, Col } from 'antd';
import './DataList.less';

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
    componentDidMount () {
        const { getSeedlingSupplyById } = this.props.actions;
        getSeedlingSupplyById().then((rep) => {
            
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='supply-details' style={{padding: '0 20px'}}>
                <Link to='/market/seedlingsupply'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
                <div className='supply-details-content'>
                    <article>
                        <img src='' alt='图片找不到了' width='300' height='200' />
                        <section>
                            <h2>松柏</h2>
                            <p>胸径：</p>
                            <p>地径：</p>
                            <p>冠幅：</p>
                            <p>自然亮：</p>
                        </section>
                        <section>
                            <p style={{marginTop: 40}}>价格：</p>
                            <p>数量：<InputNumber min={1} max={10} defaultValue={3} />棵<span>库存：500棵</span></p>
                            <Button type='primary'>加入购物车</Button>
                        </section>
                        <ul>
                            <li>供应商：</li>
                            <li>起苗地：</li>
                            <li>联系人：</li>
                            <li>联系电话：</li>
                            <li>发布时间：</li>
                        </ul>
                    </article>
                    <aside>
                        <h3>苗木信息</h3>
                        <div>
                            <img src='' alt='图片找不到了' />
                            <img src='' alt='图片找不到了' />
                            <img src='' alt='图片找不到了' />
                            <img src='' alt='图片找不到了' />
                        </div>
                        <p>段落一大批</p>
                    </aside>
                </div>
            </div>
        );
    }
}

export default Form.create()(DataList);

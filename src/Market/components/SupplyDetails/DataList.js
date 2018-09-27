
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { FOREST_API } from '_platform/api';
import { Form, Button, Input, Select, Tabs, InputNumber, Row, Col } from 'antd';
import { searchToObj } from '_platform/auth';
import './DataList.less';
import { width } from 'window-size';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const myButton = {
    height: 25,
    borderRadius: 10,
    marginRight: 10
}
class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            productInfo: null, // 详细信息
            Photo: '', // 整图
            LocalPhoto: '', // 局部图
            MostPhoto: '', // 成片图
            OtherPhoto: '', // 其他图
            TreeTypeName: '', // 商品名称
            TreeDescribe: '', // 产品简介
            SKU: '' // 库存
        };
        this.spuid = ''; // 商品id
    }
    componentDidMount () {
        const { getProductById, getSpecsById } = this.props.actions;
        // 根据id获取详细信息
        this.spuid = searchToObj(this.props.location.search).id;
        getProductById({id: this.spuid}).then((rep) => {
            this.setState({
                productInfo: rep,
                Photo: rep.Photo,
                LocalPhoto: rep.LocalPhoto,
                MostPhoto: rep.MostPhoto,
                OtherPhoto: rep.OtherPhoto,
                TreeTypeName: rep.TreeTypeName,
                TreeDescribe: rep.TreeDescribe,
                SKU: rep.SKU
            });
        });
        // 根据商品id获取规格
        getSpecsById({}, {spuid: this.spuid}).then(rep => {

        });
    }
    render () {
        const { productInfo, TreeTypeName, Photo, LocalPhoto, MostPhoto, OtherPhoto, TreeDescribe, SKU } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='supply-details' style={{padding: '0 20px'}}>
                <Link to='/market/seedlingsupply'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
                <div style={{height: 200, padding: 20, border: '1px solid #ccc'}}>
                    <Row gutter={16}>
                        <Col span={5}>
                            <img src={`${FOREST_API}/${Photo}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={7}>
                            <h2>{TreeTypeName}</h2>
                            <p>
                                胸径：
                                <Button style={myButton}>2cm</Button>
                                <Button style={myButton}>3cm</Button>
                            </p>
                            <p>
                                地径：
                                <Button style={myButton}>3cm</Button>
                            </p>
                            <p>
                                冠幅：
                                <Button style={myButton}>2cm</Button>
                                <Button style={myButton}>5cm</Button>
                            </p>
                            <p>
                                自然高：
                                <Button style={myButton}>5cm</Button>
                                <Button style={myButton}>8cm</Button>
                                <Button style={myButton}>15cm</Button>
                            </p>
                        </Col>
                        <Col span={6}>
                            <p style={{marginTop: 40}}>价格：</p>
                            <p>数量：<InputNumber min={1} max={10} defaultValue={3} />棵<span>库存：{SKU}棵</span></p>
                            <Button type='primary'>加入购物车</Button>
                        </Col>
                        <Col span={6}>
                            <li>供应商：</li>
                            <li>起苗地：</li>
                            <li>联系人：</li>
                            <li>联系电话：</li>
                            <li>发布时间：</li>
                        </Col>
                    </Row>
                </div>
                <div style={{height: 400, padding: 20, border: '1px solid #ccc'}}>
                    <h3 style={{height: 30}}>苗木信息</h3>
                    <Row>
                        <Col span={6}>
                            <img src={`${FOREST_API}/${Photo}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={`${FOREST_API}/${LocalPhoto}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={`${FOREST_API}/${MostPhoto}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={`${FOREST_API}/${OtherPhoto}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                    </Row>
                    <p>{TreeDescribe}</p>
                </div>
            </div>
        );
    }
}

export default Form.create()(DataList);

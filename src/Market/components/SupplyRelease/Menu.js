
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, message } from 'antd';
import { Link } from 'react-router-dom';
import { FOREST_API, TREETYPENO } from '_platform/api';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            TreeTypeName: '' // 类型名称
        };
        this.toEditInfo = this.toEditInfo.bind(this); // 提交查询
        this.toSoldOut = this.toSoldOut.bind(this); // 下架
    }
    componentDidMount () {
        const { record } = this.props;
        if (record.TreeTypeNo) {
            TREETYPENO.map(item => {
                if (item.id === record.TreeTypeNo.slice(0, 1)) {
                    this.setState({
                        TreeTypeName: item.name
                    });
                }
            });
        }
    }
    render () {
        const { record } = this.props;
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={5}>
                            <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='180px' height='120px' />
                        </Col>
                        <Col span={7}>
                            <h3>{record.TreeTypeName}<span>({record.SKU})</span></h3>
                            <p>类型：{this.state.TreeTypeName}</p>
                            <p>价格：￥{record.MinPrice}-{record.MaxPrice}</p>
                            <p>商品备注：{record.TreeDescribe}</p>
                        </Col>
                        <Col span={6}>
                            <p>采购品种：采购品种：采购品种：</p>
                        </Col>
                        <Col span={6} style={{paddingTop: 30}}>
                            <Link to={`/market/addseedling?key=${record.ID}`}>
                                <Button type='primary' onClick={this.toEditInfo}>修改信息</Button>
                            </Link>
                            <Button type='primary' onClick={this.toSoldOut} style={{width: 82, marginLeft: 15}}>下架</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    toEditInfo () {

    }
    toSoldOut () {
        const { putCommodity } = this.props.actions;
        putCommodity({}, {
            ID: this.props.record.ID,
            Status: 0
        }).then(rep => {
            if (rep.code === 1) {
                this.props.toSearch();
                message.success('下架成功');
            }
        });
    }
}

export default Form.create()(Menu);
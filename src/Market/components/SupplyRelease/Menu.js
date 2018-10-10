
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, message } from 'antd';
import { FOREST_API, TREETYPENO } from '_platform/api';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            TreeTypeName: '' // 类型名称
        };
        this.toSoldOut = this.toSoldOut.bind(this); // 上下架
    }
    componentDidMount () {
        const { record } = this.props;
        console.log(record, '上下架');
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
                            <Button type='primary' onClick={this.toEditInfo.bind(this, record.ID)}>修改信息</Button>
                            <Button type='primary' onClick={this.toSoldOut} style={{width: 82, marginLeft: 15}}>
                                {
                                    record.Status === 1 ? '下架' : '上架'
                                }
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    toEditInfo (key) {
        this.props.toAddSeedling(key);
    }
    toSoldOut () {
        const { changeStatus } = this.props.actions;
        changeStatus({}, {
            ID: this.props.record.ID,
            Status: this.props.record.Status === 1 ? 0 : 1
        }).then(rep => {
            if (rep.code === 1) {
                this.props.toSearch();
                message.success('上下架成功');
            } else {
                message.success('上下架失败');
            }
        });
    }
}

export default Form.create()(Menu);

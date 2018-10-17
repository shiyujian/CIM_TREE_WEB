
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Tag, message } from 'antd';
import { FOREST_API, TREETYPENO, CULTIVATIONMODE } from '_platform/api';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            TreeTypeName: '', // 类型名称
            dataList: [] // 规格列表
        };
        this.toSoldOut = this.toSoldOut.bind(this); // 上下架
        this.returnButton = this.returnButton.bind(this); // 返回按钮
    }
    componentDidMount () {
        const { getInventoryList } = this.props.actions;
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
        // 根据商品id获取规格
        getInventoryList({}, {
            spuid: this.props.record.ID
        }).then(rep => {
            let dataList = [];
            if (rep.code === 200) {
                let Suppliers = [];
                rep.content.map(item => {
                    if (!Suppliers.includes(item.SupplierID)) {
                        Suppliers.push(item.SupplierID);
                    }
                });
                rep.content.map(item => {
                    if (item.SupplierID === Suppliers[0]) {
                        dataList.push(item);
                    }
                });
                this.setState({
                    dataList
                });
            }
        });
    }
    render () {
        const { dataList } = this.state;
        const { record } = this.props;
        let UpdateTime = record.UpdateTime ? record.UpdateTime.split(' ')[0] : '';
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：' + UpdateTime}>
                    <Row>
                        <Col span={4}>
                            <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='150px' height='100px' />
                        </Col>
                        <Col span={5}>
                            <h3>
                                {record.TreeTypeName}
                                <span>({record.SKU}株)</span>
                                <Tag style={{marginLeft: 10}} color='#87d068'>{record.Status === 1 ? '上架中' : '未上架'}</Tag>
                            </h3>
                            <p className='text-p'>类型：{this.state.TreeTypeName}</p>
                            <p className='text-p'>上车价：￥{record.MinPrice}-{record.MaxPrice}</p>
                            <p className='text-p'>联系方式：{record.Phone}</p>
                        </Col>
                        <Col span={11}>
                            {
                                dataList.map((item, index) => {
                                    let CultivationMode = '';
                                    CULTIVATIONMODE.map(row => {
                                        if (item.CultivationMode === row.id) {
                                            CultivationMode = row.name;
                                        }
                                    });
                                    return <p key={index}>胸径{item.DBH}cm 地径{item.GroundDiameter}cm 自然高{item.Height}cm 冠幅{item.CrownWidth}cm 培育方式：{CultivationMode} ￥{item.Price}（{item.Stock}株）</p>;
                                })
                            }
                        </Col>
                        <Col span={4} style={{paddingTop: 30}}>
                            {
                                this.returnButton()
                            }
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
    returnButton () {
        let arr = [];
        let seeButton = <Button style={{marginRight: 15, marginBottom: 10}} key='seeButton' type='primary' onClick={this.toEditInfo.bind(this, this.props.record.ID)}>查看</Button>;
        let editButton = <Button style={{marginRight: 15, marginBottom: 10}} key='editButton' type='primary' onClick={this.toEditInfo.bind(this, this.props.record.ID)}>编辑</Button>;
        let deleteButton = <Button style={{marginRight: 15, marginBottom: 10}} key='deleteButton' type='primary' onClick={this.toDelete.bind(this)}>删除</Button>;
        let upButton = <Button style={{marginRight: 15, marginBottom: 10}} key='upButton' type='primary' onClick={this.toSoldOut}>上架</Button>;
        let downButton = <Button style={{marginRight: 15, marginBottom: 10}} key='downButton' type='primary' onClick={this.toSoldOut}>下架</Button>;
        switch (this.props.record.Status) {
            case 0:
                arr.push(editButton, upButton, deleteButton);
                break;
            case 1:
                arr.push(seeButton, downButton);
                break;
        }
        return arr;
    }
    toDelete () {
        const { deleteCommodity } = this.props.actions;
        deleteCommodity({id: this.props.record.ID}).then(rep => {
            if (rep.code === 1) {
                message.success('删除成功');
                this.props.toSearch();
            }
        });
    }
}

export default Form.create()(Menu);

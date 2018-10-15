
import React, {Component} from 'react';
import { FOREST_API } from '_platform/api';
import { Form, Button, InputNumber, Row, Col } from 'antd';
import './SupplyDetails.less';
const myButton = {
    height: 22,
    borderRadius: 10,
    marginRight: 10
};
const myButtonActive = {
    color: '#40a9ff',
    borderColor: '#40a9ff',
    height: 22,
    borderRadius: 10,
    marginRight: 10
};
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
            UpdateTime: '', // 创建时间
            Contacter: '', // 苗圃基地责任人
            Phone: '', // 责任人联系方式
            TreePlace: '',
            standardList: [], // 规格数组
            NurseryName: '',
            SKU: '', // 库存
            TreeTypeID: '',
            Price: '',
            Stock: '',
            Height: '',
            CrownWidth: '',
            DBH: '',
            GroundDiameter: '',
            CultivationMode: '',
            dataList: [],
            SupplierID: ''
        };
        this.spuid = ''; // 商品id
        this.NurseryBaseID = ''; // 苗圃基地ID
    }
    componentDidMount () {
        const { getProductById, getSpecsById, getInventoryList } = this.props.actions;
        this.spuid = this.props.supplyDetailsKey;
        // 根据商品id获取规格
        getSpecsById({}, {spuid: this.spuid}).then(rep => {
            let arrSpecName = [];
            rep.map(item => {
                if (!arrSpecName.includes(item.SpecName)) {
                    arrSpecName.push(item.SpecName);
                }
            });
            let standardList = [];
            arrSpecName.map(item => {
                let arr = [];
                let str = '';
                rep.map(row => {
                    if (item === row.SpecName) {
                        str = row.SpecFieldName;
                        arr.push(row);
                    }
                });
                standardList.push({
                    SpecFieldName: str,
                    name: item,
                    children: arr
                });
            });
            this.setState({
                standardList
            });
        });
        // 根据id获取详细信息
        getProductById({id: this.spuid}).then((rep) => {
            this.NurseryBaseID = rep.NurseryBaseID;
            this.setState({
                productInfo: rep,
                Photo: rep.Photo,
                LocalPhoto: rep.LocalPhoto,
                MostPhoto: rep.MostPhoto,
                OtherPhoto: rep.OtherPhoto,
                TreeTypeName: rep.TreeTypeName,
                TreeDescribe: rep.TreeDescribe,
                UpdateTime: rep.UpdateTime.split(' ')[0],
                NurseryName: rep.NurseryBase.NurseryName,
                Leader: rep.NurseryBase.Leader,
                LeaderPhone: rep.NurseryBase.LeaderPhone,
                TreePlace: rep.NurseryBase.TreePlace,
                SKU: rep.SKU,
                Contacter: rep.Contacter,
                Phone: rep.Phone
            });
            // 获取sku库存列表
            getInventoryList({}, {
                spuid: this.spuid
            }).then(rst => {
                if (rst.content && rst.content.length > 0) {
                    const dataList = rst.content;
                    this.setState({
                        TreeTypeID: dataList[0].TreeTypeID,
                        dataList: dataList[0],
                        Price: dataList[0].Price,
                        Stock: dataList[0].Stock,
                        Height: dataList[0].Height,
                        CrownWidth: dataList[0].CrownWidth,
                        DBH: dataList[0].DBH,
                        GroundDiameter: dataList[0].GroundDiameter,
                        CultivationMode: dataList[0].CultivationMode,
                        SupplierID: dataList[0].SupplierID
                    });
                }
            });
        });
    }
    render () {
        const { TreeTypeName, Photo, LocalPhoto, MostPhoto, OtherPhoto, TreeDescribe, Contacter, Phone, Height, dataList,
            UpdateTime, standardList, Stock, Price, TreePlace, NurseryName} = this.state;
        return (
            <div className='supply-details' style={{padding: '0 20px'}}>
                <Button type='primary' onClick={this.toReturn.bind(this)} style={{marginBottom: 5}}>返 回</Button>
                <div style={{height: 200, padding: 20, border: '1px solid #ccc'}}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <img src={`${FOREST_API}/${Photo}`} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={5}>
                            <h2 style={{marginBottom: '0.2em'}}>{TreeTypeName}</h2>
                            <p style={{marginTop: '0.2em'}}>发布时间：{UpdateTime}</p>
                            {
                                standardList ? standardList.map((item, index) => {
                                    return (
                                        <p style={{marginTop: '0.2em'}} key={index}>
                                            {item.name}：
                                            {
                                                item.children.map((row, num) => {
                                                    return row.SpecValue === dataList[item.SpecFieldName] + '' ? <Button style={myButtonActive} key={num}>{row.SpecValue}</Button>
                                                        : <Button style={myButton} key={num}>{row.SpecValue}</Button>;
                                                })
                                            }
                                        </p>
                                    );
                                }) : []
                            }
                        </Col>
                        <Col span={7}>
                            <p style={{marginTop: 50}}>
                                价格：
                                <span style={{color: '#f5222d'}}>{Price}元</span>
                            </p>
                            <div>
                                数量：
                                <InputNumber style={{width: 50}} min={1} max={10} defaultValue={3} />
                                棵&nbsp;&nbsp;
                                <span style={{fontSize: 12}}>库存：{Stock}棵</span>
                            </div>
                            <Button type='primary' style={{marginTop: 10}}>加入购物车</Button>
                        </Col>
                        <Col span={6}>
                            <p style={{marginTop: 50}}>供应商：{NurseryName}</p>
                            <p>起苗地：{TreePlace}</p>
                            <p>联系人：{Contacter}</p>
                            <p>联系电话：{Phone}</p>
                        </Col>
                    </Row>
                </div>
                <div style={{height: 400, padding: 20, border: '1px solid #ccc'}}>
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
    toReturn () {
        this.props.actions.changeSupplyDetailsVisible(false);
    }
}

export default Form.create()(DataList);

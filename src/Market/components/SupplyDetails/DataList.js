
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
            Leader: '', // 苗圃基地责任人
            LeaderPhone: '', // 责任人联系方式
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
        // 根据id获取详细信息
        this.spuid = searchToObj(this.props.location.search).id;
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
                SKU: rep.SKU
            });
            // 获取sku库存列表
            getInventoryList({}, {
                spuid: this.spuid,
                nurserybase: this.NurseryBaseID
            }).then(rst => {
                if (rst.content && rst.content.length > 0) {
                    const dataList = rst.content;
                    this.setState({
                        TreeTypeID: dataList[0].TreeTypeID,
                        TreeTypeName: dataList[0].TreeTypeName,
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
            console.log(standardList, 'aaa');
            this.setState({
                standardList
            });
        });
    }
    render () {
        const { TreeTypeName, Photo, LocalPhoto, MostPhoto, OtherPhoto, TreeDescribe, Leader, Height, dataList,
            LeaderPhone, UpdateTime, SKU, standardList, Stock, Price, TreePlace, NurseryName} = this.state;
        return (
            <div className='supply-details' style={{padding: '0 20px'}}>
                <Link to='/market/seedlingsupply'>
                    <Button type='primary' style={{marginBottom: 5}}>返 回</Button>
                </Link>
                <div style={{height: 250, padding: 20, border: '1px solid #ccc'}}>
                    <Row gutter={16}>
                        <Col span={5}>
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
                            <p style={{marginTop: '0.2em'}}>库存：{Stock}</p>
                            <p style={{marginTop: '0.2em'}}>价格：{Price}</p>
                        </Col>
                        <Col span={8}>
                            <div style={{marginTop: 130}}>数量：<InputNumber min={1} max={10} defaultValue={3} />  棵</div>
                            <Button type='primary' style={{marginTop: 10}}>加入购物车</Button>
                        </Col>
                        <Col span={6}>
                            <h2 style={{marginBottom: 30}}>苗圃基地介绍：</h2>
                            <p>名称：{NurseryName}</p>
                            <p>起苗地：{TreePlace}</p>
                            <p>联系人：{Leader}</p>
                            <p>联系电话：{LeaderPhone}</p>
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
}

export default Form.create()(DataList);


import React, {Component} from 'react';
import { Form, Button, InputNumber, Row, Col } from 'antd';
import './SupplyDetails.less';
import { getForestImgUrl } from '_platform/auth';
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
class SupplyDetails extends Component {
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
            number: 1, // 购买数量
            TreeTypeID: '',
            Price: 0, // 价格
            Stock: 0, // 库存
            CultivationMode: '',
            dataList: [], // 规格列表
            selectStandard: {},
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
            if (rep.NurseryBase) {
                this.setState({
                    NurseryName: rep.NurseryBase.NurseryName,
                    Leader: rep.NurseryBase.Leader,
                    LeaderPhone: rep.NurseryBase.LeaderPhone,
                    TreePlace: rep.NurseryBase.TreePlace
                });
            }
            this.setState({
                productInfo: rep,
                Photo: rep.Photo,
                LocalPhoto: rep.LocalPhoto,
                MostPhoto: rep.MostPhoto,
                OtherPhoto: rep.OtherPhoto,
                TreeTypeName: rep.TreeTypeName,
                TreeDescribe: rep.TreeDescribe,
                UpdateTime: rep.UpdateTime.split(' ')[0],
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
                    let TreeTypeArr = [];
                    dataList.map(item => {
                        if (!TreeTypeArr.includes(item.SupplierID)) {
                            TreeTypeArr.push(item.SupplierID);
                        }
                    });
                    let arr = [];
                    dataList.map(row => {
                        if (row.SupplierID === TreeTypeArr[0]) {
                            arr.push(row);
                        }
                    });
                    this.setState({
                        TreeTypeID: dataList[0].TreeTypeID,
                        dataList: arr,
                        Price: 0,
                        Stock: 0,
                        CultivationMode: dataList[0].CultivationMode,
                        SupplierID: dataList[0].SupplierID
                    });
                }
            });
        });
    }
    render () {
        const { TreeTypeName, Photo, LocalPhoto, MostPhoto, OtherPhoto, TreeDescribe, Contacter, Phone, dataList,
            UpdateTime, number, standardList, Stock, Price, TreePlace, NurseryName} = this.state;
        let img = getForestImgUrl(Photo);
        let LocalImg = getForestImgUrl(LocalPhoto);
        let MostImg = getForestImgUrl(MostPhoto);
        let OtherImg = getForestImgUrl(OtherPhoto);

        return (
            <div className='supply-details' style={{padding: '0 20px'}}>
                <Button type='primary' onClick={this.toReturn.bind(this)} style={{marginBottom: 5}}>返 回</Button>
                <div style={{height: 200, padding: 20, border: '1px solid #ccc'}}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <img src={img} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={5}>
                            <h2 style={{marginBottom: '0.2em'}}>{TreeTypeName}</h2>
                            <p className='text-p'>发布时间：{UpdateTime}</p>
                            {
                                standardList ? standardList.map((item, index) => {
                                    return (
                                        <p className='text-p' key={index}>
                                            {item.name}：
                                            {
                                                item.children.map((row, num) => {
                                                    let arr = [];
                                                    dataList.map(record => {
                                                        if (!arr.includes(record[item.SpecFieldName])) {
                                                            arr.push(record[item.SpecFieldName]);
                                                        }
                                                    });
                                                    let disabled = false;
                                                    if (!arr.includes(parseInt(row.SpecValue))) {
                                                        disabled = true;
                                                    }
                                                    return <Button style={row.active ? myButtonActive : myButton} disabled={disabled} key={num} onClick={this.onSelectStandard.bind(this, row, num)}>{row.SpecValue}</Button>;
                                                })
                                            }
                                        </p>
                                    );
                                }) : []
                            }
                        </Col>
                        <Col span={7}>
                            <p style={{marginTop: 50}} className='text-p'>
                                价格：
                                <span style={{color: '#f5222d'}}>{Price}元</span>
                            </p>
                            <div>
                                数量：
                                <InputNumber style={{width: 50}} min={1} max={Stock} value={number} onChange={this.handleNumber.bind(this)} />
                                &nbsp;棵&nbsp;&nbsp;
                                <span style={{fontSize: 12}}>库存：{Stock}棵</span>
                            </div>
                            <Button type='primary' style={{marginTop: 10}}>加入购物车</Button>
                        </Col>
                        <Col span={6}>
                            <p style={{marginTop: 50}} className='text-p'>供应商：{NurseryName}</p>
                            <p className='text-p'>起苗地：{TreePlace}</p>
                            <p className='text-p'>联系人：{Contacter}</p>
                            <p className='text-p'>联系电话：{Phone}</p>
                        </Col>
                    </Row>
                </div>
                <div style={{height: 400, padding: 20, border: '1px solid #ccc'}}>
                    <Row>
                        <Col span={6}>
                            <img src={img} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={LocalImg} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={MostImg} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
                        </Col>
                        <Col span={6}>
                            <img src={OtherImg} alt='图片找不到了' style={{maxHeight: 150, maxWidth: 230}} />
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
    onSelectStandard (row, num) {
        let { dataList, selectStandard, standardList, Price, Stock } = this.state;
        standardList.map(item => {
            if (item.SpecFieldName === row.SpecFieldName) {
                item.children[num].active = true;
            }
        });
        let dataListFilter = [];
        dataList.map(item => {
            if (item[row.SpecFieldName] + '' === row.SpecValue) {
                dataListFilter.push(item);
                selectStandard[row.SpecFieldName] = row.SpecValue;
            }
        });
        if (selectStandard.DBH && selectStandard.CrownWidth && selectStandard.GroundDiameter && selectStandard.Height) {
            dataList.map(item => {
                if (item.DBH + '' === selectStandard.DBH && item.CrownWidth + '' === selectStandard.CrownWidth && item.GroundDiameter + '' === selectStandard.GroundDiameter && item.Height + '' === selectStandard.Height) {
                    Stock = item.Stock;
                    Price = item.Price;
                }
            });
        }
        this.setState({
            dataList: dataListFilter,
            selectStandard,
            standardList,
            Stock,
            Price
        });
    }
    handleNumber (value) {
        this.setState({
            number: value
        });
    }
}

export default Form.create()(SupplyDetails);

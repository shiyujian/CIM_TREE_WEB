
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Table, Upload, Row, Col, Icon, Modal, Cascader, message } from 'antd';
import { TREETYPENO, FOREST_API } from '_platform/api';
import { searchToObj, getUser } from '_platform/auth';
import './DataList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;

const myUpload = {
    width: 100,
    height: 80,
    display: 'block',
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    cursor: 'pointer'
};
const myIcon = {
    width: 100,
    height: 80,
    padding: '25px 35px',
    fontSize: 28,
    color: '#999'
};
class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            productInfo: null,
            showModal: false,
            SupplierList: [], // 供应商列表
            SupplierID: '',
            supplier: '', // 选择的供应商
            Photo: '', // 全株照片
            LocalPhoto: '', // 局部特写照片
            MostPhoto: '', // 成片栽植照片
            OtherPhoto: '', // 其他照片
            dataList: [], // 表格数据
            length: 0,
            treeTypeList: [], // 树种
            TreeTypeNo: '', // 树木类型
            TreeTypeID: '' // 树种ID
        };
        this.spuid = ''; // 商品ID
        this.Creater = ''; // 用户ID
        this.TreeTypeList = []; // 所有树种
        this.NurseryBaseID = ''; // 苗圃基地ID
        this.TreeTypeName = ''; // 树种名称
        this.dataListLength = 0; // 库存条数
        this.handleTreeType = this.handleTreeType.bind(this); // 树种名称
        this.addVersion = this.addVersion.bind(this); // 增加规格
        this.handleTreeTypeNo = this.handleTreeTypeNo.bind(this); // 树种类型
        this.handleSupplier = this.handleSupplier.bind(this); // 选择供应商
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'DBH',
            key: '1',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'DBH', index)} />;
            }
        }, {
            title: '地径（cm）',
            dataIndex: 'GroundDiameter',
            key: '2',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'GroundDiameter', index)} />;
            }
        }, {
            title: '冠幅（cm）',
            dataIndex: 'CrownWidth',
            key: '3',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'CrownWidth', index)} />;
            }
        }, {
            title: '自然高（cm）',
            dataIndex: 'Height',
            key: '4',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Height', index)} />;
            }
        }, {
            title: '培育方式',
            dataIndex: 'CultivationMode',
            width: 100,
            key: '5',
            render: (text, record, index) => {
                return (
                    <Select value={text} style={{ width: 100 }} onChange={this.editVersionMode.bind(this, 'CultivationMode', index)}>
                        <Option value={0}>地苗</Option>
                        <Option value={1}>断根苗</Option>
                        <Option value={2}>假植苗</Option>
                        <Option value={3}>袋苗</Option>
                        <Option value={4}>盆苗</Option>
                        <Option value={5}>山苗</Option>
                    </Select>
                );
            }
        }, {
            title: '价格（元）',
            dataIndex: 'Price',
            key: '6',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Price', index)} />;
            }
        }, {
            title: '库存（棵）',
            dataIndex: 'Stock',
            key: '7',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Stock', index)} />;
            }
        }, {
            title: '操作',
            dataIndex: 'actions',
            key: '8',
            render: (text, record, index) => {
                return (<span>
                    <a onClick={this.onDelete.bind(this, record, index)}>清空</a>
                </span>);
            }
        }];
    }
    componentDidMount () {
        const { getTreeTypes, getNurseryByPk, getProductById, getBindingSupplier, getInventoryList } = this.props.actions;
        // 获取树种类型
        getTreeTypes().then(rep => {
            this.TreeTypeList = rep;
            console.log(rep, 'bbbb');
            this.setState({
                treeTypeList: rep
            });
        });
        // 编辑商品
        const { key } = searchToObj(this.props.location.search);
        this.spuid = key;
        if (key) {
            // 根据id获取商品详细
            getProductById({id: key}).then(rep => {
                this.TreeTypeName = rep.TreeTypeName;
                console.log(rep, '9999');
                this.setState({
                    productInfo: rep,
                    TreeTypeNo: rep.TreeTypeNo.slice(0, 1),
                    TreeTypeID: rep.TreeTypeID,
                    Photo: rep.Photo,
                    LocalPhoto: rep.LocalPhoto,
                    MostPhoto: rep.MostPhoto,
                    OtherPhoto: rep.OtherPhoto
                });
            });
            // 获取sku库存
            getInventoryList({}, {
                spuid: this.spuid,
                nurserybase: this.NurseryBaseID
            }).then(rep => {
                if (rep.code === 200 && rep.content.length > 0) {
                    let dataList = [];
                    rep.content.map((item, index) => {
                        this.dataListLength += 1;
                        dataList.push({
                            number: index,
                            TreeTypeID: item.TreeTypeID,
                            Stock: item.Stock,
                            DBH: item.DBH,
                            Price: item.Price,
                            Height: item.Height,
                            CrownWidth: item.CrownWidth,
                            GroundDiameter: item.GroundDiameter,
                            SupplierID: item.SupplierID,
                            CultivationMode: item.CultivationMode
                        });
                    });
                    console.log(dataList, 'aaaa');
                    this.setState({
                        dataList,
                        length: this.dataListLength,
                        SupplierID: dataList[0].SupplierID
                    });
                }
            });
        }
        // 获取苗圃基地的责任人电话，以及绑定的供应商
        const { id, org_code } = getUser();
        this.Creater = id;
        console.log(getUser(), '----');
        if (org_code) {
            getNurseryByPk({}, {pk: org_code}).then((rep) => {
                if (rep.code === 200 && rep.content.length > 0) {
                    const obj = rep.content[0];
                    this.props.form.setFieldsValue({
                        Leader: obj.Leader,
                        LeaderPhone: obj.LeaderPhone
                    });
                    this.NurseryBaseID = obj.ID;
                    getBindingSupplier({}, {
                        nurserybaseid: this.NurseryBaseID
                    }).then(rst => {
                        this.setState({
                            SupplierList: rst
                        });
                    });
                }
            });
        }
    }
    render () {
        const { dataList, treeTypeList, Photo, LocalPhoto, MostPhoto, OtherPhoto, productInfo, TreeTypeID, TreeTypeNo, SupplierList, SupplierID } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props_one = {
            action: '',
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        Photo: rep
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    Photo: ''
                });
            }
        };
        const props_two = {
            action: '',
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        LocalPhoto: rep
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    LocalPhoto: ''
                });
            }
        };
        const props_three = {
            action: '',
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        MostPhoto: rep
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    MostPhoto: ''
                });
            }
        };
        const props_other = {
            action: '',
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        OtherPhoto: rep
                    });
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    OtherPhoto: ''
                });
            }
        };
        return (
            <div className='add-seedling' style={{padding: '0 20px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='树种类型'>
                                <Select value={TreeTypeNo} onChange={this.handleTreeTypeNo} style={{width: 150}}>
                                    {
                                        TREETYPENO.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='树种名称'>
                                <Select value={TreeTypeID} onChange={this.handleTreeType} style={{width: 150}}>
                                    {
                                        treeTypeList.length > 0 ? treeTypeList.map(item => {
                                            return <Option key={item.ID} value={item.ID}>{item.TreeTypeName}</Option>;
                                        }) : []
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='联系人'>
                                {getFieldDecorator('Leader')(
                                    <Input disabled />
                                )}
                            </FormItem>
                            <FormItem label='联系电话'>
                                {getFieldDecorator('LeaderPhone')(
                                    <Input disabled />
                                )}
                            </FormItem>
                            <FormItem label='供应商' style={{display: 'block'}}>
                                <Select
                                    allowClear
                                    value={SupplierID}
                                    onChange={this.handleSupplier}
                                    style={{ width: 350 }}
                                    placeholder='请选择供应商'
                                >
                                    {
                                        SupplierList ? SupplierList.map(item => {
                                            return <Option value={item.SupplierID} key={item.SupplierID}>{item.SupplierName}}</Option>;
                                        }) : []
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='规格' className='label-block'>
                                <Button type='primary' onClick={this.addVersion}
                                    style={{position: 'absolute', left: 680, top: -40, zIndex: 100}}>新增</Button>
                                <Table columns={this.columns} dataSource={dataList} bordered style={{maxWidth: 750}} pagination={false} rowKey='number' />
                            </FormItem>
                            <FormItem label='上传照片' className='label-block' style={{width: 520}}>
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Upload {...props_one} style={myUpload}>
                                            {
                                                Photo ? <img src={`${FOREST_API}/${Photo}`} alt='' style={{width: 98, height: 78}} />
                                                    : <Icon type='plus' style={myIcon} />
                                            }
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_two} style={myUpload}>
                                            {
                                                LocalPhoto ? <img src={`${FOREST_API}/${LocalPhoto}`} alt='' style={{width: 98, height: 78}} />
                                                    : <Icon type='plus' style={myIcon} />
                                            }
                                        </Upload>
                                        <p>局部特写</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_three} style={myUpload}>
                                            {
                                                MostPhoto ? <img src={`${FOREST_API}/${MostPhoto}`} alt='' style={{width: 98, height: 78}} />
                                                    : <Icon type='plus' style={myIcon} />
                                            }
                                        </Upload>
                                        <p>成片栽植</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_other} style={myUpload}>
                                            {
                                                OtherPhoto ? <img src={`${FOREST_API}/${OtherPhoto}`} alt='' style={{width: 98, height: 78}} />
                                                    : <Icon type='plus' style={myIcon} />
                                            }
                                        </Upload>
                                        <p>其他</p>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label='文本介绍' className='label-block'>
                                {getFieldDecorator('TreeDescribe', {
                                    initialValue: productInfo ? productInfo.TreeDescribe : ''
                                })(
                                    <TextArea rows={4} style={{width: 750}} />
                                )}
                            </FormItem>
                            <FormItem style={{width: 800, textAlign: 'center'}}>
                                <Button style={{marginRight: 20}} onClick={this.toRelease.bind(this, 0)}>暂存</Button>
                                <Button type='primary' onClick={this.toRelease.bind(this, 1)}>发布</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    addVersion () {
        let { dataList, SupplierID, length } = this.state;
        if (!SupplierID) {
            message.error('请先选择供应商');
            return;
        }
        const obj = {
            number: length,
            SupplierID,
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Price: '',
            Stock: ''
        };
        dataList.push(obj);
        this.setState({
            dataList,
            length: length + 1
        });
    }
    editVersion (str, index, e) {
        console.log(str, index, e);
        this.state.dataList[index][str] = e.target.value;
        this.setState({
            dataList: [...this.state.dataList]
        });
    }
    editVersionMode (str, index, value) {
        this.state.dataList[index][str] = value;
        this.setState({
            dataList: [...this.state.dataList]
        });
    }
    toRelease (Status) {
        const formVal = this.props.form.getFieldsValue();
        const { productInfo, TreeTypeID, Photo, LocalPhoto, MostPhoto, OtherPhoto, dataList } = this.state;
        console.log(dataList);
        const { postCommodity, putCommodity, putInventory } = this.props.actions;
        const pro = {
            Status,
            TreeTypeID,
            TreeTypeName: this.TreeTypeName,
            Photo,
            LocalPhoto,
            MostPhoto,
            OtherPhoto,
            Creater: this.Creater,
            NurseryBaseID: this.NurseryBaseID,
            TreeDescribe: formVal.TreeDescribe,
            SKUs: dataList
        };
        if (productInfo) {
            // 编辑spu,sku
            putCommodity({}, {
                ID: this.spuid,
                TreeDescribe: formVal.TreeDescribe,
                Status,
                Photo,
                LocalPhoto,
                MostPhoto,
                OtherPhoto
            }).then(rep => {
                console.log(this, 'ddddd');
                if (dataList.length > this.dataListLength) {
                    // postInventory({}, {
                    //     SPUID: this.spuid,
                    //     SupplierID: this.state.SupplierID,
                    // }).then(rep => {

                    // });
                }
                for (let i in dataList) {
                    if (i < this.dataListLength) {
                        putInventory({}, {
                            ID: this.spuid,
                            DBH: dataList[i].DBH,
                            Price: dataList[i].Price,
                            Stock: dataList[i].Stock,
                            SupplierID: dataList[i].SupplierID,
                            Height: dataList[i].Height,
                            CrownWidth: dataList[i].CrownWidth,
                            GroundDiameter: dataList[i].GroundDiameter,
                            CultivationMode: dataList[i].CultivationMode
                        }).then(rep => {
                            if (rep.code === 1) {
                                message.success('编辑库存成功');
                            }
                        });
                    }
                }
                if (rep.code === 1 && Status === 1) {
                    message.success('编辑成功');
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                }
            });
        } else {
            // 新增spu
            postCommodity({}, pro).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('发布成功');
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                } else if (rep.code === 2) {
                    message.error('该商品已存在');
                }
            });
        }
    }
    handleTreeTypeNo (value) {
        let arr = [];
        this.TreeTypeList.map(item => {
            if (item.TreeTypeNo.slice(0, 1) === value) {
                arr.push(item);
            }
        });
        this.setState({
            TreeTypeNo: value,
            treeTypeList: arr
        });
    }
    handleTreeType (value) {
        this.setState({
            TreeTypeID: value
        });
        this.state.treeTypeList.map(item => {
            if (item.ID === value) {
                this.TreeTypeName = item.TreeTypeName;
            }
        });
    }
    handleSupplier (value) {
        this.setState({
            SupplierID: value
        });
    }
    onDelete (record, index) {
        console.log(record, index, '1111');
        const { dataList } = this.state;
        console.log(dataList);
        dataList[index] = {
            number: index,
            SupplierID: this.state.SupplierID, // 供应商
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Price: '',
            Stock: ''
        };
        this.setState({
            dataList
        });
    }
}

export default Form.create()(DataList);

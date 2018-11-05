
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Table, Upload, Row, Col, Icon, message } from 'antd';
import { TREETYPENO, FOREST_API, CULTIVATIONMODE } from '_platform/api';
import { getUser } from '_platform/auth';
import './AddSeedling.less';

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
class AddSeedling extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isAmend: false, // 是否修改
            Status: 0, // 是否上架
            SupplierList: [], // 供应商列表
            SupplierID: [], // 选择的供应商
            Photo: '', // 全株照片
            LocalPhoto: '', // 局部特写照片
            MostPhoto: '', // 成片栽植照片
            OtherPhoto: '', // 其他照片
            dataList: [], // 表格数据
            treeTypeList: [], // 树种
            TreeTypeNo: '', // 树木类型
            TreeTypeID: '' // 树种ID
        };
        this.spuid = ''; // 商品ID
        this.Creater = ''; // 用户ID
        this.TreeTypeList = []; // 所有树种
        this.NurseryBaseID = ''; // 苗圃基地ID
        this.TreeTypeName = ''; // 树种名称
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
                        {
                            CULTIVATIONMODE.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                        }
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
                    <a onClick={this.toDelete.bind(this, index)}>删除</a>
                </span>);
            }
        }];
    }
    componentDidMount () {
        const { getTreeTypes, getNurseryByPk, getProductById, getBindingSupplier, getInventoryList } = this.props.actions;
        // 获取树种类型
        getTreeTypes().then(rep => {
            this.TreeTypeList = rep;
            this.setState({
                treeTypeList: rep
            });
        });
        // 获取苗圃基地的责任人电话，以及绑定的供应商
        const { id, org_code } = getUser();
        console.log(getUser(), '---');
        this.Creater = id;
        if (org_code) {
            getNurseryByPk({}, {pk: org_code}).then((rep) => {
                if (rep.code === 200 && rep.content.length > 0) {
                    const obj = rep.content[0];
                    if (!this.props.form.getFieldValue('Phone')) {
                        this.props.form.setFieldsValue({
                            Contacter: obj.Leader,
                            Phone: obj.LeaderPhone
                        });
                    }
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
        // 编辑商品
        this.spuid = this.props.addSeedlingKey;
        if (typeof this.spuid === 'string') {
            // 根据id获取商品详细
            getProductById({id: this.spuid}).then(rep => {
                this.TreeTypeName = rep.TreeTypeName;
                this.props.form.setFieldsValue({
                    Phone: rep.Phone,
                    Contacter: rep.Contacter,
                    TreeDescribe: rep.TreeDescribe
                });
                this.setState({
                    isAmend: true,
                    Status: rep.Status,
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
                    let SupplierID = [];
                    rep.content.map(item => {
                        if (!SupplierID.includes(item.SupplierID)) {
                            SupplierID.push(item.SupplierID);
                        }
                    });
                    let number = 0;
                    rep.content.map((item, index) => {
                        if (item.SupplierID === SupplierID[0]) {
                            dataList.push({
                                number: number++,
                                ID: item.ID,
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
                        }
                    });
                    this.setState({
                        dataList,
                        SupplierID
                    });
                }
            });
        } else {
            this.addVersion();
        }
    }
    render () {
        const { isAmend, Status, dataList, treeTypeList, Photo, LocalPhoto, MostPhoto, OtherPhoto, TreeTypeID, TreeTypeNo, SupplierList, SupplierID } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props_one = {
            action: '',
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    rep = rep.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
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
                    rep = rep.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
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
                    rep = rep.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
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
                    rep = rep.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
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
            <div className='addSeedling' style={{padding: '0 20px'}}>
                <Button type='primary' onClick={this.toReturn.bind(this)} style={{marginBottom: 5}}>返 回</Button>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='树种类型'>
                                <Select value={TreeTypeNo} onChange={this.handleTreeTypeNo} style={{width: 150}} disabled={isAmend}>
                                    {
                                        TREETYPENO.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='树种名称'>
                                <Select value={TreeTypeID} onChange={this.handleTreeType} style={{width: 150}} disabled={isAmend}>
                                    {
                                        treeTypeList.length > 0 ? treeTypeList.map(item => {
                                            return <Option key={item.ID} value={item.ID}>{item.TreeTypeName}</Option>;
                                        }) : []
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='联系人'>
                                {getFieldDecorator('Contacter')(
                                    <Input style={{width: 150}} />
                                )}
                            </FormItem>
                            <FormItem label='联系电话'>
                                {getFieldDecorator('Phone')(
                                    <Input style={{width: 150}} />
                                )}
                            </FormItem>
                            <FormItem label='供应商' style={{display: 'block'}}>
                                <Select
                                    mode='multiple'
                                    value={SupplierID}
                                    onChange={this.handleSupplier}
                                    style={{ width: 620 }}
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
                                {getFieldDecorator('TreeDescribe')(
                                    <TextArea rows={4} style={{width: 750}} />
                                )}
                            </FormItem>
                            <FormItem style={{width: 800, textAlign: 'center'}}>
                                {
                                    Status === 1 ? '' : <div>
                                        <Button style={{marginRight: 20}} onClick={this.toRelease.bind(this, 0)}>
                                            {isAmend ? '保存' : '暂存'}
                                        </Button>
                                        <Button type='primary' onClick={this.toCheck.bind(this)}>发布</Button>
                                    </div>
                                }
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    toReturn () {
        this.props.actions.changeAddSeedlingVisible(false);
    }
    addVersion () {
        let { dataList } = this.state;
        const obj = {
            number: dataList.length,
            SPUID: typeof this.spuid === 'string' ? this.spuid : '',
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
            dataList
        });
    }
    editVersion (str, index, e) {
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
    toCheck () {
        const { TreeTypeID, Photo, LocalPhoto, MostPhoto } = this.state;
        if (TreeTypeID === '') {
            message.error('请选择发布的树种');
            return;
        }
        if (Photo === '' || LocalPhoto === '' || MostPhoto === '') {
            message.error('请完成照片上传');
            return;
        }
        this.toRelease(1);
    }
    toRelease (Status) {
        const formVal = this.props.form.getFieldsValue();
        const { isAmend, TreeTypeID, Photo, LocalPhoto, MostPhoto, OtherPhoto, dataList, SupplierID } = this.state;
        const { postCommodity, putCommodity } = this.props.actions;
        let SKUs = [];
        console.log(dataList);
        SupplierID.map((item) => {
            dataList.map(row => {
                delete row.number;
                SKUs.push({...row, SupplierID: item});
            });
        });
        console.log(dataList);
        if (isAmend) {
            // 编辑spu,sku
            putCommodity({}, {
                ID: this.spuid,
                Contacter: formVal.Contacter,
                Phone: formVal.Phone,
                TreeDescribe: formVal.TreeDescribe,
                Status,
                Photo,
                LocalPhoto,
                MostPhoto,
                OtherPhoto,
                SKUs
            }).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('编辑成功');
                    this.props.actions.changeAddSeedlingVisible(false);
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                    this.props.actions.changeAddSeedlingVisible(false);
                } else {
                    message.error('操作失败');
                }
            });
        } else {
            // 新增spu
            postCommodity({}, {
                Contacter: formVal.Contacter,
                Phone: formVal.Phone,
                TreeDescribe: formVal.TreeDescribe,
                Status,
                TreeTypeID,
                TreeTypeName: this.TreeTypeName,
                Photo,
                LocalPhoto,
                MostPhoto,
                OtherPhoto,
                Creater: this.Creater,
                NurseryBaseID: this.NurseryBaseID,
                SKUs
            }).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('发布成功');
                    this.props.actions.changeAddSeedlingVisible(false);
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                    this.props.actions.changeAddSeedlingVisible(false);
                } else {
                    message.error('操作失败,' + rep.msg);
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
    toDelete (number) {
        const { dataList } = this.state;
        let arr = [];
        dataList.map(item => {
            if (number !== item.number) {
                arr.push(item);
            }
        });
        this.setState({
            dataList: arr
        });
    }
}

export default Form.create()(AddSeedling);

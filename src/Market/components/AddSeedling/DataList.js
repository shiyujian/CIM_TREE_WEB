
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Table, Upload, Row, Col, Icon, Modal, Cascader, message } from 'antd';
import { TREETYPENO, FOREST_API, postUploadImage } from '_platform/api';
import { getUser } from '_platform/auth';

import './DataList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;

class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
            Photo: '', // 全株照片
            LocalPhoto: '', // 局部特写照片
            MostPhoto: '', // 成片栽植照片
            OtherPhoto: '', // 其他照片
            dataList: [],
            treeTypes: [],
            fileList_one: [],
            fileList_two: [],
            fileList_three: [],
            fileList_other: [],
            TreeTypeName: '',
            TreeTypeID: 0
        };
        this.loadTreeTypes = this.loadTreeTypes.bind(this); // 加载树种类型
        this.handleTreeTypes = this.handleTreeTypes.bind(this); // 选择树种类型
        this.addSupplier = this.addSupplier.bind(this); // 添加供应商
        this.handleOk = this.handleOk.bind(this); // 确认添加供应商
        this.handleCancel = this.handleCancel.bind(this); // 取消发布
        this.toRelease = this.toRelease.bind(this); // 发布
        this.addVersion = this.addVersion.bind(this); // 增加规格
        this.editVersion = this.editVersion.bind(this); // 编辑规格
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'DBH',
            key: '1',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'DBH', index)} />;
            }
        }, {
            title: '地径（cm）',
            dataIndex: 'GroundDiameter',
            key: '2',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'GroundDiameter', index)} />;
            }
        }, {
            title: '冠幅（cm）',
            dataIndex: 'CrownWidth',
            key: '3',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'CrownWidth', index)} />;
            }
        }, {
            title: '自然高（cm）',
            dataIndex: 'Height',
            key: '4',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Height', index)} />;
            }
        }, {
            title: '培育方式',
            dataIndex: 'CultivationMode',
            key: '5',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'CultivationMode', index)} />;
            }
        }, {
            title: '价格（元）',
            dataIndex: 'Price',
            key: '6',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Price', index)} />;
            }
        }, {
            title: '库存（棵）',
            dataIndex: 'Stock',
            key: '7',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Stock', index)} />;
            }
        }];
    }
    componentDidMount () {
        const { getNurseryByPk } = this.props.actions;
        // 获取树种类型
        TREETYPENO.map(item => {
            item.value = item.id;
            item.label = item.name;
            item.isLeaf = false;
        });
        this.setState({
            treeTypes: TREETYPENO
        });
        // 获取苗圃基地的责任人电话，以及绑定的供应商
        const { org_code } = getUser();
        if (org_code) {
            getNurseryByPk({}, {pk: org_code}).then((rep) => {
                if (rep.code === 200 && rep.content.length > 0) {
                    const obj = rep.content[0];
                    this.props.form.setFieldsValue({
                        Leader: obj.Leader,
                        LeaderPhone: obj.LeaderPhone
                    });
                }
            });
        }
    }
    render () {
        const { dataList, showModal, treeTypes, fileList_one, fileList_two, fileList_three, fileList_other } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props_one = {
            action: '',
            fileList: fileList_one,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        Photo: rep,
                        fileList_one: fileList
                    });
                });
                return false;
            }
        };
        const props_two = {
            action: '',
            fileList: fileList_two,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        LocalPhoto: rep,
                        fileList_two: fileList
                    });
                });
                return false;
            }
        };
        const props_three = {
            action: '',
            fileList: fileList_three,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        MostPhoto: rep,
                        fileList_three: fileList
                    });
                });
                return false;
            }
        };
        const props_other = {
            action: '',
            fileList: fileList_other,
            beforeUpload: (file, fileList) => {
                const formdata = new FormData();
                formdata.append('a_file', file);
                const { postUploadImage } = this.props.actions;
                postUploadImage({}, formdata).then((rep) => {
                    fileList[0].url = FOREST_API + '/' + rep;
                    this.setState({
                        OtherPhoto: rep,
                        fileList_other: fileList
                    });
                });
                return false;
            }
        };
        return (
            <div className='add-seedling' style={{padding: '0 20px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='树种名称'>
                                <Cascader options={treeTypes} loadData={this.loadTreeTypes} onChange={this.handleTreeTypes}
                                    placeholder='请选择苗木品种' style={{width: 200}} />
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
                                    multiple
                                    style={{ width: 350 }}
                                    placeholder='请选择供应商'
                                    onChange={this.addSupplier}
                                >
                                    <Option value='1'>Lucy</Option>
                                </Select>
                            </FormItem>
                            <FormItem label='规格' className='label-block'>
                                <Button type='primary' onClick={this.addVersion}
                                    style={{position: 'absolute', left: 680, top: -40, zIndex: 100}}>新增</Button>
                                <Table columns={this.columns} dataSource={dataList} bordered style={{minWidth: 700}} pagination={false} />
                            </FormItem>
                            <FormItem label='上传照片' className='label-block'>
                                <Row style={{width: 520}}>
                                    <Col span={6}>
                                        <Upload {...props_one}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>单株全景</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_two}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>局部特写</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_three}>
                                            <Icon type='plus' className='upload-icon' />
                                        </Upload>
                                        <p>成片栽植</p>
                                    </Col>
                                    <Col span={6}>
                                        <Upload {...props_other}>
                                            <Icon type='plus' className='upload-icon' />
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
                                <Button style={{marginRight: 20}}>暂存</Button>
                                <Button type='primary' onClick={this.toRelease}>发布</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
                <Modal title='添加供应商' visible={showModal}
                    onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <p>some contents...</p>
                </Modal>
            </div>
        );
    }
    addVersion () {
        const obj = {
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Price: '',
            Stock: ''
        };
        let { dataList } = this.state;
        dataList.push(obj);
        this.setState({
            dataList
        });
    }
    editVersion (str, index, e) {
        console.log(str, index, e);
        this.state.dataList[index][str] = e.target.value;
        this.setState({
            dataList: [...this.state.dataList]
        });
    }
    handleTreeTypes (value, selectedOptions) {
        if (selectedOptions.length === 2) {
            this.setState({
                TreeTypeName: selectedOptions[1].TreeTypeName,
                TreeTypeID: selectedOptions[1].ID
            });
        }
    }
    loadTreeTypes (selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(selectedOptions);
        const { getTreeTypes } = this.props.actions;
        setTimeout(() => {
            targetOption.loading = false;
            // 获取树种类型
            getTreeTypes().then(rep => {
                TREETYPENO.map(item => {
                    item.children = [];
                    rep.map(row => {
                        row.value = row.ID;
                        row.label = row.TreeTypeName;
                        if (item.id === row.TreeTypeNo.slice(0, 1)) {
                            item.children.push(row);
                        }
                    });
                });
                this.setState({
                    treeTypes: TREETYPENO
                });
            });
        }, 10);
    }
    toRelease () {
        const formVal = this.props.form.getFieldsValue();
        const { TreeTypeName, TreeTypeID, Photo, LocalPhoto, MostPhoto, OtherPhoto, dataList } = this.state;
        console.log(dataList);
        const { AddCommodity } = this.props.actions;

        AddCommodity({}, {
            TreeTypeID,
            TreeTypeName,
            Photo,
            LocalPhoto,
            MostPhoto,
            OtherPhoto,
            TreeDescribe: formVal.TreeDescribe
        }).then(rep => {
            console.log(rep);
            if (rep.code === 1) {
                message.success('发布成功');
            }
        });
    }
    addSupplier () {
        this.setState({
            showModal: true
        });
    }
    handleCancel () {

    }
    handleOk () {
        this.setState({
            showModal: false
        });
    }
}

export default Form.create()(DataList);

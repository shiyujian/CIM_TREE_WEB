
import React, {Component} from 'react';
import { Form, Input, Button, Tabs, Select, Table, Upload, Row, Col, Icon, Modal, Cascader, message, Card, DatePicker  } from 'antd';
import { TREETYPENO, FOREST_API, postUploadImage } from '_platform/api';
import { searchToObj, getUser } from '_platform/auth';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;
const { RangePicker } = DatePicker;
class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            productInfo: null, // 回显信息
            Option_section: [], // 标段
            Option: [], // 工程
            options: [], // 行政区划
            card: [], // 卡片个数
            treeNames: [], // 树木名称数组
            ProjectName: '', // 项目名称
            Section: '', // 标段
            TreeTypeID: '', // 树木ID
            length: 0, // 树种个数
            dataList: [] // 数组
        };
        this.treeTypes = [];
        this.handleProjectName = this.handleProjectName.bind(this); // 项目名称
        this.handleSectionName = this.handleSectionName.bind(this); // 标段选择
        this.loadRegion = this.loadRegion.bind(this); // 加载市县
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.handleRange = this.handleRange.bind(this); // 起止日期
        this.onAddSpecs = this.onAddSpecs.bind(this); // 新增树种
        this.handleTreeTypes = this.handleTreeTypes.bind(this); // 树木类型改变
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'DBH',
            key: '1',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'DBH', index, record)} />;
            }
        }, {
            title: '地径（cm）',
            dataIndex: 'GroundDiameter',
            key: '2',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'GroundDiameter', index, record)} />;
            }
        }, {
            title: '冠幅（cm）',
            dataIndex: 'CrownWidth',
            key: '3',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'CrownWidth', index, record)} />;
            }
        }, {
            title: '自然高（cm）',
            dataIndex: 'Height',
            key: '4',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Height', index, record)} />;
            }
        }, {
            title: '培育方式',
            dataIndex: 'CultivationMode',
            key: '5',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'CultivationMode', index, record)} />;
            }
        }, {
            title: '价格（元）',
            dataIndex: 'Price',
            key: '6',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Price', index, record)} />;
            }
        }, {
            title: '库存（棵）',
            dataIndex: 'Stock',
            key: '7',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Stock', record, index)} />;
            }
        }];
    }
    componentDidMount () {
        const { getTreeTypes, getRegionCodes, getWpunittree, getNurseryByPk, getPurchaseById } = this.props.actions;  
        // 获得所有项目
        getWpunittree().then(rep => {
            let arr = [];
            rep.map(item => {
                if (item['No'].indexOf('-') === -1) {
                    arr.push(item);
                };
            });
            this.setState({
                Option: arr
            });
        });
        // 获取行政区划编码
        getRegionCodes({}, {grade: 1}).then(rep => {
            let province = [];
            rep.map(item => {
                province.push({
                    value: item.ID,
                    label: item.Name,
                    isLeaf: false
                });
            });
            this.setState({
                options: province
            });
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
        // 编辑商品
        const { id } = searchToObj(this.props.location.search);
        if (id) {
            getPurchaseById({id}).then(rep => {
                this.setState({
                    purchaseInfo: rep
                });
            });
        }
        // 获取树种类型
        getTreeTypes().then(rep => {
            TREETYPENO.map(item => {
                item.value = item.id;
                item.label = item.name;
                item.isLeaf = false;
                item.children = [];
                rep.map(row => {
                    row.value = row.ID;
                    row.label = row.TreeTypeName;
                    if (item.id === row.TreeTypeNo.slice(0, 1)) {
                        item.children.push(row);
                    }
                });
            });
            this.treeTypes = TREETYPENO;
            // 加载一个card
            this.onAddSpecs();
        });
    }
    render () {
        const { purchaseInfo, Option, Option_section, options } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='add-seedling' style={{padding: '0 20px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='项目名称'>
                                <Select
                                    defaultValue={purchaseInfo ? purchaseInfo['ProjectName'] : ''}
                                    allowClear style={{width: 150}}
                                    onChange={this.handleProjectName}
                                >
                                    {
                                        Option.length > 0 ? Option.map(item => {
                                            return <Option value={item.No}>{item.Name}</Option>;
                                        }) : null
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='标段选择'>
                                <Select
                                    allowClear style={{width: 150}}
                                    onChange={this.handleSectionName}
                                >
                                    {
                                        Option_section.length > 0 ? Option_section.map(item => {
                                            return <Option value={item.No}>{item.Name}</Option>;
                                        }) : null
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='用苗地'>
                                {getFieldDecorator('UseNurseryRegionCode', {
                                    rules: [{required: true, message: '必填项'}]
                                })(
                                    <Cascader placeholder='选择您所在的城市'
                                        loadData={this.loadRegion}
                                        options={options}
                                        onChange={this.handleRegion}
                                        changeOnSelect
                                    />
                                )}
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
                            <FormItem label='报价起止日期'>
                                {getFieldDecorator('LeaderPhone')(
                                    <RangePicker
                                        onChange={this.handleRange}
                                    />
                                )}
                            </FormItem>
                            <h2>树种/规格</h2>
                            <Button onClick={this.onAddSpecs}>新增树种</Button>
                            {
                                this.state.card
                            }
                            <FormItem label='文本介绍' className='label-block'>
                                {getFieldDecorator('TreeDescribe', {
                                    initialValue: purchaseInfo ? purchaseInfo.TreeDescribe : ''
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
    editVersion (str, index, record, e) {
        let { dataList } = this.state;
        dataList[record.cardKey][index][str] = e.target.value;
        this.setState({
            dataList
        });
    }
    toRelease (Status) {
        const formVal = this.props.form.getFieldsValue();
        const { RegionCode, StartTime, EndTime, dataList, ProjectName, Section } = this.state;
        const { postPurchase } = this.props.actions;
        let Specs = [];
        dataList.map(item => {
            item.map(ite => {
                Specs.push(ite);
            });
        });
        postPurchase({}, {
            StartTime,
            EndTime,
            ProjectName,
            Section,
            UseNurseryRegionCode: RegionCode,
            TreeDescribe: formVal.TreeDescribe,
            Status,
            Specs
        }).then(rep => {
            if (rep.code === 1 && Status === 1) {
                message.success('发布成功');
            } else if (rep.code === 1 && Status === 0) {
                message.success('暂存成功');
            } else if (rep.code === 2) {
                message.error('该商品已存在');
            }
        });
    }
    handleProjectName (value) {
        const { getWpunittree } = this.props.actions;
        this.setState({
            ProjectName: value
        });
        getWpunittree().then(rep => {
            let arr = [];
            rep.map(item => {
                if (item['No'].length === 10 && item['No'].indexOf(value) > -1) {
                    arr.push(item);
                }
            });
            this.setState({
                Option_section: arr
            });
        });
    }

    handleSectionName (value) {
        this.setState({
            Section: value
        });
    }
    loadRegion (selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(() => {
            targetOption.loading = false;
            const { getRegionCodes } = this.props.actions;
            targetOption.children = [];
            getRegionCodes({}, {parent: targetOption.value}).then(rep => {
                rep.map(item => {
                    if (item.LevelType === '3') {
                        targetOption.children.push({
                            value: item.ID,
                            label: item.Name
                        });
                    } else {
                        targetOption.children.push({
                            value: item.ID,
                            label: item.Name,
                            isLeaf: false
                        });
                    }
                });
                this.setState({
                    options: [...this.state.options]
                });
            });
        }, 100);
    }
    handleRegion (value) {
        let RegionCode = value[value.length - 1];
        this.setState({
            RegionCode
        });
    }
    handleRange (date, dateString) {
        this.setState({
            StartTime: dateString[0],
            EndTime: dateString[1]
        });
    }
    addVersion (cardKey) {
        if (!this.state.TreeTypeID) {
            message.error('请选择树种');
            return;
        }
        let { dataList, length, card, TreeTypeID } = this.state;
        const obj = {
            number: dataList[length - 1].length,
            cardKey,
            TreeTypeID,
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Price: '',
            Stock: ''
        };
        dataList[cardKey].push(obj);
        card[cardKey] = <Card key={cardKey}>
            <div style={{marginBottom: 10}}>
                <span>树木名称：</span>
                <Cascader options={this.treeTypes} onChange={this.handleTreeTypes}
                    placeholder='请选择苗木品种' style={{width: 200}} />
                <Button type='primary' onClick={this.addVersion.bind(this, length - 1)} style={{float: 'right'}}>新增规格</Button>
            </div>
            <Table columns={this.columns} dataSource={dataList[cardKey]} bordered style={{minWidth: 700}} pagination={false} rowKey='number' />
        </Card>;
        this.setState({
            dataList,
            card
        });
    }
    onAddSpecs () {
        let { card, length, dataList } = this.state;
        let dom = <Card key={card.length}>
            <div style={{marginBottom: 10}}>
                <span>树木名称：</span>
                <Cascader options={this.treeTypes} onChange={this.handleTreeTypes}
                    placeholder='请选择苗木品种' style={{width: 200}} />
                <Button type='primary' onClick={this.addVersion.bind(this, length)} style={{float: 'right'}}>新增规格</Button>
            </div>
            <Table columns={this.columns} bordered style={{minWidth: 700}} pagination={false} rowKey='number' />
        </Card>;
        card.push(dom);
        dataList[length] = [];
        length += 1;
        this.setState({
            length,
            dataList,
            card
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
}

export default Form.create()(DataList);

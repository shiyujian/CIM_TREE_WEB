
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
            sectionList: [], // 标段
            projectList: [], // 项目列表
            optionList: [], // 行政区划
            card: [], // 卡片个数
            Contacter: '', //联系人
            Phone: '', // 联系电话
            treeNames: [], // 树木名称数组
            ProjectName: '', // 项目名称
            Section: '', // 标段
            TreeTypeID: '', // 树木ID
            length: 0, // 树种个数
            dataList: [] // 数组
        };
        this.Creater = ''; // 发布者
        this.CreaterOrg = ''; // 发布者所在单位org
        this.TreeTypeList = []; // 树种类型
        this.UseNurseryAddress = ''; // 行政区划地址
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
                return (
                    <Select style={{ width: 100 }} onChange={this.editVersionMode.bind(this, 'CultivationMode', index, record)}>
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
            title: '库存（棵）',
            dataIndex: 'Num',
            key: '7',
            render: (text, record, index) => {
                return <Input onChange={this.editVersion.bind(this, 'Num', index, record)} />;
            }
        }];
    }
    componentDidMount () {
        const { getTreeTypes, getRegionCodes, getWpunittree, getOrgTree_new, getPurchaseById } = this.props.actions;  
        // 获得所有项目
        getWpunittree().then(rep => {
            let arr = [];
            rep.map(item => {
                if (item['No'].indexOf('-') === -1) {
                    arr.push(item);
                };
            });
            this.setState({
                projectList: arr
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
                optionList: province
            });
        });
        // 获取施工方的责任人电话
        const { id, org_code, phone, name } = getUser();
        console.log(getUser());
        this.Creater = id;
        this.CreaterOrg = org_code;
        this.setState({
            Contacter: name,
            Phone: phone
        })
        // 编辑商品
        const { key } = searchToObj(this.props.location.search);
        if (key) {
            getPurchaseById({id: key}).then(rep => {
                this.setState({
                    purchaseInfo: rep,
                    ProjectName: rep.ProjectName
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
            this.TreeTypeList = TREETYPENO;
            // 加载一个card
            this.onAddSpecs();
        });
    }
    render () {
        const { purchaseInfo, Contacter, Phone, ProjectName, projectList, sectionList, optionList } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='add-seedling' style={{padding: '0 20px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='项目名称'>
                                <Select
                                    defaultValue={ProjectName}
                                    allowClear style={{width: 150}}
                                    onChange={this.handleProjectName}
                                >
                                    {
                                        projectList.length > 0 ? projectList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        }) : []
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='标段选择'>
                                <Select
                                    allowClear style={{width: 150}}
                                    onChange={this.handleSectionName}
                                >
                                    {
                                        sectionList.length > 0 ? sectionList.map(item => {
                                            return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                        }) : []
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label='用苗地'>
                                {getFieldDecorator('UseNurseryRegionCode', {
                                    rules: [{required: true, message: '必填项'}]
                                })(
                                    <Cascader placeholder='选择您所在的城市'
                                        loadData={this.loadRegion}
                                        options={optionList}
                                        onChange={this.handleRegion}
                                        changeOnSelect
                                    />
                                )}
                            </FormItem>
                            <FormItem label='联系人'>
                                <Input disabled value={Contacter}/>
                            </FormItem>
                            <FormItem label='联系电话'>
                                <Input disabled value={Phone}/>
                            </FormItem>
                            <FormItem label='报价起止日期'>
                                <RangePicker
                                    onChange={this.handleRange}
                                />
                            </FormItem>
                            <h2>树种/规格</h2>
                            <Button onClick={this.onAddSpecs} type='primary'>新增树种</Button>
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
    editVersionMode (str, index, record, value) {
        let { dataList } = this.state;
        dataList[record.cardKey][index][str] = value;
        this.setState({
            dataList
        });
    }
    toRelease (Status) {
        const formVal = this.props.form.getFieldsValue();
        const { productInfo, Contacter, Phone, RegionCode, StartTime, EndTime, dataList, ProjectName, Section } = this.state;
        const { postPurchase, putPurchase } = this.props.actions;
        let Specs = [];
        dataList.map(item => {
            item.map(ite => {
                Specs.push(ite);
            });
        });
        const pro = {
            UseNurseryAddress: this.UseNurseryAddress,
            Contacter,
            Phone,
            Creater: this.Creater,
            CreaterOrg: this.CreaterOrg,
            StartTime,
            EndTime,
            ProjectName,
            Section,
            UseNurseryRegionCode: RegionCode,
            TreeDescribe: formVal.TreeDescribe,
            Status,
            Specs
        };
        if (productInfo) {
            pro.ID = productInfo.ID;
            putPurchase({}, pro).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('编辑成功');
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                }
            });
        } else {
            postPurchase({}, pro).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('发布成功');
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                } else {
                    message.error('操作失败');
                }
            });
        }
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
                sectionList: arr
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
                    optionList: [...this.state.optionList]
                });
            });
        }, 100);
    }
    handleRegion (value, selectedOptions) {
        console.log(selectedOptions, '---');
        let RegionCode = value[value.length - 1];
        selectedOptions.map(item => {
            this.UseNurseryAddress = this.UseNurseryAddress + item.label + '/';
        });
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
            Num: ''
        };
        dataList[cardKey].push(obj);
        card[cardKey] = <Card key={cardKey}>
            <div style={{marginBottom: 10}}>
                <span>树木名称：</span>
                <Cascader options={this.TreeTypeList} onChange={this.handleTreeTypes}
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
                <Cascader options={this.TreeTypeList} onChange={this.handleTreeTypes}
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

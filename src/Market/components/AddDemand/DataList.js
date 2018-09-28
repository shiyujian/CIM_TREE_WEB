
import React, {Component} from 'react';
import moment from 'moment';
import { Form, Input, Button, Tabs, Select, Table, Cascader, message, Card, DatePicker } from 'antd';
import { TREETYPENO } from '_platform/api';
import { searchToObj, getUser } from '_platform/auth';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
class DataList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            productInfo: null, // 回显信息
            sectionList: [], // 标段
            projectList: [], // 项目列表
            TreeTypeList: [], // 树种类型
            RegionCodeList: [], // 行政区划
            Contacter: '', // 联系人
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
        this.SectionList = []; // 标段列表
        this.UseNurseryAddress = ''; // 行政区划地址
        this.purchaseid = ''; // 采购单ID
        this.handleProjectName = this.handleProjectName.bind(this); // 项目名称
        this.handleSectionName = this.handleSectionName.bind(this); // 标段选择
        this.loadRegion = this.loadRegion.bind(this); // 加载市县
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.handleRange = this.handleRange.bind(this); // 起止日期
        this.onAddSpecs = this.onAddSpecs.bind(this); // 新增树种
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'DBH',
            key: '1',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'DBH', index, record)} />;
            }
        }, {
            title: '地径（cm）',
            dataIndex: 'GroundDiameter',
            key: '2',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'GroundDiameter', index, record)} />;
            }
        }, {
            title: '冠幅（cm）',
            dataIndex: 'CrownWidth',
            key: '3',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'CrownWidth', index, record)} />;
            }
        }, {
            title: '自然高（cm）',
            dataIndex: 'Height',
            key: '4',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Height', index, record)} />;
            }
        }, {
            title: '培育方式',
            dataIndex: 'CultivationMode',
            key: '5',
            render: (text, record, index) => {
                return (
                    <Select value={text} style={{ width: 100 }} onChange={this.editVersionMode.bind(this, 'CultivationMode', index, record)}>
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
                return <Input value={text} onChange={this.editVersion.bind(this, 'Num', index, record)} />;
            }
        }];
    }
    componentDidMount () {
        const { getTreeTypes, getRegionCodes, getWpunittree, getPurchaseById, getPurchaseStandard } = this.props.actions;
        // 获得所有项目
        getWpunittree().then(rep => {
            let projectList = [];
            let sectionList = [];
            rep.map(item => {
                if (item['No'].length === 10) {
                    sectionList.push(item);
                }
                if (item['No'].indexOf('-') === -1) {
                    projectList.push(item);
                };
            });
            this.SectionList = sectionList;
            this.setState({
                projectList,
                sectionList
            });
        });
        // 获取行政区划编码
        getRegionCodes({}, {grade: 1}).then(rep => {
            let RegionCodeList = [];
            rep.map(item => {
                RegionCodeList.push({
                    value: item.ID,
                    label: item.Name,
                    isLeaf: false
                });
            });
            this.setState({
                RegionCodeList
            });
        });
        
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
            this.setState({
                TreeTypeList: TREETYPENO
            });
            console.log(this.state.TreeTypeList);
        });
        // 编辑采购单
        const { key } = searchToObj(this.props.location.search);
        this.purchaseid = key;
        if (key) {
            getPurchaseById({id: key}).then(rep => {
                console.log(rep, '采购单详情');
                this.setState({
                    purchaseInfo: rep,
                    ProjectName: rep.ProjectName,
                    Section: rep.Section,
                    StartTime: rep.StartTime,
                    EndTime: rep.EndTime
                });
            });
            getPurchaseStandard({}, {purchaseid: key}).then(rep => {
                console.log(rep, '采购单规格');
                let arr = [];
                rep.map(item => {
                    if (!arr.includes(item.TreeTypeID)) {
                        arr.push(item.TreeTypeID);
                    }
                });
                let dataList = [];
                arr.map((item, index) => {
                    // card数量
                    let arrIndex = [];
                    rep.map(row => {
                        if (row.TreeTypeID === item) {
                            arrIndex.push(row);
                        }
                    });
                    dataList.push(arrIndex);
                });
                console.log(dataList);
                this.setState({
                    dataList
                });
            });
        }
        // 获取施工方的责任人电话
        const { id, org_code, phone, name } = getUser();
        console.log(getUser());
        this.Creater = id;
        this.CreaterOrg = org_code;
        this.setState({
            Contacter: name,
            Phone: phone
        });
    }
    renderCard () {
        let card = [];
        const { getTreeTypes } = this.props.actions;
        this.state.dataList.map((item, index) => {
            let str = '';
            card.push(
                <Card key={index}>
                    <div style={{marginBottom: 10}}>
                        <span>树木名称：</span>
                        <Cascader value={[str, item[0].TreeTypeID]} options={this.state.TreeTypeList} onChange={this.handleTreeTypes.bind(this, index)}
                            placeholder='请选择苗木品种' style={{width: 200}} />
                        <Button type='primary' onClick={this.addVersion.bind(this, index, item.length)} style={{float: 'right'}}>新增规格</Button>
                    </div>
                    <Table columns={this.columns} dataSource={item} bordered style={{minWidth: 700}} pagination={false} rowKey='number' />
                </Card>
            );
        });
        return card;
    }
    render () {
        const { purchaseInfo, Contacter, Phone, ProjectName, Section, projectList, sectionList, RegionCodeList, StartTime, EndTime } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='add-seedling' style={{padding: '0 20px'}}>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='项目名称'>
                                <Select
                                    value={ProjectName}
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
                                    value={Section}
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
                                        options={RegionCodeList}
                                        onChange={this.handleRegion}
                                        changeOnSelect
                                    />
                                )}
                            </FormItem>
                            <FormItem label='联系人'>
                                <Input disabled value={Contacter} />
                            </FormItem>
                            <FormItem label='联系电话'>
                                <Input disabled value={Phone} />
                            </FormItem>
                            <FormItem label='报价起止日期'>
                                <RangePicker value={
                                    StartTime ? [moment(StartTime, dateFormat), moment(EndTime, dateFormat)] : []
                                } onChange={this.handleRange}
                                />
                            </FormItem>
                            <h2>树种/规格</h2>
                            <Button onClick={this.onAddSpecs} type='primary'>新增树种</Button>
                            {
                                this.renderCard()
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
        let sectionList = [];
        this.SectionList.map(item => {
            if (item['No'].indexOf(value) > -1) {
                sectionList.push(item);
            }
        });
        this.setState({
            ProjectName: value,
            sectionList
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
                            MergerName: item.MergerName,
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
                    RegionCodeList: [...this.state.RegionCodeList]
                });
            });
        }, 100);
    }
    handleRegion (value, selectedOptions) {
        if (value.length === 3) {
            this.UseNurseryAddress = selectedOptions[2].MergerName;
            let RegionCode = value[value.length - 1];
            this.setState({
                RegionCode
            });
        }
    }
    handleRange (date, dateString) {
        this.setState({
            StartTime: dateString[0],
            EndTime: dateString[1]
        });
    }
    addVersion (cardKey, rowKey) {
        if (!this.state.TreeTypeID) {
            message.error('请选择树种');
            return;
        }
        let { dataList } = this.state;
        const obj = {
            number: rowKey,
            cardKey: cardKey,
            TreeTypeID: dataList[cardKey][0].TreeTypeID,
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Num: ''
        };
        dataList[cardKey].push(obj);
        this.setState({
            dataList
        });
    }
    onAddSpecs () {
        let { dataList } = this.state;
        dataList[dataList.length] = [{
            number: 0,
            cardKey: dataList.length,
            TreeTypeID: '',
            DBH: '',
            GroundDiameter: '',
            CrownWidth: '',
            Height: '',
            CultivationMode: '',
            Num: ''
        }];
        this.setState({
            dataList
        });
    }
    handleTreeTypes (cardKey, value, selectedOptions) {
        console.log(value);
        if (selectedOptions.length === 2) {
            this.setState({
                TreeTypeName: selectedOptions[1].TreeTypeName,
                TreeTypeID: selectedOptions[1].ID
            });
            this.state.dataList.map((item, index) => {
                if (index === cardKey) {
                    item[0].TreeTypeID = selectedOptions[1].ID;
                }
            });
        }
    }
}

export default Form.create()(DataList);

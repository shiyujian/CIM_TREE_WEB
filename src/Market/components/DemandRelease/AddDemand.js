
import React, {Component} from 'react';
import moment from 'moment';
import { Form, Input, Button, Tabs, Select, Table, Cascader, message, Card, DatePicker } from 'antd';
import { TREETYPENO, CULTIVATIONMODE } from '_platform/api';
import { getUser } from '_platform/auth';
import './AddDemand.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TextArea = Input.TextArea;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
class AddDemand extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isAmend: false, // 是否为编辑状态
            purchaseInfo: null, // 回显信息
            sectionList: [], // 标段
            projectList: [], // 项目列表
            RegionCode: '', // 行政区划
            treeNames: [], // 树木名称数组
            ProjectName: '', // 项目名称
            Section: '', // 标段
            length: 0, // 树种个数
            treeTypeList: [], // 未分组树种
            PurchaseDescribe: '', // 求购描述
            dataList: [] // 数组
        };
        this.Creater = ''; // 发布者
        this.CreaterOrg = ''; // 发布者所在单位org
        this.SectionList = []; // 标段列表
        this.UseNurseryAddress = ''; // 行政区划地址
        this.purchaseid = ''; // 采购单ID
        this.TreeTypeList = []; // 树种类型树列表
        this.RegionCodeList = []; // 行政区划树列表
        this.handleProjectName = this.handleProjectName.bind(this); // 项目名称
        this.handleSectionName = this.handleSectionName.bind(this); // 标段选择
        this.handleRegion = this.handleRegion.bind(this); // 行政区划
        this.handleRange = this.handleRange.bind(this); // 起止日期
        this.onAddSpecs = this.onAddSpecs.bind(this); // 新增树种
        this.handleDescribe = this.handleDescribe.bind(this); // 描述
        this.columns = [{
            title: '胸径（cm）',
            dataIndex: 'DBH',
            key: '1',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'DBH', record)} />;
            }
        }, {
            title: '地径（cm）',
            dataIndex: 'GroundDiameter',
            key: '2',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'GroundDiameter', record)} />;
            }
        }, {
            title: '冠幅（cm）',
            dataIndex: 'CrownWidth',
            key: '3',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'CrownWidth', record)} />;
            }
        }, {
            title: '自然高（cm）',
            dataIndex: 'Height',
            key: '4',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Height', record)} />;
            }
        }, {
            title: '培育方式',
            dataIndex: 'CultivationMode',
            key: '5',
            render: (text, record, index) => {
                return (
                    <Select value={text} style={{ width: 100 }} onChange={this.editVersionMode.bind(this, 'CultivationMode', record)}>
                        {
                            CULTIVATIONMODE.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                        }
                    </Select>
                );
            }
        }, {
            title: '需求量（棵）',
            dataIndex: 'Num',
            key: '7',
            render: (text, record, index) => {
                return <Input value={text} onChange={this.editVersion.bind(this, 'Num', record)} />;
            }
        }, {
            title: '操作',
            dataIndex: '编辑',
            key: '8',
            width: 70,
            render: (text, record, index) => {
                return (
                    <span>
                        <a onClick={this.toDelete.bind(this, record)}>删除</a>
                    </span>
                );
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
        if (window.localStorage.getItem('RegionCodeList')) {
            this.RegionCodeList = JSON.parse(window.localStorage.getItem('RegionCodeList'));
        } else {
            getRegionCodes().then(rep => {
                let RegionCodeList = [];
                rep.map(item => {
                    if (item.LevelType === '1') {
                        RegionCodeList.push({
                            value: item.ID,
                            label: item.Name
                        });
                    }
                });
                RegionCodeList.map(item => {
                    let arrCity = [];
                    rep.map(row => {
                        if (row.LevelType === '2' && item.value === row.ParentId) {
                            arrCity.push({
                                value: row.ID,
                                label: row.Name
                            });
                        }
                    });
                    arrCity.map(row => {
                        let arrCounty = [];
                        rep.map(record => {
                            if (record.LevelType === '3' && row.value === record.ParentId) {
                                arrCounty.push({
                                    value: record.ID,
                                    label: record.Name
                                });
                            }
                        });
                        row.children = arrCounty;
                    });
                    item.children = arrCity;
                });
                window.localStorage.setItem('RegionCodeList', JSON.stringify(RegionCodeList));
                this.RegionCodeList = RegionCodeList;
            });
        }
        // 获取树种类型
        if (window.localStorage.getItem('TreeTypeList')) {
            this.TreeTypeList = JSON.parse(window.localStorage.getItem('TreeTypeList'));
            getTreeTypes().then(rep => {
                this.setState({
                    treeTypeList: rep
                });
            });
        } else {
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
                window.localStorage.setItem('TreeTypeList', JSON.stringify(TREETYPENO));
                this.TreeTypeList = TREETYPENO;
                this.setState({
                    treeTypeList: rep
                });
            });
        }
        // 获取施工方的责任人电话
        const { id, org_code, phone, name } = getUser();
        this.Creater = id;
        this.CreaterOrg = org_code;
        this.props.form.setFieldsValue({
            Contacter: name,
            Phone: phone
        });
        // 编辑采购单
        this.purchaseid = this.props.addDemandKey;
        if (typeof this.purchaseid === 'string') {
            getPurchaseById({id: this.purchaseid}).then(rep => {
                this.setState({
                    isAmend: true,
                    ProjectName: rep.ProjectName,
                    Section: rep.Section,
                    StartTime: rep.StartTime,
                    EndTime: rep.EndTime,
                    RegionCode: rep.UseNurseryRegionCode,
                    PurchaseDescribe: rep.PurchaseDescribe || ''
                });
                this.props.form.setFieldsValue({
                    Contacter: rep.Contacter,
                    Phone: rep.Phone
                });
                this.UseNurseryAddress = rep.UseNurseryAddress;
            });
            // 根据采购单id获取采购单规格
            getPurchaseStandard({}, {purchaseid: this.purchaseid}).then(rep => {
                let arr = [];
                rep.map(item => {
                    if (!arr.includes(item.TreeTypeID)) {
                        arr.push(item.TreeTypeID);
                    }
                });
                let dataList = [];
                arr.map((item, index) => {
                    // card数量
                    let children = [];
                    let TreeTypeName = '';
                    rep.map(row => {
                        if (row.TreeTypeID === item) {
                            TreeTypeName = row.TreeTypeName;
                            children.push({
                                CrownWidth: row.CrownWidth,
                                CultivationMode: row.CultivationMode,
                                DBH: row.DBH,
                                GroundDiameter: row.GroundDiameter,
                                Height: row.Height,
                                Num: row.Num
                            });
                        }
                    });
                    children.map((row, num) => {
                        row.rowKey = num;
                        row.cardKey = index;
                    });
                    dataList.push({
                        TreeTypeID: item,
                        TreeTypeName,
                        cardKey: index,
                        children
                    });
                });
                this.setState({
                    dataList
                });
            });
        } else {
            // 新增树种
            this.onAddSpecs();
        }
    }
    renderCard () {
        let card = [];
        this.state.dataList.map((item, index) => {
            let TreeType = '';
            let TreeTypeID = '';
            this.state.treeTypeList.map(row => {
                if (row.ID === item.TreeTypeID) {
                    TreeType = row.TreeTypeNo.slice(0, 1);
                    TreeTypeID = item.TreeTypeID;
                }
            });
            card.push(
                <Card key={item.cardKey}>
                    <div style={{marginBottom: 10}}>
                        <span>树木名称：</span>
                        <Cascader value={[TreeType, TreeTypeID]} options={this.TreeTypeList} onChange={this.handleTreeTypes.bind(this, item.cardKey)}
                            placeholder='请选择苗木品种' style={{width: 200}} />
                        <span style={{float: 'right'}}>
                            <Button type='primary' onClick={this.deleteCard.bind(this, item.cardKey)} style={{marginRight: 20}}>删除树种</Button>
                            <Button type='primary' onClick={this.addVersion.bind(this, item.cardKey, item.children.length)}>新增规格</Button>
                        </span>
                    </div>
                    <Table columns={this.columns} dataSource={item.children} bordered style={{minWidth: 700}} pagination={false} rowKey='rowKey' />
                </Card>
            );
        });
        return card;
    }
    render () {
        const { isAmend, ProjectName, Section, projectList, sectionList, RegionCode, StartTime, EndTime, PurchaseDescribe } = this.state;
        const { getFieldDecorator } = this.props.form;
        let provinceCode = '';
        let sityCode = '';
        if (RegionCode) {
            provinceCode = RegionCode.slice(0, 2) + '0000';
            sityCode = RegionCode.slice(0, 4) + '00';
        }
        return (
            <div className='addDemand' style={{padding: '0 20px'}}>
                <Button type='primary' onClick={this.toReturn.bind(this)} style={{marginBottom: 5}}>返 回</Button>
                <Tabs defaultActiveKey='1' onChange={this.handlePane}>
                    <TabPane tab='填写信息' key='1'>
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <FormItem label='项目名称'>
                                <Select
                                    disabled={isAmend}
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
                                    disabled={isAmend}
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
                                    rules: [{required: true, message: '必填项'}],
                                    initialValue: [provinceCode, sityCode, RegionCode]
                                })(
                                    <Cascader placeholder='选择您所在的城市'
                                        options={this.RegionCodeList}
                                        onChange={this.handleRegion}
                                        changeOnSelect
                                        style={{width: 200}}
                                    />
                                )}
                            </FormItem>
                            <FormItem label='联系人'>
                                {getFieldDecorator('Contacter')(
                                    <Input className='search-input' />
                                )}
                            </FormItem>
                            <FormItem label='联系电话'>
                                {getFieldDecorator('Phone')(
                                    <Input className='search-input' />
                                )}
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
                            <FormItem label='求购描述' className='label-block'>
                                <TextArea rows={4} style={{width: 750}} value={PurchaseDescribe} onChange={this.handleDescribe} />
                            </FormItem>
                            <FormItem style={{width: 800, textAlign: 'center'}}>
                                <Button style={{marginRight: 20}} onClick={this.toRelease.bind(this, 0)}>{isAmend ? '保存' : '暂存'}</Button>
                                <Button type='primary' onClick={this.toCheck.bind(this)}>发布</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
    deleteCard (cardKey) {
        const { dataList } = this.state;
        let newDataList = [];
        dataList.map(item => {
            if (item.cardKey !== cardKey) {
                newDataList.push(item);
            }
        });
        newDataList.map((item, index) => {
            item.cardKey = index;
        });
        this.setState({
            dataList: newDataList
        });
    }
    toReturn () {
        this.props.actions.changeAddDemandVisible(false);
    }
    editVersion (str, record, e) {
        let { dataList } = this.state;
        dataList.map(item => {
            if (item.cardKey === record.cardKey) {
                item.children.map(row => {
                    if (row.rowKey === record.rowKey) {
                        row[str] = e.target.value;
                    }
                });
            }
        });
        this.setState({
            dataList
        });
    }
    editVersionMode (str, record, value) {
        let { dataList } = this.state;
        dataList.map(item => {
            if (item.cardKey === record.cardKey) {
                item.children.map(row => {
                    if (row.rowKey === record.rowKey) {
                        row[str] = value;
                    }
                });
            }
        });
        this.setState({
            dataList
        });
    }
    toCheck () {
        const { ProjectName, Section, RegionCode } = this.state;
        const { Contacter, Phone } = this.props.form.getFieldsValue();
        if (ProjectName === '' && Section === '') {
            message.error('请先选择项目和标段');
            return;
        }
        if (RegionCode === '') {
            message.error('请先选择用苗地');
            return;
        }
        if (Contacter === '' && Phone === '') {
            message.error('请先完成照片上传');
            return;
        }
        this.toRelease(1);
    }
    toRelease (Status) {
        const { isAmend, RegionCode, StartTime, EndTime, dataList, ProjectName, Section, PurchaseDescribe } = this.state;
        const { Contacter, Phone } = this.props.form.getFieldsValue();
        const { postPurchase, putPurchase } = this.props.actions;
        let Specs = [];
        dataList.map(item => {
            item.children.map(row => {
                let obj = {
                    TreeTypeID: item.TreeTypeID,
                    TreeTypeName: item.TreeTypeName,
                    CultivationMode: row.CultivationMode,
                    Num: row.Num,
                    Height: row.Height,
                    CrownWidth: row.CrownWidth,
                    DBH: row.DBH,
                    GroundDiameter: row.GroundDiameter
                };
                Specs.push(obj);
            });
        });
        if (isAmend) {
            putPurchase({}, {
                ID: this.purchaseid,
                ProjectName,
                Section,
                UseNurseryAddress: this.UseNurseryAddress,
                UseNurseryRegionCode: RegionCode,
                Contacter,
                Phone,
                StartTime,
                EndTime,
                Status,
                PurchaseDescribe,
                Specs
            }).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('编辑成功');
                    this.props.actions.changeAddDemandVisible(false);
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                    this.props.actions.changeAddDemandVisible(false);
                } else {
                    message.error('操作失败');
                }
            });
        } else {
            postPurchase({}, {
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
                Specs,
                Status,
                PurchaseDescribe
            }).then(rep => {
                if (rep.code === 1 && Status === 1) {
                    message.success('发布成功');
                    this.props.actions.changeAddDemandVisible(false);
                } else if (rep.code === 1 && Status === 0) {
                    message.success('暂存成功');
                    this.props.actions.changeAddDemandVisible(false);
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
        let { dataList } = this.state;
        dataList.map(item => {
            if (item.cardKey === cardKey) {
                item.children.push({
                    cardKey,
                    rowKey,
                    DBH: '',
                    GroundDiameter: '',
                    CrownWidth: '',
                    Height: '',
                    CultivationMode: '',
                    Num: ''
                });
            }
        });
        this.setState({
            dataList
        });
    }
    onAddSpecs () {
        let { dataList } = this.state;
        dataList.push({
            cardKey: dataList.length,
            TreeTypeID: '',
            TreeTypeName: '',
            children: [{
                cardKey: dataList.length,
                rowKey: 0,
                DBH: '',
                GroundDiameter: '',
                CrownWidth: '',
                Height: '',
                CultivationMode: '',
                Num: ''
            }]
        });
        this.setState({
            dataList
        });
    }
    handleTreeTypes (cardKey, value, selectedOptions) {
        if (selectedOptions.length === 2) {
            const { dataList } = this.state;
            dataList.map((item, index) => {
                if (index === cardKey) {
                    item.TreeTypeID = selectedOptions[1].ID;
                    item.TreeTypeName = selectedOptions[1].TreeTypeName;
                }
            });
            console.log(dataList);
            this.setState({
                dataList
            });
        }
    }
    handleDescribe (e) {
        this.setState({
            PurchaseDescribe: e.target.value
        });
    }
    toDelete (record) {
        const { dataList } = this.state;
        dataList.map(item => {
            if (item.cardKey === record.cardKey) {
                item.children.splice(record.rowKey, 1);
                item.children.map((row, num) => {
                    row.rowKey = num;
                });
            }
        });
        this.setState({
            dataList
        });
    }
}

export default Form.create()(AddDemand);

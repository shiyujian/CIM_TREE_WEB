import React, { Component } from 'react';
import {
    Table,
    Row,
    Col,
    Select,
    Button,
    Spin,
    message,
    Notification,
    Popconfirm
} from 'antd';
import { getUser } from '_platform/auth';
import './index.less';
// import AddSmallClassModal from './AddSmallClassModal';
import AddThinClassModal from './AddThinClassModal';
import {
    getConstructionPackageBySection
} from './auth';
const Option = Select.Option;
export default class ConstructionPackageTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            size: 10,
            section: '',
            smallclass: '',
            thinclass: '',
            percent: 0,
            messageTotalNum: '',
            smallclassData: '',
            thinclassData: '',
            addSmallClassVisible: false,
            addThinClassVisible: false
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },
            {
                title: '区段号',
                dataIndex: 'smallCalss',
                render: (text, record) => {
                    const {
                        smallclass,
                        smallCalssPackageList
                    } = this.state;
                    let smallClassNo = '/';
                    smallCalssPackageList.map((smallClassData) => {
                        if (smallclass === smallClassData.No) {
                            let smallClassNoList = smallClassData.No.split('-');
                            if (smallClassNoList && smallClassNoList instanceof Array && smallClassNoList.length === 4) {
                                smallClassNo = smallClassNoList[0] + '-' + smallClassNoList[1] + '-' + smallClassNoList[3];
                            }
                        }
                    });
                    return <span>{smallClassNo}</span>;
                }
            },
            {
                title: '组团号',
                dataIndex: 'No',
                render: (text, record) => {
                    let thinClassNo = '/';
                    let thinClassNoList = text.split('-');
                    if (thinClassNoList && thinClassNoList instanceof Array && thinClassNoList.length === 5) {
                        thinClassNo = thinClassNoList[0] + '-' + thinClassNoList[1] + '-' + thinClassNoList[3] + '-' + thinClassNoList[4];
                    }
                    return <span>{thinClassNo}</span>;
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    let userData = getUser();
                    if (userData.username === 'admin') {
                        return <Popconfirm
                            title='确认要删除么'
                            onConfirm={this.handleDeleteConstruction.bind(this, record)}
                            onCancel={this.handleDeleteConstructionCancel.bind(this)}
                            okText='Yes'
                            cancelText='No'
                        >
                            <a href='#'>删除</a>
                        </Popconfirm>;
                    } else {
                        return '/';
                    }
                }
            }
        ];
    }
    componentDidMount () {
    }

    onSectionChange = async (value) => {
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: ''
        }, () => {
            if (value) {
                this.handleQuerySmallCalssPackageList();
            }
        });
    }
    handleQuerySmallCalssPackageList = async () => {
        const {
            actions: {
                getThinClassList,
                setConstructionPackageLoading
            }
        } = this.props;
        const {
            section,
            smallclass
        } = this.state;
        await setConstructionPackageLoading(true);
        let smallCalssPackageList = await getConstructionPackageBySection(section, getThinClassList);
        console.log('smallCalssPackageList', smallCalssPackageList);

        this.setSmallClassOption(smallCalssPackageList);
        this.setState({
            smallCalssPackageList
        }, async () => {
            if (smallclass) {
                await this.onSmallClassChange(smallclass);
            }
        });
        await setConstructionPackageLoading(false);
    }
    // 设置区段选项
    setSmallClassOption (rst) {
        if (rst instanceof Array) {
            let smallclassOptions = [];
            rst.map(small => {
                smallclassOptions.push(
                    <Option key={small.No} value={small.No} title={small.Name}>
                        {small.Name}
                    </Option>
                );
            });
            smallclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({
                smallclassoption: smallclassOptions
            });
        }
    }
    onSmallClassChange = async (value) => {
        const {
            smallCalssPackageList
        } = this.state;
        try {
            console.log('onSmallClassChange', smallCalssPackageList);

            smallCalssPackageList.map((smallClassData) => {
                if (value === smallClassData.No) {
                    let thinClassesPackageList = smallClassData.children;
                    this.setState({
                        thinClassesPackageList
                    });
                    this.setThinClassOption(thinClassesPackageList);
                }
            });
            let smallclassData = '';
            if (value) {
                let arr = value.split('-');
                smallclassData = arr[3];
            }
            this.setState({
                smallclass: value,
                smallclassData,
                thinclass: '',
                thinclassData: ''
            });
        } catch (e) {
            console.log('onSmallClassChange', e);
        }
    }
    // 设置组团选项
    setThinClassOption (rst) {
        if (rst instanceof Array) {
            let thinclassOptions = [];
            rst.map(thin => {
                thinclassOptions.push(
                    <Option key={thin.No} value={thin.No} title={thin.Name}>
                        {thin.Name}
                    </Option>
                );
            });
            thinclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                            全部
                </Option>
            );
            this.setState({ thinclassoption: thinclassOptions });
        }
    }

    onThinClassChange (value) {
        try {
            let thinclassData = '';
            if (value) {
                let arr = value.split('-');
                thinclassData = arr[4];
            }
            this.setState({
                thinclass: value,
                thinclassData
            });
        } catch (e) {
            console.log('onThinClassChange', e);
        }
    }
    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }
    query = async (page) => {
        const {
            smallclass,
            thinclass,
            smallCalssPackageList
        } = this.state;
        console.log('query', smallclass);

        if (!smallclass) {
            message.info('请选择项目，标段，区段');
        }
        smallCalssPackageList.map((smallClassData) => {
            if (smallclass === smallClassData.No) {
                if (thinclass) {
                    smallClassData.children.map((thinClassData) => {
                        if (thinclass === thinClassData.No) {
                            let tblData = [thinClassData];
                            this.setState({
                                tblData
                            });
                        }
                    });
                } else {
                    let tblData = smallClassData.children;
                    this.setState({
                        tblData
                    });
                }
            }
        });
    }
    handleAddSmallClassOK = () => {
        this.setState({
            addSmallClassVisible: true
        });
    }
    handleAddSmallClassCancel = () => {
        this.setState({
            addSmallClassVisible: false
        });
    }
    handleAddThinClass = () => {
        this.setState({
            addThinClassVisible: true
        });
    }
    handleAddThinClassOK = async () => {
        await this.handleQuerySmallCalssPackageList();
        this.setState({
            addThinClassVisible: false
        }, async () => {
            await this.query();
        });
    }
    handleAddThinClassCancel = () => {
        this.setState({
            addThinClassVisible: false
        });
    }
    handleDeleteConstructionCancel = () => {

    }
    // 删除组团
    handleDeleteConstruction = async (record) => {
        console.log('record', record);
        const {
            actions: {
                deleteWpunit
            }
        } = this.props;
        const {
            section
        } = this.state;
        let no = record.No;
        let noArr = no.split('-');
        if (noArr && noArr instanceof Array && noArr.length === 5) {
            let LandNo = noArr[0];
            let RegionNo = noArr[1];
            let UnitProjectNo = noArr[2];
            let SmallClass = noArr[3];
            let ThinClass = noArr[4];
            let postData = {
                'LandNo': LandNo, // 地块编码
                'RegionNo': RegionNo, // 区块编码
                'UnitProjectNo': UnitProjectNo, // 标段编码
                'SmallClass': SmallClass, // 区段
                'ThinClass': ThinClass // 组团
            };
            let data = await deleteWpunit({}, postData);
            console.log('data', data);
            if (data && data.code && data.code === 1) {
                Notification.success({
                    message: '删除成功'
                });
                this.setState({
                    thinclass: '',
                    thinclassData: '',
                    tblData: []
                }, async () => {
                    await this.handleQuerySmallCalssPackageList();
                    await this.query();
                });
            } else {
                Notification.error({
                    message: '删除失败'
                });
            }
        } else {
            Notification.error({
                message: '当前组团编号错误，请重新查找'
            });
        }
    }
    render () {
        const { tblData } = this.state;
        const {
            sectionoption,
            constructionPackageLoading = false
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            addSmallClassVisible,
            addThinClassVisible,
            smallclassoption,
            thinclassoption
        } = this.state;
        return (
            <div>
                <Spin spinning={constructionPackageLoading}>
                    <Row>
                        <div>
                            <Row>
                                <Col span={16} className='ConstructionPackageTable-search-layout'>
                                    <div className='ConstructionPackageTable-mrg10'>
                                        <span className='ConstructionPackageTable-search-span'>标段：</span>
                                        <Select
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                            className='ConstructionPackageTable-forestcalcw4'
                                            defaultValue='全部'
                                            value={section}
                                            onChange={this.onSectionChange.bind(this)}
                                        >
                                            {sectionoption}
                                        </Select>
                                    </div>
                                    <div className='ConstructionPackageTable-mrg10'>
                                        <span className='ConstructionPackageTable-search-span'>区段：</span>
                                        <Select
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                            className='ConstructionPackageTable-forestcalcw4'
                                            defaultValue='全部'
                                            value={smallclass}
                                            onChange={this.onSmallClassChange.bind(this)}
                                        >
                                            {smallclassoption}
                                        </Select>
                                    </div>
                                    <div className='ConstructionPackageTable-mrg10'>
                                        <span className='ConstructionPackageTable-search-span'>组团：</span>
                                        <Select
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                            className='ConstructionPackageTable-forestcalcw4'
                                            defaultValue='全部'
                                            value={thinclass}
                                            onChange={this.onThinClassChange.bind(this)}
                                        >
                                            {thinclassoption}
                                        </Select>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className='ConstructionPackageTable-mrg10-button'>
                                        <Button
                                            type='primary'
                                            disabled={!section}
                                            onClick={this.handleAddThinClass.bind(this)}
                                            className='ConstructionPackageTable-search-button'>新增组团</Button>
                                    </div>
                                    {/* <div className='ConstructionPackageTable-mrg10-button'>
                                        <Button
                                            type='primary'
                                            style={{marginRight: 30}}
                                            onClick={this.handleAddSmallClassOK.bind(this)}
                                            className='ConstructionPackageTable-search-button'>新增区段</Button>
                                    </div> */}
                                    <div className='ConstructionPackageTable-mrg10-button'>
                                        <Button
                                            type='primary'
                                            style={{marginRight: 30}}
                                            onClick={this.query.bind(this)}
                                            className='ConstructionPackageTable-search-button'>查询</Button>
                                    </div>
                                </Col>

                            </Row>
                        </div>
                    </Row>
                    <Row>
                        <Table
                            bordered
                            className='foresttable'
                            columns={this.columns}
                            rowKey='ZZBM'
                            locale={{ emptyText: '无信息' }}
                            dataSource={tblData}
                            pagination
                        />
                    </Row>
                    {/* {
                        addSmallClassVisible
                            ? <AddSmallClassModal
                                {...this.props}
                                {...this.state}
                                handleAddSmallClassCancel={this.handleAddSmallClassCancel.bind(this)}
                            /> : ''
                    } */}
                    {
                        addThinClassVisible
                            ? <AddThinClassModal
                                {...this.props}
                                {...this.state}
                                handleAddThinClassOK={this.handleAddThinClassOK.bind(this)}
                                handleAddThinClassCancel={this.handleAddThinClassCancel.bind(this)}
                            /> : ''
                    }
                </Spin>
            </div>
        );
    }
}

import React, { Component } from 'react';
import {
    Icon,
    Table,
    Modal,
    Row,
    Col,
    Select,
    DatePicker,
    Button,
    Input,
    Progress,
    Spin,
    message
} from 'antd';
import moment from 'moment';
import { FOREST_API } from '_platform/api';
import { getForestImgUrl, getUserIsManager } from '_platform/auth';
import './index.less';
import {
    getSmallThinNameByPlaceData
} from '../auth';
import {
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import AddSmallClassModal from './AddSmallClassModal';
import AddThinClassModal from './AddThinClassModal';
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;

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
                title: '小班号',
                dataIndex: 'smallCalss',
                render: (text, record) => {
                    const {
                        smallCalssPackageList
                    } = this.props;
                    const {
                        smallclass
                    } = this.state;
                    let smallClassNo = '/';
                    smallCalssPackageList.map((smallClassData) => {
                        if (smallclass === smallClassData.No) {
                            smallClassNo = smallClassData.No;
                        }
                    });
                    return <span>{smallClassNo}</span>;
                }
            },
            {
                title: '细班号',
                dataIndex: 'No'
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <span>删除</span>;
                }
            }
        ];
    }
    componentDidMount () {
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || '',
            smallclass: '',
            thinclass: '',
            smallclassData: '',
            thinclassData: ''
        });
    }

    onSmallClassChange (value) {
        const { smallClassSelect } = this.props;
        try {
            smallClassSelect(value);
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

    onThinClassChange (value) {
        const { thinClassSelect } = this.props;
        try {
            thinClassSelect(value);
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
            smallCalssPackageList
        } = this.props;
        const {
            smallclass,
            thinclass
        } = this.state;
        console.log('query', smallclass);

        if (!smallclass) {
            message.info('请选择项目，标段，小班');
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
    handleAddThinClassOK = () => {
        this.setState({
            addThinClassVisible: true
        });
    }
    handleAddThinClassCancel = () => {
        this.setState({
            addThinClassVisible: false
        });
    }
    render () {
        const { tblData } = this.state;
        const {
            sectionoption,
            smallclassoption,
            thinclassoption,
            constructionPackageLoading = false
        } = this.props;
        const {
            section,
            smallclass,
            thinclass,
            addSmallClassVisible,
            addThinClassVisible
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
                                        <span className='ConstructionPackageTable-search-span'>小班：</span>
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
                                        <span className='ConstructionPackageTable-search-span'>细班：</span>
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
                                            onClick={this.handleAddThinClassOK.bind(this)}
                                            className='ConstructionPackageTable-search-button'>新增细班</Button>
                                    </div>
                                    {/* <div className='ConstructionPackageTable-mrg10-button'>
                                        <Button
                                            type='primary'
                                            style={{marginRight: 30}}
                                            onClick={this.handleAddSmallClassOK.bind(this)}
                                            className='ConstructionPackageTable-search-button'>新增小班</Button>
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
                    {
                        addSmallClassVisible
                            ? <AddSmallClassModal
                                {...this.props}
                                {...this.state}
                                handleAddSmallClassCancel={this.handleAddSmallClassCancel.bind(this)}
                            /> : ''
                    }
                    {
                        addThinClassVisible
                            ? <AddThinClassModal
                                {...this.props}
                                {...this.state}
                                handleAddThinClassCancel={this.handleAddThinClassCancel.bind(this)}
                            /> : ''
                    }
                </Spin>
            </div>
        );
    }
}

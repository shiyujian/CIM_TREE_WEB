import React, { Component } from 'react';
import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Modal,
    Button,
    Icon,
    message,
    Table,
    Spin,
    Select,
    DatePicker
} from 'antd';
import moment from 'moment';
import './AddDemandTable.less';
import { getUser } from '_platform/auth';
moment.locale('zh-cn');
const Option = Select.Option;
const { RangePicker } = DatePicker;
class AddDemandTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            projectName: '',
            sectionName: '',
            provinceName: '',
            cityName: '',
            areaName: '',
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            treeTypeData: []
        };
    }

    render () {
        const {
            projectName,
            sectionName,
            provinceName,
            cityName,
            areaName,
            treeTypeData
        } = this.state;
        return (
            <div>
                <Card title='填写信息'>
                    <div className='AddDemandTable-layout'>
                        <div className='AddDemandTable-message-layout'>
                            <span className='AddDemandTable-message-span'>项目名称：</span>
                            <Select
                                allowClear
                                className='AddDemandTable-message-component'
                                defaultValue='全部'
                                value={projectName}
                                onChange={this.handleProjectNameChange.bind(this)}
                            >
                                <Option key='九号地块' value='九号地块' title='九号地块'>九号地块</Option>
                            </Select>
                        </div>
                        <div className='AddDemandTable-message-layout'>
                            <span className='AddDemandTable-message-span'>标段选择：</span>
                            <Select
                                allowClear
                                className='AddDemandTable-message-component'
                                defaultValue='全部'
                                value={sectionName}
                                onChange={this.handleSectionNameChange.bind(this)}
                            >
                                <Option key='一标段' value='一标段' title='一标段'>一标段</Option>
                            </Select>
                        </div>
                        <div className='AddDemandTable-message-select-layout'>
                            <span className='AddDemandTable-message-span'>用苗地：</span>
                            <div className='AddDemandTable-message-component'>
                                <Select
                                    allowClear
                                    style={{width: '33%'}}
                                    value={provinceName}
                                    onChange={this.handleProvinceNameChange.bind(this)}
                                >
                                    <Option key='辽宁省' value='辽宁省' title='辽宁省'>辽宁省</Option>
                                </Select>
                                <Select
                                    allowClear
                                    style={{width: '33%'}}
                                    value={cityName}
                                    onChange={this.handleCityNameChange.bind(this)}
                                >
                                    <Option key='沈阳市' value='沈阳市' title='沈阳市'>沈阳市</Option>
                                </Select>
                                <Select
                                    allowClear
                                    style={{width: '33%'}}
                                    value={areaName}
                                    onChange={this.handleAreaNameChange.bind(this)}
                                >
                                    <Option key='和平区' value='和平区' title='和平区'>和平区</Option>
                                </Select>
                            </div>
                        </div>
                        <div className='AddDemandTable-message-layout'>
                            <span className='AddDemandTable-message-span'>联系人：</span>
                            <Input
                                className='AddDemandTable-message-component'
                                onChange={this.handleProjectNameChange.bind(this)}
                            />
                        </div>
                        <div className='AddDemandTable-message-layout'>
                            <span className='AddDemandTable-message-span'>联系电话：</span>
                            <Input
                                className='AddDemandTable-message-component'
                                onChange={this.handleProjectNameChange.bind(this)}
                            />
                        </div>
                        <div className='AddDemandTable-message-datePicker-layout'>
                            <span className='AddDemandTable-message-span6'>报价起止时间：</span>
                            <RangePicker
                                style={{ verticalAlign: 'middle' }}
                                defaultValue={[
                                    moment(
                                        this.state.stime,
                                        'YYYY-MM-DD HH:mm:ss'
                                    ),
                                    moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')
                                ]}
                                className='AddDemandTable-message-component6'
                                showTime={{ format: 'HH:mm:ss' }}
                                format={'YYYY/MM/DD HH:mm:ss'}
                                onChange={this.handleDateChange.bind(this)}
                            />
                        </div>
                    </div>
                    <Card title='树种/规格'>
                        <Button type='primary' onClick={this.handleAddTreeType.bind(this)} style={{marginBottom: 10}}>
                            新增树种
                        </Button>
                        {treeTypeData}
                    </Card>
                </Card>
                <div className='AddDemandTable-handleButton'>
                    <Button
                        type='primary'
                        onClick={this.save.bind(this)}
                        style={{marginRight: 36}}
                    >
                        暂存
                    </Button>
                    <Button
                        type='primary'
                        onClick={this.cancel.bind(this)}
                    >
                        取消
                    </Button>
                </div>

            </div>
        );
    }

    handleProjectNameChange = (value) => {
        this.state({
            projectName: value
        });
    }

    handleSectionNameChange = (value) => {
        this.state({
            sectionName: value
        });
    }

    handleDateChange = (value) => {
        this.setState({
            stime: value[0]
                ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
        this.setState({
            etime: value[1]
                ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
                : ''
        });
    }

    handleProvinceNameChange = (value) => {
        this.state({
            provinceName: value
        });
    }

    handleCityNameChange = (value) => {
        this.state({
            cityName: value
        });
    }

    handleAreaNameChange = (value) => {
        this.state({
            areaName: value
        });
    }

    handleAddTreeType = () => {
        const {
            treeTypeData,
            dataSource = []
        } = this.state;
        console.log('dataSource', dataSource);
        let len = treeTypeData.length;
        dataSource[len] = [
            {
                XJ: '',
                DJ: '',
                GF: '',
                height: '',
                cultivation: '',
                stock: ''
            }
        ];
        treeTypeData.push(
            <Card key={moment().unix().toString()} style={{marginBottom: 10}}>
                <div className='AddDemandTable-layout'>
                    <div className='AddDemandTable-message-layout'>
                        <span className='AddDemandTable-message-span'>树木类型：</span>
                        <Select
                            className='AddDemandTable-message-component'
                            onChange={this.handleTreeTypeChange.bind(this, len)}
                        />
                    </div>
                    <div className='AddDemandTable-message-layout'>
                        <span className='AddDemandTable-message-span'>树木名称：</span>
                        <Select
                            className='AddDemandTable-message-component'
                            onChange={this.handleTreeNameChange.bind(this, len)}
                        />
                    </div>
                </div>
                <Table
                    columns={this.columns}
                    dataSource={dataSource[len]}
                    bordered
                />
            </Card>
        );
        this.setState({
            treeTypeData,
            dataSource
        });
    }

    handleTreeTypeChange = (value, len) => {
        this.setState({

        });
    }

    handleTreeNameChange = (value, len) => {
        this.setState({

        });
    }

    columns = [
        {
            title: '胸径(cm)',
            dataIndex: 'XJ',
            render: (text, record, index) => {
                return <Input onChange={this.handleXJChange.bind(this, record)} />;
            }
        },
        {
            title: '地径(cm)',
            dataIndex: 'DJ',
            render: (text, record, index) => {
                return <Input onChange={this.handleDJChange.bind(this, record)} />;
            }
        },
        {
            title: '冠幅(cm)',
            dataIndex: 'GF',
            render: (text, record, index) => {
                return <Input onChange={this.handleGFChange.bind(this, record)} />;
            }
        },
        {
            title: '自然高(cm)',
            dataIndex: 'height',
            render: (text, record, index) => {
                return <Input onChange={this.handleHeightChange.bind(this, record)} />;
            }
        },
        {
            title: '培育方式',
            dataIndex: 'cultivation',
            render: (text, record, index) => {
                return <Input onChange={this.handleCultivationChange.bind(this, record)} />;
            }
        },
        {
            title: '库存(棵)',
            dataIndex: 'stock',
            render: (text, record, index) => {
                return <Input onChange={this.handleStockChange.bind(this, record)} />;
            }
        }
    ];

    handleXJChange (record, event) {
        record.XJ = event.target.value;
    }

    handleDJChange (record, event) {
        record.DJ = event.target.value;
    }

    handleGFChange (record, event) {
        record.GF = event.target.value;
    }

    handleHeightChange (record, event) {
        record.height = event.target.value;
    }

    handleCultivationChange (record, value) {
        record.cultivation = value;
    }

    handleStockChange (record, event) {
        record.stock = event.target.value;
    }

    cancel = () => {
        const {
            actions: {
                changeAddDemandModalVisible
            }
        } = this.props;
        changeAddDemandModalVisible(false);
    }

    save = () => {
        const {
            actions: {
                changeAddDemandModalVisible
            }
        } = this.props;
        changeAddDemandModalVisible(false);
    }
}
export default Form.create()(AddDemandTable);

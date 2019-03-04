import React, { Component } from 'react';
import { Input, Button, Select, Table, Pagination, Modal, Form, message, List, InputNumber, Spin } from 'antd';
import {
    fillAreaColor,
    getCoordsArr,
    handleCoordinates
} from '../auth';
import { formItemLayout, getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
window.config = window.config || {};

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目
            dataList: [],
            selectedRowKeysList: [], // 选中的细班列表
            sectionList: [], // 标段列表
            section: '', // 标段
            dataListHistory: [], // 历史数据列表
            dataListPlan: [], // 子表格数据
            expandedRowKeys: [], // 展开行
            treeTypeList: [], // 选择框选项
            showModal: false,
            showModalHistory: false,
            record: {}, // 历史数据记录
            recordData: {}, // 表格记录
            newRecordData: {}, // 新记录
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            number: '',
            areaLayerList: [], // 区域地块图层list
            spinning: true, // loading
            treetype: '', // 表单树种
            num: '', // 表单栽植量
            area: '' // 栽植面积
        };
        this.treeTypeList = []; // 所有树种类型
        this.dataList = []; // 暂存数据
        this.userSection = ''; // 用户所属标段
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.onEdit = this.onEdit.bind(this); // 编辑
        this.handleSection = this.handleSection.bind(this); // 标段
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.onHistory = this.onHistory.bind(this); // 历史导入数据
        this.handleOk = this.handleOk.bind(this); // 确认修改
        this.handleOkHistory = this.handleOkHistory.bind(this); // 历史数据
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.getItemList = this.getItemList.bind(this);
        this.handleTreeTypeForm = this.handleTreeTypeForm.bind(this); // 栽植类型修改
        this.handleNumberForm = this.handleNumberForm.bind(this); // 栽植量修改
        this.handleAreaForm = this.handleAreaForm.bind(this); // 栽植面积修改
        this.handleExpanded = this.handleExpanded.bind(this); // 展开子表格
        this.columns = [
            {
                key: '1',
                title: '序号',
                dataIndex: '',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    );
                }
            },
            {
                key: '2',
                title: '细班编号',
                dataIndex: 'no'
            },
            {
                key: '3',
                title: '树木类型',
                dataIndex: 'treetype'
            },
            {
                key: '4',
                title: '栽植量',
                dataIndex: 'num'
            },
            {
                key: '5',
                title: '细班面积',
                dataIndex: 'area'
            },
            {
                key: '6',
                title: '操作',
                dataIndex: 'action',
                render: (text, record, index) => {
                    return <a onClick={this.onEdit.bind(this, record)}>编辑</a>;
                }
            }
        ];
    }
    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    componentDidMount () {
        let userData = getUser();
        this.userSection = userData.sections.slice(2, -2);
        // 初始化地图
        this.initMap();
        // 获取历史数据
        this.getDataHistory();
        // 获取所有树种
        this.getTreeTypes();
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode) {
            console.log('nextProps', nextProps.sectionList);
            console.log('userSection', this.userSection);
            this.setState({
                section: '',
                number: '',
                leftkeycode: nextProps.leftkeycode,
                sectionList: nextProps.sectionList
            }, () => {
                // 获取表格数据
                this.onSearch(1);
            });
        }
    }
    getTreeTypes () {
        const { getTreeTypes } = this.props.actions;
        getTreeTypes().then(rep => {
            this.treeTypeList = rep;
            this.setState({
                treeTypeList: rep
            });
        });
    }
    initMap () {
        // 基础设置
        this.map = L.map('mapid', {
            zoom: 14,
            center: [39.04882729053497, 115.90790748596191],
            crs: L.CRS.EPSG4326,
            zoomControl: false
        });
        // 基础图层
        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 树木瓦片图层
        L.tileLayer(
            window.config.DASHBOARD_ONSITE + '/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}', {
                opacity: 1.0,
                subdomains: [1, 2, 3],
                minZoom: 11,
                maxZoom: 21,
                storagetype: 0,
                tiletype: 'wtms'
            }
        ).addTo(this.map);
    }
    getDataHistory () {
        const { getDataimports } = this.props.actions;
        getDataimports({}, {
            section: this.userSection,
            datatype: 'thinclass',
            stime: '',
            etime: '',
            page: 1,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    dataListHistory: rep.content
                });
            }
        });
    }
    render () {
        const { dataList, section, number, dataListHistory, total, page, expandedRowKeys, spinning, sectionList, recordData, treeTypeList, treetype, num, area, dataListPlan, selectedRowKeysList } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeysList: selectedRowKeys
                });
                this.onLocation(selectedRows);
            },
            selectedRowKeys: selectedRowKeysList
        };
        // 子表格
        let expandedRowRender = (record) => {
            let columns = [{
                title: '树木类型',
                key: '1',
                dataIndex: 'treeType',
                render: (text, rec, index) => {
                    let disabled = true;
                    if (index === 0) {
                        disabled = false;
                    }
                    return (
                        <Select showSearch filterOption={false} style={{width: 150}} value={text} disabled={disabled}
                            placeholder='请输入树木类型名称' onChange={this.handleTreeType.bind(this, index)}
                            onSearch={this.handleSearch.bind(this)}>
                            {
                                treeTypeList.length > 0 ? treeTypeList.map(item => {
                                    return <Option value={item.ID} key={item.ID}>{item.TreeTypeName}</Option>;
                                }) : []
                            }
                        </Select>
                    );
                }
            }, {
                title: '栽植量',
                key: '2',
                dataIndex: 'Num',
                render: (text, rec, index) => {
                    return (
                        <InputNumber min={1} max={record.num} value={text} onChange={this.handleNum.bind(this, index)} />
                    );
                }
            }, {
                title: '栽植面积',
                key: '3',
                dataIndex: 'Area',
                render: (text, rec, index) => {
                    return (
                        <InputNumber min={1} max={record.Area} value={text} onChange={this.handleArea.bind(this, index)} />
                    );
                }
            }, {
                title: '操作',
                key: '4',
                render: (text, rec, index) => {
                    if (index === 0) {
                        return <a onClick={this.onSavePlan.bind(this, rec)}>保存</a>;
                    } else {
                        return <span>
                            <a onClick={this.onUpdatePlan.bind(this, rec)}>更新</a>
                            <a onClick={this.onDeletePlan.bind(this, rec)} style={{marginLeft: 10}}>删除</a>
                        </span>;
                    }
                }
            }];
            return (
                <Table columns={columns} dataSource={dataListPlan} pagination={false} rowKey='ID' />
            );
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='标段'>
                            <Select style={{ width: 120 }} value={section} onChange={this.handleSection.bind(this)} allowClear>
                                {
                                    sectionList.map(item => {
                                        return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                    })
                                }
                            </Select>
                        </FormItem>
                        <FormItem label='细班编号'>
                            <Input style={{width: 200}} value={number} onChange={this.handleNumber.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onHistory.bind(this)} style={{marginLeft: 50}}>历史导入列表</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 650, minHeight: 640, float: 'left'}}>
                        <Spin spinning={spinning}>
                            <Table expandedRowRender={expandedRowRender} rowSelection={rowSelection}
                                columns={this.columns} dataSource={dataList} pagination={false} expandedRowKeys={expandedRowKeys}
                                onExpand={this.handleExpanded.bind(this)} />
                        </Spin>
                        <Pagination style={{float: 'right', marginTop: 10}} current={page} total={total} onChange={this.handlePage.bind(this)} showQuickJumper />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 670, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='历史导入列表'
                    visible={this.state.showModalHistory}
                    onOk={this.handleOkHistory}
                    onCancel={this.handleCancel}
                >
                    <List
                        header={<div>
                            <div style={{float: 'left', width: 150}}>标段</div>
                            <div style={{float: 'left', width: 220}}>入库时间</div>
                            <div>操作</div>
                        </div>}
                        bordered
                        dataSource={dataListHistory}
                        renderItem={this.getItemList.bind(this)}
                    />
                </Modal>
                <Modal
                    title='编辑'
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem label='细班编号' {...formItemLayout}>
                            <Input style={{width: 200}} value={recordData.no} disabled />
                        </FormItem>
                        <FormItem label='树木类型' {...formItemLayout}>
                            <Select showSearch filterOption={false} style={{width: 200}} value={treetype}
                                placeholder='请输入树木类型名称' onChange={this.handleTreeTypeForm.bind(this)}
                                onSearch={this.handleSearch.bind(this)}>
                                {
                                    treeTypeList.length > 0 ? treeTypeList.map(item => {
                                        return <Option value={item.ID} key={item.ID}>{item.TreeTypeName}</Option>;
                                    }) : []
                                }
                            </Select>
                        </FormItem>
                        <FormItem label='种植量' {...formItemLayout}>
                            <Input style={{width: 200}} value={num} onChange={this.handleNumberForm.bind(this)} />
                        </FormItem>
                        <FormItem label='细班面积' {...formItemLayout}>
                            <Input style={{width: 200}} defaultValue={area} onChange={this.handleAreaForm.bind(this)} />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    handleTreeTypeForm (value) {
        let treetype = '';
        this.state.treeTypeList.map(item => {
            if (item.ID === value) {
                treetype = item.TreeTypeName;
            };
        });
        this.setState({
            treeTypeList: this.treeTypeList,
            treetype: treetype
        });
    }
    handleNumberForm (e) {
        this.setState({
            num: e.target.value
        });
    }
    handleAreaForm (e) {
        this.setState({
            area: e.target.value
        });
    }
    onEdit (record) {
        this.setState({
            area: record.area,
            treetype: record.treetype,
            num: record.num,
            recordData: record,
            showModal: true
        });
    }
    handleOk () {
        const { newRecordData, recordData, treetype, num, area } = this.state;
        const { postThinclass } = this.props.actions;
        postThinclass({}, {
            Section: recordData.Section,
            no: recordData.no,
            treetype: treetype || recordData.treetype,
            area: area || recordData.area,
            num: parseInt(num) || recordData.num,
            coords: recordData.coords
        }).then(rep => {
            if (rep.code === 1) {
                message.success('数据更新成功');
                this.setState({
                    showModal: false
                }, () => {
                    this.onSearch();
                });
            }
        });
    }
    handleSection (value) {
        this.setState({
            section: value
        });
    }
    getItemList (item) {
        return (
            <List.Item actions={[<a onClick={this.deleteRecord.bind(this, item.ID)}>删除</a>]}>
                <div style={{width: 150}}>{item.Section}</div>
                <div>
                    {item.CreateTime}
                </div>
            </List.Item>
        );
    }
    handleExpanded (expanded, record) {
        if (!expanded) {
            this.setState({
                dataListPlan: [],
                expandedRowKeys: []
            });
            return;
        }
        let dataListPlan = [];
        let expandedRowKeys = [];
        dataListPlan.push({
            ID: record.key + '1',
            Num: '',
            Section: record.Section,
            no: record.no,
            treeType: '',
            Area: ''
        });
        const { getThinClassPlans } = this.props.actions;
        getThinClassPlans({}, {
            section: record.Section,
            thinclass: record.no,
            treetype: '',
            page: '',
            size: ''
        }).then(rep => {
            if (rep.code === 200) {
                rep.content.map(item => {
                    dataListPlan.push({
                        ID: item.ID,
                        Num: item.Num,
                        Section: item.Section,
                        no: item.ThinClass,
                        treeType: item.TreeType,
                        Area: item.Area
                    });
                });
                expandedRowKeys.push(record.key);
                this.setState({
                    dataListPlan,
                    expandedRowKeys
                });
            }
        });
    }
    onSavePlan (rec) {
        const { postThinClassPlans } = this.props.actions;
        postThinClassPlans({}, {
            ThinClass: rec.no,
            Section: rec.Section,
            TreeType: rec.treeType,
            Num: rec.Num,
            Area: rec.Area
        }).then(rep => {
            if (rep.code === 1) {
                message.success('细班栽植计划分项上报成功');
                this.onSearch(this.state.page);
                this.setState({
                    expandedRowKeys: [],
                    dataListPlan: []
                });
            }
        });
    }
    onUpdatePlan (rec) {
        const { putThinClassPlans } = this.props.actions;
        putThinClassPlans({}, {
            ID: rec.ID,
            Num: rec.Num,
            Area: rec.Area
        }).then(rep => {
            if (rep.code === 1) {
                message.success('细班栽植计划分项更新成功');
                this.onSearch(this.state.page);
                this.setState({
                    expandedRowKeys: [],
                    dataListPlan: []
                });
            }
        });
    }
    onDeletePlan (rec) {
        const { deleteThinClassPlans } = this.props.actions;
        deleteThinClassPlans({
            ID: rec.ID
        }).then(rep => {
            if (rep.code === 1) {
                message.success('细班栽植计划分项删除成功');
                this.onSearch(this.state.page);
                this.setState({
                    expandedRowKeys: [],
                    dataListPlan: []
                });
            }
        });
    }
    handleArea (index, value) {
        let { dataListPlan } = this.state;
        dataListPlan.map((item, ind) => {
            if (index === ind) {
                item.Area = value;
            }
        });
        this.setState({
            dataListPlan
        });
    }
    handleNum (index, value) {
        let { dataListPlan } = this.state;
        dataListPlan.map((item, ind) => {
            if (index === ind) {
                item.Num = value;
            }
        });
        this.setState({
            dataListPlan
        });
    }
    handleTreeType (index, value) {
        let { dataListPlan } = this.state;
        dataListPlan.map((item, ind) => {
            if (index === ind) {
                item.treeType = value;
            }
        });
        this.setState({
            treeTypeList: this.treeTypeList,
            dataListPlan
        });
    };
    handleSearch (value) {
        let treeTypeList = [];
        this.treeTypeList.map(item => {
            if (item.TreeTypeName.includes(value)) {
                treeTypeList.push(item);
            }
        });
        this.setState({
            treeTypeList
        });
    };
    onSearch (page = 1) {
        const { number, leftkeycode, section } = this.state;
        this.setState({
            spinning: true
        });
        let { getThinClass } = this.props.actions;
        getThinClass({}, {
            section: section || leftkeycode,
            no: number,
            treetype: '',
            page: page,
            size: 10
        }).then(rep => {
            rep.content.map((item, index) => {
                item.key = index;
            });
            if (rep.code === 200) {
                this.setState({
                    dataList: rep.content,
                    selectedRowKeysList: [],
                    total: rep.pageinfo && rep.pageinfo.total,
                    page: rep.pageinfo && rep.pageinfo.page,
                    spinning: false
                });
            }
        });
    }
    onHistory () {
        this.setState({
            showModalHistory: true
        });
    }
    deleteRecord (ID) {
        const { deleteDataimport } = this.props.actions;
        deleteDataimport({
            id: ID
        }, {}).then(rep => {
            if (rep.code === 1) {
                message.success('该次上传的数据已全部删除');
            }
            this.getDataHistory();
        });
    }
    handleOkHistory () {
        this.handleCancel();
    }
    handleCancel () {
        this.setState({
            showModal: false,
            showModalHistory: false
        });
    }
    onLocation (recordArr) {
        let { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 多维数据
        recordArr.map(record => {
            let coords = getCoordsArr(record.coords);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    coordinatesArr.push(treearea);
                }
            };
        });
        // 如果地块存在，则定位过去
        if (coordinatesArr.length !== 0) {
            let message = {
                key: 3,
                type: 'Feature',
                properties: {name: '', type: 'area'},
                geometry: { type: 'Polygon', coordinates: coordinatesArr }
            };
            let polygon = this._createMarker(message);
            // 放大该处视角
            this.map.fitBounds(polygon.getBounds());
            this.setState({
                areaLayerList: [ polygon ]
            });
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let polygon = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return polygon;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    handleNumber (e) {
        this.setState({
            number: e.target.value
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    handlePage (page, pageSize = 10) {
        this.onSearch(page);
    }
}

export default Form.create()(Tablelevel);

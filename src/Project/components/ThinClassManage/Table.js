import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message, List, InputNumber } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr,
    handleCoordinates
} from '../auth';
const FormItem = Form.Item;
const Option = Select.Option;
window.config = window.config || {};

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            dataListHistory: [], // 历史数据列表
            dataListPlan: [], // 子表格数据
            treeType: [], // 选择框选项
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            number: '',
            areaLayerList: [] // 区域地块图层list
        };
        this.treeType = []; // 所有树种类型
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.onHistory = this.onHistory.bind(this); // 历史导入数据
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePage = this.handlePage.bind(this);
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
                title: '细班面积',
                dataIndex: 'area'
            },
            {
                key: '5',
                title: '栽植量',
                dataIndex: 'num'
            }
        ];
    }
    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    componentDidMount () {
        // 初始化地图
        this.initMap();
        // 获取表格数据
        this.onSearch();
        // 获取历史数据
        this.getDataHistory();
        this.getTreeTypes();
        this.getThinClassPlans();
    }
    getTreeTypes () {
        const { getTreeTypes } = this.props.actions;
        getTreeTypes().then(rep => {
            console.log(rep);
            this.treeType = rep;
            this.setState({
                treeType: rep
            });
        });
    }
    getThinClassPlans () {
        const { getThinClassPlans } = this.props.actions;
        getThinClassPlans({}, {
            section: 'P018-01-06',
            thinclass: 'P018-01-534-001',
            treetype: '',
            page: '',
            size: ''
        }).then(rep => {
            if (rep.code) {
                console.log(rep.content);
            }
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
            section: '',
            datatype: 'thinclass',
            stime: '',
            etime: '',
            page: 1,
            size: 10
        }).then(rep => {
            console.log(rep);
            if (rep.code === 200) {
                this.setState({
                    dataListHistory: rep.content
                });
            }
        });
    }
    render () {
        const { dataList, dataListHistory, total, page } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.onLocation(selectedRows);
            }
        };
        // 子表格
        let expandedRowRender = (record) => {
            console.log('渲染了');
            console.log('record', record);
            let { dataListPlan } = this.state;
            console.log('dataListPlan', dataListPlan);
            dataListPlan.push({
                ID: record.ID,
                Num: record.Num,
                Section: record.Section,
                no: record.no,
                treeType: record.treeType
            });
            const columns = [{
                title: '树木类型',
                key: '1',
                render: (text, rec) => {
                    return (
                        <Select showSearch filterOption={false} style={{width: 200}}
                            placeholder='请输入树木类型名称' onChange={this.handleTreeType.bind(this, dataListPlan)}
                            onSearch={this.handleSearch.bind(this)}>
                            {
                                this.state.treeType.length > 0 ? this.state.treeType.map(item => {
                                    return <Option value={item.ID}>{item.TreeTypeName}</Option>;
                                }) : []
                            }
                        </Select>
                    );
                }
            }, {
                title: '栽植量',
                key: '2',
                render: (text, rec) => {
                    return (
                        <InputNumber min={1} max={record.num} onChange={this.handleNum.bind(this, dataListPlan)} />
                    );
                }
            }, {
                title: '操作',
                key: '3',
                render: (text, rec) => {
                    return (
                        <a onClick={this.onSavePlan.bind(this, rec)}>保存</a>
                    );
                }
            }];
            return (
                <Table columns={columns} dataSource={this.state.dataListPlan} pagination={false} rowKey='ID' />
            );
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='细班编号'>
                            <Input style={{width: 200}} onChange={this.handleNumber.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onHistory.bind(this)} style={{marginLeft: 50}}>历史数据</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 640, float: 'left'}}>
                        <Table expandedRowRender={expandedRowRender} rowSelection={rowSelection} columns={this.columns} dataSource={dataList} pagination={false} rowKey='ID' />
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='历史列表'
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <List
                        bordered
                        dataSource={dataListHistory}
                        renderItem={item => {
                            return (
                                <List.Item actions={[<a onClick={this.deleteRecord.bind(this, item.ID)}>删除</a>]}>
                                    <div>{item.DataType}</div>
                                    <div style={{marginLeft: 20}}>
                                        {item.CreateTime}
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </Modal>
            </div>
        );
    }
    onSavePlan (rec) {
        console.log(rec);
        const { postThinClassPlans } = this.props.actions;
        postThinClassPlans({}, {
            ThinClass: rec.no,
            Section: rec.Section,
            TreeType: rec.treeType,
            Num: rec.Num
        }).then(rep => {
            if (rep.code === 1) {
                message.success('细班栽植计划分项上报成功');
                this.onSearch();
            }
        });
    }
    handleNum (dataListPlan, value) {
        dataListPlan.map(item => {
            item.Num = value;
        });
        this.setState({
            dataListPlan
        });
    }
    handleTreeType (dataListPlan, value) {
        dataListPlan.map(item => {
            item.treeType = value;
        });
        this.setState({
            dataListPlan
        });
    };
    handleSearch (value) {
        let treeType = [];
        console.log(this.treeType);
        this.treeType.map(item => {
            if (item.TreeTypeName.includes(value)) {
                treeType.push(item);
            }
        });
        console.log('treeType', treeType);
        this.setState({
            treeType
        });
    };
    onSearch (page = 1) {
        const { number } = this.state;
        let { getThinClass } = this.props.actions;
        getThinClass({}, {
            no: number,
            treetype: '',
            page: page,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    dataList: rep.content,
                    total: rep.pageinfo && rep.pageinfo.total,
                    page: rep.pageinfo && rep.pageinfo.page
                });
            }
        });
    }
    onHistory () {
        this.setState({
            showModal: true
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
    handleOk () {
        this.handleCancel();
    }
    handleCancel () {
        this.setState({
            showModal: false
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
                    console.log('treearea', treearea);
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

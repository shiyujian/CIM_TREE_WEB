import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message, List } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr,
    handleCoordinates
} from '../auth';
const FormItem = Form.Item;
window.config = window.config || {};
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 地块列表
            dataListHistory: [], // 历史数据列表
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            section: '',
            areaLayerList: [] // 区域地块图层list
        };
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询地块
        this.handleSection = this.handleSection.bind(this); // 所属标段
        this.onHistory = this.onHistory.bind(this); // 历史导入数据
        this.handlePage = this.handlePage.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getItemList = this.getItemList.bind(this);

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
                title: '标段',
                dataIndex: 'Section'
            },
            {
                key: '6',
                title: '操作',
                dataIndex: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        </div>
                    );
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
        // 初始化地图
        this.initMap();
        // 获取历史数据
        this.getDataHistory();
        // 获取所有地块
        this.onSearch(1);
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
            datatype: 'land',
            stime: '',
            etime: '',
            page: 1,
            size: 10
        }).then(rep => {
            console.log('历史数据', rep.content);
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
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='所属标段'>
                            <Input style={{width: 200}} onChange={this.handleSection.bind(this)} />
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
                    <div style={{width: 600, height: 640, float: 'left', overflow: 'hidden'}}>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={dataList} pagination={false} />
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
                        renderItem={this.getItemList.bind(this)}
                    />
                </Modal>
            </div>
        );
    }
    getItemList (item) {
        return (
            <List.Item actions={[<a onClick={this.deleteRecord.bind(this, item.ID)}>删除</a>]}>
                <div>{item.Section}</div>
                <div style={{marginLeft: 20}}>{item.CreateTime}</div>
                <div style={{marginLeft: 20}}>{item.DataType === 'land' ? '地块' : ''}</div>
            </List.Item>
        );
    }
    onLocation (selectedRows) {
        const { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 多维数据
        selectedRows.map(item => {
            let coordsArr = getCoordsArr(item.coords);
            console.log(coordsArr, 'coordsArr');
            let treearea = [];
            coordsArr.map(item => {
                let arr = item.split(' ');
                treearea.push([arr[1], arr[0]]);
            });
            coordinatesArr.push(treearea);
        });
        console.log(coordinatesArr, 'coordinatesArr');
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
    deleteRecord (ID) {
        const { deleteDataimport } = this.props.actions;
        deleteDataimport({
            id: ID
        }, {}).then(rep => {
            console.log(rep);
            this.getDataHistory();
        });
    }
    onSearch (page) {
        console.log('获取列表');
        const { section } = this.state;
        const { getLands } = this.props.actions;
        getLands({}, {
            section,
            page,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                rep.content.map((item, index) => {
                    item.key = index;
                    this.dataList.push({
                        Section: item.Section,
                        coords: item.coords,
                        key: index
                    });
                });
                console.log(this.dataList.slice(0, 10));
                page = page - 1;
                this.setState({
                    dataList: this.dataList.slice(page * 10, page * 10 + 10),
                    total: rep.pageinfo && rep.pageinfo.total,
                    size: rep.pageinfo && rep.pageinfo.size
                });
            }
        });
    }
    onHistory () {
        this.setState({
            showModal: true
        });
    }
    handleSection (e) {
        this.setState({
            section: e.target.value
        });
    }
    handlePage (page) {
        this.onSearch(page);
    }
    onEdit () {

    }
    handleOk () {
        this.handleCancel();
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
}

export default Form.create()(Tablelevel);

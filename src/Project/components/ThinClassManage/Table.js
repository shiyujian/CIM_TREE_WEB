import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message } from 'antd';
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
            dataList: [],
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            number: '',
            areaLayerList: [] // 区域地块图层list
        };
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
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
        this.initMap();
        this.onSearch();
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
    render () {
        const { dataList, total, page } = this.state;
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
                        <FormItem label='细班编号'>
                            <Input style={{width: 200}} onChange={this.handleNumber.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 640, float: 'left', overflow: 'hidden'}}>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={dataList} pagination={false} rowKey='ID' />
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
            </div>
        );
    }
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
    onLocation (recordArr) {
        let { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        recordArr.map(record => {
            let coords = getCoordsArr(record.coords);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: {name: '', type: 'area'},
                        geometry: { type: 'Polygon', coordinates: treearea }
                    };
                    let layer = this._createMarker(message);
                    // 放大该处视角
                    this.map.fitBounds(layer.getBounds());
                    areaLayerList.push(layer);
                }
            };
        });
        this.setState({
            areaLayerList
        });
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
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
    onEdit (record, e) {
        e.preventDefault();
        this.setState({
            showModal: true,
            record
        });
    }
    handlePage (page, pageSize = 10) {
        this.onSearch(page);
    }
}

export default Form.create()(Tablelevel);

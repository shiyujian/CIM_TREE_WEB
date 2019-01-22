import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr,
    getPolygonByCoordArr
} from '../auth';
const FormItem = Form.Item;
window.config = window.config || {};
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            newDataList: [],
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            section: '',
            confirmLoading: false,
            areaLayerList: [] // 区域地块图层list
        };
        this.dataList = []; // 暂存数据
        this.newDataList = [];
        this.onSearch = this.onSearch.bind(this); // 查询地块
        this.handleSection = this.handleSection.bind(this); // 地块编号
        this.handlePage = this.handlePage.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onPutStorage = this.onPutStorage.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);

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
        const { dataList, newDataList, confirmLoading, total, page } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.onLocation(selectedRows);
            }
        };
        const propsUpload = {
            name: 'file',
            action: '',
            beforeUpload: (file, fileList) => {
                console.log(file);
                this.setState({
                    fileList
                });
                return false;
            }
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='地块编号'>
                            <Input style={{width: 200}} onChange={this.handleSection.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            {
                                this.state.indexBtn === 1 ? <Button type='primary' onClick={this.onAdd.bind(this)} style={{marginLeft: 50}}>上传地块</Button> : <Button type='primary' onClick={this.onPutStorage.bind(this)} style={{marginLeft: 50}}>地块入库</Button>
                            }
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 640, float: 'left', overflow: 'hidden'}}>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={newDataList.length === 0 ? dataList : newDataList} pagination={false} />
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='新增地块'
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='上传文件'
                        >
                            <div>
                                <div>请上传 .zip文件</div>
                                <Upload {...propsUpload}>
                                    <Button>
                                        <Icon type='upload' /> Click to Upload
                                    </Button>
                                </Upload>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    onLocation (recordArr) {
        const { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 多维数据
        recordArr.map(item => {
            let treearea = [];
            if (item.Geom) {
                let coordsArr = getCoordsArr(item.Geom);
                coordsArr.map(item => {
                    let arr = item.split(' ');
                    treearea.push([
                        arr[1],
                        arr[0]
                    ]);
                });
            }
            coordinatesArr.push(treearea);
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
    onSearch () {
        const { section } = this.state;
        console.log(section);
        console.log(this.dataList);
        if (!section) {
            this.setState({
                newDataList: []
            });
            return;
        }
        this.dataList.map(item => {
            if (section === item.Section) {
                this.newDataList.push(item);
            }
        });
        console.log(this.newDataList);

        this.setState({
            newDataList: this.newDataList
        });
    }
    handleSection (e) {
        this.setState({
            section: e.target.value
        });
    }
    handlePage (page) {
        console.log(page, 'page');
        page = page - 1;
        this.setState({
            dataList: this.dataList.slice(page * 10, page * 10 + 10)
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    onPutStorage () {
        console.log('dataList', this.dataList);
        let pro = [];
        this.dataList.map(item => {
            let coordsArr = getCoordsArr(item.Geom);
            coordsArr = coordsArr.map(item => {
                let arr = item.split(' ');
                item = arr[0] + ' ' + arr[1];
                return item;
            });
            let polygon = getPolygonByCoordArr(coordsArr);
            pro.push({
                Section: item.Section,
                coords: polygon
            });
        });
        const { importThinClass } = this.props.actions;
        console.log('pro', pro);
        importThinClass({}, pro).then(rep => {
            if (rep.code === 1) {
                message.success('地块数据入库成功');
            }
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
    handleOk () {
        const { fileList } = this.state;
        const formdata = new FormData();
        formdata.append('file', fileList[0]);
        const { shapeUploadHandler } = this.props.actions;
        this.setState({
            confirmLoading: true
        });
        shapeUploadHandler({
            name: fileList[0].name.split('.')[0]
        }, formdata).then(rep => {
            rep = JSON.parse(rep);
            rep.features.map((item, index) => {
                item.key = index;
            });
            this.dataList = rep.features;
            this.setState({
                confirmLoading: false,
                indexBtn: 0,
                page: 1,
                total: this.dataList.length,
                dataList: this.dataList.slice(0, 10)
            }, () => {
                // 隐藏弹框
                this.handleCancel();
            });
        });
    }
    onEdit () {
        
    }
}

export default Form.create()(Tablelevel);
